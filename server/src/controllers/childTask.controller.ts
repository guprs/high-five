import { Response } from 'express';
import { z } from 'zod';
import prisma from '../prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';

const assignSchema = z.object({
    childId: z.string().uuid(),
    taskId: z.string().uuid(),
});

export async function assignTaskToChild(req: AuthRequest, res: Response) {
    const parsed = assignSchema.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).json({
        message: 'Please check your input.',
        errors: parsed.error.flatten().fieldErrors,
        });
    }

    const { childId, taskId } = parsed.data;

    const child = await prisma.child.findFirst({
        where: { id: childId, familyId: req.familyId },
    });
    const task = await prisma.task.findFirst({
        where: { id: taskId, familyId: req.familyId },
    });

    if (!child || !task) {
        return res.status(404).json({ message: 'Child or task not found.' });
    }

    const existing = await prisma.childTask.findUnique({
        where: { childId_taskId: { childId, taskId } },
    });

    if (existing) {
        return res.status(409).json({ message: 'This task is already assigned to this child.' });
    }

    const childTask = await prisma.childTask.create({
        data: { childId, taskId },
    });

    return res.status(201).json({ childTask });
}

export async function unassignTaskFromChild(req: AuthRequest, res: Response) {
    const childId = req.params.childId as string;
    const taskId = req.params.taskId as string;

    const child = await prisma.child.findFirst({
        where: { id: childId, familyId: req.familyId },
    });

    if (!child) {
        return res.status(404).json({ message: 'Child not found.' });
    }

    const existing = await prisma.childTask.findUnique({
        where: { childId_taskId: { childId, taskId } },
    });

    if (!existing) {
        return res.status(404).json({ message: 'This task is not assigned to this child.' });
    }

    await prisma.childTask.delete({
        where: { childId_taskId: { childId, taskId } },
    });

    return res.json({ message: 'Task unassigned successfully.' });
}

export async function getChildTasks(req: AuthRequest, res: Response) {
    const childId = req.params.childId as string;

    const child = await prisma.child.findFirst({
        where: { id: childId, familyId: req.familyId },
    });

    if (!child) {
        return res.status(404).json({ message: 'Child not found.' });
    }

    const childTasks = await prisma.childTask.findMany({
        where: { childId },
        include: { task: true },
    });

    return res.json({ tasks: childTasks.map((ct) => ct.task) });
}