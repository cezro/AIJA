import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
} from "date-fns";
import { Button } from "@/components/ui/button";
import type { JournalEntry } from "@/types/journal";

interface CustomCalendarProps {
  onSelectDate: (date: string) => void;
  entries: JournalEntry[];
}

export function CustomCalendar({ onSelectDate, entries }: CustomCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const onDateClick = (day: Date) => {
    onSelectDate(format(day, "yyyy-MM-dd"));
  };

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="text-[#FF8B8B]"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <span className="text-lg font-bold text-[#FF8B8B]">
          {format(currentMonth, "MMMM yyyy")}
        </span>
        <Button
          variant="ghost"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="text-[#FF8B8B]"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    );
  };

  const renderDays = () => {
    const dateFormat = "EEEEE";
    const days = [];
    const startDate = startOfMonth(currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center font-bold text-[#FF8B8B]">
          {format(addMonths(startDate, i), dateFormat)}
        </div>
      );
    }

    return <div className="grid grid-cols-7 gap-1 mb-2">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfMonth(monthStart);
    const endDate = endOfMonth(monthEnd);

    const dateFormat = "d";
    const rows = [];

    const days = eachDayOfInterval({ start: startDate, end: endDate });
    const formattedDays = days.map((day) => format(day, "yyyy-MM-dd"));

    let row = [];
    for (let i = 0; i < days.length; i++) {
      const day = days[i];
      const formattedDate = formattedDays[i];
      const hasEntry = entries.some((entry) => entry.date === formattedDate);

      row.push(
        <div
          key={day.toString()}
          onClick={() => onDateClick(day)}
          className={`p-2 text-center cursor-pointer transition-colors duration-200 ${
            !isSameMonth(day, monthStart)
              ? "text-gray-400"
              : isSameDay(day, new Date())
                ? "bg-[#FF8B8B] text-white rounded-full"
                : hasEntry
                  ? "bg-[#FFE5E5] text-[#FF8B8B] rounded-full"
                  : "hover:bg-[#FFE5E5] text-[#FF8B8B]"
          }`}
        >
          {format(day, dateFormat)}
        </div>
      );

      if ((i + 1) % 7 === 0 || i === days.length - 1) {
        rows.push(
          <div key={i} className="grid grid-cols-7 gap-1 mb-1">
            {row}
          </div>
        );
        row = [];
      }
    }

    return <div className="bg-white rounded-lg p-4">{rows}</div>;
  };

  return (
    <div className="custom-calendar">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
}
