import api from "./api";

export interface CreateTaskData {
  title: string;
  description?: string;
  category?: string;
  points?: number;
  difficulty?: number;
  recurring?: boolean;
  frequency?: string | null;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  category?: string;
  points?: number;
  difficulty?: number;
  recurring?: boolean;
  frequency?: string | null;
}

export async function createTask(data: CreateTaskData) {
  const response = await api.post("/api/tasks", data);
  return response.data;
}

export async function updateTask(id: string, data: UpdateTaskData) {
  const response = await api.patch(`/api/tasks/${id}`, data);
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