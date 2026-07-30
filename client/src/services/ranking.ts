import api from "./api";

export type WeeklyRankingEntry = {
  childId: string;
  name: string;
  emoji: string;
  weeklyXp: number;
  streak: number;
};

export type WeeklyRankingResponse = {
  ranking: WeeklyRankingEntry[];
  weekStart: string;
};

export async function getWeeklyRanking(): Promise<WeeklyRankingResponse> {
  const response = await api.get("/api/ranking/weekly");

  return response.data;
}
