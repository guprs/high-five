import { Bell, ChevronDown, LogOut, Search, Settings } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { SIDEBAR_NAV } from "../../data/dashboardData";
import type { ParentTab } from "../../types/dashboard";

interface StoredUser {
  name?: string;
  email?: string;
}

interface Props {
  onNavigate: (tab: ParentTab) => void;
  onLogout: () => void;
}

function getParent() {
  try {
    return JSON.parse(localStorage.getItem("user") ?? "{}") as StoredUser;
  } catch {
    return {};
  }
}

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function DashboardHeader({ onNavigate, onLogout }: Props) {
  const [parent, setParent] = useState(getParent);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const parentName = parent.name?.trim() || "Parent";

  useEffect(() => {
    const syncParent = () => setParent(getParent());
    window.addEventListener("storage", syncParent);
    window.addEventListener("family-changed", syncParent);
    return () => {
      window.removeEventListener("storage", syncParent);
      window.removeEventListener("family-changed", syncParent);
    };
  }, []);

  const results = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    if (!normalized) return [];
    return SIDEBAR_NAV.filter((item) =>
      item.label.toLocaleLowerCase().includes(normalized),
    );
  }, [query]);

  function navigateTo(tab: ParentTab) {
    onNavigate(tab);
    setQuery("");
    setSearchOpen(false);
    setProfileOpen(false);
  }

  function submitSearch(event: React.FormEvent) {
    event.preventDefault();
    const firstResult = results[0];
    if (firstResult) navigateTo(firstResult.id as ParentTab);
  }

  return (
    <header className="relative z-20 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-gray-100 bg-white px-4 sm:px-6">
      <form
        onSubmit={submitSearch}
        className="relative min-w-0 flex-1 sm:max-w-md"
      >
        <div className="flex items-center rounded-xl border border-transparent bg-gray-50 transition focus-within:border-indigo-200 focus-within:bg-white focus-within:ring-3 focus-within:ring-indigo-100">
          <Search className="ml-3 h-4 w-4 shrink-0 text-gray-400" />
          <input
            type="search"
            value={query}
            onFocus={() => setSearchOpen(true)}
            onChange={(event) => {
              setQuery(event.target.value);
              setSearchOpen(true);
            }}
            placeholder="Search pages: Tasks, Rewards..."
            aria-label="Search app pages"
            className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm outline-none"
          />
          <button
            type="submit"
            aria-label="Search"
            disabled={results.length === 0}
            className="mr-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-indigo-600 transition hover:bg-indigo-50 disabled:text-gray-300"
          >
            <Search className="h-4 w-4" />
          </button>
        </div>

        {searchOpen && query.trim() && (
          <div className="absolute right-0 left-0 top-full mt-2 overflow-hidden rounded-xl border border-gray-100 bg-white p-1.5 shadow-xl">
            {results.length > 0 ? (
              results.map((item) => {
                const Icon = item.Icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => navigateTo(item.id as ParentTab)}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-600 hover:bg-indigo-50 hover:text-indigo-700"
                  >
                    <Icon className="h-4 w-4" />
                    Open {item.label}
                  </button>
                );
              })
            ) : (
              <p className="px-3 py-2 text-xs text-gray-400">No matching page</p>
            )}
          </div>
        )}
      </form>

      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
        <button
          type="button"
          aria-label="Notifications"
          title="Notification preferences"
          onClick={() => navigateTo("settings")}
          className="hidden text-gray-400 transition hover:text-gray-600 sm:block"
        >
          <Bell className="h-5 w-5" />
        </button>

        <div className="relative">
          <button
            type="button"
            aria-expanded={profileOpen}
            onClick={() => setProfileOpen((current) => !current)}
            className="flex min-w-0 items-center gap-2 rounded-xl p-1 transition hover:bg-gray-50"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
              {getInitials(parentName)}
            </div>
            <span className="hidden max-w-32 truncate text-sm font-semibold text-gray-700 sm:block">{parentName}</span>
            <ChevronDown className={`hidden h-4 w-4 shrink-0 text-gray-400 transition sm:block ${profileOpen ? "rotate-180" : ""}`} />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-gray-100 bg-white p-2 shadow-xl">
              <div className="border-b border-gray-100 px-2 py-2">
                <p className="truncate text-sm font-semibold text-gray-900">{parentName}</p>
                <p className="truncate text-xs text-gray-400">{parent.email || "Parent account"}</p>
              </div>
              <button
                type="button"
                onClick={() => navigateTo("settings")}
                className="mt-1 flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                <Settings className="h-4 w-4" />
                Settings
              </button>
              <button
                type="button"
                onClick={() => {
                  setProfileOpen(false);
                  onLogout();
                }}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
