import { useState } from "react";

import { Toggle } from "../Toggle";

const OPTIONS = [
  { key: "daily", label: "Daily task reminders", sub: "Get notified when tasks are due", soon: true },
  { key: "streaks", label: "Streak risk alerts", sub: "Warn when a child may lose their streak", soon: true },
  { key: "rewards", label: "Reward requests", sub: "Notify when a child requests a reward", soon: true },
  { key: "weekly", label: "Weekly summary email", sub: "Digest every Monday morning", soon: true },
  { key: "push", label: "Push notifications", sub: "Browser push notifications", soon: true },
] as const;

export default function NotificationSection() {
  const [notifications, setNotifications] = useState({
    daily: true,
    streaks: true,
    rewards: true,
    weekly: false,
    push: false,
  });

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <h2 className="mb-1 font-semibold text-gray-900">Notifications</h2>
      <p className="mb-4 text-xs text-gray-400">
        Choose what you want to be notified about
      </p>
      <div className="space-y-4">
        {OPTIONS.map(({ key, label, sub, soon }) => (
          <div
            key={key}
            className={`flex items-center justify-between gap-4 ${soon ? "opacity-60" : ""}`}
          >
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                {label}
                {soon && (
                  <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700 uppercase">
                    Soon
                  </span>
                )}
              </div>
              <div className="mt-0.5 text-xs text-gray-400">{sub}</div>
            </div>
            <Toggle
              label={label}
              value={notifications[key]}
              disabled={soon}
              onChange={(value) =>
                setNotifications((current) => ({ ...current, [key]: value }))
              }
            />
          </div>
        ))}
      </div>
    </section>
  );
}
