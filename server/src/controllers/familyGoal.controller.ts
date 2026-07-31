import { Response } from 'express';
import { z } from 'zod';
import prisma from '../prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';

const createGoalSchema = z.object({
    title: z.string().min(1, 'Title is required.'),
    targetXp: z.number().int().positive('Target XP must be a positive number.'),
    deadline: z.string().datetime().nullable().optional(),
});

async function getCurrentXpProgress(familyId: string, createdAt: Date): Promise<number> {
    const children = await prisma.child.findMany({
        where: { familyId },
        select: { id: true },
    });
    const childIds = children.map((c) => c.id);

    const history = await prisma.xPHistory.findMany({
        where: {
            childId: { in: childIds },
            createdAt: { gte: createdAt },
        },
    });

    return history.reduce((sum, entry) => sum + entry.amount, 0);
}

export async function createFamilyGoal(req: AuthRequest, res: Response) {
    try {
        const parsed = createGoalSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({
                message: 'Please check your input.',
                errors: parsed.error.flatten().fieldErrors,
            });
        }

        const goal = await prisma.familyGoal.create({
            data: {
                title: parsed.data.title,
                targetXp: parsed.data.targetXp,
                deadline: parsed.data.deadline ? new Date(parsed.data.deadline) : null,
                familyId: req.familyId as string,
            },
        });

        return res.status(201).json({ goal, currentXp: 0 });
    } catch (error) {
        console.error('CREATE FAMILY GOAL ERROR:', error);
        return res.status(500).json({ message: 'Could not create family goal.' });
    }
}

export async function getFamilyGoals(req: AuthRequest, res: Response) {
    try {
        const goals = await prisma.familyGoal.findMany({
            where: { familyId: req.familyId },
            orderBy: { createdAt: 'desc' },
        });

        const goalsWithProgress = await Promise.all(
            goals.map(async (goal) => {
                const currentXp = await getCurrentXpProgress(goal.familyId, goal.createdAt);

                if (!goal.completed && currentXp >= goal.targetXp) {
                    await prisma.familyGoal.update({
                        where: { id: goal.id },
                        data: { completed: true, completedAt: new Date() },
                    });
                    return { ...goal, completed: true, completedAt: new Date(), currentXp };
                }
            return { ...goal, currentXp };
        })
    );

    return res.json({ goals: goalsWithProgress });
    } catch (error) {
        console.error('GET FAMILY GOALS ERROR:', error);
        return res.status(500).json({ message: 'Could not load family goals.' });
    }
}

export async function deleteFamilyGoal(req: AuthRequest, res: Response) {
    try {
        const id = req.params.id as string;

        const existing = await prisma.familyGoal.findFirst({
            where: { id, familyId: req.familyId },
            });

        if (!existing) {
            return res.status(404).json({ message: 'Family goal not found.' });
        }

        await prisma.familyGoal.delete({ where: { id } });

        return res.json({ message: 'Family goal deleted successfully.' });
    } catch (error) {
        console.error('DELETE FAMILY GOAL ERROR:', error);
        return res.status(500).json({ message: 'Could not delete family goal.' });
    }
}