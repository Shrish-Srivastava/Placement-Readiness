import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/shadcn-card';
import { SKILL_CATEGORIES } from '@/lib/skills';
import type { CategoryKey } from '@/lib/skills';
import { getEntryById, getHistory, updateEntry, getLiveScore } from '@/lib/history';
import type { HistoryEntry, SkillConfidence } from '@/lib/history';
import { buildRoundMapping } from '@/lib/roundMapping';
import { OverallReadiness } from '@/components/dashboard';
import { Copy, Download, Check, Building2 } from 'lucide-react';

function formatPlan(entry: HistoryEntry): string {
  return entry.plan
    .map((p) => `${p.day}: ${p.title}\n${p.items.map((i) => `  • ${i}`).join('\n')}`)
    .join('\n\n');
}

function formatChecklist(entry: HistoryEntry): string {
  return entry.checklist
    .map((r) => `${r.round}\n${r.items.map((i) => `  • ${i}`).join('\n')}`)
    .join('\n\n');
}

function formatQuestions(entry: HistoryEntry): string {
  return entry.questions.map((q, i) => `${i + 1}. ${q}`).join('\n');
}

function formatSkills(entry: HistoryEntry): string {
  const hasAny = Object.values(entry.extractedSkills).some((arr) => arr.length > 0);
  if (!hasAny) return entry.fallbackLabel || 'General fresher stack (no specific keywords detected)';
  const lines: string[] = [];
  for (const [key, skills] of Object.entries(entry.extractedSkills)) {
    if (skills.length === 0) continue;
    const cat = SKILL_CATEGORIES[key as CategoryKey];
    lines.push(`${cat?.label ?? key}: ${skills.join(', ')}`);
  }
  return lines.join('\n');
}

function formatFullTxt(entry: HistoryEntry): string {
  return [
    `Analysis Results`,
    entry.company ? `Company: ${entry.company}` : null,
    entry.role ? `Role: ${entry.role}` : null,
    `Date: ${new Date(entry.createdAt).toLocaleDateString()}`,
    `Readiness Score: ${getLiveScore(entry)}/100`,
    '',
    '=== KEY SKILLS EXTRACTED ===',
    formatSkills(entry),
    '',
    '=== 7-DAY PLAN ===',
    formatPlan(entry),
    '',
    '=== ROUND-WISE CHECKLIST ===',
    formatChecklist(entry),
    '',
    '=== 10 LIKELY INTERVIEW QUESTIONS ===',
    formatQuestions(entry),
  ]
    .filter(Boolean)
    .join('\n');
}

