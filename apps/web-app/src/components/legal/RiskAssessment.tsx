'use client';

import { useState } from 'react';
import {
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  LightBulbIcon,
  CurrencyDollarIcon,
  ScaleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import {
  LegalRiskAssessment,
  LegalRisk,
  MitigationStrategy,
  mockLegalDocuments,
} from '@/lib/legal';

interface RiskAssessmentProps {
  assessment?: LegalRiskAssessment;
}

export function RiskAssessment({ assessment }: RiskAssessmentProps) {
  // Use assessment from mock data if not provided
  const riskAssessment = assessment || mockLegalDocuments[0]?.riskAssessment;
  const [selectedRisk, setSelectedRisk] = useState<LegalRisk | null>(null);

  if (!riskAssessment) {
    return (
      <div className="text-center py-12 bg-bg-surface rounded-lg border border-border">
        <ShieldCheckIcon className="h-12 w-12 text-text-tertiary mx-auto mb-4" />
        <h3 className="text-lg font-medium text-text-primary mb-2">No risk assessment available</h3>
        <p className="text-text-secondary">Risk assessments will appear here once created</p>
      </div>
    );
  }

  const getRiskLevelStyle = (level: string) => {
    switch (level) {
      case 'critical':
        return { bg: 'bg-error', text: 'text-white', border: 'border-error' };
      case 'high':
        return { bg: 'bg-error-light', text: 'text-error-dark', border: 'border-error' };
      case 'medium':
        return { bg: 'bg-gold-100', text: 'text-gold-800', border: 'border-gold' };
      default:
        return { bg: 'bg-success-light', text: 'text-success-dark', border: 'border-success' };
    }
  };

  const getMitigationStatusStyle = (status: string) => {
    switch (status) {
      case 'mitigated':
        return 'text-success-dark bg-success-light';
      case 'in_progress':
        return 'text-navy-800 bg-navy-50';
      case 'accepted':
        return 'text-gold-800 bg-gold-100';
      default:
        return 'text-error-dark bg-error-light';
    }
  };

  // Group risks by category
  const risksByCategory = riskAssessment.risks.reduce((acc, risk) => {
    const category = risk.category.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(risk);
    return acc;
  }, {} as Record<string, LegalRisk[]>);

  const overallStyle = getRiskLevelStyle(riskAssessment.overallRisk);
  const totalCost = riskAssessment.mitigationPlan.reduce((sum, m) => sum + (m.cost || 0), 0);

  return (
    <div className="space-y-8">
      {/* Overall Risk Summary */}
      <div className={`card p-6 border-2 ${overallStyle.border}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 ${overallStyle.bg} rounded-lg flex items-center justify-center`}>
              <ExclamationTriangleIcon className={`h-6 w-6 ${overallStyle.text}`} />
            </div>
            <div>
              <h2 className="text-lg font-medium text-text-primary">Overall Risk Assessment</h2>
              <p className="text-sm text-text-tertiary">
                Assessed by {riskAssessment.assessedBy} on {new Date(riskAssessment.assessmentDate).toLocaleDateString()}
              </p>
            </div>
          </div>
          <span className={`inline-flex items-center px-4 py-2 rounded-lg text-base font-semibold ${overallStyle.bg} ${overallStyle.text}`}>
            {riskAssessment.overallRisk.toUpperCase()} RISK
          </span>
        </div>
      </div>

      {/* Risk Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          icon={ChartBarIcon}
          iconColor="text-navy"
          title="Total Risks"
          value={riskAssessment.risks.length}
          subtitle="Identified risks"
        />
        <MetricCard
          icon={ExclamationTriangleIcon}
          iconColor="text-error"
          title="High Priority"
          value={riskAssessment.risks.filter((r) => r.riskScore >= 50).length}
          subtitle="Require attention"
        />
        <MetricCard
          icon={LightBulbIcon}
          iconColor="text-gold"
          title="Mitigations"
          value={riskAssessment.mitigationPlan.length}
          subtitle="Planned strategies"
        />
        <MetricCard
          icon={CurrencyDollarIcon}
          iconColor="text-success"
          title="Est. Cost"
          value={`$${(totalCost / 1000000).toFixed(1)}M`}
          subtitle="Total mitigation cost"
        />
      </div>

      {/* Risk Matrix */}
      <div className="card p-6">
        <h3 className="text-lg font-medium text-text-primary mb-4">Risk Matrix</h3>
        <div className="grid grid-cols-5 gap-1">
          {/* Y-axis label */}
          <div className="col-span-1 flex flex-col justify-between py-2">
            <span className="text-xs text-text-tertiary">High Impact</span>
            <span className="text-xs text-text-tertiary">Low Impact</span>
          </div>
          {/* Matrix cells */}
          <div className="col-span-4 grid grid-cols-4 gap-1">
            {[80, 60, 40, 20].map((impact) =>
              [20, 40, 60, 80].map((likelihood) => {
                const cellRisks = riskAssessment.risks.filter(
                  (r) =>
                    r.impact >= impact - 20 &&
                    r.impact < impact &&
                    r.likelihood >= likelihood - 20 &&
                    r.likelihood < likelihood
                );
                const riskLevel =
                  impact >= 60 && likelihood >= 60
                    ? 'critical'
                    : impact >= 40 && likelihood >= 40
                      ? 'high'
                      : impact >= 20 && likelihood >= 20
                        ? 'medium'
                        : 'low';
                const cellStyle = getRiskLevelStyle(riskLevel);

                return (
                  <div
                    key={`${impact}-${likelihood}`}
                    className={`h-16 ${cellStyle.bg} bg-opacity-30 rounded flex items-center justify-center text-xs font-medium ${cellStyle.text}`}
                  >
                    {cellRisks.length > 0 && (
                      <span className="bg-white px-2 py-1 rounded shadow">
                        {cellRisks.length}
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
          {/* X-axis label */}
          <div className="col-span-1"></div>
          <div className="col-span-4 flex justify-between px-2">
            <span className="text-xs text-text-tertiary">Low Likelihood</span>
            <span className="text-xs text-text-tertiary">High Likelihood</span>
          </div>
        </div>
      </div>

      {/* Risks by Category */}
      <div className="card p-6">
        <h3 className="text-lg font-medium text-text-primary mb-4">Identified Risks</h3>
        <div className="space-y-6">
          {Object.entries(risksByCategory).map(([category, risks]) => (
            <div key={category}>
              <h4 className="text-base font-medium text-text-primary mb-3">{category}</h4>
              <div className="space-y-3">
                {risks.map((risk) => {
                  const riskStyle = getRiskLevelStyle(risk.riskScore >= 50 ? 'high' : risk.riskScore >= 25 ? 'medium' : 'low');
                  const isSelected = selectedRisk?.id === risk.id;

                  return (
                    <div
                      key={risk.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        isSelected ? 'border-navy ring-2 ring-navy-100' : 'border-border hover:border-border-hover'
                      }`}
                      onClick={() => setSelectedRisk(isSelected ? null : risk)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-base text-text-primary">{risk.description}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-xs text-text-tertiary">{risk.jurisdiction}</span>
                            <span className="text-xs text-text-tertiary">
                              Score: {risk.riskScore}
                            </span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getMitigationStatusStyle(risk.mitigationStatus)}`}>
                              {risk.mitigationStatus.replace(/_/g, ' ')}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-center">
                            <div className="text-xs text-text-tertiary">Likelihood</div>
                            <div className={`text-sm font-semibold ${riskStyle.text}`}>{risk.likelihood}%</div>
                          </div>
                          <div className="text-center mx-2">×</div>
                          <div className="text-center">
                            <div className="text-xs text-text-tertiary">Impact</div>
                            <div className={`text-sm font-semibold ${riskStyle.text}`}>{risk.impact}%</div>
                          </div>
                        </div>
                      </div>

                      {isSelected && risk.precedents && risk.precedents.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-border">
                          <p className="text-sm font-medium text-text-secondary mb-2">Legal Precedents:</p>
                          <ul className="list-disc list-inside text-sm text-text-tertiary">
                            {risk.precedents.map((p, i) => (
                              <li key={i}>{p}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mitigation Plan */}
      <div className="card p-6">
        <h3 className="text-lg font-medium text-text-primary mb-4">Mitigation Strategies</h3>
        <div className="space-y-4">
          {riskAssessment.mitigationPlan.map((mitigation) => (
            <MitigationCard key={mitigation.id} mitigation={mitigation} />
          ))}
        </div>
      </div>

      {/* Insurance Recommendations */}
      {riskAssessment.insuranceRecommendations.length > 0 && (
        <div className="card p-6">
          <h3 className="text-lg font-medium text-text-primary mb-4">Insurance Recommendations</h3>
          <ul className="space-y-3">
            {riskAssessment.insuranceRecommendations.map((rec, i) => (
              <li key={i} className="flex items-start">
                <ShieldCheckIcon className="h-5 w-5 text-navy mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-base text-text-secondary">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Next Review */}
      <div className="bg-navy-50 rounded-lg p-4 flex items-center justify-between">
        <div className="flex items-center">
          <ScaleIcon className="h-6 w-6 text-navy mr-3" />
          <div>
            <p className="text-sm font-medium text-navy-800">Next Risk Review</p>
            <p className="text-xs text-navy-600">
              Scheduled for {new Date(riskAssessment.nextReviewDate).toLocaleDateString()}
            </p>
          </div>
        </div>
        <button className="btn-outline text-sm">Schedule Review</button>
      </div>
    </div>
  );
}

interface MetricCardProps {
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  title: string;
  value: number | string;
  subtitle: string;
}

function MetricCard({ icon: Icon, iconColor, title, value, subtitle }: MetricCardProps) {
  return (
    <div className="card p-6">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <Icon className={`h-8 w-8 ${iconColor}`} />
        </div>
        <div className="ml-4">
          <p className="text-base font-medium text-text-tertiary">{title}</p>
          <p className="text-2xl font-semibold text-text-primary">{value}</p>
          <p className="text-xs text-text-tertiary">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

function MitigationCard({ mitigation }: { mitigation: MitigationStrategy }) {
  return (
    <div className="border border-border rounded-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <h4 className="text-base font-medium text-text-primary">{mitigation.strategy}</h4>
        <div className="flex items-center gap-2">
          <span className="text-sm text-text-tertiary">
            Effectiveness: {mitigation.effectiveness}%
          </span>
          <div className="w-16 bg-bg-alt rounded-full h-2">
            <div
              className="bg-success h-2 rounded-full"
              style={{ width: `${mitigation.effectiveness}%` }}
            ></div>
          </div>
        </div>
      </div>
      <p className="text-base text-text-secondary mb-3">{mitigation.implementation}</p>
      <div className="flex items-center gap-6 text-sm text-text-tertiary">
        <span className="flex items-center">
          <CurrencyDollarIcon className="h-4 w-4 mr-1" />
          ${mitigation.cost?.toLocaleString() || 0}
        </span>
        <span>Timeline: {mitigation.timeline}</span>
        <span>Responsible: {mitigation.responsible}</span>
      </div>
    </div>
  );
}
