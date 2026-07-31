import prisma from '../prisma/client';

export const BADGE_METADATA: Record<string, { title: string; description: string; icon: string }> = {
    first_task: {
        title: 'First Steps',
        description: 'Completed your very first task.',
        icon: '🌟',
    },
    tasks_50: {
        title: 'Halfway Hero',
        description: 'Completed 50 tasks in total.',
        icon: '🏅',
    },
    tasks_100: {
        title: 'Century Champion',
        description: 'Completed 100 tasks in total.',
        icon: '🏆',
    },
    streak_7: {
        title: 'Week Warrior',
        description: 'Reached a 7-day streak.',
        icon: '🔥',
    },
    streak_30: {
        title: 'Month Master',
        description: 'Reached a 30-day streak.',
        icon: '💎',
    },
};

const BADGE_DEFINITIONS = [
    { type: 'first_task', check: (totalTasks: number) => totalTasks >= 1 },
    { type: 'tasks_50', check: (totalTasks: number) => totalTasks >= 50 },
    { type: 'tasks_100', check: (totalTasks: number) => totalTasks >= 100 },
] as const;

const STREAK_BADGE_DEFINITIONS = [
    { type: 'streak_7', check: (streak: number) => streak >= 7 },
    { type: 'streak_30', check: (streak: number) => streak >= 30 },
] as const;

export async function checkAndAwardBadges(childId: string): Promise<string[]> {
    const newlyAwarded: string[] = [];

    const child = await prisma.child.findUnique({ where: { id: childId } });
    if (!child) return newlyAwarded;

    const totalTasks = await prisma.taskCompletion.count({ where: { childId } });

    const existingBadges = await prisma.badge.findMany({
        where: { childId },
        select: { type: true },
    });
    const alreadyEarned = new Set(existingBadges.map((b) => b.type));

    for (const badge of BADGE_DEFINITIONS) {
        if (!alreadyEarned.has(badge.type) && badge.check(totalTasks)) {
            await prisma.badge.create({ data: { childId, type: badge.type } });
            newlyAwarded.push(badge.type);
        }
    }

    for (const badge of STREAK_BADGE_DEFINITIONS) {
        if (!alreadyEarned.has(badge.type) && badge.check(child.streak)) {
            await prisma.badge.create({ data: { childId, type: badge.type } });
            newlyAwarded.push(badge.type);
        }
    }

    return newlyAwarded;
}