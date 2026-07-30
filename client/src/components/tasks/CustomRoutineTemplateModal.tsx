import { useState } from "react";
import { Plus, Save, Trash2, X } from "lucide-react";

import type {
  RoutineTemplate,
  RoutineTemplateTask,
} from "./RoutineTemplateModal";

interface Props {
  template?: RoutineTemplate;
  onClose: () => void;
  onSave: (template: RoutineTemplate) => void;
}

const ICONS = ["✨", "🌞", "🎒", "🏡", "🌙", "🧹", "📚", "💪"];
const CATEGORIES = ["🧹 Chores", "🧠 Skills", "📚 Education", "⭐ Other"];

type DraftTask = {
  id: string;
  title: string;
  description: string;
  category: string;
};

function newDraftTask(index: number): DraftTask {
  return {
    id: `draft-${Date.now()}-${index}`,
    title: "",
    description: "",
    category: "🧹 Chores",
  };
}

export default function CustomRoutineTemplateModal({
  template,
  onClose,
  onSave,
}: Props) {
  const [title, setTitle] = useState(template?.title ?? "");
  const [description, setDescription] = useState(
    template?.description ?? "",
  );
  const [emoji, setEmoji] = useState(template?.emoji ?? "✨");
  const [tasks, setTasks] = useState<DraftTask[]>(
    template
      ? template.tasks.map((task, index) => ({
          id: `${template.id}-${index}`,
          title: task.title,
          description: task.description,
          category: task.category,
        }))
      : [newDraftTask(0), newDraftTask(1)],
  );
  const [error, setError] = useState("");

  function updateTask(id: string, updates: Partial<DraftTask>) {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, ...updates } : task,
      ),
    );
  }

  function removeTask(id: string) {
    setTasks((current) => current.filter((task) => task.id !== id));
  }

  function handleSave() {
    const normalizedTitle = title.trim();
    const validTasks = tasks.filter((task) => task.title.trim());

    if (!normalizedTitle) {
      setError("Give this template a name.");
      return;
    }

    if (validTasks.length === 0) {
      setError("Add at least one task.");
      return;
    }

    const templateTasks: RoutineTemplateTask[] = validTasks.map((task) => ({
      title: task.title.trim(),
      description: task.description.trim(),
      category: task.category,
      difficulty: 1,
      points: 15,
      recurring: true,
      frequency: "Daily",
    }));

    onSave({
      id: template?.id ?? `custom-${Date.now()}`,
      emoji,
      title: normalizedTitle,
      description:
        description.trim() || "A custom routine created for your family.",
      tasks: templateTasks,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-center bg-slate-950/55 backdrop-blur-sm sm:items-center sm:p-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="custom-template-title"
        className="flex h-[100dvh] w-full max-w-2xl flex-col overflow-hidden bg-white shadow-2xl sm:h-auto sm:max-h-[90vh] sm:rounded-3xl sm:border sm:border-gray-100"
      >
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-gray-100 px-5 py-4 sm:px-6">
          <div>
            <h2
              id="custom-template-title"
              className="text-lg font-bold text-gray-900"
            >
              {template ? "Edit Routine Template" : "Create Routine Template"}
            </h2>
            <p className="text-xs text-gray-400">
              Build a reusable routine for this browser
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close template builder"
            className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-[1fr_180px]">
            <label className="text-sm font-semibold text-gray-700">
              Template name
              <input
                autoFocus
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. Saturday Reset"
                maxLength={60}
                className="task-input mt-1.5"
              />
            </label>
            <label className="text-sm font-semibold text-gray-700">
              Icon
              <select
                value={emoji}
                onChange={(event) => setEmoji(event.target.value)}
                className="task-input mt-1.5"
              >
                {ICONS.map((icon) => (
                  <option key={icon}>{icon}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="mt-4 block text-sm font-semibold text-gray-700">
            Description
            <input
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="What is this routine for?"
              maxLength={120}
              className="task-input mt-1.5"
            />
          </label>

          <div className="mt-5 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Tasks</h3>
              <p className="text-xs text-gray-400">
                Default: easy, 15 XP, repeated daily
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setTasks((current) => [
                  ...current,
                  newDraftTask(current.length),
                ])
              }
              className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-100"
            >
              <Plus className="h-3.5 w-3.5" />
              Add task
            </button>
          </div>

          <div className="mt-3 space-y-2">
            {tasks.map((task, index) => (
              <div
                key={task.id}
                className="grid grid-cols-[28px_1fr_130px_34px] items-center gap-2 rounded-xl border border-gray-200 p-2"
              >
                <span className="text-center text-xs font-bold text-gray-400">
                  {index + 1}
                </span>
                <input
                  value={task.title}
                  onChange={(event) =>
                    updateTask(task.id, { title: event.target.value })
                  }
                  placeholder="Task name"
                  maxLength={80}
                  className="min-w-0 bg-transparent text-sm font-medium text-gray-900 outline-none"
                />
                <select
                  value={task.category}
                  onChange={(event) =>
                    updateTask(task.id, { category: event.target.value })
                  }
                  aria-label={`Category for task ${index + 1}`}
                  className="min-w-0 rounded-lg border border-gray-200 bg-gray-50 px-2 py-1.5 text-xs text-gray-600"
                >
                  {CATEGORIES.map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => removeTask(task.id)}
                  disabled={tasks.length === 1}
                  aria-label={`Remove task ${index + 1}`}
                  className="rounded-lg p-1.5 text-gray-400 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-30"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <input
                  value={task.description}
                  onChange={(event) =>
                    updateTask(task.id, {
                      description: event.target.value,
                    })
                  }
                  placeholder="Short description or helpful steps"
                  maxLength={300}
                  className="col-start-2 col-end-5 min-w-0 border-t border-gray-100 bg-transparent pt-2 text-xs text-gray-500 outline-none"
                />
              </div>
            ))}
          </div>

          {error && (
            <p className="mt-4 rounded-xl bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">
              {error}
            </p>
          )}
        </div>

        <footer className="flex shrink-0 items-center justify-end gap-3 border-t border-gray-100 bg-white px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            <Save className="h-4 w-4" />
            Save Template
          </button>
        </footer>
      </section>
    </div>
  );
}
