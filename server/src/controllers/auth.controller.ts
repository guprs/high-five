import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import prisma from '../prisma/client';

const registerSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    familyName: z.string().min(2),
});

export async function register(req: Request, res: Response) {
    const parsed = registerSchema.safeParse(req.body);

    if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
    }

    const { name, email, password, familyName } = parsed.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
    return res.status(409).json({ error: 'Email already in use' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const family = await prisma.family.create({
    data: { name: familyName },
    });

    const user = await prisma.user.create({
    data: {
        name,
        email,
        passwordHash,
        familyId: family.id,
    },
    });

    const token = jwt.sign(
    { userId: user.id, familyId: family.id },
    process.env.JWT_SECRET as string,
    { expiresIn: '7d' }
    );

    return res.status(201).json({
    user: { id: user.id, name: user.name, email: user.email },
    family: { id: family.id, name: family.name },
    token,
    });
}

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

export async function login(req: Request, res: Response) {
    const parsed = loginSchema.safeParse(req.body);

    if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatches) {
    return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
    { userId: user.id, familyId: user.familyId },
    process.env.JWT_SECRET as string,
    { expiresIn: '7d' }
    );

    return res.json({
    user: { id: user.id, name: user.name, email: user.email },
    token,
    });
}