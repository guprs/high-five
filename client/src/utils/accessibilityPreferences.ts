export type FontSizePreference = "default" | "large" | "extra-large";

export type AccessibilityPreferences = {
  darkMode: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
  fontSize: FontSizePreference;
};

const STORAGE_KEY = "high-five-accessibility";

export const DEFAULT_ACCESSIBILITY_PREFERENCES: AccessibilityPreferences = {
  darkMode: false,
  highContrast: false,
  reducedMotion: false,
  fontSize: "default",
};

export function readAccessibilityPreferences(): AccessibilityPreferences {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");

    return {
      darkMode: saved.darkMode === true,
      highContrast: saved.highContrast === true,
      reducedMotion: saved.reducedMotion === true,
      fontSize:
        saved.fontSize === "large" || saved.fontSize === "extra-large"
          ? saved.fontSize
          : "default",
    };
  } catch {
    return DEFAULT_ACCESSIBILITY_PREFERENCES;
  }
}

export function applyAccessibilityPreferences(
  preferences: AccessibilityPreferences,
) {
  const root = document.documentElement;

  root.dataset.theme = preferences.darkMode ? "dark" : "light";
  root.dataset.contrast = preferences.highContrast ? "high" : "standard";
  root.dataset.motion = preferences.reducedMotion ? "reduced" : "standard";
  root.dataset.fontSize = preferences.fontSize;
  root.style.colorScheme = preferences.darkMode ? "dark" : "light";
}

export function saveAccessibilityPreferences(
  preferences: AccessibilityPreferences,
) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  applyAccessibilityPreferences(preferences);
}
