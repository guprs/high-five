import { useState } from "react";

import { Toggle } from "../Toggle";

const FEATURES = [
  { key: "contrast", label: "High Contrast Mode", available: true },
  { key: "motion", label: "Reduced Motion", available: true },
  { key: "dyslexia", label: "Dyslexia-Friendly Font", available: false },
  { key: "fontSize", label: "Adjustable Font Size", available: false },
  { key: "speech", label: "Text-to-Speech", available: false },
  { key: "icons", label: "Large Icons", available: false },
  { key: "targets", label: "Large Touch Targets", available: false },
  { key: "colorBlind", label: "Color Blind Support", available: false },
  { key: "audio", label: "Audio Feedback", available: false },
] as const;

export default function AccessibilitySection() {
  const [preferences, setPreferences] = useState({
    contrast: false,
    motion: false,
    dyslexia: false,
    fontSize: false,
    speech: false,
    icons: false,
    targets: false,
    colorBlind: false,
    audio: false,
  });

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <h2 className="mb-1 font-semibold text-gray-900">Accessibility</h2>
      <p className="mb-4 text-xs text-gray-400">
        Inclusive display and interaction preferences
      </p>
      <div className="space-y-4">
        {FEATURES.map(({ key, label, available }) => (
          <div
            key={key}
            className={`flex items-center justify-between gap-4 ${available ? "" : "opacity-55"}`}
          >
            <div>
              <div className="text-sm font-medium text-gray-900">{label}</div>
              {!available && (
                <div className="mt-0.5 text-xs text-gray-400">
                  Coming in a future update
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              {!available && (
                <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700 uppercase">
                  Soon
                </span>
              )}
              <Toggle
                label={label}
                value={preferences[key]}
                disabled={!available}
                onChange={(value) =>
                  setPreferences((current) => ({ ...current, [key]: value }))
                }
              />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 rounded-xl bg-indigo-50 px-3 py-2 text-xs text-indigo-700">
        Display preferences are currently saved only for this session.
      </p>
    </section>
  );
}
