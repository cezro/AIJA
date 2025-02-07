"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeft, Phone, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { hotlines } from "@/constants/hotline";

export default function HelpPage() {
  const router = useRouter();
  const [expandedHotline, setExpandedHotline] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFE5E5] via-[#FFF4E5] to-[#FFE5F4] p-6">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 text-[#FF8B8B] hover:text-[#FF7B7B] hover:bg-[#FFE5E5]"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-[#FF8B8B] mb-2">
            Help & Support
          </h1>
          <p className="text-[#FF8B8B]/70">
            If you&apos;re in crisis, please reach out to one of these
            helplines:
          </p>
        </motion.div>

        <motion.div className="space-y-4">
          {hotlines.map((hotline, index) => (
            <motion.div
              key={hotline.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Button
                variant="outline"
                onClick={() =>
                  setExpandedHotline(
                    expandedHotline === hotline.name ? null : hotline.name
                  )
                }
                className={`w-full justify-between text-left p-4 bg-white/80 hover:bg-white/90 rounded-2xl shadow-sm transition-all duration-300 ${
                  expandedHotline === hotline.name
                    ? "text-[#FF8B8B]"
                    : "text-[#FFB5B5]"
                }`}
              >
                <span className="font-semibold text-[#FF8B8B]">
                  {hotline.name}
                </span>
                <Phone
                  className={`h-5 w-5 ${
                    expandedHotline === hotline.name
                      ? "text-[#FF8B8B]"
                      : "text-[#FFB5B5]"
                  }`}
                />
              </Button>
              {expandedHotline === hotline.name && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 p-4 bg-white/60 rounded-2xl space-y-2"
                >
                  {hotline.numbers.map((number, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between"
                    >
                      <span className="text-[#FF8B8B]/80">{number}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-[#FF8B8B] hover:text-[#FF7B7B] hover:bg-[#FFE5E5]"
                        onClick={() =>
                          window.open(`tel:${number.replace(/\D/g, "")}`)
                        }
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
