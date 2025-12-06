'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
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
  applicationId?: string;
}

export function DueDiligenceChecklist({ workflowId, applicationId }: DueDiligenceChecklistProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedCheck, setExpandedCheck] = useState<string | null>(null);

  // Fetch from real API with fallback to mock data
  const { data: workflow, isLoading } = useQuery({
    queryKey: ['due-diligence-checklist', workflowId, applicationId],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        if (applicationId) params.set('applicationId', applicationId);

        const response = await fetch(`/api/due-diligence?${params}`);
        if (!response.ok) throw new Error('Failed to fetch');

        const result = await response.json();
        if (result.success && result.data) {
          return transformApiResponse(result.data);
        }
        throw new Error('No data');
      } catch {
        return mockDueDiligenceWorkflow;
      }
    },
    staleTime: 60000,
  });

  function transformApiResponse(apiData: any): DueDiligenceWorkflow {
    const checks = apiData.categories?.flatMap((category: any) =>
      category.items.map((item: any) => ({
        id: item.id,
        category: mapCategoryId(category.id),
        title: item.name,
        description: item.description,
        status: item.status === 'completed' ? 'completed' :
                item.status === 'in_progress' ? 'in_progress' :
                item.status === 'blocked' ? 'requires_attention' : 'pending',
        priority: item.priority === 'critical' ? 'high' : item.priority,
        evidence: item.evidence ? [{ id: '1', type: 'document' as const, title: item.evidence, description: '', uploadedBy: 'System', uploadedDate: new Date().toISOString(), verified: true, confidential: false }] : [],
      }))
    ) || mockDueDiligenceWorkflow.checks;

    return {
      id: apiData.id || 'workflow-1',
      teamId: apiData.team?.id || '',
      opportunityId: apiData.opportunity?.id || '',
      status: 'in_progress',
      startDate: apiData.timeline?.applicationDate || new Date().toISOString(),
      targetCompletionDate: apiData.timeline?.targetCompletionDate || new Date().toISOString(),
      riskLevel: apiData.risks?.length > 2 ? 'high' : apiData.risks?.length > 0 ? 'medium' : 'low',
      checks,
      keyFindings: apiData.nextActions?.map((a: any) => a.name) || [],
      recommendations: apiData.risks?.map((r: any) => r.description) || [],
      approvalStatus: 'pending',
    };
  }

  function mapCategoryId(id: string): DueDiligenceCheck['category'] {
    const mapping: Record<string, DueDiligenceCheck['category']> = {
      'team-verification': 'team_validation',
      'legal-review': 'risk_evaluation',
      'financial-review': 'performance_verification',
      'culture-fit': 'cultural_assessment',
      'documentation': 'integration_planning',
    };
    return mapping[id] || 'team_validation';
  }

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
                className={`inline-flex items-center px-4 py-3 rounded-lg text-base font-medium min-h-12 transition-colors duration-fast ${
                  selectedCategory === key
                    ? 'bg-navy-100 text-navy border border-navy-200'
                    : 'bg-bg-surface text-text-secondary border border-border hover:bg-bg-elevated'
                }`}
              >
                <Icon className="h-5 w-5 mr-2" />
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
                          <button onClick={() => toast.success('Feature coming soon')} className="mt-2 inline-flex items-center text-sm text-navy hover:text-navy-600 font-medium">
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
                          <button onClick={() => toast.success('Feature coming soon')} className="mt-2 inline-flex items-center text-sm text-navy hover:text-navy-600 font-medium">
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
