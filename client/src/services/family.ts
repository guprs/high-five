import api from "./api";

export async function setFamilyPin(pin: string) {
  const response = await api.patch("/api/family/pin", {
    pin,
  });

  return response.data;
}

export async function verifyFamilyPin(pin: string) {
  const response = await api.post("/api/family/pin/verify", {
    pin,
  });

  return response.data;
}

export async function getFamilyInviteCode() {
  const response = await api.get("/api/family/invite");

  return response.data;
}

export async function joinFamily(inviteCode: string) {
  const response = await api.post("/api/family/join", {
    inviteCode,
  });

  localStorage.setItem("token", response.data.token);
  localStorage.setItem("user", JSON.stringify(response.data.user));

  return response.data;
}