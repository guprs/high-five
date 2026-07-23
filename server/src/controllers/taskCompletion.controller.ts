import { Response } from 'express';
import { z } from 'zod';
import prisma from '../prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';
import { recalculateStreak } from '../utils/streak';
import { calculateLevel } from '../utils/level';

function startOfDay(date: Date): Date {
    const d = new Date(date);
    d.setUTCHours(0, 0, 0, 0);
    return d;
}

const completeSchema = z.object({
    childId: z.string().uuid(),
    taskId: z.string().uuid(),
});

export async function completeTask(req: AuthRequest, res: Response) {
    const parsed = completeSchema.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).json({
        message: 'Please check your input.',
        errors: parsed.error.flatten().fieldErrors,
        });
    }

    const { childId, taskId } = parsed.data;
    const today = startOfDay(new Date());

    const child = await prisma.child.findFirst({
        where: { id: childId, familyId: req.familyId },
    });
    const childTask = await prisma.childTask.findUnique({
        where: { childId_taskId: { childId, taskId } },
        include: { task: true },
    });

    if (!child || !childTask) {
        return res.status(404).json({ message: 'Task is not assigned to this child.' });
    }

    const existing = await prisma.taskCompletion.findUnique({
        where: { childId_taskId_date: { childId, taskId, date: today } },
    });

    if (existing) {
        return res.status(409).json({ message: 'Task already completed today.' });
    }

    const completion = await prisma.taskCompletion.create({
        data: { childId, taskId, date: today },
    });

    const pointsAwarded = childTask.task.points;

    const updatedChild = await prisma.child.update({
        where: { id: childId },
        data: {
        xp: { increment: pointsAwarded },
        coins: { increment: Math.floor(pointsAwarded / 2) },
        },
    });

    const newLevel = calculateLevel(updatedChild.xp);

    if (newLevel !== updatedChild.level) {
        await prisma.child.update({
        where: { id: childId },
        data: { level: newLevel },
        });
    }

    await prisma.xPHistory.create({
        data: {
        childId,
        amount: pointsAwarded,
        reason: childTask.task.title,
        },
    });

    const streak = await recalculateStreak(childId);

    return res.status(201).json({
        message: 'Task completed.',
        completion,
        xpAwarded: pointsAwarded,
        coinsAwarded: Math.floor(pointsAwarded / 2),
        streak,
    });
}

export async function uncompleteTask(req: AuthRequest, res: Response) {
    const parsed = completeSchema.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).json({
        message: 'Please check your input.',
        errors: parsed.error.flatten().fieldErrors,
        });
    }

    const { childId, taskId } = parsed.data;
    const today = startOfDay(new Date());

    const existing = await prisma.taskCompletion.findUnique({
        where: { childId_taskId_date: { childId, taskId, date: today } },
    });

    if (!existing) {
        return res.status(404).json({ message: 'Task was not completed today.' });
    }

    const childTask = await prisma.childTask.findUnique({
        where: { childId_taskId: { childId, taskId } },
        include: { task: true },
    });

    await prisma.taskCompletion.delete({
        where: { childId_taskId_date: { childId, taskId, date: today } },
    });

    if (childTask) {
        const pointsToRevert = childTask.task.points;
        const updatedChild = await prisma.child.update({
        where: { id: childId },
        data: {
            xp: { decrement: pointsToRevert },
            coins: { decrement: Math.floor(pointsToRevert / 2) },
        },
        });

        const newLevel = calculateLevel(updatedChild.xp);

        if (newLevel !== updatedChild.level) {
        await prisma.child.update({
            where: { id: childId },
            data: { level: newLevel },
        });
        }

        await prisma.xPHistory.create({
        data: {
            childId,
            amount: -pointsToRevert,
            reason: `Reverted: ${childTask.task.title}`,
        },
        });
    }

    const streak = await recalculateStreak(childId);

    return res.json({ message: 'Task unmarked as complete.', streak });
}

export async function getTodayCompletions(req: AuthRequest, res: Response) {
    const childId = req.params.childId as string;
    const today = startOfDay(new Date());

    const child = await prisma.child.findFirst({
        where: { id: childId, familyId: req.familyId },
    });

    if (!child) {
        return res.status(404).json({ message: 'Child not found.' });
    }

    const completions = await prisma.taskCompletion.findMany({
        where: { childId, date: today },
    });

    return res.json({ completions });
}