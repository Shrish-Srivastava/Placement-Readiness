/**
 * Analysis engine — checklist, plan, questions, readiness score, company intel, round mapping
 */

import {
  type CategoryKey,
  getDetectedCategories,
  hasAnySkills,
} from './skills';
import { inferCompanyIntel } from './companyIntel';
import { buildRoundMapping } from './roundMapping';

export interface AnalysisInput {
  company: string;
  role: string;
  jdText: string;
  extractedSkills: Record<CategoryKey, string[]>;
}

export interface RoundChecklist {
  round: string;
  items: string[];
}

export interface DayPlan {
  day: string;
  title: string;
  items: string[];
}

function buildRoundChecklist(input: AnalysisInput): RoundChecklist[] {
  const cats = getDetectedCategories(input.extractedSkills);
  const hasDSA = cats.includes('coreCS') || input.jdText.toLowerCase().includes('dsa');
  const hasWeb = cats.includes('web');
  const hasData = cats.includes('data');
  const hasCloud = cats.includes('cloudDevOps');
  const hasTesting = cats.includes('testing');

  const round1: string[] = [
    'Review aptitude: time-speed-distance, percentages, ratios',
    'Prepare for logical reasoning and verbal ability',
    'Brush up basics: number systems, probability',
  ];
  if (cats.length > 0) round1.push('Align basics with JD requirements');

  const round2: string[] = [
    'Revise arrays, strings, hash maps',
    'Practice 2–3 medium problems on LeetCode',
    'Review time and space complexity',
  ];
  if (hasDSA) {
    round2.push('Focus on trees, graphs if mentioned');
    round2.push('Practice pattern-based problems');
  }
  if (hasData) round2.push('Revise DBMS concepts: indexing, transactions');
  if (cats.includes('coreCS')) round2.push('Review OS, OOP, Networks fundamentals');

  const round3: string[] = [
    'Prepare 2–3 project deep-dives',
    'Map projects to JD tech stack',
    'Prepare STAR format for behavioral questions',
  ];
  if (hasWeb) round3.push('Be ready for React/Node architecture questions');
  if (hasData) round3.push('Prepare SQL optimization examples');
  if (hasCloud) round3.push('Explain deployment and CI/CD experience');
  if (hasTesting) round3.push('Be ready for unit/integration testing questions');

  const round4: string[] = [
    'Prepare "Tell me about yourself" (1–2 min)',
    'Why this company? Why this role?',
    'Strengths and weaknesses with examples',
    'Salary expectation research',
    'Questions to ask interviewer',
  ];

  return [
    { round: 'Round 1: Aptitude / Basics', items: round1.slice(0, 6) },
    { round: 'Round 2: DSA + Core CS', items: round2.slice(0, 8) },
    { round: 'Round 3: Tech Interview (Projects + Stack)', items: round3.slice(0, 8) },
    { round: 'Round 4: Managerial / HR', items: round4 },
  ];
}

function build7DayPlan(input: AnalysisInput): DayPlan[] {
  const cats = getDetectedCategories(input.extractedSkills);
  const hasReact = cats.includes('web') && input.jdText.toLowerCase().includes('react');
  const hasDSA = cats.includes('coreCS') || input.jdText.toLowerCase().includes('dsa');
  const hasData = cats.includes('data');

  const day1Items = [
    'Revise OOP, DBMS, OS fundamentals',
    'Brush up data structures basics',
    cats.length > 0 ? 'Map core topics to JD requirements' : 'Cover common CS fundamentals',
  ];
  if (hasData) day1Items.push('Revise SQL, indexing, and database transactions');

  const plans: DayPlan[] = [
    {
      day: 'Day 1–2',
      title: 'Basics + Core CS',
      items: day1Items,
    },
    {
      day: 'Day 3–4',
      title: 'DSA + Coding Practice',
      items: [
        'Solve 3–5 medium LeetCode problems',
        'Focus on arrays, strings, trees',
        hasDSA ? 'Practice pattern problems (sliding window, two pointers)' : 'Build coding speed',
      ],
    },
    {
      day: 'Day 5',
      title: 'Project + Resume Alignment',
      items: [
        'Align project descriptions with JD keywords',
        'Prepare deep-dive for each project',
        hasReact ? 'Revise frontend concepts (React lifecycle, state)' : 'Map tech stack to resume',
      ],
    },
    {
      day: 'Day 6',
      title: 'Mock Interview Questions',
      items: [
        'Practice system design basics (if applicable)',
        'Prepare behavioral STAR stories',
        'Review likely tech questions from detected skills',
      ],
    },
    {
      day: 'Day 7',
      title: 'Revision + Weak Areas',
      items: [
        'Revise weak topics from self-assessment',
        'Final mock interview or self-quiz',
        'Get rest before interview',
      ],
    },
  ];

  return plans;
}

