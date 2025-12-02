'use client';

import React from 'react';
import Link from 'next/link';

interface TextLinkProps {
  /** Link content */
  children: React.ReactNode;
  /** URL for navigation (renders as Next.js Link) */
  href?: string;
  /** Click handler (renders as button) */
  onClick?: () => void;
  /** Visual variant */
  variant?: 'default' | 'danger';
  /** Disabled state */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Button type when rendered as button */
  type?: 'button' | 'submit' | 'reset';
}

/**
 * TextLink Component - Practical UI Tertiary Button Pattern
 *
 * Use for:
 * - Cancel actions (instead of btn-secondary)
 * - Skip actions
 * - Back navigation in multi-step forms
 * - Secondary/tertiary actions that shouldn't compete with primary
 *
 * Features:
 * - No button styling (text only)
 * - Underline on hover
 * - 48px minimum touch target
 * - Proper focus states
 *
 * @example
 * // As a button (for cancel)
 * <TextLink onClick={handleCancel}>Cancel</TextLink>
 *
 * @example
 * // As a navigation link
 * <TextLink href="/auth/signin">Sign in</TextLink>
 *
 * @example
 * // Danger variant (for destructive actions)
 * <TextLink variant="danger" onClick={handleDelete}>Delete</TextLink>
 */
export function TextLink({
  children,
  href,
  onClick,
  variant = 'default',
  disabled = false,
  className = '',
  type = 'button',
}: TextLinkProps) {
  const variantClass = variant === 'danger' ? 'text-link-danger' : 'text-link';
  const combinedClassName = `${variantClass} ${className}`;

  // If href is provided, render as Next.js Link
  if (href) {
    return (
      <Link
        href={href}
        className={combinedClassName}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : undefined}
      >
        {children}
      </Link>
    );
  }

  // Otherwise render as button
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combinedClassName}
    >
      {children}
    </button>
  );
}

export default TextLink;
