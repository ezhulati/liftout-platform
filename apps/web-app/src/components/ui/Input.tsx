'use client';

import React, { forwardRef } from 'react';
import { FormField } from './FormField';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Label text - will be displayed above input */
  label: string;
  /** Field name for htmlFor attribute */
  name: string;
  /** Error message to display ABOVE the input */
  error?: string;
  /** Hint text to display below label, above input */
  hint?: string;
  /** Whether the field is required (adds * indicator) */
  required?: boolean;
  /** Icon to display on the left side of input */
  leftIcon?: React.ReactNode;
  /** Icon to display on the right side of input */
  rightIcon?: React.ReactNode;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Additional container classes */
  containerClassName?: string;
}

/**
 * Input Component - Practical UI Pattern
 *
 * Wraps FormField to provide:
 * - Label above input
 * - Error displayed ABOVE input (not below)
 * - Hint text below label
 * - Required field marking with asterisk
 * - Icon support (left/right)
 * - 48px minimum touch target
 *
 * @example
 * <Input
 *   label="Email address"
 *   name="email"
 *   type="email"
 *   required
 *   error={errors.email?.message}
 *   hint="We'll never share your email"
 * />
 *
 * @example
 * // With icons
 * <Input
 *   label="Search"
 *   name="search"
 *   leftIcon={<MagnifyingGlassIcon className="w-5 h-5" />}
 * />
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      name,
      error,
      hint,
      required = false,
      leftIcon,
      rightIcon,
      size = 'md',
      containerClassName = '',
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    // Size classes for input
    const sizeClasses = {
      sm: 'py-2 text-sm min-h-10',
      md: '', // Uses default 48px from CSS
      lg: 'py-4 text-lg min-h-14',
    };

    // Padding for icons
    const paddingLeft = leftIcon ? 'pl-11' : 'px-4';
    const paddingRight = rightIcon ? 'pr-11' : 'pr-4';

    const inputClasses = [
      'input-field',
      sizeClasses[size],
      paddingLeft,
      paddingRight,
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
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-tertiary">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={name}
            name={name}
            disabled={disabled}
            className={inputClasses}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={error ? `${name}-error` : hint ? `${name}-hint` : undefined}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-text-tertiary">
              {rightIcon}
            </div>
          )}
        </div>
      </FormField>
    );
  }
);

Input.displayName = 'Input';

export default Input;
