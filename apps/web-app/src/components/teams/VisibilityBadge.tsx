'use client';

import {
  GlobeAltIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline';

type VisibilityMode = 'public' | 'anonymous' | 'private';

interface VisibilityBadgeProps {
  visibility?: VisibilityMode;
  isAnonymous?: boolean;
  /**
   * Whether to show the full label or just icon
   */
  compact?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
}

const visibilityConfig: Record<VisibilityMode, {
  label: string;
  shortLabel: string;
  Icon: React.ComponentType<{ className?: string }>;
  className: string;
}> = {
  public: {
    label: 'Public profile',
    shortLabel: 'Public',
    Icon: GlobeAltIcon,
    className: 'bg-green-50 text-green-700 border-green-200',
  },
  anonymous: {
    label: 'Anonymous',
    shortLabel: 'Anonymous',
    Icon: ShieldCheckIcon,
    className: 'bg-purple-50 text-purple-700 border-purple-200',
  },
  private: {
    label: 'Private',
    shortLabel: 'Private',
    Icon: LockClosedIcon,
    className: 'bg-gray-50 text-gray-600 border-gray-200',
  },
};

/**
 * Shows visibility mode of a team profile.
 * For anonymous teams, displays a shield icon indicating protected identity.
 */
export function VisibilityBadge({
  visibility = 'public',
  isAnonymous = false,
  compact = false,
  className = '',
}: VisibilityBadgeProps) {
  // Determine effective visibility
  const effectiveVisibility: VisibilityMode = isAnonymous ? 'anonymous' : visibility;
  const config = visibilityConfig[effectiveVisibility];
  const { Icon, label, shortLabel } = config;

  if (compact) {
    return (
      <span
        className={`inline-flex items-center justify-center w-6 h-6 rounded ${config.className} ${className}`}
        title={label}
        aria-label={label}
      >
        <Icon className="h-4 w-4" />
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded border ${config.className} ${className}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {shortLabel}
    </span>
  );
}

/**
 * Shows "Verified" badge for teams that have completed verification
 */
export function VerifiedBadge({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded bg-blue-50 text-blue-700 border border-blue-200 ${className}`}
    >
      <ShieldCheckIcon className="h-3.5 w-3.5" />
      Verified
    </span>
  );
}

/**
 * Shows "Anonymized" indicator when viewing an anonymous team's data
 */
export function AnonymizedIndicator({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded bg-purple-100 text-purple-800 ${className}`}
    >
      <EyeSlashIcon className="h-3.5 w-3.5" />
      Identity hidden
    </span>
  );
}
