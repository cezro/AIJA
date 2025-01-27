import { motion } from "framer-motion";
import { FileText, MessageSquare, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { EntrySummary } from "@/types/journal";
import type { ChatSummary } from "@/types/chat";

type CombinedSummary = (EntrySummary | ChatSummary) & {
  type: "entry" | "chat";
};

interface SummaryGridProps {
  summaries: CombinedSummary[];
  onSummaryClick: (summary: CombinedSummary) => void;
}

export function SummaryGrid({ summaries, onSummaryClick }: SummaryGridProps) {
  if (summaries.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white rounded-3xl p-8 shadow-lg text-center"
      >
        <Sparkles className="h-12 w-12 text-[#FF8B8B] mx-auto mb-4" />
        <p className="text-[#FF8B8B] text-lg">
          No summaries found. Start chatting with AIJA or creating journal
          entries to generate summaries!
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
    >
      {summaries.map((summary, index) => (
        <motion.div
          key={summary.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="relative isolate overflow-hidden"
        >
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <motion.div
                  className="flex items-center gap-3"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                >
                  {summary.type === "entry" ? (
                    <FileText className="h-6 w-6 text-[#FF8B8B]" />
                  ) : (
                    <MessageSquare className="h-6 w-6 text-[#FF8B8B]" />
                  )}
                  <h3 className="text-xl font-semibold text-[#FF8B8B]">
                    {summary.type === "entry"
                      ? "Journal Entry"
                      : "Chat Summary"}
                  </h3>
                </motion.div>
              </div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.3 }}
                className="relative"
              >
                <div className="text-[#666666] line-clamp-4 text-base leading-relaxed mb-4">
                  {summary.summary}
                </div>
                <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white to-transparent" />
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.4 }}
              >
                <Button
                  onClick={() => onSummaryClick(summary)}
                  className="w-full bg-[#FF8B8B] hover:bg-[#FF7B7B] text-white transition-colors"
                >
                  View Full Summary
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
