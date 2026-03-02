export type StatusType = 'Not Started' | 'In Progress' | 'Shipped';

interface TopBarProps {
  projectName: string;
  step: number;
  totalSteps: number;
  status: StatusType;
}

export function TopBar({ projectName, step, totalSteps, status }: TopBarProps) {
  return (
    <header className="kodnest-topbar" role="banner">
      <div className="kodnest-topbar__left">
        <span className="kodnest-topbar__project">{projectName}</span>
      </div>
      <div className="kodnest-topbar__center">
        <span className="kodnest-topbar__progress">
          Step {step} / {totalSteps}
        </span>
      </div>
      <div className="kodnest-topbar__right">
        <span className={`kodnest-topbar__status kodnest-topbar__status--${status.toLowerCase().replace(' ', '-')}`}>
          {status}
        </span>
      </div>
    </header>
  );
}
