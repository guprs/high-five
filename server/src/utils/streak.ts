import prisma from '../prisma/client';

function startOfDay(date: Date): Date {
    const d = new Date(date);
    d.setUTCHours(0, 0, 0, 0);
    return d;
}

async function didCompleteAllTasksOnDate(childId: string, date: Date): Promise<boolean> {
    const assignedTasks = await prisma.childTask.findMany({
        where: { childId },
        select: { taskId: true },
    });
    
    if (assignedTasks.length === 0) {
    return false;
    }

    const completions = await prisma.taskCompletion.findMany({
        where: { childId, date },
        select: { taskId: true },
    });

    const completedTaskIds = new Set(completions.map((c) => c.taskId));

    return assignedTasks.every((t) => completedTaskIds.has(t.taskId));
}

export async function recalculateStreak(childId: string): Promise<number> {
    let streak = 0;
    let currentDate = startOfDay(new Date());

    while (true) {
        const completedAllToday = await didCompleteAllTasksOnDate(childId, currentDate);

        if (!completedAllToday) {
            if (streak === 0 && currentDate.getTime() === startOfDay(new Date()).getTime()) {
                currentDate.setUTCDate(currentDate.getUTCDate() - 1);
                continue;
            }
            break;
        }

        streak++;
        currentDate.setUTCDate(currentDate.getUTCDate() - 1);
    }

    const child = await prisma.child.findUnique({ where: { id: childId } });
    const longestStreak = Math.max(streak, child?.longestStreak ?? 0);

    await prisma.child.update({
        where: { id: childId },
        data: { streak, longestStreak },
    });

    return streak;
}