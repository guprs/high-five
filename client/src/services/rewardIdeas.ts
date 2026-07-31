import api from "./api";

export interface RewardIdeaInput {
  age?: number;
  interests: string[];
  preferences: string[];
  rewardTypes: string[];
  count: number;
}

export interface RewardIdea {
  title: string;
  icon: string;
  cost: number;
  reason: string;
}

export async function generateRewardIdeas(
  input: RewardIdeaInput,
): Promise<RewardIdea[]> {
  const response = await api.post<{ suggestions: RewardIdea[] }>(
    "/api/rewards/suggestions",
    input,
  );
  return response.data.suggestions;
}
