import api from "./api";

export interface FamilyInvite {
  inviteCode: string;
  familyName: string;
}

export async function setFamilyPin(pin: string) {
  const response = await api.patch("/api/family/pin", { pin });
  return response.data;
}

export async function verifyFamilyPin(pin: string) {
  const response = await api.post("/api/family/pin/verify", { pin });
  return response.data;
}

export async function getFamilyInviteCode(): Promise<FamilyInvite> {
  const response = await api.get("/api/family/invite");
  return response.data as FamilyInvite;
}

export async function joinFamily(inviteCode: string) {
  const response = await api.post("/api/family/join", { inviteCode });
  const { token, user } = response.data;

  if (token) localStorage.setItem("token", token);
  if (user) localStorage.setItem("user", JSON.stringify(user));

  return response.data;
}
