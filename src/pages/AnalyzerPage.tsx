import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/shadcn-card';
import { extractSkills } from '@/lib/skills';
import { runAnalysis } from '@/lib/analysis';
import { saveToHistory } from '@/lib/history';

export function AnalyzerPage() {
  const navigate = useNavigate();
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [jdText, setJdText] = useState('');

  const handleAnalyze = () => {
    const extracted = extractSkills(jdText);
    const result = runAnalysis({ company, role, jdText, extractedSkills: extracted });
    const entry = saveToHistory({
      company,
      role,
      jdText,
      extractedSkills: result.extractedSkills,
      plan: result.plan,
      checklist: result.checklist,
      questions: result.questions,
      readinessScore: result.readinessScore,
      fallbackLabel: result.fallbackLabel,
      companyIntel: result.companyIntel,
      roundMapping: result.roundMapping,
    });
    navigate('/dashboard/results?id=' + entry.id);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-1">JD Analyzer</h2>
        <p className="text-gray-600 text-sm">Paste a job description to extract skills and get a preparation plan.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Job Description Input</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company (optional)</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Google, Microsoft"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role (optional)</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Software Engineer"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Description *</label>
            <textarea
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              placeholder="Paste the full job description..."
              rows={12}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary resize-y"
            />
            {jdText.length === 0 && (
              <p className="text-sm text-gray-500 mt-1">Job description is required to analyze.</p>
            )}
          </div>
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={!jdText.trim()}
            className="px-6 py-3 bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
          >
            Analyze
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
