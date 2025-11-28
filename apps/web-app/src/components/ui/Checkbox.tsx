'use client';

import React, { forwardRef } from 'react';
import { CheckIcon } from '@heroicons/react/24/solid';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Label text for the checkbox */
  label: string;
  /** Optional description below the label */
  description?: string;
  /** Error message */
  error?: string;
  /** Additional container classes */
  containerClassName?: string;
}

/**
 * Checkbox Component - Practical UI Pattern
 *
 * Features:
 * - Accessible checkbox with visible label
 * - 48px touch target wrapper
 * - Optional description text
 * - Custom styled checkbox (not native)
 * - Proper focus states
 *
 * Use for:
 * - Single boolean toggles that require form submission
 * - Multiple selections from a list
 * - Opt-in confirmations
 *
 * @example
 * <Checkbox
 *   name="terms"
 *   label="I agree to the terms and conditions"
 *   required
 * />
 *
 * @example
 * // With description
 * <Checkbox
 *   name="marketing"
 *   label="Send me updates"
 *   description="Receive weekly newsletter about new opportunities"
 * />
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      description,
      error,
      containerClassName = '',
      className = '',
      disabled,
      checked,
      id,
      name,
      ...props
    },
    ref
  ) => {
    const inputId = id || name;

    return (
      <div className={`relative ${containerClassName}`}>
        <label
          htmlFor={inputId}
          className={`
            flex items-start gap-3 cursor-pointer
            min-h-[48px] py-2
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {/* Custom checkbox */}
          <div className="relative flex items-center justify-center flex-shrink-0">
            <input
              ref={ref}
              type="checkbox"
              id={inputId}
              name={name}
              checked={checked}
              disabled={disabled}
              className={`
                peer sr-only
                ${className}
              `}
              aria-invalid={error ? 'true' : undefined}
              aria-describedby={description ? `${inputId}-description` : undefined}
              {...props}
            />
            <div
              className={`
                w-5 h-5 rounded border-2 transition-all duration-fast
                flex items-center justify-center
                ${error ? 'border-error' : 'border-border'}
                peer-checked:bg-navy peer-checked:border-navy
                peer-focus-visible:ring-2 peer-focus-visible:ring-navy peer-focus-visible:ring-offset-2
                peer-hover:border-border-hover
                peer-disabled:opacity-50 peer-disabled:cursor-not-allowed
              `}
            >
              <CheckIcon
                className={`
                  w-3 h-3 text-white transition-opacity duration-fast
                  ${checked ? 'opacity-100' : 'opacity-0'}
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
              <span
                id={`${inputId}-description`}
                className="text-sm text-text-tertiary mt-0.5"
              >
                {description}
              </span>
            )}
          </div>
        </label>

        {/* Error message */}
        {error && (
          <p className="mt-1 text-sm text-error" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
