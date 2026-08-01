import {
  formatDateRange,
  sameDay,
  toDateInputValue,
} from "../../utils/calendar";
import PageHeader from "../PageHeader";

interface Props {
  dates: Date[];
  selectedDate: Date;
  today: Date;
  onChooseDate: (value: string) => void;
}

export default function CalendarHeader({
  dates,
  selectedDate,
  today,
  onChooseDate,
}: Props) {
  return (
    <PageHeader
      title="Calendar"
      description={formatDateRange(dates)}
      action={<div className="w-full self-start sm:w-auto">
        <label className="flex w-full items-center justify-between gap-3 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2 text-indigo-700 transition-colors hover:bg-indigo-100 sm:w-auto">
          <span className="text-xs font-bold">
            {sameDay(selectedDate, today) ? "Today" : "View date"}
          </span>
          <input
            type="date"
            value={toDateInputValue(selectedDate)}
            onChange={(event) => onChooseDate(event.target.value)}
            aria-label="Choose calendar date"
            className="min-w-0 bg-transparent text-sm font-semibold text-indigo-700 outline-none"
          />
        </label>
      </div>}
    />
  );
}
