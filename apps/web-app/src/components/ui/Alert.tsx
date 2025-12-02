'use client';

import React from 'react';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

type AlertVariant = 'success' | 'warning' | 'error' | 'info';

interface AlertProps {
  /** Alert content */
  children: React.ReactNode;
  /** Visual variant - determines color and icon */
  variant: AlertVariant;
  /** Optional title */
  title?: string;
  /** Handler to dismiss alert (shows X button when provided) */
  onDismiss?: () => void;
  /** Additional classes */
  className?: string;
}

/**
 * Alert Component - Practical UI Pattern
 *
 * Features:
 * - Semantic variants with appropriate icons
 * - Optional dismiss button
 * - Accessible with role="alert"
 *
 * Note: Icons are automatically included (Practical UI requirement:
 * never use color alone for meaning).
 *
 * @example
 * <Alert variant="success" title="Success!">
 *   Your changes have been saved.
 * </Alert>
 *
 * @example
 * // Dismissible
 * <Alert variant="warning" onDismiss={() => setShowAlert(false)}>
 *   Your session will expire in 5 minutes.
 * </Alert>
 */
export function Alert({
  children,
  variant,
  title,
  onDismiss,
  className = '',
}: AlertProps) {
  // Variant configurations
  const variants: Record<AlertVariant, { bg: string; border: string; icon: React.ComponentType<{ className?: string }>; iconColor: string }> = {
    success: {
      bg: 'bg-success-light',
      border: 'border-success/20',
      icon: CheckCircleIcon,
      iconColor: 'text-success',
    },
    warning: {
      bg: 'bg-warning-light',
      border: 'border-warning/20',
      icon: ExclamationTriangleIcon,
      iconColor: 'text-warning-dark',
    },
    error: {
      bg: 'bg-error-light',
      border: 'border-error/20',
      icon: XCircleIcon,
      iconColor: 'text-error',
    },
    info: {
      bg: 'bg-info-light',
      border: 'border-navy/20',
      icon: InformationCircleIcon,
      iconColor: 'text-navy',
    },
  };

  const config = variants[variant];
  const Icon = config.icon;

  return (
    <div
      role="alert"
      className={`
        flex gap-3 p-4 rounded-lg border
        ${config.bg} ${config.border}
        ${className}
      `}
    >
      {/* Icon */}
      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${config.iconColor}`} />

      {/* Content */}
      <div className="flex-1 min-w-0">
        {title && (
          <h3 className="font-bold text-text-primary mb-1">{title}</h3>
        )}
        <div className="text-sm text-text-secondary">{children}</div>
      </div>

      {/* Dismiss button */}
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="
            flex-shrink-0 p-1 -m-1 rounded
            text-text-tertiary hover:text-text-primary
            transition-colors duration-fast
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy
            touch-target
          "
          aria-label="Dismiss"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

export default Alert;
