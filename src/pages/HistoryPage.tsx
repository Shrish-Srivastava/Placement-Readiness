import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/shadcn-card';
import { getHistory, getLiveScore, getCorruptedCount } from '@/lib/history';
import { History, Calendar } from 'lucide-react';

export function HistoryPage() {
  const navigate = useNavigate();
  const history = getHistory();
  const corruptedCount = getCorruptedCount();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-1">Analysis History</h2>
        <p className="text-gray-600 text-sm">
          View past JD analyses. Click to open results.
        </p>
        {corruptedCount > 0 && (
          <p className="text-sm text-amber-600 mt-2">
            {corruptedCount === 1
              ? "One saved entry couldn't be loaded. Create a new analysis."
              : "Some saved entries couldn't be loaded. Create a new analysis."}
          </p>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Saved Analyses
          </CardTitle>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <p className="text-gray-500 text-sm">No analyses yet. Run an analysis from the JD Analyzer.</p>
          ) : (
            <ul className="space-y-2">
              {history.map((entry) => (
                <li key={entry.id}>
                  <button
                    type="button"
                    onClick={() => navigate(`/dashboard/results?id=${entry.id}`)}
                    className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:border-primary/50 hover:bg-primary/5 transition-colors flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 truncate">
                        {entry.company || 'Unknown Company'} • {entry.role || 'Unknown Role'}
                      </p>
                      <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-0.5">
                        <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                        {new Date(entry.createdAt).toLocaleDateString()} {new Date(entry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <span className="flex-shrink-0 px-2.5 py-1 bg-primary/10 text-primary text-sm font-medium rounded-md">
                      {getLiveScore(entry)}/100
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
