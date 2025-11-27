'use client';

import React from 'react';
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
 * - Proper accessibility with htmlFor
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
        <p className="form-field-hint">{hint}</p>
      )}

      {/* Error - ABOVE input (Practical UI pattern) */}
      {error && (
        <div className="form-field-error" role="alert">
          <ExclamationCircleIcon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      {/* Input field(s) */}
      {children}
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
