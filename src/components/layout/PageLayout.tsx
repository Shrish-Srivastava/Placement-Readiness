import type { ReactNode } from 'react';
import { TopBar, StatusType } from './TopBar';
import { ContextHeader } from './ContextHeader';
import { PrimaryWorkspace } from './PrimaryWorkspace';
import { SecondaryPanel } from './SecondaryPanel';
import { ProofFooter, ProofItem } from './ProofFooter';

interface PageLayoutProps {
  projectName: string;
  step: number;
  totalSteps: number;
  status: StatusType;
  headline: string;
  subtext?: string;
  children: ReactNode;
  stepExplanation: string;
  promptText?: string;
  proofItems: ProofItem[];
  panelActions?: {
    onCopyPrompt?: () => void;
    onBuildInLovable?: () => void;
    onItWorked?: () => void;
    onError?: () => void;
    onAddScreenshot?: () => void;
  };
  proofHandlers?: {
    onToggle?: (id: string, checked: boolean) => void;
    onProofInput?: (id: string, value: string) => void;
  };
}

export function PageLayout({
  projectName,
  step,
  totalSteps,
  status,
  headline,
  subtext,
  children,
  stepExplanation,
  promptText,
  proofItems,
  panelActions,
  proofHandlers,
}: PageLayoutProps) {
  return (
    <div className="kodnest-page">
      <TopBar projectName={projectName} step={step} totalSteps={totalSteps} status={status} />
      <div className="kodnest-page__body">
        <div className="kodnest-page__content">
          <ContextHeader headline={headline} subtext={subtext} />
          <div className="kodnest-page__main">
            <PrimaryWorkspace>{children}</PrimaryWorkspace>
            <SecondaryPanel
              stepExplanation={stepExplanation}
              promptText={promptText}
              {...panelActions}
            />
          </div>
        </div>
        <ProofFooter items={proofItems} {...proofHandlers} />
      </div>
    </div>
  );
}
