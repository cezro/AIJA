import ReactModal from "react-modal";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, MessageSquare } from "lucide-react";
import { Button } from "../ui/button";
import type { EntrySummary } from "@/types/journal";
import type { ChatSummary } from "@/types/chat";

type CombinedSummary = (EntrySummary | ChatSummary) & {
  type: "entry" | "chat";
};

interface SummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  summary: CombinedSummary;
}

export function SummaryModal({ isOpen, onClose, summary }: SummaryModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <ReactModal
          isOpen={isOpen}
          onRequestClose={onClose}
          ariaHideApp={false}
          className="max-w-lg w-11/12 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
          overlayClassName="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          style={{
            content: {
              border: "none",
              background: "none",
              padding: 0,
            },
            overlay: {
              overflow: "hidden",
            },
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-white rounded-3xl shadow-xl overflow-hidden"
          >
            <div className="relative bg-gradient-to-br from-[#FFE5E5] to-[#FFF4E5] p-6">
              <div className="flex justify-between items-center mb-4">
                <motion.div
                  className="flex items-center gap-3"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {summary.type === "entry" ? (
                    <FileText className="h-6 w-6 text-[#FF8B8B]" />
                  ) : (
                    <MessageSquare className="h-6 w-6 text-[#FF8B8B]" />
                  )}
                  <h2 className="text-2xl font-bold text-[#FF8B8B]">
                    {summary.type === "entry"
                      ? "Journal Entry"
                      : "Chat Summary"}
                  </h2>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="text-[#FF8B8B] hover:bg-[#FFE5E5] rounded-full"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </motion.div>
              </div>
            </div>

            <motion.div
              className="p-6 bg-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="prose max-w-none mb-6">
                <div className="text-[#666666] whitespace-pre-wrap text-lg leading-relaxed">
                  {summary.summary}
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={onClose}
                  className="bg-[#FF8B8B] hover:bg-[#FF7B7B] text-white transition-colors px-6"
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </ReactModal>
      )}
    </AnimatePresence>
  );
}
