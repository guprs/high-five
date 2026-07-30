import { useState } from "react";

import { Toggle } from "../Toggle";
import {
  readAccessibilityPreferences,
  saveAccessibilityPreferences,
  type AccessibilityPreferences,
  type FontSizePreference,
} from "../../utils/accessibilityPreferences";

const FEATURES = [
  { key: "dyslexia", label: "Dyslexia-Friendly Font", available: false },
  { key: "speech", label: "Text-to-Speech", available: false },
  { key: "icons", label: "Large Icons", available: false },
  { key: "targets", label: "Large Touch Targets", available: false },
  { key: "colorBlind", label: "Color Blind Support", available: false },
  { key: "audio", label: "Audio Feedback", available: false },
] as const;

export default function AccessibilitySection() {
  const [preferences, setPreferences] = useState(
    readAccessibilityPreferences,
  );

  function updatePreference<Key extends keyof AccessibilityPreferences>(
    key: Key,
    value: AccessibilityPreferences[Key],
  ) {
    setPreferences((current) => {
      const next = { ...current, [key]: value };
      saveAccessibilityPreferences(next);
      return next;
    });
  }

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <h2 className="mb-1 font-semibold text-gray-900">Accessibility</h2>
      <p className="mb-4 text-xs text-gray-400">
        Inclusive display and interaction preferences
      </p>
      <div className="space-y-4">
        <PreferenceToggle
          label="Dark Mode"
          description="Use a darker colour palette in the parent interface"
          value={preferences.darkMode}
          onChange={(value) => updatePreference("darkMode", value)}
        />
        <PreferenceToggle
          label="High Contrast Mode"
          description="Increase contrast between text, controls and backgrounds"
          value={preferences.highContrast}
          onChange={(value) => updatePreference("highContrast", value)}
        />
        <PreferenceToggle
          label="Reduced Motion"
          description="Reduce animations and moving effects"
          value={preferences.reducedMotion}
          onChange={(value) => updatePreference("reducedMotion", value)}
        />
        <div>
          <div className="mb-2 text-sm font-medium text-gray-900">
            Text Size
          </div>
          <div className="grid grid-cols-3 gap-2" role="group" aria-label="Text size">
            {(
              [
                ["default", "Default"],
                ["large", "Large"],
                ["extra-large", "Larger"],
              ] as [FontSizePreference, string][]
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                aria-pressed={preferences.fontSize === value}
                onClick={() => updatePreference("fontSize", value)}
                className={`rounded-xl border px-2 py-2 text-xs font-semibold transition-colors ${
                  preferences.fontSize === value
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                    : "border-gray-200 text-gray-500 hover:bg-gray-50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
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
                value={false}
                disabled={!available}
                onChange={() => undefined}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 rounded-xl bg-indigo-50 px-3 py-2 text-xs text-indigo-700">
        Display preferences are saved in this browser.
      </p>
    </section>
  );
}

type PreferenceToggleProps = {
  label: string;
  description: string;
  value: boolean;
  onChange: (value: boolean) => void;
};

function PreferenceToggle({
  label,
  description,
  value,
  onChange,
}: PreferenceToggleProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <div className="text-sm font-medium text-gray-900">{label}</div>
        <div className="mt-0.5 text-xs text-gray-400">{description}</div>
      </div>
      <Toggle label={label} value={value} onChange={onChange} />
    </div>
  );
}
