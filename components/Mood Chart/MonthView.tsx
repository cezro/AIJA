"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import type { JournalEntry } from "@/types/journal";
import { MOOD_COLORS } from "@/types/mood-chart";
import { ChevronDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import AISummaryModal from "./AISummaryModal";

interface MonthViewProps {
  entries: JournalEntry[];
}

export function MonthView({ entries }: MonthViewProps) {
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);
  const [entryId, setEntryId] = useState<string>("");

  function handleSummaryModal() {
    setIsSummaryModalOpen(!isSummaryModalOpen);
  }

  function handleEntryId(entry: JournalEntry) {
    setEntryId(entry.id);
  }

  const sortedEntries = [...entries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (entries.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-3xl p-8 text-center"
      >
        <p className="text-lg text-[#FF8B8B]/70">
          No entries found for this month
        </p>
      </motion.div>
    );
  }

  return (
    <>
      <AISummaryModal
        isSummaryModalOpen={isSummaryModalOpen}
        handleSummaryModal={handleSummaryModal}
        entry={sortedEntries.filter((entry) => entry.id === entryId)[0]}
      />
      <div className="space-y-4">
        {sortedEntries.map((entry, index) => (
          <motion.div
            key={entry.id}
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-3xl overflow-hidden group hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() =>
                    setExpandedEntry(
                      expandedEntry === entry.id ? null : entry.id
                    )
                  }
                >
                  <motion.div
                    className="w-4 h-4 rounded-full"
                    style={{
                      backgroundColor:
                        MOOD_COLORS[entry.mood as keyof typeof MOOD_COLORS],
                    }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  />
                  <span className="text-lg font-medium text-[#FF8B8B]">
                    {format(new Date(entry.date), "MMMM d, yyyy")}
                  </span>
                  <motion.div
                    animate={{ rotate: expandedEntry === entry.id ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-5 h-5 text-[#FF8B8B]" />
                  </motion.div>
                </div>

                <Button
                  onClick={() => {
                    handleSummaryModal();
                    handleEntryId(entry);
                  }}
                  className="bg-white/50 hover:bg-[#FFE5E5] text-[#FF8B8B] border border-[#FF8B8B]/20"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Analyze with AI
                </Button>
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
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-4"
                      >
                        <h4 className="text-md font-medium text-[#FF8B8B] mb-1">
                          Symptoms
                        </h4>
                        <p className="text-[#FF8B8B]/70">{entry.symptoms}</p>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
}
