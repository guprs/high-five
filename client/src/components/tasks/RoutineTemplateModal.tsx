import { useMemo, useState } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Layers3,
  LoaderCircle,
  X,
} from "lucide-react";

import {
  assignTaskToChild,
  createTask,
  updateTask as updateExistingTask,
} from "../../services/tasks";
import type { Child } from "../../types/dashboard";
import { ChildAvatar } from "../ChildAvatar";

export interface RoutineTemplateTask {
  title: string;
  description: string;
  category: string;
  difficulty: number;
  points: number;
  recurring: boolean;
  frequency?: string;
}

export interface RoutineTemplate {
  id: string;
  emoji: string;
  title: string;
  description: string;
  tasks: RoutineTemplateTask[];
}

const ROUTINE_TEMPLATES: RoutineTemplate[] = [
  {
    id: "morning",
    emoji: "🌅",
    title: "Morning Routine",
    description: "A calm start before school or the day ahead.",
    tasks: [
      {
        title: "Make the bed",
        description: "Straighten the duvet and place the pillow at the top.",
        category: "🧹 Chores",
        difficulty: 1,
        points: 10,
        recurring: true,
        frequency: "Daily",
      },
      {
        title: "Get dressed",
        description: "Choose suitable clothes and get ready for the day.",
        category: "🧠 Skills",
        difficulty: 1,
        points: 15,
        recurring: true,
        frequency: "Daily",
      },
      {
        title: "Brush teeth",
        description: "Brush carefully as part of the morning routine.",
        category: "🧠 Skills",
        difficulty: 1,
        points: 10,
        recurring: true,
        frequency: "Daily",
      },
      {
        title: "Pack the school bag",
        description: "Use the school list to pack everything needed today.",
        category: "📚 Education",
        difficulty: 2,
        points: 20,
        recurring: true,
        frequency: "Weekdays",
      },
      {
        title: "Clear breakfast dishes",
        description: "Take safe breakfast items to the kitchen.",
        category: "🧹 Chores",
        difficulty: 1,
        points: 10,
        recurring: true,
        frequency: "Daily",
      },
    ],
  },
  {
    id: "after-school",
    emoji: "🎒",
    title: "After School",
    description: "Reset, prepare and finish the important things.",
    tasks: [
      {
        title: "Put away school things",
        description: "Place shoes, coat and school bag in their usual places.",
        category: "🧹 Chores",
        difficulty: 1,
        points: 15,
        recurring: true,
        frequency: "Weekdays",
      },
      {
        title: "Complete homework",
        description: "Check the school planner and complete today's homework.",
        category: "📚 Education",
        difficulty: 2,
        points: 30,
        recurring: true,
        frequency: "Weekdays",
      },
      {
        title: "Prepare for tomorrow",
        description: "Check tomorrow's schedule and pack what will be needed.",
        category: "🧠 Skills",
        difficulty: 2,
        points: 20,
        recurring: true,
        frequency: "Weekdays",
      },
    ],
  },
  {
    id: "weekend",
    emoji: "🏡",
    title: "Weekend Chores",
    description: "Small contributions to care for the family home.",
    tasks: [
      {
        title: "Tidy the bedroom",
        description: "Return belongings to their places and clear the floor.",
        category: "🧹 Chores",
        difficulty: 2,
        points: 25,
        recurring: true,
        frequency: "Weekends",
      },
      {
        title: "Sort the laundry",
        description: "Place clothes into the correct laundry groups.",
        category: "🧹 Chores",
        difficulty: 1,
        points: 15,
        recurring: true,
        frequency: "Weekends",
      },
      {
        title: "Help with recycling",
        description: "Sort safe recycling items into the correct containers.",
        category: "🧹 Chores",
        difficulty: 2,
        points: 20,
        recurring: true,
        frequency: "Weekends",
      },
      {
        title: "Water the plants",
        description: "Check which plants need water and give them the right amount.",
        category: "🧹 Chores",
        difficulty: 1,
        points: 15,
        recurring: true,
        frequency: "Weekends",
      },
      {
        title: "Dust one room",
        description: "Use a safe cloth to dust reachable surfaces.",
        category: "🧹 Chores",
        difficulty: 2,
        points: 20,
        recurring: true,
        frequency: "Weekends",
      },
      {
        title: "Choose one family helper job",
        description: "Ask which small job would help the family most today.",
        category: "🧠 Skills",
        difficulty: 2,
        points: 20,
        recurring: true,
        frequency: "Weekends",
      },
    ],
  },
  {
    id: "bedtime",
    emoji: "🌙",
    title: "Bedtime Routine",
    description: "A predictable sequence for winding down.",
    tasks: [
      {
        title: "Put away today's things",
        description: "Return clothes and belongings to their usual places.",
        category: "🧹 Chores",
        difficulty: 1,
        points: 10,
        recurring: true,
        frequency: "Daily",
      },
      {
        title: "Prepare clothes for tomorrow",
        description: "Choose suitable clothes and place them ready for morning.",
        category: "🧠 Skills",
        difficulty: 1,
        points: 15,
        recurring: true,
        frequency: "Daily",
      },
      {
        title: "Brush teeth before bed",
        description: "Brush carefully as part of the bedtime routine.",
        category: "🧠 Skills",
        difficulty: 1,
        points: 10,
        recurring: true,
        frequency: "Daily",
      },
      {
        title: "Read or listen for 10 minutes",
        description: "Choose a book or audiobook for a calm end to the day.",
        category: "📚 Education",
        difficulty: 1,
        points: 15,
        recurring: true,
        frequency: "Daily",
      },
    ],
  },
];

