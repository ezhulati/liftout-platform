'use client';

import React from 'react';
import { LockClosedIcon } from '@heroicons/react/24/outline';
import { Tooltip } from './Tooltip';

interface UnavailableActionProps {
  /** Explanation of why action is unavailable */
  reason: string;
  /** Button label text */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

/**
 * UnavailableAction - Alternative to disabled buttons (Practical UI)
 *
 * Instead of graying out buttons (which are hard to see and don't explain why),
 * show a lock icon with tooltip explaining why unavailable and how to enable.
 */
export function UnavailableAction({
  reason,
  children,
  className = ''
}: UnavailableActionProps) {
  return (
    <Tooltip content={reason}>
      <span
        className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md
          font-bold text-text-tertiary bg-bg-elevated border border-border
          cursor-not-allowed min-h-12 ${className}`}
        role="button"
        aria-disabled="true"
        tabIndex={0}
      >
        <LockClosedIcon className="w-4 h-4" aria-hidden="true" />
        {children}
      </span>
    </Tooltip>
  );
}

export default UnavailableAction;
