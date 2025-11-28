'use client';

import { useState, useEffect } from 'react';
import {
  DueDiligenceWorkflow,
  DueDiligenceCheck,
  mockDueDiligenceWorkflow
} from '@/lib/due-diligence';
import {
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  CogIcon,
  ChartBarIcon,
  PlusIcon,
  PaperClipIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { Button, Badge, Skeleton, EmptyState } from '@/components/ui';

interface DueDiligenceChecklistProps {
  workflowId?: string;
}

export function DueDiligenceChecklist({ workflowId }: DueDiligenceChecklistProps) {
  const [workflow, setWorkflow] = useState<DueDiligenceWorkflow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedCheck, setExpandedCheck] = useState<string | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setWorkflow(mockDueDiligenceWorkflow);
      setIsLoading(false);
    }, 500);
  }, [workflowId]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} height="96px" className="rounded-lg" />
        ))}
      </div>
    );
  }

  if (!workflow) return null;

  const categories = [
    { key: 'all', name: 'All checks', icon: DocumentTextIcon },
    { key: 'team_validation', name: 'Team validation', icon: UserGroupIcon },
    { key: 'performance_verification', name: 'Performance verification', icon: ChartBarIcon },
    { key: 'cultural_assessment', name: 'Cultural assessment', icon: DocumentTextIcon },
    { key: 'risk_evaluation', name: 'Risk evaluation', icon: ShieldCheckIcon },
    { key: 'integration_planning', name: 'Integration planning', icon: CogIcon },
  ];

  const filteredChecks = selectedCategory === 'all'
    ? workflow.checks
    : workflow.checks.filter(check => check.category === selectedCategory);

  const getStatusIcon = (status: string, result?: string) => {
    if (status === 'completed') {
      if (result === 'pass') return <CheckCircleIcon className="h-5 w-5 text-success" />;
      if (result === 'conditional') return <ExclamationTriangleIcon className="h-5 w-5 text-warning" />;
      if (result === 'fail') return <ExclamationTriangleIcon className="h-5 w-5 text-error" />;
    }
    if (status === 'in_progress') return <ClockIcon className="h-5 w-5 text-navy" />;
    if (status === 'requires_attention') return <ExclamationTriangleIcon className="h-5 w-5 text-error" />;
    return <div className="h-5 w-5 border-2 border-border rounded-full"></div>;
  };

  const getStatusColor = (status: string, result?: string) => {
    if (status === 'completed') {
      if (result === 'pass') return 'border-l-success bg-success-light';
      if (result === 'conditional') return 'border-l-warning bg-warning-light';
      if (result === 'fail') return 'border-l-error bg-error-light';
    }
    if (status === 'in_progress') return 'border-l-navy bg-navy-50';
    if (status === 'requires_attention') return 'border-l-error bg-error-light';
    return 'border-l-border bg-bg-surface';
  };

  const getPriorityVariant = (priority: string): 'error' | 'warning' | 'success' | 'default' => {
    const variants = {
      high: 'error' as const,
      medium: 'warning' as const,
      low: 'success' as const,
    };
    return variants[priority as keyof typeof variants] || 'default';
  };

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="card">
        <div className="px-6 py-4">
          <h3 className="text-lg font-medium text-text-primary mb-4">Filter by category</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map(({ key, name, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium min-h-[44px] transition-colors duration-fast ${
                  selectedCategory === key
                    ? 'bg-navy-100 text-navy border border-navy-200'
                    : 'bg-bg-surface text-text-secondary border border-border hover:bg-bg-elevated'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Checklist */}
      <div className="space-y-4">
        {filteredChecks.map((check) => (
          <div
            key={check.id}
            className={`border-l-4 rounded-lg shadow-soft transition-all duration-base ${getStatusColor(check.status, check.result)}`}
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="flex-shrink-0 mt-1">
                    {getStatusIcon(check.status, check.result)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="text-lg font-medium text-text-primary">{check.title}</h4>
                      <Badge variant={getPriorityVariant(check.priority)}>
                        {check.priority}
                      </Badge>
                    </div>
                    <p className="text-text-secondary mb-3">{check.description}</p>

                    <div className="flex items-center flex-wrap gap-4 text-sm text-text-tertiary">
                      <span>Status: <span className="font-medium text-text-secondary">{check.status.replace(/_/g, ' ')}</span></span>
                      {check.assignedTo && (
                        <span>Assigned to: <span className="font-medium text-text-secondary">{check.assignedTo}</span></span>
                      )}
                      {check.dueDate && (
                        <span>Due: <span className="font-medium text-text-secondary">{new Date(check.dueDate).toLocaleDateString()}</span></span>
                      )}
                      {check.evidence && check.evidence.length > 0 && (
                        <span className="flex items-center">
                          <PaperClipIcon className="h-4 w-4 mr-1" />
                          {check.evidence.length} evidence
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setExpandedCheck(expandedCheck === check.id ? null : check.id)}
                  className="text-text-tertiary hover:text-text-primary p-2 touch-target transition-colors duration-fast"
                  aria-label={expandedCheck === check.id ? 'Collapse' : 'Expand'}
                >
                  <ChevronDownIcon
                    className={`h-5 w-5 transform transition-transform duration-fast ${expandedCheck === check.id ? 'rotate-180' : ''}`}
                  />
                </button>
              </div>

              {/* Expanded Details */}
              {expandedCheck === check.id && (
                <div className="mt-6 pt-6 border-t border-border">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Evidence */}
                    <div>
                      <h5 className="text-sm font-medium text-text-primary mb-3">Evidence & documentation</h5>
                      {check.evidence && check.evidence.length > 0 ? (
                        <div className="space-y-2">
                          {check.evidence.map((evidence) => (
                            <div key={evidence.id} className="flex items-center justify-between p-3 bg-bg-alt rounded-lg">
                              <div className="flex items-center space-x-3">
                                <DocumentTextIcon className="h-5 w-5 text-text-tertiary" />
                                <div>
                                  <p className="text-sm font-medium text-text-primary">{evidence.title}</p>
                                  <p className="text-xs text-text-tertiary">{evidence.type} • {evidence.uploadedBy}</p>
                                </div>
                              </div>
                              {evidence.verified && (
                                <CheckCircleIcon className="h-5 w-5 text-success" />
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6 border-2 border-dashed border-border rounded-lg">
                          <DocumentTextIcon className="mx-auto h-8 w-8 text-text-tertiary" />
                          <p className="mt-2 text-sm text-text-tertiary">No evidence uploaded</p>
                          <button className="mt-2 inline-flex items-center text-sm text-navy hover:text-navy-600 font-medium">
                            <PlusIcon className="h-4 w-4 mr-1" />
                            Add evidence
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Notes & Actions */}
                    <div>
                      <h5 className="text-sm font-medium text-text-primary mb-3">Notes & actions</h5>
                      {check.notes ? (
                        <div className="p-3 bg-bg-alt rounded-lg">
                          <p className="text-sm text-text-secondary">{check.notes}</p>
                        </div>
                      ) : (
                        <div className="text-center py-6 border-2 border-dashed border-border rounded-lg">
                          <p className="text-sm text-text-tertiary">No notes added</p>
                          <button className="mt-2 inline-flex items-center text-sm text-navy hover:text-navy-600 font-medium">
                            <PlusIcon className="h-4 w-4 mr-1" />
                            Add note
                          </button>
                        </div>
                      )}

                      <div className="mt-4 flex flex-wrap gap-2">
                        {check.status !== 'completed' && (
                          <>
                            <Button variant="primary" size="sm">
                              Mark complete
                            </Button>
                            <Button variant="outline" size="sm">
                              Needs attention
                            </Button>
                          </>
                        )}
                        <Button variant="ghost" size="sm">
                          Edit check
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredChecks.length === 0 && (
        <EmptyState
          icon={<DocumentTextIcon className="w-12 h-12" />}
          title="No checks found"
          description="Try selecting a different category filter."
        />
      )}
    </div>
  );
}
