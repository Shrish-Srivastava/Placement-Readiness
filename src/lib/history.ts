/**
 * localStorage persistence for analysis history
 */

import type { CategoryKey } from './skills';

export interface HistoryEntry {
  id: string;
  createdAt: string;
  company: string;
  role: string;
  jdText: string;
  extractedSkills: Record<CategoryKey, string[]>;
  plan: { day: string; title: string; items: string[] }[];
  checklist: { round: string; items: string[] }[];
  questions: string[];
  readinessScore: number;
  fallbackLabel?: string;
}

const STORAGE_KEY = 'placement-readiness-history';

export function saveToHistory(entry: Omit<HistoryEntry, 'id' | 'createdAt'>): HistoryEntry {
  const full: HistoryEntry = {
    ...entry,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  const list = getHistory();
  list.unshift(full);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  return full;
}

export function getHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getEntryById(id: string): HistoryEntry | undefined {
  return getHistory().find((e) => e.id === id);
}
