import { useState } from "react";
import { Eye, EyeOff, LockKeyhole, X } from "lucide-react";

import { changePassword } from "../../services/auth";

interface Props {
  onClose: () => void;
}

export default function ChangePasswordModal({ onClose }: Props) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    if (newPassword.length < 8) {
      setError("New password must contain at least 8 characters.");
      return;
    }
    if (newPassword !== confirmation) {
      setError("The new password confirmation does not match.");
      return;
    }

    try {
      setSaving(true);
      const result = await changePassword({ currentPassword, newPassword });
      setSaved(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmation("");
      setError("");
      if (result.message) setSaved(true);
    } catch (changeError: unknown) {
      setError(
        (typeof changeError === "object" &&
        changeError !== null &&
        "response" in changeError
          ? (changeError.response as { data?: { message?: string } }).data?.message
          : undefined) ?? "Password could not be changed.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="change-password-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-3xl border border-white/70 bg-white p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100">
              <LockKeyhole className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h2 id="change-password-title" className="font-bold text-gray-900">
                Change parent password
              </h2>
              <p className="text-xs text-gray-400">
                Confirm your current password first
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close password form" className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100">
            <X className="h-4 w-4" />
          </button>
        </div>

        {[
          { label: "Current password", value: currentPassword, setter: setCurrentPassword },
          { label: "New password", value: newPassword, setter: setNewPassword },
          { label: "Confirm new password", value: confirmation, setter: setConfirmation },
        ].map((field, index) => (
          <label key={field.label} className="mt-4 block text-xs font-semibold text-gray-700">
            {field.label}
            <div className="relative mt-1.5">
              <input
                autoFocus={index === 0}
                type={showPasswords ? "text" : "password"}
                value={field.value}
                onChange={(event) => field.setter(event.target.value)}
                autoComplete={index === 0 ? "current-password" : "new-password"}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 pr-10 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
              {index === 0 && (
                <button
                  type="button"
                  onClick={() => setShowPasswords((current) => !current)}
                  aria-label={showPasswords ? "Hide passwords" : "Show passwords"}
                  className="absolute inset-y-0 right-2 flex items-center px-2 text-gray-400"
                >
                  {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              )}
            </div>
          </label>
        ))}

        {error && <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">{error}</p>}
        {saved && <p className="mt-3 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">Password changed successfully.</p>}

        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-xl px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100">
            {saved ? "Close" : "Cancel"}
          </button>
          {!saved && (
            <button
              type="submit"
              disabled={saving || !currentPassword || !newPassword || !confirmation}
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving ? "Changing…" : "Change password"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