export function BuiltInRoutineTemplateCards({
  onSelect,
}: {
  onSelect: (template: RoutineTemplate) => void;
}) {
  return (
    <>
      {ROUTINE_TEMPLATES.map((template) => (
        <button
          key={template.id}
          type="button"
          onClick={() => onSelect(template)}
          className="flex items-center gap-3 rounded-xl border border-gray-200 p-3.5 text-left transition-all hover:border-indigo-300 hover:bg-indigo-50/30"
        >
          <span className="shrink-0 text-2xl">{template.emoji}</span>
          <span>
            <span className="block text-sm font-semibold text-gray-900">
              {template.title}
            </span>
            <span className="block text-xs text-gray-400">
              {template.tasks.length} tasks
            </span>
          </span>
        </button>
      ))}
    </>
  );
}

interface Props {
  template: RoutineTemplate;
  familyChildren: Child[];
  existingTasks: ExistingRoutineTask[];
  onClose: () => void;
  onCreated: () => Promise<void>;
}

export interface ExistingRoutineTask {
  id: string;
  title: string;
  description?: string;
  category?: string;
  difficulty?: number;
  points?: number;
  recurring?: boolean;
  frequency?: string | null;
  childTasks?: Array<{ child: { id: string } }>;
}

type EditableTask = RoutineTemplateTask & {
  id: string;
  included: boolean;
};

