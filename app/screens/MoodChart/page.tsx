"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { MoodChart } from "@/components/Mood Chart/MoodChart";
import { useJournal } from "@/hooks/useJournal";
import type { JournalEntry } from "@/types/journal";
import { Sparkles } from "lucide-react";

export default function MoodTracker() {
  const router = useRouter();
  const { getUserEntries } = useJournal();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const fetchedEntries = await getUserEntries();
        setEntries(fetchedEntries);
      } catch (error) {
        console.error("Failed to fetch entries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, [getUserEntries]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFE5E5] via-[#FFF4E5] to-[#FFE5F4]">
      <div className="max-w-7xl mx-auto">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6"
        >
          <Button
            onClick={() => router.back()}
            variant="ghost"
            className="text-[#FF8B8B] mb-6"
          >
            <ArrowLeft className="h-6 w-6 mr-2" />
            Back
          </Button>
        </motion.header>

        <main className="px-4 pb-16">
          <MoodChart entries={entries} />
        </main>
      </div>
    </div>
  );
}
