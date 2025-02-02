"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Save, Calendar, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useJournal } from "@/hooks/useJournal";
import type { CreateJournalEntry } from "@/types/journal";

interface EntryFormProps {
  selectedMood: string | null | undefined;
}

export function EntryForm({ selectedMood }: EntryFormProps) {
  const router = useRouter();
  const { createEntry, loading, error } = useJournal();

  const [entry, setEntry] = useState<CreateJournalEntry>({
    date: format(new Date(), "yyyy-MM-dd"),
    content: "",
    mood: selectedMood || "",
    symptoms: "",
  });

  useEffect(() => {
    if (!selectedMood) {
      router.replace("/screens/Journal/new/mood");
    }
  }, [selectedMood, router]);

  async function handleSave() {
    try {
      await createEntry(entry);
      router.push("/");
    } catch (err) {
      console.error("Failed to create entry:", err);
    }
  }

  if (loading) {
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
          <Sparkles className="h-8 w-8 text-[#FF6B6B]" />
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFE5E5] via-[#FFF4E5] to-[#FFE5F4] flex items-center justify-center">
        <div className="text-lg text-[#FF6B6B]">Error: {error}</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <motion.div
        className="p-8 rounded-[2rem] bg-white/40 backdrop-blur-sm border-4 border-[#FFB5B5]/30"
        whileHover={{ scale: 1.01 }}
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#FF6B6B] to-[#FF8EC3] bg-clip-text text-transparent mb-8">
          New Journal Entry
        </h1>

        <div className="space-y-8">
          <motion.div whileHover={{ scale: 1.02 }}>
            <label
              htmlFor="date"
              className="flex items-center gap-2 text-[#FF6B6B] text-lg mb-3"
            >
              <Calendar className="h-5 w-5" />
              Date
            </label>
            <Input
              id="date"
              type="date"
              value={entry.date}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEntry((prev) => ({ ...prev, date: e.target.value }))
              }
              className="bg-white/50 border-[#FFB5B5]/30 text-[#FF6B6B] text-lg rounded-2xl h-12"
            />
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <label htmlFor="mood" className="text-[#FF6B6B] text-lg mb-3 block">
              Current Mood
            </label>
            <div className="p-4 rounded-2xl bg-white/50 text-[#FF6B6B] text-lg border-2 border-[#FFB5B5]/30">
              {entry.mood}
            </div>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <label
              htmlFor="content"
              className="text-[#FF6B6B] text-lg mb-3 block"
            >
              Why do you feel {entry.mood}?
            </label>
            <Textarea
              id="content"
              value={entry.content}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setEntry((prev) => ({ ...prev, content: e.target.value }))
              }
              placeholder="Describe your feelings..."
              className="min-h-[150px] bg-white/50 border-[#FFB5B5]/30 text-[#FF6B6B] placeholder:text-[#FFB5B5] rounded-2xl text-lg"
            />
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <label
              htmlFor="symptoms"
              className="text-[#FF6B6B] text-lg mb-3 block"
            >
              Symptoms (if any)
            </label>
            <Textarea
              id="symptoms"
              value={entry.symptoms}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setEntry((prev) => ({
                  ...prev,
                  symptoms: e.target.value,
                }))
              }
              placeholder="List any physical or emotional symptoms..."
              className="min-h-[100px] bg-white/50 border-[#FFB5B5]/30 text-[#FF6B6B] placeholder:text-[#FFB5B5] rounded-2xl text-lg"
            />
          </motion.div>

          <div className="flex gap-4 pt-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="flex-1 text-[#FF8B8B] hover:text-[#FF7B7B] hover:bg-[#FFE5E5] rounded-2xl text-lg py-6"
            >
              Back
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-[#FF6B6B] to-[#FF8EC3] hover:from-[#FF5B5B] hover:to-[#FF7EB3] text-white rounded-2xl text-lg py-6"
            >
              <Save className="mr-2 h-5 w-5" />
              Save Entry
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
