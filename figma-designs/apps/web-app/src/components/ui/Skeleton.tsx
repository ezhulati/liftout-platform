'use client';

import React from 'react';

interface SkeletonProps {
  /** Width (CSS value or Tailwind class) */
  width?: string;
  /** Height (CSS value or Tailwind class) */
  height?: string;
  /** Shape variant */
  variant?: 'text' | 'rectangular' | 'circular';
  /** Number of lines (for text variant) */
  lines?: number;
  /** Additional classes */
  className?: string;
}

/**
 * Skeleton Component - Loading Placeholder
 *
 * Use to show loading state while content is being fetched.
 *
 * @example
 * // Text skeleton
 * <Skeleton variant="text" lines={3} />
 *
 * @example
 * // Avatar skeleton
 * <Skeleton variant="circular" width="48px" height="48px" />
 *
 * @example
 * // Card skeleton
 * <Skeleton variant="rectangular" height="200px" />
 */
export function Skeleton({
  width,
  height,
  variant = 'rectangular',
  lines = 1,
  className = '',
}: SkeletonProps) {
  const baseClasses = 'skeleton animate-pulse';

  // Variant-specific classes
  const variantClasses = {
    text: 'h-4 rounded',
    rectangular: 'rounded-lg',
    circular: 'rounded-full',
  };

  // Style for custom dimensions
  const style = {
    width: width || (variant === 'text' ? '100%' : undefined),
    height: height || undefined,
  } as React.CSSProperties;

  if (variant === 'text' && lines > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`${baseClasses} ${variantClasses.text}`}
            style={{
              width: i === lines - 1 ? '75%' : '100%', // Last line shorter
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style as any}
    />
  );
}

/**
 * SkeletonCard - Pre-built card skeleton
 */
export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`card p-6 ${className}`}>
      <div className="flex items-center gap-4 mb-4">
        <Skeleton variant="circular" width="48px" height="48px" />
        <div className="flex-1">
          <Skeleton variant="text" width="60%" className="mb-2" />
          <Skeleton variant="text" width="40%" />
        </div>
      </div>
      <Skeleton variant="text" lines={3} className="mb-4" />
      <div className="flex gap-2">
        <Skeleton width="80px" height="32px" />
        <Skeleton width="80px" height="32px" />
      </div>
    </div>
  );
}

/**
 * SkeletonList - Pre-built list skeleton
 */
export function SkeletonList({
  count = 3,
  className = '',
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton variant="circular" width="40px" height="40px" />
          <div className="flex-1">
            <Skeleton variant="text" width="70%" className="mb-1" />
            <Skeleton variant="text" width="50%" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default Skeleton;
