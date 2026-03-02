interface SecondaryPanelProps {
  stepExplanation: string;
  promptText?: string;
  onCopyPrompt?: () => void;
  onBuildInLovable?: () => void;
  onItWorked?: () => void;
  onError?: () => void;
  onAddScreenshot?: () => void;
}

export function SecondaryPanel({
  stepExplanation,
  promptText,
  onCopyPrompt,
  onBuildInLovable,
  onItWorked,
  onError,
  onAddScreenshot,
}: SecondaryPanelProps) {
  return (
    <aside className="kodnest-panel" role="complementary" aria-label="Step guidance">
      <div className="kodnest-panel__explanation">
        <p>{stepExplanation}</p>
      </div>
      {promptText && (
        <div className="kodnest-panel__prompt">
          <label className="kodnest-panel__prompt-label">Copyable prompt</label>
          <div className="kodnest-panel__prompt-box">
            <code>{promptText}</code>
          </div>
          <div className="kodnest-panel__actions">
            {onCopyPrompt && (
              <button type="button" className="kodnest-btn kodnest-btn--secondary kodnest-btn--sm" onClick={onCopyPrompt}>
                Copy
              </button>
            )}
            {onBuildInLovable && (
              <button type="button" className="kodnest-btn kodnest-btn--primary kodnest-btn--sm" onClick={onBuildInLovable}>
                Build in Lovable
              </button>
            )}
          </div>
        </div>
      )}
      <div className="kodnest-panel__feedback">
        {onItWorked && (
          <button type="button" className="kodnest-btn kodnest-btn--secondary kodnest-btn--sm" onClick={onItWorked}>
            It Worked
          </button>
        )}
        {onError && (
          <button type="button" className="kodnest-btn kodnest-btn--secondary kodnest-btn--sm" onClick={onError}>
            Error
          </button>
        )}
        {onAddScreenshot && (
          <button type="button" className="kodnest-btn kodnest-btn--secondary kodnest-btn--sm" onClick={onAddScreenshot}>
            Add Screenshot
          </button>
        )}
      </div>
    </aside>
  );
}
