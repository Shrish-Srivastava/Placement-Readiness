/**
 * localStorage persistence for analysis history
 */

import type { CategoryKey } from './skills';
import type { CompanyIntel } from './companyIntel';
import type { RoundMappingItem } from './roundMapping';

export type SkillConfidence = 'know' | 'practice';

export interface HistoryEntry {
  id: string;
  createdAt: string;
  company: string;
  role: string;
  jdText: string;
  extractedSkills: Record<CategoryKey, string[]>;
  skillConfidenceMap?: Record<string, SkillConfidence>;
  plan: { day: string; title: string; items: string[] }[];
  checklist: { round: string; items: string[] }[];
  questions: string[];
  readinessScore: number;
  fallbackLabel?: string;
  companyIntel?: CompanyIntel;
  roundMapping?: RoundMappingItem[];
}

const STORAGE_KEY = 'placement-readiness-history';

export function saveToHistory(entry: Omit<HistoryEntry, 'id' | 'createdAt'>): HistoryEntry {
  const skillConfidenceMap: Record<string, SkillConfidence> = entry.skillConfidenceMap ?? {};
  for (const skills of Object.values(entry.extractedSkills)) {
    for (const s of skills) {
      if (!(s in skillConfidenceMap)) skillConfidenceMap[s] = 'practice';
    }
  }
  const full: HistoryEntry = {
    ...entry,
    skillConfidenceMap,
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

export function updateEntry(id: string, updates: Partial<Pick<HistoryEntry, 'skillConfidenceMap'>>): void {
  const list = getHistory();
  const idx = list.findIndex((e) => e.id === id);
  if (idx === -1) return;
  list[idx] = { ...list[idx], ...updates };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function getLiveScore(entry: HistoryEntry): number {
  const base = entry.readinessScore;
  const map = entry.skillConfidenceMap ?? {};
  let delta = 0;
  for (const skills of Object.values(entry.extractedSkills)) {
    for (const s of skills) {
      const conf = map[s] ?? 'practice';
      delta += conf === 'know' ? 2 : -2;
    }
  }
  return Math.max(0, Math.min(100, base + delta));
}
