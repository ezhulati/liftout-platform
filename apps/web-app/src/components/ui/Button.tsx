'use client';

import React, { forwardRef } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant - Primary should be ONE per screen */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Loading state - shows spinner and disables button */
  isLoading?: boolean;
  /** Icon to display before text */
  leftIcon?: React.ReactNode;
  /** Icon to display after text */
  rightIcon?: React.ReactNode;
  /** Make button full width */
  fullWidth?: boolean;
  /** Button content */
  children: React.ReactNode;
}

/**
 * Button Component - Practical UI Pattern
 *
 * Button Hierarchy (use only ONE primary per screen):
 * - primary: Solid navy fill - for the MOST important action
 * - secondary: Solid gold fill - for prominent secondary actions
 * - outline: Navy border only - for alternative actions
 * - ghost: Minimal styling - for less prominent actions
 * - danger: Red solid fill - for destructive actions
 *
 * Features:
 * - 48px minimum touch target (Practical UI)
 * - Loading state with spinner
 * - Icon support (left/right)
 * - Full width option
 * - Proper focus states
 *
 * @example
 * // Primary action
 * <Button variant="primary">Create team</Button>
 *
 * @example
 * // With loading state
 * <Button variant="primary" isLoading>Saving...</Button>
 *
 * @example
 * // With icon
 * <Button variant="outline" leftIcon={<PlusIcon className="w-5 h-5" />}>
 *   Add member
 * </Button>
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      className = '',
      children,
      type = 'button',
      ...props
    },
    ref
  ) => {
    // Base variant classes
    const variantClasses = {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      outline: 'btn-outline',
      ghost: 'btn-ghost',
      danger: 'btn-danger',
    };

    // Size classes
    const sizeClasses = {
      sm: 'px-4 py-2 text-sm min-h-[40px]',
      md: '', // Uses default from CSS
      lg: 'px-8 py-4 text-lg min-h-[56px]',
    };

    const baseClass = variantClasses[variant];
    const sizeClass = sizeClasses[size];
    const widthClass = fullWidth ? 'w-full' : '';

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={`${baseClass} ${sizeClass} ${widthClass} ${className}`.trim()}
        {...props}
      >
        {isLoading ? (
          <>
            <LoadingSpinner />
            <span className="ml-2">{children}</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="mr-2 -ml-1">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="ml-2 -mr-1">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

/**
 * Loading spinner for button loading state
 */
function LoadingSpinner() {
  return (
    <svg
      className="animate-spin h-5 w-5"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

export default Button;
