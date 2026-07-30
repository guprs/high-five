import { useState } from "react";
import { Eye, EyeOff, KeyRound, ShieldCheck, X } from "lucide-react";

import { setFamilyPin } from "../../services/family";

export default function FamilyPinCard() {
  const [showModal, setShowModal] = useState(false);
  const [pin, setPin] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  function closeModal() {
    setShowModal(false);
    setPin("");
    setConfirmation("");
    setError("");
    setSaved(false);
    setShowPin(false);
  }

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    if (!/^\d{4,8}$/.test(pin)) {
      setError("Use a PIN containing 4–8 digits.");
      return;
    }
    if (pin !== confirmation) {
      setError("The PIN confirmation does not match.");
      return;
    }

    try {
      setSaving(true);
      await setFamilyPin(pin);
      setSaved(true);
      setPin("");
      setConfirmation("");
    } catch {
      setError("The Kid Mode PIN could not be updated.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="border-t border-gray-100">
        <div className="flex items-center gap-3 py-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-gray-900">
              Kid Mode exit PIN
            </div>
            <div className="text-xs text-gray-400">
              Required to leave Kid Mode and return to parent controls
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="shrink-0 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
          >
            Change PIN
          </button>
        </div>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="kid-pin-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <form
            onSubmit={handleSave}
            className="w-full max-w-sm rounded-3xl border border-white/70 bg-white p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100">
                  <KeyRound className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h2 id="kid-pin-title" className="font-bold text-gray-900">
                    Change Kid Mode PIN
                  </h2>
                  <p className="text-xs text-gray-400">
                    Choose a memorable 4–8 digit code
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeModal}
                aria-label="Close PIN form"
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <label className="mt-5 block text-xs font-semibold text-gray-700">
              New PIN
              <div className="relative mt-1.5">
                <input
                  type={showPin ? "text" : "password"}
                  inputMode="numeric"
                  maxLength={8}
                  value={pin}
                  onChange={(event) =>
                    setPin(event.target.value.replace(/\D/g, ""))
                  }
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 pr-10 text-sm tracking-[0.3em] outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPin((current) => !current)}
                  aria-label={showPin ? "Hide PIN" : "Show PIN"}
                  className="absolute inset-y-0 right-2 flex items-center px-2 text-gray-400"
                >
                  {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </label>

            <label className="mt-4 block text-xs font-semibold text-gray-700">
              Confirm new PIN
              <input
                type={showPin ? "text" : "password"}
                inputMode="numeric"
                maxLength={8}
                value={confirmation}
                onChange={(event) =>
                  setConfirmation(event.target.value.replace(/\D/g, ""))
                }
                className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm tracking-[0.3em] outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </label>

            {error && (
              <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
                {error}
              </p>
            )}
            {saved && (
              <p className="mt-3 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
                Kid Mode PIN updated successfully.
              </p>
            )}

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeModal}
                className="rounded-xl px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100"
              >
                {saved ? "Close" : "Cancel"}
              </button>
              {!saved && (
                <button
                  type="submit"
                  disabled={saving || !pin || !confirmation}
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {saving ? "Saving…" : "Update PIN"}
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </>
  );
}
