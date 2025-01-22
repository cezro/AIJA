import { getOpenAIInstance } from "@/src/openai/openai";
import { JournalEntry } from "@/types/journal";
import OpenAI from "openai";
import { useState, useEffect } from "react";

export function useEntry() {
  const [openai, setOpenai] = useState<OpenAI>();

  useEffect(() => {
    async function initializeOpenAI() {
      const instance = await getOpenAIInstance();
      setOpenai(instance);
    }
    initializeOpenAI();
  }, []);

  const summarizeEntry = async (entry: JournalEntry): Promise<string> => {
    if (!entry) {
      return "";
    }
    const openai = await getOpenAIInstance();
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",

          content: `You are a helpful mental health assistant who gives specific and helpful suggestions and also writes in paragraph form. Please summarize the following text:\n
          
          Mood: ${entry.mood}\n
          Description: ${entry.content}\n
          Symptoms${entry.symptoms}\n`,
        },
      ],

      temperature: 0.5,

      max_tokens: 1024,
      n: 1,
    });

    console.log(response.choices[0]?.message?.content?.trim() ?? "");
    return response.choices[0]?.message?.content?.trim() ?? "";
  };

  return { openai, summarizeEntry };
}