export function ResultsPage() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const [entry, setEntry] = useState<HistoryEntry | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const e = getEntryById(id);
      setEntry(e ?? null);
    } else {
      const history = getHistory();
      setEntry(history[0] ?? null);
    }
  }, [id]);

  const handleToggleSkill = useCallback(
    (skill: string, next: SkillConfidence) => {
      if (!entry?.id) return;
      const map = { ...(entry.skillConfidenceMap ?? {}), [skill]: next };
      setEntry({ ...entry, skillConfidenceMap: map });
      updateEntry(entry.id, { skillConfidenceMap: map });
    },
    [entry]
  );

  const handleCopy = useCallback(async (label: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  }, []);

  const handleDownload = useCallback(() => {
    if (!entry) return;
    const blob = new Blob([formatFullTxt(entry)], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `placement-prep-${entry.company || 'analysis'}-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, [entry]);

  if (!entry) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900">Results</h2>
        <p className="text-gray-600">No analysis found. Run an analysis from the JD Analyzer.</p>
      </div>
    );
  }

  const hasAnySkills = Object.values(entry.extractedSkills).some((arr) => arr.length > 0);
  const liveScore = getLiveScore(entry);

  const companyIntel = entry.companyIntel;
  const sizeCategory = companyIntel?.sizeCategory ?? 'startup';
  const roundMapping =
    entry.roundMapping ??
    buildRoundMapping(sizeCategory, entry.extractedSkills, entry.jdText);

  const practiceSkills = (Object.entries(entry.skillConfidenceMap ?? {}) as [string, SkillConfidence][])
    .filter(([, c]) => c === 'practice')
    .map(([s]) => s);
  const weakSkills = practiceSkills.slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Analysis Results</h2>
          <p className="text-gray-600 text-sm">
            {entry.company && `${entry.company} • `}
            {entry.role && `${entry.role} • `}
            {new Date(entry.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex justify-center">
          <OverallReadiness score={liveScore} />
        </div>
      </div>

      {/* Company Intel block — only when company name provided */}
      {entry.company.trim() && companyIntel && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              <CardTitle>Company Intel</CardTitle>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Demo Mode: Company intel generated heuristically.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <span className="text-xs font-medium text-gray-500 uppercase">Company</span>
                <p className="font-medium text-gray-900">{companyIntel.companyName}</p>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-500 uppercase">Industry</span>
                <p className="text-gray-900">{companyIntel.industry}</p>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-500 uppercase">Estimated size</span>
                <p className="text-gray-900">
                  {companyIntel.sizeCategory === 'enterprise'
                    ? 'Enterprise (2000+)'
                    : companyIntel.sizeCategory === 'mid-size'
                      ? 'Mid-size (200–2000)'
                      : 'Startup (<200)'}
                </p>
              </div>
            </div>
            <div>
              <span className="text-xs font-medium text-gray-500 uppercase">Typical Hiring Focus</span>
              <p className="text-gray-700 text-sm mt-0.5">{companyIntel.hiringFocus}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Round Mapping — vertical timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Interview Round Flow</CardTitle>
          <p className="text-sm text-gray-600">
            Dynamic mapping based on company size and detected skills.
          </p>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {roundMapping.map((r, i) => (
              <div
                key={r.round}
                className="relative flex gap-4 pb-6 last:pb-0"
              >
                <div className="relative flex shrink-0 flex-col items-center">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-primary bg-white text-sm font-medium text-primary">
                    {i + 1}
                  </div>
                  {i < roundMapping.length - 1 && (
                    <div className="absolute top-9 left-1/2 h-full w-px -translate-x-px bg-gray-200" />
                  )}
                </div>
                <div className="min-w-0 flex-1 pt-1">
                  <h4 className="font-medium text-gray-900">{r.round}</h4>
                  <p className="text-sm text-gray-600 mt-1">{r.whyMatters}</p>
                  {r.items && r.items.length > 0 && (
                    <ul className="mt-2 flex flex-wrap gap-1.5">
                      {r.items.map((item, j) => (
                        <li
                          key={j}
                          className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-700"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key skills with toggles */}
      <Card>
        <CardHeader>
          <CardTitle>Key Skills Extracted</CardTitle>
          {entry.fallbackLabel && (
            <p className="text-sm text-primary">{entry.fallbackLabel}</p>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {(Object.entries(entry.extractedSkills) as [CategoryKey, string[]][]).map(
              ([key, skills]) => {
                if (skills.length === 0) return null;
                const cat = SKILL_CATEGORIES[key];
                return (
                  <div key={key} className="space-y-1.5">
                    <span className="text-xs font-medium text-gray-500 uppercase">
                      {cat?.label ?? key}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {skills.map((s) => {
                        const conf = (entry.skillConfidenceMap ?? {})[s] ?? 'practice';
                        return (
                          <div
                            key={s}
                            className="inline-flex items-center gap-1 rounded-md overflow-hidden border border-gray-200"
                          >
                            <span
                              className={`px-2.5 py-1 text-sm ${
                                conf === 'know'
                                  ? 'bg-primary/20 text-primary font-medium'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {s}
                            </span>
                            <div className="flex text-xs">
                              <button
                                type="button"
                                onClick={() => handleToggleSkill(s, 'know')}
                                className={`px-2 py-1 ${
                                  conf === 'know'
                                    ? 'bg-primary text-white font-medium'
                                    : 'bg-white text-gray-500 hover:bg-gray-50'
                                }`}
                              >
                                I know
                              </button>
                              <button
                                type="button"
                                onClick={() => handleToggleSkill(s, 'practice')}
                                className={`px-2 py-1 ${
                                  conf === 'practice'
                                    ? 'bg-primary text-white font-medium'
                                    : 'bg-white text-gray-500 hover:bg-gray-50'
                                }`}
                              >
                                Need practice
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              }
            )}
            {!hasAnySkills && (
              <p className="text-gray-500 text-sm">
                {entry.fallbackLabel || 'General fresher stack (no specific keywords detected)'}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Export tools */}
      <Card>
        <CardHeader>
          <CardTitle>Export</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleCopy('plan', formatPlan(entry))}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {copied === 'plan' ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
            Copy 7-day plan
          </button>
          <button
            type="button"
            onClick={() => handleCopy('checklist', formatChecklist(entry))}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {copied === 'checklist' ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
            Copy round checklist
          </button>
          <button
            type="button"
            onClick={() => handleCopy('questions', formatQuestions(entry))}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {copied === 'questions' ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
            Copy 10 questions
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Download className="w-4 h-4" />
            Download as TXT
          </button>
        </CardContent>
      </Card>

      {/* Round-wise checklist */}
      <Card>
        <CardHeader>
          <CardTitle>Round-wise Preparation Checklist</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {entry.checklist.map((r) => (
            <div key={r.round}>
              <h4 className="font-medium text-gray-900 mb-2">{r.round}</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                {r.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 7-day plan */}
      <Card>
        <CardHeader>
          <CardTitle>7-Day Preparation Plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {entry.plan.map((p) => (
            <div key={p.day} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
              <h4 className="font-medium text-gray-900">
                {p.day}: {p.title}
              </h4>
              <ul className="list-disc list-inside mt-1 space-y-1 text-sm text-gray-700">
                {p.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 10 questions */}
      <Card>
        <CardHeader>
          <CardTitle>10 Likely Interview Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
            {entry.questions.map((q, i) => (
              <li key={i} className="pl-1">
                {q}
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* Action Next box */}
      <Card className="border-gray-200 bg-gray-50/50">
        <CardHeader>
          <CardTitle className="text-base font-medium text-gray-900">Action Next</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {weakSkills.length > 0 && (
            <p className="text-sm text-gray-700">
              Top 3 skills to practice: {weakSkills.join(', ')}
            </p>
          )}
          <p className="text-sm text-gray-700">
            Suggested next action: Start Day 1 plan now.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
