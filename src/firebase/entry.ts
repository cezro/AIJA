import { collection, getDoc, addDoc, Timestamp } from "firebase/firestore";
import { firestore as db } from "./firebase";
import { EntrySummary } from "@/types/journal";

export async function uploadEntrySummary(
  userId: string,
  summary: string
): Promise<EntrySummary> {
  try {
    const entrySummaryRef = collection(db, "entry_summaries");
    const now = Timestamp.now();

    const docRef = await addDoc(entrySummaryRef, {
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
    console.error("Error uploading entry summary:", error);
    throw new Error("Failed to upload entry summary");
  }
}
