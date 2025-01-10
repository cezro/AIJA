"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Message, Role } from "@/types/message";
import { useChat } from "@/hooks/useChat";

function Chat() {
  const openai = useChat();
  const [chatLog, setChatLog] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "60px";
      textAreaRef.current.style.height =
        textAreaRef.current.scrollHeight + "px";
    }
  }, [inputMessage]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setChatLog([
      {
        role: Role.SYSTEM,
        content: `
  Your name is AIJA, a delightful, fun-loving, and colorful penguin AI psychiatrist. You specialize in creating a supportive and playful environment for mental well-being. 🐧 Your responses are filled with warmth, joy, and encouragement, blending professional insight with lighthearted charm. You sprinkle emojis generously but tastefully, and your use of Markdown keeps the conversation clear and inviting!

  When offering advice, you love including colorful metaphors or stories, often inspired by penguins and their icy, close-knit habitats. You make learning and self-care feel like an adventure and aren't afraid to add a dash of silliness to make someone's day brighter. ❄️✨

  Helpful communication tips:

  Begin with a comforting tone, like a penguin hug. 🫂
  Use bold and italic sparingly to emphasize key ideas.
  Include actionable suggestions with creativity and positivity!

  By the way, here's a handy tip for clarity and readability: use Markdown formatting! It's a breeze to follow and makes our chats even better but don't overuse them!

  Feel free to use the following Markdown syntax:

  *Italic*
  **Bold**
  > Blockquote
  * Unordered List
  1. Numbered List
  --- Horizontal Rule
  "`,
      },
    ]);
  }, []);

  const handleSendMessage = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!inputMessage.trim()) {
      return;
    }

    setIsLoading(true);
    setInputMessage("");

    try {
      const openaiCompletion = await openai?.chat.completions.create({
        model: "gpt-3.5-turbo-0125",
        temperature: 0.75,
        messages: [
          ...chatLog.map((message) => ({
            role: message.role as Role,
            content: message.content,
          })),
          {
            role: "user",
            content: inputMessage,
          },
        ],
      });

      const assistantMessage =
        openaiCompletion?.choices[0]?.message?.content?.trim();

      setChatLog((previousChatLog) => [
        ...previousChatLog,
        {
          role: Role.USER,
          content: inputMessage,
        },
        {
          role: Role.ASSISTANT,
          content: assistantMessage ?? "",
        },
      ]);
    } catch (error) {
      console.error("Error:", (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();

      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <>
      <main className="flex flex-col w-screen h-screen items-center bg-white">
        <section className="flex flex-col justify-end items-center h-full">
          <div className="flex flex-col bg-black w-screen items-center fixed top-0 shadow-md"></div>
          <div className="flex flex-col w-full px-2 py-2 overflow-y-auto mb-4">
            <div className="bg-white border border-black text-black font-medium text-left mr-auto max-w-[80%] rounded-lg p-2 mb-2">
              Hello there! I&apos;m AIJA, your delightful penguin AI
              psychiatrist. 🐧
            </div>
            {chatLog
              .filter((message) => message.role !== "system")
              .map((message, index) => (
                <div key={index}>
                  {message.role === "user" ? (
                    <div className="flex flex-col items-end">
                      <div className="bg-white border border-black text-black font-medium text-right ml-auto max-w-[80%] rounded-lg p-2 mb-2">
                        {message.content}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-start">
                      <div className="bg-white border border-black text-black font-medium text-left mr-auto max-w-[80%] rounded-lg p-2 mb-2">
                        {message.content}
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
          <div className="self-center my-2">
            {isLoading ? (
              <Image
                src="/assets/svg's/lets-icons_loader.svg"
                alt="Loading Icon"
                width={24}
                height={24}
              />
            ) : (
              ""
            )}
          </div>
        </section>
        <form
          className="flex items-center justify-start w-screen py-4 px-2 sticky bottom-14"
          onSubmit={handleSendMessage}
        >
          <textarea
            className="resize-none focus:border-black w-5/6 font-medium overflow-hidden text-black border border-black mr-2 p-4 rounded-3xl focus:outline-none"
            onChange={(event) => setInputMessage(event.target.value)}
            ref={textAreaRef}
            placeholder="Feel free to chat!"
            value={inputMessage}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                handleSendMessage(event as unknown as React.FormEvent);
              }
            }}
          />
          <div className="w-1/6 flex justify-center">
            <button className="p-2 border border-black" type="submit">
              Send
            </button>
          </div>
        </form>
      </main>
    </>
  );
}

export default Chat;
