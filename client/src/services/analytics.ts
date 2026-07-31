import api from "./api";

export interface AnalyticsResponse {
  totalFamilyXp: number;
  totalCompletedTasks: number;
  longestStreak: number;
  completionRate: number;
  weeklyCompletionsPerChild: Array<{
    childId: string;
    name: string;
    completions: number;
  }>;
  fourWeekXpProgress: Array<{
    weekStart: string;
    xp: number;
  }>;
  categoryDistribution: Array<{
    category: string;
    count: number;
  }>;
  streakLeaderboard: Array<{
    childId: string;
    name: string;
    streak: number;
    longestStreak: number;
  }>;
  xpRanking: Array<{
    childId: string;
    name: string;
    xp: number;
    level: number;
  }>;
}

export async function getAnalytics(): Promise<AnalyticsResponse> {
  const response = await api.get("/api/analytics");
  return response.data;
}
