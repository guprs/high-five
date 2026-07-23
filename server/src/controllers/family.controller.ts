import { Response } from 'express';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import prisma from '../prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';

const setPinSchema = z.object({
    pin: z.string().min(4, 'PIN must have at least 4 digits.').max(8, 'PIN must have at most 8 digits.'),
});

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