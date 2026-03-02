import { Button } from './Button';

interface ErrorStateProps {
  title: string;
  message: string;
  fixSuggestion: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function ErrorState({
  title,
  message,
  fixSuggestion,
  actionLabel,
  onAction,
}: ErrorStateProps) {
  return (
    <div className="kodnest-error-state" role="alert">
      <h3 className="kodnest-error-state__title">{title}</h3>
      <p className="kodnest-error-state__message">{message}</p>
      <p className="kodnest-error-state__fix">{fixSuggestion}</p>
      {actionLabel && onAction && (
        <Button variant="secondary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
