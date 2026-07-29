import { createPortal } from "react-dom";
import { AlertTriangle, X } from "lucide-react";

import type { Reward } from "../../types/dashboard";

interface Props {
  reward: Reward;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteRewardModal({
  reward,
  onClose,
  onConfirm,
}: Props) {
  return createPortal(
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-reward-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-sm rounded-3xl border border-rose-100 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h2
                id="delete-reward-title"
                className="text-lg font-bold text-gray-900"
              >
                Delete reward?
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-gray-500">
                <span className="font-semibold text-gray-700">
                  {reward.icon} {reward.title}
                </span>{" "}
                will be removed from the catalog.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close delete confirmation"
            className="rounded-xl p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700"
          >
            Delete Reward
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
