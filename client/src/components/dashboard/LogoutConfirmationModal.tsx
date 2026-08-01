import { LogOut, X } from "lucide-react";

interface Props {
  onCancel: () => void;
  onConfirm: () => void;
}

export default function LogoutConfirmationModal({
  onCancel,
  onConfirm,
}: Props) {
  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-confirmation-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
    >
      <section className="w-full max-w-sm overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-gray-100 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
              <LogOut className="h-5 w-5" />
            </div>
            <div>
              <h2 id="logout-confirmation-title" className="font-bold text-gray-900">
                Sign out?
              </h2>
              <p className="mt-0.5 text-xs text-gray-400">You’ll return to the login screen.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close sign-out confirmation"
            className="rounded-xl p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <p className="px-5 py-5 text-sm leading-relaxed text-gray-600">
          Any saved family data will remain available when you sign in again.
        </p>

        <footer className="flex items-center justify-between gap-3 border-t border-gray-100 px-5 py-4">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </footer>
      </section>
    </div>
  );
}
