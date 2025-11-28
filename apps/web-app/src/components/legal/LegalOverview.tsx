'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import {
  DocumentTextIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  DocumentDuplicateIcon,
  ScaleIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';
import {
  LegalDocument,
  ComplianceCheck,
  LegalRiskAssessment,
  mockLegalDocuments,
} from '@/lib/legal';

interface LegalOverviewProps {
  documents?: LegalDocument[];
}

export function LegalOverview({ documents = mockLegalDocuments }: LegalOverviewProps) {
  const [isLoading] = useState(false);

  // Calculate summary metrics
  const totalDocuments = documents.length;
  const draftDocuments = documents.filter((d) => d.status === 'draft').length;
  const reviewDocuments = documents.filter((d) => d.status === 'review').length;
  const approvedDocuments = documents.filter((d) => d.status === 'approved' || d.status === 'executed').length;

  // Compliance summary
  const allComplianceChecks = documents.flatMap((d) => d.complianceChecks);
  const compliantCount = allComplianceChecks.filter((c) => c.status === 'compliant').length;
  const needsReviewCount = allComplianceChecks.filter((c) => c.status === 'needs_review').length;
  const nonCompliantCount = allComplianceChecks.filter((c) => c.status === 'non_compliant').length;

  // Risk summary
  const riskLevels = documents.map((d) => d.riskAssessment?.overallRisk).filter(Boolean);
  const highRiskCount = riskLevels.filter((r) => r === 'high' || r === 'critical').length;
  const mediumRiskCount = riskLevels.filter((r) => r === 'medium').length;

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-bg-alt rounded w-64"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-bg-alt rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          icon={DocumentTextIcon}
          iconColor="text-navy"
          title="Documents"
          value={totalDocuments}
          subtitle={`${draftDocuments} draft, ${reviewDocuments} in review`}
        />
        <MetricCard
          icon={ShieldCheckIcon}
          iconColor="text-success"
          title="Compliance"
          value={`${compliantCount}/${allComplianceChecks.length}`}
          subtitle={`${needsReviewCount} needs review`}
        />
        <MetricCard
          icon={ExclamationTriangleIcon}
          iconColor="text-gold"
          title="Risk Items"
          value={highRiskCount + mediumRiskCount}
          subtitle={`${highRiskCount} high priority`}
        />
        <MetricCard
          icon={CheckCircleIcon}
          iconColor="text-success"
          title="Approved"
          value={approvedDocuments}
          subtitle="Ready for execution"
        />
      </div>

      {/* Document Status Summary */}
      <div className="card p-6">
        <h3 className="text-lg font-bold text-text-primary mb-4">Document status</h3>
        <div className="space-y-4">
          <StatusBar label="Draft" count={draftDocuments} total={totalDocuments} color="bg-bg-alt" />
          <StatusBar label="In Review" count={reviewDocuments} total={totalDocuments} color="bg-gold-400" />
          <StatusBar label="Approved" count={approvedDocuments} total={totalDocuments} color="bg-success" />
        </div>
      </div>

      {/* Compliance Overview */}
      <div className="card p-6">
        <h3 className="text-lg font-bold text-text-primary mb-4">Compliance status by category</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {getComplianceCategories(allComplianceChecks).map((category) => (
            <ComplianceCategoryCard key={category.name} category={category} />
          ))}
        </div>
      </div>

      {/* Active Documents */}
      <div className="card p-6">
        <h3 className="text-lg font-bold text-text-primary mb-4">Active documents</h3>
        <div className="space-y-4">
          {documents.slice(0, 5).map((doc) => (
            <DocumentRow key={doc.id} document={doc} />
          ))}
        </div>
        {documents.length > 5 && (
          <button onClick={() => toast.success('Loading all documents...')} className="text-link mt-4">
            View all {documents.length} documents
          </button>
        )}
      </div>

      {/* Risk Summary */}
      {documents.some((d) => d.riskAssessment) && (
        <div className="card p-6">
          <h3 className="text-lg font-bold text-text-primary mb-4">Risk assessment summary</h3>
          <div className="space-y-4">
            {documents
              .filter((d) => d.riskAssessment)
              .slice(0, 3)
              .map((doc) => (
                <RiskSummaryRow key={doc.id} document={doc} />
              ))}
          </div>
        </div>
      )}
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
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-bg-alt flex items-center justify-center">
          <Icon className={`h-6 w-6 ${iconColor}`} aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-text-tertiary truncate">{title}</p>
          <p className="text-xl font-bold text-text-primary mt-1">{value}</p>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-border">
        <span className="text-sm font-normal text-text-tertiary">{subtitle}</span>
      </div>
    </div>
  );
}

