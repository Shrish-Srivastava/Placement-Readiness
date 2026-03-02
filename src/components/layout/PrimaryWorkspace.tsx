import type { ReactNode } from 'react';

interface PrimaryWorkspaceProps {
  children: ReactNode;
}

export function PrimaryWorkspace({ children }: PrimaryWorkspaceProps) {
  return (
    <main className="kodnest-workspace" role="main">
      {children}
    </main>
  );
}
