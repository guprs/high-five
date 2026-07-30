import { useEffect, useMemo, useState } from "react";
import { CheckCircle, Clock, Download, Filter, Pencil, Plus, Repeat, Trash2, X } from "lucide-react";
import { CatBadge } from "../components/CatBadge";
import { Stars } from "../components/Stars";
import CreateTaskModal from "../components/tasks/CreateTaskModal";
import DeleteTaskButton from "../components/tasks/DeleteTaskButton";
import EditTaskModal from "../components/tasks/EditTaskModal";
import RoutineTemplateModal, {
  BuiltInRoutineTemplateCards,
  type RoutineTemplate,
} from "../components/tasks/RoutineTemplateModal";
import CustomRoutineTemplateModal from "../components/tasks/CustomRoutineTemplateModal";

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
  scheduledTime?: string | null;
  active?: boolean;
  createdAt?: string;
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

function customTemplateStorageKey() {
  try {
    const family = JSON.parse(localStorage.getItem("family") ?? "{}") as {
      id?: string;
    };
    return `high-five-routine-templates-${family.id ?? "local"}`;
  } catch {
    return "high-five-routine-templates-local";
  }
}

function loadCustomTemplates(): RoutineTemplate[] {
  try {
    const saved = JSON.parse(
      localStorage.getItem(customTemplateStorageKey()) ?? "[]",
    );
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

export default function TasksPage() {
  const [children, setChildren] = useState<Child[]>([]);
  const [tasks, setTasks] = useState<BackendTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showEditTask, setShowEditTask] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] =
    useState<RoutineTemplate | null>(null);
  const [showCustomTemplate, setShowCustomTemplate] = useState(false);
  const [customTemplateToEdit, setCustomTemplateToEdit] =
    useState<RoutineTemplate | null>(null);
  const [customTemplateToDelete, setCustomTemplateToDelete] =
    useState<RoutineTemplate | null>(null);
  const [customTemplates, setCustomTemplates] =
    useState<RoutineTemplate[]>(loadCustomTemplates);
  const [activeFilter, setActiveFilter] = useState<"all" | "chores" | "education" | "skills">("all");
  const [showFilters, setShowFilters] = useState(false);
  const [childFilter, setChildFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "done">("all");
  const [recurrenceFilter, setRecurrenceFilter] = useState<"all" | "one-time" | "recurring">("all");
  const [difficultyFilter, setDifficultyFilter] = useState<"all" | "1" | "2" | "3">("all");
  const [expandedTaskDescription, setExpandedTaskDescription] = useState<
    string | null
  >(null);
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
    void Promise.resolve().then(loadTasks);
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const categoryKey = getCategoryKey(task.category);
      if (activeFilter !== "all" && categoryKey !== activeFilter) {
        return false;
      }

      if (
        childFilter !== "all" &&
        !(task.childTasks ?? []).some(
          (entry) => entry.child.id === childFilter,
        )
      ) {
        return false;
      }

      if (
        statusFilter !== "all" &&
        (taskStatuses[task.id] ?? "pending") !== statusFilter
      ) {
        return false;
      }

      if (
        recurrenceFilter === "recurring" &&
        !task.recurring
      ) {
        return false;
      }

      if (
        recurrenceFilter === "one-time" &&
        task.recurring
      ) {
        return false;
      }

      if (
        difficultyFilter !== "all" &&
        (task.difficulty ?? 1) !== Number(difficultyFilter)
      ) {
        return false;
      }

      return true;
    });
  }, [
    activeFilter,
    childFilter,
    difficultyFilter,
    recurrenceFilter,
    statusFilter,
    taskStatuses,
    tasks,
  ]);

  const activeAdvancedFilters = [
    childFilter !== "all",
    statusFilter !== "all",
    recurrenceFilter !== "all",
    difficultyFilter !== "all",
  ].filter(Boolean).length;

  function clearAdvancedFilters() {
    setChildFilter("all");
    setStatusFilter("all");
    setRecurrenceFilter("all");
    setDifficultyFilter("all");
  }

  function escapeCsvCell(value: string | number) {
    const text = String(value);
    const safeText = /^[=+\-@]/.test(text) ? `'${text}` : text;
    return `"${safeText.replaceAll('"', '""')}"`;
  }

  function handleExport() {
    if (filteredTasks.length === 0) return;

    const headings = [
      "Task",
      "Description",
      "Assigned To",
      "Category",
      "Difficulty",
      "XP",
      "Status",
      "Recurring",
      "Frequency",
      "Time",
      "Created",
    ];
    const rows = filteredTasks.map((task) => [
      task.title,
      task.description ?? "",
      (task.childTasks ?? [])
        .map((entry) => entry.child.name)
        .join(", "),
      task.category ?? "Other",
      task.difficulty ?? 1,
      task.points ?? 0,
      taskStatuses[task.id] ?? "pending",
      task.recurring ? "Yes" : "No",
      task.frequency ?? "One-time",
      task.scheduledTime ?? "No time set",
      task.createdAt
        ? new Date(task.createdAt).toLocaleDateString("en-GB")
        : "",
    ]);
    const csv = [headings, ...rows]
      .map((row) => row.map(escapeCsvCell).join(","))
      .join("\n");
    const blob = new Blob([`\uFEFF${csv}`], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `high-five-tasks-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function saveCustomTemplate(template: RoutineTemplate) {
    setCustomTemplates((current) => {
      const exists = current.some((item) => item.id === template.id);
      const next = exists
        ? current.map((item) => (item.id === template.id ? template : item))
        : [...current, template];
      localStorage.setItem(customTemplateStorageKey(), JSON.stringify(next));
      return next;
    });
    setShowCustomTemplate(false);
    setCustomTemplateToEdit(null);
    setSelectedTemplate(template);
  }

  function deleteCustomTemplate() {
    if (!customTemplateToDelete) return;

    setCustomTemplates((current) => {
      const next = current.filter(
        (template) => template.id !== customTemplateToDelete.id,
      );
      localStorage.setItem(customTemplateStorageKey(), JSON.stringify(next));
      return next;
    });
    if (selectedTemplate?.id === customTemplateToDelete.id) {
      setSelectedTemplate(null);
    }
    setCustomTemplateToDelete(null);
  }

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
        scheduledTime: editingTask.scheduledTime ?? null,
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
        <button
          type="button"
          aria-expanded={showFilters}
          onClick={() => setShowFilters((current) => !current)}
          className={`ml-auto inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-1.5 text-sm font-medium transition ${
            showFilters || activeAdvancedFilters > 0
              ? "border-indigo-200 bg-indigo-50 text-indigo-700"
              : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
          }`}
        >
          <Filter className="h-3.5 w-3.5" />
          Filter
          {activeAdvancedFilters > 0 && (
            <span className="rounded-full bg-indigo-600 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
              {activeAdvancedFilters}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={handleExport}
          disabled={filteredTasks.length === 0}
          title="Export the tasks currently shown"
          className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Download className="h-3.5 w-3.5" />
          Export
        </button>
      </div>

      {showFilters && (
        <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">
                More filters
              </h2>
              <p className="text-xs text-gray-400">
                These filters also control which tasks are exported.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowFilters(false)}
              aria-label="Close task filters"
              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <FilterSelect
              label="Assigned child"
              value={childFilter}
              onChange={setChildFilter}
              options={[
                { value: "all", label: "All children" },
                ...children.map((child) => ({
                  value: child.id,
                  label: `${child.avatar} ${child.name}`,
                })),
              ]}
            />
            <FilterSelect
              label="Status"
              value={statusFilter}
              onChange={(value) =>
                setStatusFilter(value as typeof statusFilter)
              }
              options={[
                { value: "all", label: "All statuses" },
                { value: "pending", label: "Pending" },
                { value: "done", label: "Done" },
              ]}
            />
            <FilterSelect
              label="Schedule"
              value={recurrenceFilter}
              onChange={(value) =>
                setRecurrenceFilter(value as typeof recurrenceFilter)
              }
              options={[
                { value: "all", label: "Any schedule" },
                { value: "one-time", label: "One-time" },
                { value: "recurring", label: "Recurring" },
              ]}
            />
            <FilterSelect
              label="Difficulty"
              value={difficultyFilter}
              onChange={(value) =>
                setDifficultyFilter(value as typeof difficultyFilter)
              }
              options={[
                { value: "all", label: "Any difficulty" },
                { value: "1", label: "Easy" },
                { value: "2", label: "Medium" },
                { value: "3", label: "Hard" },
              ]}
            />
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 border-t border-gray-100 pt-3">
            <p className="text-xs text-gray-400">
              Showing {filteredTasks.length} of {tasks.length} tasks
            </p>
            <button
              type="button"
              onClick={clearAdvancedFilters}
              disabled={activeAdvancedFilters === 0}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 disabled:cursor-not-allowed disabled:text-gray-300"
            >
              Clear filters
            </button>
          </div>
        </section>
      )}

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
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-semibold ${status === "done" ? "text-gray-400 line-through" : "text-gray-900"}`}>
                        {task.title}
                      </span>
                      {task.recurring ? <Repeat className="h-3 w-3 text-gray-300" /> : null}
                    </div>
                    <span className="text-xs text-gray-400">
                      {task.frequency ?? "One-time"} ·{" "}
                      {task.scheduledTime ?? "No time set"}
                    </span>
                    {task.description ? (
                      <div className="mt-1">
                        <p
                          className={`text-xs leading-relaxed text-gray-500 ${
                            expandedTaskDescription === task.id
                              ? ""
                              : "line-clamp-2"
                          }`}
                        >
                          {task.description}
                        </p>
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedTaskDescription((current) =>
                              current === task.id ? null : task.id,
                            )
                          }
                          className="mt-0.5 text-[11px] font-semibold text-indigo-600 hover:text-indigo-700"
                        >
                          {expandedTaskDescription === task.id
                            ? "Show less"
                            : "View full description"}
                        </button>
                      </div>
                    ) : null}
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
          <BuiltInRoutineTemplateCards onSelect={setSelectedTemplate} />
          {customTemplates.map((template) => (
            <div
              key={template.id}
              className="relative rounded-xl border border-gray-200 transition-all hover:border-indigo-300 hover:bg-indigo-50/30"
            >
              <button
                type="button"
                onClick={() => setSelectedTemplate(template)}
                className="flex h-full w-full items-center gap-3 p-3.5 pr-18 text-left"
              >
                <span className="shrink-0 text-2xl">{template.emoji}</span>
                <span>
                  <span className="block text-sm font-semibold text-gray-900">
                    {template.title}
                  </span>
                  <span className="block text-xs text-gray-400">
                    {template.tasks.length} tasks · Custom
                  </span>
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setCustomTemplateToEdit(template);
                  setShowCustomTemplate(true);
                }}
                aria-label={`Edit ${template.title}`}
                className="absolute top-1/2 right-2 -translate-y-1/2 rounded-lg p-2 text-gray-400 hover:bg-white hover:text-indigo-600"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setCustomTemplateToDelete(template)}
                aria-label={`Delete ${template.title}`}
                className="absolute top-1/2 right-9 -translate-y-1/2 rounded-lg p-2 text-gray-400 hover:bg-rose-50 hover:text-rose-600"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              setCustomTemplateToEdit(null);
              setShowCustomTemplate(true);
            }}
            className="flex min-h-18 items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 p-3.5 text-sm font-semibold text-gray-400 transition hover:border-indigo-300 hover:bg-indigo-50/30 hover:text-indigo-600"
          >
            <Plus className="h-4 w-4" />
            Create Template
          </button>
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

      {selectedTemplate ? (
        <RoutineTemplateModal
          template={selectedTemplate}
          familyChildren={children}
          existingTasks={tasks}
          onCreated={loadTasks}
          onClose={() => setSelectedTemplate(null)}
        />
      ) : null}

      {showCustomTemplate ? (
        <CustomRoutineTemplateModal
          template={customTemplateToEdit ?? undefined}
          onSave={saveCustomTemplate}
          onClose={() => {
            setShowCustomTemplate(false);
            setCustomTemplateToEdit(null);
          }}
        />
      ) : null}

      {customTemplateToDelete ? (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-template-title"
        >
          <div className="w-full max-w-sm rounded-2xl border border-gray-100 bg-white p-5 shadow-2xl">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
              <Trash2 className="h-5 w-5" />
            </div>
            <h2
              id="delete-template-title"
              className="mt-4 text-lg font-bold text-gray-900"
            >
              Delete custom template?
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-gray-500">
              “{customTemplateToDelete.title}” will be removed from this
              browser. Tasks already created from it will not be deleted.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setCustomTemplateToDelete(null)}
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={deleteCustomTemplate}
                className="rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700"
              >
                Delete Template
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

interface FilterSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: FilterSelectProps) {
  return (
    <label className="text-xs font-semibold text-gray-500">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm font-medium text-gray-700 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-3 focus:ring-indigo-100"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
