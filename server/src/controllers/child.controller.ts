import { Response } from 'express';
import { z } from 'zod';
import prisma from '../prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';

const childSchema = z.object({
    name: z.string().min(1, 'Name is required.'),
    age: z.number().int().positive().optional(),
    emoji: z.string().optional(),
    theme: z.string().optional(),
});

export async function createChild(req: AuthRequest, res: Response) {
    const parsed = childSchema.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).json({
            message: 'Please check your input.',
            errors: parsed.error.flatten().fieldErrors,
        });
    }

    const child = await prisma.child.create({
        data: {
            ...parsed.data,
            familyId: req.familyId as string,
        },
    });

    return res.status(201).json({ child });
}

export async function getChildren(req: AuthRequest, res: Response) {
    const children = await prisma.child.findMany({
        where: { familyId: req.familyId },
        orderBy: { createdAt: 'asc' },
    });

    return res.json({ children });
}

export async function getChildById(req: AuthRequest, res: Response) {
    const id = req.params.id as string;

    const child = await prisma.child.findFirst({
        where: { id, familyId: req.familyId },
    });

    if (!child) {
        return res.status(404).json({ message: 'Child not found.' });
    }

    return res.json({ child });
}

export async function updateChild(req: AuthRequest, res: Response) {
    const id = req.params.id as string;
    const parsed = childSchema.partial().safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).json({
        message: 'Please check your input.',
        errors: parsed.error.flatten().fieldErrors,
        });
    }

    const existing = await prisma.child.findFirst({
        where: { id, familyId: req.familyId },
    });

    if (!existing) {
        return res.status(404).json({ message: 'Child not found.' });
    }

    const child = await prisma.child.update({
        where: { id },
        data: parsed.data,
    });

    return res.json({ child });
    }

    export async function deleteChild(req: AuthRequest, res: Response) {
    const id = req.params.id as string;

    const existing = await prisma.child.findFirst({
        where: { id, familyId: req.familyId },
    });

    if (!existing) {
        return res.status(404).json({ message: 'Child not found.' });
    }

    await prisma.child.delete({ where: { id } });

    return res.json({ message: 'Child deleted successfully.' });
    }