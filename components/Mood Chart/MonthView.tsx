"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { JournalEntry } from "@/types/journal";
import { MOOD_COLORS } from "@/types/mood-chart";
import { ChevronDown } from "lucide-react";

interface MonthViewProps {
  entries: JournalEntry[];
}

export function MonthView({ entries }: MonthViewProps) {
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);

  const sortedEntries = [...entries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (entries.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white/80 rounded-2xl p-8 text-center"
      >
        <p className="text-lg text-[#FF8B8B]/70">
          No entries found for this month
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {sortedEntries.map((entry) => (
        <motion.div
          key={entry.id}
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 rounded-2xl overflow-hidden"
        >
          <div
            className="p-6 cursor-pointer"
            onClick={() =>
              setExpandedEntry(expandedEntry === entry.id ? null : entry.id)
            }
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{
                    backgroundColor:
                      MOOD_COLORS[entry.mood as keyof typeof MOOD_COLORS],
                  }}
                />
                <span className="text-lg font-medium text-[#FF8B8B]">
                  {format(new Date(entry.date), "MMMM d, yyyy")}
                </span>
              </div>
              <motion.div
                animate={{ rotate: expandedEntry === entry.id ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown className="w-5 h-5 text-[#FF8B8B]" />
              </motion.div>
            </div>

            <AnimatePresence>
              {expandedEntry === entry.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 pt-4 border-t border-[#FF8B8B]/10"
                >
                  <h3 className="text-lg font-medium text-[#FF8B8B] mb-2">
                    Feeling {entry.mood}
                  </h3>
                  <p className="text-[#FF8B8B]/70 whitespace-pre-wrap">
                    {entry.content}
                  </p>
                  {entry.symptoms && (
                    <div className="mt-4">
                      <h4 className="text-md font-medium text-[#FF8B8B] mb-1">
                        Symptoms
                      </h4>
                      <p className="text-[#FF8B8B]/70">{entry.symptoms}</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
