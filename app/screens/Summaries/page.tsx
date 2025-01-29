"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@auth0/nextjs-auth0/client";
import { SummaryTabs } from "@/components/Summary/SummaryTabs";
import { SummaryGrid } from "@/components/Summary/SummaryGrid";
import { SummaryModal } from "@/components/Summary/SummaryModal";
import type { EntrySummary } from "@/types/journal";
import type { ChatSummary } from "@/types/chat";
import { collection, query, where, getDocs } from "firebase/firestore";
import { firestore as db } from "../../../src/firebase/firebase";

type CombinedSummary = (EntrySummary | ChatSummary) & {
  type: "entry" | "chat";
};

const floatingBubbles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 40 + 20,
  duration: Math.random() * 20 + 10,
}));

export default function Summaries() {
  const [summaries, setSummaries] = useState<CombinedSummary[]>([]);
  const [selectedSummary, setSelectedSummary] =
    useState<CombinedSummary | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "entry" | "chat">("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    const fetchSummaries = async () => {
      if (!user) return;

      setLoading(true);
      setError(null);

      try {
        const entrySummariesQuery = query(
          collection(db, "entry_summaries"),
          where("userId", "==", user.sub)
        );
        const chatSummariesQuery = query(
          collection(db, "chat_summaries"),
          where("userId", "==", user.sub)
        );

        const [entrySummariesSnapshot, chatSummariesSnapshot] =
          await Promise.all([
            getDocs(entrySummariesQuery),
            getDocs(chatSummariesQuery),
          ]);

        const entrySummaries: CombinedSummary[] =
          entrySummariesSnapshot.docs.map((doc) => ({
            ...(doc.data() as EntrySummary),
            id: doc.id,
            type: "entry" as const,
          }));

        const chatSummaries: CombinedSummary[] = chatSummariesSnapshot.docs.map(
          (doc) => ({
            ...(doc.data() as ChatSummary),
            id: doc.id,
            type: "chat" as const,
          })
        );

        setSummaries([...entrySummaries, ...chatSummaries]);
      } catch (err) {
        console.error("Error fetching summaries:", err);
        setError("Failed to fetch summaries. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSummaries();
  }, [user]);

  const handleTabChange = (tab: "all" | "entry" | "chat") => {
    setActiveTab(tab);
  };

  const filteredSummaries =
    activeTab === "all"
      ? summaries
      : summaries.filter((summary) => summary.type === activeTab);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFE5E5] via-[#FFF4E5] to-[#FFE5F4] p-6 overflow-hidden relative">
      {floatingBubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          className="absolute rounded-full bg-white/20 backdrop-blur-sm"
          style={{
            width: bubble.size,
            height: bubble.size,
            x: `${bubble.x}%`,
            y: `${bubble.y}%`,
          }}
          animate={{
            x: [`${bubble.x}%`, `${(bubble.x + 50) % 100}%`],
            y: [`${bubble.y}%`, `${(bubble.y + 50) % 100}%`],
          }}
          transition={{
            duration: bubble.duration,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      ))}

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6 text-[#FF8B8B] hover:bg-[#FFE5E5]"
          >
            <ArrowLeft className="h-5 w-5 mr-2" /> Back
          </Button>

          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-[#FF8B8B] mb-2">
              Your AI Summaries
            </h1>
            <p className="text-[#FF8B8B]/70 text-lg">
              Review your journal entries and chat summaries
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <SummaryTabs activeTab={activeTab} onTabChange={handleTabChange} />
          </motion.div>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white/80 rounded-3xl p-8 shadow-lg text-center backdrop-blur-sm"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                >
                  <Sparkles className="h-12 w-12 text-[#FF8B8B] mx-auto mb-4" />
                </motion.div>
                <p className="text-[#FF8B8B] text-lg">
                  Loading your summaries...
                </p>
              </motion.div>
            ) : error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white/80 rounded-3xl p-8 shadow-lg text-center backdrop-blur-sm"
              >
                <div className="text-red-500 text-lg mb-4">{error}</div>
                <Button
                  onClick={() => window.location.reload()}
                  className="bg-gradient-to-r from-[#FF8B8B] to-[#FFB5B5] hover:from-[#FF7B7B] hover:to-[#FFA5A5] text-white"
                >
                  Try Again
                </Button>
              </motion.div>
            ) : (
              <SummaryGrid
                summaries={filteredSummaries}
                onSummaryClick={setSelectedSummary}
              />
            )}
          </AnimatePresence>

          {selectedSummary && (
            <SummaryModal
              isOpen={true}
              onClose={() => setSelectedSummary(null)}
              summary={selectedSummary}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}
