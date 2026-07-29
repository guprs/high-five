import type { ApiChild } from "../services/child";
import type { ApiTask } from "../services/task";
import type { Child, Task } from "../types/dashboard";

export const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const AGENDA_TIMES = ["8:00", "9:00", "15:00", "17:00", "18:00"];

const CHILD_COLORS = ["#8B5CF6", "#3B82F6", "#EC4899", "#059669", "#F59E0B"];

export function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function startOfWeek(date: Date) {
  const result = startOfDay(date);
  const mondayOffset = (result.getDay() + 6) % 7;
  result.setDate(result.getDate() - mondayOffset);
  return result;
}

export function addDays(date: Date, amount: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);
  return result;
}

export function sameDay(left: Date, right: Date) {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

export function toDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function fromDateInputValue(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function formatDateRange(dates: Date[]) {
  const first = dates[0];
  const last = dates[dates.length - 1];
  const firstLabel = first.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });
  const lastLabel = last.toLocaleDateString("en-US", {
    month: first.getMonth() === last.getMonth() ? undefined : "long",
    day: "numeric",
    year: "numeric",
  });
  return `${firstLabel}–${lastLabel}`;
}

export function childrenForTask(
  task: Task,
  children: Child[],
  selectedChildId: string | null,
) {
  const assignedChildren = children.filter((child) =>
    task.assignedTo.includes(child.id),
  );
  return selectedChildId
    ? assignedChildren.filter((child) => child.id === selectedChildId)
    : assignedChildren;
}

export function taskOccursOnDate(
  task: Task,
  date: Date,
  fallbackCreatedAt: Date,
) {
  const createdAt = task.createdAt
    ? startOfDay(new Date(task.createdAt))
    : fallbackCreatedAt;

  if (date < createdAt) return false;

  const frequency = task.frequency?.toLowerCase() ?? "";
  if (!task.recurring || frequency === "once") return sameDay(date, createdAt);
  if (frequency.includes("weekday")) {
    return date.getDay() >= 1 && date.getDay() <= 5;
  }
  if (frequency.includes("week")) return date.getDay() === createdAt.getDay();
  return true;
}

export function normalizeTask(task: ApiTask): Task {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    createdAt: task.createdAt,
    category: task.category ?? "Other",
    catColor: "indigo",
    points: task.points ?? 10,
    difficulty: task.difficulty ?? 1,
    assignedTo: (task.childTasks ?? []).map((entry) => entry.child.id),
    status: "pending",
    recurring: task.recurring ?? false,
    frequency: task.frequency ?? null,
    childTasks: (task.childTasks ?? []).map((entry) => ({
      child: {
        id: entry.child.id,
        name: entry.child.name,
        avatar: entry.child.emoji ?? entry.child.avatar ?? "🙂",
        emoji: entry.child.emoji,
        theme: entry.child.theme ?? "Space Adventure",
      },
    })),
    completions: task.completions ?? [],
  };
}

export function normalizeChildren(childData: ApiChild[]): Child[] {
  return childData.map((child, index) => ({
    id: child.id,
    name: child.name ?? "Unknown",
    age: child.age ?? 0,
    avatar: child.emoji ?? child.avatar ?? "🙂",
    color: child.color ?? CHILD_COLORS[index % CHILD_COLORS.length],
    xp: child.xp ?? 0,
    maxXp: child.maxXp ?? 1000,
    level: child.level ?? 1,
    coins: child.coins ?? 0,
    streak: child.streak ?? 0,
    tasksToday: child.tasksToday ?? 0,
    tasksComplete: child.tasksComplete ?? 0,
    theme: child.theme ?? "Space Adventure",
    themeId: child.themeId ?? "space",
    pin: child.pin ?? "",
  }));
}

export function completionForDate(
  task: Task,
  date: Date,
  assignedChildren: Child[],
) {
  const dateKey = toDateInputValue(date);
  const completedChildIds = new Set(
    (task.completions ?? [])
      .filter((completion) => completion.date.slice(0, 10) === dateKey)
      .map((completion) => completion.childId),
  );
  const completedCount = assignedChildren.filter((child) =>
    completedChildIds.has(child.id),
  ).length;

  if (assignedChildren.length > 0 && completedCount === assignedChildren.length) {
    return { label: "Done ✓", completed: true };
  }
  if (completedCount > 0) {
    return {
      label: `${completedCount}/${assignedChildren.length} done`,
      completed: false,
    };
  }
  return { label: "Pending", completed: false };
}
