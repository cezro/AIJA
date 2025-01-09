import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { firestore as db } from "./firebase";
import type { CreateJournalEntry, JournalEntry } from "@/types/journal";

// Get all journal entries for a user
export async function getUserJournalEntries(
  userId: string
): Promise<JournalEntry[]> {
  try {
    const journalRef = collection(db, "journals");
    const q = query(
      journalRef,
      where("userId", "==", userId),
      orderBy("date", "desc")
    );

    const querySnapshot = await getDocs(q);
    const entries: JournalEntry[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      entries.push({
        id: doc.id,
        date: data.date,
        content: data.content,
        mood: data.mood,
        symptoms: data.symptoms || "",
        createdAt: data.createdAt.toDate().toISOString(),
        updatedAt: data.updatedAt.toDate().toISOString(),
      });
    });

    return entries;
  } catch (error) {
    console.error("Error getting journal entries:", error);
    throw new Error("Failed to fetch journal entries");
  }
}

// Get a specific journal entry
export async function getJournalEntry(
  userId: string,
  entryId: string
): Promise<JournalEntry | null> {
  try {
    const entryRef = doc(db, "journals", entryId);
    const entrySnap = await getDoc(entryRef);

    if (!entrySnap.exists()) {
      return null;
    }

    const data = entrySnap.data();

    // Verify the entry belongs to the user
    if (data.userId !== userId) {
      throw new Error("Unauthorized access to journal entry");
    }

    return {
      id: entrySnap.id,
      date: data.date,
      content: data.content,
      mood: data.mood,
      symptoms: data.symptoms || "",
      createdAt: data.createdAt.toDate().toISOString(),
      updatedAt: data.updatedAt.toDate().toISOString(),
    };
  } catch (error) {
    console.error("Error getting journal entry:", error);
    throw new Error("Failed to fetch journal entry");
  }
}

// Create a new journal entry
export async function createJournalEntry(
  userId: string,
  entry: CreateJournalEntry
): Promise<JournalEntry> {
  try {
    const journalRef = collection(db, "journals");
    const now = Timestamp.now();

    const docRef = await addDoc(journalRef, {
      ...entry,
      userId,
      createdAt: now,
      updatedAt: now,
    });

    const newEntry = await getDoc(docRef);
    const data = newEntry.data()!;

    return {
      id: newEntry.id,
      date: data.date,
      content: data.content,
      mood: data.mood,
      symptoms: data.symptoms || "",
      createdAt: data.createdAt.toDate().toISOString(),
      updatedAt: data.updatedAt.toDate().toISOString(),
    };
  } catch (error) {
    console.error("Error creating journal entry:", error);
    throw new Error("Failed to create journal entry");
  }
}

// Update a journal entry
export async function updateJournalEntry(
  userId: string,
  entryId: string,
  updates: Partial<CreateJournalEntry>
): Promise<JournalEntry> {
  try {
    const entryRef = doc(db, "journals", entryId);
    const entrySnap = await getDoc(entryRef);

    if (!entrySnap.exists()) {
      throw new Error("Journal entry not found");
    }

    // Verify the entry belongs to the user
    const data = entrySnap.data();
    if (data.userId !== userId) {
      throw new Error("Unauthorized access to journal entry");
    }

    await updateDoc(entryRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });

    const updatedEntry = await getDoc(entryRef);
    const updatedData = updatedEntry.data()!;

    return {
      id: updatedEntry.id,
      date: updatedData.date,
      content: updatedData.content,
      mood: updatedData.mood,
      symptoms: updatedData.symptoms || "",
      createdAt: updatedData.createdAt.toDate().toISOString(),
      updatedAt: updatedData.updatedAt.toDate().toISOString(),
    };
  } catch (error) {
    console.error("Error updating journal entry:", error);
    throw new Error("Failed to update journal entry");
  }
}

// Delete a journal entry
export async function deleteJournalEntry(
  userId: string,
  entryId: string
): Promise<void> {
  try {
    const entryRef = doc(db, "journals", entryId);
    const entrySnap = await getDoc(entryRef);

    if (!entrySnap.exists()) {
      throw new Error("Journal entry not found");
    }

    // Verify the entry belongs to the user
    const data = entrySnap.data();
    if (data.userId !== userId) {
      throw new Error("Unauthorized access to journal entry");
    }

    await deleteDoc(entryRef);
  } catch (error) {
    console.error("Error deleting journal entry:", error);
    throw new Error("Failed to delete journal entry");
  }
}

// Get journal entry by date
export async function getJournalEntryByDate(
  userId: string,
  date: string
): Promise<JournalEntry | null> {
  try {
    const journalRef = collection(db, "journals");
    const q = query(
      journalRef,
      where("userId", "==", userId),
      where("date", "==", date)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const doc = querySnapshot.docs[0];
    const data = doc.data();

    return {
      id: doc.id,
      date: data.date,
      content: data.content,
      mood: data.mood,
      symptoms: data.symptoms || "",
      createdAt: data.createdAt.toDate().toISOString(),
      updatedAt: data.updatedAt.toDate().toISOString(),
    };
  } catch (error) {
    console.error("Error getting journal entry by date:", error);
    throw new Error("Failed to fetch journal entry");
  }
}
