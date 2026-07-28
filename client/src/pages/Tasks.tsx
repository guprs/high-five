import { useEffect, useMemo, useState } from "react";
import { CheckCircle, Clock, Download, Filter, Pencil, Plus, Repeat } from "lucide-react";
import { CatBadge } from "../components/CatBadge";
import { Stars } from "../components/Stars";
import CreateTaskModal from "../components/tasks/CreateTaskModal";
import DeleteTaskButton from "../components/tasks/DeleteTaskButton";
import EditTaskModal from "../components/tasks/EditTaskModal";

import { getChildren } from "../services/child";
import { getTasks } from "../services/task";

import type { Child, Task } from "../types/dashboard";

interface BackendTask {
  id: string;
  title: string;
  description?: string;
  category?: string;
  points?: number;
  difficulty?: number;
  recurring?: boolean;
  frequency?: string | null;
  active?: boolean;
  childTasks?: Array<{
    child: {
      id: string;
      name: string;
      avatar?: string;
      emoji?: string;
      theme?: string;
    };
  }>;
}

function getThemeColor(theme?: string) {
  switch (theme) {
    case "Princess Kingdom":
      return "#ec4899";
    case "Space Adventure":
      return "#6366f1";
    case "Rainbow":
      return "#f59e0b";
    case "Jungle Explorer":
      return "#22c55e";
    case "Ocean Adventure":
      return "#06b6d4";
    case "Pirate Island":
      return "#c2410c";
    case "Dinosaurs":
      return "#8b5cf6";
    case "Retro Pixel":
      return "#4f46e5";
    default:
      return "#6366f1";
  }
}

