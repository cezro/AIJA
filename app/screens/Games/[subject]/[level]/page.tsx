"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useGames } from "@/hooks/useGames";
import { QuizChoices, QuizQuestion, Subject } from "@/types/games";
import { Button } from "@/components/ui/button";

export default function Quiz() {
  const params = useParams();

  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [answers, setAnswers] = useState<QuizChoices[]>([]);

  const { createQuiz } = useGames();
  const subject = params?.subject as Subject;
  const level = parseInt(params?.level as string);

  useEffect(() => {
    async function generateQuiz() {
      setQuiz(await createQuiz(subject, level));
      setIsLoading(false);
    }
    generateQuiz();
  }, [subject, level]);

  const tallyAnswers = () => {
    let score = 0;
    quiz.forEach((question) => {
      const userAnswer = answers[question.number];
      if (userAnswer.choice === question.answer) {
        score += 1;
      }
    });
    return score;
  };

  const handleAnswerSelect = (questionNumber: number, choice: QuizChoices) => {
    setAnswers((prevAnswers) => {
      return {
        ...prevAnswers,
        [questionNumber]: choice,
      };
    });
    console.log(answers);
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length < quiz.length) {
      alert("Please answer all questions before submitting.");
      return;
    }
    console.log("Submitted answers:", answers);
    console.log(tallyAnswers());
  };

  if (isLoading) {
    return (
      <p className="justify-center items-center text-bold text-3xl">
        Loading...
      </p>
    );
  }

  return (
    <div>
      {quiz.map((question) => {
        return (
          <div key={question.number}>
            <div className="flex flex-row justify-center items-center border rounded-lg min-w-16">
              {question.number}. <p className="text-xl">{question.question}</p>
            </div>
            <div className="flex flex-row justify-center items-center">
              {question.choices.map((choice) => {
                return (
                  <Button
                    key={choice.choice}
                    value={choice.choice}
                    className="mx-1"
                    onClick={() => handleAnswerSelect(question.number, choice)}
                    disabled={answers[question.number] === choice}
                  >
                    {choice.choice}. {choice.content}
                  </Button>
                );
              })}
            </div>
          </div>
        );
      })}
      <Button onClick={handleSubmit} className="mt-4">
        Submit Answers
      </Button>
    </div>
  );
}
