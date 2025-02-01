"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Book,
  GraduationCap,
  ArrowRight,
  Calculator,
  FlaskRoundIcon as Flask,
  BookOpen,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Subject } from "@/types/games";

const subjectIcons = {
  [Subject.MATHEMATICS]: <Calculator className="h-6 w-6" />,
  [Subject.SCIENCE]: <Flask className="h-6 w-6" />,
  [Subject.ENGLISH]: <BookOpen className="h-6 w-6" />,
};

export default function QuizSelector() {
  const router = useRouter();
  const [subject, setSubject] = useState("");
  const [level, setLevel] = useState<number>(0);

  function handleStartQuiz() {
    if (subject === "" || level === 0) {
      return;
    }
    router.push(`/screens/Games/${subject}/${level}`);
  }

  return (
    <div className="min-h-screen bg-[#FFF5F5] p-6 flex flex-col justify-center">
      <div className="max-w-md mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Book className="h-12 w-12 mx-auto mb-4 text-[#FF8B8B]" />
          <h1 className="text-3xl font-bold text-[#FF8B8B] mb-2">Quiz Time!</h1>
          <p className="text-[#FF8B8B]/70">
            Challenge yourself with our educational quizzes
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg space-y-6"
        >
          <div className="space-y-4">
            <label className="block text-sm font-medium text-[#FF8B8B]">
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap className="h-5 w-5 text-[#FF8B8B]" />
                Grade Level
              </div>
              <Input
                type="number"
                className="w-full border-[#FFB5B5] focus:border-[#FF8B8B] rounded-xl text-[#FF8B8B] placeholder:text-[#FFB5B5]"
                min="1"
                max="12"
                value={level || ""}
                onChange={(e) => {
                  const val = Number.parseInt(e.target.value);
                  if (!isNaN(val) && val >= 1 && val <= 12) {
                    setLevel(val);
                  }
                }}
                placeholder="Enter grade level (1-12)"
              />
            </label>

            <label className="block text-sm font-medium text-[#FF8B8B]">
              <div className="flex items-center gap-2 mb-2">
                <Book className="h-5 w-5 text-[#FF8B8B]" />
                Subject
              </div>
              <Select onValueChange={(value) => setSubject(value)}>
                <SelectTrigger className="w-full border-[#FFB5B5] rounded-xl text-[#FF8B8B]">
                  <SelectValue placeholder="Choose a subject" />
                </SelectTrigger>
                <SelectContent className="bg-white/95 border-[#FFB5B5]">
                  {Object.values(Subject).map((subj) => (
                    <SelectItem
                      key={subj}
                      value={subj}
                      className="flex items-center gap-2 text-[#FF8B8B] hover:bg-[#FFE5E5] focus:bg-[#FFE5E5] focus:text-[#FF8B8B]"
                    >
                      <div className="flex items-center gap-2">
                        {subjectIcons[subj as Subject]}
                        <span className="capitalize">{subj}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
          </div>

          <Button
            onClick={handleStartQuiz}
            disabled={!subject || !level}
            className="w-full bg-[#FF8B8B] hover:bg-[#FF7B7B] text-white rounded-xl h-12 text-lg"
          >
            Start Quiz
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <Button
            variant="ghost"
            onClick={() => router.push("/screens/Home")}
            className="text-[#FF8B8B] hover:text-[#FF7B7B]"
          >
            <Home className="mr-2 h-5 w-5" />
            Back to Home
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
