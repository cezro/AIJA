"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EntryForm } from "../../../../../components/Journal/EntryForm";

function EntryFormWrapper() {
  const searchParams = useSearchParams();
  const selectedMood = searchParams?.get("mood");

  return <EntryForm selectedMood={selectedMood} />;
}

export default function NewJournalEntry() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFE5E5] via-[#FFF4E5] to-[#FFE5F4] overflow-hidden">
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

          <Suspense fallback={<div>Loading...</div>}>
            <EntryFormWrapper />
          </Suspense>
        </motion.div>
      </div>
    </div>
  );
}
