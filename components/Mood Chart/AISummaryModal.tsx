"use client";

import type { JournalEntry } from "@/types/journal";
import ReactModal from "react-modal";
import { Button } from "../../components/ui/button";
import { useEntry } from "@/hooks/useEntry";
import { useEffect, useState } from "react";
import * as entryApi from "@/src/firebase/entry";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RefreshCcw, Save, X } from "lucide-react";

interface AISummaryModalProps {
  isSummaryModalOpen: boolean;
  handleSummaryModal: () => void;
  entry: JournalEntry;
}

export default function AISummaryModal(props: AISummaryModalProps) {
  const { user } = useUser();
  const { isSummaryModalOpen, handleSummaryModal, entry } = props;
  const { summarizeEntry } = useEntry();
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  async function generateSummary() {
    setIsLoading(true);
    const summary = await summarizeEntry(entry);
    setSummary(summary);
    setIsLoading(false);
  }

  function handleNavigationToSuccessPage() {
    router.push("/screens/AISummaryEnd");
  }

  useEffect(() => {
    generateSummary();
  }, [entry]);

  function handleSave() {
    const userId = user?.sub;
    entryApi.uploadEntrySummary(userId as string, summary);
    handleNavigationToSuccessPage();
  }

  return (
    <ReactModal
      isOpen={isSummaryModalOpen}
      ariaHideApp={false}
      className="max-w-md w-11/12 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      overlayClassName="fixed inset-0 bg-black/50 backdrop-blur-sm"
      style={{
        content: {
          border: "none",
          background: "none",
          padding: 0,
        },
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gradient-to-br from-white/90 to-white/80 backdrop-blur-md p-6 rounded-3xl shadow-lg"
      >
        <div className="flex justify-between items-center mb-6">
          <motion.h2
            className="text-2xl font-semibold text-[#FF8B8B] flex items-center gap-2"
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            <Sparkles className="h-5 w-5" />
            AI Summary
          </motion.h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSummaryModal}
            className="text-[#FF8B8B] hover:bg-[#FFE5E5]"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="min-h-[200px] mb-6">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center h-full"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                  className="text-[#FF8B8B]"
                >
                  <Sparkles className="h-8 w-8" />
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-[#FF8B8B]/70 whitespace-pre-wrap"
              >
                {summary}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div
          className="flex justify-end gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            onClick={generateSummary}
            variant="outline"
            className="bg-white/50 border-[#FF8B8B]/20 text-[#FF8B8B] hover:bg-[#FFE5E5]"
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            Regenerate
          </Button>
          <Button
            onClick={handleSave}
            className="bg-[#FF8B8B] hover:bg-[#FF7B7B] text-white"
          >
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </motion.div>
      </motion.div>
    </ReactModal>
  );
}
