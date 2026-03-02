export type ProofItem = {
  id: string;
  label: string;
  checked: boolean;
  proofInput?: string;
};

interface ProofFooterProps {
  items: ProofItem[];
  onToggle?: (id: string, checked: boolean) => void;
  onProofInput?: (id: string, value: string) => void;
}

export function ProofFooter({ items, onToggle, onProofInput }: ProofFooterProps) {
  return (
    <footer className="kodnest-proof-footer" role="contentinfo">
      <div className="kodnest-proof-footer__checklist">
        {items.map((item) => (
          <div key={item.id} className="kodnest-proof-footer__item">
            <label className="kodnest-proof-footer__label">
              <input
                type="checkbox"
                checked={item.checked}
                onChange={(e) => onToggle?.(item.id, e.target.checked)}
                className="kodnest-proof-footer__checkbox"
              />
              <span>{item.label}</span>
            </label>
            {item.checked && onProofInput && (
              <input
                type="text"
                placeholder="Proof input"
                value={item.proofInput ?? ''}
                onChange={(e) => onProofInput(item.id, e.target.value)}
                className="kodnest-input kodnest-proof-footer__input"
              />
            )}
          </div>
        ))}
      </div>
    </footer>
  );
}
