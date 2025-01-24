export interface JournalEntry {
  id: string;
  date: string;
  content: string;
  mood: string;
  symptoms?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateJournalEntry {
  date: string;
  content: string;
  mood: string;
  symptoms?: string;
}

export type Mood = {
  name: string;
  color: string;
  expression: string;
};

export type EntrySummary = {
  id: string;
  userId: string;
  summary: string;
  createdAt: string;
  updatedAt: string;
};
