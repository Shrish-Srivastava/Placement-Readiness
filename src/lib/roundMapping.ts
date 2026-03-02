/**
 * Round Mapping Engine — dynamic rounds based on company + skills
 */

import type { CompanySize } from './companyIntel';
import { getDetectedCategories } from './skills';
import type { CategoryKey } from './skills';

export interface RoundMappingItem {
  round: string;
  whyMatters: string;
  items?: string[];
}

function hasDSA(extractedSkills: Record<CategoryKey, string[]>, jdText: string): boolean {
  const cats = getDetectedCategories(extractedSkills);
  return cats.includes('coreCS') || jdText.toLowerCase().includes('dsa');
}

function hasWebStack(extractedSkills: Record<CategoryKey, string[]>): boolean {
  const cats = getDetectedCategories(extractedSkills);
  return cats.includes('web');
}

function hasReactNode(extractedSkills: Record<CategoryKey, string[]>, jdText: string): boolean {
  const lower = jdText.toLowerCase();
  const web = extractedSkills.web ?? [];
  return (
    web.some((s) => lower.includes(s.toLowerCase())) ||
    lower.includes('react') ||
    lower.includes('node')
  );
}

export function buildRoundMapping(
  sizeCategory: CompanySize,
  extractedSkills: Record<CategoryKey, string[]>,
  jdText: string
): RoundMappingItem[] {
  const dsa = hasDSA(extractedSkills, jdText);
  const webStack = hasWebStack(extractedSkills);
  const reactNode = hasReactNode(extractedSkills, jdText);

  if (sizeCategory === 'enterprise' && dsa) {
    return [
      {
        round: 'Round 1: Online Test (DSA + Aptitude)',
        whyMatters: 'Filters candidates at scale. Tests basics and logical reasoning.',
        items: ['DSA basics', 'Aptitude', 'Logical reasoning'],
      },
      {
        round: 'Round 2: Technical (DSA + Core CS)',
        whyMatters: 'Deep-dive on problem-solving and CS fundamentals.',
        items: ['Coding problems', 'Core CS (OS, DBMS, OOP)'],
      },
      {
        round: 'Round 3: Tech + Projects',
        whyMatters: 'Validates hands-on experience and project depth.',
        items: ['Project deep-dive', 'System design basics'],
      },
      {
        round: 'Round 4: HR',
        whyMatters: 'Assesses culture fit and communication.',
        items: ['Behavioral', 'Salary discussion'],
      },
    ];
  }

  if ((sizeCategory === 'startup' || sizeCategory === 'mid-size') && (webStack || reactNode)) {
    return [
      {
        round: 'Round 1: Practical Coding',
        whyMatters: 'Real-world coding skills. Often live or take-home.',
        items: ['Coding challenge', 'Stack alignment'],
      },
      {
        round: 'Round 2: System Discussion',
        whyMatters: 'Architecture and design thinking. How you build things.',
        items: ['System design', 'Tech choices'],
      },
      {
        round: 'Round 3: Culture Fit',
        whyMatters: 'Team fit, values, and mutual fit in a small team.',
        items: ['Behavioral', 'Team values'],
      },
    ];
  }

  // Mid-size generic
  if (sizeCategory === 'mid-size') {
    return [
      {
        round: 'Round 1: Screening (Aptitude / Coding)',
        whyMatters: 'Initial filter on fundamentals.',
        items: ['Aptitude or coding'],
      },
      {
        round: 'Round 2: Technical',
        whyMatters: 'Technical depth and problem-solving.',
        items: ['DSA / Core CS / Stack'],
      },
      {
        round: 'Round 3: HR / Final',
        whyMatters: 'Culture fit and role alignment.',
        items: ['Behavioral', 'Fit'],
      },
    ];
  }

  // Default: Startup (unknown company)
  return [
    {
      round: 'Round 1: Screening',
      whyMatters: 'Initial assessment of skills and fit.',
      items: ['Coding or discussion'],
    },
    {
      round: 'Round 2: Technical Deep-dive',
      whyMatters: 'Validates core skills and problem-solving.',
      items: ['DSA / Projects / Stack'],
    },
    {
      round: 'Round 3: Culture / HR',
      whyMatters: 'Team fit and communication.',
      items: ['Behavioral', 'Fit'],
    },
  ];
}
