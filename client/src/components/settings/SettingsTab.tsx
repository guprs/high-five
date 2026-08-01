import AccessibilitySection from "./AccessibilitySection";
import ComingSoonSection from "./ComingSoonSection";
import NotificationSection from "./NotificationSection";
import ParentProfileSection from "./ParentProfileSection";
import SecuritySection from "./SecuritySection";
import PageHeader from "../PageHeader";

export default function SettingsTab() {
  return (
    <div className="max-w-2xl space-y-5">
      <PageHeader
        title="Settings"
        description="Manage your account, security and preferences"
      />

      <ParentProfileSection />
      <SecuritySection />
      <NotificationSection />
      <AccessibilitySection />
      <ComingSoonSection />
    </div>
  );
}
