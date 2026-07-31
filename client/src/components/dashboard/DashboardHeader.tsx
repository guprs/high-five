import { Bell, ChevronDown, Search } from "lucide-react";
import { useEffect, useState } from "react";

interface StoredUser {
  name?: string;
}

function getParentName() {
  try {
    const user = JSON.parse(localStorage.getItem("user") ?? "{}") as StoredUser;
    return user.name?.trim() || "Parent";
  } catch {
    return "Parent";
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

export default function DashboardHeader() {
  const [parentName, setParentName] = useState(getParentName);

  useEffect(() => {
    const syncParent = () => setParentName(getParentName());
    window.addEventListener("storage", syncParent);
    window.addEventListener("family-changed", syncParent);

    return () => {
      window.removeEventListener("storage", syncParent);
      window.removeEventListener("family-changed", syncParent);
    };
  }, []);

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-100 bg-white px-4 sm:px-6">
      <div className="flex w-48 items-center gap-2 rounded-xl bg-gray-50 px-3 py-2 sm:w-80">
        <Search className="h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          aria-label="Search"
          className="w-full bg-transparent text-sm outline-none"
        />
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <button
          type="button"
          aria-label="Notifications"
          className="relative text-gray-400 transition hover:text-gray-600"
        >
          <Bell className="h-5 w-5" />
        </button>

        <button type="button" className="flex min-w-0 items-center gap-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
            {getInitials(parentName)}
          </div>
          <span className="hidden max-w-32 truncate text-sm font-semibold text-gray-700 sm:block">
            {parentName}
          </span>
          <ChevronDown className="hidden h-4 w-4 shrink-0 text-gray-400 sm:block" />
        </button>
      </div>
    </header>
  );
}
