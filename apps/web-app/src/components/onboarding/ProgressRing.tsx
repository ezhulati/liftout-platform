'use client';

import { useEffect, useState } from 'react';
import { CheckIcon, SparklesIcon } from '@heroicons/react/24/solid';

interface ProgressRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  showMilestones?: boolean;
  animate?: boolean;
}

const MILESTONES = [
  { threshold: 25, label: 'Great start!', icon: SparklesIcon },
  { threshold: 50, label: 'Halfway there!', icon: SparklesIcon },
  { threshold: 75, label: 'Almost done!', icon: SparklesIcon },
  { threshold: 100, label: "You're all set!", icon: CheckIcon },
];

export function ProgressRing({
  percentage,
  size = 80,
  strokeWidth = 8,
  showMilestones = true,
  animate = true,
}: ProgressRingProps) {
  const [displayPercentage, setDisplayPercentage] = useState(0);

  // Animate the percentage on mount
  useEffect(() => {
    if (!animate) {
      setDisplayPercentage(percentage);
      return;
    }

    const timer = setTimeout(() => {
      setDisplayPercentage(percentage);
    }, 100);

    return () => clearTimeout(timer);
  }, [percentage, animate]);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (displayPercentage / 100) * circumference;

  // Find current milestone
  const currentMilestone = MILESTONES.filter(m => percentage >= m.threshold).pop();
  const nextMilestone = MILESTONES.find(m => percentage < m.threshold);

  // Color based on progress
  const getColor = () => {
    if (percentage >= 100) return '#10b981'; // green
    if (percentage >= 75) return '#059669'; // darker green
    if (percentage >= 50) return '#0ea5e9'; // blue
    return '#1e293b'; // navy (default)
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Progress Ring */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          className="transform -rotate-90"
          width={size}
          height={size}
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="none"
            className="text-border"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            stroke={getColor()}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex items-center justify-center">
          {percentage >= 100 ? (
            <CheckIcon className="w-8 h-8 text-green-500" />
          ) : (
            <span className="text-lg font-bold text-text-primary">
              {Math.round(displayPercentage)}%
            </span>
          )}
        </div>

        {/* Celebration effect at 100% */}
        {percentage >= 100 && (
          <div className="absolute inset-0 animate-ping opacity-30">
            <svg width={size} height={size}>
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                strokeWidth={2}
                stroke="#10b981"
                fill="none"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Milestone indicator */}
      {showMilestones && currentMilestone && (
        <div className="flex items-center gap-1.5 text-sm font-medium animate-fadeIn">
          <currentMilestone.icon className="w-4 h-4 text-gold" />
          <span className="text-text-primary">{currentMilestone.label}</span>
        </div>
      )}

      {/* Next milestone hint */}
      {showMilestones && nextMilestone && percentage < 100 && (
        <p className="text-xs text-text-tertiary">
          {nextMilestone.threshold - percentage}% to "{nextMilestone.label}"
        </p>
      )}
    </div>
  );
}

// Compact version for sidebar/header
export function ProgressRingCompact({
  percentage,
  size = 32,
  strokeWidth = 4,
}: {
  percentage: number;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="none"
          className="text-border"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke={percentage >= 100 ? '#10b981' : '#1e293b'}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold text-text-primary">
          {Math.round(percentage)}%
        </span>
      </div>
    </div>
  );
}
