import api from "./api";

export interface TaskIdeaInput {
  age?: number;
  prompt: string;
  supportPreferences: string[];
  categories: string[];
  count: number;
}

export interface TaskIdea {
  title: string;
  description: string;
  category: string;
  points: number;
  difficulty: number;
  recurring: boolean;
  frequency: string | null;
  reason: string;
}

export async function generateTaskIdeas(
  input: TaskIdeaInput,
): Promise<TaskIdea[]> {
  const response = await api.post<{ suggestions: TaskIdea[] }>(
    "/api/tasks/suggestions",
    input,
  );

  return response.data.suggestions;
}
