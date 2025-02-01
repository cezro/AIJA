"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle, Home, Sparkles } from "lucide-react";
import { useGames } from "@/hooks/useGames";
import type { QuizChoices, QuizQuestion, Subject } from "@/types/games";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function Quiz() {
  const params = useParams();
  const router = useRouter();

  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<number, QuizChoices>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const { createQuiz } = useGames();
  const subject = params?.subject as Subject;
  const level = Number.parseInt(params?.level as string);

  useEffect(() => {
    async function generateQuiz() {
      const questions = await createQuiz(subject, level);
      setQuiz(questions);
      setIsLoading(false);
    }
    generateQuiz();
  }, [subject, level]);

  const handleAnswerSelect = (questionNumber: number, choice: QuizChoices) => {
    setAnswers((prev) => ({
      ...prev,
      [questionNumber]: choice,
    }));
  };

  const handleSubmit = () => {
    let totalScore = 0;
    quiz.forEach((question) => {
      if (answers[question.number]?.choice === question.answer) {
        totalScore += 1;
      }
    });
    setScore(totalScore);
    setShowResults(true);
  };

  if (isLoading) {
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
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-[#FFF5F5] p-6 flex items-center justify-center">
        <div className="max-w-md w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg text-center"
          >
            <CheckCircle className="h-16 w-16 mx-auto mb-6 text-green-500" />
            <h2 className="text-2xl font-bold text-[#FF8B8B] mb-4">
              Quiz Complete!
            </h2>
            <p className="text-xl text-[#FF8B8B]/70 mb-6">
              Your score: {score} out of {quiz.length}
            </p>
            <Progress
              value={(score / quiz.length) * 100}
              className="mb-6 dark:bg-cyan-400"
            />
            <Button
              onClick={() => router.push("/screens/Games")}
              className="bg-[#FF8B8B] hover:bg-[#FF7B7B] text-white mb-4"
            >
              Try Another Quiz
            </Button>
            <Button
              variant="ghost"
              onClick={() => router.push("/screens/Home")}
              className="w-full text-[#FF8B8B] hover:text-[#FF7B7B]"
            >
              <Home className="mr-2 h-5 w-5" />
              Back to Home
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF5F5] p-6 flex flex-col">
      <div className="max-w-2xl mx-auto w-full flex-grow flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-[#FF8B8B] hover:text-[#FF7B7B] mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </Button>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-[#FF8B8B]">
              {subject.charAt(0).toUpperCase() + subject.slice(1)} Quiz
            </h1>
            <span className="text-[#FF8B8B]/70">
              Question {currentQuestion + 1} of {quiz.length}
            </span>
          </div>
          <Progress
            value={(currentQuestion / quiz.length) * 100}
            className="mt-4 dark:bg-cyan-400"
          />
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg flex-grow"
          >
            <div className="space-y-6">
              <h2 className="text-xl text-[#FF8B8B]">
                {quiz[currentQuestion].number}. {quiz[currentQuestion].question}
              </h2>
              <div className="grid grid-cols-1 gap-3">
                {quiz[currentQuestion].choices.map((choice) => (
                  <Button
                    key={choice.choice}
                    variant={
                      answers[quiz[currentQuestion].number]?.choice ===
                      choice.choice
                        ? "default"
                        : "outline"
                    }
                    className={`w-full justify-start text-left p-4 h-auto ${
                      answers[quiz[currentQuestion].number]?.choice ===
                      choice.choice
                        ? "bg-[#FF8B8B] text-white"
                        : "hover:bg-[#FFE5E5]"
                    }`}
                    onClick={() =>
                      handleAnswerSelect(quiz[currentQuestion].number, choice)
                    }
                  >
                    <span className="font-bold mr-3 text-[#FF8B8B]">
                      {choice.choice}.
                    </span>
                    <span className="text-[#FF8B8B]">{choice.content}</span>
                  </Button>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 flex justify-between"
        >
          <Button
            variant="outline"
            onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
            className="text-[#FF8B8B]"
          >
            Previous
          </Button>
          {currentQuestion === quiz.length - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={Object.keys(answers).length < quiz.length}
              className="bg-[#FF8B8B] hover:bg-[#FF7B7B] text-white"
            >
              Submit Quiz
            </Button>
          ) : (
            <Button
              onClick={() =>
                setCurrentQuestion((prev) =>
                  Math.min(quiz.length - 1, prev + 1)
                )
              }
              className="bg-[#FF8B8B] hover:bg-[#FF7B7B] text-white"
            >
              Next
            </Button>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 text-center"
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
