'use client';

import React from 'react';
import { FolderOpenIcon } from '@heroicons/react/24/outline';

interface EmptyStateProps {
  /** Title text */
  title: string;
  /** Description text */
  description?: string;
  /** Custom icon (defaults to folder icon) */
  icon?: React.ReactNode;
  /** Primary action button */
  action?: React.ReactNode;
  /** Secondary action */
  secondaryAction?: React.ReactNode;
  /** Additional classes */
  className?: string;
}

/**
 * EmptyState Component - Practical UI Pattern
 *
 * Use to show when a list or container has no content.
 * Always provide a clear action for users to take.
 *
 * @example
 * <EmptyState
 *   title="No teams yet"
 *   description="Create your first team to get started with Liftout."
 *   action={
 *     <Button variant="primary" onClick={() => router.push('/teams/create')}>
 *       Create team
 *     </Button>
 *   }
 * />
 *
 * @example
 * // Custom icon
 * <EmptyState
 *   icon={<SearchIcon className="w-12 h-12" />}
 *   title="No results found"
 *   description="Try adjusting your search or filters."
 *   secondaryAction={
 *     <TextLink onClick={clearFilters}>Clear filters</TextLink>
 *   }
 * />
 */
export function EmptyState({
  title,
  description,
  icon,
  action,
  secondaryAction,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`
        flex flex-col items-center justify-center text-center
        py-12 px-6
        ${className}
      `}
    >
      {/* Icon */}
      <div className="mb-4 text-text-tertiary">
        {icon || <FolderOpenIcon className="w-12 h-12" />}
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-text-primary mb-2">
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className="text-base text-text-secondary max-w-sm mb-6">
          {description}
        </p>
      )}

      {/* Actions */}
      {(action || secondaryAction) && (
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {action}
          {secondaryAction}
        </div>
      )}
    </div>
  );
}

export default EmptyState;