export default function RoutineTemplateModal({
  template,
  familyChildren,
  existingTasks,
  onClose,
  onCreated,
}: Props) {
  const [step, setStep] = useState<1 | 2>(1);
  const [tasks, setTasks] = useState<EditableTask[]>(
    template.tasks.map((task, index) => ({
      ...task,
      id: `${template.id}-${index}`,
      included: !isTaskUnchanged(task, findExistingTask(existingTasks, task.title)),
    })),
  );
  const [selectedChildren, setSelectedChildren] = useState<string[]>([]);
  const [creating, setCreating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [failedTasks, setFailedTasks] = useState<string[]>([]);
  const [complete, setComplete] = useState(false);
  const [error, setError] = useState("");

  const includedTasks = useMemo(
    () => tasks.filter((task) => task.included && task.title.trim()),
    [tasks],
  );

  function matchingExistingTask(title: string) {
    return findExistingTask(existingTasks, title);
  }

  function updateTask(id: string, updates: Partial<EditableTask>) {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, ...updates } : task,
      ),
    );
  }

  function toggleChild(id: string) {
    setSelectedChildren((current) =>
      current.includes(id)
        ? current.filter((childId) => childId !== id)
        : [...current, id],
    );
  }

  function continueToAssignment() {
    if (includedTasks.length === 0) {
      setError("Keep at least one task in this routine.");
      return;
    }
    setError("");
    setStep(2);
  }

  async function createRoutine() {
    if (selectedChildren.length === 0) {
      setError("Select at least one child.");
      return;
    }

    setCreating(true);
    setError("");
    setFailedTasks([]);
    const failures: string[] = [];

    for (let index = 0; index < includedTasks.length; index += 1) {
      const task = includedTasks[index];
      try {
        const taskData = {
          title: task.title.trim(),
          description: task.description,
          category: task.category,
          difficulty: task.difficulty,
          points: task.points,
          recurring: task.recurring,
          frequency: task.frequency,
        };
        const existingTask = matchingExistingTask(task.title);
        const taskId = existingTask
          ? (
              await updateExistingTask(existingTask.id, taskData)
            ).task.id
          : (await createTask(taskData)).task.id;
        const existingChildIds = new Set(
          existingTask?.childTasks?.map((entry) => entry.child.id) ?? [],
        );
        await Promise.all(
          selectedChildren
            .filter((childId) => !existingChildIds.has(childId))
            .map((childId) => assignTaskToChild(childId, taskId)),
        );
      } catch {
        failures.push(task.title);
      }
      setProgress(index + 1);
    }

    setFailedTasks(failures);
    setComplete(true);
    setCreating(false);
    await onCreated();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-center bg-slate-950/55 backdrop-blur-sm sm:items-center sm:p-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="routine-template-title"
        className="flex h-[100dvh] w-full max-w-3xl flex-col overflow-hidden bg-white shadow-2xl sm:h-auto sm:max-h-[90vh] sm:rounded-3xl sm:border sm:border-gray-100"
      >
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-gray-100 px-5 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-xl">
              {template.emoji}
            </div>
            <div>
              <h2
                id="routine-template-title"
                className="text-lg font-bold text-gray-900"
              >
                {template.title}
              </h2>
              <p className="text-xs text-gray-400">
                {complete
                  ? "Routine creation complete"
                  : step === 1
                    ? "Choose and customise tasks"
                    : "Assign the routine"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close routine template"
            className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {!complete && (
          <div className="grid shrink-0 grid-cols-2 border-b border-gray-100 bg-gray-50 px-5 sm:px-6">
            <StepButton number={1} label="Tasks" active={step === 1} />
            <StepButton number={2} label="Assign" active={step === 2} />
          </div>
        )}

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          {complete ? (
            <CompletionView
              created={includedTasks.length - failedTasks.length}
              failedTasks={failedTasks}
            />
          ) : step === 1 ? (
            <div>
              <p className="mb-3 text-sm text-gray-500">
                {template.description} Untick anything you don&apos;t need and
                edit task names before continuing.
              </p>
              <div className="space-y-2">
                {tasks.map((task) => (
                  (() => {
                    const existingTask = matchingExistingTask(task.title);
                    const unchanged = isTaskUnchanged(task, existingTask);
                    const hasUpdates = Boolean(existingTask) && !unchanged;
                    return (
                  <div
                    key={task.id}
                    className={`flex items-center gap-3 rounded-xl border p-3 transition ${
                      task.included
                        ? "border-gray-200 bg-white"
                        : "border-gray-100 bg-gray-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={task.included}
                      disabled={unchanged}
                      onChange={(event) =>
                        updateTask(task.id, {
                          included: event.target.checked,
                        })
                      }
                      aria-label={`Include ${task.title}`}
                      className="h-4 w-4 shrink-0 rounded border-gray-300 text-indigo-600 disabled:opacity-40"
                    />
                    <input
                      value={task.title}
                      onChange={(event) => {
                        const nextTitle = event.target.value;
                        const nextExistingTask =
                          matchingExistingTask(nextTitle);
                        updateTask(task.id, {
                          title: nextTitle,
                          included: !isTaskUnchanged(
                            { ...task, title: nextTitle },
                            nextExistingTask,
                          ),
                        });
                      }}
                      aria-label="Task name"
                      className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-gray-900 outline-none"
                    />
                    {unchanged ? (
                      <span className="shrink-0 rounded-full bg-amber-100 px-2 py-1 text-[10px] font-bold text-amber-700">
                        Already added
                      </span>
                    ) : hasUpdates ? (
                      <span className="shrink-0 rounded-full bg-sky-100 px-2 py-1 text-[10px] font-bold text-sky-700">
                        Will update
                      </span>
                    ) : (
                      <span className="shrink-0 text-[10px] font-bold text-indigo-600">
                        +{task.points} XP
                      </span>
                    )}
                  </div>
                    );
                  })()
                ))}
              </div>
              {error && <ErrorMessage message={error} />}
            </div>
          ) : (
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Who should receive this routine?
              </h3>
              <p className="mt-1 text-xs text-gray-400">
                Every selected child receives all {includedTasks.length} tasks.
              </p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {familyChildren.map((child) => {
                  const selected = selectedChildren.includes(child.id);
                  return (
                    <button
                      key={child.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => toggleChild(child.id)}
                      className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${
                        selected
                          ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                          : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <ChildAvatar child={child} size="sm" />
                      <span className="min-w-0 flex-1 truncate text-sm font-semibold">
                        {child.name}
                      </span>
                      {selected && <Check className="h-4 w-4" />}
                    </button>
                  );
                })}
              </div>

              {creating && (
                <div className="mt-5 rounded-xl bg-indigo-50 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-indigo-700">
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    Applying task {progress + 1} of {includedTasks.length}
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-indigo-100">
                    <div
                      className="h-full rounded-full bg-indigo-600 transition-[width]"
                      style={{
                        width: `${(progress / includedTasks.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              )}
              {error && <ErrorMessage message={error} />}
            </div>
          )}
        </div>

        <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-gray-100 bg-white px-5 py-4 sm:px-6">
          {complete ? (
            <>
              <span className="text-xs text-gray-400">
                {failedTasks.length
                  ? "Review the result before closing."
                  : "The routine is ready."}
              </span>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Done
              </button>
            </>
          ) : step === 1 ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={continueToAssignment}
                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Continue
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setStep(1)}
                disabled={creating}
                className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </button>
              <button
                type="button"
                onClick={() => void createRoutine()}
                disabled={creating}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-60"
              >
                {creating && <LoaderCircle className="h-4 w-4 animate-spin" />}
                {creating
                  ? "Applying..."
                  : `Apply ${includedTasks.length} ${
                      includedTasks.length === 1 ? "Change" : "Changes"
                    }`}
              </button>
            </>
          )}
        </footer>
      </section>
    </div>
  );
}

function StepButton({
  number,
  label,
  active,
}: {
  number: number;
  label: string;
  active: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-center gap-2 border-b-2 px-2 py-3 text-xs font-semibold ${
        active
          ? "border-indigo-600 text-indigo-700"
          : "border-transparent text-gray-400"
      }`}
    >
      <span
        className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
          active ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-500"
        }`}
      >
        {number}
      </span>
      {label}
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <p className="mt-4 rounded-xl bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">
      {message}
    </p>
  );
}

function CompletionView({
  created,
  failedTasks,
}: {
  created: number;
  failedTasks: string[];
}) {
  const allSuccessful = failedTasks.length === 0;

  return (
    <div className="py-5 text-center">
      <div
        className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${
          allSuccessful
            ? "bg-emerald-100 text-emerald-600"
            : "bg-amber-100 text-amber-600"
        }`}
      >
        {allSuccessful ? (
          <Check className="h-7 w-7" />
        ) : (
          <Layers3 className="h-7 w-7" />
        )}
      </div>
      <h3 className="mt-4 text-lg font-bold text-gray-900">
        {allSuccessful ? "Routine created" : "Routine partly created"}
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        {created} {created === 1 ? "task was" : "tasks were"} created or
        updated successfully.
      </p>
      {failedTasks.length > 0 && (
        <div className="mx-auto mt-4 max-w-md rounded-xl bg-amber-50 p-3 text-left">
          <p className="text-xs font-semibold text-amber-800">
            These tasks could not be created:
          </p>
          <ul className="mt-1 list-inside list-disc text-xs text-amber-700">
            {failedTasks.map((task) => (
              <li key={task}>{task}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function findExistingTask(
  existingTasks: ExistingRoutineTask[],
  title: string,
) {
  const normalized = title.trim().toLocaleLowerCase();
  return existingTasks.find(
    (task) => task.title.trim().toLocaleLowerCase() === normalized,
  );
}

function isTaskUnchanged(
  task: RoutineTemplateTask,
  existingTask?: ExistingRoutineTask,
) {
  if (!existingTask) return false;

  return (
    (existingTask.description ?? "").trim() === task.description.trim() &&
    (existingTask.category ?? "⭐ Other") === task.category &&
    (existingTask.difficulty ?? 1) === task.difficulty &&
    (existingTask.points ?? 0) === task.points &&
    (existingTask.recurring ?? false) === task.recurring &&
    (existingTask.frequency ?? null) === (task.frequency ?? null)
  );
}
