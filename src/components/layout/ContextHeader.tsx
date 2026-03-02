interface ContextHeaderProps {
  headline: string;
  subtext?: string;
}

export function ContextHeader({ headline, subtext }: ContextHeaderProps) {
  return (
    <header className="kodnest-context-header" role="region" aria-label="Page context">
      <h1 className="kodnest-context-header__headline">{headline}</h1>
      {subtext && <p className="kodnest-context-header__subtext">{subtext}</p>}
    </header>
  );
}
