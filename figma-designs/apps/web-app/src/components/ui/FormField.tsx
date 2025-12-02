'use client';

import React, { useMemo } from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

interface FormFieldProps {
  /** Label text - will be converted to sentence case */
  label: string;
  /** Field name for htmlFor attribute */
  name: string;
  /** Error message to display ABOVE the input */
  error?: string;
  /** Hint text to display below label, above input */
  hint?: string;
  /** Whether the field is required (adds * indicator) */
  required?: boolean;
  /** The form input element(s) */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

/**
 * FormField Component - Practical UI Pattern
 *
 * Enforces:
 * - Labels above inputs
 * - Errors displayed ABOVE the input (not below)
 * - Hints displayed below label, above input
 * - Sentence case for labels
 * - Required field marking with asterisk (*)
 * - Proper accessibility with htmlFor, aria-describedby, aria-invalid
 *
 * Accessibility Features:
 * - aria-describedby links input to hint and error messages
 * - aria-invalid indicates validation state
 * - role="alert" on error messages for screen reader announcement
 * - aria-required for required fields
 *
 * @example
 * <FormField
 *   label="Team name"
 *   name="teamName"
 *   error={errors.teamName?.message}
 *   hint="Minimum 5 characters"
 *   required
 * >
 *   <input {...register('teamName')} className="input-field" />
 * </FormField>
 */
export function FormField({
  label,
  name,
  error,
  hint,
  required = false,
  children,
  className = '',
}: FormFieldProps) {
  const hintId = `${name}-hint`;
  const errorId = `${name}-error`;

  // Build aria-describedby from hint and error IDs
  const describedBy = useMemo(() => {
    const ids: string[] = [];
    if (hint) ids.push(hintId);
    if (error) ids.push(errorId);
    return ids.length > 0 ? ids.join(' ') : undefined;
  }, [hint, error, hintId, errorId]);

  // Clone children to add accessibility attributes
  const enhancedChildren = useMemo(() => {
    return React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        // Add accessibility attributes to the input element
        const additionalProps: Record<string, unknown> = {};

        if (describedBy) {
          additionalProps['aria-describedby'] = describedBy;
        }
        if (error) {
          additionalProps['aria-invalid'] = true;
        }
        if (required) {
          additionalProps['aria-required'] = true;
        }

        // Only clone if we have props to add
        if (Object.keys(additionalProps).length > 0) {
          return React.cloneElement(child, additionalProps);
        }
      }
      return child;
    });
  }, [children, describedBy, error, required]);

  return (
    <div className={`form-field ${className}`}>
      {/* Label - always above input */}
      <label
        htmlFor={name}
        className={`label-text ${required ? 'label-required' : ''}`}
      >
        {label}
      </label>

      {/* Hint - below label, above input */}
      {hint && (
        <p id={hintId} className="form-field-hint">
          {hint}
        </p>
      )}

      {/* Error - ABOVE input (Practical UI pattern) */}
      {error && (
        <div id={errorId} className="form-field-error" role="alert" aria-live="assertive">
          <ExclamationCircleIcon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      {/* Input field(s) with enhanced accessibility */}
      {enhancedChildren}
    </div>
  );
}

/**
 * RequiredFieldsNote - Shows "* required fields" instruction
 * Place at the top of forms with required fields
 */
export function RequiredFieldsNote() {
  return (
    <p className="form-required-note">
      * required fields
    </p>
  );
}

export default FormField;
