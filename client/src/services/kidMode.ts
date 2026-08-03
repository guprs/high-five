import api from "./api";
import { decodeTaskSchedule } from "../utils/taskSchedule";

export interface KidTask {
  id: string;
  title: string;
  description?: string;
  category?: string;
  points: number;
  difficulty?: number | null;
  recurring: boolean;
  frequency: string | null;
  scheduledTime: string | null;
  active: boolean;
  createdAt: string;
}

export interface TodayCompletion {
  id: string;
  childId: string;
  taskId: string;
  date: string;
  completedAt: string;
}

export interface CompleteTaskResponse {
  message: string;
  completion: TodayCompletion;
  xpAwarded: number;
  coinsAwarded: number;
  streak: number;
  newBadges: string[];
}

export interface KidBadge {
  id: string;
  type: string;
  earnedAt: string;
  childId: string;
  title: string;
  description: string;
  icon: string;
}

export async function getKidTasks(childId: string): Promise<KidTask[]> {
  const response = await api.get(`/api/child-tasks/${childId}`);
  return (response.data.tasks ?? []).map((task: KidTask) => {
    const schedule = decodeTaskSchedule(task.frequency);
    return {
      ...task,
      frequency: schedule.frequency,
      scheduledTime: schedule.scheduledTime,
    };
  });
}

export async function getTodayCompletions(
  childId: string,
): Promise<TodayCompletion[]> {
  const response = await api.get(`/api/task-completions/today/${childId}`);
  return response.data.completions ?? [];
}

export async function completeKidTask(
  childId: string,
  taskId: string,
): Promise<CompleteTaskResponse> {
  const response = await api.post("/api/task-completions/complete", {
    childId,
    taskId,
  });
  return response.data;
}

export async function uncompleteKidTask(
  childId: string,
  taskId: string,
): Promise<{ message: string; streak: number }> {
  const response = await api.post("/api/task-completions/uncomplete", {
    childId,
    taskId,
  });
  return response.data;
}

export async function getKidBadges(childId: string): Promise<KidBadge[]> {
  const response = await api.get(`/api/badges/${childId}`);
  return response.data.badges ?? [];
}
