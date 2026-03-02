/**
 * localStorage persistence for analysis history
 * Standardized schema with validation and edge-case handling
 */

import type { CategoryKey } from './skills';
import type { CompanyIntel } from './companyIntel';
import type { RoundMappingItem } from './roundMapping';

export type SkillConfidence = 'know' | 'practice';

/** Canonical skill keys — ensure all exist in extractedSkills */
const ALL_SKILL_KEYS: CategoryKey[] = [
  'coreCS', 'languages', 'web', 'data', 'cloudDevOps', 'testing', 'other',
];

function normalizeExtractedSkills(raw: unknown): Record<CategoryKey, string[]> {
  const result: Record<string, string[]> = {};
  for (const key of ALL_SKILL_KEYS) {
    const arr = raw && typeof raw === 'object' && key in raw && Array.isArray((raw as Record<string, unknown>)[key])
      ? ((raw as Record<string, string[]>)[key].filter((x): x is string => typeof x === 'string'))
      : [];
    result[key] = arr;
  }
  return result as Record<CategoryKey, string[]>;
}

function normalizePlan(raw: unknown): { day: string; title: string; items: string[] }[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((p): p is Record<string, unknown> => p && typeof p === 'object')
    .map((p) => ({
      day: typeof p.day === 'string' ? p.day : '',
      title: typeof p.title === 'string' ? p.title : (typeof p.focus === 'string' ? p.focus : ''),
      items: Array.isArray(p.items) ? p.items.filter((x): x is string => typeof x === 'string') :
        (Array.isArray(p.tasks) ? p.tasks.filter((x): x is string => typeof x === 'string') : []),
    }))
    .filter((p) => p.day);
}

function normalizeChecklist(raw: unknown): { round: string; items: string[] }[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((r): r is Record<string, unknown> => r && typeof r === 'object')
    .map((r) => ({
      round: typeof r.round === 'string' ? r.round : (typeof r.roundTitle === 'string' ? r.roundTitle : ''),
      items: Array.isArray(r.items) ? r.items.filter((x): x is string => typeof x === 'string') : [],
    }))
    .filter((r) => r.round);
}

function normalizeRoundMapping(raw: unknown): RoundMappingItem[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((r): r is Record<string, unknown> => r && typeof r === 'object')
    .map((r) => ({
      round: typeof r.round === 'string' ? r.round : (typeof r.roundTitle === 'string' ? r.roundTitle : ''),
      whyMatters: typeof r.whyMatters === 'string' ? r.whyMatters : '',
      items: Array.isArray(r.focusAreas) ? r.focusAreas.filter((x): x is string => typeof x === 'string') :
        (Array.isArray(r.items) ? r.items.filter((x): x is string => typeof x === 'string') : undefined),
    }))
    .filter((r) => r.round && r.whyMatters);
}

function normalizeQuestions(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((x): x is string => typeof x === 'string');
}

function isValidEntry(raw: unknown): raw is Record<string, unknown> {
  if (!raw || typeof raw !== 'object') return false;
  const o = raw as Record<string, unknown>;
  return typeof o.id === 'string' && o.id.length > 0 &&
    typeof o.jdText === 'string' &&
    Array.isArray(o.questions);
}

export interface HistoryEntry {
  id: string;
  createdAt: string;
  company: string;
  role: string;
  jdText: string;
  extractedSkills: Record<CategoryKey, string[]>;
  skillConfidenceMap: Record<string, SkillConfidence>;
  plan: { day: string; title: string; items: string[] }[];
  checklist: { round: string; items: string[] }[];
  questions: string[];
  baseScore: number;
  finalScore: number;
  updatedAt: string;
  fallbackLabel?: string;
  companyIntel?: CompanyIntel;
  roundMapping?: RoundMappingItem[];
}

const STORAGE_KEY = 'placement-readiness-history';
let corruptedCount = 0;

export function getCorruptedCount(): number {
  return corruptedCount;
}

export function resetCorruptedCount(): void {
  corruptedCount = 0;
}

