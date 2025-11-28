'use client';

import React, { createContext, useContext, useState } from 'react';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface TabsContextType {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const TabsContext = createContext<TabsContextType | null>(null);

interface TabsProps {
  /** Available tabs */
  tabs: Tab[];
  /** Currently active tab ID */
  activeTab?: string;
  /** Change handler */
  onChange?: (tabId: string) => void;
  /** Tab panel content - keyed by tab ID */
  children: React.ReactNode;
  /** Additional classes for tabs container */
  className?: string;
}

/**
 * Tabs Component - Practical UI Pattern
 *
 * Features:
 * - Accessible keyboard navigation
 * - 48px touch targets
 * - Optional icons
 * - Animated indicator
 *
 * @example
 * <Tabs
 *   tabs={[
 *     { id: 'overview', label: 'Overview' },
 *     { id: 'members', label: 'Members' },
 *     { id: 'settings', label: 'Settings' },
 *   ]}
 *   activeTab={activeTab}
 *   onChange={setActiveTab}
 * >
 *   <TabPanel id="overview">Overview content</TabPanel>
 *   <TabPanel id="members">Members content</TabPanel>
 *   <TabPanel id="settings">Settings content</TabPanel>
 * </Tabs>
 */
export function Tabs({
  tabs,
  activeTab: controlledActiveTab,
  onChange,
  children,
  className = '',
}: TabsProps) {
  const [internalActiveTab, setInternalActiveTab] = useState(tabs[0]?.id || '');
  const activeTab = controlledActiveTab ?? internalActiveTab;

  const handleTabChange = (tabId: string) => {
    if (!controlledActiveTab) {
      setInternalActiveTab(tabId);
    }
    onChange?.(tabId);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab: handleTabChange }}>
      <div className={className}>
        {/* Tab list */}
        <div
          role="tablist"
          className="flex border-b border-border"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              disabled={tab.disabled}
              onClick={() => handleTabChange(tab.id)}
              className={`
                relative flex items-center gap-2 px-4 min-h-[48px]
                font-medium text-sm transition-colors duration-fast
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-inset
                ${activeTab === tab.id
                  ? 'text-navy'
                  : 'text-text-tertiary hover:text-text-primary'
                }
                ${tab.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {tab.icon}
              {tab.label}
              {/* Active indicator */}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-navy" />
              )}
            </button>
          ))}
        </div>

        {/* Tab panels */}
        <div className="pt-4">
          {children}
        </div>
      </div>
    </TabsContext.Provider>
  );
}

interface TabPanelProps {
  /** Panel ID (must match tab ID) */
  id: string;
  /** Panel content */
  children: React.ReactNode;
  /** Additional classes */
  className?: string;
}

/**
 * TabPanel - Content container for each tab
 */
export function TabPanel({ id, children, className = '' }: TabPanelProps) {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('TabPanel must be used within Tabs');
  }

  const isActive = context.activeTab === id;

  if (!isActive) return null;

  return (
    <div
      role="tabpanel"
      id={`panel-${id}`}
      aria-labelledby={`tab-${id}`}
      className={className}
    >
      {children}
    </div>
  );
}

export default Tabs;
