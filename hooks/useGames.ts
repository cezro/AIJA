import { getOpenAIInstance } from "@/src/openai/openai";
import { QuizQuestion, Subject } from "@/types/games";
import OpenAI from "openai";
import { useState, useEffect } from "react";

export function useGames() {
  const [openai, setOpenai] = useState<OpenAI>();

  useEffect(() => {
    async function initializeOpenAI() {
      const instance = await getOpenAIInstance();
      setOpenai(instance);
    }
    initializeOpenAI();
  }, []);

  async function createQuiz(
    subject: Subject,
    level: number
  ): Promise<QuizQuestion[]> {
    if (!subject || !level) {
      return [];
    }
    const openai = await getOpenAIInstance();
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `Create a 10 item ${subject} quiz for grade ${level}, with 4 multiple choice questions. 

        Export the questions in a way that they are in the form of JSON objects with the specified format.
        
        [
  {
    "number": 1,
    "question": "What is 1+1?",
    "choices": [
      {"choice": "A", "content": "1"},
      {"choice": "B", "content": "2"},
      {"choice": "C", "content": "3"},
      {"choice": "D", "content": "4"}
    ],
    "answer": "B"
  },
  {
    "number": 2,
    "question": "What is the capital of France?",
    "choices": [
      {"choice": "A", "content": "Berlin"},
      {"choice": "B", "content": "Madrid"},
      {"choice": "C", "content": "Paris"},
      {"choice": "D", "content": "Rome"}
    ],
    "answer": "C"
  },
  {
    "number": 3,
    "question": "Which planet is known as the Red Planet?",
    "choices": [
      {"choice": "A", "content": "Earth"},
      {"choice": "B", "content": "Mars"},
      {"choice": "C", "content": "Jupiter"},
      {"choice": "D", "content": "Venus"}
    ],
    "answer": "B"
  },
  {
    "number": 4,
    "question": "Who wrote 'Romeo and Juliet'?",
    "choices": [
      {"choice": "A", "content": "William Shakespeare"},
      {"choice": "B", "content": "Charles Dickens"},
      {"choice": "C", "content": "Jane Austen"},
      {"choice": "D", "content": "Mark Twain"}
    ],
    "answer": "A"
  },
  {
    "number": 5,
    "question": "What is the largest ocean on Earth?",
    "choices": [
      {"choice": "A", "content": "Atlantic Ocean"},
      {"choice": "B", "content": "Indian Ocean"},
      {"choice": "C", "content": "Arctic Ocean"},
      {"choice": "D", "content": "Pacific Ocean"}
    ],
    "answer": "D"
  }
]
        `,
        },
      ],
      temperature: 0.25,
      max_tokens: 2048,
      n: 1,
    });
    console.log(response.choices[0]?.message?.content);
    let quizQuestions: QuizQuestion[] = [];
    try {
      quizQuestions = JSON.parse(
        response.choices[0]?.message?.content?.trim() ?? "[]"
      );
    } catch (error) {
      console.error("Failed to parse quiz questions JSON:", error);
    }
    return quizQuestions;
  }

  return { openai, createQuiz };
}
