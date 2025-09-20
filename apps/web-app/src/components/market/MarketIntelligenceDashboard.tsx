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
      name: 'Market Health', 
      value: `${marketData.marketHealth.overallScore}%`, 
      icon: ChartBarIcon,
      color: 'text-green-600',
      change: `${marketData.marketHealth.growthRate}% growth`,
      trend: 'up'
    },
    { 
      name: 'Talent Shortage', 
      value: `${100 - marketData.talentSupplyDemand.talentSupply}%`, 
      icon: ExclamationTriangleIcon,
      color: 'text-red-600',
      change: 'Severe shortage',
      trend: 'up'
    },
    { 
      name: 'Competitive Intensity', 
      value: `${marketData.competitiveIntensity}/100`, 
      icon: FireIcon,
      color: 'text-orange-600',
      change: 'High competition',
      trend: 'up'
    },
    { 
      name: 'Market Attractiveness', 
      value: `${Math.round(attractiveness)}%`, 
      icon: ArrowTrendingUpIcon,
      color: 'text-blue-600',
      change: 'Strong opportunity',
      trend: 'up'
    },
  ];

  const renderSupplyDemandChart = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-gray-900">Supply vs Demand by Experience</h4>
      {marketData.talentSupplyDemand.byExperience.map((item, index) => (
        <div key={index} className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-700">{item.level}</span>
            <span className="text-xs text-gray-500">
              Gap: {item.demand - item.supply}%
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-500">Supply</span>
                <span className="text-xs text-gray-700">{item.supply}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${item.supply}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-500">Demand</span>
                <span className="text-xs text-gray-700">{item.demand}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full"
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
        <h4 className="text-sm font-medium text-gray-900 mb-4">Market Share Distribution</h4>
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
              
              const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
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
            const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500', 'bg-purple-500'];
            return (
              <div key={segment.competitor} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`}></div>
                  <span className="text-sm text-gray-700">{segment.competitor}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">{segment.marketShare}%</span>
                  {segment.trend === 'gaining' ? (
                    <ArrowUpIcon className="h-4 w-4 text-green-500" />
                  ) : segment.trend === 'losing' ? (
                    <ArrowDownIcon className="h-4 w-4 text-red-500" />
                  ) : (
                    <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
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
        <h4 className="text-sm font-medium text-gray-900 mb-4">Competitive Positioning Map</h4>
        <div className="relative">
          <svg width={size} height={size} className="mx-auto border border-gray-200 rounded-lg">
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map(value => (
              <g key={value}>
                <line
                  x1={padding + (value / 100) * chartSize}
                  y1={padding}
                  x2={padding + (value / 100) * chartSize}
                  y2={size - padding}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
                <line
                  x1={padding}
                  y1={padding + ((100 - value) / 100) * chartSize}
                  x2={size - padding}
                  y2={padding + ((100 - value) / 100) * chartSize}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
              </g>
            ))}
            
            {/* Axis labels */}
            <text x={size / 2} y={size - 10} textAnchor="middle" className="text-xs fill-gray-600">
              Technology Focus →
            </text>
            <text x={15} y={size / 2} textAnchor="middle" className="text-xs fill-gray-600" transform={`rotate(-90, 15, ${size / 2})`}>
              Scale & Resources →
            </text>
            
            {/* Competitors */}
            {marketData.positioningMap.competitorPositions.map((position, index) => {
              const x = padding + (position.xAxis / 100) * chartSize;
              const y = padding + ((100 - position.yAxis) / 100) * chartSize;
              const radius = Math.sqrt(position.size) * 2; // Size based on market share
              
              const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
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
                    className="text-xs fill-gray-700 font-medium"
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
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  opacity="0.7"
                />
              );
            })}
          </svg>
        </div>
        <div className="mt-4 text-xs text-gray-500">
          <p>Bubble size represents market share. Dashed areas show whitespace opportunities.</p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Market Intelligence</h1>
          <p className="text-gray-600">Competitive analysis and strategic market insights</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setViewMode('overview')}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${
              viewMode === 'overview' 
                ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setViewMode('competitors')}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${
              viewMode === 'competitors' 
                ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Competitors
          </button>
          <button
            onClick={() => setViewMode('trends')}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${
              viewMode === 'trends' 
                ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Trends
          </button>
          <button
            onClick={() => setViewMode('positioning')}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${
              viewMode === 'positioning' 
                ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Positioning
          </button>
          <button
            onClick={() => setViewMode('alerts')}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${
              viewMode === 'alerts' 
                ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Alerts
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
              <div className="mt-3 flex items-center">
                {item.trend === 'up' ? (
                  <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className="text-sm text-gray-500">{item.change}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Overview */}
      {viewMode === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Supply Demand Analysis */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Talent Supply vs Demand</h3>
            {renderSupplyDemandChart()}
          </div>

          {/* Market Share */}
          <div className="bg-white shadow rounded-lg p-6">
            {renderMarketSharePie()}
          </div>

          {/* Market Health Indicators */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Market Health Indicators</h3>
            <div className="space-y-4">
              {marketData.marketHealth.indicators.map((indicator, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">{indicator.name}</span>
                      {indicator.trend === 'increasing' ? (
                        <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />
                      ) : indicator.trend === 'decreasing' ? (
                        <ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />
                      ) : (
                        <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{indicator.description}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-medium text-gray-900">{indicator.value}</span>
                    <span className={`block text-xs ${
                      indicator.importance === 'high' ? 'text-red-600' :
                      indicator.importance === 'medium' ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      {indicator.importance} importance
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strategic Opportunities */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Strategic Opportunities</h3>
            <div className="space-y-4">
              {opportunities.slice(0, 3).map((opportunity, index) => (
                <div key={index} className="border-l-4 border-green-400 pl-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900">{opportunity.name}</h4>
                    <span className="text-sm font-medium text-green-600">
                      ${(opportunity.marketSize / 1000000).toFixed(1)}M
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{opportunity.description}</p>
                  <div className="mt-2 flex items-center space-x-4">
                    <span className="text-xs text-gray-500">
                      Access: {opportunity.accessibilityScore}%
                    </span>
                    <span className="text-xs text-gray-500">
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
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Competitor Analysis</h3>
                <p className="text-sm text-gray-500">Detailed competitive intelligence and liftout activity</p>
              </div>
              <div className="divide-y divide-gray-200">
                {marketData.competitorAnalysis.map((competitor) => (
                  <div
                    key={competitor.id}
                    className={`p-6 cursor-pointer hover:bg-gray-50 ${
                      selectedCompetitor?.id === competitor.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                    }`}
                    onClick={() => setSelectedCompetitor(competitor)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h4 className="text-lg font-medium text-gray-900">{competitor.name}</h4>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            competitor.marketPosition === 'leader' ? 'bg-red-100 text-red-800' :
                            competitor.marketPosition === 'challenger' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {competitor.marketPosition}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            competitor.liftoutActivity.frequency === 'aggressive' ? 'bg-red-100 text-red-800' :
                            competitor.liftoutActivity.frequency === 'high' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {competitor.liftoutActivity.frequency} liftout activity
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-6 mt-3">
                          <div className="flex items-center space-x-1">
                            <ChartBarIcon className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {competitor.marketShare}% market share
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <ArrowTrendingUpIcon className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {competitor.growthRate}% growth
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <FireIcon className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {competitor.liftoutActivity.recentCount} recent liftouts
                            </span>
                          </div>
                        </div>

                        <div className="mt-3">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <span className="text-sm text-green-600">Strengths:</span>
                              <span className="text-sm text-gray-600">
                                {competitor.strengths.slice(0, 2).join(', ')}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 mt-1">
                            <div className="flex items-center space-x-1">
                              <span className="text-sm text-red-600">Weaknesses:</span>
                              <span className="text-sm text-gray-600">
                                {competitor.weaknesses.slice(0, 2).join(', ')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          ${competitor.liftoutActivity.averageCompensation.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">avg compensation</div>
                        <div className="text-sm text-gray-500 mt-1">
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
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Competitor Profile</h3>
                  <p className="text-sm text-gray-500">{selectedCompetitor.name}</p>
                </div>
                <div className="p-6 space-y-6">
                  {/* Liftout Activity */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Liftout Activity</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Frequency</span>
                        <span className="text-sm font-medium text-gray-900 capitalize">
                          {selectedCompetitor.liftoutActivity.frequency}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Recent Count (12mo)</span>
                        <span className="text-sm font-medium text-gray-900">
                          {selectedCompetitor.liftoutActivity.recentCount}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Avg Team Size</span>
                        <span className="text-sm font-medium text-gray-900">
                          {selectedCompetitor.liftoutActivity.averageTeamSize}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Success Rate</span>
                        <span className="text-sm font-medium text-gray-900">
                          {selectedCompetitor.liftoutActivity.successRate}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Recent Moves */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Recent Strategic Moves</h4>
                    <div className="space-y-3">
                      {selectedCompetitor.recentMoves.slice(0, 2).map((move) => (
                        <div key={move.id} className="border-l-2 border-blue-200 pl-3">
                          <div className="flex items-center justify-between">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              move.significance === 'strategic' ? 'bg-red-100 text-red-800' :
                              move.significance === 'high' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {move.significance}
                            </span>
                            <span className="text-xs text-gray-500">
                              {move.date.toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-gray-900 mt-1 capitalize">
                            {move.type.replace(/_/g, ' ')}
                          </p>
                          <p className="text-sm text-gray-600">{move.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Vulnerabilities & Opportunities */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Our Opportunities</h4>
                    <div className="space-y-2">
                      {selectedCompetitor.opportunities.slice(0, 3).map((opportunity, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <LightBulbIcon className="h-4 w-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-gray-700">{opportunity}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white shadow rounded-lg p-6">
                <div className="text-center text-gray-500">
                  <EyeIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Select a competitor</h3>
                  <p className="mt-1 text-sm text-gray-500">
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
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Market Trends</h3>
              <p className="text-sm text-gray-500">Emerging trends and disruptors shaping the market</p>
            </div>
            <div className="divide-y divide-gray-200">
              {marketData.trends.map((trend) => (
                <div
                  key={trend.id}
                  className={`p-6 cursor-pointer hover:bg-gray-50 ${
                    selectedTrend?.id === trend.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                  }`}
                  onClick={() => setSelectedTrend(trend)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h4 className="text-lg font-medium text-gray-900">{trend.name}</h4>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          trend.maturity === 'emerging' ? 'bg-green-100 text-green-800' :
                          trend.maturity === 'developing' ? 'bg-yellow-100 text-yellow-800' :
                          trend.maturity === 'mainstream' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {trend.maturity}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">{trend.description}</p>
                      
                      <div className="flex items-center space-x-6 mt-3">
                        <div className="flex items-center space-x-1">
                          <span className="text-sm text-gray-500">Strength:</span>
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-purple-500 h-2 rounded-full"
                              style={{ width: `${trend.strength}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">{trend.strength}%</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-sm text-gray-500">Velocity:</span>
                          <span className="text-sm font-medium text-gray-900 capitalize">
                            {trend.velocity}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        trend.direction === 'positive' ? 'bg-green-100 text-green-800' :
                        trend.direction === 'negative' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {trend.direction}
                      </span>
                      <div className="text-sm text-gray-500 mt-1">
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
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Market Disruptors</h3>
              <div className="space-y-4">
                {marketData.disruptors.map((disruptor) => (
                  <div key={disruptor.id} className="border-l-4 border-red-400 pl-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900">{disruptor.name}</h4>
                      <span className="text-sm font-medium text-red-600">
                        {disruptor.disruptionPotential}% potential
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{disruptor.description}</p>
                    <div className="mt-2 flex items-center space-x-4">
                      <span className="text-xs text-gray-500">
                        Impact in {disruptor.timeToImpact} months
                      </span>
                      <span className="text-xs text-gray-500 capitalize">
                        {disruptor.currentStatus.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strategic Implications */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Strategic Implications</h3>
              {selectedTrend ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Business Implications</h4>
                    <div className="space-y-1">
                      {selectedTrend.businessImplications.map((implication, index) => (
                        <p key={index} className="text-sm text-gray-600">• {implication}</p>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Talent Implications</h4>
                    <div className="space-y-1">
                      {selectedTrend.talentImplications.map((implication, index) => (
                        <p key={index} className="text-sm text-gray-600">• {implication}</p>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Supporting Evidence</h4>
                    <div className="space-y-1">
                      {selectedTrend.evidence.map((evidence, index) => (
                        <p key={index} className="text-sm text-gray-600">• {evidence}</p>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">Select a trend to view strategic implications</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Positioning View */}
      {viewMode === 'positioning' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Positioning Map */}
          <div className="bg-white shadow rounded-lg p-6">
            {renderPositioningMap()}
          </div>

          {/* Positioning Analysis */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Positioning Analysis</h3>
            <div className="space-y-6">
              {/* Quadrants */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Market Quadrants</h4>
                <div className="space-y-3">
                  {marketData.positioningMap.quadrants.map((quadrant, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <h5 className="text-sm font-medium text-gray-900">{quadrant.name}</h5>
                        <span className="text-sm text-gray-600">{quadrant.attractiveness}% attractive</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{quadrant.description}</p>
                      <div className="mt-2">
                        <span className="text-xs text-gray-500">
                          Players: {quadrant.competitors.join(', ') || 'None'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Whitespace Opportunities */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Whitespace Opportunities</h4>
                <div className="space-y-3">
                  {marketData.positioningMap.whitespace.map((space) => (
                    <div key={space.id} className="border-l-4 border-green-400 pl-4">
                      <div className="flex items-center justify-between">
                        <h5 className="text-sm font-medium text-gray-900">{space.description}</h5>
                        <span className="text-sm font-medium text-green-600">
                          ${(space.marketPotential / 1000000).toFixed(1)}M
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{space.opportunity}</p>
                      <div className="mt-2">
                        <span className="text-xs text-gray-500">
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
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Market Alerts</h3>
            <p className="text-sm text-gray-500">Real-time market intelligence and competitive alerts</p>
          </div>
          <div className="divide-y divide-gray-200">
            {alerts.map((alert) => (
              <div key={alert.id} className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {alert.severity === 'critical' || alert.severity === 'high' ? (
                      <ExclamationTriangleIcon className="h-6 w-6 text-red-500" />
                    ) : alert.severity === 'medium' ? (
                      <BellAlertIcon className="h-6 w-6 text-yellow-500" />
                    ) : (
                      <BellAlertIcon className="h-6 w-6 text-blue-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-medium text-gray-900">{alert.title}</h4>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          alert.severity === 'critical' ? 'bg-red-100 text-red-800' :
                          alert.severity === 'high' ? 'bg-red-100 text-red-800' :
                          alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {alert.severity}
                        </span>
                        <span className="text-sm text-gray-500">
                          {alert.timestamp.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{alert.description}</p>
                    
                    <div className="mt-3">
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500">Source: {alert.source}</span>
                        <span className="text-sm text-gray-500">Due: {alert.dueDate.toLocaleDateString()}</span>
                        <span className="text-sm text-gray-500">Assigned: {alert.assignedTo}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h5 className="text-sm font-medium text-gray-900 mb-2">Recommended Actions:</h5>
                      <div className="space-y-1">
                        {alert.recommendedActions.map((action, index) => (
                          <p key={index} className="text-sm text-gray-600">• {action}</p>
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