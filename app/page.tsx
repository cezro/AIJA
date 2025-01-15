"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useUser } from "@auth0/nextjs-auth0/client";
import Home from "./screens/Home/page";
import { Sparkles } from "lucide-react";

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const { user, error, isLoading } = useUser();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (isLoading)
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
  if (error) return <div>{error.message}</div>;

  if (user) {
    return (
      <div>
        <Home />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex flex-col justify-center items-center p-4 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center z-10"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-white mt-8">
          Welcome to
        </h1>
        <Image
          src="/AijaLogo.png"
          alt="AIJA Logo"
          width={180}
          height={50}
          priority
          className="mb-8 ml-20 md:ml-24"
        />
        <p className="text-xl text-white mb-8">
          Your fun and relaxing digital companion
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="secondary"
            size="lg"
            className="font-semibold text-pink-500"
            onClick={() => (window.location.href = "/api/auth/login")}
          >
            Login
          </Button>
        </div>
      </motion.div>

      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 20,
          ease: "linear",
          repeat: Infinity,
        }}
        className="absolute top-1/4 left-1/4 w-16 h-16 bg-yellow-300 rounded-full opacity-50"
      />
      <motion.div
        animate={{
          scale: [1, 1.5, 1],
          rotate: [0, -180, -360],
        }}
        transition={{
          duration: 25,
          ease: "linear",
          repeat: Infinity,
        }}
        className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-blue-300 rounded-full opacity-50"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 15,
          ease: "linear",
          repeat: Infinity,
        }}
        className="absolute top-1/2 right-1/3 w-20 h-20 bg-green-300 rounded-full opacity-50"
      />
    </div>
  );
}
