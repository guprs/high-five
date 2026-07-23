import type {
  Child,
  Task,
  RewardRequest
} from "../types";


export const CHILDREN: Child[] = [

{
 id:1,
 name:"Emma",
 age:8,
 emoji:"🦄",
 color:"#8B5CF6",

 xp:2840,
 maxXp:3000,
 level:12,

 coins:340,
 streak:7,

 tasksToday:3,
 tasksComplete:2,

 theme:"Princess Kingdom",
 themeId:"princess",

 pin:"1234"
},


{
 id:2,
 name:"Lucas",
 age:10,
 emoji:"🚀",
 color:"#3B82F6",

 xp:4200,
 maxXp:5000,
 level:17,

 coins:820,
 streak:14,

 tasksToday:4,
 tasksComplete:4,

 theme:"Space Adventure",
 themeId:"space",

 pin:"2222"
},


{
 id:3,
 name:"Sofia",
 age:6,
 emoji:"🌈",
 color:"#EC4899",

 xp:900,
 maxXp:1500,
 level:5,

 coins:120,
 streak:3,

 tasksToday:2,
 tasksComplete:1,

 theme:"Rainbow",
 themeId:"rainbow",

 pin:"3333"
}

];



export const TASKS: Task[] = [

{
 id:1,
 title:"Make your bed",
 category:"Chores",
 catColor:"indigo",
 points:10,
 difficulty:1,
 assignedTo:[1,3],
 status:"completed",
 recurring:true,
 frequency:"Daily"
},


{
 id:2,
 title:"Read for 20 minutes",
 category:"Education",
 catColor:"emerald",
 points:20,
 difficulty:2,
 assignedTo:[1,2],
 status:"pending",
 recurring:true,
 frequency:"Daily"
},


{
 id:3,
 title:"Practice piano",
 category:"Skills",
 catColor:"amber",
 points:30,
 difficulty:3,
 assignedTo:[1],
 status:"pending",
 recurring:true,
 frequency:"Weekdays"
},


{
 id:4,
 title:"Do homework",
 category:"Education",
 catColor:"emerald",
 points:25,
 difficulty:2,
 assignedTo:[2],
 status:"completed",
 recurring:true,
 frequency:"Weekdays"
},


{
 id:5,
 title:"Set the table",
 category:"Chores",
 catColor:"indigo",
 points:10,
 difficulty:1,
 assignedTo:[2,3],
 status:"pending",
 recurring:true,
 frequency:"Daily"
}

];



export const PENDING_REWARDS_INIT: RewardRequest[] = [

{
 id:1,
 childId:1,
 childName:"Emma",
 childEmoji:"🦄",
 reward:"Screen time +30 min",
 cost:50,
 requestedAt:"2 hours ago"
},


{
 id:2,
 childId:2,
 childName:"Lucas",
 childEmoji:"🚀",
 reward:"New game or toy",
 cost:500,
 requestedAt:"Yesterday"
}

];