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
      {/* Header - Practical UI: bold headings, proper spacing */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary font-heading leading-tight">Team discovery engine</h1>
          <p className="text-base font-normal text-text-secondary mt-2 leading-relaxed">Market intelligence and strategic team acquisition tracking</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setViewMode('targets')}
            className={`px-4 py-3 text-base font-bold rounded-xl min-h-12 transition-colors duration-fast ${
              viewMode === 'targets'
                ? 'bg-navy text-white'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-alt border border-border'
            }`}
          >
            Discovery targets
          </button>
          <button
            onClick={() => setViewMode('market')}
            className={`px-4 py-3 text-base font-bold rounded-xl min-h-12 transition-colors duration-fast ${
              viewMode === 'market'
                ? 'bg-navy text-white'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-alt border border-border'
            }`}
          >
            Market intelligence
          </button>
          <button
            onClick={() => setViewMode('signals')}
            className={`px-4 py-3 text-base font-bold rounded-xl min-h-12 transition-colors duration-fast ${
              viewMode === 'signals'
                ? 'bg-navy text-white'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-alt border border-border'
            }`}
          >
            Signal analysis
          </button>
        </div>
      </div>

      {/* Stats - Practical UI: consistent card styling */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div key={item.name} className="card p-6">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-bg-alt flex items-center justify-center">
                <item.icon className={`h-6 w-6 ${item.color}`} aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-text-tertiary truncate">
                  {item.name}
                </p>
                <p className="text-xl font-bold text-text-primary mt-1">
                  {item.value}
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <span className="text-sm font-normal text-text-tertiary">{item.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      {viewMode === 'targets' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Targets List - Practical UI: bold section headings */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="px-6 py-4 border-b border-border">
                <h3 className="text-lg font-bold text-text-primary">Discovery targets</h3>
                <p className="text-sm font-normal text-text-tertiary mt-1">Prioritized by strategic value and acquisition opportunity</p>
              </div>
              <div className="divide-y divide-border">
                {prioritizedTargets.map((target) => (
                  <div
                    key={target.id}
                    className={`p-6 cursor-pointer transition-all duration-fast ${
                      selectedTarget?.id === target.id
                        ? 'bg-navy-50 border-l-4 border-navy'
                        : 'hover:bg-bg-alt border-l-4 border-transparent'
                    }`}
                    onClick={() => setSelectedTarget(target)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h4 className="text-base font-bold text-text-primary">
                            {target.targetTeam}
                          </h4>
                          <span className={`badge text-xs ${
                            target.priority === 'critical' ? 'badge-error' :
                            target.priority === 'high' ? 'badge-warning' :
                            'badge-success'
                          }`}>
                            {target.priority}
                          </span>
                        </div>
                        <p className="text-sm font-normal text-text-secondary mt-1">{target.targetCompany}</p>
                        <p className="text-sm font-normal text-text-tertiary mt-1">{target.strategicRationale}</p>

                        {target.intelligence && (
                          <div className="flex flex-wrap items-center gap-4 mt-3">
                            <div className="flex items-center gap-1">
                              <ExclamationTriangleIcon className="h-4 w-4 text-gold" aria-hidden="true" />
                              <span className="text-sm font-normal text-text-secondary">
                                {target.intelligence.vulnerabilityScore}% vulnerable
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <ArrowTrendingUpIcon className="h-4 w-4 text-success" aria-hidden="true" />
                              <span className="text-sm font-normal text-text-secondary">
                                {target.intelligence.competitiveValue}% value
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <UserGroupIcon className="h-4 w-4 text-navy" aria-hidden="true" />
                              <span className="text-sm font-normal text-text-secondary">
                                {target.intelligence.size} members
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-base font-bold text-text-primary">
                          ${target.intelligence?.estimatedLiftoutCost.toLocaleString()}
                        </div>
                        <div className="text-sm font-normal text-text-tertiary">
                          ~{target.intelligence?.estimatedTimeToLiftout} days
                        </div>
                        <div className={`badge text-xs mt-2 ${
                          target.status === 'monitoring' ? 'badge-primary' :
                          target.status === 'researching' ? 'badge-secondary' :
                          target.status === 'engaging' ? 'badge-success' :
                          'badge-warning'
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

          {/* Target Details - Practical UI: consistent typography */}
          <div className="lg:col-span-1">
            {selectedTarget && selectedTarget.intelligence ? (
              <div className="card">
                <div className="px-6 py-4 border-b border-border">
                  <h3 className="text-lg font-bold text-text-primary">Intelligence report</h3>
                  <p className="text-sm font-normal text-text-tertiary mt-1">{selectedTarget.targetTeam}</p>
                </div>
                <div className="p-6 space-y-6">
                  {/* Performance Metrics */}
                  <div>
                    <h4 className="text-sm font-bold text-text-primary mb-3">Performance metrics</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-normal text-text-secondary">Industry percentile</span>
                        <span className="text-sm font-bold text-text-primary">
                          {selectedTarget.intelligence.performanceMetrics.industryPercentile}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-normal text-text-secondary">Revenue impact</span>
                        <span className="text-sm font-bold text-text-primary">
                          ${selectedTarget.intelligence.performanceMetrics.revenueImpact.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-normal text-text-secondary">Client satisfaction</span>
                        <span className="text-sm font-bold text-text-primary">
                          {selectedTarget.intelligence.performanceMetrics.clientSatisfaction}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Market Position */}
                  <div>
                    <h4 className="text-sm font-bold text-text-primary mb-3">Market position</h4>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-normal text-text-secondary">Industry:</span>
                        <span className="text-sm font-bold text-text-primary ml-2">
                          {selectedTarget.intelligence.marketPosition.industry}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm font-normal text-text-secondary">Market share:</span>
                        <span className="text-sm font-bold text-text-primary ml-2">
                          {selectedTarget.intelligence.marketPosition.marketShare}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Recent Signals */}
                  <div>
                    <h4 className="text-sm font-bold text-text-primary mb-3">Recent signals</h4>
                    <div className="space-y-3">
                      {selectedTarget.intelligence.signals.slice(0, 3).map((signal) => (
                        <div key={signal.id} className="border-l-2 border-navy-200 pl-3">
                          <div className="flex items-center gap-2">
                            <span className={`badge text-xs ${
                              signal.strength > 70 ? 'badge-error' :
                              signal.strength > 40 ? 'badge-warning' :
                              'badge-success'
                            }`}>
                              {signal.strength}% strength
                            </span>
                          </div>
                          <p className="text-sm font-normal text-text-secondary mt-1">{signal.description}</p>
                          <p className="text-xs font-normal text-text-tertiary mt-1">
                            {signal.source} • {signal.date.toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Next Action */}
                  <div className="bg-navy-50 rounded-xl p-4">
                    <h4 className="text-sm font-bold text-navy-900 mb-2">Next action</h4>
                    <p className="text-sm font-normal text-navy-700">{selectedTarget.nextAction}</p>
                    <div className="mt-3 pt-3 border-t border-navy-200">
                      <span className="text-xs font-normal text-navy-600">
                        Assigned to: {selectedTarget.assignedAnalyst}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card p-8">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto rounded-full bg-bg-alt flex items-center justify-center mb-4">
                    <EyeIcon className="h-8 w-8 text-text-tertiary" aria-hidden="true" />
                  </div>
                  <h3 className="text-base font-bold text-text-primary">Select a target</h3>
                  <p className="mt-2 text-sm font-normal text-text-tertiary leading-relaxed">
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
          {/* Market Trends - Practical UI: bold headings */}
          <div className="card">
            <div className="px-6 py-4 border-b border-border">
              <h3 className="text-lg font-bold text-text-primary">Market intelligence</h3>
              <p className="text-sm font-normal text-text-tertiary mt-1">Industry trends and liftout activity</p>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-text-primary mb-4">Financial services</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-normal text-text-secondary">Talent supply</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-bg-elevated rounded-full h-2">
                          <div className="bg-error h-2 rounded-full" style={{width: '25%'}}></div>
                        </div>
                        <span className="text-sm font-bold text-text-primary">Low</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-normal text-text-secondary">Talent demand</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-bg-elevated rounded-full h-2">
                          <div className="bg-success h-2 rounded-full" style={{width: '90%'}}></div>
                        </div>
                        <span className="text-sm font-bold text-text-primary">High</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-normal text-text-secondary">Liftout activity</span>
                      <div className="flex items-center gap-2">
                        <ArrowTrendingUpIcon className="h-4 w-4 text-success" aria-hidden="true" />
                        <span className="text-sm font-bold text-text-primary">+35% YoY</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-text-primary mb-4">Management consulting</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-normal text-text-secondary">Talent supply</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-bg-elevated rounded-full h-2">
                          <div className="bg-gold h-2 rounded-full" style={{width: '60%'}}></div>
                        </div>
                        <span className="text-sm font-bold text-text-primary">Medium</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-normal text-text-secondary">Talent demand</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-bg-elevated rounded-full h-2">
                          <div className="bg-success h-2 rounded-full" style={{width: '75%'}}></div>
                        </div>
                        <span className="text-sm font-bold text-text-primary">High</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-normal text-text-secondary">Liftout activity</span>
                      <div className="flex items-center gap-2">
                        <ArrowTrendingUpIcon className="h-4 w-4 text-success" aria-hidden="true" />
                        <span className="text-sm font-bold text-text-primary">+18% YoY</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Liftouts - Practical UI */}
          <div className="card">
            <div className="px-6 py-4 border-b border-border">
              <h3 className="text-lg font-bold text-text-primary">Recent market activity</h3>
              <p className="text-sm font-normal text-text-tertiary mt-1">Notable team acquisitions in target sectors</p>
            </div>
            <div className="divide-y divide-border">
              <div className="p-6 hover:bg-bg-alt transition-colors duration-fast">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-navy-50 flex items-center justify-center">
                    <UserGroupIcon className="h-5 w-5 text-navy" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-text-primary">
                      Credit Suisse → Apollo Global Management
                    </h4>
                    <p className="text-sm font-normal text-text-secondary mt-1">
                      Distressed debt team (8 members) • Est. $12M package
                    </p>
                    <p className="text-xs font-normal text-text-tertiary mt-1">2 weeks ago</p>
                  </div>
                </div>
              </div>
              <div className="p-6 hover:bg-bg-alt transition-colors duration-fast">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-success-light flex items-center justify-center">
                    <UserGroupIcon className="h-5 w-5 text-success" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-text-primary">
                      Deloitte → Palantir Technologies
                    </h4>
                    <p className="text-sm font-normal text-text-secondary mt-1">
                      Government consulting team (12 members) • Est. $18M package
                    </p>
                    <p className="text-xs font-normal text-text-tertiary mt-1">1 month ago</p>
                  </div>
                </div>
              </div>
              <div className="p-6 hover:bg-bg-alt transition-colors duration-fast">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gold-100 flex items-center justify-center">
                    <UserGroupIcon className="h-5 w-5 text-gold" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-text-primary">
                      BCG → Meta Platforms
                    </h4>
                    <p className="text-sm font-normal text-text-secondary mt-1">
                      AI strategy team (6 members) • Est. $15M package
                    </p>
                    <p className="text-xs font-normal text-text-tertiary mt-1">6 weeks ago</p>
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
            <h3 className="text-lg font-bold text-text-primary">Signal analysis</h3>
            <p className="text-sm font-normal text-text-tertiary mt-1">Real-time indicators of liftout opportunities across targets</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Signal Strength Distribution - Practical UI */}
              <div>
                <h4 className="text-sm font-bold text-text-primary mb-4">Signal strength distribution</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-normal text-text-secondary">Critical (80-100%)</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-bg-elevated rounded-full h-2">
                        <div className="bg-error h-2 rounded-full" style={{width: '15%'}}></div>
                      </div>
                      <span className="text-sm font-bold text-text-primary">3 signals</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-normal text-text-secondary">High (60-79%)</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-bg-elevated rounded-full h-2">
                        <div className="bg-gold h-2 rounded-full" style={{width: '40%'}}></div>
                      </div>
                      <span className="text-sm font-bold text-text-primary">8 signals</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-normal text-text-secondary">Medium (40-59%)</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-bg-elevated rounded-full h-2">
                        <div className="bg-navy h-2 rounded-full" style={{width: '60%'}}></div>
                      </div>
                      <span className="text-sm font-bold text-text-primary">12 signals</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-normal text-text-secondary">Low (20-39%)</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-bg-elevated rounded-full h-2">
                        <div className="bg-success h-2 rounded-full" style={{width: '25%'}}></div>
                      </div>
                      <span className="text-sm font-bold text-text-primary">5 signals</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Signal Types */}
              <div>
                <h4 className="text-sm font-bold text-text-primary mb-4">Most common signal types</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ExclamationTriangleIcon className="h-4 w-4 text-gold" aria-hidden="true" />
                      <span className="text-sm font-normal text-text-secondary">Leadership change</span>
                    </div>
                    <span className="text-sm font-bold text-text-primary">8 occurrences</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CurrencyDollarIcon className="h-4 w-4 text-error" aria-hidden="true" />
                      <span className="text-sm font-normal text-text-secondary">Compensation lag</span>
                    </div>
                    <span className="text-sm font-bold text-text-primary">6 occurrences</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <UserGroupIcon className="h-4 w-4 text-gold" aria-hidden="true" />
                      <span className="text-sm font-normal text-text-secondary">Talent exodus</span>
                    </div>
                    <span className="text-sm font-bold text-text-primary">5 occurrences</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ChartBarIcon className="h-4 w-4 text-gold" aria-hidden="true" />
                      <span className="text-sm font-normal text-text-secondary">Growth constraints</span>
                    </div>
                    <span className="text-sm font-bold text-text-primary">4 occurrences</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent High-Priority Signals */}
            <div className="mt-8">
              <h4 className="text-sm font-bold text-text-primary mb-4">Recent high-priority signals</h4>
              <div className="bg-bg-alt rounded-xl p-4">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-2">
                      <div className="w-2 h-2 bg-error rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-text-primary">Goldman Sachs - QIS Team</p>
                        <span className="text-xs font-normal text-text-tertiary">2 hours ago</span>
                      </div>
                      <p className="text-sm font-normal text-text-secondary mt-1">New division head implementing cost reduction initiatives (75% strength)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-2">
                      <div className="w-2 h-2 bg-gold rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-text-primary">McKinsey - Healthcare Innovation</p>
                        <span className="text-xs font-normal text-text-tertiary">1 day ago</span>
                      </div>
                      <p className="text-sm font-normal text-text-secondary mt-1">Limited partner track expansion despite strong performance (55% strength)</p>
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