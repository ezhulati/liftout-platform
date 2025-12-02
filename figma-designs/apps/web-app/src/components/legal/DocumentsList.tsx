'use client';

import { useState } from 'react';
import {
  DocumentTextIcon,
  DocumentDuplicateIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  PencilIcon,
  CheckCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { LegalDocument, DocumentType, mockLegalDocuments } from '@/lib/legal';

interface DocumentsListProps {
  documents?: LegalDocument[];
  onSelectDocument?: (document: LegalDocument) => void;
}

const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  employment_agreement: 'Employment Agreement',
  non_disclosure_agreement: 'NDA',
  non_compete_waiver: 'Non-Compete Waiver',
  team_liftout_agreement: 'Liftout Agreement',
  compensation_agreement: 'Compensation Agreement',
  intellectual_property_assignment: 'IP Assignment',
  garden_leave_agreement: 'Garden Leave',
  retention_bonus_agreement: 'Retention Bonus',
  consulting_transition_agreement: 'Transition Agreement',
  settlement_agreement: 'Settlement',
};

export function DocumentsList({ documents = mockLegalDocuments, onSelectDocument }: DocumentsListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Filter documents
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      searchQuery === '' ||
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    const matchesType = typeFilter === 'all' || doc.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'approved':
      case 'executed':
        return 'text-success-dark bg-success-light';
      case 'review':
        return 'text-navy-800 bg-navy-50';
      case 'draft':
        return 'text-text-secondary bg-bg-alt';
      case 'expired':
        return 'text-error-dark bg-error-light';
      default:
        return 'text-text-secondary bg-bg-alt';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
      case 'executed':
        return CheckCircleIcon;
      case 'review':
        return ClockIcon;
      default:
        return DocumentTextIcon;
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar - Practical UI: 48px touch targets */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-tertiary" aria-hidden="true" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-navy focus:border-navy bg-bg-surface min-h-12"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-3 border border-border rounded-xl text-text-secondary hover:bg-bg-alt min-h-12 font-bold transition-colors duration-fast"
        >
          <FunnelIcon className="h-5 w-5" aria-hidden="true" />
          Filters
          {(statusFilter !== 'all' || typeFilter !== 'all') && (
            <span className="ml-2 bg-navy text-white text-xs font-bold rounded-full px-2 py-0.5">
              {[statusFilter !== 'all', typeFilter !== 'all'].filter(Boolean).length}
            </span>
          )}
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-bg-alt p-4 rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-text-secondary mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="review">In Review</option>
              <option value="approved">Approved</option>
              <option value="executed">Executed</option>
              <option value="expired">Expired</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-text-secondary mb-2">Document type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Types</option>
              {Object.entries(DOCUMENT_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Results Count */}
      <p className="text-sm text-text-tertiary">
        Showing {filteredDocuments.length} of {documents.length} documents
      </p>

      {/* Documents Grid */}
      {filteredDocuments.length === 0 ? (
        <div className="text-center py-12 bg-bg-surface rounded-xl border border-border">
          <DocumentDuplicateIcon className="h-12 w-12 text-text-tertiary mx-auto mb-4" aria-hidden="true" />
          <h3 className="text-lg font-bold text-text-primary mb-2">No documents found</h3>
          <p className="text-base font-normal text-text-secondary">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredDocuments.map((doc) => {
            const StatusIcon = getStatusIcon(doc.status);
            return (
              <div
                key={doc.id}
                className="bg-bg-surface rounded-xl border border-border p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onSelectDocument?.(doc)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-navy-50 rounded-xl flex items-center justify-center">
                      <DocumentTextIcon className="h-5 w-5 text-navy" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-text-primary">{doc.title}</h3>
                      <p className="text-sm text-text-tertiary mt-1">{doc.description}</p>
                      <div className="flex items-center gap-4 mt-3">
                        <span className="text-xs text-text-tertiary">
                          {DOCUMENT_TYPE_LABELS[doc.type] || doc.type}
                        </span>
                        <span className="text-xs text-text-tertiary">|</span>
                        <span className="text-xs text-text-tertiary">{doc.jurisdiction}</span>
                        <span className="text-xs text-text-tertiary">|</span>
                        <span className="text-xs text-text-tertiary">
                          v{doc.version}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(doc.status)}`}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {doc.status.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                    </span>
                    <span className="text-xs text-text-tertiary">
                      Modified {new Date(doc.lastModified).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Document Stats */}
                <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-1 text-sm text-text-tertiary">
                      <CheckCircleIcon className="h-4 w-4" aria-hidden="true" />
                      {doc.complianceChecks.filter((c) => c.status === 'compliant').length}/{doc.complianceChecks.length} compliant
                    </div>
                    <div className="flex items-center gap-1 text-sm text-text-tertiary">
                      <ClockIcon className="h-4 w-4" aria-hidden="true" />
                      {doc.reviewers.filter((r) => r.status === 'completed').length}/{doc.reviewers.length} reviewed
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="p-2 min-h-10 min-w-10 text-text-tertiary hover:text-text-primary transition-colors duration-fast rounded-lg hover:bg-bg-alt"
                      onClick={(e) => {
                        e.stopPropagation();
                        // View document
                      }}
                      title="View"
                    >
                      <EyeIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                    <button
                      className="p-2 min-h-10 min-w-10 text-text-tertiary hover:text-text-primary transition-colors duration-fast rounded-lg hover:bg-bg-alt"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Edit document
                      }}
                      title="Edit"
                    >
                      <PencilIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                    <button
                      className="p-2 min-h-10 min-w-10 text-text-tertiary hover:text-text-primary transition-colors duration-fast rounded-lg hover:bg-bg-alt"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Download document
                      }}
                      title="Download"
                    >
                      <ArrowDownTrayIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
