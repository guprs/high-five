import type { Child } from "../types/dashboard";
import type { ApiChild } from "../services/child";
import { KID_THEMES } from "../data/themes";


export function mapChild(apiChild: ApiChild):Child {

 const theme =
 KID_THEMES.find(
   t => t.name === apiChild.theme
 );


 return {

   ...apiChild,

   name: apiChild.name ?? "Unknown",
   age: apiChild.age ?? 0,
   avatar: apiChild.emoji ?? apiChild.avatar ?? "🙂",

   color:"#8B5CF6",

   xp:0,
   maxXp:1000,

   level:1,
   coins:0,
   streak:0,

   tasksToday:0,
   tasksComplete:0,

   themeId:
     theme?.id ?? "space",

   theme: apiChild.theme ?? "Default",

   pin:"",

 };

}
