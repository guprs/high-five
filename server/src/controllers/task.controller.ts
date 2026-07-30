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
  frequency: z.string().nullable().optional(),
});

export async function createTask(req: AuthRequest, res: Response) {
  try {
    const parsed = taskSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: 'Please check your input.',
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const duplicate = await prisma.task.findFirst({
      where: {
        familyId: req.familyId,
        title: {
          equals: parsed.data.title.trim(),
          mode: 'insensitive',
        },
      },
      select: { id: true },
    });

    if (duplicate) {
      return res.status(409).json({
        message: 'A task with this name already exists.',
      });
    }

    const task = await prisma.task.create({
      data: {
        ...parsed.data,
        title: parsed.data.title.trim(),
        familyId: req.familyId as string,
      },
      include: {
        childTasks: { include: { child: true } },
      },
    });

    return res.status(201).json({ task });
  } catch (error) {
    console.error('CREATE TASK ERROR:', error);
    return res.status(500).json({ message: 'Could not create task.' });
  }
}

export async function getTasks(req: AuthRequest, res: Response) {
  try {
    const tasks = await prisma.task.findMany({
      where: { familyId: req.familyId },
      include: {
        childTasks: { include: { child: true } },
        completions: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ tasks });
  } catch (error) {
    console.error('GET TASKS ERROR:', error);
    return res.status(500).json({ message: 'Could not load tasks.' });
  }
}

export async function getTaskById(req: AuthRequest, res: Response) {
  try {
    const id = req.params.id as string;

    const task = await prisma.task.findFirst({
      where: { id, familyId: req.familyId },
      include: {
        childTasks: { include: { child: true } },
      },
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    return res.json({ task });
  } catch (error) {
    console.error('GET TASK BY ID ERROR:', error);
    return res.status(500).json({ message: 'Could not load task.' });
  }
}

export async function updateTask(req: AuthRequest, res: Response) {
  try {
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

    if (parsed.data.title) {
      const duplicate = await prisma.task.findFirst({
        where: {
          familyId: req.familyId,
          id: { not: id },
          title: {
            equals: parsed.data.title.trim(),
            mode: 'insensitive',
          },
        },
        select: { id: true },
      });

      if (duplicate) {
        return res.status(409).json({
          message: 'A task with this name already exists.',
        });
      }
    }

    const task = await prisma.task.update({
      where: { id },
      data: {
        ...parsed.data,
        ...(parsed.data.title ? { title: parsed.data.title.trim() } : {}),
      },
      include: {
        childTasks: { include: { child: true } },
      },
    });

    return res.json({ task });
  } catch (error) {
    console.error('UPDATE TASK ERROR:', error);
    return res.status(500).json({ message: 'Could not update task.' });
  }
}

export async function deleteTask(req: AuthRequest, res: Response) {
  try {
    const id = req.params.id as string;

    const existing = await prisma.task.findFirst({
      where: { id, familyId: req.familyId },
    });

    if (!existing) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    await prisma.task.delete({ where: { id } });

    return res.json({ message: 'Task deleted successfully.' });
  } catch (error) {
    console.error('DELETE TASK ERROR:', error);
    return res.status(500).json({ message: 'Could not delete task.' });
  }
}
