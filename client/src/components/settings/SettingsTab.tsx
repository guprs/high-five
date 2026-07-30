import AccessibilitySection from "./AccessibilitySection";
import ComingSoonSection from "./ComingSoonSection";
import NotificationSection from "./NotificationSection";
import ParentProfileSection from "./ParentProfileSection";
import SecuritySection from "./SecuritySection";

export default function SettingsTab() {
  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-400">
          Manage your account, security and preferences
        </p>
      </div>

      <ParentProfileSection />
      <SecuritySection />
      <NotificationSection />
      <AccessibilitySection />
      <ComingSoonSection />
    </div>
  );
}
