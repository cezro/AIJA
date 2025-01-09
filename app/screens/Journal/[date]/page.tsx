"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useJournal } from "@/hooks/useJournal";
import type { JournalEntry as JournalEntryType } from "@/types/journal";

export default function JournalEntryPage() {
  const params = useParams();
  const router = useRouter();
  const { getEntryByDate, deleteEntry } = useJournal();
  const [entry, setEntry] = useState<JournalEntryType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        if (isMounted) {
          setEntry(fetchedEntry);
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
  }, [params?.date, getEntryByDate]);

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
      <div className="min-h-screen bg-[#FFF5F5] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF8B8B]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FFF5F5] p-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 text-[#FF8B8B]"
        >
          <ArrowLeft className="mr-2 h-5 w-5" /> Back
        </Button>
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="min-h-screen bg-[#FFF5F5] p-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 text-[#FF8B8B]"
        >
          <ArrowLeft className="mr-2 h-5 w-5" /> Back
        </Button>
        <div className="text-center text-[#FF8B8B]">
          No entry found for this date.
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
            className="mb-6 text-[#FF8B8B]"
          >
            <ArrowLeft className="mr-2 h-5 w-5" /> Back
          </Button>

          <div className="p-6 rounded-3xl bg-white/80 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-medium text-[#FF8B8B]">
                {format(new Date(entry.date), "MMMM d, yyyy")}
              </h1>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  onClick={handleDelete}
                  className="text-red-500 hover:bg-red-50"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-[#FF8B8B]">Mood</h3>
                <p className="text-[#FF8B8B]/70">{entry.mood}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-[#FF8B8B]">Feelings</h3>
                <p className="text-[#FF8B8B]/70 whitespace-pre-wrap">
                  {entry.content}
                </p>
              </div>
              {entry.symptoms && (
                <div>
                  <h3 className="text-lg font-medium text-[#FF8B8B]">
                    Symptoms
                  </h3>
                  <p className="text-[#FF8B8B]/70 whitespace-pre-wrap">
                    {entry.symptoms}
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
