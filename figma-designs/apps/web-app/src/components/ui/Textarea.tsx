'use client';

import React, { forwardRef, useState, useEffect } from 'react';
import { FormField } from './FormField';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Label text - will be displayed above textarea */
  label: string;
  /** Field name for htmlFor attribute */
  name: string;
  /** Error message to display ABOVE the input */
  error?: string;
  /** Hint text to display below label, above input */
  hint?: string;
  /** Whether the field is required (adds * indicator) */
  required?: boolean;
  /** Maximum character count (shows counter when set) */
  maxLength?: number;
  /** Show character count */
  showCharCount?: boolean;
  /** Auto-resize based on content */
  autoResize?: boolean;
  /** Minimum number of rows */
  minRows?: number;
  /** Maximum number of rows for auto-resize */
  maxRows?: number;
  /** Additional container classes */
  containerClassName?: string;
}

/**
 * Textarea Component - Practical UI Pattern
 *
 * Features:
 * - Label above textarea
 * - Error displayed ABOVE input
 * - Optional character count
 * - Optional auto-resize
 * - 48px minimum touch target
 *
 * @example
 * <Textarea
 *   label="Description"
 *   name="description"
 *   hint="Minimum 50 characters"
 *   maxLength={500}
 *   showCharCount
 *   required
 * />
 *
 * @example
 * // Auto-resize
 * <Textarea
 *   label="Cover letter"
 *   name="coverLetter"
 *   autoResize
 *   minRows={3}
 *   maxRows={10}
 * />
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      name,
      error,
      hint,
      required = false,
      maxLength,
      showCharCount = false,
      autoResize = false,
      minRows = 3,
      maxRows = 10,
      containerClassName = '',
      className = '',
      disabled,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const [charCount, setCharCount] = useState(0);
    const [internalValue, setInternalValue] = useState(value || '');

    // Update char count when value changes
    useEffect(() => {
      const val = (value !== undefined ? value : internalValue) as string;
      setCharCount(val.length);
    }, [value, internalValue]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (value === undefined) {
        setInternalValue(e.target.value);
      }
      setCharCount(e.target.value.length);
      onChange?.(e);

      // Auto-resize logic
      if (autoResize) {
        const textarea = e.target;
        textarea.style.height = 'auto';
        const lineHeight = parseInt(getComputedStyle(textarea).lineHeight) || 24;
        const minHeight = lineHeight * minRows;
        const maxHeight = lineHeight * maxRows;
        const scrollHeight = textarea.scrollHeight;
        textarea.style.height = `${Math.min(Math.max(scrollHeight, minHeight), maxHeight)}px`;
      }
    };

    const textareaClasses = [
      'input-field',
      error ? 'input-field-error' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const isOverLimit = maxLength && charCount > maxLength;

    return (
      <FormField
        label={label}
        name={name}
        error={error}
        hint={hint}
        required={required}
        className={containerClassName}
      >
        <div className="relative">
          <textarea
            ref={ref}
            id={name}
            name={name}
            disabled={disabled}
            rows={minRows}
            maxLength={maxLength}
            value={value !== undefined ? value : internalValue}
            onChange={handleChange}
            className={textareaClasses}
            style={autoResize ? { resize: 'none', overflow: 'hidden' } as React.CSSProperties : undefined}
            {...props}
          />
          {(showCharCount || maxLength) && (
            <div
              className={`absolute bottom-2 right-3 text-xs ${
                isOverLimit ? 'text-error' : 'text-text-tertiary'
              }`}
            >
              {charCount}
              {maxLength && `/${maxLength}`}
            </div>
          )}
        </div>
      </FormField>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
