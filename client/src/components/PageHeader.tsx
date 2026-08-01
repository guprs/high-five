import type { ReactNode } from "react";

interface Props {
  title: ReactNode;
  description: ReactNode;
  action?: ReactNode;
}

export default function PageHeader({ title, description, action }: Props) {
  return (
    <header className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        <p className="mt-1 text-sm text-gray-400">{description}</p>
      </div>
      {action && <div className="w-full shrink-0 sm:w-auto">{action}</div>}
    </header>
  );
}
