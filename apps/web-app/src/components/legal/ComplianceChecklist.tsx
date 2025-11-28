'use client';

import { useState } from 'react';
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  ShieldCheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import {
  ComplianceCheck,
  ComplianceCategory,
  mockLegalDocuments,
} from '@/lib/legal';

interface ComplianceChecklistProps {
  checks?: ComplianceCheck[];
}

const CATEGORY_LABELS: Record<ComplianceCategory, string> = {
  employment_law: 'Employment Law',
  non_compete_restrictions: 'Non-Compete Restrictions',
  trade_secrets: 'Trade Secrets',
  data_protection: 'Data Protection',
  securities_law: 'Securities Law',
  antitrust: 'Antitrust',
  immigration: 'Immigration',
  tax_implications: 'Tax Implications',
  industry_regulations: 'Industry Regulations',
};

const CATEGORY_DESCRIPTIONS: Record<ComplianceCategory, string> = {
  employment_law: 'Employment contracts, notice periods, and worker protections',
  non_compete_restrictions: 'Non-compete clauses, garden leave, and restrictive covenants',
  trade_secrets: 'Confidentiality agreements and proprietary information protection',
  data_protection: 'GDPR, CCPA, and data privacy regulations',
  securities_law: 'SEC filings, insider trading, and securities regulations',
  antitrust: 'Competition law and market concentration considerations',
  immigration: 'Work visas, employment authorization, and immigration status',
  tax_implications: 'Tax withholding, reporting, and corporate tax considerations',
  industry_regulations: 'Industry-specific licensing and regulatory requirements',
};

