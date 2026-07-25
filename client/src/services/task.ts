import api from "./api";


export async function getTasks(){

  const response = await api.get(
    "/api/tasks"
  );

  return response.data.tasks;

}