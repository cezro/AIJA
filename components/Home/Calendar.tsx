import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import type { JournalEntry } from "@/types/journal";

interface CalendarProps {
  onSelectDate: (date: string) => void;
  entries: JournalEntry[];
}

export function Calendar({ onSelectDate, entries }: CalendarProps) {
  const handleSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;
    const formattedDate = format(selectedDate, "yyyy-MM-dd");
    onSelectDate(formattedDate);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-[#FF8B8B]" />
          <h2 className="text-xl font-semibold text-[#FF8B8B]">
            Calendar View
          </h2>
        </div>
      </div>
      <CalendarComponent
        mode="single"
        onSelect={handleSelect}
        className="rounded-xl"
        modifiers={{
          booked: (date) =>
            entries.some((entry) => entry.date === format(date, "yyyy-MM-dd")),
        }}
        modifiersStyles={{
          booked: {
            backgroundColor: "#FFE5E5",
            color: "#FF8B8B",
            fontWeight: "500",
          },
        }}
      />
    </div>
  );
}