export default function TasksPage() {
  const [children, setChildren] = useState<Child[]>([]);
  const [tasks, setTasks] = useState<BackendTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showEditTask, setShowEditTask] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<"all" | "chores" | "education" | "skills">("all");
  const [taskStatuses, setTaskStatuses] = useState<Record<string, "pending" | "done">>({});
  const [error, setError] = useState("");

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const childrenData = await getChildren();
      const mappedChildren = childrenData.map((child, index) => ({
        id: child.id,
        name: child.name ?? "Unknown",
        age: child.age ?? 0,
        avatar: child.avatar ?? child.emoji ?? "🙂",
        color: child.color ?? getThemeColor(child.theme) ?? ["#6366f1", "#ec4899"][index % 2],
        xp: child.xp ?? 0,
        maxXp: child.maxXp ?? 1000,
        level: child.level ?? 1,
        coins: child.coins ?? 0,
        streak: child.streak ?? 0,
        tasksToday: child.tasksToday ?? 0,
        tasksComplete: child.tasksComplete ?? 0,
        theme: child.theme ?? "Space Adventure",
        themeId: child.themeId ?? "space",
        pin: child.pin ?? "",
      }));

      setChildren(mappedChildren);

      const tasksData = await getTasks();
      setTasks(tasksData ?? []);
      setTaskStatuses((prev) => {
        const next = { ...prev };
        const normalizedTasks = (tasksData ?? []) as BackendTask[];
        normalizedTasks.forEach((task: BackendTask) => {
          if (!next[task.id]) {
            next[task.id] = "pending";
          }
        });
        return next;
      });
    } catch (err) {
      console.error("Failed to load tasks", err);
      setError("We couldn’t load your family tasks right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadTasks();
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (activeFilter === "all") {
        return true;
      }

      const categoryKey = getCategoryKey(task.category);
      return categoryKey === activeFilter;
    });
  }, [activeFilter, tasks]);

  function getCategoryKey(category?: string) {
    const normalized = (category ?? "Other").toLowerCase();

    if (normalized.includes("chores")) {
      return "chores";
    }

    if (normalized.includes("school") || normalized.includes("education")) {
      return "education";
    }

    if (normalized.includes("health") || normalized.includes("skill") || normalized.includes("pet")) {
      return "skills";
    }

    return "skills";
  }

  const editingTask = tasks.find((task) => task.id === showEditTask);
  const modalTask = editingTask
    ? ({
        id: editingTask.id,
        title: editingTask.title,
        description: editingTask.description,
        category: editingTask.category ?? "Other",
        catColor: "indigo",
        points: editingTask.points ?? 0,
        difficulty: editingTask.difficulty ?? 1,
        assignedTo: (editingTask.childTasks ?? []).map((entry) => entry.child.id),
        status: (taskStatuses[editingTask.id] ?? "pending") === "done" ? "completed" : "pending",
        recurring: editingTask.recurring ?? false,
        frequency: editingTask.frequency ?? null,
        childTasks: (editingTask.childTasks ?? []).map((entry) => ({
          child: {
            id: entry.child.id,
            name: entry.child.name,
            avatar: entry.child.avatar ?? entry.child.emoji ?? "🙂",
            theme: entry.child.theme ?? "Space Adventure",
          },
        })),
      } satisfies Task)
    : null;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Task Management</h1>
          <p className="mt-1 text-sm text-gray-400">Create and assign tasks to your family</p>
        </div>
        <button
          onClick={() => setShowCreateTask(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          New Task
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {[
          { key: "all", label: "All Tasks" },
          { key: "chores", label: "Chores" },
          { key: "education", label: "Education" },
          { key: "skills", label: "Skills" },
        ].map((filter) => {
          const active = activeFilter === filter.key;
          return (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key as typeof activeFilter)}
              className={`rounded-xl px-3.5 py-1.5 text-sm font-semibold capitalize transition-all ${
                active ? "bg-indigo-600 text-white shadow-sm" : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {filter.label}
            </button>
          );
        })}
        <button className="ml-auto inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50">
          <Filter className="h-3.5 w-3.5" />
          Filter
        </button>
        <button className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50">
          <Download className="h-3.5 w-3.5" />
          Export
        </button>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center text-sm text-gray-500 shadow-sm">
          Loading tasks...
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">No tasks match this view</h2>
          <p className="mt-2 text-sm text-gray-500">Try switching the filters or add a fresh task for the family.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="hidden border-b border-gray-100 bg-gray-50 px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-gray-400 md:grid" style={{ gridTemplateColumns: "1fr 100px 110px 80px 64px 100px 80px" }}>
            <span>Task</span>
            <span>Assigned To</span>
            <span>Category</span>
            <span>Difficulty</span>
            <span>XP</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

          <div className="divide-y divide-gray-50">
            {filteredTasks.map((task) => {
              const assignedChildren = task.childTasks ?? [];
              const status = taskStatuses[task.id] ?? "pending";

              return (
                <div
                  key={task.id}
                  className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-gray-50/60 md:grid"
                  style={{ gridTemplateColumns: "1fr 100px 110px 80px 64px 100px 80px" }}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-semibold ${status === "done" ? "text-gray-400 line-through" : "text-gray-900"}`}>
                        {task.title}
                      </span>
                      {task.recurring ? <Repeat className="h-3 w-3 text-gray-300" /> : null}
                    </div>
                    <span className="text-xs text-gray-400">{task.frequency ?? "One-time"}</span>
                  </div>

                  <div className="flex -space-x-1">
                    {assignedChildren.length > 0 ? (
                      assignedChildren.map((entry) => {
                        const child = entry.child;
                        const displayChild = {
                          id: child.id,
                          name: child.name,
                          age: 0,
                          avatar: child.avatar ?? child.emoji ?? "🙂",
                          color: getThemeColor(child.theme) ?? "#6366f1",
                          xp: 0,
                          maxXp: 1000,
                          level: 1,
                          coins: 0,
                          streak: 0,
                          tasksToday: 0,
                          tasksComplete: 0,
                          theme: child.theme ?? "Space Adventure",
                          themeId: child.theme ?? "space",
                          pin: "",
                        } satisfies Child;

                        return (
                          <div
                            key={child.id}
                            title={child.name}
                            className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] ring-2 ring-white"
                            style={{ backgroundColor: `${displayChild.color}33` }}
                          >
                            {displayChild.avatar}
                          </div>
                        );
                      })
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </div>

                  <CatBadge category={task.category ?? "Other"} />
                  <Stars level={task.difficulty ?? 1} />
                  <span className="text-xs font-bold text-indigo-600">+{task.points ?? 0}</span>

                  <div>
                    {status === "done" ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                        <CheckCircle className="h-3 w-3" />
                        Done
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700">
                        <Clock className="h-3 w-3" />
                        Pending
                      </span>
                    )}
                  </div>

                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setShowEditTask(task.id)}
                      className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <DeleteTaskButton taskId={task.id} onDeleted={loadTasks} compact />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <h3 className="mb-1 font-semibold text-gray-900">Quick Templates</h3>
        <p className="mb-4 text-xs text-gray-400">Add a complete routine in one click</p>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[['🌅', 'Morning Routine', '5 tasks'], ['🎒', 'After School', '3 tasks'], ['🏡', 'Weekend Chores', '6 tasks'], ['🌙', 'Bedtime Routine', '4 tasks']].map(([emoji, title, subtitle]) => (
            <button key={title} className="flex items-center gap-3 rounded-xl border border-gray-200 p-3.5 text-left transition-all hover:border-indigo-300 hover:bg-indigo-50/30">
              <span className="shrink-0 text-2xl">{emoji}</span>
              <div>
                <div className="text-sm font-semibold text-gray-900">{title}</div>
                <div className="text-xs text-gray-400">{subtitle}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {showCreateTask ? (
        <CreateTaskModal
          familyChildren={children}
          onCreated={loadTasks}
          onClose={() => setShowCreateTask(false)}
        />
      ) : null}

      {modalTask ? (
        <EditTaskModal
          task={modalTask}
          onClose={() => setShowEditTask(null)}
          onSaved={loadTasks}
        />
      ) : null}
    </div>
  );
}
