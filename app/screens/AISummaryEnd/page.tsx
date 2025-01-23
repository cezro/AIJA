"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import React from "react";

export default function AISummaryEnd() {
  const router = useRouter();

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      router.push("/screens/Home");
    }, 2500);

    return () => clearTimeout(timeoutId);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFE5E5] via-[#FFF4E5] to-[#FFE5F4] flex items-center justify-center overflow-hidden">
      <div className="relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center relative z-10"
        >
          <motion.div
            className="text-5xl md:text-7xl font-bold"
            style={{
              background: "linear-gradient(45deg, #FF8B8B, #FFB5B5)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            ✨ Summary Saved! ✨
          </motion.div>
        </motion.div>

        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              width: Math.random() * 60 + 20,
              height: Math.random() * 60 + 20,
              borderRadius: Math.random() > 0.5 ? "50%" : "30%",
              background: `linear-gradient(135deg, #FFB5B5 ${
                Math.random() * 100
              }%, #FFD4E5)`,
              filter: "blur(1px)",
            }}
            initial={{
              x: 0,
              y: 0,
              opacity: 0,
              scale: 0,
            }}
            animate={{
              x: Math.random() * 400 - 200,
              y: Math.random() * 400 - 200,
              opacity: [0, 0.5, 0],
              scale: [0, 1, 0],
              rotate: Math.random() * 360,
            }}
            transition={{
              duration: 2,
              delay: i * 0.1,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>
    </div>
  );
}
