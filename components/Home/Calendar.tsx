"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useJournal } from "@/hooks/useJournal";
import { JournalEntry } from "@/types/journal";

export function Calendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const router = useRouter();
  const { getUserEntries, loading, error } = useJournal();

  useEffect(() => {
    const fetchEntries = async () => {
      const fetchedEntries = await getUserEntries();
      setEntries(fetchedEntries);
    };
    fetchEntries();
  }, [getUserEntries]);

  function handleSelect(selectedDate: Date | undefined) {
    setDate(selectedDate);
    if (selectedDate) {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      const existingEntry = entries.find(
        (entry) => entry.date === formattedDate
      );

      if (existingEntry) {
        router.push(`/screens/Journal/${formattedDate}/view`);
      } else {
        router.push(`/screens/Journal/${formattedDate}/mood`);
      }
    }
  }

  if (loading) {
    return <div>Loading calendar...</div>;
  }

  if (error) {
    return <div>Error loading calendar: {error}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <CalendarIcon className="h-5 w-5 text-purple-600" />
        <h2 className="text-xl font-semibold text-purple-900">Calendar View</h2>
      </div>
      <div className="rounded-lg border-2 border-purple-100 p-4 bg-white shadow-md">
        <CalendarComponent
          mode="single"
          selected={date}
          onSelect={handleSelect}
          className="rounded-md"
          modifiers={{
            booked: (date) =>
              entries.some(
                (entry) => entry.date === format(date, "yyyy-MM-dd")
              ),
          }}
          modifiersStyles={{
            booked: {
              backgroundColor: "#e9d5ff",
              color: "#6b21a8",
            },
          }}
        />
      </div>
    </div>
  );
}
