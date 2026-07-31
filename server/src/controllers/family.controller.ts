import { Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import prisma from '../prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';
import crypto from 'crypto';

const setPinSchema = z.object({
    pin: z.string().min(4, 'PIN must have at least 4 digits.').max(8, 'PIN must have at most 8 digits.'),
});
const verifyPinSchema = z.object({ pin: z.string() });
const joinFamilySchema = z.object({ inviteCode: z.string().trim().uuid('Please enter a valid family code.') });

export async function setFamilyPin(req: AuthRequest, res: Response) {
    const parsed = setPinSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: 'Please check your input.', errors: parsed.error.flatten().fieldErrors });

    await prisma.family.update({ where: { id: req.familyId }, data: { pinHash: await bcrypt.hash(parsed.data.pin, 10) } });
    return res.json({ message: 'PIN updated successfully.' });
}

export async function verifyFamilyPin(req: AuthRequest, res: Response) {
    const parsed = verifyPinSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: 'Please check your input.', errors: parsed.error.flatten().fieldErrors });

    const family = await prisma.family.findUnique({ where: { id: req.familyId } });
    if (!family?.pinHash) return res.status(400).json({ message: 'No PIN has been set for this family yet.' });
    if (!(await bcrypt.compare(parsed.data.pin, family.pinHash))) return res.status(401).json({ message: 'Incorrect PIN.' });

    return res.json({ valid: true });
}

export async function getFamilyInviteCode(req: AuthRequest, res: Response) {
    if (!req.familyId) return res.status(401).json({ message: 'Not authenticated.' });

    const family = await prisma.family.findUnique({
        where: { id: req.familyId },
        select: { inviteCode: true, name: true },
    });

    if (!family) return res.status(404).json({ message: 'Family not found.' });

    return res.json({ inviteCode: family.inviteCode, familyName: family.name });
}

export async function getFamilyMembers(req: AuthRequest, res: Response) {
    if (!req.familyId) {
        return res.status(401).json({ message: 'Not authenticated.' });
    }

    try {
        const members = await prisma.user.findMany({
            where: { familyId: req.familyId },
            select: {
                id: true,
                name: true,
                email: true,
            },
            orderBy: { createdAt: 'asc' },
        });

        return res.json({ members });
    } catch (error) {
        console.error('GET FAMILY MEMBERS ERROR:', error);
        return res.status(500).json({
            message: 'Could not load family members.',
        });
    }
}

export async function joinFamily(req: AuthRequest, res: Response) {
    const parsed = joinFamilySchema.safeParse(req.body);

    if (!parsed.success) {
    return res.status(400).json({
        message: 'Please check your input.',
        errors: parsed.error.flatten().fieldErrors,
        });
    }

    const family = await prisma.family.findUnique({
        where: { inviteCode: parsed.data.inviteCode },
        select: { id: true, name: true },
    });

    if (!family) return res.status(404).json({ message: 'Family code not found.' });

    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) return res.status(404).json({ message: 'User not found.' });

    if (user.familyId === family.id) {
        return res.json({ message: 'You are already part of this family.', family });
    }

    const previousFamilyId = user.familyId;

    const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: { familyId: family.id },
    });

    await prisma.family.update({
        where: { id: family.id },
        data: { inviteCode: crypto.randomUUID() },
    });

    const remainingUsers = await prisma.user.count({ where: { familyId: previousFamilyId } });

    if (remainingUsers === 0) {
        const [childCount, taskCount, rewardCount] = await Promise.all([
        prisma.child.count({ where: { familyId: previousFamilyId } }),
        prisma.task.count({ where: { familyId: previousFamilyId } }),
        prisma.reward.count({ where: { familyId: previousFamilyId } }),
        ]);

        if (childCount === 0 && taskCount === 0 && rewardCount === 0) {
            await prisma.family.delete({ where: { id: previousFamilyId } });
        }
    }

    const token = jwt.sign(
        { userId: updatedUser.id, familyId: family.id },
        process.env.JWT_SECRET as string,
        { expiresIn: '7d' }
    );

    return res.json({
        message: 'Joined family successfully.',
        token,
        user: {
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
        },
        family,
    });
}

const leaveFamilySchema = z.object({
    newFamilyName: z.string().min(2).optional(),
});

export async function leaveFamily(req: AuthRequest, res: Response) {
    try {
        const parsed = leaveFamilySchema.safeParse(req.body);

        if (!parsed.success) {
        return res.status(400).json({
            message: 'Please check your input.',
            errors: parsed.error.flatten().fieldErrors,
        });
        }

        const user = await prisma.user.findUnique({ where: { id: req.userId } });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const previousFamilyId = user.familyId;
        const newFamilyName = parsed.data.newFamilyName || `${user.name}'s Family`;

        const newFamily = await prisma.family.create({
            data: { name: newFamilyName },
        });

        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: { familyId: newFamily.id },
        });

        const remainingUsers = await prisma.user.count({ where: { familyId: previousFamilyId } });

        if (remainingUsers === 0) {
            const [childCount, taskCount, rewardCount] = await Promise.all([
                prisma.child.count({ where: { familyId: previousFamilyId } }),
                prisma.task.count({ where: { familyId: previousFamilyId } }),
                prisma.reward.count({ where: { familyId: previousFamilyId } }),
        ]);

        if (childCount === 0 && taskCount === 0 && rewardCount === 0) {
            await prisma.family.delete({ where: { id: previousFamilyId } });
        }
        }

        const token = jwt.sign(
            { userId: updatedUser.id, familyId: newFamily.id },
            process.env.JWT_SECRET as string,
            { expiresIn: '7d' }
        );

        return res.json({
            message: 'Left family successfully.',
            token,
            family: newFamily,
        });
    } catch (error) {
        console.error('LEAVE FAMILY ERROR:', error);
        return res.status(500).json({ message: 'Could not leave family.' });
    }
}