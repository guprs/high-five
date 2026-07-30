import { useState, type FormEvent } from "react";
import { Check, Minus, Pencil, Plus, X } from "lucide-react";

import { updateTask } from "../../services/tasks";
import type { Task } from "../../types/dashboard";

interface Props {
  task: Task;
  onClose: () => void;
  onSaved: () => Promise<void>;
}

const CATEGORIES = [
  "🧹 Chores",
  "🧠 Skills",
  "📚 Education",
  "⭐ Other",
];

const FREQUENCIES = ["Daily", "Weekly", "Weekdays", "Weekends", "Monthly"];

export default function EditTaskModal({ task, onClose, onSaved }: Props) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");
  const [category, setCategory] = useState(task.category ?? "🧹 Chores");
  const [points, setPoints] = useState(task.points ?? 20);
  const [difficulty, setDifficulty] = useState(
    Math.min(3, Math.max(1, task.difficulty ?? 2)),
  );
  const [recurring, setRecurring] = useState(task.recurring ?? false);
  const [frequency, setFrequency] = useState(task.frequency ?? "Daily");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Please enter a task name.");
      return;
    }

    try {
      setLoading(true);
      await updateTask(task.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        category,
        points,
        difficulty,
        recurring,
        frequency: recurring ? frequency : undefined,
      });
      await onSaved();
      onClose();
    } catch (submitError: unknown) {
      console.error(submitError);
      setError(
        (typeof submitError === "object" &&
        submitError !== null &&
        "response" in submitError
          ? (
              submitError.response as {
                data?: { message?: string };
              }
            ).data?.message
          : undefined) || "Could not update task.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-center bg-slate-950/55 backdrop-blur-sm sm:items-center sm:p-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-task-title"
        className="flex h-[100dvh] w-full max-w-3xl flex-col overflow-hidden bg-white shadow-2xl sm:h-auto sm:max-h-[90vh] sm:rounded-3xl sm:border sm:border-gray-100"
      >
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-gray-100 px-5 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
              <Pencil className="h-4.5 w-4.5" />
            </div>
            <div>
              <h2
                id="edit-task-title"
                className="text-lg font-bold text-gray-900"
              >
                Edit Task
              </h2>
              <p className="text-xs text-gray-400">
                Update the task details and schedule
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close task form"
            className="rounded-xl p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          <form
            id="edit-task-form"
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Task name">
                <input
                  autoFocus
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className="task-input"
                />
              </FormField>
              <FormField label="Category">
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="task-input"
                >
                  {CATEGORIES.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </FormField>
            </div>

            <FormField label="Description" optional>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={2}
                placeholder="Add clear steps or helpful details..."
                className="task-input resize-none"
              />
            </FormField>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Difficulty">
                <div className="grid grid-cols-3 gap-2">
                  {[
                    [1, "Easy"],
                    [2, "Medium"],
                    [3, "Hard"],
                  ].map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setDifficulty(Number(value))}
                      className={`rounded-xl border px-2 py-2.5 text-xs font-semibold transition ${
                        difficulty === value
                          ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                          : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {"⭐".repeat(Number(value))} {label}
                    </button>
                  ))}
                </div>
              </FormField>
              <FormField label="XP reward">
                <div className="flex h-10.5 items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-2">
                  <button
                    type="button"
                    aria-label="Decrease XP"
                    onClick={() =>
                      setPoints((value) => Math.max(5, value - 5))
                    }
                    className="rounded-lg p-1.5 text-gray-500 hover:bg-white"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="text-sm font-bold text-gray-900">
                    {points} XP
                  </span>
                  <button
                    type="button"
                    aria-label="Increase XP"
                    onClick={() => setPoints((value) => value + 5)}
                    className="rounded-lg p-1.5 text-gray-500 hover:bg-white"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </FormField>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5">
                <span>
                  <span className="block text-sm font-semibold text-gray-700">
                    Repeat task
                  </span>
                  <span className="text-xs text-gray-400">
                    Add it to the routine
                  </span>
                </span>
                <input
                  type="checkbox"
                  checked={recurring}
                  onChange={(event) => setRecurring(event.target.checked)}
                  className="h-5 w-5 rounded border-gray-300 text-indigo-600"
                />
              </label>

              {recurring ? (
                <FormField label="Frequency">
                  <select
                    value={frequency}
                    onChange={(event) => setFrequency(event.target.value)}
                    className="task-input"
                  >
                    {FREQUENCIES.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </FormField>
              ) : (
                <div className="flex items-center gap-2 rounded-xl border border-dashed border-gray-200 px-3 py-2.5 text-xs text-gray-400">
                  <Check className="h-4 w-4 text-emerald-500" />
                  This is a one-time task
                </div>
              )}
            </div>

            {error && (
              <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">
                {error}
              </p>
            )}
          </form>
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
            type="submit"
            form="edit-task-form"
            disabled={loading}
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </footer>
      </section>
    </div>
  );
}

interface FormFieldProps {
  label: string;
  optional?: boolean;
  children: React.ReactNode;
}

function FormField({ label, optional, children }: FormFieldProps) {
  return (
    <label className="block text-sm font-semibold text-gray-700">
      <span className="flex items-center justify-between gap-2">
        {label}
        {optional && (
          <span className="text-[10px] font-medium text-gray-400">Optional</span>
        )}
      </span>
      <span className="mt-1.5 block">{children}</span>
    </label>
  );
}
