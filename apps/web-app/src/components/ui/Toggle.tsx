'use client';

import React, { forwardRef } from 'react';

interface ToggleProps {
  /** Label text for the toggle */
  label: string;
  /** Optional description below the label */
  description?: string;
  /** Checked state */
  checked: boolean;
  /** Change handler */
  onChange: (checked: boolean) => void;
  /** Field name */
  name?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Additional container classes */
  className?: string;
}

/**
 * Toggle Component - Practical UI Pattern
 *
 * Use for:
 * - Immediate effect on/off settings (no form submission)
 * - Binary choices that take effect immediately
 *
 * For settings that require form submission, use Checkbox instead.
 *
 * Features:
 * - 48px touch target wrapper
 * - Animated transition
 * - Accessible keyboard support
 * - Optional description
 *
 * @example
 * <Toggle
 *   label="Email notifications"
 *   description="Receive email updates about new opportunities"
 *   checked={emailNotifications}
 *   onChange={setEmailNotifications}
 * />
 */
export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
  (
    {
      label,
      description,
      checked,
      onChange,
      name,
      disabled = false,
      size = 'md',
      className = '',
    },
    ref
  ) => {
    const toggleId = name || `toggle-${label.replace(/\s+/g, '-').toLowerCase()}`;

    // Size configurations
    const sizes = {
      sm: {
        track: 'w-9 h-5',
        thumb: 'w-4 h-4',
        translate: 'translate-x-4',
      },
      md: {
        track: 'w-11 h-6',
        thumb: 'w-5 h-5',
        translate: 'translate-x-5',
      },
      lg: {
        track: 'w-14 h-8',
        thumb: 'w-7 h-7',
        translate: 'translate-x-6',
      },
    };

    const sizeConfig = sizes[size];

    const handleClick = () => {
      if (!disabled) {
        onChange(!checked);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleClick();
      }
    };

    return (
      <div className={`flex items-start gap-4 min-h-[48px] py-2 ${className}`}>
        {/* Toggle switch */}
        <button
          ref={ref}
          type="button"
          role="switch"
          id={toggleId}
          aria-checked={checked}
          aria-label={label}
          disabled={disabled}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          className={`
            relative inline-flex flex-shrink-0 cursor-pointer
            rounded-full transition-colors duration-fast ease-out-quart
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2
            ${sizeConfig.track}
            ${checked ? 'bg-navy' : 'bg-border'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <span
            className={`
              pointer-events-none inline-block rounded-full bg-white shadow-sm
              transition-transform duration-fast ease-out-quart
              ${sizeConfig.thumb}
              ${checked ? sizeConfig.translate : 'translate-x-0.5'}
              ${size === 'sm' ? 'mt-0.5 ml-0.5' : 'mt-0.5'}
            `}
          />
        </button>

        {/* Label and description */}
        <div className="flex flex-col flex-1">
          <label
            htmlFor={toggleId}
            className={`
              text-base text-text-primary font-medium cursor-pointer
              ${disabled ? 'cursor-not-allowed' : ''}
            `}
          >
            {label}
          </label>
          {description && (
            <span className="text-sm text-text-tertiary mt-0.5">
              {description}
            </span>
          )}
        </div>
      </div>
    );
  }
);

Toggle.displayName = 'Toggle';

export default Toggle;
