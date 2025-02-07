import { motion } from "framer-motion";
import { X, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { QuizQuestion, QuizChoices } from "@/types/games";

interface QuizCheckProps {
  quiz: QuizQuestion[];
  answers: Record<number, QuizChoices>;
  onClose: () => void;
}

export function QuizCheck({ quiz, answers, onClose }: QuizCheckProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-3xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#FF8B8B]">Quiz Check</h2>
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-[#FF8B8B] hover:bg-[#FFE5E5] rounded-full"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        {quiz.map((question) => (
          <motion.div
            key={question.number}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: question.number * 0.1 }}
            className="mb-6 pb-6 border-b border-[#FFE5E5] last:border-b-0"
          >
            <h3 className="text-lg font-semibold text-[#FF8B8B] mb-3">
              {question.number}. {question.question}
            </h3>
            <div className="space-y-2">
              {question.choices.map((choice) => {
                const isSelected =
                  answers[question.number]?.choice === choice.choice;
                const isCorrect = choice.choice === question.answer;
                return (
                  <div
                    key={choice.choice}
                    className={`p-3 rounded-xl flex items-center ${
                      isSelected
                        ? isCorrect
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                        : isCorrect
                          ? "bg-green-50 text-green-800"
                          : "bg-gray-50 text-gray-800"
                    }`}
                  >
                    {isSelected &&
                      (isCorrect ? (
                        <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 mr-2 text-red-500" />
                      ))}
                    <span className="font-semibold mr-2">{choice.choice}.</span>
                    {choice.content}
                  </div>
                );
              })}
            </div>
            {answers[question.number]?.choice !== question.answer && (
              <p className="mt-3 text-[#FF8B8B] font-medium">
                Correct answer:{" "}
                <span className="font-semibold">{question.answer}</span>
              </p>
            )}
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
