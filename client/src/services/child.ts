import api from "./api";

export interface ApiChild {
  id: string;
  name?: string;
  age?: number;
  avatar?: string;
  emoji?: string;
  color?: string;
  xp?: number;
  maxXp?: number;
  level?: number;
  coins?: number;
  streak?: number;
  tasksToday?: number;
  tasksComplete?: number;
  theme?: string;
  themeId?: string;
  pin?: string;
}

export async function getChildren(): Promise<ApiChild[]> {

  const response =
    await api.get("/api/children");


  const { children = [] } = response.data as { children?: ApiChild[] };

  return children.map(
    (child)=>({

      ...child,

      avatar:
        child.emoji ?? "🙂",


      themeId:
        mapThemeNameToId(
          child.theme
        ),

    })
  );

}




function mapThemeNameToId(
  theme?:string
){

  switch(theme){

    case "Princess Kingdom":
      return "princess";


    case "Space Adventure":
      return "space";


    case "Animal World":
      return "jungle";


    case "Pirate Island":
      return "pirate";


    case "Dinosaur Land":
      return "dino";

    case "Ocean Adventure":
      return "ocean";

    case "Jungle Explorer":
      return "jungle";

    case "Dinosaurs":
      return "dino";

    case "Retro Pixel":
      return "pixel";


    case "Rainbow":
      return "rainbow";


    default:
      return "space";

  }

}




export async function updateChild(

  id:string,

  data:{
    name?:string;
    age?:number;
    themeId?:string;
    emoji?:string;
  }

){


  const response =
    await api.patch(

      `/api/children/${id}`,

      {

        name:data.name,

        age:data.age,


        emoji:data.emoji,


        theme:
          mapThemeIdToName(
            data.themeId
          ),

      }

    );


  return response.data.child;

}




function mapThemeIdToName(
 id?:string
){

 switch(id){


  case "princess":
    return "Princess Kingdom";


  case "space":
    return "Space Adventure";


  case "ocean":
    return "Ocean Adventure";

  case "jungle":
    return "Jungle Explorer";


  case "pirate":
    return "Pirate Island";


  case "dino":
    return "Dinosaurs";

  case "pixel":
    return "Retro Pixel";


  case "rainbow":
    return "Rainbow";


  default:
    return "Space Adventure";

 }

}
