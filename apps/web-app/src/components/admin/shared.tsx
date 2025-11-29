'use client';

import Link from 'next/link';
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon,
  FlagIcon,
  UserGroupIcon,
  BriefcaseIcon,
  ChatBubbleLeftRightIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

// ============================================
// UTILITY FUNCTIONS
// ============================================

export function formatTimeAgo(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
}

// ============================================
// STAT CARD
// ============================================

export type StatCardColor = 'gray' | 'red' | 'yellow' | 'green' | 'blue';

const STAT_CARD_COLORS: Record<StatCardColor, { bg: string; icon: string }> = {
  gray: { bg: 'bg-gray-800 border-gray-700', icon: 'text-gray-400' },
  red: { bg: 'bg-red-900/20 border-red-800/50', icon: 'text-red-400' },
  yellow: { bg: 'bg-yellow-900/20 border-yellow-800/50', icon: 'text-yellow-400' },
  green: { bg: 'bg-green-900/20 border-green-800/50', icon: 'text-green-400' },
  blue: { bg: 'bg-blue-900/20 border-blue-800/50', icon: 'text-blue-400' },
};

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  change?: string;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  color?: StatCardColor;
}

export function StatCard({
  title,
  value,
  subtitle,
  change,
  changeType,
  icon: Icon,
  href,
  color = 'gray',
}: StatCardProps) {
  const colorConfig = STAT_CARD_COLORS[color];

  const Content = () => (
    <div className={`rounded-xl border p-6 ${colorConfig.bg}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400">{title}</p>
          <p className="mt-2 text-3xl font-bold text-white">{value}</p>
          {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
          {change && (
            <div className="mt-2 flex items-center gap-1">
              {changeType === 'increase' && (
                <ArrowTrendingUpIcon className="h-4 w-4 text-green-400" />
              )}
              {changeType === 'decrease' && (
                <ArrowTrendingDownIcon className="h-4 w-4 text-red-400" />
              )}
              <span
                className={`text-sm ${
                  changeType === 'increase'
                    ? 'text-green-400'
                    : changeType === 'decrease'
                      ? 'text-red-400'
                      : 'text-gray-400'
                }`}
              >
                {change}
              </span>
            </div>
          )}
        </div>
        <div className={`rounded-lg p-3 ${colorConfig.bg}`}>
          <Icon className={`h-6 w-6 ${colorConfig.icon}`} />
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block hover:opacity-90 transition-opacity">
        <Content />
      </Link>
    );
  }

  return <Content />;
}

// ============================================
// COMPACT STAT CARD (for inline grids)
// ============================================

interface CompactStatCardProps {
  title: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
  iconBgClass?: string;
  iconColorClass?: string;
}

export function CompactStatCard({
  title,
  value,
  icon: Icon,
  iconBgClass = 'bg-gray-500/10',
  iconColorClass = 'text-gray-400',
}: CompactStatCardProps) {
  return (
    <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-4">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${iconBgClass}`}>
          <Icon className={`h-5 w-5 ${iconColorClass}`} />
        </div>
        <div>
          <p className="text-2xl font-bold text-white">{value}</p>
          <p className="text-sm text-gray-400">{title}</p>
        </div>
      </div>
    </div>
  );
}

// ============================================
// SEVERITY BADGE
// ============================================

export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';

const SEVERITY_CONFIG: Record<SeverityLevel, { label: string; color: string }> = {
  low: { label: 'Low', color: 'bg-gray-500/10 text-gray-400' },
  medium: { label: 'Medium', color: 'bg-yellow-500/10 text-yellow-400' },
  high: { label: 'High', color: 'bg-orange-500/10 text-orange-400' },
  critical: { label: 'Critical', color: 'bg-red-500/10 text-red-400' },
};

interface SeverityBadgeProps {
  severity: SeverityLevel;
}

export function SeverityBadge({ severity }: SeverityBadgeProps) {
  const config = SEVERITY_CONFIG[severity];

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${config.color}`}>
      {severity === 'critical' && <ExclamationTriangleIcon className="h-3 w-3" />}
      {config.label}
    </span>
  );
}

// ============================================
// CONTENT TYPE ICON
// ============================================

export type ContentType = 'team' | 'opportunity' | 'message' | 'profile' | 'user';

const CONTENT_TYPE_ICONS: Record<ContentType, React.ComponentType<{ className?: string }>> = {
  team: UserGroupIcon,
  opportunity: BriefcaseIcon,
  message: ChatBubbleLeftRightIcon,
  profile: UserCircleIcon,
  user: UserCircleIcon,
};

interface ContentTypeIconProps {
  type: string;
  className?: string;
}

export function ContentTypeIcon({ type, className = 'h-5 w-5' }: ContentTypeIconProps) {
  const Icon = CONTENT_TYPE_ICONS[type as ContentType] || FlagIcon;
  return <Icon className={className} />;
}

// ============================================
// SETTING TOGGLE
// ============================================

interface SettingToggleProps {
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
  dangerous?: boolean;
}

export function SettingToggle({
  title,
  description,
  enabled,
  onToggle,
  dangerous = false,
}: SettingToggleProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className={`text-sm font-medium ${dangerous ? 'text-red-400' : 'text-white'}`}>
          {title}
        </p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <button
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          enabled ? (dangerous ? 'bg-red-600' : 'bg-green-600') : 'bg-gray-700'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}

// ============================================
// LOADING SPINNER
// ============================================

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div
      className={`animate-spin rounded-full border-t-2 border-b-2 border-red-500 ${sizeClasses[size]} ${className}`}
    />
  );
}

// ============================================
// EMPTY STATE
// ============================================

interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  iconColorClass?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  iconColorClass = 'text-gray-400',
}: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-12 text-center">
      {Icon && <Icon className={`h-12 w-12 mx-auto mb-3 ${iconColorClass}`} />}
      <p className="text-gray-300 font-medium">{title}</p>
      {description && <p className="text-gray-500 text-sm mt-1">{description}</p>}
    </div>
  );
}

// ============================================
// SECTION CARD
// ============================================

interface SectionCardProps {
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  iconColorClass?: string;
  children: React.ReactNode;
}

export function SectionCard({
  title,
  icon: Icon,
  iconColorClass = 'text-gray-400',
  children,
}: SectionCardProps) {
  return (
    <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6">
      <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        {Icon && <Icon className={`h-5 w-5 ${iconColorClass}`} />}
        {title}
      </h2>
      {children}
    </div>
  );
}

// ============================================
// FILTER BUTTONS
// ============================================

interface FilterButtonsProps<T extends string> {
  options: readonly T[];
  selected: T;
  onChange: (value: T) => void;
  formatLabel?: (value: T) => string;
}

export function FilterButtons<T extends string>({
  options,
  selected,
  onChange,
  formatLabel = (v) => v.charAt(0).toUpperCase() + v.slice(1),
}: FilterButtonsProps<T>) {
  return (
    <div className="flex gap-2">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            selected === option
              ? 'bg-red-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          {formatLabel(option)}
        </button>
      ))}
    </div>
  );
}
