/**
 * Skill extraction heuristic — keyword detection (case-insensitive)
 */

export const SKILL_CATEGORIES = {
  coreCS: {
    label: 'Core CS',
    keywords: ['DSA', 'OOP', 'DBMS', 'OS', 'Networks', 'Data Structures', 'Algorithms', 'Operating System'],
  },
  languages: {
    label: 'Languages',
    keywords: ['Java', 'Python', 'JavaScript', 'TypeScript', 'C++', 'C#', 'Go', 'Rust'],
  },
  web: {
    label: 'Web',
    keywords: ['React', 'Next.js', 'Node.js', 'Express', 'REST', 'GraphQL', 'Vue', 'Angular'],
  },
  data: {
    label: 'Data',
    keywords: ['SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'NoSQL'],
  },
  cloudDevOps: {
    label: 'Cloud/DevOps',
    keywords: ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD', 'Linux', 'Git', 'Jenkins'],
  },
  testing: {
    label: 'Testing',
    keywords: ['Selenium', 'Cypress', 'Playwright', 'JUnit', 'PyTest', 'Jest'],
  },
  other: {
    label: 'Other',
    keywords: [] as readonly string[],
  },
} as const;

export type CategoryKey = keyof typeof SKILL_CATEGORIES;

const DEFAULT_OTHER_SKILLS = ['Communication', 'Problem solving', 'Basic coding', 'Projects'] as const;

export function extractSkills(jdText: string): Record<CategoryKey, string[]> {
  const lower = jdText.toLowerCase();
  const result: Record<string, string[]> = {};

  for (const [key, { keywords = [] }] of Object.entries(SKILL_CATEGORIES)) {
    const found: string[] = [];
    for (const kw of keywords) {
      const kwLower = kw.toLowerCase();
      const hasNonWord = /[^a-z0-9]/.test(kwLower);
      const matches = hasNonWord
        ? lower.includes(kwLower)
        : new RegExp(`\\b${kwLower}\\b`, 'i').test(lower);
      if (matches) found.push(kw);
    }
    result[key] = [...new Set(found)];
  }

  const hasAny = Object.values(result).some((arr) => arr.length > 0);
  if (!hasAny) {
    result.other = [...DEFAULT_OTHER_SKILLS];
  } else {
    result.other = result.other ?? [];
  }

  return result as Record<CategoryKey, string[]>;
}

export function hasAnySkills(extracted: Record<CategoryKey, string[]>): boolean {
  return Object.values(extracted).some((arr) => arr.length > 0);
}

export function getDetectedCategories(extracted: Record<CategoryKey, string[]>): CategoryKey[] {
  return (Object.entries(extracted) as [CategoryKey, string[]][])
    .filter(([, arr]) => arr.length > 0)
    .map(([k]) => k);
}
