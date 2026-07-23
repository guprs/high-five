export interface Child {
  id: number;
  name: string;
  age: number;
  emoji: string;
  color: string;

  xp: number;
  maxXp: number;
  level: number;
  coins: number;
  streak: number;

  tasksToday: number;
  tasksComplete: number;

  theme: string;
  themeId: string;
  pin: string;
}


export type ParentTab =
  | "dashboard"
  | "children"
  | "tasks"
  | "rewards"
  | "calendar"
  | "analytics"
  | "settings";


export interface Task {
  id: number;
  title: string;
  category: string;
  catColor: string;
  points: number;
  difficulty: number;
  assignedTo: number[];
  status: "completed" | "pending";
  recurring: boolean;
  frequency: string;
}


export interface RewardRequest {
  id: number;
  childId: number;
  childName: string;
  childEmoji: string;
  reward: string;
  cost: number;
  requestedAt: string;
}