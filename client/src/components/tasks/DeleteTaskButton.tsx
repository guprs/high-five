import { useState } from "react";
import { createPortal } from "react-dom";
import { Trash2, X } from "lucide-react";

import { deleteTask } from "../../services/tasks";

interface Props {
  taskId: string;
  onDeleted: () => Promise<void>;
  compact?: boolean;
}

export default function DeleteTaskButton({ taskId, onDeleted, compact = false }: Props) {
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    if (!confirming) {
      setConfirming(true);
      return;
    }

    try {
      setLoading(true);
      setError("");
      await deleteTask(taskId);
      await onDeleted();
    } catch (error: unknown) {
      console.error(error);
      setError(
        (typeof error === "object" && error !== null && "response" in error
          ? (error.response as { data?: { message?: string } }).data?.message
          : undefined) || "Could not delete task."
      );
      setConfirming(false);
    } finally {
      setLoading(false);
    }
  }

  function handleCancel() {
    setConfirming(false);
    setError("");
  }

  return (
    <div className="flex flex-col items-end gap-2">
      {confirming && createPortal(
        <div className="fixed inset-0 z-[100] flex items-start justify-center bg-slate-950/40 p-4 pt-24 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="delete-task-title">
          <div className="w-full max-w-sm rounded-2xl border border-rose-100 bg-white p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 id="delete-task-title" className="text-lg font-black text-slate-900">Delete this task?</h3>
                <p className="mt-1 text-sm font-medium text-slate-600">This will permanently remove the task and its assignments.</p>
              </div>
              <button type="button" onClick={handleCancel} aria-label="Close confirmation" className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={handleCancel} disabled={loading} className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:opacity-60">Cancel</button>
              <button type="button" onClick={handleDelete} disabled={loading} className="rounded-xl bg-rose-600 px-3 py-2 text-sm font-bold text-white transition hover:bg-rose-700 disabled:opacity-60">{loading ? "Deleting..." : "Delete task"}</button>
            </div>
          </div>
        </div>,
        document.body,
      )}

      <button
        type="button"
        onClick={handleDelete}
        className={compact ? "rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500" : "inline-flex items-center gap-2 rounded-xl border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"}
      >
        <Trash2 className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
        {!compact ? (loading ? "Deleting..." : confirming ? "Confirm delete" : "Delete") : null}
      </button>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
