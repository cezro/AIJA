import { format, eachMonthOfInterval, startOfYear, endOfYear } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar } from "lucide-react";

interface MonthSelectorProps {
  currentMonth: string | null;
  onMonthChange: (month: string) => void;
  onBack: () => void;
}

export function MonthSelector({
  currentMonth,
  onMonthChange,
  onBack,
}: MonthSelectorProps) {
  const months = eachMonthOfInterval({
    start: startOfYear(new Date()),
    end: endOfYear(new Date()),
  }).map((date) => ({
    label: format(date, "MMMM yyyy"),
    value: format(date, "yyyy-MM"),
  }));

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        {currentMonth && (
          <Button variant="ghost" onClick={onBack} className="text-[#FF8B8B]">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Overview
          </Button>
        )}
        <Calendar className="h-6 w-6 text-[#FF8B8B] mr-1" />
      </div>
      <Select value={currentMonth || ""} onValueChange={onMonthChange}>
        <SelectTrigger className="w-[200px] bg-white border-[#FF8B8B] text-[#FF8B8B] font-semibold">
          <SelectValue placeholder="Select month" />
        </SelectTrigger>
        <SelectContent>
          {months.map((month) => (
            <SelectItem
              key={month.value}
              value={month.value}
              className="text-[#FF8B8B] hover:bg-[#FFE5E5]"
            >
              {month.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
