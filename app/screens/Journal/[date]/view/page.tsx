"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ArrowLeft, Edit2, Trash2, Calendar, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useJournal } from "@/hooks/useJournal";
import type { JournalEntry } from "@/types/journal";
import { useToast } from "../../../../../hooks/use-toast";

export default function ViewJournalEntry() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const date = params?.date as string;

  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const { getEntryByDate, deleteEntry, loading, error } = useJournal();
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const fetchedEntry = await getEntryByDate(date);
        setEntry(fetchedEntry);
      } catch (err) {
        console.error("Failed to fetch journal entry:", err);
        toast({
          title: "Error",
          description: "Failed to fetch journal entry",
          variant: "destructive",
        });
      }
    };
    fetchEntry();
  }, [date, getEntryByDate, toast]);

  async function handleDelete() {
    if (!entry) return;

    try {
      setIsDeleting(true);
      await deleteEntry(entry.id);
      toast({
        title: "Success",
        description: "Journal entry deleted successfully",
      });
      router.push("/");
    } catch (err) {
      console.error("Failed to delete journal entry:", err);
      toast({
        title: "Error",
        description: "Failed to delete journal entry",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF5F5] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="h-8 w-8 text-[#FF8B8B]" />
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FFF5F5] flex items-center justify-center">
        <div className="text-red-500 text-lg">Error: {error}</div>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="min-h-screen bg-[#FFF5F5]">
        <div className="max-w-md mx-auto p-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-[#FF8B8B] mb-6"
          >
            <ArrowLeft className="h-5 w-5 mr-2" /> Back
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 rounded-3xl bg-white/80 shadow-sm text-center"
          >
            <Calendar className="h-12 w-12 text-[#FFB5B5] mx-auto mb-4" />
            <p className="text-[#FF8B8B]/70 text-lg">
              No entry found for this date
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF5F5]">
      <div className="max-w-md mx-auto p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-[#FF8B8B] mb-6"
          >
            <ArrowLeft className="h-5 w-5 mr-2" /> Back
          </Button>

          <div className="p-6 rounded-3xl bg-white/80 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-medium text-[#FF8B8B]">
                {format(new Date(entry.date), "MMMM d, yyyy")}
              </h1>
              <div className="flex gap-2">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push(`/screens/Journal/${date}/edit`)}
                    className="text-[#FF8B8B] hover:text-[#FF7B7B] hover:bg-[#FFE5E5]"
                  >
                    <Edit2 className="h-5 w-5" />
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-400 hover:text-red-500 hover:bg-red-50"
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </motion.div>
              </div>
            </div>

            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="p-4 rounded-2xl bg-white/50"
              >
                <h3 className="text-lg font-medium text-[#FF8B8B] mb-2">
                  Mood
                </h3>
                <p className="text-[#FF8B8B]/70 text-lg">{entry.mood}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-4 rounded-2xl bg-white/50"
              >
                <h3 className="text-lg font-medium text-[#FF8B8B] mb-2">
                  Feelings
                </h3>
                <p className="text-[#FF8B8B]/70 whitespace-pre-wrap">
                  {entry.content}
                </p>
              </motion.div>

              {entry.symptoms && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="p-4 rounded-2xl bg-white/50"
                >
                  <h3 className="text-lg font-medium text-[#FF8B8B] mb-2">
                    Symptoms
                  </h3>
                  <p className="text-[#FF8B8B]/70 whitespace-pre-wrap">
                    {entry.symptoms}
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
