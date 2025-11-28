'use client';

import React from 'react';

type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'gold';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  /** Badge content */
  children: React.ReactNode;
  /** Visual variant */
  variant?: BadgeVariant;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Optional icon to display before text */
  icon?: React.ReactNode;
  /** Make badge removable with X button */
  onRemove?: () => void;
  /** Additional classes */
  className?: string;
}

/**
 * Badge Component - Practical UI Pattern
 *
 * Use for:
 * - Status indicators
 * - Labels and tags
 * - Counts and notifications
 *
 * Note: Always pair semantic colors (success/warning/error) with icons
 * for accessibility (color-blind users).
 *
 * @example
 * // Status badge
 * <Badge variant="success" icon={<CheckCircleIcon className="w-4 h-4" />}>
 *   Active
 * </Badge>
 *
 * @example
 * // Removable tag
 * <Badge variant="primary" onRemove={() => removeTag(id)}>
 *   JavaScript
 * </Badge>
 */
export function Badge({
  children,
  variant = 'default',
  size = 'md',
  icon,
  onRemove,
  className = '',
}: BadgeProps) {
  // Variant classes
  const variantClasses: Record<BadgeVariant, string> = {
    default: 'bg-bg-elevated text-text-secondary',
    primary: 'bg-navy-100 text-navy-800',
    secondary: 'bg-bg-elevated text-text-secondary',
    success: 'bg-success-light text-success',
    warning: 'bg-warning-light text-warning-dark',
    error: 'bg-error-light text-error',
    info: 'bg-info-light text-navy',
    gold: 'bg-gold-100 text-gold-700',
  };

  // Size classes
  const sizeClasses: Record<BadgeSize, string> = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-xs',
    lg: 'px-4 py-1.5 text-sm',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full font-semibold
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="
            flex-shrink-0 ml-1 -mr-1 p-0.5 rounded-full
            hover:bg-black/10 transition-colors duration-fast
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy
          "
          aria-label="Remove"
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </span>
  );
}

export default Badge;
