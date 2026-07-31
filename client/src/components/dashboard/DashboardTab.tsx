import { useEffect, useState } from "react";
import { getChildren } from "../../services/child";
import { getTasks, type ApiTask } from "../../services/task";
import type { Child, Task } from "../../types/dashboard";
import {
  normalizeChildren,
  normalizeTask,
  taskOccursOnDate,
  toDateInputValue,
} from "../../utils/calendar";
import CreateTaskModal from "../tasks/CreateTaskModal";
import ChildrenOverview from "./ChildrenOverview";
import DashboardStats from "./DashboardStats";
import RewardRequests from "./RewardRequests";
import TaskSnapshot from "./TaskSnapshot";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function getTodayDate() {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());
}

function getParentFirstName() {
  try {
    const user = JSON.parse(localStorage.getItem("user") ?? "{}") as {
      name?: string;
    };
    return user.name?.trim().split(/\s+/)[0] || "Parent";
  } catch {
    return "Parent";
  }
}

export default function DashboardTab() {
  const [children, setChildren] = useState<Child[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateTask, setShowCreateTask] = useState(false);

  const loadDashboardData = async () => {
    try {
      const [childrenData, tasksData] = await Promise.all([
        getChildren(),
        getTasks(),
      ]);
      const today = new Date();
      const todayKey = toDateInputValue(today);
      const normalizedTasks: Task[] = (tasksData ?? []).map((task: ApiTask) =>
        normalizeTask(task),
      );
      const todaysTasks = normalizedTasks.filter((task) =>
        taskOccursOnDate(task, today, today),
      );

      const mappedChildren = normalizeChildren(childrenData).map((child) => {
        const assignedTasks = todaysTasks.filter((task) =>
          task.assignedTo.includes(child.id),
        );
        const completedTasks = assignedTasks.filter((task) =>
          (task.completions ?? []).some(
            (completion) =>
              completion.childId === child.id &&
              completion.date.slice(0, 10) === todayKey,
          ),
        );

        return {
          ...child,
          tasksToday: assignedTasks.length,
          tasksComplete: completedTasks.length,
        };
      });

      setChildren(mappedChildren);
      setTasks(todaysTasks);
    } catch (error) {
      console.error("Failed loading dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- state updates after the initial async request resolves.
    void loadDashboardData();
  }, []);

  const totalToday = children.reduce(
    (sum, child) => sum + child.tasksToday,
    0,
  );
  const totalDone = children.reduce(
    (sum, child) => sum + child.tasksComplete,
    0,
  );
  const percentage =
    totalToday === 0 ? 0 : Math.round((totalDone / totalToday) * 100);
  const streakLeader = children.reduce<Child | undefined>(
    (leader, child) => (!leader || child.streak > leader.streak ? child : leader),
    undefined,
  );
  const familyXp = children.reduce((sum, child) => sum + child.xp, 0);

  if (loading) {
    return <div className="p-10 text-center text-gray-500">Loading dashboard...</div>;
  }

  return (
    <div className="min-w-0 space-y-4 sm:space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            {getGreeting()}, {getParentFirstName()}! 👋
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            {getTodayDate()} · Here&apos;s your family overview
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateTask(true)}
          className="w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 sm:w-auto"
        >
          + Quick Add Task
        </button>
      </div>

      <DashboardStats
        totalDone={totalDone}
        totalToday={totalToday}
        percentage={percentage}
        topStreak={streakLeader?.streak ?? 0}
        topStreakName={streakLeader?.name}
        familyXp={familyXp}
        childrenCount={children.length}
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <ChildrenOverview children={children} />
        <RewardRequests />
      </div>

      <TaskSnapshot tasks={tasks} />

      {showCreateTask && (
        <CreateTaskModal
          familyChildren={children}
          onCreated={loadDashboardData}
          onClose={() => setShowCreateTask(false)}
        />
      )}
    </div>
  );
}
