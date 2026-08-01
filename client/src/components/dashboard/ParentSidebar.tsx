import { LogOut, Menu } from "lucide-react";
import { useEffect, useState } from "react";

import { SIDEBAR_NAV } from "../../data/dashboardData";
import type { ParentTab } from "../../types/dashboard";

interface StoredUser {
  name?: string;
  email?: string;
}

function readParent() {
  try {
    return JSON.parse(localStorage.getItem("user") ?? "{}") as StoredUser;
  } catch {
    return {};
  }
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

interface Props {
  tab: ParentTab;
  setTab: (tab: ParentTab) => void;
  onLogout: () => void;
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
}

export function ParentSidebar({
  tab,
  setTab,
  onLogout,
  collapsed,
  setCollapsed,
}: Props) {
  const [parent, setParent] = useState(readParent);
  const parentName = parent.name?.trim() || "Parent";

  useEffect(() => {
    const syncParent = () => setParent(readParent());
    window.addEventListener("storage", syncParent);
    window.addEventListener("family-changed", syncParent);
    return () => {
      window.removeEventListener("storage", syncParent);
      window.removeEventListener("family-changed", syncParent);
    };
  }, []);

  return (
    <aside
      className={`hidden h-dvh shrink-0 flex-col border-r border-gray-100 bg-white transition-[width] duration-300 md:flex ${
        collapsed ? "w-16" : "w-56"
      }`}
    >
      <div
        className={`flex h-16 shrink-0 items-center border-b border-gray-100 ${
          collapsed ? "justify-center px-2" : "gap-2.5 px-3"
        }`}
      >
        {!collapsed && (
          <>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-base shadow-sm">
              🙌
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-black text-gray-900">High Five!</div>
              <div className="mt-0.5 text-[10px] font-medium text-gray-400">Family Platform</div>
            </div>
          </>
        )}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
        >
          <Menu className="h-4 w-4" />
        </button>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-3">
        {SIDEBAR_NAV.map((item) => {
          const active = tab === item.id;
          const Icon = item.Icon;
          return (
            <button
              key={item.id}
              type="button"
              title={collapsed ? item.label : undefined}
              onClick={() => setTab(item.id as ParentTab)}
              className={`flex w-full items-center rounded-xl py-2 text-sm font-medium transition-all ${
                collapsed ? "justify-center px-2" : "gap-2.5 px-2.5"
              } ${
                active
                  ? "bg-indigo-50 text-indigo-700 dark-nav-active"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-800 dark-nav-item"
              }`}
            >
              <Icon className={`h-4 w-4 shrink-0 ${active ? "text-indigo-600" : "text-gray-400"}`} />
              {!collapsed && (
                <>
                  <span className="min-w-0 flex-1 truncate text-left">{item.label}</span>
                  {active && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />}
                </>
              )}
            </button>
          );
        })}
      </nav>

      <div className={`flex items-center border-t border-gray-100 px-3 py-3 ${collapsed ? "justify-center" : "gap-2.5"}`}>
        <div
          title={collapsed ? parentName : undefined}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-black text-indigo-700"
        >
          {initials(parentName)}
        </div>
        {!collapsed && (
          <>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-gray-900">{parentName}</div>
              <div className="truncate text-[10px] text-gray-400">{parent.email || "Parent account"}</div>
            </div>
            <button
              type="button"
              onClick={onLogout}
              aria-label="Sign out"
              title="Sign out"
              className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </>
        )}
      </div>
    </aside>
  );
}

export default ParentSidebar;
