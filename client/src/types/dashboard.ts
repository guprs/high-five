export type ParentTab =
  | "dashboard"
  | "children"
  | "tasks"
  | "rewards"
  | "calendar"
  | "analytics"
  | "settings";


export type Child = {
  id: string;

  name: string;
  age: number;

  avatar: string;
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
};


export type TaskStatus =
  | "completed"
  | "pending";


export interface Task {
  id: string;

  title: string;

  description?: string;

  category: string;

  points: number;

  difficulty: number;

  recurring: boolean;

  frequency: string | null;

  childTasks?: {
    child: {
      id: string;
      name: string;
      avatar: string;
      color: string;
      theme: string;
    };
  }[];

}
export interface RewardRequest {
  id: string;

  childId: string;
  childName: string;
  childEmoji: string;

  reward: string;
  cost: number;

  requestedAt: string;
}


export interface Reward {
  id: string;

  title: string;
  cost: number;
  icon: string;
}


export interface WeeklyData {
  day: string;

  emma: number;
  lucas: number;
  sofia: number;
}


export interface XPData {
  week: string;

  emma: number;
  lucas: number;
  sofia: number;
}


export interface CategoryData {
  name: string;
  value: number;
  color: string;
}