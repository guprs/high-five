import { Response } from 'express';
import { z } from 'zod';
import prisma from '../prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';

const rewardSchema = z.object({
    title: z.string().min(1, 'Title is required.'),
    cost: z.number().int().positive('Cost must be a positive number.'),
    icon: z.string().optional(),
});

export async function createReward(req: AuthRequest, res: Response) {
    try {
        const parsed = rewardSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({
                message: 'Please check your input.',
                errors: parsed.error.flatten().fieldErrors,
            });
        }

        const reward = await prisma.reward.create({
            data: {
                ...parsed.data,
                familyId: req.familyId as string,
            },
        });

        return res.status(201).json({ reward });
    } catch (error) {
        console.error('CREATE REWARD ERROR:', error);
        return res.status(500).json({ message: 'Could not create reward.' });
    }
}

export async function getRewards(req: AuthRequest, res: Response) {
    try {
        const rewards = await prisma.reward.findMany({
            where: { familyId: req.familyId },
            orderBy: { createdAt: 'asc' },
        });

        return res.json({ rewards });
    } catch (error) {
        console.error('GET REWARDS ERROR:', error);
        return res.status(500).json({ message: 'Could not load rewards.' });
    }
}

export async function getRewardById(req: AuthRequest, res: Response) {
    try {
        const id = req.params.id as string;

        const reward = await prisma.reward.findFirst({
            where: { id, familyId: req.familyId },
        });

        if (!reward) {
            return res.status(404).json({ message: 'Reward not found.' });
        }

        return res.json({ reward });
    } catch (error) {
        console.error('GET REWARD BY ID ERROR:', error);
        return res.status(500).json({ message: 'Could not load reward.' });
    }
}

export async function updateReward(req: AuthRequest, res: Response) {
    try {
        const id = req.params.id as string;
        const parsed = rewardSchema.partial().safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({
                message: 'Please check your input.',
                errors: parsed.error.flatten().fieldErrors,
        });
        }

        const existing = await prisma.reward.findFirst({
            where: { id, familyId: req.familyId },
        });

        if (!existing) {
            return res.status(404).json({ message: 'Reward not found.' });
        }

        const reward = await prisma.reward.update({
            where: { id },
            data: parsed.data,
        });

        return res.json({ reward });
        } catch (error) {
        console.error('UPDATE REWARD ERROR:', error);
        return res.status(500).json({ message: 'Could not update reward.' });
    }
}

export async function deleteReward(req: AuthRequest, res: Response) {
    try {
        const id = req.params.id as string;

        const existing = await prisma.reward.findFirst({
            where: { id, familyId: req.familyId },
        });

        if (!existing) {
            return res.status(404).json({ message: 'Reward not found.' });
        }

        await prisma.reward.delete({ where: { id } });

        return res.json({ message: 'Reward deleted successfully.' });
    } catch (error) {
            console.error('DELETE REWARD ERROR:', error);
            return res.status(500).json({ message: 'Could not delete reward.' });
        }
}