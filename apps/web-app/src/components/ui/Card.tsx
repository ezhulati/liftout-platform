'use client';

import React from 'react';

type CardVariant = 'bordered' | 'elevated';

interface CardProps {
  /** Card content */
  children: React.ReactNode;
  /** Visual variant */
  variant?: CardVariant;
  /** Optional header content */
  header?: React.ReactNode;
  /** Optional footer content */
  footer?: React.ReactNode;
  /** Click handler (makes card interactive) */
  onClick?: () => void;
  /** Whether to show hover effects */
  hoverable?: boolean;
  /** Remove padding (for custom content) */
  noPadding?: boolean;
  /** Additional classes */
  className?: string;
}

/**
 * Card Component - Practical UI Pattern
 *
 * Two variants:
 * - bordered: Subtle border, hover darkens border
 * - elevated: Shadow-based, hover lifts card
 *
 * @example
 * <Card>
 *   <h3>Card Title</h3>
 *   <p>Card content goes here.</p>
 * </Card>
 *
 * @example
 * // With header and footer
 * <Card
 *   header={<h3 className="font-semibold">Team Profile</h3>}
 *   footer={<Button variant="primary">View details</Button>}
 * >
 *   <p>Team description...</p>
 * </Card>
 *
 * @example
 * // Clickable card
 * <Card onClick={() => router.push('/details')} hoverable>
 *   <h3>Click me</h3>
 * </Card>
 */
export function Card({
  children,
  variant = 'bordered',
  header,
  footer,
  onClick,
  hoverable = false,
  noPadding = false,
  className = '',
}: CardProps) {
  const isInteractive = onClick || hoverable;

  // Base classes - rounded-lg for standard cards per Practical UI
  const baseClasses = 'bg-bg-surface rounded-lg transition-all duration-base';

  // Variant classes
  const variantClasses = {
    bordered: `
      border border-border
      ${isInteractive ? 'hover:border-border-hover hover:shadow-soft' : ''}
    `,
    elevated: `
      shadow-soft
      ${isInteractive ? 'hover:shadow-lg hover:-translate-y-1' : ''}
    `,
  };

  // Interactive classes
  const interactiveClasses = isInteractive
    ? 'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2'
    : '';

  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      onClick={onClick}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${interactiveClasses}
        ${className}
      `}
      {...(onClick && { type: 'button' })}
    >
      {/* Header */}
      {header && (
        <div className="px-6 py-4 border-b border-border">
          {header}
        </div>
      )}

      {/* Content */}
      <div className={noPadding ? '' : 'p-6'}>
        {children}
      </div>

      {/* Footer */}
      {footer && (
        <div className="px-6 py-4 border-t border-border bg-bg-alt rounded-b-lg">
          {footer}
        </div>
      )}
    </Component>
  );
}

export default Card;
