import type { Child, Task } from "../../types/dashboard";
import {
  AGENDA_TIMES,
  childrenForTask,
  completionForDate,
} from "../../utils/calendar";

interface Props {
  date: Date;
  tasks: Task[];
  children: Child[];
  selectedChildId: string | null;
}

export default function CalendarAgenda({
  date,
  tasks,
  children,
  selectedChildId,
}: Props) {
  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <h2 className="mb-3 font-semibold text-gray-900">
        {date.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        })}{" "}
        — Agenda
      </h2>

      {tasks.length > 0 ? (
        <div className="space-y-2">
          {tasks.map((task, index) => {
            const assignedChildren = childrenForTask(
              task,
              children,
              selectedChildId,
            );
            const completion = completionForDate(
              task,
              date,
              assignedChildren,
            );
            const primaryChild = assignedChildren[0];

            return (
              <article
                key={task.id}
                className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-100 p-3 transition-colors hover:bg-gray-50 sm:flex-nowrap sm:gap-4"
              >
                <span className="w-11 shrink-0 font-mono text-sm text-gray-400 sm:w-12">
                  {AGENDA_TIMES[index] ?? "18:30"}
                </span>
                <span
                  className="h-8 w-1 shrink-0 rounded-full"
                  style={{
                    backgroundColor: primaryChild?.color ?? "#4F46E5",
                  }}
                />
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold text-gray-900">
                    {task.title}
                  </h3>
                  <div className="mt-0.5 flex flex-wrap items-center gap-x-1 text-xs text-gray-400">
                    <span className="inline-flex items-center">
                      {assignedChildren.map((child) => (
                        <span
                          key={child.id}
                          title={child.name}
                          className="mr-0.5"
                        >
                          {child.avatar}
                        </span>
                      ))}
                    </span>
                    <span>
                      {assignedChildren.map((child) => child.name).join(", ")} ·
                      +{task.points} XP
                    </span>
                  </div>
                </div>
                <span
                  className={`ml-14 shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold sm:ml-0 ${
                    completion.completed
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {completion.label}
                </span>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-gray-200 py-8 text-center">
          <p className="text-sm font-medium text-gray-500">
            No tasks scheduled
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Try another day or child filter
          </p>
        </div>
      )}
    </section>
  );
}
