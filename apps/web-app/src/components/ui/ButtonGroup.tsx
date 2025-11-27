'use client';

import React from 'react';

interface ButtonGroupProps {
  /** Button elements - primary button should come FIRST */
  children: React.ReactNode;
  /** Alignment - default is 'left' per Practical UI */
  align?: 'left' | 'right';
  /** Additional CSS classes */
  className?: string;
}

/**
 * ButtonGroup Component - Practical UI Pattern
 *
 * Enforces:
 * - LEFT alignment by default (primary button closest to content)
 * - Primary button should be the FIRST child
 * - Proper spacing between buttons (16px)
 * - Border-top separator for form footers
 *
 * @example
 * // Standard form submission
 * <ButtonGroup>
 *   <button type="submit" className="btn-primary">Create team</button>
 *   <TextLink onClick={handleCancel}>Cancel</TextLink>
 * </ButtonGroup>
 *
 * @example
 * // Multi-step form
 * <ButtonGroup>
 *   <button type="submit" className="btn-primary">Continue</button>
 *   <TextLink onClick={handleBack}>Back</TextLink>
 *   <TextLink onClick={handleSkip}>Skip</TextLink>
 * </ButtonGroup>
 */
export function ButtonGroup({
  children,
  align = 'left',
  className = '',
}: ButtonGroupProps) {
  const alignmentClass = align === 'right' ? 'btn-group-right' : 'btn-group';

  return (
    <div className={`${alignmentClass} ${className}`}>
      {children}
    </div>
  );
}

export default ButtonGroup;
