"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { JournalEntry } from "@/types/journal";
import { MOOD_COLORS } from "@/types/mood-chart";
import { MonthSelector } from "./MonthSelector";
import { MonthView } from "./MonthView";

interface MoodChartProps {
  entries: JournalEntry[];
}

export function MoodChart({ entries }: MoodChartProps) {
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  // Calculate total counts for each mood
  const moodCounts = entries.reduce(
    (acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const maxCount = Math.max(...Object.values(moodCounts), 1);

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-4xl font-bold text-[#FF8B8B] mb-2">Mood Chart</h2>
        <p className="text-xl text-[#FF8B8B]/70">
          Track your emotional journey
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/90 rounded-2xl p-6 shadow-sm backdrop-blur-sm"
      >
        <MonthSelector
          currentMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
          onBack={() => setSelectedMonth(null)}
        />
      </motion.div>

      <AnimatePresence mode="wait">
        {selectedMonth ? (
          <MonthView
            key="month-view"
            entries={entries.filter((entry) =>
              entry.date.startsWith(selectedMonth)
            )}
          />
        ) : (
          <motion.div
            key="mood-overview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {Object.entries(MOOD_COLORS).map(([mood, color], index) => (
              <motion.div
                key={mood}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-[#FF8B8B]">{mood}</h3>
                  <motion.div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: color }}
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </div>
                <div className="relative h-20 bg-[#FFE5E5] rounded-xl overflow-hidden">
                  <motion.div
                    className="absolute bottom-0 w-full"
                    initial={{ height: 0 }}
                    animate={{
                      height: `${((moodCounts[mood] || 0) / maxCount) * 100}%`,
                    }}
                    transition={{
                      duration: 1.5,
                      ease: "easeInOut",
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                    style={{ backgroundColor: color }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.span
                      className="text-2xl font-bold text-white drop-shadow-lg"
                      animate={{
                        opacity: [0.8, 1, 0.8],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      {moodCounts[mood] || 0}
                    </motion.span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
