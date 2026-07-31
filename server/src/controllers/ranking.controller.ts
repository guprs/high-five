import { Response } from 'express';
import prisma from '../prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';

function startOfWeek(date: Date): Date {
    const d = new Date(date);
    const day = d.getUTCDay();
    const diff = day === 0 ? -6 : 1 - day;
    d.setUTCDate(d.getUTCDate() + diff);
    d.setUTCHours(0, 0, 0, 0);
    return d;
}

export async function getWeeklyRanking(req: AuthRequest, res: Response) {
    const weekStart = startOfWeek(new Date());

    const children = await prisma.child.findMany({
        where: { familyId: req.familyId },
    });

    const ranking = await Promise.all(
        children.map(async (child) => {
        const history = await prisma.xPHistory.findMany({
            where: {
            childId: child.id,
            createdAt: { gte: weekStart },
            },
        });

        const weeklyXp = history.reduce((sum, entry) => sum + entry.amount, 0);

        return {
            childId: child.id,
            name: child.name,
            emoji: child.emoji,
            weeklyXp,
            streak: child.streak,
        };
        })
    );

    ranking.sort((a, b) => b.weeklyXp - a.weeklyXp);

    return res.json({ ranking, weekStart });
}

function startOfMonth(date: Date): Date {
    const d = new Date(date);
    d.setUTCDate(1);
    d.setUTCHours(0, 0, 0, 0);
    return d;
}

export async function getMonthlyRanking(req: AuthRequest, res: Response) {
    const monthStart = startOfMonth(new Date());

    const children = await prisma.child.findMany({
        where: { familyId: req.familyId },
    });

    const ranking = await Promise.all(
        children.map(async (child) => {
            const history = await prisma.xPHistory.findMany({
                where: {
                childId: child.id,
                createdAt: { gte: monthStart },
            },
        });
        
        const monthlyXp = history.reduce((sum, entry) => sum + entry.amount, 0);
            return {
                childId: child.id,
                name: child.name,
                emoji: child.emoji,
                monthlyXp,
                streak: child.streak,
            };
        })
    );

    ranking.sort((a, b) => b.monthlyXp - a.monthlyXp);

    return res.json({ ranking, monthStart });
}