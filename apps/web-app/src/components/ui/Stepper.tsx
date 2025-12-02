'use client';

import React from 'react';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';

interface StepperProps {
  /** Field label */
  label: string;
  /** Field name for accessibility */
  name: string;
  /** Current numeric value */
  value: number;
  /** Change handler */
  onChange: (value: number) => void;
  /** Minimum allowed value */
  min?: number;
  /** Maximum allowed value */
  max?: number;
  /** Increment/decrement step */
  step?: number;
  /** Hint text */
  hint?: string;
  /** Error message */
  error?: string;
  /** Is field required */
  required?: boolean;
  /** Unit label (e.g., "years", "people") */
  unit?: string;
}

/**
 * Stepper Component - Practical UI Pattern
 *
 * Use for small numeric ranges instead of freeform number input.
 * Better UX for bounded values like years of experience, team size, etc.
 */
export function Stepper({
  label,
  name,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  hint,
  error,
  required = false,
  unit,
}: StepperProps) {
  const decrease = () => onChange(Math.max(min, value - step));
  const increase = () => onChange(Math.min(max, value + step));

  const hintId = hint ? `${name}-hint` : undefined;
  const errorId = error ? `${name}-error` : undefined;

  return (
    <div className="form-field">
      <label htmlFor={name} className={`label-text ${required ? 'label-required' : ''}`}>
        {label}
      </label>

      {hint && (
        <p id={hintId} className="form-field-hint">
          {hint}
        </p>
      )}

      {error && (
        <div id={errorId} className="form-field-error" role="alert">
          <span>{error}</span>
        </div>
      )}

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={decrease}
          disabled={value <= min}
          className="btn-outline w-12 h-12 p-0 flex items-center justify-center disabled:opacity-50"
          aria-label={`Decrease ${label}`}
        >
          <MinusIcon className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 min-w-24 justify-center">
          <input
            type="number"
            id={name}
            name={name}
            value={value}
            onChange={(e) => {
              const newValue = Math.max(min, Math.min(max, Number(e.target.value) || min));
              onChange(newValue);
            }}
            min={min}
            max={max}
            className="input-field w-20 text-center"
            aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
            aria-invalid={!!error}
            aria-required={required}
          />
          {unit && <span className="text-text-secondary text-sm">{unit}</span>}
        </div>

        <button
          type="button"
          onClick={increase}
          disabled={value >= max}
          className="btn-outline w-12 h-12 p-0 flex items-center justify-center disabled:opacity-50"
          aria-label={`Increase ${label}`}
        >
          <PlusIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default Stepper;
