import { JournalEntry } from "./journal";

export interface MoodChartProps {
  entries: JournalEntry[];
  selectedMonth: string;
  onMonthChange: (month: string) => void;
}

export interface MonthData {
  label: string;
  value: string;
}

export const MOOD_COLORS = {
  Calm: "#4ADE80",
  Worried: "#818CF8",
  Happy: "#FCD34D",
  Sad: "#60A5FA",
  Angry: "#F87171",
  Chill: "#34D399",
  Excited: "#A78BFA",
  Bored: "#9CA3AF",
  Confused: "#FB923C",
  Uncomfortable: "#F472B6",
  Embarrassed: "#FB7185",
};
