"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Trash2,
  Sparkles,
  Calendar,
  Smile,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useJournal } from "@/hooks/useJournal";
import type { JournalEntry as JournalEntryType } from "@/types/journal";
import AISummaryModal from "@/components/Mood Chart/AISummaryModal";

export default function JournalEntryPage() {
  const params = useParams();
  const router = useRouter();
  const { getEntryByDate, deleteEntry } = useJournal();
  const [entry, setEntry] = useState<JournalEntryType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);

  function handleSummaryModal() {
    setIsSummaryModalOpen(!isSummaryModalOpen);
  }

  useEffect(() => {
    let isMounted = true;

    const fetchEntry = async () => {
      if (!params?.date) {
        setError("No date provided");
        setIsLoading(false);
        return;
      }

      try {
        const fetchedEntry = await getEntryByDate(params?.date as string);
        if (isMounted && fetchedEntry) {
          setEntry(fetchedEntry);
          setIsLoading(false);
        } else if (isMounted) {
          setError("Entry not found");
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          console.log("Failed to fetch entry:", err);
          setError("Failed to fetch entry");
          setIsLoading(false);
        }
      }
    };

    fetchEntry();

    return () => {
      isMounted = false;
    };
  }, [params?.date]);

  const handleDelete = async () => {
    if (!entry) return;

    try {
      setIsLoading(true);
      await deleteEntry(entry.id);
      router.push("/");
    } catch (err) {
      console.error("Failed to delete entry:", err);
      setError("Failed to delete entry");
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFE5E5] via-[#FFF4E5] to-[#FFE5F4] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        >
          <Sparkles className="h-12 w-12 text-[#FF8B8B]" />
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFE5E5] via-[#FFF4E5] to-[#FFE5F4] p-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 text-[#FF8B8B] hover:bg-[#FFE5E5] transition-colors"
        >
          <ArrowLeft className="mr-2 h-5 w-5" /> Back
        </Button>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto bg-white/80 rounded-3xl p-8 shadow-lg text-center backdrop-blur-sm"
        >
          <Sparkles className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <div className="text-red-500 text-lg">{error}</div>
        </motion.div>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFE5E5] via-[#FFF4E5] to-[#FFE5F4] p-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 text-[#FF8B8B] hover:bg-[#FFE5E5] transition-colors"
        >
          <ArrowLeft className="mr-2 h-5 w-5" /> Back
        </Button>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto bg-white/80 rounded-3xl p-8 shadow-lg text-center backdrop-blur-sm"
        >
          <Calendar className="h-12 w-12 text-[#FF8B8B] mx-auto mb-4" />
          <div className="text-[#FF8B8B] text-lg">
            No entry found for this date.
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <AISummaryModal
        isSummaryModalOpen={isSummaryModalOpen}
        handleSummaryModal={handleSummaryModal}
        entry={entry}
      />
      <div className="min-h-screen bg-gradient-to-br from-[#FFE5E5] via-[#FFF4E5] to-[#FFE5F4] p-6">
        <div className="max-w-md mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="mb-6 text-[#FF8B8B] hover:bg-[#FFE5E5] transition-colors"
            >
              <ArrowLeft className="mr-2 h-5 w-5" /> Back
            </Button>

            <motion.div
              className="p-6 rounded-3xl bg-white/80 shadow-lg space-y-6 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between">
                <motion.h1
                  className="text-2xl font-medium text-[#FF8B8B]"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {format(new Date(entry.date), "MMMM d, yyyy")}
                </motion.h1>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Button
                    variant="ghost"
                    onClick={handleDelete}
                    className="text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </motion.div>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Button
                  onClick={handleSummaryModal}
                  className="w-full bg-gradient-to-r from-[#FF8B8B] to-[#FFB5B5] hover:from-[#FF7B7B] hover:to-[#FFA5A5] text-white rounded-2xl shadow-sm transition-colors"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Analyze with AI
                </Button>
              </motion.div>
              <AnimatePresence>
                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 }}
                  >
                    <h3 className="text-lg font-medium text-[#FF8B8B] flex items-center">
                      <Smile className="mr-2 h-5 w-5" />
                      Mood
                    </h3>
                    <p className="text-[#FF8B8B]/70 ml-7">{entry.mood}</p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 }}
                  >
                    <h3 className="text-lg font-medium text-[#FF8B8B] flex items-center">
                      <FileText className="mr-2 h-5 w-5" />
                      Feelings
                    </h3>
                    <p className="text-[#FF8B8B]/70 whitespace-pre-wrap ml-7">
                      {entry.content}
                    </p>
                  </motion.div>
                  {entry.symptoms && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.4 }}
                    >
                      <h3 className="text-lg font-medium text-[#FF8B8B] flex items-center">
                        <Sparkles className="mr-2 h-5 w-5" />
                        Symptoms
                      </h3>
                      <p className="text-[#FF8B8B]/70 whitespace-pre-wrap ml-7">
                        {entry.symptoms}
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
