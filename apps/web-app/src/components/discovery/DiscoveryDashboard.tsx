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
      name: 'Active targets',
      value: prioritizedTargets.length,
      icon: EyeIcon,
      color: 'text-navy',
      change: '+3 this month'
    },
    {
      name: 'High-value teams',
      value: prioritizedTargets.filter(t => t.intelligence && t.intelligence.competitiveValue > 80).length,
      icon: ArrowTrendingUpIcon,
      color: 'text-success',
      change: 'Top quartile'
    },
    {
      name: 'Vulnerable targets',
      value: prioritizedTargets.filter(t => t.intelligence && t.intelligence.vulnerabilityScore > 60).length,
      icon: ExclamationTriangleIcon,
      color: 'text-gold',
      change: '2 new signals'
    },
    {
      name: 'Est. total value',
      value: '$14.7M',
      icon: CurrencyDollarIcon,
      color: 'text-gold',
      change: 'Combined liftout cost'
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Team discovery engine</h1>
          <p className="text-text-secondary">Market intelligence and strategic team acquisition tracking</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setViewMode('targets')}
            className={`px-4 py-2 text-sm font-medium rounded-lg min-h-11 ${
              viewMode === 'targets'
                ? 'bg-navy-50 text-navy border border-navy-200'
                : 'text-text-tertiary hover:text-text-primary'
            }`}
          >
            Discovery targets
          </button>
          <button
            onClick={() => setViewMode('market')}
            className={`px-4 py-2 text-sm font-medium rounded-lg min-h-11 ${
              viewMode === 'market'
                ? 'bg-navy-50 text-navy border border-navy-200'
                : 'text-text-tertiary hover:text-text-primary'
            }`}
          >
            Market intelligence
          </button>
          <button
            onClick={() => setViewMode('signals')}
            className={`px-4 py-2 text-sm font-medium rounded-lg min-h-11 ${
              viewMode === 'signals'
                ? 'bg-navy-50 text-navy border border-navy-200'
                : 'text-text-tertiary hover:text-text-primary'
            }`}
          >
            Signal analysis
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div key={item.name} className="card">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <item.icon className={`h-6 w-6 ${item.color}`} aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-text-tertiary truncate">
                      {item.name}
                    </dt>
                    <dd className="text-lg font-medium text-text-primary">
                      {item.value}
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-3">
                <span className="text-sm text-text-tertiary">{item.change}</span>
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
            <div className="card">
              <div className="px-6 py-4 border-b border-border">
                <h3 className="text-lg font-medium text-text-primary">Discovery targets</h3>
                <p className="text-sm text-text-tertiary">Prioritized by strategic value and acquisition opportunity</p>
              </div>
              <div className="divide-y divide-border">
                {prioritizedTargets.map((target) => (
                  <div
                    key={target.id}
                    className={`p-6 cursor-pointer hover:bg-bg-alt ${
                      selectedTarget?.id === target.id ? 'bg-navy-50 border-l-4 border-navy' : ''
                    }`}
                    onClick={() => setSelectedTarget(target)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h4 className="text-lg font-medium text-text-primary">
                            {target.targetTeam}
                          </h4>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            target.priority === 'critical' ? 'bg-error-light text-error-dark' :
                            target.priority === 'high' ? 'bg-gold-100 text-gold-800' :
                            'bg-success-light text-success-dark'
                          }`}>
                            {target.priority}
                          </span>
                        </div>
                        <p className="text-sm text-text-secondary">{target.targetCompany}</p>
                        <p className="text-sm text-text-tertiary mt-1">{target.strategicRationale}</p>

                        {target.intelligence && (
                          <div className="flex items-center space-x-6 mt-3">
                            <div className="flex items-center space-x-1">
                              <ExclamationTriangleIcon className="h-4 w-4 text-gold" />
                              <span className="text-sm text-text-secondary">
                                {target.intelligence.vulnerabilityScore}% vulnerable
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <ArrowTrendingUpIcon className="h-4 w-4 text-success" />
                              <span className="text-sm text-text-secondary">
                                {target.intelligence.competitiveValue}% value
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <UserGroupIcon className="h-4 w-4 text-navy" />
                              <span className="text-sm text-text-secondary">
                                {target.intelligence.size} members
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-text-primary">
                          ${target.intelligence?.estimatedLiftoutCost.toLocaleString()}
                        </div>
                        <div className="text-sm text-text-tertiary">
                          ~{target.intelligence?.estimatedTimeToLiftout} days
                        </div>
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                          target.status === 'monitoring' ? 'bg-navy-50 text-navy-800' :
                          target.status === 'researching' ? 'bg-bg-alt text-text-secondary' :
                          target.status === 'engaging' ? 'bg-success-light text-success-dark' :
                          'bg-gold-100 text-gold-800'
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
              <div className="card">
                <div className="px-6 py-4 border-b border-border">
                  <h3 className="text-lg font-medium text-text-primary">Intelligence report</h3>
                  <p className="text-sm text-text-tertiary">{selectedTarget.targetTeam}</p>
                </div>
                <div className="p-6 space-y-6">
                  {/* Performance Metrics */}
                  <div>
                    <h4 className="text-sm font-medium text-text-primary mb-3">Performance metrics</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-text-secondary">Industry percentile</span>
                        <span className="text-sm font-medium text-text-primary">
                          {selectedTarget.intelligence.performanceMetrics.industryPercentile}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-text-secondary">Revenue impact</span>
                        <span className="text-sm font-medium text-text-primary">
                          ${selectedTarget.intelligence.performanceMetrics.revenueImpact.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-text-secondary">Client satisfaction</span>
                        <span className="text-sm font-medium text-text-primary">
                          {selectedTarget.intelligence.performanceMetrics.clientSatisfaction}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Market Position */}
                  <div>
                    <h4 className="text-sm font-medium text-text-primary mb-3">Market position</h4>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-text-secondary">Industry:</span>
                        <span className="text-sm font-medium text-text-primary ml-2">
                          {selectedTarget.intelligence.marketPosition.industry}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm text-text-secondary">Market share:</span>
                        <span className="text-sm font-medium text-text-primary ml-2">
                          {selectedTarget.intelligence.marketPosition.marketShare}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Recent Signals */}
                  <div>
                    <h4 className="text-sm font-medium text-text-primary mb-3">Recent signals</h4>
                    <div className="space-y-3">
                      {selectedTarget.intelligence.signals.slice(0, 3).map((signal) => (
                        <div key={signal.id} className="border-l-2 border-navy-200 pl-3">
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              signal.strength > 70 ? 'bg-error-light text-error-dark' :
                              signal.strength > 40 ? 'bg-gold-100 text-gold-800' :
                              'bg-success-light text-success-dark'
                            }`}>
                              {signal.strength}% strength
                            </span>
                          </div>
                          <p className="text-sm text-text-secondary mt-1">{signal.description}</p>
                          <p className="text-xs text-text-tertiary mt-1">
                            {signal.source} • {signal.date.toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Next Action */}
                  <div className="bg-navy-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-navy-900 mb-2">Next action</h4>
                    <p className="text-sm text-navy-700">{selectedTarget.nextAction}</p>
                    <div className="mt-3">
                      <span className="text-xs text-navy-600">
                        Assigned to: {selectedTarget.assignedAnalyst}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card p-6">
                <div className="text-center text-text-tertiary">
                  <EyeIcon className="mx-auto h-12 w-12 text-text-tertiary" />
                  <h3 className="mt-2 text-sm font-medium text-text-primary">Select a target</h3>
                  <p className="mt-1 text-sm text-text-tertiary">
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
          <div className="card">
            <div className="px-6 py-4 border-b border-border">
              <h3 className="text-lg font-medium text-text-primary">Market intelligence</h3>
              <p className="text-sm text-text-tertiary">Industry trends and liftout activity</p>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-text-primary mb-4">Financial services</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-text-secondary">Talent supply</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-bg-elevated rounded-full h-2">
                          <div className="bg-error h-2 rounded-full" style={{width: '25%'}}></div>
                        </div>
                        <span className="text-sm font-medium text-text-primary">Low</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-text-secondary">Talent demand</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-bg-elevated rounded-full h-2">
                          <div className="bg-success h-2 rounded-full" style={{width: '90%'}}></div>
                        </div>
                        <span className="text-sm font-medium text-text-primary">High</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-text-secondary">Liftout activity</span>
                      <div className="flex items-center space-x-2">
                        <ArrowTrendingUpIcon className="h-4 w-4 text-success" />
                        <span className="text-sm font-medium text-text-primary">+35% YoY</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-text-primary mb-4">Management consulting</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-text-secondary">Talent supply</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-bg-elevated rounded-full h-2">
                          <div className="bg-gold h-2 rounded-full" style={{width: '60%'}}></div>
                        </div>
                        <span className="text-sm font-medium text-text-primary">Medium</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-text-secondary">Talent demand</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-bg-elevated rounded-full h-2">
                          <div className="bg-success h-2 rounded-full" style={{width: '75%'}}></div>
                        </div>
                        <span className="text-sm font-medium text-text-primary">High</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-text-secondary">Liftout activity</span>
                      <div className="flex items-center space-x-2">
                        <ArrowTrendingUpIcon className="h-4 w-4 text-success" />
                        <span className="text-sm font-medium text-text-primary">+18% YoY</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Liftouts */}
          <div className="card">
            <div className="px-6 py-4 border-b border-border">
              <h3 className="text-lg font-medium text-text-primary">Recent market activity</h3>
              <p className="text-sm text-text-tertiary">Notable team acquisitions in target sectors</p>
            </div>
            <div className="divide-y divide-border">
              <div className="p-6">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <UserGroupIcon className="h-6 w-6 text-navy" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-text-primary">
                      Credit Suisse → Apollo Global Management
                    </h4>
                    <p className="text-sm text-text-secondary">
                      Distressed debt team (8 members) • Est. $12M package
                    </p>
                    <p className="text-xs text-text-tertiary mt-1">2 weeks ago</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <UserGroupIcon className="h-6 w-6 text-success" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-text-primary">
                      Deloitte → Palantir Technologies
                    </h4>
                    <p className="text-sm text-text-secondary">
                      Government consulting team (12 members) • Est. $18M package
                    </p>
                    <p className="text-xs text-text-tertiary mt-1">1 month ago</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <UserGroupIcon className="h-6 w-6 text-gold" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-text-primary">
                      BCG → Meta Platforms
                    </h4>
                    <p className="text-sm text-text-secondary">
                      AI strategy team (6 members) • Est. $15M package
                    </p>
                    <p className="text-xs text-text-tertiary mt-1">6 weeks ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {viewMode === 'signals' && (
        <div className="card">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="text-lg font-medium text-text-primary">Signal analysis</h3>
            <p className="text-sm text-text-tertiary">Real-time indicators of liftout opportunities across targets</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Signal Strength Distribution */}
              <div>
                <h4 className="text-sm font-medium text-text-primary mb-4">Signal strength distribution</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">Critical (80-100%)</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-bg-elevated rounded-full h-2">
                        <div className="bg-error h-2 rounded-full" style={{width: '15%'}}></div>
                      </div>
                      <span className="text-sm font-medium text-text-primary">3 signals</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">High (60-79%)</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-bg-elevated rounded-full h-2">
                        <div className="bg-gold h-2 rounded-full" style={{width: '40%'}}></div>
                      </div>
                      <span className="text-sm font-medium text-text-primary">8 signals</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">Medium (40-59%)</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-bg-elevated rounded-full h-2">
                        <div className="bg-navy h-2 rounded-full" style={{width: '60%'}}></div>
                      </div>
                      <span className="text-sm font-medium text-text-primary">12 signals</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">Low (20-39%)</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-bg-elevated rounded-full h-2">
                        <div className="bg-success h-2 rounded-full" style={{width: '25%'}}></div>
                      </div>
                      <span className="text-sm font-medium text-text-primary">5 signals</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Signal Types */}
              <div>
                <h4 className="text-sm font-medium text-text-primary mb-4">Most common signal types</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <ExclamationTriangleIcon className="h-4 w-4 text-gold" />
                      <span className="text-sm text-text-secondary">Leadership change</span>
                    </div>
                    <span className="text-sm font-medium text-text-primary">8 occurrences</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CurrencyDollarIcon className="h-4 w-4 text-error" />
                      <span className="text-sm text-text-secondary">Compensation lag</span>
                    </div>
                    <span className="text-sm font-medium text-text-primary">6 occurrences</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <UserGroupIcon className="h-4 w-4 text-gold" />
                      <span className="text-sm text-text-secondary">Talent exodus</span>
                    </div>
                    <span className="text-sm font-medium text-text-primary">5 occurrences</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <ChartBarIcon className="h-4 w-4 text-gold" />
                      <span className="text-sm text-text-secondary">Growth constraints</span>
                    </div>
                    <span className="text-sm font-medium text-text-primary">4 occurrences</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent High-Priority Signals */}
            <div className="mt-8">
              <h4 className="text-sm font-medium text-text-primary mb-4">Recent high-priority signals</h4>
              <div className="bg-bg-alt rounded-lg p-4">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-error rounded-full mt-2"></div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-text-primary">Goldman Sachs - QIS Team</p>
                        <span className="text-xs text-text-tertiary">2 hours ago</span>
                      </div>
                      <p className="text-sm text-text-secondary">New division head implementing cost reduction initiatives (75% strength)</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-gold rounded-full mt-2"></div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-text-primary">McKinsey - Healthcare Innovation</p>
                        <span className="text-xs text-text-tertiary">1 day ago</span>
                      </div>
                      <p className="text-sm text-text-secondary">Limited partner track expansion despite strong performance (55% strength)</p>
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