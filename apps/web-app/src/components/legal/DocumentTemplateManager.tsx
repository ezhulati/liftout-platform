'use client';

import { useState } from 'react';
import {
  DocumentTextIcon,
  PlusIcon,
  PencilIcon,
  EyeIcon,
  ClockIcon,
  ScaleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  DocumentDuplicateIcon,
  BeakerIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { DocumentTemplate, TemplateVariable, DocumentType } from '@/lib/legal';

interface DocumentTemplateManagerProps {
  userType: 'individual' | 'company';
}

export function DocumentTemplateManager({ userType }: DocumentTemplateManagerProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'create' | 'edit' | 'preview'>('list');
  const [templateType, setTemplateType] = useState<DocumentType>('non_disclosure_agreement');

  // Mock templates for demo
  const templates: DocumentTemplate[] = [
    {
      id: 'template-nda-mutual',
      name: 'Mutual NDA for Liftout Discussions',
      type: 'non_disclosure_agreement',
      jurisdiction: 'Delaware',
      lastUpdated: new Date('2024-09-15'),
      sections: [
        {
          id: 'sec-1',
          title: 'Parties and Purpose',
          content: 'This Mutual Non-Disclosure Agreement is entered into between {{party1Name}} and {{party2Name}} for the purpose of exploring potential team acquisition opportunities.',
          order: 1,
          required: true
        },
        {
          id: 'sec-2', 
          title: 'Confidential Information Definition',
          content: 'Confidential Information includes team composition, compensation structures, performance metrics, client relationships, and strategic business information.',
          order: 2,
          required: true
        },
        {
          id: 'sec-3',
          title: 'Non-Disclosure Obligations',
          content: 'Each party agrees to maintain strict confidentiality for a period of {{duration}} years from the date of disclosure.',
          order: 3,
          required: true
        }
      ],
      variables: [
        {
          id: 'var-1',
          name: 'party1Name',
          type: 'text',
          required: true,
          description: 'Name of the first party (usually the hiring company)'
        },
        {
          id: 'var-2',
          name: 'party2Name', 
          type: 'text',
          required: true,
          description: 'Name of the second party (team or current employer)'
        },
        {
          id: 'var-3',
          name: 'duration',
          type: 'number',
          required: true,
          description: 'Duration of confidentiality in years',
          defaultValue: 3,
          validation: { min: 1, max: 10 }
        }
      ],
      legalReview: {
        reviewedBy: 'Sarah Kim, Partner - Employment Law',
        reviewDate: new Date('2024-09-01'),
        nextReviewDue: new Date('2025-03-01'),
        complianceNotes: ['Updated for multi-state liftout scenarios', 'Enhanced team-specific confidentiality clauses']
      }
    },
    {
      id: 'template-employment',
      name: 'Executive Employment Agreement - Liftout',
      type: 'employment_agreement',
      jurisdiction: 'New York',
      lastUpdated: new Date('2024-09-10'),
      sections: [
        {
          id: 'emp-1',
          title: 'Position and Team Integration',
          content: 'Employee will serve as {{position}} and will lead the {{teamName}} team consisting of {{teamSize}} members.',
          order: 1,
          required: true
        },
        {
          id: 'emp-2',
          title: 'Compensation Package',
          content: 'Base salary: ${{baseSalary}}, Signing bonus: ${{signingBonus}}, Equity grant: {{equityShares}} shares',
          order: 2,
          required: true
        },
        {
          id: 'emp-3',
          title: 'Garden Leave Mitigation',
          content: 'Company will provide garden leave coverage of ${{gardenLeaveAmount}} for {{gardenLeavePeriod}} months if applicable.',
          order: 3,
          required: false,
          conditional: { field: 'hasNonCompete', value: true }
        }
      ],
      variables: [
        {
          id: 'emp-var-1',
          name: 'position',
          type: 'text',
          required: true,
          description: 'Job title and position'
        },
        {
          id: 'emp-var-2',
          name: 'baseSalary',
          type: 'currency',
          required: true,
          description: 'Annual base salary'
        },
        {
          id: 'emp-var-3',
          name: 'hasNonCompete',
          type: 'boolean',
          required: true,
          description: 'Whether employee has existing non-compete restrictions'
        }
      ],
      legalReview: {
        reviewedBy: 'David Chen, Senior Associate',
        reviewDate: new Date('2024-09-10'),
        nextReviewDue: new Date('2025-01-10'),
        complianceNotes: ['Added garden leave provisions', 'Updated for NY employment law changes']
      }
    },
    {
      id: 'template-team-liftout',
      name: 'Multi-Member Team Liftout Agreement',
      type: 'team_liftout_agreement',
      jurisdiction: 'Delaware',
      lastUpdated: new Date('2024-09-20'),
      sections: [
        {
          id: 'team-1',
          title: 'Team Definition and Structure',
          content: 'This agreement covers the acquisition of {{teamName}} consisting of {{teamMembers}} professionals.',
          order: 1,
          required: true
        },
        {
          id: 'team-2',
          title: 'Collective Transition Terms',
          content: 'All team members will transition simultaneously on {{startDate}} with coordinated onboarding.',
          order: 2,
          required: true
        },
        {
          id: 'team-3',
          title: 'Risk Mitigation and Legal Costs',
          content: 'Company will bear legal defense costs up to ${{legalCostCap}} per team member for non-compete disputes.',
          order: 3,
          required: true
        }
      ],
      variables: [
        {
          id: 'team-var-1',
          name: 'teamName',
          type: 'text',
          required: true,
          description: 'Name or description of the team'
        },
        {
          id: 'team-var-2',
          name: 'teamMembers',
          type: 'number',
          required: true,
          description: 'Number of team members',
          validation: { min: 2, max: 50 }
        },
        {
          id: 'team-var-3',
          name: 'legalCostCap',
          type: 'currency',
          required: true,
          description: 'Maximum legal defense cost per team member',
          defaultValue: 500000
        }
      ],
      legalReview: {
        reviewedBy: 'Partnership Review Committee',
        reviewDate: new Date('2024-09-20'),
        nextReviewDue: new Date('2025-06-20'),
        complianceNotes: ['Comprehensive multi-state compliance review', 'Enhanced IP protection clauses']
      }
    }
  ];

  const documentTypes = [
    { value: 'non_disclosure_agreement', label: 'Non-Disclosure Agreement', icon: ShieldCheckIcon },
    { value: 'employment_agreement', label: 'Employment Agreement', icon: DocumentTextIcon },
    { value: 'team_liftout_agreement', label: 'Team Liftout Agreement', icon: DocumentDuplicateIcon },
    { value: 'non_compete_waiver', label: 'Non-Compete Waiver', icon: ScaleIcon },
    { value: 'garden_leave_agreement', label: 'Garden Leave Agreement', icon: ClockIcon },
  ];

  const getStatusColor = (reviewDate: Date, nextReviewDue: Date) => {
    const now = new Date();
    const daysUntilReview = Math.ceil((nextReviewDue.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilReview < 0) return 'bg-red-100 text-red-800';
    if (daysUntilReview < 30) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const renderTemplateList = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Document Templates</h2>
          <p className="text-sm text-gray-600">Manage legal document templates for liftout transactions</p>
        </div>
        <button
          onClick={() => setViewMode('create')}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Create Template
        </button>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => {
          const reviewStatus = getStatusColor(template.legalReview.reviewDate, template.legalReview.nextReviewDue);
          const documentTypeInfo = documentTypes.find(dt => dt.value === template.type);
          
          return (
            <div
              key={template.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedTemplate(template)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {documentTypeInfo && (
                    <documentTypeInfo.icon className="h-6 w-6 text-blue-500" />
                  )}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{template.name}</h3>
                    <p className="text-sm text-gray-500">{documentTypeInfo?.label}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${reviewStatus}`}>
                  Current
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Jurisdiction:</span>
                  <span className="font-medium text-gray-900">{template.jurisdiction}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Sections:</span>
                  <span className="font-medium text-gray-900">{template.sections.length} sections</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Variables:</span>
                  <span className="font-medium text-gray-900">{template.variables.length} fields</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Last Updated:</span>
                  <span className="font-medium text-gray-900">{template.lastUpdated.toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTemplate(template);
                      setViewMode('preview');
                    }}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <EyeIcon className="h-3 w-3 mr-1" />
                    Preview
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTemplate(template);
                      setViewMode('edit');
                    }}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <PencilIcon className="h-3 w-3 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Clone template logic
                    }}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <DocumentDuplicateIcon className="h-3 w-3 mr-1" />
                    Clone
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Template Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <DocumentTextIcon className="h-6 w-6 text-blue-600" />
            <div>
              <p className="text-sm text-blue-600">Total Templates</p>
              <p className="text-lg font-semibold text-blue-900">{templates.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <CheckCircleIcon className="h-6 w-6 text-green-600" />
            <div>
              <p className="text-sm text-green-600">Up to Date</p>
              <p className="text-lg font-semibold text-green-900">
                {templates.filter(t => {
                  const daysUntilReview = Math.ceil((t.legalReview.nextReviewDue.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                  return daysUntilReview >= 30;
                }).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />
            <div>
              <p className="text-sm text-yellow-600">Review Soon</p>
              <p className="text-lg font-semibold text-yellow-900">
                {templates.filter(t => {
                  const daysUntilReview = Math.ceil((t.legalReview.nextReviewDue.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                  return daysUntilReview >= 0 && daysUntilReview < 30;
                }).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <BeakerIcon className="h-6 w-6 text-purple-600" />
            <div>
              <p className="text-sm text-purple-600">Most Used</p>
              <p className="text-lg font-semibold text-purple-900">NDA</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTemplatePreview = () => {
    if (!selectedTemplate) return null;
    
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{selectedTemplate.name}</h2>
            <p className="text-sm text-gray-600">Template Preview - {selectedTemplate.jurisdiction}</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setViewMode('edit')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <PencilIcon className="h-4 w-4 mr-2" />
              Edit Template
            </button>
            <button
              onClick={() => setViewMode('list')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Back to Templates
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Template Content */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Template Sections</h3>
              </div>
              <div className="p-6 space-y-6">
                {selectedTemplate.sections
                  .sort((a, b) => a.order - b.order)
                  .map((section) => (
                    <div key={section.id} className="border-l-4 border-blue-500 pl-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-md font-medium text-gray-900">{section.title}</h4>
                        <div className="flex items-center space-x-2">
                          {section.required && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Required
                            </span>
                          )}
                          {section.conditional && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Conditional
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 whitespace-pre-line">{section.content}</p>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>

          {/* Template Variables */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Variables */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Template Variables</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {selectedTemplate.variables.map((variable) => (
                      <div key={variable.id} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900">{{{{ {variable.name} }}}}</span>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            variable.required ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {variable.type}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">{variable.description}</p>
                        {variable.defaultValue && (
                          <p className="text-xs text-blue-600 mt-1">Default: {variable.defaultValue}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Legal Review Status */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Legal Review</h3>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Reviewed By</p>
                    <p className="text-sm text-gray-600">{selectedTemplate.legalReview.reviewedBy}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Review Date</p>
                    <p className="text-sm text-gray-600">{selectedTemplate.legalReview.reviewDate.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Next Review Due</p>
                    <p className="text-sm text-gray-600">{selectedTemplate.legalReview.nextReviewDue.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Compliance Notes</p>
                    <ul className="text-sm text-gray-600 list-disc list-inside">
                      {selectedTemplate.legalReview.complianceNotes.map((note, index) => (
                        <li key={index}>{note}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {viewMode === 'list' && renderTemplateList()}
      {viewMode === 'preview' && renderTemplatePreview()}
      {viewMode === 'create' && (
        <div className="text-center py-12">
          <BeakerIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Template Creation</h3>
          <p className="mt-1 text-sm text-gray-500">Template creation wizard coming soon...</p>
          <button
            onClick={() => setViewMode('list')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Back to Templates
          </button>
        </div>
      )}
      {viewMode === 'edit' && (
        <div className="text-center py-12">
          <PencilIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Template Editor</h3>
          <p className="mt-1 text-sm text-gray-500">Template editing interface coming soon...</p>
          <button
            onClick={() => setViewMode('list')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Back to Templates
          </button>
        </div>
      )}
    </div>
  );
}