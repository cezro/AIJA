"use client";

import { useState, useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, MessageSquare, User, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const { user, error, isLoading } = useUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isLoading) {
    return null;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 p-4"
      >
        <Link href="/screens/ProfilePage" className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user?.picture || ""} alt={user?.name || "User"} />
            <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold text-purple-400">{user?.name}</h1>
          </div>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <Card className="border-2 border-purple-100">
          <CardContent className="p-6">
            <Button className="w-full text-lg bg-pink-500" size="lg">
              <MessageSquare className="mr-2 h-5 w-5" />
              Chat with AIJA
            </Button>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-100">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-2 text-purple-900">
              Today&apos;s Date
            </h2>
            <p className="text-purple-600">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-5 w-5 text-purple-600" />
              <h2 className="text-xl font-semibold text-purple-900">
                Calendar View
              </h2>
            </div>
            <div className="h-48 flex items-center justify-center text-purple-400 bg-purple-50 rounded-lg">
              Calendar Content Coming Soon
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="fixed bottom-0 left-0 right-0 p-4 flex justify-between items-center bg-white/80 backdrop-blur-sm border-t border-purple-100"
      >
        <Button variant="ghost" className="text-purple-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          </svg>
        </Button>
        <Button
          size="lg"
          className="rounded-full bg-purple-600 hover:bg-purple-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        </Button>
        <Button variant="ghost" className="text-purple-600" asChild>
          <Link href="/screens/ProfilePage">
            <User className="h-6 w-6" />
          </Link>
        </Button>
        <Button variant="ghost" className="text-purple-600" asChild>
          <a href="/api/auth/logout">
            <LogOut className="h-6 w-6" />
          </a>
        </Button>
      </motion.div>
    </div>
  );
}