export function ComplianceChecklist({ checks }: ComplianceChecklistProps) {
  // Get checks from mock data if not provided
  const allChecks = checks || mockLegalDocuments.flatMap((d) => d.complianceChecks);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Group checks by category
  const groupedChecks = allChecks.reduce((acc, check) => {
    const category = check.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(check);
    return acc;
  }, {} as Record<ComplianceCategory, ComplianceCheck[]>);

  // Calculate summary stats
  const totalChecks = allChecks.length;
  const compliantCount = allChecks.filter((c) => c.status === 'compliant').length;
  const needsReviewCount = allChecks.filter((c) => c.status === 'needs_review').length;
  const nonCompliantCount = allChecks.filter((c) => c.status === 'non_compliant').length;

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'compliant':
        return { bg: 'bg-success-light', text: 'text-success-dark', icon: CheckCircleIcon };
      case 'non_compliant':
        return { bg: 'bg-error-light', text: 'text-error-dark', icon: XCircleIcon };
      case 'needs_review':
        return { bg: 'bg-gold-100', text: 'text-gold-800', icon: ExclamationTriangleIcon };
      default:
        return { bg: 'bg-bg-alt', text: 'text-text-secondary', icon: ClockIcon };
    }
  };

  const getRiskStyle = (risk: string) => {
    switch (risk) {
      case 'critical':
        return 'bg-error text-white';
      case 'high':
        return 'bg-error-light text-error-dark';
      case 'medium':
        return 'bg-gold-100 text-gold-800';
      default:
        return 'bg-success-light text-success-dark';
    }
  };

  // Filter checks
  const filteredGroups = Object.entries(groupedChecks).map(([category, categoryChecks]) => ({
    category: category as ComplianceCategory,
    checks: statusFilter === 'all' ? categoryChecks : categoryChecks.filter((c) => c.status === statusFilter),
  })).filter((group) => group.checks.length > 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <SummaryCard
          label="Total Checks"
          value={totalChecks}
          icon={ShieldCheckIcon}
          color="text-navy"
        />
        <SummaryCard
          label="Compliant"
          value={compliantCount}
          icon={CheckCircleIcon}
          color="text-success"
          percentage={Math.round((compliantCount / totalChecks) * 100)}
        />
        <SummaryCard
          label="Needs Review"
          value={needsReviewCount}
          icon={ExclamationTriangleIcon}
          color="text-gold"
        />
        <SummaryCard
          label="Non-Compliant"
          value={nonCompliantCount}
          icon={XCircleIcon}
          color="text-error"
        />
      </div>

      {/* Filter */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-text-secondary">Filter:</label>
        <div className="flex gap-2">
          {['all', 'compliant', 'needs_review', 'non_compliant', 'not_applicable'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                statusFilter === status
                  ? 'bg-navy text-white'
                  : 'bg-bg-alt text-text-secondary hover:bg-bg-elevated'
              }`}
            >
              {status === 'all' ? 'All' : status.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
            </button>
          ))}
        </div>
      </div>

      {/* Checklist by Category */}
      <div className="space-y-4">
        {filteredGroups.map(({ category, checks: categoryChecks }) => {
          const isExpanded = expandedCategories.has(category);
          const categoryCompliant = categoryChecks.filter((c) => c.status === 'compliant').length;
          const categoryTotal = categoryChecks.length;

          return (
            <div key={category} className="bg-bg-surface rounded-lg border border-border overflow-hidden">
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category)}
                className="w-full flex items-center justify-between p-4 hover:bg-bg-alt transition-colors"
              >
                <div className="flex items-center space-x-3">
                  {isExpanded ? (
                    <ChevronDownIcon className="h-5 w-5 text-text-tertiary" />
                  ) : (
                    <ChevronRightIcon className="h-5 w-5 text-text-tertiary" />
                  )}
                  <div className="text-left">
                    <h3 className="text-base font-medium text-text-primary">
                      {CATEGORY_LABELS[category] || category}
                    </h3>
                    <p className="text-sm text-text-tertiary">
                      {CATEGORY_DESCRIPTIONS[category]}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-text-tertiary">
                    {categoryCompliant}/{categoryTotal} compliant
                  </span>
                  <div className="w-24 bg-bg-alt rounded-full h-2">
                    <div
                      className="bg-success h-2 rounded-full"
                      style={{ width: `${(categoryCompliant / categoryTotal) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </button>

              {/* Category Checks */}
              {isExpanded && (
                <div className="border-t border-border divide-y divide-border">
                  {categoryChecks.map((check) => {
                    const statusStyle = getStatusStyle(check.status);
                    const StatusIcon = statusStyle.icon;

                    return (
                      <div key={check.id} className="p-4 hover:bg-bg-alt transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <StatusIcon className={`h-5 w-5 mt-0.5 ${statusStyle.text}`} />
                            <div>
                              <p className="text-base text-text-primary">{check.requirement}</p>
                              <div className="flex items-center gap-3 mt-2">
                                <span className="text-xs text-text-tertiary">
                                  {check.jurisdiction}
                                </span>
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getRiskStyle(check.riskLevel)}`}>
                                  {check.riskLevel.toUpperCase()}
                                </span>
                                <span className="text-xs text-text-tertiary">
                                  Checked {new Date(check.checkDate).toLocaleDateString()}
                                </span>
                              </div>
                              {check.impact && (
                                <p className="text-sm text-text-secondary mt-2">{check.impact}</p>
                              )}
                            </div>
                          </div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                            {check.status.replace(/_/g, ' ')}
                          </span>
                        </div>

                        {/* Evidence and Remediation */}
                        {(check.evidence?.length || check.remediation?.length) && (
                          <div className="mt-4 ml-8 space-y-2">
                            {check.evidence && check.evidence.length > 0 && (
                              <div className="text-sm">
                                <span className="font-medium text-text-secondary">Evidence:</span>
                                <ul className="list-disc list-inside text-text-tertiary ml-2">
                                  {check.evidence.map((e, i) => (
                                    <li key={i}>{e}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {check.remediation && check.remediation.length > 0 && (
                              <div className="text-sm">
                                <span className="font-medium text-text-secondary">Remediation:</span>
                                <ul className="list-disc list-inside text-text-tertiary ml-2">
                                  {check.remediation.map((r, i) => (
                                    <li key={i}>{r}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredGroups.length === 0 && (
        <div className="text-center py-12 bg-bg-surface rounded-lg border border-border">
          <ShieldCheckIcon className="h-12 w-12 text-text-tertiary mx-auto mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">No compliance checks found</h3>
          <p className="text-text-secondary">No checks match the selected filter</p>
        </div>
      )}
    </div>
  );
}

interface SummaryCardProps {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  percentage?: number;
}

function SummaryCard({ label, value, icon: Icon, color, percentage }: SummaryCardProps) {
  return (
    <div className="card p-4">
      <div className="flex items-center">
        <Icon className={`h-8 w-8 ${color}`} />
        <div className="ml-4">
          <p className="text-sm text-text-tertiary">{label}</p>
          <p className="text-2xl font-semibold text-text-primary">
            {value}
            {percentage !== undefined && (
              <span className="text-sm font-normal text-text-tertiary ml-2">({percentage}%)</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
