'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

interface LiveRegionContextValue {
  announce: (message: string, priority?: 'polite' | 'assertive') => void;
}

const LiveRegionContext = createContext<LiveRegionContextValue | null>(null);

/**
 * Hook to announce messages to screen readers
 */
export function useLiveAnnounce() {
  const context = useContext(LiveRegionContext);
  if (!context) {
    throw new Error('useLiveAnnounce must be used within LiveRegionProvider');
  }
  return context.announce;
}

interface LiveRegionProviderProps {
  children: React.ReactNode;
}

/**
 * LiveRegionProvider - Accessibility Pattern
 *
 * Provides an ARIA live region for announcing messages to screen readers.
 * Use this to announce dynamic content changes, form submissions,
 * loading states, and other updates that should be conveyed to
 * assistive technology users.
 *
 * Usage:
 *   const announce = useLiveAnnounce();
 *   announce('Form submitted successfully');
 *   announce('Error: Please fill in required fields', 'assertive');
 */
export function LiveRegionProvider({ children }: LiveRegionProviderProps) {
  const [politeMessage, setPoliteMessage] = useState('');
  const [assertiveMessage, setAssertiveMessage] = useState('');

  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (priority === 'assertive') {
      // Clear first to ensure re-announcement of same message
      setAssertiveMessage('');
      setTimeout(() => setAssertiveMessage(message), 50);
    } else {
      setPoliteMessage('');
      setTimeout(() => setPoliteMessage(message), 50);
    }
  }, []);

  // Clear messages after they've been announced
  useEffect(() => {
    if (politeMessage) {
      const timer = setTimeout(() => setPoliteMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [politeMessage]);

  useEffect(() => {
    if (assertiveMessage) {
      const timer = setTimeout(() => setAssertiveMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [assertiveMessage]);

  return (
    <LiveRegionContext.Provider value={{ announce }}>
      {children}
      {/* Polite region - for non-urgent updates */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {politeMessage}
      </div>
      {/* Assertive region - for urgent updates like errors */}
      <div
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      >
        {assertiveMessage}
      </div>
    </LiveRegionContext.Provider>
  );
}
