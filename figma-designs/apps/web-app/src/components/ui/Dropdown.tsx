'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface DropdownItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  danger?: boolean;
  divider?: boolean;
}

interface DropdownProps {
  /** Trigger button content */
  trigger: React.ReactNode;
  /** Dropdown menu items */
  items: DropdownItem[];
  /** Alignment of dropdown */
  align?: 'left' | 'right';
  /** Show chevron on trigger */
  showChevron?: boolean;
  /** Additional classes for trigger */
  triggerClassName?: string;
  /** Additional classes for menu */
  menuClassName?: string;
}

/**
 * Dropdown Component - Practical UI Pattern
 *
 * Features:
 * - Click outside closes
 * - Escape key closes
 * - Keyboard navigation
 * - 48px touch targets for items
 *
 * @example
 * <Dropdown
 *   trigger={<span>Actions</span>}
 *   items={[
 *     { id: 'edit', label: 'Edit', icon: <PencilIcon />, onClick: handleEdit },
 *     { id: 'divider', divider: true },
 *     { id: 'delete', label: 'Delete', danger: true, onClick: handleDelete },
 *   ]}
 * />
 */
export function Dropdown({
  trigger,
  items,
  align = 'left',
  showChevron = true,
  triggerClassName = '',
  menuClassName = '',
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    const focusableItems = items.filter((item) => !item.divider && !item.disabled);
    const currentIndex = focusableItems.findIndex(
      (item) => document.activeElement?.id === `dropdown-item-${item.id}`
    );

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        const nextIndex = currentIndex < focusableItems.length - 1 ? currentIndex + 1 : 0;
        (menuRef.current?.querySelector(`#dropdown-item-${focusableItems[nextIndex].id}`) as HTMLElement)?.focus();
        break;
      case 'ArrowUp':
        e.preventDefault();
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : focusableItems.length - 1;
        (menuRef.current?.querySelector(`#dropdown-item-${focusableItems[prevIndex].id}`) as HTMLElement)?.focus();
        break;
    }
  };

  return (
    <div ref={dropdownRef} className="relative inline-block" onKeyDown={handleKeyDown}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className={`
          inline-flex items-center gap-2 px-4 min-h-12
          font-medium text-sm rounded-lg
          bg-bg-surface border border-border
          hover:border-border-hover hover:bg-bg-elevated
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy
          transition-colors duration-fast
          ${triggerClassName}
        `}
      >
        {trigger}
        {showChevron && (
          <ChevronDownIcon
            className={`w-4 h-4 transition-transform duration-fast ${isOpen ? 'rotate-180' : ''}`}
          />
        )}
      </button>

      {/* Menu */}
      {isOpen && (
        <div
          ref={menuRef}
          role="menu"
          className={`
            absolute z-50 mt-2 py-1 min-w-[180px]
            bg-bg-surface rounded-lg border border-border shadow-lg
            animate-fade-in
            ${align === 'right' ? 'right-0' : 'left-0'}
            ${menuClassName}
          `}
        >
          {items.map((item) => {
            if (item.divider) {
              return (
                <div
                  key={item.id}
                  className="my-1 border-t border-border"
                  role="separator"
                />
              );
            }

            return (
              <button
                key={item.id}
                id={`dropdown-item-${item.id}`}
                type="button"
                role="menuitem"
                disabled={item.disabled}
                onClick={() => {
                  item.onClick?.();
                  setIsOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 min-h-12
                  text-base text-left transition-colors duration-fast
                  focus-visible:outline-none focus-visible:bg-bg-elevated
                  ${item.danger
                    ? 'text-error hover:bg-error-light'
                    : 'text-text-primary hover:bg-bg-elevated'
                  }
                  ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                {item.icon && (
                  <span className="flex-shrink-0 w-5 h-5">{item.icon}</span>
                )}
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Dropdown;
