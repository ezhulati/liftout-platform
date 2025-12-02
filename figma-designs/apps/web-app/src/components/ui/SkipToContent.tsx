'use client';

import React from 'react';

interface SkipToContentProps {
  /** ID of the main content element to skip to */
  contentId?: string;
  /** Custom label for the skip link */
  label?: string;
}

/**
 * SkipToContent Component - Accessibility Pattern
 *
 * Provides a skip link for keyboard users to bypass navigation
 * and jump directly to the main content area.
 *
 * This link is visually hidden until focused, making it invisible
 * to mouse users but accessible to keyboard and screen reader users.
 */
export function SkipToContent({
  contentId = 'main-content',
  label = 'Skip to main content',
}: SkipToContentProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById(contentId);
    if (element) {
      element.focus();
      element.scrollIntoView();
    }
  };

  return (
    <a
      href={`#${contentId}`}
      onClick={handleClick}
      className="
        sr-only focus:not-sr-only
        focus:fixed focus:top-4 focus:left-4 focus:z-[9999]
        focus:px-4 focus:py-2
        focus:bg-brand-navy focus:text-white
        focus:rounded-md focus:shadow-lg
        focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2
        font-medium text-sm
        transition-none
      "
    >
      {label}
    </a>
  );
}
