'use client';

import { useState } from 'react';
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon,
  LightBulbIcon,
  GlobeAltIcon,
  EyeIcon,
  FireIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  BellAlertIcon,
  MapIcon,
} from '@heroicons/react/24/outline';
import { 
  mockMarketIntelligence,
  calculateMarketAttractiveness,
  calculateCompetitiveIntensity,
  identifyStrategicOpportunities,
  generateMarketAlerts,
  type MarketIntelligence,
  type CompetitorProfile,
  type MarketTrend 
} from '@/lib/market-intelligence';

export function MarketIntelligenceDashboard() {
  const [selectedCompetitor, setSelectedCompetitor] = useState<CompetitorProfile | null>(null);
  const [selectedTrend, setSelectedTrend] = useState<MarketTrend | null>(null);
  const [viewMode, setViewMode] = useState<'overview' | 'competitors' | 'trends' | 'positioning' | 'alerts'>('overview');
  
  const marketData = mockMarketIntelligence;
  const attractiveness = calculateMarketAttractiveness(
    marketData.marketHealth,
    marketData.talentSupplyDemand,
    marketData.competitorAnalysis
  );
  const opportunities = identifyStrategicOpportunities(
    marketData.trends,
    marketData.competitorAnalysis,
    marketData.positioningMap
  );
  const alerts = generateMarketAlerts(
    marketData.trends,
    marketData.competitorAnalysis,
    []
  );
  
  const stats = [
    {
      name: 'Market health',
      value: `${marketData.marketHealth.overallScore}%`,
      icon: ChartBarIcon,
      color: 'text-success',
      change: `${marketData.marketHealth.growthRate}% growth`,
      trend: 'up'
    },
    {
      name: 'Talent shortage',
      value: `${100 - marketData.talentSupplyDemand.talentSupply}%`,
      icon: ExclamationTriangleIcon,
      color: 'text-error',
      change: 'Severe shortage',
      trend: 'up'
    },
    {
      name: 'Competitive intensity',
      value: `${marketData.competitiveIntensity}/100`,
      icon: FireIcon,
      color: 'text-gold',
      change: 'High competition',
      trend: 'up'
    },
    {
      name: 'Market attractiveness',
      value: `${Math.round(attractiveness)}%`,
      icon: ArrowTrendingUpIcon,
      color: 'text-navy',
      change: 'Strong opportunity',
      trend: 'up'
    },
  ];

  const renderSupplyDemandChart = () => (
    <div className="space-y-4">
      <h4 className="text-base font-medium text-text-primary">Supply vs demand by experience</h4>
      {marketData.talentSupplyDemand.byExperience.map((item, index) => (
        <div key={index} className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-text-secondary">{item.level}</span>
            <span className="text-xs text-text-tertiary">
              Gap: {item.demand - item.supply}%
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="flex justify-between">
                <span className="text-xs text-text-tertiary">Supply</span>
                <span className="text-xs text-text-secondary">{item.supply}%</span>
              </div>
              <div className="w-full bg-bg-alt rounded-full h-2">
                <div
                  className="bg-navy h-2 rounded-full"
                  style={{ width: `${item.supply}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between">
                <span className="text-xs text-text-tertiary">Demand</span>
                <span className="text-xs text-text-secondary">{item.demand}%</span>
              </div>
              <div className="w-full bg-bg-alt rounded-full h-2">
                <div
                  className="bg-error h-2 rounded-full"
                  style={{ width: `${item.demand}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderMarketSharePie = () => {
    const size = 200;
    const center = size / 2;
    const radius = 80;
    let currentAngle = 0;

    return (
      <div className="text-center">
        <h4 className="text-base font-medium text-text-primary mb-4">Market share distribution</h4>
        <div className="relative">
          <svg width={size} height={size} className="mx-auto">
            {marketData.marketShare.map((segment, index) => {
              const angle = (segment.marketShare / 100) * 360;
              const startAngle = currentAngle;
              const endAngle = currentAngle + angle;
              currentAngle += angle;

              const x1 = center + radius * Math.cos((startAngle * Math.PI) / 180);
              const y1 = center + radius * Math.sin((startAngle * Math.PI) / 180);
              const x2 = center + radius * Math.cos((endAngle * Math.PI) / 180);
              const y2 = center + radius * Math.sin((endAngle * Math.PI) / 180);

              const largeArcFlag = angle > 180 ? 1 : 0;

              const colors = ['var(--color-navy)', 'var(--color-success)', 'var(--color-gold)', 'var(--color-error)', 'var(--color-gold-800)'];
              const color = colors[index % colors.length];

              return (
                <path
                  key={segment.competitor}
                  d={`M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                  fill={color}
                  stroke="white"
                  strokeWidth="2"
                />
              );
            })}
          </svg>
        </div>
        <div className="mt-4 space-y-2">
          {marketData.marketShare.map((segment, index) => {
            const colors = ['bg-navy', 'bg-success', 'bg-gold', 'bg-error', 'bg-gold-800'];
            return (
              <div key={segment.competitor} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`}></div>
                  <span className="text-sm text-text-secondary">{segment.competitor}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-text-primary">{segment.marketShare}%</span>
                  {segment.trend === 'gaining' ? (
                    <ArrowUpIcon className="h-4 w-4 text-success" />
                  ) : segment.trend === 'losing' ? (
                    <ArrowDownIcon className="h-4 w-4 text-error" />
                  ) : (
                    <div className="w-4 h-4 bg-border rounded-full"></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderPositioningMap = () => {
    const size = 300;
    const padding = 40;
    const chartSize = size - 2 * padding;

    return (
      <div className="text-center">
        <h4 className="text-base font-medium text-text-primary mb-4">Competitive positioning map</h4>
        <div className="relative">
          <svg width={size} height={size} className="mx-auto border border-border rounded-lg">
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map(value => (
              <g key={value}>
                <line
                  x1={padding + (value / 100) * chartSize}
                  y1={padding}
                  x2={padding + (value / 100) * chartSize}
                  y2={size - padding}
                  stroke="var(--color-border)"
                  strokeWidth="1"
                />
                <line
                  x1={padding}
                  y1={padding + ((100 - value) / 100) * chartSize}
                  x2={size - padding}
                  y2={padding + ((100 - value) / 100) * chartSize}
                  stroke="var(--color-border)"
                  strokeWidth="1"
                />
              </g>
            ))}

            {/* Axis labels */}
            <text x={size / 2} y={size - 10} textAnchor="middle" className="text-xs fill-text-secondary">
              Technology Focus →
            </text>
            <text x={15} y={size / 2} textAnchor="middle" className="text-xs fill-text-secondary" transform={`rotate(-90, 15, ${size / 2})`}>
              Scale & Resources →
            </text>

            {/* Competitors */}
            {marketData.positioningMap.competitorPositions.map((position, index) => {
              const x = padding + (position.xAxis / 100) * chartSize;
              const y = padding + ((100 - position.yAxis) / 100) * chartSize;
              const radius = Math.sqrt(position.size) * 2; // Size based on market share

              const colors = ['var(--color-navy)', 'var(--color-success)', 'var(--color-gold)', 'var(--color-error)', 'var(--color-gold-800)'];
              const color = colors[index % colors.length];

              return (
                <g key={position.competitor}>
                  <circle
                    cx={x}
                    cy={y}
                    r={radius}
                    fill={color}
                    fillOpacity="0.7"
                    stroke={color}
                    strokeWidth="2"
                  />
                  <text
                    x={x}
                    y={y + 25}
                    textAnchor="middle"
                    className="text-xs fill-text-secondary font-medium"
                  >
                    {position.competitor}
                  </text>
                </g>
              );
            })}

            {/* Whitespace opportunities */}
            {marketData.positioningMap.whitespace.map((space, index) => {
              const x1 = padding + (space.xRange[0] / 100) * chartSize;
              const y1 = padding + ((100 - space.yRange[1]) / 100) * chartSize;
              const width = ((space.xRange[1] - space.xRange[0]) / 100) * chartSize;
              const height = ((space.yRange[1] - space.yRange[0]) / 100) * chartSize;

              return (
                <rect
                  key={space.id}
                  x={x1}
                  y={y1}
                  width={width}
                  height={height}
                  fill="none"
                  stroke="var(--color-success)"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  opacity="0.7"
                />
              );
            })}
          </svg>
        </div>
        <div className="mt-4 text-xs text-text-tertiary">
          <p>Bubble size represents market share. Dashed areas show whitespace opportunities.</p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header - Practical UI: bold headings, proper spacing */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary font-heading leading-tight">Market intelligence</h1>
          <p className="text-base font-normal text-text-secondary mt-2 leading-relaxed">Competitive analysis and strategic market insights</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setViewMode('overview')}
            className={`px-4 py-3 text-base font-bold rounded-xl min-h-12 transition-colors duration-fast ${
              viewMode === 'overview'
                ? 'bg-navy text-white'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-alt border border-border'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setViewMode('competitors')}
            className={`px-4 py-3 text-base font-bold rounded-xl min-h-12 transition-colors duration-fast ${
              viewMode === 'competitors'
                ? 'bg-navy text-white'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-alt border border-border'
            }`}
          >
            Competitors
          </button>
          <button
            onClick={() => setViewMode('trends')}
            className={`px-4 py-3 text-base font-bold rounded-xl min-h-12 transition-colors duration-fast ${
              viewMode === 'trends'
                ? 'bg-navy text-white'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-alt border border-border'
            }`}
          >
            Trends
          </button>
          <button
            onClick={() => setViewMode('positioning')}
            className={`px-4 py-3 text-base font-bold rounded-xl min-h-12 transition-colors duration-fast ${
              viewMode === 'positioning'
                ? 'bg-navy text-white'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-alt border border-border'
            }`}
          >
            Positioning
          </button>
          <button
            onClick={() => setViewMode('alerts')}
            className={`px-4 py-3 text-base font-bold rounded-xl min-h-12 transition-colors duration-fast ${
              viewMode === 'alerts'
                ? 'bg-navy text-white'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-alt border border-border'
            }`}
          >
            Alerts
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div key={item.name} className="card overflow-hidden">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <item.icon className={`h-6 w-6 ${item.color}`} aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-base font-medium text-text-tertiary truncate">
                      {item.name}
                    </dt>
                    <dd className="text-lg font-medium text-text-primary">
                      {item.value}
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-3 flex items-center">
                {item.trend === 'up' ? (
                  <ArrowTrendingUpIcon className="h-4 w-4 text-success mr-1" />
                ) : (
                  <ArrowTrendingDownIcon className="h-4 w-4 text-error mr-1" />
                )}
                <span className="text-sm text-text-tertiary">{item.change}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Overview */}
      {viewMode === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Supply Demand Analysis */}
          <div className="card p-6">
            <h3 className="text-lg font-medium text-text-primary mb-6">Talent supply vs demand</h3>
            {renderSupplyDemandChart()}
          </div>

          {/* Market Share */}
          <div className="card p-6">
            {renderMarketSharePie()}
          </div>

          {/* Market Health Indicators */}
          <div className="card p-6">
            <h3 className="text-lg font-medium text-text-primary mb-6">Market health indicators</h3>
            <div className="space-y-4">
              {marketData.marketHealth.indicators.map((indicator, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-text-primary">{indicator.name}</span>
                      {indicator.trend === 'increasing' ? (
                        <ArrowTrendingUpIcon className="h-4 w-4 text-success" />
                      ) : indicator.trend === 'decreasing' ? (
                        <ArrowTrendingDownIcon className="h-4 w-4 text-error" />
                      ) : (
                        <div className="w-4 h-4 bg-border rounded-full"></div>
                      )}
                    </div>
                    <p className="text-sm text-text-secondary mt-1">{indicator.description}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-medium text-text-primary">{indicator.value}</span>
                    <span className={`block text-xs ${
                      indicator.importance === 'high' ? 'text-error' :
                      indicator.importance === 'medium' ? 'text-gold' :
                      'text-success'
                    }`}>
                      {indicator.importance} importance
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strategic Opportunities */}
          <div className="card p-6">
            <h3 className="text-lg font-medium text-text-primary mb-6">Strategic opportunities</h3>
            <div className="space-y-4">
              {opportunities.slice(0, 3).map((opportunity, index) => (
                <div key={index} className="border-l-4 border-success pl-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-text-primary">{opportunity.name}</h4>
                    <span className="text-sm font-medium text-success">
                      ${(opportunity.marketSize / 1000000).toFixed(1)}M
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary mt-1">{opportunity.description}</p>
                  <div className="mt-2 flex items-center space-x-4">
                    <span className="text-xs text-text-tertiary">
                      Access: {opportunity.accessibilityScore}%
                    </span>
                    <span className="text-xs text-text-tertiary">
                      Timeline: {opportunity.timeline}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Competitors View */}
      {viewMode === 'competitors' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Competitor List */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="px-6 py-4 border-b border-border">
                <h3 className="text-lg font-medium text-text-primary">Competitor analysis</h3>
                <p className="text-sm text-text-tertiary">Detailed competitive intelligence and liftout activity</p>
              </div>
              <div className="divide-y divide-border">
                {marketData.competitorAnalysis.map((competitor) => (
                  <div
                    key={competitor.id}
                    className={`p-6 cursor-pointer hover:bg-bg-alt ${
                      selectedCompetitor?.id === competitor.id ? 'bg-navy-50 border-l-4 border-navy' : ''
                    }`}
                    onClick={() => setSelectedCompetitor(competitor)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h4 className="text-lg font-medium text-text-primary">{competitor.name}</h4>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            competitor.marketPosition === 'leader' ? 'bg-error-light text-error-dark' :
                            competitor.marketPosition === 'challenger' ? 'bg-gold-100 text-gold-800' :
                            'bg-success-light text-success-dark'
                          }`}>
                            {competitor.marketPosition}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            competitor.liftoutActivity.frequency === 'aggressive' ? 'bg-error-light text-error-dark' :
                            competitor.liftoutActivity.frequency === 'high' ? 'bg-gold-100 text-gold-800' :
                            'bg-success-light text-success-dark'
                          }`}>
                            {competitor.liftoutActivity.frequency} liftout activity
                          </span>
                        </div>

                        <div className="flex items-center space-x-6 mt-3">
                          <div className="flex items-center space-x-1">
                            <ChartBarIcon className="h-4 w-4 text-text-tertiary" />
                            <span className="text-sm text-text-secondary">
                              {competitor.marketShare}% market share
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <ArrowTrendingUpIcon className="h-4 w-4 text-text-tertiary" />
                            <span className="text-sm text-text-secondary">
                              {competitor.growthRate}% growth
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <FireIcon className="h-4 w-4 text-text-tertiary" />
                            <span className="text-sm text-text-secondary">
                              {competitor.liftoutActivity.recentCount} recent liftouts
                            </span>
                          </div>
                        </div>

                        <div className="mt-3">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <span className="text-sm text-success">Strengths:</span>
                              <span className="text-sm text-text-secondary">
                                {competitor.strengths.slice(0, 2).join(', ')}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 mt-1">
                            <div className="flex items-center space-x-1">
                              <span className="text-sm text-error">Weaknesses:</span>
                              <span className="text-sm text-text-secondary">
                                {competitor.weaknesses.slice(0, 2).join(', ')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-text-primary">
                          ${competitor.liftoutActivity.averageCompensation.toLocaleString()}
                        </div>
                        <div className="text-sm text-text-tertiary">avg compensation</div>
                        <div className="text-sm text-text-tertiary mt-1">
                          {competitor.liftoutActivity.successRate}% success rate
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Competitor Details */}
          <div className="lg:col-span-1">
            {selectedCompetitor ? (
              <div className="card">
                <div className="px-6 py-4 border-b border-border">
                  <h3 className="text-lg font-medium text-text-primary">Competitor profile</h3>
                  <p className="text-sm text-text-tertiary">{selectedCompetitor.name}</p>
                </div>
                <div className="p-6 space-y-6">
                  {/* Liftout Activity */}
                  <div>
                    <h4 className="text-sm font-medium text-text-primary mb-3">Liftout activity</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-text-secondary">Frequency</span>
                        <span className="text-sm font-medium text-text-primary capitalize">
                          {selectedCompetitor.liftoutActivity.frequency}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-text-secondary">Recent count (12mo)</span>
                        <span className="text-sm font-medium text-text-primary">
                          {selectedCompetitor.liftoutActivity.recentCount}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-text-secondary">Avg team size</span>
                        <span className="text-sm font-medium text-text-primary">
                          {selectedCompetitor.liftoutActivity.averageTeamSize}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-text-secondary">Success rate</span>
                        <span className="text-sm font-medium text-text-primary">
                          {selectedCompetitor.liftoutActivity.successRate}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Recent Moves */}
                  <div>
                    <h4 className="text-sm font-medium text-text-primary mb-3">Recent strategic moves</h4>
                    <div className="space-y-3">
                      {selectedCompetitor.recentMoves.slice(0, 2).map((move) => (
                        <div key={move.id} className="border-l-2 border-navy-200 pl-3">
                          <div className="flex items-center justify-between">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              move.significance === 'strategic' ? 'bg-error-light text-error-dark' :
                              move.significance === 'high' ? 'bg-gold-100 text-gold-800' :
                              'bg-success-light text-success-dark'
                            }`}>
                              {move.significance}
                            </span>
                            <span className="text-xs text-text-tertiary">
                              {move.date.toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-text-primary mt-1 capitalize">
                            {move.type.replace(/_/g, ' ')}
                          </p>
                          <p className="text-sm text-text-secondary">{move.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Vulnerabilities & Opportunities */}
                  <div>
                    <h4 className="text-sm font-medium text-text-primary mb-3">Our opportunities</h4>
                    <div className="space-y-2">
                      {selectedCompetitor.opportunities.slice(0, 3).map((opportunity, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <LightBulbIcon className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-text-secondary">{opportunity}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card p-6">
                <div className="text-center text-text-tertiary">
                  <EyeIcon className="mx-auto h-12 w-12 text-text-tertiary" />
                  <h3 className="mt-2 text-sm font-medium text-text-primary">Select a competitor</h3>
                  <p className="mt-1 text-sm text-text-tertiary">
                    Choose a competitor to view detailed intelligence
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Trends View */}
      {viewMode === 'trends' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Trends List */}
          <div className="card">
            <div className="px-6 py-4 border-b border-border">
              <h3 className="text-lg font-medium text-text-primary">Market trends</h3>
              <p className="text-sm text-text-tertiary">Emerging trends and disruptors shaping the market</p>
            </div>
            <div className="divide-y divide-border">
              {marketData.trends.map((trend) => (
                <div
                  key={trend.id}
                  className={`p-6 cursor-pointer hover:bg-bg-alt ${
                    selectedTrend?.id === trend.id ? 'bg-navy-50 border-l-4 border-navy' : ''
                  }`}
                  onClick={() => setSelectedTrend(trend)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h4 className="text-lg font-medium text-text-primary">{trend.name}</h4>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          trend.maturity === 'emerging' ? 'bg-success-light text-success-dark' :
                          trend.maturity === 'developing' ? 'bg-gold-100 text-gold-800' :
                          trend.maturity === 'mainstream' ? 'bg-navy-50 text-navy' :
                          'bg-bg-alt text-text-secondary'
                        }`}>
                          {trend.maturity}
                        </span>
                      </div>
                      <p className="text-sm text-text-secondary mt-2">{trend.description}</p>

                      <div className="flex items-center space-x-6 mt-3">
                        <div className="flex items-center space-x-1">
                          <span className="text-sm text-text-tertiary">Strength:</span>
                          <div className="w-20 bg-bg-alt rounded-full h-2">
                            <div
                              className="bg-gold h-2 rounded-full"
                              style={{ width: `${trend.strength}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-text-secondary">{trend.strength}%</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-sm text-text-tertiary">Velocity:</span>
                          <span className="text-sm font-medium text-text-primary capitalize">
                            {trend.velocity}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        trend.direction === 'positive' ? 'bg-success-light text-success-dark' :
                        trend.direction === 'negative' ? 'bg-error-light text-error-dark' :
                        'bg-bg-alt text-text-secondary'
                      }`}>
                        {trend.direction}
                      </span>
                      <div className="text-sm text-text-tertiary mt-1">
                        {trend.confidence}% confidence
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Disruptors & Opportunities */}
          <div className="space-y-6">
            {/* Disruptors */}
            <div className="card p-6">
              <h3 className="text-lg font-medium text-text-primary mb-4">Market disruptors</h3>
              <div className="space-y-4">
                {marketData.disruptors.map((disruptor) => (
                  <div key={disruptor.id} className="border-l-4 border-error pl-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-text-primary">{disruptor.name}</h4>
                      <span className="text-sm font-medium text-error">
                        {disruptor.disruptionPotential}% potential
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary mt-1">{disruptor.description}</p>
                    <div className="mt-2 flex items-center space-x-4">
                      <span className="text-xs text-text-tertiary">
                        Impact in {disruptor.timeToImpact} months
                      </span>
                      <span className="text-xs text-text-tertiary capitalize">
                        {disruptor.currentStatus.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strategic Implications */}
            <div className="card p-6">
              <h3 className="text-lg font-medium text-text-primary mb-4">Strategic implications</h3>
              {selectedTrend ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-text-primary mb-2">Business implications</h4>
                    <div className="space-y-1">
                      {selectedTrend.businessImplications.map((implication, index) => (
                        <p key={index} className="text-sm text-text-secondary">• {implication}</p>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-text-primary mb-2">Talent implications</h4>
                    <div className="space-y-1">
                      {selectedTrend.talentImplications.map((implication, index) => (
                        <p key={index} className="text-sm text-text-secondary">• {implication}</p>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-text-primary mb-2">Supporting evidence</h4>
                    <div className="space-y-1">
                      {selectedTrend.evidence.map((evidence, index) => (
                        <p key={index} className="text-sm text-text-secondary">• {evidence}</p>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-text-tertiary">Select a trend to view strategic implications</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Positioning View */}
      {viewMode === 'positioning' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Positioning Map */}
          <div className="card p-6">
            {renderPositioningMap()}
          </div>

          {/* Positioning Analysis */}
          <div className="card p-6">
            <h3 className="text-lg font-medium text-text-primary mb-6">Positioning analysis</h3>
            <div className="space-y-6">
              {/* Quadrants */}
              <div>
                <h4 className="text-sm font-medium text-text-primary mb-3">Market quadrants</h4>
                <div className="space-y-3">
                  {marketData.positioningMap.quadrants.map((quadrant, index) => (
                    <div key={index} className="border border-border rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <h5 className="text-sm font-medium text-text-primary">{quadrant.name}</h5>
                        <span className="text-sm text-text-secondary">{quadrant.attractiveness}% attractive</span>
                      </div>
                      <p className="text-sm text-text-secondary mt-1">{quadrant.description}</p>
                      <div className="mt-2">
                        <span className="text-xs text-text-tertiary">
                          Players: {quadrant.competitors.join(', ') || 'None'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Whitespace Opportunities */}
              <div>
                <h4 className="text-sm font-medium text-text-primary mb-3">Whitespace opportunities</h4>
                <div className="space-y-3">
                  {marketData.positioningMap.whitespace.map((space) => (
                    <div key={space.id} className="border-l-4 border-success pl-4">
                      <div className="flex items-center justify-between">
                        <h5 className="text-sm font-medium text-text-primary">{space.description}</h5>
                        <span className="text-sm font-medium text-success">
                          ${(space.marketPotential / 1000000).toFixed(1)}M
                        </span>
                      </div>
                      <p className="text-sm text-text-secondary mt-1">{space.opportunity}</p>
                      <div className="mt-2">
                        <span className="text-xs text-text-tertiary">
                          Accessibility: {space.accessibilityScore}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alerts View */}
      {viewMode === 'alerts' && (
        <div className="card">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="text-lg font-medium text-text-primary">Market alerts</h3>
            <p className="text-sm text-text-tertiary">Real-time market intelligence and competitive alerts</p>
          </div>
          <div className="divide-y divide-border">
            {alerts.map((alert) => (
              <div key={alert.id} className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {alert.severity === 'critical' || alert.severity === 'high' ? (
                      <ExclamationTriangleIcon className="h-6 w-6 text-error" />
                    ) : alert.severity === 'medium' ? (
                      <BellAlertIcon className="h-6 w-6 text-gold" />
                    ) : (
                      <BellAlertIcon className="h-6 w-6 text-navy" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-medium text-text-primary">{alert.title}</h4>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          alert.severity === 'critical' ? 'bg-error-light text-error-dark' :
                          alert.severity === 'high' ? 'bg-error-light text-error-dark' :
                          alert.severity === 'medium' ? 'bg-gold-100 text-gold-800' :
                          'bg-navy-50 text-navy'
                        }`}>
                          {alert.severity}
                        </span>
                        <span className="text-sm text-text-tertiary">
                          {alert.timestamp.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-text-secondary mt-2">{alert.description}</p>

                    <div className="mt-3">
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-text-tertiary">Source: {alert.source}</span>
                        <span className="text-sm text-text-tertiary">Due: {alert.dueDate.toLocaleDateString()}</span>
                        <span className="text-sm text-text-tertiary">Assigned: {alert.assignedTo}</span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h5 className="text-sm font-medium text-text-primary mb-2">Recommended actions:</h5>
                      <div className="space-y-1">
                        {alert.recommendedActions.map((action, index) => (
                          <p key={index} className="text-sm text-text-secondary">• {action}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}