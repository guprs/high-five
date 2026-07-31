import { Response } from 'express';
import prisma from '../prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';

export async function getChildBadges(req: AuthRequest, res: Response) {
    try {
        const childId = req.params.childId as string;

        const child = await prisma.child.findFirst({
            where: { id: childId, familyId: req.familyId },
        });

        if (!child) {
            return res.status(404).json({ message: 'Child not found.' });
        }

        const badges = await prisma.badge.findMany({
            where: { childId },
            orderBy: { earnedAt: 'asc' },
        });

        return res.json({ badges });
    } catch (error) {
        console.error('GET CHILD BADGES ERROR:', error);
        return res.status(500).json({ message: 'Could not load badges.' });
    }
}