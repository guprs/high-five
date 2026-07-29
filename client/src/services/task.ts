import api from "./api";

export interface ApiTask {
  id: string;
  title: string;
  description?: string;
  category?: string;
  points?: number;
  difficulty?: number;
  recurring?: boolean;
  frequency?: string | null;
  active?: boolean;
  createdAt?: string;
  childTasks?: Array<{
    child: {
      id: string;
      name: string;
      emoji?: string;
      avatar?: string;
      theme?: string;
    };
  }>;
  completions?: Array<{
    id: string;
    childId: string;
    taskId: string;
    date: string;
    completedAt: string;
  }>;
}

export async function getTasks(){

  const response = await api.get(
    "/api/tasks"
  );

  return response.data.tasks ?? [];

}

export async function getCalendarTasks(): Promise<ApiTask[]> {
  return getTasks();
}
