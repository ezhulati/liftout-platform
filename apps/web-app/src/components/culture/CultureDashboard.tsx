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
      name: 'Culture profiles',
      value: profiles.length,
      icon: UserGroupIcon,
      color: 'text-navy',
      change: '2 teams assessed'
    },
    {
      name: 'Compatibility score',
      value: `${Math.round(compatibility.overallScore)}%`,
      icon: HeartIcon,
      color: 'text-success',
      change: 'Good match'
    },
    {
      name: 'Risk areas',
      value: compatibility.riskAreas.length,
      icon: ExclamationTriangleIcon,
      color: 'text-gold',
      change: '2 medium risks'
    },
    {
      name: 'Integration days',
      value: compatibility.integrationPlan.timeline,
      icon: ClockIcon,
      color: 'text-gold',
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
        stroke="var(--color-border)"
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
          stroke="var(--color-border)"
          strokeWidth="1"
        />
      );
    });

    return (
      <div className="text-center">
        <h4 className="text-sm font-medium text-text-primary mb-3">{title}</h4>
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
      if (score >= 80) return 'bg-success';
      if (score >= 60) return 'bg-gold';
      if (score >= 40) return 'bg-gold';
      return 'bg-error';
    };

    return (
      <div key={dimension.dimension} className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-text-secondary">{dimension.dimension}</span>
          <span className="text-sm text-text-tertiary">{Math.round(dimension.compatibility)}%</span>
        </div>
        <div className="w-full bg-bg-alt rounded-full h-2">
          <div
            className={`h-2 rounded-full ${getColorClass(dimension.compatibility)}`}
            style={{ width: `${dimension.compatibility}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-text-tertiary">
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
          <h1 className="text-2xl font-bold text-text-primary">Culture assessment</h1>
          <p className="text-text-secondary">Cultural compatibility analysis and integration planning</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setViewMode('overview')}
            className={`px-4 py-2 text-sm font-medium rounded-lg min-h-11 ${
              viewMode === 'overview'
                ? 'bg-navy-50 text-navy border border-navy-200'
                : 'text-text-tertiary hover:text-text-primary'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setViewMode('profiles')}
            className={`px-4 py-2 text-sm font-medium rounded-lg min-h-11 ${
              viewMode === 'profiles'
                ? 'bg-navy-50 text-navy border border-navy-200'
                : 'text-text-tertiary hover:text-text-primary'
            }`}
          >
            Profiles
          </button>
          <button
            onClick={() => setViewMode('compatibility')}
            className={`px-4 py-2 text-sm font-medium rounded-lg min-h-11 ${
              viewMode === 'compatibility'
                ? 'bg-navy-50 text-navy border border-navy-200'
                : 'text-text-tertiary hover:text-text-primary'
            }`}
          >
            Compatibility
          </button>
          <button
            onClick={() => setViewMode('integration')}
            className={`px-4 py-2 text-sm font-medium rounded-lg min-h-11 ${
              viewMode === 'integration'
                ? 'bg-navy-50 text-navy border border-navy-200'
                : 'text-text-tertiary hover:text-text-primary'
            }`}
          >
            Integration
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

      {/* Overview */}
      {viewMode === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Culture Radar Charts */}
          <div className="card p-6">
            <h3 className="text-lg font-medium text-text-primary mb-6">Culture dimensions comparison</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {renderRadarChart(
                profiles.find(p => p.entityType === 'team')?.cultureDimensions,
                'GS QIS Team',
                'var(--color-navy)'
              )}
              {renderRadarChart(
                profiles.find(p => p.entityType === 'company')?.cultureDimensions,
                'Blackstone',
                'var(--color-success)'
              )}
            </div>
          </div>

          {/* Compatibility Summary */}
          <div className="card p-6">
            <h3 className="text-lg font-medium text-text-primary mb-6">Compatibility analysis</h3>
            <div className="space-y-6">
              {/* Overall Score */}
              <div className="text-center">
                <div className="mx-auto w-24 h-24 relative">
                  <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="var(--color-border)"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="var(--color-success)"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - compatibility.overallScore / 100)}`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-text-primary">
                      {Math.round(compatibility.overallScore)}%
                    </span>
                  </div>
                </div>
                <p className="mt-2 text-sm text-text-secondary">Overall compatibility</p>
                <p className="text-lg font-medium text-success capitalize">{compatibility.compatibilityLevel}</p>
              </div>

              {/* Key Strengths */}
              <div>
                <h4 className="text-sm font-medium text-text-primary mb-3">Key strengths</h4>
                <div className="space-y-2">
                  {compatibility.strengthAreas.slice(0, 2).map((strength, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <CheckCircleIcon className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-text-secondary">{strength.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk Areas */}
              <div>
                <h4 className="text-sm font-medium text-text-primary mb-3">Areas to watch</h4>
                <div className="space-y-2">
                  {compatibility.riskAreas.slice(0, 2).map((risk, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <ExclamationTriangleIcon className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-text-secondary">{risk.description}</p>
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
            <div className="card">
              <div className="px-6 py-4 border-b border-border">
                <h3 className="text-lg font-medium text-text-primary">Culture profiles</h3>
                <p className="text-sm text-text-tertiary">Detailed cultural assessments for teams and companies</p>
              </div>
              <div className="divide-y divide-border">
                {profiles.map((profile) => (
                  <div
                    key={profile.id}
                    className={`p-6 cursor-pointer hover:bg-bg-alt ${
                      selectedProfile?.id === profile.id ? 'bg-navy-50 border-l-4 border-navy' : ''
                    }`}
                    onClick={() => setSelectedProfile(profile)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          {profile.entityType === 'team' ? (
                            <UserGroupIcon className="h-6 w-6 text-navy" />
                          ) : (
                            <BuildingOfficeIcon className="h-6 w-6 text-success" />
                          )}
                          <h4 className="text-lg font-medium text-text-primary">
                            {profile.entityType === 'team' ? 'Goldman Sachs QIS Team' : 'Blackstone'}
                          </h4>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            profile.entityType === 'team' ? 'bg-navy-50 text-navy' : 'bg-success-light text-success-dark'
                          }`}>
                            {profile.entityType}
                          </span>
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-sm text-text-tertiary">Innovation focus:</span>
                            <div className="w-full bg-bg-alt rounded-full h-2 mt-1">
                              <div
                                className="bg-gold h-2 rounded-full"
                                style={{ width: `${profile.cultureDimensions.innovationVsStability}%` }}
                              ></div>
                            </div>
                          </div>
                          <div>
                            <span className="text-sm text-text-tertiary">Risk tolerance:</span>
                            <div className="w-full bg-bg-alt rounded-full h-2 mt-1">
                              <div
                                className="bg-error h-2 rounded-full"
                                style={{ width: `${profile.cultureDimensions.riskTolerance}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-6 mt-3">
                          <div className="flex items-center space-x-1">
                            <HeartIcon className="h-4 w-4 text-text-tertiary" />
                            <span className="text-sm text-text-secondary">
                              {profile.coreValues.length} core values
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <ClockIcon className="h-4 w-4 text-text-tertiary" />
                            <span className="text-sm text-text-secondary">
                              Assessed {profile.assessmentDate.toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <ShieldCheckIcon className="h-4 w-4 text-text-tertiary" />
                            <span className="text-sm text-text-secondary">
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
              <div className="card">
                <div className="px-6 py-4 border-b border-border">
                  <h3 className="text-lg font-medium text-text-primary">Profile details</h3>
                  <p className="text-sm text-text-tertiary capitalize">{selectedProfile.entityType} culture analysis</p>
                </div>
                <div className="p-6 space-y-6">
                  {/* Core Values */}
                  <div>
                    <h4 className="text-sm font-medium text-text-primary mb-3">Core values</h4>
                    <div className="space-y-3">
                      {selectedProfile.coreValues.slice(0, 3).map((value) => (
                        <div key={value.id} className="border-l-2 border-navy-200 pl-3">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-text-primary">{value.name}</p>
                            <span className="text-sm text-navy">{value.importance}%</span>
                          </div>
                          <p className="text-sm text-text-secondary mt-1">{value.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Leadership Style */}
                  <div>
                    <h4 className="text-sm font-medium text-text-primary mb-3">Leadership style</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-text-secondary">Approach</span>
                        <span className="text-sm font-medium text-text-primary capitalize">
                          {selectedProfile.leadershipStyle.approach}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-text-secondary">Accessibility</span>
                        <span className="text-sm font-medium text-text-primary">
                          {selectedProfile.leadershipStyle.accessibility}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-text-secondary">Empowerment</span>
                        <span className="text-sm font-medium text-text-primary">
                          {selectedProfile.leadershipStyle.empowerment}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Team Dynamics (if team) */}
                  {selectedProfile.teamDynamics && (
                    <div>
                      <h4 className="text-sm font-medium text-text-primary mb-3">Team dynamics</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-text-secondary">Cohesion</span>
                          <span className="text-sm font-medium text-text-primary">
                            {selectedProfile.teamDynamics.cohesion}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-text-secondary">Trust</span>
                          <span className="text-sm font-medium text-text-primary">
                            {selectedProfile.teamDynamics.trust}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-text-secondary">Psychological safety</span>
                          <span className="text-sm font-medium text-text-primary">
                            {selectedProfile.teamDynamics.psychologicalSafety}%
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Assessment Info */}
                  <div className="bg-bg-alt rounded-lg p-4">
                    <h4 className="text-sm font-medium text-text-primary mb-2">Assessment info</h4>
                    <div className="space-y-1 text-sm text-text-secondary">
                      <p>Method: {selectedProfile.assessmentMethod}</p>
                      <p>Confidence: {selectedProfile.confidenceLevel}%</p>
                      <p>Updated: {selectedProfile.lastUpdated.toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card p-6">
                <div className="text-center text-text-tertiary">
                  <UserGroupIcon className="mx-auto h-12 w-12 text-text-tertiary" />
                  <h3 className="mt-2 text-sm font-medium text-text-primary">Select a profile</h3>
                  <p className="mt-1 text-sm text-text-tertiary">
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
          <div className="card p-6">
            <h3 className="text-lg font-medium text-text-primary mb-6">Dimension compatibility</h3>
            <div className="space-y-6">
              {compatibility.dimensionCompatibility.map(renderCompatibilityBar)}
            </div>
          </div>

          {/* Risk & Strength Analysis */}
          <div className="space-y-6">
            {/* Risks */}
            <div className="card p-6">
              <h3 className="text-lg font-medium text-text-primary mb-4">Risk areas</h3>
              <div className="space-y-4">
                {compatibility.riskAreas.map((risk) => (
                  <div key={risk.id} className="border-l-4 border-gold pl-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-text-primary capitalize">
                        {risk.category.replace(/_/g, ' ')}
                      </h4>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        risk.severity === 'high' ? 'bg-error-light text-error-dark' :
                        risk.severity === 'medium' ? 'bg-gold-100 text-gold-800' :
                        'bg-success-light text-success-dark'
                      }`}>
                        {risk.severity} risk
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary mt-1">{risk.description}</p>
                    <div className="mt-2">
                      <p className="text-xs text-text-tertiary">Impact: {risk.impact}</p>
                      <p className="text-xs text-text-tertiary">Probability: {risk.probability}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strengths */}
            <div className="card p-6">
              <h3 className="text-lg font-medium text-text-primary mb-4">Strength areas</h3>
              <div className="space-y-4">
                {compatibility.strengthAreas.map((strength) => (
                  <div key={strength.id} className="border-l-4 border-success pl-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-text-primary">Cultural synergy</h4>
                      <span className="text-sm font-medium text-success">
                        {strength.synergy}% potential
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary mt-1">{strength.description}</p>
                    <div className="mt-2">
                      <p className="text-xs text-text-tertiary">
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
            <div className="card p-6">
              <h3 className="text-lg font-medium text-text-primary mb-6">Integration plan</h3>
              <div className="space-y-6">
                {compatibility.integrationPlan.phases.map((phase, index) => (
                  <div key={phase.id} className="relative">
                    {index < compatibility.integrationPlan.phases.length - 1 && (
                      <div className="absolute left-4 top-8 w-0.5 h-full bg-border"></div>
                    )}
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-navy-50 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-navy">{index + 1}</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-medium text-text-primary">{phase.name}</h4>
                        <p className="text-sm text-text-secondary mt-1">{phase.description}</p>
                        <div className="mt-3 flex items-center space-x-4">
                          <span className="text-sm text-text-tertiary">
                            Duration: {phase.duration} days
                          </span>
                          <span className="text-sm text-text-tertiary">
                            Activities: {phase.activities.length}
                          </span>
                        </div>

                        {/* Activities */}
                        <div className="mt-4 space-y-2">
                          {phase.activities.slice(0, 2).map((activity) => (
                            <div key={activity.id} className="bg-bg-alt rounded-lg p-3">
                              <div className="flex items-center justify-between">
                                <h5 className="text-sm font-medium text-text-primary">{activity.name}</h5>
                                <span className="text-xs text-text-tertiary capitalize">
                                  {activity.type}
                                </span>
                              </div>
                              <p className="text-sm text-text-secondary mt-1">{activity.description}</p>
                              <div className="mt-2 flex items-center space-x-4">
                                <span className="text-xs text-text-tertiary">
                                  {activity.duration} hours
                                </span>
                                <span className="text-xs text-text-tertiary capitalize">
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
            <div className="card p-6">
              <h3 className="text-lg font-medium text-text-primary mb-4">Success metrics</h3>
              <div className="space-y-3">
                {compatibility.integrationPlan.successMetrics.map((metric, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <CheckCircleIcon className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-text-secondary">{metric}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Resources Required */}
            <div className="card p-6">
              <h3 className="text-lg font-medium text-text-primary mb-4">Resources required</h3>
              <div className="space-y-4">
                {compatibility.integrationPlan.resources.map((resource, index) => (
                  <div key={index} className="border-l-2 border-gold-200 pl-3">
                    <h4 className="text-sm font-medium text-text-primary capitalize">
                      {resource.type.replace(/_/g, ' ')}
                    </h4>
                    <p className="text-sm text-text-secondary mt-1">{resource.description}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-text-tertiary">{resource.timeline}</span>
                      {resource.cost && (
                        <span className="text-xs font-medium text-gold">
                          ${resource.cost.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline Summary */}
            <div className="bg-navy-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-navy mb-2">Integration timeline</h4>
              <div className="space-y-1 text-sm text-navy-800">
                <p>Total duration: {compatibility.integrationPlan.timeline} days</p>
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