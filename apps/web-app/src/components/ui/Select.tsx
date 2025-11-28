'use client';

import React, { forwardRef } from 'react';
import { FormField } from './FormField';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  /** Label text - will be displayed above select */
  label: string;
  /** Field name for htmlFor attribute */
  name: string;
  /** Options to display in the select */
  options: SelectOption[];
  /** Placeholder text for empty state */
  placeholder?: string;
  /** Error message to display ABOVE the input */
  error?: string;
  /** Hint text to display below label, above input */
  hint?: string;
  /** Whether the field is required (adds * indicator) */
  required?: boolean;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Additional container classes */
  containerClassName?: string;
}

/**
 * Select Component - Practical UI Pattern
 *
 * Use for:
 * - More than 10 options (use Radio for ≤10)
 * - When users need to pick from a predefined list
 *
 * Features:
 * - Native select with custom styling
 * - Label above select
 * - Error displayed ABOVE input
 * - 48px minimum touch target
 * - Custom chevron icon
 *
 * @example
 * <Select
 *   label="Industry"
 *   name="industry"
 *   placeholder="Select an industry"
 *   options={[
 *     { value: 'tech', label: 'Technology' },
 *     { value: 'finance', label: 'Finance' },
 *   ]}
 *   required
 * />
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      name,
      options,
      placeholder = 'Select an option',
      error,
      hint,
      required = false,
      size = 'md',
      containerClassName = '',
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    // Size classes for select
    const sizeClasses = {
      sm: 'py-2 text-sm min-h-[40px]',
      md: '', // Uses default 48px from CSS
      lg: 'py-4 text-lg min-h-[56px]',
    };

    const selectClasses = [
      'input-field',
      sizeClasses[size],
      error ? 'input-field-error' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <FormField
        label={label}
        name={name}
        error={error}
        hint={hint}
        required={required}
        className={containerClassName}
      >
        <select
          ref={ref}
          id={name}
          name={name}
          disabled={disabled}
          className={selectClasses}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${name}-error` : hint ? `${name}-hint` : undefined}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
      </FormField>
    );
  }
);

Select.displayName = 'Select';

export default Select;
