'use client';

import React, { forwardRef, createContext, useContext } from 'react';

interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

interface RadioGroupContextType {
  name: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const RadioGroupContext = createContext<RadioGroupContextType | null>(null);

interface RadioGroupProps {
  /** Field name for the radio group */
  name: string;
  /** Label for the group */
  label: string;
  /** Currently selected value */
  value: string;
  /** Change handler */
  onChange: (value: string) => void;
  /** Options to display */
  options: RadioOption[];
  /** Error message */
  error?: string;
  /** Hint text */
  hint?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Disable all options */
  disabled?: boolean;
  /** Layout direction */
  direction?: 'vertical' | 'horizontal';
  /** Additional container classes */
  className?: string;
}

/**
 * RadioGroup Component - Practical UI Pattern
 *
 * Use for:
 * - ≤10 mutually exclusive options (use Select for more)
 * - When all options should be visible
 *
 * Features:
 * - Accessible radio group with proper ARIA
 * - Vertical layout (recommended) or horizontal
 * - 48px touch targets
 * - Optional descriptions
 *
 * @example
 * <RadioGroup
 *   name="visibility"
 *   label="Profile visibility"
 *   value={visibility}
 *   onChange={setVisibility}
 *   options={[
 *     { value: 'public', label: 'Public', description: 'Anyone can see' },
 *     { value: 'private', label: 'Private', description: 'Only you can see' },
 *   ]}
 *   required
 * />
 */
export function RadioGroup({
  name,
  label,
  value,
  onChange,
  options,
  error,
  hint,
  required = false,
  disabled = false,
  direction = 'vertical',
  className = '',
}: RadioGroupProps) {
  return (
    <RadioGroupContext.Provider value={{ name, value, onChange, disabled }}>
      <fieldset className={`${className}`} role="radiogroup" aria-required={required}>
        {/* Label */}
        <legend className={`label-text mb-2 ${required ? 'label-required' : ''}`}>
          {label}
        </legend>

        {/* Hint */}
        {hint && (
          <p className="text-sm text-text-tertiary mb-3">{hint}</p>
        )}

        {/* Error - above options */}
        {error && (
          <p className="text-sm text-error mb-3" role="alert">
            {error}
          </p>
        )}

        {/* Options */}
        <div
          className={`
            flex gap-3
            ${direction === 'vertical' ? 'flex-col' : 'flex-row flex-wrap'}
          `}
        >
          {options.map((option) => (
            <RadioOption
              key={option.value}
              value={option.value}
              label={option.label}
              description={option.description}
              disabled={option.disabled || disabled}
            />
          ))}
        </div>
      </fieldset>
    </RadioGroupContext.Provider>
  );
}

interface RadioOptionProps {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

/**
 * Individual Radio Option - used within RadioGroup
 */
const RadioOption = forwardRef<HTMLInputElement, RadioOptionProps>(
  ({ value, label, description, disabled = false }, ref) => {
    const context = useContext(RadioGroupContext);
    if (!context) {
      throw new Error('RadioOption must be used within RadioGroup');
    }

    const { name, value: selectedValue, onChange, disabled: groupDisabled } = context;
    const isChecked = selectedValue === value;
    const isDisabled = disabled || groupDisabled;
    const optionId = `${name}-${value}`;

    return (
      <label
        htmlFor={optionId}
        className={`
          flex items-start gap-3 cursor-pointer
          min-h-[48px] py-2 px-3 rounded-lg
          border transition-all duration-fast
          ${isChecked ? 'border-navy bg-navy-50' : 'border-border hover:border-border-hover'}
          ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {/* Custom radio circle */}
        <div className="relative flex items-center justify-center flex-shrink-0 mt-0.5">
          <input
            ref={ref}
            type="radio"
            id={optionId}
            name={name}
            value={value}
            checked={isChecked}
            onChange={() => onChange(value)}
            disabled={isDisabled}
            className="peer sr-only"
          />
          <div
            className={`
              w-5 h-5 rounded-full border-2 transition-all duration-fast
              flex items-center justify-center
              ${isChecked ? 'border-navy' : 'border-border'}
              peer-focus-visible:ring-2 peer-focus-visible:ring-navy peer-focus-visible:ring-offset-2
              peer-hover:border-border-hover
            `}
          >
            <div
              className={`
                w-2.5 h-2.5 rounded-full bg-navy transition-transform duration-fast
                ${isChecked ? 'scale-100' : 'scale-0'}
              `}
            />
          </div>
        </div>

        {/* Label and description */}
        <div className="flex flex-col">
          <span className="text-base text-text-primary font-medium">
            {label}
          </span>
          {description && (
            <span className="text-sm text-text-tertiary mt-0.5">
              {description}
            </span>
          )}
        </div>
      </label>
    );
  }
);

RadioOption.displayName = 'RadioOption';

export default RadioGroup;
