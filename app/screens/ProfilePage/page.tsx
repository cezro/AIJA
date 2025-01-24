"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LogOut, ArrowLeft, Mail, Calendar, Sparkles } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const { user, error, isLoading } = useUser();
  const router = useRouter();

  if (isLoading) {
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
          <Sparkles className="h-12 w-12 text-[#FF6B6B]" />
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFE5E5] via-[#FFF4E5] to-[#FFE5F4] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/80 rounded-3xl p-8 shadow-lg text-center"
        >
          <Sparkles className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <div className="text-red-500 text-lg">{error.message}</div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFE5E5] via-[#FFF4E5] to-[#FFE5F4] p-6">
      <div className="max-w-md mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-[#FF8B8B] hover:bg-[#FFE5E5] mb-6 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" /> Back
          </Button>

          <motion.div
            className="p-8 rounded-3xl bg-white/80 shadow-lg space-y-8 backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="flex flex-col items-center"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="relative">
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-[#FFB5B5] to-[#FFD4E5] rounded-full blur"
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
                <Avatar className="h-32 w-32 border-4 border-white relative">
                  <AvatarImage
                    src={user?.picture || ""}
                    alt={user?.name || "User"}
                  />
                  <AvatarFallback className="text-3xl bg-gradient-to-br from-[#FFB5B5] to-[#FFD4E5] text-white">
                    {user?.name?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
              </div>
              <motion.h2
                className="text-3xl font-medium text-[#FF8B8B] mt-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                {user?.name}
              </motion.h2>
            </motion.div>

            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <motion.div
                className="flex items-center gap-3 p-4 rounded-2xl bg-white/50 hover:bg-white/70 transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                <Mail className="h-5 w-5 text-[#FF8B8B]" />
                <span className="text-[#FF8B8B]/70">{user?.email}</span>
              </motion.div>

              <motion.div
                className="flex items-center gap-3 p-4 rounded-2xl bg-white/50 hover:bg-white/70 transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                <Calendar className="h-5 w-5 text-[#FF8B8B]" />
                <span className="text-[#FF8B8B]/70">Joined January 2024</span>
              </motion.div>
            </motion.div>

            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <Button
                className="w-full h-12 bg-gradient-to-r from-[#FF8B8B] to-[#FFB5B5] hover:from-[#FF7B7B] hover:to-[#FFA5A5] text-white rounded-2xl shadow-sm transition-colors"
                onClick={() => router.push("/screens/Summaries")}
              >
                <Sparkles className="mr-2 h-5 w-5" />
                View Summaries
              </Button>

              <Button
                className="w-full h-12 bg-gradient-to-r from-[#FF8B8B] to-[#FFB5B5] hover:from-[#FF7B7B] hover:to-[#FFA5A5] text-white rounded-2xl shadow-sm transition-colors"
                onClick={() => (window.location.href = "/api/auth/logout")}
              >
                <LogOut className="mr-2 h-5 w-5" /> Log Out
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
