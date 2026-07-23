import { Response } from 'express';
import { z } from 'zod';
import prisma from '../prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';

const taskSchema = z.object({
    title: z.string().min(1, 'Title is required.'),
    description: z.string().optional(),
    category: z.string().optional(),
    points: z.number().int().positive().optional(),
    difficulty: z.number().int().min(1).max(5).optional(),
    recurring: z.boolean().optional(),
    frequency: z.string().optional(),
});

export async function createTask(req: AuthRequest, res: Response) {
    const parsed = taskSchema.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).json({
        message: 'Please check your input.',
        errors: parsed.error.flatten().fieldErrors,
        });
    }

    const task = await prisma.task.create({
        data: {
        ...parsed.data,
        familyId: req.familyId as string,
        },
    });

    return res.status(201).json({ task });
}

export async function getTasks(req: AuthRequest, res: Response) {
    const tasks = await prisma.task.findMany({
        where: { familyId: req.familyId },
        orderBy: { createdAt: 'asc' },
    });

    return res.json({ tasks });
}

export async function getTaskById(req: AuthRequest, res: Response) {
    const id = req.params.id as string;

    const task = await prisma.task.findFirst({
        where: { id, familyId: req.familyId },
    });

    if (!task) {
        return res.status(404).json({ message: 'Task not found.' });
    }

    return res.json({ task });
}

export async function updateTask(req: AuthRequest, res: Response) {
    const id = req.params.id as string;
    const parsed = taskSchema.partial().safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).json({
        message: 'Please check your input.',
        errors: parsed.error.flatten().fieldErrors,
        });
    }

    const existing = await prisma.task.findFirst({
        where: { id, familyId: req.familyId },
    });

    if (!existing) {
        return res.status(404).json({ message: 'Task not found.' });
    }

    const task = await prisma.task.update({
        where: { id },
        data: parsed.data,
    });

    return res.json({ task });
}

export async function deleteTask(req: AuthRequest, res: Response) {
    const id = req.params.id as string;

    const existing = await prisma.task.findFirst({
        where: { id, familyId: req.familyId },
    });

    if (!existing) {
        return res.status(404).json({ message: 'Task not found.' });
    }

    await prisma.task.delete({ where: { id } });

    return res.json({ message: 'Task deleted successfully.' });
}