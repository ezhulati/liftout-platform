'use client';

import { ReactNode } from 'react';

interface DeviceFrameProps {
  children: ReactNode;
  device?: 'laptop' | 'tablet' | 'phone' | 'auto';
  className?: string;
}

/**
 * DeviceFrame - Wraps content in a realistic device bezel
 *
 * 'auto' mode (default): Shows laptop on lg+, tablet on md, phone on sm
 */
export function DeviceFrame({ children, device = 'auto', className = '' }: DeviceFrameProps) {
  if (device === 'auto') {
    return (
      <div className={className}>
        {/* Phone - visible on small screens only */}
        <div className="block md:hidden">
          <PhoneFrame>{children}</PhoneFrame>
        </div>
        {/* Tablet - visible on medium screens only */}
        <div className="hidden md:block lg:hidden">
          <TabletFrame>{children}</TabletFrame>
        </div>
        {/* Laptop - visible on large screens only */}
        <div className="hidden lg:block">
          <LaptopFrame>{children}</LaptopFrame>
        </div>
      </div>
    );
  }

  switch (device) {
    case 'phone':
      return <PhoneFrame className={className}>{children}</PhoneFrame>;
    case 'tablet':
      return <TabletFrame className={className}>{children}</TabletFrame>;
    case 'laptop':
    default:
      return <LaptopFrame className={className}>{children}</LaptopFrame>;
  }
}

function LaptopFrame({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      {/* Laptop body */}
      <div className="bg-[#1a1a1a] rounded-t-xl p-3 pb-0 shadow-2xl">
        {/* Camera/webcam dot */}
        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#2a2a2a] rounded-full" />
        {/* Screen bezel */}
        <div className="bg-[#0a0a0a] rounded-lg overflow-hidden">
          {/* Screen content */}
          <div className="bg-bg-surface">
            {children}
          </div>
        </div>
      </div>
      {/* Laptop base/keyboard area */}
      <div className="relative">
        {/* Hinge */}
        <div className="h-3 bg-gradient-to-b from-[#1a1a1a] to-[#2a2a2a] rounded-b-sm" />
        {/* Base */}
        <div className="h-4 bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] rounded-b-xl mx-[-8px]">
          {/* Trackpad hint */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-20 h-1.5 bg-[#333] rounded-full opacity-30" />
        </div>
      </div>
    </div>
  );
}

function TabletFrame({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      {/* Tablet body */}
      <div className="bg-[#1a1a1a] rounded-[2rem] p-3 shadow-2xl">
        {/* Camera */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#2a2a2a] rounded-full" />
        {/* Screen */}
        <div className="bg-[#0a0a0a] rounded-2xl overflow-hidden">
          <div className="bg-bg-surface">
            {children}
          </div>
        </div>
        {/* Home indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-[#333] rounded-full" />
      </div>
    </div>
  );
}

function PhoneFrame({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative max-w-[320px] mx-auto ${className}`}>
      {/* Phone body */}
      <div className="bg-[#1a1a1a] rounded-[2.5rem] p-2 shadow-2xl">
        {/* Dynamic Island */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-6 bg-[#0a0a0a] rounded-full z-10" />
        {/* Screen */}
        <div className="bg-[#0a0a0a] rounded-[2rem] overflow-hidden">
          <div className="bg-bg-surface pt-8">
            {children}
          </div>
        </div>
        {/* Home indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 bg-[#333] rounded-full" />
      </div>
    </div>
  );
}
