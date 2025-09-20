'use client';

import { useState } from 'react';
import Link from 'next/link';
import { XMarkIcon, InformationCircleIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { DEMO_CONFIG, shouldShowDemoBanner } from '@/lib/demo-config';

export function DemoBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!shouldShowDemoBanner() || !isVisible) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white relative">
      <div className="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between flex-wrap">
          <div className="w-0 flex-1 flex items-center">
            <span className="flex p-2 rounded-lg bg-blue-800">
              <InformationCircleIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </span>
            <p className="ml-3 font-medium">
              <span className="md:hidden">
                {DEMO_CONFIG.branding.demoTitle} - Explore team hiring
              </span>
              <span className="hidden md:inline">
                <strong>{DEMO_CONFIG.branding.demoTitle}</strong> - {DEMO_CONFIG.branding.demoSubtitle}
              </span>
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Demo Accounts Quick Access */}
            <div className="hidden lg:flex items-center space-x-2 text-sm">
              <span className="opacity-75">Try:</span>
              <Link 
                href="/auth/signin"
                className="bg-white/20 hover:bg-white/30 px-2 py-1 rounded text-xs font-medium transition-colors"
              >
                👤 Individual Demo
              </Link>
              <Link 
                href="/auth/signin" 
                className="bg-white/20 hover:bg-white/30 px-2 py-1 rounded text-xs font-medium transition-colors"
              >
                🏢 Company Demo
              </Link>
            </div>

            {/* Call to Action */}
            <div className="order-3 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto">
              <Link
                href="/auth/signup"
                className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-blue-600 bg-white hover:bg-blue-50 transition-colors"
              >
                Start Free Trial
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="order-2 flex-shrink-0 sm:order-3 sm:ml-3">
            <button
              type="button"
              onClick={() => setIsVisible(false)}
              className="-mr-1 flex p-2 rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-white sm:-mr-2"
            >
              <span className="sr-only">Dismiss</span>
              <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Demo Mode Indicator (shows in corner during demo)
export function DemoModeIndicator() {
  if (!DEMO_CONFIG.enabled) return null;

  return (
    <div className="fixed top-4 right-4 z-50 bg-yellow-100 border border-yellow-300 rounded-lg px-3 py-2 shadow-lg">
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
        <span className="text-yellow-800 text-sm font-medium">DEMO MODE</span>
      </div>
    </div>
  );
}

// Demo Session Timer
export function DemoSessionTimer() {
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes

  if (!DEMO_CONFIG.enabled) return null;

  // You can add countdown logic here if needed

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-gray-900 text-white rounded-lg px-4 py-2 shadow-lg">
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span className="text-sm">Demo Session Active</span>
      </div>
    </div>
  );
}