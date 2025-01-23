"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import React from "react";

export default function AIChatEnd() {
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
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center z-10 relative"
        >
          <motion.div
            className="text-4xl md:text-6xl font-bold text-[#FF8B8B] mb-4"
            animate={{
              opacity: [1, 0],
              y: [0, -20],
            }}
            transition={{
              duration: 1.5,
              delay: 0.8,
              ease: "easeInOut",
            }}
          >
            Chat Complete! ✨
          </motion.div>
        </motion.div>

        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              background: `linear-gradient(45deg, #FFB5B5 0%, #FFD4E5 100%)`,
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            initial={{
              scale: 0,
              x: 0,
              y: 0,
              opacity: 0,
            }}
            animate={{
              scale: [1, 1.2, 1],
              x: Math.random() * 200 - 100,
              y: Math.random() * 200 - 100,
              opacity: [0.3, 0.6, 0],
            }}
            transition={{
              duration: 2,
              delay: i * 0.1,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}
