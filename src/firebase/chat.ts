import { collection, getDoc, addDoc, Timestamp } from "firebase/firestore";
import { firestore as db } from "./firebase";
import { ChatSummary } from "@/types/chat";

export async function uploadChatSummary(
  userId: string,
  summary: string
): Promise<ChatSummary> {
  try {
    const chatSummaryRef = collection(db, "chat_summaries");
    const now = Timestamp.now();

    const docRef = await addDoc(chatSummaryRef, {
      summary,
      userId,
      createdAt: now,
      updatedAt: now,
    });

    const newEntry = await getDoc(docRef);
    const data = newEntry.data()!;

    return {
      id: newEntry.id,
      userId: data.userId,
      summary: data.summary,
      createdAt: data.createdAt.toDate().toISOString(),
      updatedAt: data.updatedAt.toDate().toISOString(),
    };
  } catch (error) {
    console.error("Error uploading chat summary:", error);
    throw new Error("Failed to upload chat summary");
  }
}
