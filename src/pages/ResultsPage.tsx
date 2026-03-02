import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/shadcn-card';
import { SKILL_CATEGORIES } from '@/lib/skills';
import type { CategoryKey } from '@/lib/skills';
import { getEntryById, getHistory } from '@/lib/history';
import type { HistoryEntry } from '@/lib/history';
import { OverallReadiness } from '@/components/dashboard';

export function ResultsPage() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const [entry, setEntry] = useState<HistoryEntry | null>(null);

  useEffect(() => {
    if (id) {
      const e = getEntryById(id);
      setEntry(e ?? null);
    } else {
      const history = getHistory();
      setEntry(history[0] ?? null);
    }
  }, [id]);

  if (!entry) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900">Results</h2>
        <p className="text-gray-600">No analysis found. Run an analysis from the JD Analyzer.</p>
      </div>
    );
  }

  const hasAnySkills = Object.values(entry.extractedSkills).some((arr) => arr.length > 0);

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
          <OverallReadiness score={entry.readinessScore} />
        </div>
      </div>

      {/* A) Key skills extracted */}
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
                      {skills.map((s) => (
                        <span
                          key={s}
                          className="px-2.5 py-1 bg-primary/10 text-primary text-sm rounded-md"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              }
            )}
            {!hasAnySkills && (
              <p className="text-gray-500 text-sm">{entry.fallbackLabel || 'General fresher stack (no specific keywords detected)'}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* B) Round-wise checklist */}
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

      {/* C) 7-day plan */}
      <Card>
        <CardHeader>
          <CardTitle>7-Day Preparation Plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {entry.plan.map((p) => (
            <div key={p.day} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
              <h4 className="font-medium text-gray-900">{p.day}: {p.title}</h4>
              <ul className="list-disc list-inside mt-1 space-y-1 text-sm text-gray-700">
                {p.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* D) 10 likely interview questions */}
      <Card>
        <CardHeader>
          <CardTitle>10 Likely Interview Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
            {entry.questions.map((q, i) => (
              <li key={i} className="pl-1">{q}</li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