function buildInterviewQuestions(input: AnalysisInput): string[] {
  const questions: string[] = [];
  const lower = input.jdText.toLowerCase();
  const cats = getDetectedCategories(input.extractedSkills);

  if (cats.includes('data') || lower.includes('sql')) {
    questions.push('Explain indexing and when it helps.');
    questions.push('Difference between clustered and non-clustered index.');
  }
  if (cats.includes('web') || lower.includes('react')) {
    questions.push('Explain state management options in React.');
    questions.push('Virtual DOM and reconciliation.');
  }
  if (cats.includes('coreCS') || lower.includes('dsa')) {
    questions.push('How would you optimize search in sorted data?');
    questions.push('Explain time complexity of common sorting algorithms.');
  }
  if (cats.includes('coreCS') || lower.includes('oop')) {
    questions.push('Explain polymorphism with a real-world example.');
  }
  if (cats.includes('cloudDevOps') || lower.includes('docker')) {
    questions.push('What is containerization? Docker vs VMs.');
  }
  if (cats.includes('cloudDevOps') || lower.includes('aws')) {
    questions.push('Explain EC2 vs Lambda — when to use each?');
  }
  if (cats.includes('web') || lower.includes('rest')) {
    questions.push('REST vs GraphQL — when to use each?');
  }
  if (cats.includes('web') || lower.includes('node')) {
    questions.push('Explain event loop and async handling in Node.js.');
  }
  if (cats.includes('data') || lower.includes('mongodb')) {
    questions.push('SQL vs NoSQL — tradeoffs.');
  }
  if (cats.includes('web') || lower.includes('react')) {
    questions.push('useEffect vs useLayoutEffect — differences?');
  }

  // Fill only if needed — prefer skill-specific
  const fallback = [
    'Describe a challenging technical problem you solved.',
    'How do you approach learning a new technology?',
  ];
  for (const q of fallback) {
    if (questions.length >= 10) break;
    if (!questions.includes(q)) questions.push(q);
  }

  return questions.slice(0, 10);
}

function computeReadinessScore(input: AnalysisInput): number {
  let score = 35;
  const cats = getDetectedCategories(input.extractedSkills);

  // +5 per detected category, max 30 (6 categories × 5)
  score += Math.min(cats.length * 5, 30);

  if (input.company.trim().length > 0) score += 10;
  if (input.role.trim().length > 0) score += 10;
  if (input.jdText.length > 800) score += 10;

  return Math.min(100, score);
}

export interface AnalysisResult {
  extractedSkills: Record<CategoryKey, string[]>;
  checklist: RoundChecklist[];
  plan: DayPlan[];
  questions: string[];
  readinessScore: number;
  fallbackLabel: string;
  companyIntel?: import('./companyIntel').CompanyIntel;
  roundMapping?: import('./roundMapping').RoundMappingItem[];
}

export function runAnalysis(input: AnalysisInput): AnalysisResult {
  const fallbackLabel = hasAnySkills(input.extractedSkills)
    ? ''
    : 'General fresher stack';

  const companyIntel =
    input.company.trim().length > 0
      ? inferCompanyIntel(input.company, input.jdText)
      : undefined;

  const sizeCategory = companyIntel?.sizeCategory ?? 'startup';
  const roundMapping = buildRoundMapping(
    sizeCategory,
    input.extractedSkills,
    input.jdText
  );

  return {
    extractedSkills: input.extractedSkills,
    checklist: buildRoundChecklist(input),
    plan: build7DayPlan(input),
    questions: buildInterviewQuestions(input),
    readinessScore: computeReadinessScore(input),
    fallbackLabel,
    companyIntel,
    roundMapping,
  };
}
