'use client';

import React from 'react';
import { ActivityFeed } from '@/components/activity';
import { BellIcon, FunnelIcon } from '@heroicons/react/24/outline';

export default function ActivityPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">Activity</h1>
          <p className="page-subtitle">
            Track all your recent activity and updates
          </p>
        </div>
        <button className="p-2 rounded-lg border border-border hover:bg-bg-alt transition-colors">
          <BellIcon className="h-5 w-5 text-text-secondary" />
        </button>
      </div>

      {/* Activity Feed Card */}
      <div className="card">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold text-text-primary">Recent Activity</h2>
          <div className="flex items-center gap-2 text-sm text-text-tertiary">
            <FunnelIcon className="h-4 w-4" />
            <span>Filter by type</span>
          </div>
        </div>
        <div className="p-5">
          <ActivityFeed limit={20} showFilter={true} />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card p-4">
          <p className="text-sm text-text-tertiary mb-1">This Week</p>
          <p className="text-xl font-bold text-text-primary">12 activities</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-text-tertiary mb-1">Pending Actions</p>
          <p className="text-xl font-bold text-purple-500">3 items</p>
        </div>
      </div>
    </div>
  );
}
