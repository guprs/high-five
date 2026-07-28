import { Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import prisma from '../prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';

const setPinSchema = z.object({
    pin: z.string().min(4, 'PIN must have at least 4 digits.').max(8, 'PIN must have at most 8 digits.'),
});

function buildInviteCode(familyId: string) {
    return familyId.replace(/-/g, '').slice(0, 8).toUpperCase();
}

export async function setFamilyPin(req: AuthRequest, res: Response) {
    const parsed = setPinSchema.safeParse(req.body);

    if (!parsed.success) {
    return res.status(400).json({
        message: 'Please check your input.',
        errors: parsed.error.flatten().fieldErrors,
    });
    }

    const { pin } = parsed.data;
    const pinHash = await bcrypt.hash(pin, 10);

    await prisma.family.update({
        where: { id: req.familyId },
        data: { pinHash },
    });

    return res.json({ message: 'PIN updated successfully.' });
}

const verifyPinSchema = z.object({
    pin: z.string(),
});

export async function verifyFamilyPin(req: AuthRequest, res: Response) {
    const parsed = verifyPinSchema.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).json({
        message: 'Please check your input.',
        errors: parsed.error.flatten().fieldErrors,
    });
    }

    const { pin } = parsed.data;

    const family = await prisma.family.findUnique({ where: { id: req.familyId } });

    if (!family || !family.pinHash) {
        return res.status(400).json({ message: 'No PIN has been set for this family yet.' });
    }

    const pinMatches = await bcrypt.compare(pin, family.pinHash);

    if (!pinMatches) {
        return res.status(401).json({ message: 'Incorrect PIN.' });
    }

    return res.json({ valid: true });
}

export async function getFamilyInviteCode(req: AuthRequest, res: Response) {
    if (!req.familyId) {
        return res.status(401).json({ message: 'Not authenticated.' });
    }

    const family = await prisma.family.findUnique({ where: { id: req.familyId } });

    if (!family) {
        return res.status(404).json({ message: 'Family not found.' });
    }

    return res.json({
        inviteCode: buildInviteCode(family.id),
        familyName: family.name,
    });
}

const joinFamilySchema = z.object({
    inviteCode: z.string().trim().min(4, 'Please enter a valid family code.'),
});

export async function joinFamily(req: AuthRequest, res: Response) {
    const parsed = joinFamilySchema.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).json({
            message: 'Please check your input.',
            errors: parsed.error.flatten().fieldErrors,
        });
    }

    const { inviteCode } = parsed.data;
    const normalizedCode = inviteCode.replace(/-/g, '').toUpperCase();

    const families = await prisma.family.findMany();
    const family = families.find((item) => buildInviteCode(item.id) === normalizedCode);

    if (!family) {
        return res.status(404).json({ message: 'Family code not found.' });
    }

    const user = await prisma.user.update({
        where: { id: req.userId },
        data: { familyId: family.id },
    });

    const token = jwt.sign(
        {
            userId: user.id,
            familyId: family.id,
        },
        process.env.JWT_SECRET as string,
        { expiresIn: '7d' },
    );

    return res.json({
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
        },
        family: {
            id: family.id,
            name: family.name,
        },
        token,
    });
}