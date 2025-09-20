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
} from '@heroicons/react/24/outline';

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
      <div className="animate-pulse space-y-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-200 rounded"></div>
        ))}
      </div>
    );
  }

  if (!workflow) return null;

  const categories = [
    { key: 'all', name: 'All Checks', icon: DocumentTextIcon },
    { key: 'team_validation', name: 'Team Validation', icon: UserGroupIcon },
    { key: 'performance_verification', name: 'Performance Verification', icon: ChartBarIcon },
    { key: 'cultural_assessment', name: 'Cultural Assessment', icon: DocumentTextIcon },
    { key: 'risk_evaluation', name: 'Risk Evaluation', icon: ShieldCheckIcon },
    { key: 'integration_planning', name: 'Integration Planning', icon: CogIcon },
  ];

  const filteredChecks = selectedCategory === 'all' 
    ? workflow.checks 
    : workflow.checks.filter(check => check.category === selectedCategory);

  const getStatusIcon = (status: string, result?: string) => {
    if (status === 'completed') {
      if (result === 'pass') return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      if (result === 'conditional') return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
      if (result === 'fail') return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
    }
    if (status === 'in_progress') return <ClockIcon className="h-5 w-5 text-blue-500" />;
    if (status === 'requires_attention') return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
    return <div className="h-5 w-5 border-2 border-gray-300 rounded-full"></div>;
  };

  const getStatusColor = (status: string, result?: string) => {
    if (status === 'completed') {
      if (result === 'pass') return 'border-l-green-500 bg-green-50';
      if (result === 'conditional') return 'border-l-yellow-500 bg-yellow-50';
      if (result === 'fail') return 'border-l-red-500 bg-red-50';
    }
    if (status === 'in_progress') return 'border-l-blue-500 bg-blue-50';
    if (status === 'requires_attention') return 'border-l-red-500 bg-red-50';
    return 'border-l-gray-300 bg-white';
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800',
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Filter by Category</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map(({ key, name, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                selectedCategory === key
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Icon className="h-4 w-4 mr-2" />
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* Checklist */}
      <div className="space-y-4">
        {filteredChecks.map((check) => (
          <div
            key={check.id}
            className={`border-l-4 rounded-lg shadow transition-all duration-200 ${getStatusColor(check.status, check.result)}`}
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="flex-shrink-0 mt-1">
                    {getStatusIcon(check.status, check.result)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="text-lg font-medium text-gray-900">{check.title}</h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadge(check.priority)}`}>
                        {check.priority}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{check.description}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Status: <span className="font-medium">{check.status.replace(/_/g, ' ')}</span></span>
                      {check.assignedTo && (
                        <span>Assigned to: <span className="font-medium">{check.assignedTo}</span></span>
                      )}
                      {check.dueDate && (
                        <span>Due: <span className="font-medium">{new Date(check.dueDate).toLocaleDateString()}</span></span>
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
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setExpandedCheck(expandedCheck === check.id ? null : check.id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg
                      className={`h-5 w-5 transform transition-transform ${expandedCheck === check.id ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedCheck === check.id && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Evidence */}
                    <div>
                      <h5 className="text-sm font-medium text-gray-900 mb-3">Evidence & Documentation</h5>
                      {check.evidence && check.evidence.length > 0 ? (
                        <div className="space-y-2">
                          {check.evidence.map((evidence) => (
                            <div key={evidence.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{evidence.title}</p>
                                  <p className="text-xs text-gray-500">{evidence.type} • {evidence.uploadedBy}</p>
                                </div>
                              </div>
                              {evidence.verified && (
                                <CheckCircleIcon className="h-5 w-5 text-green-500" />
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
                          <DocumentTextIcon className="mx-auto h-8 w-8 text-gray-400" />
                          <p className="mt-2 text-sm text-gray-500">No evidence uploaded</p>
                          <button className="mt-2 inline-flex items-center text-sm text-blue-600 hover:text-blue-500">
                            <PlusIcon className="h-4 w-4 mr-1" />
                            Add Evidence
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Notes & Actions */}
                    <div>
                      <h5 className="text-sm font-medium text-gray-900 mb-3">Notes & Actions</h5>
                      {check.notes ? (
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700">{check.notes}</p>
                        </div>
                      ) : (
                        <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
                          <p className="text-sm text-gray-500">No notes added</p>
                          <button className="mt-2 inline-flex items-center text-sm text-blue-600 hover:text-blue-500">
                            <PlusIcon className="h-4 w-4 mr-1" />
                            Add Note
                          </button>
                        </div>
                      )}

                      <div className="mt-4 flex space-x-2">
                        {check.status !== 'completed' && (
                          <>
                            <button className="btn-sm bg-green-600 text-white hover:bg-green-700">
                              Mark Complete
                            </button>
                            <button className="btn-sm bg-yellow-600 text-white hover:bg-yellow-700">
                              Needs Attention
                            </button>
                          </>
                        )}
                        <button className="btn-sm border border-gray-300 text-gray-700 hover:bg-gray-50">
                          Edit Check
                        </button>
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
        <div className="text-center py-12">
          <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No checks found</h3>
          <p className="mt-1 text-sm text-gray-500">Try selecting a different category filter.</p>
        </div>
      )}
    </div>
  );
}