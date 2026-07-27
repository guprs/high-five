import {
  LayoutDashboard,
  Users,
  ListTodo,
  Gift,
  Calendar,
  BarChart3,
  Settings,
} from "lucide-react";

import type {
  Child,
  Task,
  RewardRequest,
  Reward,
  WeeklyData,
  XPData,
  CategoryData,
} from "../types/dashboard";



export const CHILDREN: Child[] = [

  {
    id: "emma",
    name: "Emma",
    age: 8,
    avatar: "🦄",
    color: "#8B5CF6",

    xp: 2840,
    maxXp: 3000,

    level: 12,
    coins: 340,
    streak: 7,

    tasksToday: 3,
    tasksComplete: 2,

    theme: "Princess Kingdom",
    themeId: "princess",

    pin: "1234",
  },


  {
    id: "lucas",
    name: "Lucas",
    age: 10,
    avatar: "🚀",
    color: "#3B82F6",

    xp: 4200,
    maxXp: 5000,

    level: 17,
    coins: 820,
    streak: 14,

    tasksToday: 4,
    tasksComplete: 4,

    theme: "Space Adventure",
    themeId: "space",

    pin: "2222",
  },


  {
    id: "sofia",
    name: "Sofia",
    age: 6,
    avatar: "🌈",
    color: "#EC4899",

    xp: 900,
    maxXp: 1500,

    level: 5,
    coins: 120,
    streak: 3,

    tasksToday: 2,
    tasksComplete: 1,

    theme: "Rainbow",
    themeId: "rainbow",

    pin: "3333",
  },

];



export const TASKS: Task[] = [

  {
    id: "task-1",
    title: "Make your bed",

    category: "Chores",
    catColor: "indigo",

    points: 10,
    difficulty: 1,

    assignedTo: [
      "emma",
      "sofia",
    ],

    status: "completed",

    recurring: true,
    frequency: "Daily",
  },


  {
    id: "task-2",
    title: "Read for 20 minutes",

    category: "Education",
    catColor: "emerald",

    points: 20,
    difficulty: 2,

    assignedTo:[
      "emma",
      "lucas",
    ],

    status:"pending",

    recurring:true,
    frequency:"Daily",
  },


  {
    id:"task-3",
    title:"Practice piano",

    category:"Skills",
    catColor:"amber",

    points:30,
    difficulty:3,

    assignedTo:[
      "emma",
    ],

    status:"pending",

    recurring:true,
    frequency:"Weekdays",
  },


  {
    id:"task-4",
    title:"Do homework",

    category:"Education",
    catColor:"emerald",

    points:25,
    difficulty:2,

    assignedTo:[
      "lucas",
    ],

    status:"completed",

    recurring:true,
    frequency:"Weekdays",
  },


  {
    id:"task-5",
    title:"Set the table",

    category:"Chores",
    catColor:"indigo",

    points:10,
    difficulty:1,

    assignedTo:[
      "lucas",
      "sofia",
    ],

    status:"pending",

    recurring:true,
    frequency:"Daily",
  },


  {
    id:"task-6",
    title:"Tidy your room",

    category:"Chores",
    catColor:"indigo",

    points:15,
    difficulty:2,

    assignedTo:[
      "emma",
      "lucas",
      "sofia",
    ],

    status:"pending",

    recurring:false,
    frequency:"Once",
  },


];





export const PENDING_REWARDS_INIT: RewardRequest[] = [

  {
    id:"reward-1",

    childId:"emma",
    childName:"Emma",
    childEmoji:"🦄",

    reward:"Screen time +30 min",

    cost:50,

    requestedAt:"2 hours ago",
  },


  {
    id:"reward-2",

    childId:"lucas",
    childName:"Lucas",
    childEmoji:"🚀",

    reward:"New game or toy",

    cost:500,

    requestedAt:"Yesterday",
  },

];





export const REWARDS_CATALOG: Reward[] = [

  {
    id:"reward-1",
    title:"Screen time +30 min",
    cost:50,
    icon:"📱",
  },


  {
    id:"reward-2",
    title:"Choose dinner tonight",
    cost:80,
    icon:"🍕",
  },


  {
    id:"reward-3",
    title:"Movie night pick",
    cost:100,
    icon:"🎬",
  },


  {
    id:"reward-4",
    title:"Skip one chore",
    cost:150,
    icon:"✨",
  },


  {
    id:"reward-5",
    title:"Sleepover with a friend",
    cost:300,
    icon:"🏕️",
  },


  {
    id:"reward-6",
    title:"New game or toy",
    cost:500,
    icon:"🎮",
  },

];





export const WEEKLY_DATA: WeeklyData[] = [

  {
    day:"Mon",
    emma:3,
    lucas:4,
    sofia:2,
  },

  {
    day:"Tue",
    emma:2,
    lucas:4,
    sofia:2,
  },

  {
    day:"Wed",
    emma:3,
    lucas:3,
    sofia:1,
  },

  {
    day:"Thu",
    emma:4,
    lucas:4,
    sofia:2,
  },

  {
    day:"Fri",
    emma:1,
    lucas:4,
    sofia:2,
  },

];





export const XP_DATA: XPData[] = [

  {
    week:"Week 1",
    emma:800,
    lucas:1200,
    sofia:300,
  },


  {
    week:"Week 2",
    emma:1400,
    lucas:2100,
    sofia:500,
  },


  {
    week:"Week 3",
    emma:2000,
    lucas:3000,
    sofia:700,
  },


  {
    week:"Week 4",
    emma:2840,
    lucas:4200,
    sofia:900,
  },

];





export const CATEGORY_DATA: CategoryData[] = [

  {
    name:"Chores",
    value:45,
    color:"#4F46E5",
  },


  {
    name:"Education",
    value:30,
    color:"#059669",
  },


  {
    name:"Skills",
    value:15,
    color:"#F59E0B",
  },


  {
    name:"Other",
    value:10,
    color:"#EC4899",
  },

];





export const SIDEBAR_NAV = [

  {
    id:"dashboard",
    label:"Dashboard",
    Icon:LayoutDashboard,
  },


  {
    id:"children",
    label:"Children",
    Icon:Users,
  },


  {
    id:"tasks",
    label:"Tasks",
    Icon:ListTodo,
  },


  {
    id:"rewards",
    label:"Rewards",
    Icon:Gift,
  },


  {
    id:"calendar",
    label:"Calendar",
    Icon:Calendar,
  },


  {
    id:"analytics",
    label:"Analytics",
    Icon:BarChart3,
  },


  {
    id:"settings",
    label:"Settings",
    Icon:Settings,
  },

];