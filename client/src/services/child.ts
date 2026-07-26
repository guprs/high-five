import api from "./api";


export async function getChildren() {

  const response =
    await api.get("/api/children");

  return response.data.children;

}



export async function createChild(childData: {

  name: string;

  age: number;

  avatar?: string;

  theme?: string;

  pin?: string;

}) {


  const response =
    await api.post(
      "/api/children",
      childData
    );


  return response.data.child;

}



export async function updateChild(
  id: string,
  childData: Partial<{

    name: string;

    age: number;

    avatar: string;

    theme: string;

    pin: string;

  }>
) {


  const response =
    await api.patch(
      `/api/children/${id}`,
      childData
    );


  return response.data.child;

}



export async function deleteChild(
  id: string
) {


  const response =
    await api.delete(
      `/api/children/${id}`
    );


  return response.data;

}