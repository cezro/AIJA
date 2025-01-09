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

  return openai;
}
