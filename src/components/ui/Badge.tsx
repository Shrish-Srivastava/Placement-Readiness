import type { ReactNode } from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'status-not-started' | 'status-in-progress' | 'status-shipped';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span className={`kodnest-badge kodnest-badge--${variant} ${className}`.trim()}>
      {children}
    </span>
  );
}
