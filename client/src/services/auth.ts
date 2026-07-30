import api from "./api";

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  familyName: string;
}


export async function loginUser(data: LoginData) {
  const response = await api.post("/api/auth/login", data);

  localStorage.setItem("token", response.data.token);
  localStorage.setItem(
    "user",
    JSON.stringify(response.data.user)
  );
  if (response.data.family) {
    localStorage.setItem("family", JSON.stringify(response.data.family));
  }

  return response.data;
}


export async function registerUser(data: RegisterData) {
  const response = await api.post("/api/auth/register", data);

  localStorage.setItem("token", response.data.token);
  localStorage.setItem(
    "user",
    JSON.stringify(response.data.user)
  );
  if (response.data.family) {
    localStorage.setItem("family", JSON.stringify(response.data.family));
  }

  return response.data;
}


export function logoutUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("family");
}


export function isAuthenticated() {
  return Boolean(localStorage.getItem("token"));
}

export async function changePassword(data: {
  currentPassword: string;
  newPassword: string;
}) {
  const response = await api.patch("/api/auth/password", data);
  return response.data as { message: string };
}
