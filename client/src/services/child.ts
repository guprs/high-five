import api from "./api";

export async function getChildren() {
  const response = await api.get("/api/children");

  return response.data.children;
}