import api from "./api";
import { encodeTaskSchedule } from "../utils/taskSchedule";

export interface CreateTaskData {
  title: string;
  description?: string;
  category?: string;
  points?: number;
  difficulty?: number;
  recurring?: boolean;
  frequency?: string | null;
  scheduledTime?: string | null;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  category?: string;
  points?: number;
  difficulty?: number;
  recurring?: boolean;
  frequency?: string | null;
  scheduledTime?: string | null;
}

export async function createTask(data: CreateTaskData) {
  const { scheduledTime, ...taskData } = data;
  const response = await api.post("/api/tasks", {
    ...taskData,
    frequency: encodeTaskSchedule({
      recurring: data.recurring ?? false,
      frequency: data.frequency,
      scheduledTime,
    }),
  });
  return response.data;
}

export async function updateTask(id: string, data: UpdateTaskData) {
  const { scheduledTime, ...taskData } = data;
  const response = await api.patch(`/api/tasks/${id}`, {
    ...taskData,
    ...(scheduledTime !== undefined
      ? {
          frequency: encodeTaskSchedule({
            recurring: data.recurring ?? false,
            frequency: data.frequency,
            scheduledTime,
          }),
        }
      : {}),
  });
  return response.data;
}

export async function deleteTask(id: string) {
  const response = await api.delete(`/api/tasks/${id}`);
  return response.data;
}

export async function assignTaskToChild(childId: string, taskId: string) {
  const response = await api.post("/api/child-tasks", {
    childId,
    taskId,
  });

  return response.data;
}
