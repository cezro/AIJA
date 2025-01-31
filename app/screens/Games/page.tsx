"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Subject } from "@/types/games";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function QuizSelector() {
  const router = useRouter();

  const [subject, setSubject] = useState("");
  const [level, setLevel] = useState(0);

  function handleStartQuiz() {
    if (subject === "" || level === 0) {
      return;
    }
    router.push(`/screens/Games/${subject}/${level}`);
  }
  return (
    <div className="flex flex-col items-center justify-center h-full ">
      <div className="flex flex-row border border-black p-4 justify-center items-center">
        <p>Grade Level</p>
        <Input
          type="number"
          className="max-w-20 mx-4"
          min="1"
          max="12"
          value={level}
          onChange={(e) => {
            if (e.target.value !== "") {
              setLevel(parseInt(e.target.value));
            }
          }}
        />
      </div>
      <div className="flex flex-row border border-black p-4 justify-center items-center">
        <Select onValueChange={(value) => setSubject(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={Subject.MATHEMATICS}>Mathematics</SelectItem>
            <SelectItem value={Subject.SCIENCE}>Science</SelectItem>
            <SelectItem value={Subject.ENGLISH}>English</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button className="my-20" onClick={handleStartQuiz}>
        Start Quiz
      </Button>
    </div>
  );
}