function computeFinalScore(baseScore: number, skillConfidenceMap: Record<string, SkillConfidence>, extractedSkills: Record<CategoryKey, string[]>): number {
  let delta = 0;
  for (const skills of Object.values(extractedSkills)) {
    for (const s of skills) {
      const conf = skillConfidenceMap[s] ?? 'practice';
      delta += conf === 'know' ? 2 : -2;
    }
  }
  return Math.max(0, Math.min(100, baseScore + delta));
}

/** Computes live score from baseScore + skillConfidenceMap. Use for display (updates on toggle). */
export function getLiveScore(entry: HistoryEntry): number {
  return computeFinalScore(entry.baseScore, entry.skillConfidenceMap, entry.extractedSkills);
}

export function saveToHistory(input: {
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
}): HistoryEntry {
  const extractedSkills = normalizeExtractedSkills(input.extractedSkills);
  const skillConfidenceMap: Record<string, SkillConfidence> = input.skillConfidenceMap ?? {};
  for (const skills of Object.values(extractedSkills)) {
    for (const s of skills) {
      if (!(s in skillConfidenceMap)) skillConfidenceMap[s] = 'practice';
    }
  }
  const baseScore = input.readinessScore;
  const finalScore = computeFinalScore(baseScore, skillConfidenceMap, extractedSkills);
  const now = new Date().toISOString();

  const full: HistoryEntry = {
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
    company: input.company ?? '',
    role: input.role ?? '',
    jdText: input.jdText,
    extractedSkills,
    skillConfidenceMap,
    plan: input.plan,
    checklist: input.checklist,
    questions: input.questions,
    baseScore,
    finalScore,
    fallbackLabel: input.fallbackLabel,
    companyIntel: input.companyIntel,
    roundMapping: input.roundMapping,
  };

  const list = getHistory();
  list.unshift(full);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  return full;
}

export function getHistory(): HistoryEntry[] {
  corruptedCount = 0;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    const result: HistoryEntry[] = [];
    for (const item of parsed) {
      if (!isValidEntry(item)) {
        corruptedCount++;
        continue;
      }
      try {
        const o = item as Record<string, unknown>;
        const baseScore = typeof o.baseScore === 'number' ? o.baseScore : (typeof o.readinessScore === 'number' ? o.readinessScore : 0);
        const skillConfidenceMap = (o.skillConfidenceMap && typeof o.skillConfidenceMap === 'object')
          ? (o.skillConfidenceMap as Record<string, SkillConfidence>)
          : {};
        const extractedSkills = normalizeExtractedSkills(o.extractedSkills);
        const finalScore = typeof o.finalScore === 'number' ? o.finalScore : computeFinalScore(baseScore, skillConfidenceMap, extractedSkills);

        result.push({
          id: String(o.id),
          createdAt: typeof o.createdAt === 'string' ? o.createdAt : new Date().toISOString(),
          updatedAt: typeof o.updatedAt === 'string' ? o.updatedAt : (o.createdAt && typeof o.createdAt === 'string' ? o.createdAt : new Date().toISOString()),
          company: typeof o.company === 'string' ? o.company : '',
          role: typeof o.role === 'string' ? o.role : '',
          jdText: String(o.jdText),
          extractedSkills,
          skillConfidenceMap,
          plan: normalizePlan(o.plan ?? o.plan7Days),
          checklist: normalizeChecklist(o.checklist),
          questions: normalizeQuestions(o.questions),
          baseScore,
          finalScore,
          fallbackLabel: typeof o.fallbackLabel === 'string' ? o.fallbackLabel : undefined,
          companyIntel: o.companyIntel && typeof o.companyIntel === 'object' ? o.companyIntel as CompanyIntel : undefined,
          roundMapping: Array.isArray(o.roundMapping) ? normalizeRoundMapping(o.roundMapping) : undefined,
        });
      } catch {
        corruptedCount++;
      }
    }
    return result;
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

  const entry = list[idx];
  const skillConfidenceMap = updates.skillConfidenceMap ?? entry.skillConfidenceMap;
  const finalScore = computeFinalScore(entry.baseScore, skillConfidenceMap, entry.extractedSkills);
  const updatedAt = new Date().toISOString();

  list[idx] = {
    ...entry,
    skillConfidenceMap,
    finalScore,
    updatedAt,
    ...updates,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}
