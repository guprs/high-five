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