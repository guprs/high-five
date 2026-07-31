import { Response } from 'express';
import prisma from '../prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';

function startOfDay(date: Date): Date {
    const d = new Date(date);
    d.setUTCHours(0, 0, 0, 0);
    return d;
}

function startOfWeek(date: Date): Date {
    const d = startOfDay(date);
    const day = d.getUTCDay();
    const diff = day === 0 ? -6 : 1 - day;
    d.setUTCDate(d.getUTCDate() + diff);
    return d;
}

export async function getAnalytics(req: AuthRequest, res: Response) {
    try {
        const familyId = req.familyId as string;

        const children = await prisma.child.findMany({ where: { familyId } });
        const childIds = children.map((c) => c.id);

        const totalFamilyXp = children.reduce((sum, c) => sum + c.xp, 0);
        const longestStreak = children.reduce((max, c) => Math.max(max, c.longestStreak), 0);

        const totalCompletedTasks = await prisma.taskCompletion.count({
            where: { childId: { in: childIds } },
        });

        // Completion rate (last 7 days)
        const sevenDaysAgo = startOfDay(new Date());
        sevenDaysAgo.setUTCDate(sevenDaysAgo.getUTCDate() - 6);

        const assignedTasksCount = await prisma.childTask.count({
            where: { childId: { in: childIds } },
        });

        const completionsLast7Days = await prisma.taskCompletion.count({
            where: {
                childId: { in: childIds },
                date: { gte: sevenDaysAgo },
        },
        });

        const possibleCompletions = assignedTasksCount * 7;
        const completionRate = possibleCompletions > 0
        ? Math.round((completionsLast7Days / possibleCompletions) * 100)
        : 0;

        // Weekly completions per child (current week)
        const weekStart = startOfWeek(new Date());
        const weeklyCompletionsPerChild = await Promise.all(
            children.map(async (child) => {
                const completions = await prisma.taskCompletion.count({
                    where: { childId: child.id, date: { gte: weekStart } },
                });
                return { childId: child.id, name: child.name, completions };
        })
        );

        // 4-week XP progress
        const fourWeekXpProgress = [];
        for (let i = 3; i >= 0; i--) {
            const weekStartDate = startOfWeek(new Date());
            weekStartDate.setUTCDate(weekStartDate.getUTCDate() - i * 7);
            const weekEndDate = new Date(weekStartDate);
            weekEndDate.setUTCDate(weekEndDate.getUTCDate() + 7);

            const history = await prisma.xPHistory.findMany({
                where: {
                childId: { in: childIds },
                createdAt: { gte: weekStartDate, lt: weekEndDate },
                },
            });

            const xp = history.reduce((sum, entry) => sum + entry.amount, 0);
            fourWeekXpProgress.push({ weekStart: weekStartDate, xp });
        }

        // Category distribution
        const completions = await prisma.taskCompletion.findMany({
            where: { childId: { in: childIds } },
            include: { task: { select: { category: true } } },
        });

        const categoryMap = new Map<string, number>();
        for (const completion of completions) {
            const category = completion.task.category || 'Uncategorized';
            categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
        }
        const categoryDistribution = Array.from(categoryMap.entries()).map(
            ([category, count]) => ({ category, count })
        );

        // Streak leaderboard
        const streakLeaderboard = [...children]
        .sort((a, b) => b.streak - a.streak)
        .map((c) => ({
            childId: c.id,
            name: c.name,
            streak: c.streak,
            longestStreak: c.longestStreak,
        }));

        // XP ranking (all-time)
        const xpRanking = [...children]
        .sort((a, b) => b.xp - a.xp)
        .map((c) => ({ childId: c.id, name: c.name, xp: c.xp, level: c.level }));

        return res.json({
            totalFamilyXp,
            totalCompletedTasks,
            longestStreak,
            completionRate,
            weeklyCompletionsPerChild,
            fourWeekXpProgress,
            categoryDistribution,
            streakLeaderboard,
            xpRanking,
        });
    } catch (error) {
        console.error('GET ANALYTICS ERROR:', error);
        return res.status(500).json({ message: 'Could not load analytics.' });
    }
}