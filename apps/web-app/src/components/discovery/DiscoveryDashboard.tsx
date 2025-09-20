'use client';

import { useState } from 'react';
import {
  EyeIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  ShieldCheckIcon,
  LightBulbIcon,
} from '@heroicons/react/24/outline';
import { 
  mockDiscoveryTargets, 
  prioritizeDiscoveryTargets,
  calculateVulnerabilityScore,
  calculateCompetitiveValue,
  type DiscoveryTarget,
  type DiscoverySignal,
} from '@/lib/discovery';

export function DiscoveryDashboard() {
  const [selectedTarget, setSelectedTarget] = useState<DiscoveryTarget | null>(null);
  const [viewMode, setViewMode] = useState<'targets' | 'market' | 'signals'>('targets');
  
  const prioritizedTargets = prioritizeDiscoveryTargets(mockDiscoveryTargets);
  
  const stats = [
    { 
      name: 'Active Targets', 
      value: prioritizedTargets.length, 
      icon: EyeIcon,
      color: 'text-blue-600',
      change: '+3 this month'
    },
    { 
      name: 'High-Value Teams', 
      value: prioritizedTargets.filter(t => t.intelligence && t.intelligence.competitiveValue > 80).length,
      icon: ArrowTrendingUpIcon,
      color: 'text-green-600',
      change: 'Top quartile'
    },
    { 
      name: 'Vulnerable Targets', 
      value: prioritizedTargets.filter(t => t.intelligence && t.intelligence.vulnerabilityScore > 60).length,
      icon: ExclamationTriangleIcon,
      color: 'text-yellow-600',
      change: '2 new signals'
    },
    { 
      name: 'Est. Total Value', 
      value: '$14.7M', 
      icon: CurrencyDollarIcon,
      color: 'text-purple-600',
      change: 'Combined liftout cost'
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Discovery Engine</h1>
          <p className="text-gray-600">Market intelligence and strategic team acquisition tracking</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setViewMode('targets')}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${
              viewMode === 'targets' 
                ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Discovery Targets
          </button>
          <button
            onClick={() => setViewMode('market')}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${
              viewMode === 'market' 
                ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Market Intelligence
          </button>
          <button
            onClick={() => setViewMode('signals')}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${
              viewMode === 'signals' 
                ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Signal Analysis
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div key={item.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <item.icon className={`h-6 w-6 ${item.color}`} aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {item.name}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {item.value}
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-3">
                <span className="text-sm text-gray-500">{item.change}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      {viewMode === 'targets' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Targets List */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Discovery Targets</h3>
                <p className="text-sm text-gray-500">Prioritized by strategic value and acquisition opportunity</p>
              </div>
              <div className="divide-y divide-gray-200">
                {prioritizedTargets.map((target) => (
                  <div
                    key={target.id}
                    className={`p-6 cursor-pointer hover:bg-gray-50 ${
                      selectedTarget?.id === target.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                    }`}
                    onClick={() => setSelectedTarget(target)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h4 className="text-lg font-medium text-gray-900">
                            {target.targetTeam}
                          </h4>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            target.priority === 'critical' ? 'bg-red-100 text-red-800' :
                            target.priority === 'high' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {target.priority}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{target.targetCompany}</p>
                        <p className="text-sm text-gray-500 mt-1">{target.strategicRationale}</p>
                        
                        {target.intelligence && (
                          <div className="flex items-center space-x-6 mt-3">
                            <div className="flex items-center space-x-1">
                              <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500" />
                              <span className="text-sm text-gray-600">
                                {target.intelligence.vulnerabilityScore}% vulnerable
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />
                              <span className="text-sm text-gray-600">
                                {target.intelligence.competitiveValue}% value
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <UserGroupIcon className="h-4 w-4 text-blue-500" />
                              <span className="text-sm text-gray-600">
                                {target.intelligence.size} members
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          ${target.intelligence?.estimatedLiftoutCost.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          ~{target.intelligence?.estimatedTimeToLiftout} days
                        </div>
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                          target.status === 'monitoring' ? 'bg-blue-100 text-blue-800' :
                          target.status === 'researching' ? 'bg-gray-100 text-gray-800' :
                          target.status === 'engaging' ? 'bg-green-100 text-green-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {target.status}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Target Details */}
          <div className="lg:col-span-1">
            {selectedTarget && selectedTarget.intelligence ? (
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Intelligence Report</h3>
                  <p className="text-sm text-gray-500">{selectedTarget.targetTeam}</p>
                </div>
                <div className="p-6 space-y-6">
                  {/* Performance Metrics */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Performance Metrics</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Industry Percentile</span>
                        <span className="text-sm font-medium text-gray-900">
                          {selectedTarget.intelligence.performanceMetrics.industryPercentile}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Revenue Impact</span>
                        <span className="text-sm font-medium text-gray-900">
                          ${selectedTarget.intelligence.performanceMetrics.revenueImpact.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Client Satisfaction</span>
                        <span className="text-sm font-medium text-gray-900">
                          {selectedTarget.intelligence.performanceMetrics.clientSatisfaction}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Market Position */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Market Position</h4>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-gray-600">Industry:</span>
                        <span className="text-sm font-medium text-gray-900 ml-2">
                          {selectedTarget.intelligence.marketPosition.industry}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Market Share:</span>
                        <span className="text-sm font-medium text-gray-900 ml-2">
                          {selectedTarget.intelligence.marketPosition.marketShare}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Recent Signals */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Recent Signals</h4>
                    <div className="space-y-3">
                      {selectedTarget.intelligence.signals.slice(0, 3).map((signal) => (
                        <div key={signal.id} className="border-l-2 border-blue-200 pl-3">
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              signal.strength > 70 ? 'bg-red-100 text-red-800' :
                              signal.strength > 40 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {signal.strength}% strength
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{signal.description}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {signal.source} • {signal.date.toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Next Action */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">Next Action</h4>
                    <p className="text-sm text-blue-700">{selectedTarget.nextAction}</p>
                    <div className="mt-3">
                      <span className="text-xs text-blue-600">
                        Assigned to: {selectedTarget.assignedAnalyst}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white shadow rounded-lg p-6">
                <div className="text-center text-gray-500">
                  <EyeIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Select a target</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Choose a discovery target to view detailed intelligence
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {viewMode === 'market' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Market Trends */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Market Intelligence</h3>
              <p className="text-sm text-gray-500">Industry trends and liftout activity</p>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-4">Financial Services</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Talent Supply</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-red-500 h-2 rounded-full" style={{width: '25%'}}></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">Low</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Talent Demand</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{width: '90%'}}></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">High</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Liftout Activity</span>
                      <div className="flex items-center space-x-2">
                        <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium text-gray-900">+35% YoY</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-4">Management Consulting</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Talent Supply</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-yellow-500 h-2 rounded-full" style={{width: '60%'}}></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">Medium</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Talent Demand</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{width: '75%'}}></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">High</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Liftout Activity</span>
                      <div className="flex items-center space-x-2">
                        <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium text-gray-900">+18% YoY</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Liftouts */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recent Market Activity</h3>
              <p className="text-sm text-gray-500">Notable team acquisitions in target sectors</p>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="p-6">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <UserGroupIcon className="h-6 w-6 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">
                      Credit Suisse → Apollo Global Management
                    </h4>
                    <p className="text-sm text-gray-600">
                      Distressed debt team (8 members) • Est. $12M package
                    </p>
                    <p className="text-xs text-gray-400 mt-1">2 weeks ago</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <UserGroupIcon className="h-6 w-6 text-green-500" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">
                      Deloitte → Palantir Technologies
                    </h4>
                    <p className="text-sm text-gray-600">
                      Government consulting team (12 members) • Est. $18M package
                    </p>
                    <p className="text-xs text-gray-400 mt-1">1 month ago</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <UserGroupIcon className="h-6 w-6 text-purple-500" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">
                      BCG → Meta Platforms
                    </h4>
                    <p className="text-sm text-gray-600">
                      AI strategy team (6 members) • Est. $15M package
                    </p>
                    <p className="text-xs text-gray-400 mt-1">6 weeks ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {viewMode === 'signals' && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Signal Analysis</h3>
            <p className="text-sm text-gray-500">Real-time indicators of liftout opportunities across targets</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Signal Strength Distribution */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-4">Signal Strength Distribution</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Critical (80-100%)</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{width: '15%'}}></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">3 signals</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">High (60-79%)</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{width: '40%'}}></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">8 signals</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Medium (40-59%)</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{width: '60%'}}></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">12 signals</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Low (20-39%)</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{width: '25%'}}></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">5 signals</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Signal Types */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-4">Most Common Signal Types</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm text-gray-600">Leadership Change</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">8 occurrences</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CurrencyDollarIcon className="h-4 w-4 text-red-500" />
                      <span className="text-sm text-gray-600">Compensation Lag</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">6 occurrences</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <UserGroupIcon className="h-4 w-4 text-orange-500" />
                      <span className="text-sm text-gray-600">Talent Exodus</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">5 occurrences</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <ChartBarIcon className="h-4 w-4 text-purple-500" />
                      <span className="text-sm text-gray-600">Growth Constraints</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">4 occurrences</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent High-Priority Signals */}
            <div className="mt-8">
              <h4 className="text-sm font-medium text-gray-900 mb-4">Recent High-Priority Signals</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">Goldman Sachs - QIS Team</p>
                        <span className="text-xs text-gray-500">2 hours ago</span>
                      </div>
                      <p className="text-sm text-gray-600">New division head implementing cost reduction initiatives (75% strength)</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">McKinsey - Healthcare Innovation</p>
                        <span className="text-xs text-gray-500">1 day ago</span>
                      </div>
                      <p className="text-sm text-gray-600">Limited partner track expansion despite strong performance (55% strength)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}