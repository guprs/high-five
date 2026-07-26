import api from "./api";


export async function getChildren() {

  const response =
    await api.get("/api/children");

  return response.data.children;

}





export async function updateChild(
  id: string,
  data: {
    name?: string;
    age?: number;
    theme?: string;
    emoji?: string;
  }
) {
  const response = await api.patch(
    `/api/children/${id}`,
    data
  );

  return response.data.child;
}