import api from "./api";
import { decodeTaskSchedule } from "../utils/taskSchedule";

export interface ApiTask {
  id: string;
  title: string;
  description?: string;
  category?: string;
  points?: number;
  difficulty?: number;
  recurring?: boolean;
  frequency?: string | null;
  scheduledTime?: string | null;
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

  return (response.data.tasks ?? []).map((task: ApiTask) => {
    const schedule = decodeTaskSchedule(task.frequency);
    return {
      ...task,
      frequency: schedule.frequency,
      scheduledTime: schedule.scheduledTime,
    };
  });

}

export async function getCalendarTasks(): Promise<ApiTask[]> {
  return getTasks();
}
