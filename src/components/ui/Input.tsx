import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Input({ label, error, hint, id, className = '', ...props }: InputProps) {
  const inputId = id ?? `input-${Math.random().toString(36).slice(2)}`;
  return (
    <div className="kodnest-input-wrap">
      {label && (
        <label htmlFor={inputId} className="kodnest-input__label">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`kodnest-input ${error ? 'kodnest-input--error' : ''} ${className}`.trim()}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="kodnest-input__error" role="alert">
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={`${inputId}-hint`} className="kodnest-input__hint">
          {hint}
        </p>
      )}
    </div>
  );
}
