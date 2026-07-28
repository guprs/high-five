import { useEffect, useState, type FormEvent } from "react";
import { Sparkles, X } from "lucide-react";

import { updateTask } from "../../services/tasks";
import type { Task } from "../../types/dashboard";

interface Props {
  task: Task;
  onClose: () => void;
  onSaved: () => Promise<void>;
}

export default function EditTaskModal({ task, onClose, onSaved }: Props) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");
  const [category, setCategory] = useState(task.category ?? "🧹 Chores");
  const [points, setPoints] = useState(task.points ?? 20);
  const [difficulty, setDifficulty] = useState(task.difficulty ?? 2);
  const [recurring, setRecurring] = useState(task.recurring ?? false);
  const [frequency, setFrequency] = useState(task.frequency ?? "Daily");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description ?? "");
    setCategory(task.category ?? "🧹 Chores");
    setPoints(task.points ?? 20);
    setDifficulty(task.difficulty ?? 2);
    setRecurring(task.recurring ?? false);
    setFrequency(task.frequency ?? "Daily");
  }, [task]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
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
    } catch (error: unknown) {
      console.error(error);
      setError(
        (typeof error === "object" && error !== null && "response" in error
          ? (error.response as { data?: { message?: string } }).data?.message
          : undefined) || "Could not update task."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-4xl border border-white/70 bg-white/85 p-5 shadow-2xl backdrop-blur-xl sm:p-7">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <div className="mb-2 inline-flex rounded-xl bg-indigo-100 p-2 text-indigo-600">
              <Sparkles className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900">Edit task</h2>
            <p className="mt-1 text-sm font-medium text-slate-500">Refine the task details for your family.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-bold text-slate-700">
              Task name
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. Clean the living room"
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white/80 px-3.5 py-3 font-medium text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
              />
            </label>

            <label className="block text-sm font-bold text-slate-700">
              Category
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white/80 px-3.5 py-3 font-medium text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
              >
                <option value="🧹 Chores">🧹 Chores</option>
                <option value="📚 School">📚 School</option>
                <option value="💚 Health">💚 Health</option>
                <option value="🐶 Pets">🐶 Pets</option>
                <option value="Other">Other</option>
              </select>
            </label>
          </div>

          <label className="block text-sm font-bold text-slate-700">
            Description
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
              placeholder="Add a short note"
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white/80 px-3.5 py-3 font-medium text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-bold text-slate-700">
              Difficulty
              <select
                value={difficulty}
                onChange={(event) => setDifficulty(Number(event.target.value))}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white/80 px-3.5 py-3 font-medium text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
              >
                <option value={1}>1 - Easy</option>
                <option value={2}>2 - Simple</option>
                <option value={3}>3 - Medium</option>
                <option value={4}>4 - Hard</option>
                <option value={5}>5 - Expert</option>
              </select>
            </label>

            <label className="block text-sm font-bold text-slate-700">
              XP
              <input
                type="number"
                min="1"
                value={points}
                onChange={(event) => setPoints(Number(event.target.value))}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white/80 px-3.5 py-3 font-medium text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
              />
            </label>
          </div>

          <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/80 px-3.5 py-3 text-sm font-semibold text-slate-700">
            <span>Repeat this task</span>
            <input id="recurring" type="checkbox" checked={recurring} onChange={(event) => setRecurring(event.target.checked)} className="h-4 w-4 rounded border-slate-300 text-indigo-600" />
          </label>

          {recurring ? (
            <label className="block text-sm font-bold text-slate-700">
              Frequency
              <select
                value={frequency}
                onChange={(event) => setFrequency(event.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white/80 px-3.5 py-3 font-medium text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
              >
                <option value="Daily">Daily</option>
                <option value="Weekdays">Weekdays</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
              </select>
            </label>
          ) : null}

          {error ? <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-600">{error}</p> : null}
        </div>

        <div className="mt-7 flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 rounded-xl px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-100">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="flex-[1.4] rounded-xl bg-indigo-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 disabled:opacity-60">
            {loading ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