function StatusBar({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-text-secondary">{label}</span>
        <span className="text-text-primary font-medium">{count}</span>
      </div>
      <div className="w-full bg-bg-alt rounded-full h-2">
        <div className={`${color} h-2 rounded-full`} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
}

function getComplianceCategories(checks: ComplianceCheck[]) {
  const categories = new Map<string, { compliant: number; total: number; highRisk: number }>();

  checks.forEach((check) => {
    const cat = check.category.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
    const current = categories.get(cat) || { compliant: 0, total: 0, highRisk: 0 };
    categories.set(cat, {
      compliant: current.compliant + (check.status === 'compliant' ? 1 : 0),
      total: current.total + 1,
      highRisk: current.highRisk + (check.riskLevel === 'high' || check.riskLevel === 'critical' ? 1 : 0),
    });
  });

  return Array.from(categories.entries()).map(([name, stats]) => ({
    name,
    ...stats,
    percentage: stats.total > 0 ? Math.round((stats.compliant / stats.total) * 100) : 0,
  }));
}

function ComplianceCategoryCard({ category }: { category: { name: string; compliant: number; total: number; highRisk: number; percentage: number } }) {
  const statusColor = category.percentage >= 80 ? 'text-success-dark bg-success-light' : category.percentage >= 50 ? 'text-gold-800 bg-gold-100' : 'text-error-dark bg-error-light';

  return (
    <div className="border border-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-text-primary">{category.name}</span>
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
          {category.percentage}%
        </span>
      </div>
      <p className="text-xs text-text-tertiary">
        {category.compliant}/{category.total} compliant
        {category.highRisk > 0 && <span className="text-error"> ({category.highRisk} high risk)</span>}
      </p>
    </div>
  );
}

function DocumentRow({ document }: { document: LegalDocument }) {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'approved':
      case 'executed':
        return 'text-success-dark bg-success-light';
      case 'review':
        return 'text-gold-800 bg-gold-100';
      case 'draft':
        return 'text-text-secondary bg-bg-alt';
      default:
        return 'text-text-secondary bg-bg-alt';
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border border-border rounded-xl hover:bg-bg-alt transition-colors duration-fast">
      <div className="flex items-center gap-4">
        <DocumentDuplicateIcon className="h-6 w-6 text-text-tertiary" aria-hidden="true" />
        <div>
          <h4 className="text-base font-bold text-text-primary">{document.title}</h4>
          <p className="text-sm font-normal text-text-tertiary">
            {document.type.replace(/_/g, ' ')} | {document.jurisdiction}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-xl text-xs font-bold ${getStatusStyle(document.status)}`}>
          {document.status.replace(/_/g, ' ')}
        </span>
        <button className="text-link text-sm font-bold min-h-12 px-2 transition-colors duration-fast">View</button>
      </div>
    </div>
  );
}

function RiskSummaryRow({ document }: { document: LegalDocument }) {
  const risk = document.riskAssessment;
  if (!risk) return null;

  const getRiskStyle = (level: string) => {
    switch (level) {
      case 'critical':
        return 'text-error-dark bg-error-light';
      case 'high':
        return 'text-error-dark bg-error-light';
      case 'medium':
        return 'text-gold-800 bg-gold-100';
      default:
        return 'text-success-dark bg-success-light';
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border border-border rounded-xl">
      <div className="flex items-center gap-4">
        <ScaleIcon className="h-6 w-6 text-text-tertiary" aria-hidden="true" />
        <div>
          <h4 className="text-base font-bold text-text-primary">{document.title}</h4>
          <p className="text-sm font-normal text-text-tertiary">{risk.risks.length} risks identified</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-xl text-xs font-bold ${getRiskStyle(risk.overallRisk)}`}>
          {risk.overallRisk.toUpperCase()} Risk
        </span>
        <button className="text-link text-sm font-bold min-h-12 px-2 transition-colors duration-fast">Details</button>
      </div>
    </div>
  );
}
