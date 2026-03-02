import { useState } from 'react';
import { PageLayout } from './components/layout';
import { Card, Button, Input, Badge, EmptyState, ErrorState } from './components/ui';

function App() {
  const [proofItems, setProofItems] = useState([
    { id: 'ui', label: 'UI Built', checked: false },
    { id: 'logic', label: 'Logic Working', checked: false },
    { id: 'test', label: 'Test Passed', checked: false },
    { id: 'deploy', label: 'Deployed', checked: false },
  ]);

  const handleToggle = (id: string, checked: boolean) => {
    setProofItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked } : item
      )
    );
  };

  return (
    <PageLayout
      projectName="KodNest Premium Build System"
      step={1}
      totalSteps={5}
      status="In Progress"
      headline="Design System Showcase"
      subtext="Demonstrating layout structure, components, and patterns. No product features."
      stepExplanation="This page validates the design system. All components follow the same rules: calm, intentional, coherent."
      promptText="npm run dev"
      proofItems={proofItems}
      panelActions={{
        onCopyPrompt: () => navigator.clipboard.writeText('npm run dev'),
        onBuildInLovable: () => {},
        onItWorked: () => {},
        onError: () => {},
        onAddScreenshot: () => {},
      }}
      proofHandlers={{
        onToggle: handleToggle,
      }}
    >
      <div className="kodnest-workspace__content">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <Card>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-title)', marginBottom: 'var(--space-2)' }}>
              Buttons
            </h3>
            <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="primary" size="sm">Small Primary</Button>
              <Button variant="secondary" size="sm">Small Secondary</Button>
            </div>
          </Card>

          <Card>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-title)', marginBottom: 'var(--space-2)' }}>
              Inputs
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', maxWidth: 360 }}>
              <Input label="Label" placeholder="Placeholder" />
              <Input label="With hint" hint="This helps you understand the field." />
              <Input label="With error" error="This explains what went wrong and how to fix it." />
            </div>
          </Card>

          <Card>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-title)', marginBottom: 'var(--space-2)' }}>
              Badges
            </h3>
            <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
              <Badge variant="default">Default</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
            </div>
          </Card>

          <Card>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-title)', marginBottom: 'var(--space-2)' }}>
              Empty State
            </h3>
            <EmptyState
              title="No items yet"
              description="Add your first item to get started. This provides the next action."
              actionLabel="Add Item"
              onAction={() => {}}
            />
          </Card>

          <Card>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-title)', marginBottom: 'var(--space-2)' }}>
              Error State
            </h3>
            <ErrorState
              title="Something went wrong"
              message="The request could not be completed."
              fixSuggestion="Check your connection and try again. If the issue persists, contact support."
              actionLabel="Try Again"
              onAction={() => {}}
            />
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}

export default App;
