import { useEffect, useState } from "react";
import { getChildren } from "../../services/child";
import { getTasks, type ApiTask } from "../../services/task";
import { getKidTasks, getTodayCompletions } from "../../services/kidMode";
import type { Child, Task } from "../../types/dashboard";
import {
  normalizeChildren,
  normalizeTask,
  taskOccursOnDate,
} from "../../utils/calendar";
import CreateTaskModal from "../tasks/CreateTaskModal";
import ChildrenOverview from "./ChildrenOverview";
import DashboardStats from "./DashboardStats";
import RewardRequests from "./RewardRequests";
import TaskSnapshot from "./TaskSnapshot";
import PageHeader from "../PageHeader";

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

interface Props {
  onViewTasks: () => void;
}

export default function DashboardTab({ onViewTasks }: Props) {
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
      const normalizedTasks: Task[] = (tasksData ?? [])
        .filter((task: ApiTask) => task.active !== false)
        .map((task: ApiTask) => normalizeTask(task));
      const todaysTasks = normalizedTasks.filter((task) =>
        taskOccursOnDate(task, today, today),
      );

      const normalizedChildren = normalizeChildren(childrenData);
      const childTaskEntries = await Promise.all(
        normalizedChildren.map(async (child) => {
          const [assignedTasks, completions] = await Promise.all([
            getKidTasks(child.id).catch(() => []),
            getTodayCompletions(child.id).catch(() => []),
          ]);
          return [child.id, { assignedTasks, completions }] as const;
        }),
      );
      const taskDataByChild = new Map(childTaskEntries);
      const todayCompletions = childTaskEntries.flatMap(
        ([, childTaskData]) => childTaskData.completions,
      );

      const mappedChildren = normalizedChildren.map((child) => {
        const childTaskData = taskDataByChild.get(child.id);
        const assignedTasks = (childTaskData?.assignedTasks ?? []).filter(
          (task) =>
            task.active !== false &&
            taskOccursOnDate(normalizeTask(task), today, today),
        );
        const completedTaskIds = new Set(
          (childTaskData?.completions ?? []).map((completion) => completion.taskId),
        );
        const completedTasks = assignedTasks.filter((task) => completedTaskIds.has(task.id));

        return {
          ...child,
          tasksToday: assignedTasks.length,
          tasksComplete: completedTasks.length,
        };
      });

      setChildren(mappedChildren);
      setTasks(todaysTasks.map((task) => ({
        ...task,
        completions: todayCompletions.filter(
          (completion) => completion.taskId === task.id,
        ),
      })));
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
      <PageHeader
        title={<>{getGreeting()}, {getParentFirstName()}! 👋</>}
        description={<>{getTodayDate()} · Here&apos;s your family overview</>}
        action={<button
          type="button"
          onClick={() => setShowCreateTask(true)}
          className="w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 sm:w-auto"
        >
          + Quick Add Task
        </button>}
      />

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

      <TaskSnapshot tasks={tasks} onViewAll={onViewTasks} />

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
