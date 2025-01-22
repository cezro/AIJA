"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function AIChatEnd() {
  const router = useRouter();
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      router.push("/screens/Home");
    }, 2500); // 2500 miliseconds return to home

    return () => clearTimeout(timeoutId);
  }, []);

  return <div>chat end splash here</div>;
}
