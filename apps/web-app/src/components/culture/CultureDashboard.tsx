'use client';

import { useState } from 'react';
import {
  UserGroupIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  LightBulbIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  HeartIcon,
  BoltIcon,
  ScaleIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { 
  mockCultureProfiles,
  mockCompatibilityAssessment,
  type CultureProfile,
  type CultureCompatibility,
  type DimensionCompatibility 
} from '@/lib/culture';

export function CultureDashboard() {
  const [selectedProfile, setSelectedProfile] = useState<CultureProfile | null>(null);
  const [viewMode, setViewMode] = useState<'overview' | 'profiles' | 'compatibility' | 'integration'>('overview');
  
  const profiles = mockCultureProfiles;
  const compatibility = mockCompatibilityAssessment;
  
  const stats = [
    { 
      name: 'Culture Profiles', 
      value: profiles.length, 
      icon: UserGroupIcon,
      color: 'text-blue-600',
      change: '2 teams assessed'
    },
    { 
      name: 'Compatibility Score', 
      value: `${Math.round(compatibility.overallScore)}%`, 
      icon: HeartIcon,
      color: 'text-green-600',
      change: 'Good match'
    },
    { 
      name: 'Risk Areas', 
      value: compatibility.riskAreas.length,
      icon: ExclamationTriangleIcon,
      color: 'text-yellow-600',
      change: '2 medium risks'
    },
    { 
      name: 'Integration Days', 
      value: compatibility.integrationPlan.timeline, 
      icon: ClockIcon,
      color: 'text-purple-600',
      change: '90-day plan'
    },
  ];

  const renderRadarChart = (dimensions: any, title: string, color: string) => {
    const size = 200;
    const center = size / 2;
    const radius = 80;
    const angleStep = (Math.PI * 2) / 8;
    
    const dimensionKeys = [
      'powerDistance',
      'individualismVsCollectivism', 
      'uncertaintyAvoidance',
      'longTermOrientation',
      'innovationVsStability',
      'processVsResults',
      'riskTolerance',
      'transparencyVsConfidentiality'
    ];
    
    const points = dimensionKeys.map((key, index) => {
      const angle = index * angleStep - Math.PI / 2;
      const value = dimensions[key] / 100;
      const x = center + Math.cos(angle) * radius * value;
      const y = center + Math.sin(angle) * radius * value;
      return `${x},${y}`;
    }).join(' ');
    
    const gridCircles = [0.2, 0.4, 0.6, 0.8, 1.0].map(scale => (
      <circle
        key={scale}
        cx={center}
        cy={center}
        r={radius * scale}
        fill="none"
        stroke="#e5e7eb"
        strokeWidth="1"
      />
    ));
    
    const axisLines = dimensionKeys.map((_, index) => {
      const angle = index * angleStep - Math.PI / 2;
      const x2 = center + Math.cos(angle) * radius;
      const y2 = center + Math.sin(angle) * radius;
      return (
        <line
          key={index}
          x1={center}
          y1={center}
          x2={x2}
          y2={y2}
          stroke="#e5e7eb"
          strokeWidth="1"
        />
      );
    });
    
    return (
      <div className="text-center">
        <h4 className="text-sm font-medium text-gray-900 mb-3">{title}</h4>
        <svg width={size} height={size} className="mx-auto">
          {gridCircles}
          {axisLines}
          <polygon
            points={points}
            fill={color}
            fillOpacity="0.3"
            stroke={color}
            strokeWidth="2"
          />
        </svg>
      </div>
    );
  };

  const renderCompatibilityBar = (dimension: DimensionCompatibility) => {
    const getColorClass = (score: number) => {
      if (score >= 80) return 'bg-green-500';
      if (score >= 60) return 'bg-yellow-500';
      if (score >= 40) return 'bg-orange-500';
      return 'bg-red-500';
    };
    
    return (
      <div key={dimension.dimension} className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">{dimension.dimension}</span>
          <span className="text-sm text-gray-500">{Math.round(dimension.compatibility)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${getColorClass(dimension.compatibility)}`}
            style={{ width: `${dimension.compatibility}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>Team: {dimension.teamScore}</span>
          <span>Company: {dimension.companyScore}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Culture Assessment</h1>
          <p className="text-gray-600">Cultural compatibility analysis and integration planning</p>
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
            onClick={() => setViewMode('profiles')}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${
              viewMode === 'profiles' 
                ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Profiles
          </button>
          <button
            onClick={() => setViewMode('compatibility')}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${
              viewMode === 'compatibility' 
                ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Compatibility
          </button>
          <button
            onClick={() => setViewMode('integration')}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${
              viewMode === 'integration' 
                ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Integration
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

      {/* Overview */}
      {viewMode === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Culture Radar Charts */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Culture Dimensions Comparison</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {renderRadarChart(
                profiles.find(p => p.entityType === 'team')?.cultureDimensions, 
                'GS QIS Team', 
                '#3b82f6'
              )}
              {renderRadarChart(
                profiles.find(p => p.entityType === 'company')?.cultureDimensions, 
                'Blackstone', 
                '#10b981'
              )}
            </div>
          </div>

          {/* Compatibility Summary */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Compatibility Analysis</h3>
            <div className="space-y-6">
              {/* Overall Score */}
              <div className="text-center">
                <div className="mx-auto w-24 h-24 relative">
                  <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#10b981"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - compatibility.overallScore / 100)}`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-gray-900">
                      {Math.round(compatibility.overallScore)}%
                    </span>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-600">Overall Compatibility</p>
                <p className="text-lg font-medium text-green-600 capitalize">{compatibility.compatibilityLevel}</p>
              </div>

              {/* Key Strengths */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Key Strengths</h4>
                <div className="space-y-2">
                  {compatibility.strengthAreas.slice(0, 2).map((strength, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-700">{strength.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk Areas */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Areas to Watch</h4>
                <div className="space-y-2">
                  {compatibility.riskAreas.slice(0, 2).map((risk, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-700">{risk.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profiles View */}
      {viewMode === 'profiles' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile List */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Culture Profiles</h3>
                <p className="text-sm text-gray-500">Detailed cultural assessments for teams and companies</p>
              </div>
              <div className="divide-y divide-gray-200">
                {profiles.map((profile) => (
                  <div
                    key={profile.id}
                    className={`p-6 cursor-pointer hover:bg-gray-50 ${
                      selectedProfile?.id === profile.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                    }`}
                    onClick={() => setSelectedProfile(profile)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          {profile.entityType === 'team' ? (
                            <UserGroupIcon className="h-6 w-6 text-blue-500" />
                          ) : (
                            <BuildingOfficeIcon className="h-6 w-6 text-green-500" />
                          )}
                          <h4 className="text-lg font-medium text-gray-900">
                            {profile.entityType === 'team' ? 'Goldman Sachs QIS Team' : 'Blackstone'}
                          </h4>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            profile.entityType === 'team' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {profile.entityType}
                          </span>
                        </div>
                        
                        <div className="mt-3 grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-sm text-gray-500">Innovation Focus:</span>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                              <div
                                className="bg-purple-500 h-2 rounded-full"
                                style={{ width: `${profile.cultureDimensions.innovationVsStability}%` }}
                              ></div>
                            </div>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">Risk Tolerance:</span>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                              <div
                                className="bg-red-500 h-2 rounded-full"
                                style={{ width: `${profile.cultureDimensions.riskTolerance}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-6 mt-3">
                          <div className="flex items-center space-x-1">
                            <HeartIcon className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {profile.coreValues.length} core values
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <ClockIcon className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              Assessed {profile.assessmentDate.toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <ShieldCheckIcon className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {profile.confidenceLevel}% confidence
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-1">
            {selectedProfile ? (
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Profile Details</h3>
                  <p className="text-sm text-gray-500 capitalize">{selectedProfile.entityType} culture analysis</p>
                </div>
                <div className="p-6 space-y-6">
                  {/* Core Values */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Core Values</h4>
                    <div className="space-y-3">
                      {selectedProfile.coreValues.slice(0, 3).map((value) => (
                        <div key={value.id} className="border-l-2 border-blue-200 pl-3">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900">{value.name}</p>
                            <span className="text-sm text-blue-600">{value.importance}%</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{value.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Leadership Style */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Leadership Style</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Approach</span>
                        <span className="text-sm font-medium text-gray-900 capitalize">
                          {selectedProfile.leadershipStyle.approach}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Accessibility</span>
                        <span className="text-sm font-medium text-gray-900">
                          {selectedProfile.leadershipStyle.accessibility}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Empowerment</span>
                        <span className="text-sm font-medium text-gray-900">
                          {selectedProfile.leadershipStyle.empowerment}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Team Dynamics (if team) */}
                  {selectedProfile.teamDynamics && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Team Dynamics</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Cohesion</span>
                          <span className="text-sm font-medium text-gray-900">
                            {selectedProfile.teamDynamics.cohesion}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Trust</span>
                          <span className="text-sm font-medium text-gray-900">
                            {selectedProfile.teamDynamics.trust}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Psychological Safety</span>
                          <span className="text-sm font-medium text-gray-900">
                            {selectedProfile.teamDynamics.psychologicalSafety}%
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Assessment Info */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Assessment Info</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>Method: {selectedProfile.assessmentMethod}</p>
                      <p>Confidence: {selectedProfile.confidenceLevel}%</p>
                      <p>Updated: {selectedProfile.lastUpdated.toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white shadow rounded-lg p-6">
                <div className="text-center text-gray-500">
                  <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Select a profile</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Choose a culture profile to view detailed analysis
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Compatibility View */}
      {viewMode === 'compatibility' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Dimension Compatibility */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Dimension Compatibility</h3>
            <div className="space-y-6">
              {compatibility.dimensionCompatibility.map(renderCompatibilityBar)}
            </div>
          </div>

          {/* Risk & Strength Analysis */}
          <div className="space-y-6">
            {/* Risks */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Risk Areas</h3>
              <div className="space-y-4">
                {compatibility.riskAreas.map((risk) => (
                  <div key={risk.id} className="border-l-4 border-yellow-400 pl-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900 capitalize">
                        {risk.category.replace(/_/g, ' ')}
                      </h4>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        risk.severity === 'high' ? 'bg-red-100 text-red-800' :
                        risk.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {risk.severity} risk
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{risk.description}</p>
                    <div className="mt-2">
                      <p className="text-xs text-gray-500">Impact: {risk.impact}</p>
                      <p className="text-xs text-gray-500">Probability: {risk.probability}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strengths */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Strength Areas</h3>
              <div className="space-y-4">
                {compatibility.strengthAreas.map((strength) => (
                  <div key={strength.id} className="border-l-4 border-green-400 pl-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900">Cultural Synergy</h4>
                      <span className="text-sm font-medium text-green-600">
                        {strength.synergy}% potential
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{strength.description}</p>
                    <div className="mt-2">
                      <p className="text-xs text-gray-500">
                        Opportunities: {strength.leverageOpportunities.length} identified
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Integration View */}
      {viewMode === 'integration' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Integration Timeline */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Integration Plan</h3>
              <div className="space-y-6">
                {compatibility.integrationPlan.phases.map((phase, index) => (
                  <div key={phase.id} className="relative">
                    {index < compatibility.integrationPlan.phases.length - 1 && (
                      <div className="absolute left-4 top-8 w-0.5 h-full bg-gray-200"></div>
                    )}
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-medium text-gray-900">{phase.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{phase.description}</p>
                        <div className="mt-3 flex items-center space-x-4">
                          <span className="text-sm text-gray-500">
                            Duration: {phase.duration} days
                          </span>
                          <span className="text-sm text-gray-500">
                            Activities: {phase.activities.length}
                          </span>
                        </div>
                        
                        {/* Activities */}
                        <div className="mt-4 space-y-2">
                          {phase.activities.slice(0, 2).map((activity) => (
                            <div key={activity.id} className="bg-gray-50 rounded-lg p-3">
                              <div className="flex items-center justify-between">
                                <h5 className="text-sm font-medium text-gray-900">{activity.name}</h5>
                                <span className="text-xs text-gray-500 capitalize">
                                  {activity.type}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                              <div className="mt-2 flex items-center space-x-4">
                                <span className="text-xs text-gray-500">
                                  {activity.duration} hours
                                </span>
                                <span className="text-xs text-gray-500 capitalize">
                                  {activity.frequency}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Integration Resources */}
          <div className="lg:col-span-1 space-y-6">
            {/* Success Metrics */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Success Metrics</h3>
              <div className="space-y-3">
                {compatibility.integrationPlan.successMetrics.map((metric, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-700">{metric}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Resources Required */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Resources Required</h3>
              <div className="space-y-4">
                {compatibility.integrationPlan.resources.map((resource, index) => (
                  <div key={index} className="border-l-2 border-purple-200 pl-3">
                    <h4 className="text-sm font-medium text-gray-900 capitalize">
                      {resource.type.replace(/_/g, ' ')}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-gray-500">{resource.timeline}</span>
                      {resource.cost && (
                        <span className="text-xs font-medium text-purple-600">
                          ${resource.cost.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline Summary */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Integration Timeline</h4>
              <div className="space-y-1 text-sm text-blue-700">
                <p>Total Duration: {compatibility.integrationPlan.timeline} days</p>
                <p>Phases: {compatibility.integrationPlan.phases.length}</p>
                <p>Milestones: {compatibility.integrationPlan.milestones.length}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}