"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ArrowLeft, Save, Calendar, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useJournal } from "@/hooks/useJournal";
import type { CreateJournalEntry } from "@/types/journal";

export default function NewJournalEntry() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedMood = searchParams?.get("mood");
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
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
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
    <div className="min-h-screen bg-gradient-to-br from-[#FFE5E5] via-[#FFF4E5] to-[#FFE5F4] overflow-hidden">
      {/* Floating shapes */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-[#FFB5B5] to-[#FFD4E5]"
            style={{
              width: Math.random() * 200 + 100,
              height: Math.random() * 200 + 100,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.1,
            }}
            animate={{
              x: [0, Math.random() * 50 - 25],
              y: [0, Math.random() * 50 - 25],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6 text-[#FF6B6B] hover:text-[#FF5B5B] hover:bg-[#FFB5B5]/20"
          >
            <ArrowLeft className="h-6 w-6 mr-2" />
            Back
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <motion.div
              className="p-8 rounded-[2rem] bg-white/40 backdrop-blur-sm border-4 border-[#FFB5B5]/30"
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-[#FF6B6B] to-[#FF8EC3] bg-clip-text text-transparent">
                  New Journal Entry
                </h1>
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={handleSave}
                    className="bg-gradient-to-r from-[#FF6B6B] to-[#FF8EC3] hover:from-[#FF5B5B] hover:to-[#FF7EB3] text-white rounded-2xl text-lg px-6"
                  >
                    <Save className="mr-2 h-5 w-5" />
                    Save Entry
                  </Button>
                </motion.div>
              </div>

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
                  <label
                    htmlFor="mood"
                    className="text-[#FF6B6B] text-lg mb-3 block"
                  >
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
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
