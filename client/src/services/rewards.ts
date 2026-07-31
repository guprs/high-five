import api from "./api";

export interface ApiReward {
  id: string;
  title: string;
  cost: number;
  icon?: string | null;
  createdAt?: string;
}

export type RewardRequestStatus = "pending" | "approved" | "rejected";

export interface ApiRewardRequest {
  id: string;
  status: RewardRequestStatus;
  requestedAt: string;
  resolvedAt?: string | null;
  childId: string;
  rewardId: string;
  childName?: string;
  childEmoji?: string | null;
  reward?: string;
  cost?: number;
}

export interface RewardInput {
  title: string;
  cost: number;
  icon?: string;
}

export async function getRewards(): Promise<ApiReward[]> {
  const response = await api.get("/api/rewards");
  return response.data.rewards ?? [];
}

export async function createReward(data: RewardInput): Promise<ApiReward> {
  const response = await api.post("/api/rewards", data);
  return response.data.reward;
}

export async function updateReward(
  id: string,
  data: RewardInput,
): Promise<ApiReward> {
  const response = await api.patch(`/api/rewards/${id}`, data);
  return response.data.reward;
}

export async function deleteReward(id: string): Promise<void> {
  await api.delete(`/api/rewards/${id}`);
}

export async function getRewardRequests(
  status?: RewardRequestStatus,
): Promise<ApiRewardRequest[]> {
  const response = await api.get("/api/reward-requests", {
    params: status ? { status } : undefined,
  });
  return response.data.requests ?? [];
}

export async function createRewardRequest(data: {
  childId: string;
  rewardId: string;
}): Promise<ApiRewardRequest> {
  const response = await api.post("/api/reward-requests", data);
  return response.data.request;
}

export async function approveRewardRequest(
  id: string,
): Promise<ApiRewardRequest> {
  const response = await api.patch(`/api/reward-requests/${id}/approve`);
  return response.data.request;
}

export async function rejectRewardRequest(
  id: string,
): Promise<ApiRewardRequest> {
  const response = await api.patch(`/api/reward-requests/${id}/reject`);
  return response.data.request;
}

export async function cancelRewardRequest(id: string): Promise<void> {
  await api.delete(`/api/reward-requests/${id}`);
}
