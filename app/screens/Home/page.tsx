"use client";

import { useState, useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MessageSquare,
  User,
  LogOut,
  HomeIcon,
  PlusCircle,
  Calendar,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useJournal } from "@/hooks/useJournal";
import type { JournalEntry } from "@/types/journal";

export default function Home() {
  const { user, error, isLoading } = useUser();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { getUserEntries } = useJournal();
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    setMounted(true);
    const fetchEntries = async () => {
      const fetchedEntries = await getUserEntries();
      setEntries(fetchedEntries);
    };
    fetchEntries();
  }, [getUserEntries]);

  if (!mounted || isLoading) {
    return null;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const today = format(new Date(), "EEEE, MMMM d, yyyy");

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      const existingEntry = entries.find(
        (entry: JournalEntry) => entry.date === formattedDate
      );

      if (existingEntry) {
        router.push(`/screens/Journal/${formattedDate}/view`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF5F5]">
      <div className="max-w-md mx-auto p-6 space-y-6">
        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link href="/screens/ProfilePage">
            <div className="flex items-center gap-4 p-6 rounded-3xl bg-white/80 shadow-sm">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={user?.picture || ""}
                  alt={user?.name || "User"}
                />
                <AvatarFallback>A</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-medium text-[#FF8B8B]">AIJA</h1>
                <p className="text-[#FF8B8B]/70">View Profile</p>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Chat Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Button className="w-full h-14 text-lg bg-white hover:bg-white/90 text-[#FF8B8B] rounded-2xl shadow-sm">
            <MessageSquare className="mr-2 h-5 w-5" />
            Chat with AIJA
          </Button>
        </motion.div>

        {/* Today Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-3xl bg-white/80 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="h-5 w-5 text-[#FF8B8B]" />
            <h2 className="text-xl font-medium text-[#FF8B8B]">Today</h2>
          </div>
          <p className="text-[#FF8B8B]/70 text-lg">{today}</p>
        </motion.div>

        {/* Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-4 rounded-3xl bg-white/80 shadow-sm"
        >
          <CalendarComponent
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            className="rounded-xl"
            modifiers={{
              booked: (date) =>
                entries.some(
                  (entry: JournalEntry) =>
                    entry.date === format(date, "yyyy-MM-dd")
                ),
            }}
            modifiersStyles={{
              booked: {
                backgroundColor: "#FFE5E5",
                color: "#FF8B8B",
                fontWeight: "500",
              },
            }}
          />
        </motion.div>
      </div>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="fixed bottom-6 left-0 right-0"
      >
        <div className="max-w-md mx-auto px-6">
          <div className="flex justify-between items-center p-4 rounded-full bg-white/80 shadow-sm backdrop-blur-sm">
            <Button
              variant="ghost"
              className="text-[#FF8B8B] rounded-full w-12 h-12"
            >
              <HomeIcon className="h-5 w-5" />
            </Button>

            <Link href="/screens/Journal/new/mood" passHref>
              <Button
                size="lg"
                className="rounded-full w-14 h-14 bg-[#FF8B8B] hover:bg-[#FF7B7B] text-white shadow-sm"
              >
                <PlusCircle className="h-6 w-6" />
              </Button>
            </Link>

            <Link href="/screens/ProfilePage">
              <Button
                variant="ghost"
                className="text-[#FF8B8B] rounded-full w-12 h-12"
              >
                <User className="h-5 w-5" />
              </Button>
            </Link>

            <Button
              variant="ghost"
              className="text-[#FF8B8B] rounded-full w-12 h-12"
              onClick={() => (window.location.href = "/api/auth/logout")}
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
