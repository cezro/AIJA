"use client";

import React, { useState, useEffect, useRef, SyntheticEvent } from "react";
import * as chatApi from "@/src/firebase/chat";
import { Message, Role } from "@/types/chat";
import { useChat } from "@/hooks/useChat";
import { motion } from "framer-motion";
import { Send, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";

export default function Chat() {
  const { openai, summarizeConversation } = useChat();
  const { user } = useUser();
  const [chatLog, setChatLog] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEndingSession, setIsEndingSession] = useState(false);
  const router = useRouter();

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "60px";
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }, [inputMessage]);

  useEffect(() => {
    setChatLog([
      {
        role: Role.SYSTEM,
        content: `Your name is AIJA, a delightful, fun-loving, and colorful penguin AI psychiatrist. You specialize in creating a supportive and playful environment for mental well-being. 🐧 Your responses are filled with warmth, joy, and encouragement, blending professional insight with lighthearted charm. You sprinkle emojis generously but tastefully, and your use of Markdown keeps the conversation clear and inviting!`,
      },
    ]);
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatLog]);

  const handleSendMessage = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!inputMessage.trim()) return;

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
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  async function endSession(e: SyntheticEvent) {
    e.preventDefault();
    setIsEndingSession(true);

    if (!user) {
      console.error("User not authenticated");
      setIsEndingSession(false);
      return;
    }

    try {
      const summary = await summarizeConversation(chatLog);
      const userId = user?.sub;
      const uploadData = await chatApi.uploadChatSummary(
        userId as string,
        summary
      );

      if (uploadData) {
        console.log("Chat summary uploaded successfully:", uploadData);
        router.push("/screens/AIChatEnd");
      }
    } catch (error) {
      console.error("Error:", (error as Error).message);
    } finally {
      setIsEndingSession(false);
    }
  }

  const TypingAnimation = () => (
    <div className="flex space-x-2 p-3 bg-white/80 rounded-2xl shadow-sm max-w-[80px]">
      <motion.div
        className="w-3 h-3 bg-[#FF8B8B] rounded-full"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
      />
      <motion.div
        className="w-3 h-3 bg-[#FF8B8B] rounded-full"
        animate={{ y: [0, -10, 0] }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 0.1,
        }}
      />
      <motion.div
        className="w-3 h-3 bg-[#FF8B8B] rounded-full"
        animate={{ y: [0, -10, 0] }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 0.2,
        }}
      />
    </div>
  );

  return (
    <div className="flex flex-col w-full h-screen bg-[#FFF5F5]">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 p-4 shadow-sm"
      >
        <Button
          onClick={() => router.back()}
          variant="ghost"
          className="text-[#FF8B8B]"
        >
          <ArrowLeft className="w-6 h-6 mr-2" />
          Back
        </Button>
      </motion.header>
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 overflow-hidden"
      >
        <div
          ref={chatContainerRef}
          className="h-full overflow-y-auto px-4 py-6 space-y-4"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 text-[#FF8B8B] font-medium text-left max-w-[80%] rounded-2xl p-4 shadow-sm"
          >
            Hello there! I&apos;m AIJA, your delightful AI psychiatrist. 🐧 How
            can I brighten your day?
          </motion.div>
          {chatLog
            .filter((message) => message.role !== "system")
            .map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`${
                    message.role === "user"
                      ? "bg-[#FF8B8B] text-white"
                      : "bg-white/80 text-[#FF8B8B]"
                  } font-medium max-w-[80%] rounded-2xl p-4 shadow-sm`}
                >
                  {message.content}
                </div>
              </motion.div>
            ))}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <TypingAnimation />
            </motion.div>
          )}
        </div>
      </motion.main>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-4 bg-white/80 shadow-sm backdrop-blur-sm"
      >
        <form
          onSubmit={handleSendMessage}
          className="flex items-center space-x-2"
        >
          <textarea
            ref={textAreaRef}
            className="flex-1 resize-none bg-white text-[#FF8B8B] border border-[#FF8B8B] rounded-2xl p-3 focus:outline-none focus:ring-2 focus:ring-[#FF8B8B]"
            placeholder="Feel free to chat!"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e as unknown as React.FormEvent);
              }
            }}
          />
          <Button
            onClick={endSession}
            className={`rounded-2xl px-4 py-2 font-medium text-white bg-gradient-to-r from-[#FF8B8B] to-[#FFB5B5] hover:from-[#FF7B7B] hover:to-[#FFA5A5] transition-all ${
              isEndingSession || isLoading || chatLog.length <= 1
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            disabled={isEndingSession || isLoading || chatLog.length <= 1}
          >
            End Session
          </Button>
          <Button
            type="submit"
            className="bg-[#FF8B8B] hover:bg-[#FF7B7B] text-white rounded-full p-3"
            disabled={isLoading}
          >
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
