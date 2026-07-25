import api from "./api";


export async function getWeeklyRanking() {
  const response = await api.get("/api/ranking/weekly");

  return response.data;
}