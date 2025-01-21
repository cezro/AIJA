import OpenAI from "openai";

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

export { openaiInstance, getOpenAIInstance };
