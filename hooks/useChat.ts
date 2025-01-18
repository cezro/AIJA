import { Message } from "@/types/chat";
import OpenAI from "openai";
import { useState, useEffect } from "react";

let openaiInstance: OpenAI;

async function getOpenAIInstance() {
  if (!openaiInstance) {
    const { default: OpenAI } = await import("openai");
    openaiInstance = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });
  }
  return openaiInstance;
}

export function useChat() {
  const [openai, setOpenai] = useState<OpenAI>();

  useEffect(() => {
    async function initializeOpenAI() {
      const instance = await getOpenAIInstance();
      setOpenai(instance);
    }
    initializeOpenAI();
  }, []);

  const summarizeConversation = async (chatLog: Message[]): Promise<string> => {
    const fullText = chatLog.map((msg) => msg.content).join("\n");
    const openai = await getOpenAIInstance();
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",

          content: `You are a helpful mental health assistant who gives specific and helpful suggestions and also writes in paragraph form. Please summarize the following text:\n
          ${fullText}\n`,
        },
      ],

      temperature: 0.5,

      max_tokens: 1024,
      n: 1,
    });

    console.log(response.choices[0]?.message?.content?.trim() ?? "");
    return response.choices[0]?.message?.content?.trim() ?? "";
  };

  return { openai, summarizeConversation };
}
