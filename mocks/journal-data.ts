import { JournalEntry } from "../types/journal";

export const mockJournalEntries: JournalEntry[] = [
  {
    id: "1",
    date: "2024-01-05",
    content:
      "Today was a productive day. I managed to complete all my tasks and felt very accomplished.",
    mood: "happy",
    createdAt: "2024-01-05T20:00:00Z",
    updatedAt: "2024-01-05T20:00:00Z",
  },
  {
    id: "2",
    date: "2024-01-06",
    content:
      "Regular day, nothing special happened. Just went through my routine.",
    mood: "neutral",
    createdAt: "2024-01-06T21:00:00Z",
    updatedAt: "2024-01-06T21:00:00Z",
  },
];
