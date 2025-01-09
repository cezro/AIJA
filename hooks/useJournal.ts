import { useState, useCallback } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import * as journalApi from "../src/firebase/journal";
import type { CreateJournalEntry } from "@/types/journal";

export function useJournal() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getUserEntries = useCallback(async () => {
    if (!user?.sub) return [];

    setLoading(true);
    setError(null);

    try {
      const entries = await journalApi.getUserJournalEntries(user.sub);
      return entries;
    } catch (err: any) {
      const errorMessage = err?.message || "Failed to fetch journal entries";
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, [user?.sub]);

  const getEntry = async (entryId: string) => {
    if (!user?.sub) return null;

    setLoading(true);
    setError(null);

    try {
      const entry = await journalApi.getJournalEntry(user.sub, entryId);
      return entry;
    } catch (err) {
      setError("Failed to fetch journal entry");
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getEntryByDate = async (date: string) => {
    if (!user?.sub) return null;

    setLoading(true);
    setError(null);

    try {
      const entry = await journalApi.getJournalEntryByDate(user.sub, date);
      return entry;
    } catch (err) {
      setError("Failed to fetch journal entry");
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createEntry = async (entry: CreateJournalEntry) => {
    if (!user?.sub) throw new Error("User not authenticated");

    setLoading(true);
    setError(null);

    try {
      const newEntry = await journalApi.createJournalEntry(user.sub, entry);
      return newEntry;
    } catch (err) {
      setError("Failed to create journal entry");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateEntry = async (
    entryId: string,
    updates: Partial<CreateJournalEntry>
  ) => {
    if (!user?.sub) throw new Error("User not authenticated");

    setLoading(true);
    setError(null);

    try {
      const updatedEntry = await journalApi.updateJournalEntry(
        user.sub,
        entryId,
        updates
      );
      return updatedEntry;
    } catch (err) {
      setError("Failed to update journal entry");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteEntry = async (entryId: string) => {
    if (!user?.sub) throw new Error("User not authenticated");

    setLoading(true);
    setError(null);

    try {
      await journalApi.deleteJournalEntry(user.sub, entryId);
    } catch (err) {
      setError("Failed to delete journal entry");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    getUserEntries,
    getEntry,
    getEntryByDate,
    createEntry,
    updateEntry,
    deleteEntry,
    loading,
    error,
  };
}
