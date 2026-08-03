import { CheckCircle, Clock } from "lucide-react";
import type { Task } from "../../types/dashboard";
import { toDateInputValue } from "../../utils/calendar";
import { CatBadge } from "../CatBadge";
import { ChildAvatar } from "../ChildAvatar";
import { Stars } from "../Stars";

interface Props {
  tasks: Task[];
  onViewAll: () => void;
}

export default function TaskSnapshot({ tasks, onViewAll }: Props) {
  const todayKey = toDateInputValue(new Date());

  return (
    <section className="min-w-0 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="font-semibold text-gray-900">Today&apos;s Task Snapshot</h3>
        <button
          type="button"
          onClick={onViewAll}
          className="shrink-0 rounded-lg px-2 py-1 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-50"
        >
          View all <span className="hidden sm:inline">tasks </span>→
        </button>
      </div>

      {tasks.length === 0 ? (
        <div className="rounded-xl bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
          No tasks are scheduled for today.
        </div>
      ) : (
        <div className="space-y-2">
          {tasks.slice(0, 6).map((task) => {
            const assignedChildIds =
              task.childTasks?.map(({ child }) => child.id) ?? [];
            const completedChildIds = new Set(
              (task.completions ?? [])
                .filter(
                  (completion) => completion.date.slice(0, 10) === todayKey,
                )
                .map((completion) => completion.childId),
            );
            const isCompleted =
              assignedChildIds.length > 0 &&
              assignedChildIds.every((childId) =>
                completedChildIds.has(childId),
              );
            const completedChildren = (task.childTasks ?? [])
              .filter(({ child }) => completedChildIds.has(child.id))
              .map(({ child }) => child.name);
            const completionLabel = isCompleted
              ? "Completed by everyone"
              : completedChildren.length > 0
                ? `${completedChildren.join(", ")} ${completedChildren.length === 1 ? "has" : "have"} completed it`
                : "Not completed yet";

            return (
              <article
                key={task.id}
                className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2 rounded-xl px-2 py-3 transition hover:bg-gray-50 sm:flex sm:gap-4 sm:px-3 sm:py-2.5"
              >
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                    isCompleted ? "bg-emerald-100" : "bg-gray-100"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <Clock className="h-4 w-4 text-gray-400" />
                  )}
                </div>

                <div className="min-w-0 sm:flex-1">
                  <div className={`truncate text-sm font-medium ${isCompleted ? "text-gray-400 line-through" : "text-gray-800"}`}>{task.title}</div>
                  <div className={`mt-0.5 truncate text-[10px] font-semibold ${isCompleted ? "text-emerald-600" : completedChildren.length ? "text-indigo-500" : "text-gray-400"}`}>{completionLabel}</div>
                </div>

                <div className="flex shrink-0 -space-x-1">
                  {task.childTasks?.map(({ child }) => (
                    <div key={child.id} className={`relative rounded-full ${completedChildIds.has(child.id) ? "ring-2 ring-emerald-400" : ""}`} title={`${child.name}: ${completedChildIds.has(child.id) ? "done" : "pending"}`}>
                      <ChildAvatar
                        child={{
                        id: child.id,
                        name: child.name,
                        age: 0,
                        avatar: child.emoji ?? child.avatar ?? "🙂",
                        color: "#6366f1",
                        xp: 0,
                        maxXp: 1000,
                        level: 1,
                        coins: 0,
                        streak: 0,
                        tasksToday: 0,
                        tasksComplete: 0,
                        theme: child.theme,
                        themeId: child.theme,
                        pin: "",
                      }}
                        size="sm"
                      />
                      {completedChildIds.has(child.id) && <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500 text-[8px] font-black text-white ring-1 ring-white">✓</span>}
                    </div>
                  ))}
                </div>

                <div className="col-start-2 col-end-4 flex min-w-0 flex-wrap items-center gap-2 sm:contents">
                  {task.category && <CatBadge category={task.category} />}
                  {task.difficulty && <Stars level={task.difficulty} />}
                  <span className="ml-auto shrink-0 text-xs font-bold text-indigo-600 sm:ml-0 sm:w-12 sm:text-right">
                    +{task.points} XP
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
