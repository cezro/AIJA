"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ArrowLeft, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { moods } from "@/constants/moods";

export default function MoodSelectionPage() {
  const router = useRouter();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  function handleMoodSelect(mood: string) {
    setSelectedMood(mood);
    setTimeout(() => {
      router.push(`/screens/Journal/new/entry?mood=${mood}`);
    }, 500);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white p-4 sm:p-6 overflow-hidden">
      <div className="max-w-md mx-auto">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="text-white/80 hover:text-white hover:bg-white/10"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-6 mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            How are you feeling today?
          </h1>
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
            <Calendar className="w-5 h-5" />
            <span>{format(new Date(), "dd MMM yyyy")}</span>
          </div>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 gap-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                delayChildren: 0.3,
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {moods.map((mood) => (
            <motion.div
              key={mood.name}
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: {
                  y: 0,
                  opacity: 1,
                },
              }}
            >
              <motion.button
                onClick={() => handleMoodSelect(mood.name)}
                className="w-full h-full bg-white/10 backdrop-blur-sm rounded-lg p-4 flex flex-col items-center justify-center gap-2 transition-all duration-300 ease-in-out"
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "rgba(255,255,255,0.2)",
                }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  boxShadow:
                    selectedMood === mood.name
                      ? `0 0 20px ${mood.color}`
                      : "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div
                  className="text-4xl sm:text-5xl mb-2"
                  style={{ color: mood.color }}
                >
                  {mood.expression}
                </div>
                <div className="text-sm font-medium">{mood.name}</div>
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Floating bubbles background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/10"
            style={{
              width: Math.random() * 50 + 10,
              height: Math.random() * 50 + 10,
            }}
            animate={{
              x: ["-100%", "100%"],
              y: [Math.random() * 100 + "%", Math.random() * 100 + "%"],
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>
    </div>
  );
}
