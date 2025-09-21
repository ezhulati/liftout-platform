'use client';

import { useState } from 'react';
import {
  ShieldCheckIcon,
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  PaperAirplaneIcon,
  EyeIcon,
  PencilSquareIcon,
  ArrowPathIcon,
  ChatBubbleLeftEllipsisIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

interface NDAWorkflow {
  id: string;
  title: string;
  type: 'mutual_exploration' | 'team_specific' | 'executive_level' | 'preliminary_discussion';
  status: 'draft' | 'sent' | 'under_review' | 'signed' | 'executed' | 'expired';
  parties: {
    requestor: { name: string; organization: string; role: string };
    recipient: { name: string; organization: string; role: string };
  };
  createdDate: Date;
  sentDate?: Date;
  signedDate?: Date;
  expiryDate?: Date;
  confidentialityPeriod: number; // years
  scope: string[];
  restrictions: string[];
  documents: {
    id: string;
    name: string;
    type: 'nda_document' | 'exhibits' | 'amendments';
    status: 'draft' | 'final' | 'signed';
    uploadDate: Date;
  }[];
  timeline: {
    id: string;
    event: string;
    date: Date;
    actor: string;
    status: 'completed' | 'pending' | 'overdue';
  }[];
  communications: {
    id: string;
    from: string;
    to: string;
    message: string;
    timestamp: Date;
    type: 'comment' | 'revision_request' | 'clarification';
  }[];
}

interface NDAWorkflowManagerProps {
  userType: 'individual' | 'company';
}

export function NDAWorkflowManager({ userType }: NDAWorkflowManagerProps) {
  const [selectedWorkflow, setSelectedWorkflow] = useState<NDAWorkflow | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'details' | 'create'>('list');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Mock NDA workflows for demo
  const workflows: NDAWorkflow[] = [
    {
      id: 'nda-wf-1',
      title: 'Goldman Sachs QIS Team Exploration',
      type: 'team_specific',
      status: 'signed',
      parties: {
        requestor: {
          name: 'Sarah Rodriguez',
          organization: 'Blackstone Alternative Asset Management',
          role: 'VP Talent Acquisition'
        },
        recipient: {
          name: 'Michael Chen',
          organization: 'Goldman Sachs Asset Management',
          role: 'Managing Director, QIS'
        }
      },
      createdDate: new Date('2024-09-10'),
      sentDate: new Date('2024-09-11'),
      signedDate: new Date('2024-09-13'),
      expiryDate: new Date('2027-09-13'),
      confidentialityPeriod: 3,
      scope: [
        'Team composition and individual roles',
        'Current compensation and benefits structure', 
        'Performance metrics and client relationships',
        'Technology stack and proprietary methodologies',
        'Potential transition timeline and logistics'
      ],
      restrictions: [
        'No disclosure to current employer or team members',
        'No use of information for competitive purposes',
        'No solicitation of other Goldman Sachs employees',
        'No sharing with third parties without written consent'
      ],
      documents: [
        {
          id: 'doc-1',
          name: 'Mutual NDA - Goldman QIS Team.pdf',
          type: 'nda_document',
          status: 'signed',
          uploadDate: new Date('2024-09-11')
        },
        {
          id: 'doc-2',
          name: 'Team Information Requirements.pdf',
          type: 'exhibits',
          status: 'final',
          uploadDate: new Date('2024-09-11')
        }
      ],
      timeline: [
        {
          id: 'timeline-1',
          event: 'NDA created and sent for review',
          date: new Date('2024-09-11'),
          actor: 'Sarah Rodriguez (Blackstone)',
          status: 'completed'
        },
        {
          id: 'timeline-2',
          event: 'NDA reviewed and signed by recipient',
          date: new Date('2024-09-13'),
          actor: 'Michael Chen (Goldman Sachs)',
          status: 'completed'
        },
        {
          id: 'timeline-3',
          event: 'Counter-signature completed',
          date: new Date('2024-09-13'),
          actor: 'Sarah Rodriguez (Blackstone)',
          status: 'completed'
        }
      ],
      communications: [
        {
          id: 'comm-1',
          from: 'Sarah Rodriguez',
          to: 'Michael Chen',
          message: 'Thank you for signing the NDA. I\'ll send over the initial discussion materials within 24 hours.',
          timestamp: new Date('2024-09-13T15:30:00'),
          type: 'comment'
        }
      ]
    },
    {
      id: 'nda-wf-2',
      title: 'MedTech AI Team Preliminary Discussions',
      type: 'preliminary_discussion',
      status: 'under_review',
      parties: {
        requestor: {
          name: 'David Kim',
          organization: 'Johnson & Johnson MedTech',
          role: 'Head of Strategic Acquisitions'
        },
        recipient: {
          name: 'Dr. Emily Watson',
          organization: 'Stanford Medical AI Lab',
          role: 'Principal Research Scientist'
        }
      },
      createdDate: new Date('2024-09-18'),
      sentDate: new Date('2024-09-19'),
      confidentialityPeriod: 2,
      scope: [
        'Medical AI research capabilities and publications',
        'Team composition and academic affiliations',
        'Technology transfer possibilities',
        'Potential collaboration or team acquisition models'
      ],
      restrictions: [
        'No disclosure to Stanford administration without consent',
        'No publication or presentation of shared information',
        'No contact with team members without lead approval'
      ],
      documents: [
        {
          id: 'doc-3',
          name: 'Preliminary Discussion NDA.pdf',
          type: 'nda_document',
          status: 'draft',
          uploadDate: new Date('2024-09-19')
        }
      ],
      timeline: [
        {
          id: 'timeline-4',
          event: 'NDA sent for review',
          date: new Date('2024-09-19'),
          actor: 'David Kim (J&J)',
          status: 'completed'
        },
        {
          id: 'timeline-5',
          event: 'Review period (5 business days)',
          date: new Date('2024-09-26'),
          actor: 'Dr. Emily Watson (Stanford)',
          status: 'pending'
        }
      ],
      communications: [
        {
          id: 'comm-2',
          from: 'Dr. Emily Watson',
          to: 'David Kim',
          message: 'I need to clarify the scope regarding current research projects. Can we schedule a call?',
          timestamp: new Date('2024-09-20T10:15:00'),
          type: 'clarification'
        }
      ]
    },
    {
      id: 'nda-wf-3',
      title: 'Executive Level Strategic Discussion - Confidential',
      type: 'executive_level',
      status: 'sent',
      parties: {
        requestor: {
          name: 'James Richardson',
          organization: 'Blackstone Alternative Asset Management',
          role: 'Chief Human Resources Officer'
        },
        recipient: {
          name: 'Rachel Park',
          organization: 'KKR & Co.',
          role: 'Managing Director, Private Credit'
        }
      },
      createdDate: new Date('2024-09-20'),
      sentDate: new Date('2024-09-20'),
      confidentialityPeriod: 5,
      scope: [
        'Strategic team acquisition discussions',
        'Market intelligence and competitive landscape',
        'Potential partnership or collaboration models',
        'Confidential business strategies and plans'
      ],
      restrictions: [
        'Executive-level confidentiality - no delegation',
        'No disclosure to investment committees without consent',
        'No use for competitive advantage or deal sourcing'
      ],
      documents: [
        {
          id: 'doc-4',
          name: 'Executive Level NDA - Blackstone-KKR.pdf',
          type: 'nda_document',
          status: 'final',
          uploadDate: new Date('2024-09-20')
        }
      ],
      timeline: [
        {
          id: 'timeline-6',
          event: 'Executive NDA sent',
          date: new Date('2024-09-20'),
          actor: 'James Richardson (Blackstone)',
          status: 'completed'
        },
        {
          id: 'timeline-7',
          event: 'Response due',
          date: new Date('2024-09-25'),
          actor: 'Rachel Park (KKR)',
          status: 'pending'
        }
      ],
      communications: []
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'signed': return 'bg-green-100 text-green-800';
      case 'under_review': return 'bg-yellow-100 text-yellow-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'team_specific': return UserGroupIcon;
      case 'executive_level': return ShieldCheckIcon;
      case 'preliminary_discussion': return ChatBubbleLeftEllipsisIcon;
      default: return DocumentTextIcon;
    }
  };

  const filteredWorkflows = workflows.filter(workflow => {
    if (filterStatus === 'all') return true;
    return workflow.status === filterStatus;
  });

  const renderWorkflowList = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">NDA Workflow Management</h2>
          <p className="text-sm text-gray-600">Track and manage Non-Disclosure Agreements for liftout discussions</p>
        </div>
        <button
          onClick={() => setViewMode('create')}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <DocumentTextIcon className="h-4 w-4 mr-2" />
          Create NDA
        </button>
      </div>

      {/* Status Filter */}
      <div className="flex space-x-4">
        {['all', 'draft', 'sent', 'under_review', 'signed', 'expired'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-3 py-2 text-sm font-medium rounded-lg ${
              filterStatus === status
                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Workflow Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredWorkflows.map((workflow) => {
          const TypeIcon = getTypeIcon(workflow.type);
          const daysToExpiry = workflow.expiryDate 
            ? Math.ceil((workflow.expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
            : null;
          
          return (
            <div
              key={workflow.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => {
                setSelectedWorkflow(workflow);
                setViewMode('details');
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <TypeIcon className="h-6 w-6 text-blue-500" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{workflow.title}</h3>
                    <p className="text-sm text-gray-500 capitalize">{workflow.type.replace('_', ' ')}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(workflow.status)}`}>
                  {workflow.status.replace('_', ' ')}
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Parties:</span>
                  <span className="font-medium text-gray-900">
                    {workflow.parties.requestor.organization} ↔ {workflow.parties.recipient.organization}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Created:</span>
                  <span className="font-medium text-gray-900">{workflow.createdDate.toLocaleDateString()}</span>
                </div>
                
                {workflow.signedDate && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Signed:</span>
                    <span className="font-medium text-gray-900">{workflow.signedDate.toLocaleDateString()}</span>
                  </div>
                )}
                
                {daysToExpiry && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Expires in:</span>
                    <span className={`font-medium ${
                      daysToExpiry < 30 ? 'text-red-600' : daysToExpiry < 90 ? 'text-yellow-600' : 'text-gray-900'
                    }`}>
                      {daysToExpiry} days
                    </span>
                  </div>
                )}
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Documents:</span>
                  <span className="font-medium text-gray-900">{workflow.documents.length}</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {workflow.communications.length > 0 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {workflow.communications.length} messages
                      </span>
                    )}
                    {workflow.timeline.filter(t => t.status === 'pending').length > 0 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        {workflow.timeline.filter(t => t.status === 'pending').length} pending
                      </span>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedWorkflow(workflow);
                      setViewMode('details');
                    }}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <EyeIcon className="h-3 w-3 mr-1" />
                    View Details
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <DocumentTextIcon className="h-6 w-6 text-blue-600" />
            <div>
              <p className="text-sm text-blue-600">Active NDAs</p>
              <p className="text-lg font-semibold text-blue-900">
                {workflows.filter(w => ['sent', 'under_review', 'signed'].includes(w.status)).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <CheckCircleIcon className="h-6 w-6 text-green-600" />
            <div>
              <p className="text-sm text-green-600">Signed</p>
              <p className="text-lg font-semibold text-green-900">
                {workflows.filter(w => w.status === 'signed').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <ClockIcon className="h-6 w-6 text-yellow-600" />
            <div>
              <p className="text-sm text-yellow-600">Pending Review</p>
              <p className="text-lg font-semibold text-yellow-900">
                {workflows.filter(w => w.status === 'under_review').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <UserGroupIcon className="h-6 w-6 text-purple-600" />
            <div>
              <p className="text-sm text-purple-600">Team-Specific</p>
              <p className="text-lg font-semibold text-purple-900">
                {workflows.filter(w => w.type === 'team_specific').length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderWorkflowDetails = () => {
    if (!selectedWorkflow) return null;
    
    const TypeIcon = getTypeIcon(selectedWorkflow.type);
    
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <TypeIcon className="h-8 w-8 text-blue-500" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{selectedWorkflow.title}</h2>
              <p className="text-sm text-gray-600">
                {selectedWorkflow.type.replace('_', ' ')} • {selectedWorkflow.confidentialityPeriod} year confidentiality
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedWorkflow.status)}`}>
              {selectedWorkflow.status.replace('_', ' ')}
            </span>
            <button
              onClick={() => setViewMode('list')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Back to List
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Parties */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Parties</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Requesting Party</h4>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">{selectedWorkflow.parties.requestor.name}</p>
                      <p className="text-sm text-gray-600">{selectedWorkflow.parties.requestor.role}</p>
                      <p className="text-sm font-medium text-gray-900">{selectedWorkflow.parties.requestor.organization}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Recipient Party</h4>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">{selectedWorkflow.parties.recipient.name}</p>
                      <p className="text-sm text-gray-600">{selectedWorkflow.parties.recipient.role}</p>
                      <p className="text-sm font-medium text-gray-900">{selectedWorkflow.parties.recipient.organization}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Confidentiality Scope */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Confidentiality Scope</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Information Covered</h4>
                    <ul className="space-y-1">
                      {selectedWorkflow.scope.map((item, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start">
                          <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Restrictions & Obligations</h4>
                    <ul className="space-y-1">
                      {selectedWorkflow.restrictions.map((item, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start">
                          <XMarkIcon className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Timeline & Progress</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {selectedWorkflow.timeline.map((event, index) => (
                    <div key={event.id} className="flex items-start space-x-3">
                      <div className={`flex-shrink-0 w-3 h-3 mt-1 rounded-full ${
                        event.status === 'completed' ? 'bg-green-500' :
                        event.status === 'pending' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{event.event}</p>
                        <p className="text-sm text-gray-600">{event.actor}</p>
                        <p className="text-xs text-gray-500">{event.date.toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Communications */}
            {selectedWorkflow.communications.length > 0 && (
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Communications</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {selectedWorkflow.communications.map((comm) => (
                      <div key={comm.id} className="border-l-4 border-blue-500 pl-4">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-gray-900">{comm.from} → {comm.to}</p>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            comm.type === 'clarification' ? 'bg-yellow-100 text-yellow-800' :
                            comm.type === 'revision_request' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {comm.type.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{comm.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{comm.timestamp.toLocaleDateString()} at {comm.timestamp.toLocaleTimeString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Actions */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Actions</h3>
              </div>
              <div className="p-6 space-y-3">
                {selectedWorkflow.status === 'draft' && (
                  <button className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                    <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                    Send for Review
                  </button>
                )}
                {selectedWorkflow.status === 'under_review' && (
                  <button className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                    Mark as Signed
                  </button>
                )}
                <button className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  <PencilSquareIcon className="h-4 w-4 mr-2" />
                  Edit Details
                </button>
                <button className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  <ArrowPathIcon className="h-4 w-4 mr-2" />
                  Request Amendment
                </button>
              </div>
            </div>

            {/* Documents */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Documents</h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {selectedWorkflow.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                          <p className="text-xs text-gray-500">{doc.type.replace('_', ' ')}</p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        doc.status === 'signed' ? 'bg-green-100 text-green-800' :
                        doc.status === 'final' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {doc.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Key Dates */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Key Dates</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Created:</span>
                  <span className="text-sm font-medium text-gray-900">{selectedWorkflow.createdDate.toLocaleDateString()}</span>
                </div>
                {selectedWorkflow.sentDate && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Sent:</span>
                    <span className="text-sm font-medium text-gray-900">{selectedWorkflow.sentDate.toLocaleDateString()}</span>
                  </div>
                )}
                {selectedWorkflow.signedDate && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Signed:</span>
                    <span className="text-sm font-medium text-gray-900">{selectedWorkflow.signedDate.toLocaleDateString()}</span>
                  </div>
                )}
                {selectedWorkflow.expiryDate && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Expires:</span>
                    <span className="text-sm font-medium text-gray-900">{selectedWorkflow.expiryDate.toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {viewMode === 'list' && renderWorkflowList()}
      {viewMode === 'details' && renderWorkflowDetails()}
      {viewMode === 'create' && (
        <div className="text-center py-12">
          <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Create New NDA</h3>
          <p className="mt-1 text-sm text-gray-500">NDA creation wizard coming soon...</p>
          <button
            onClick={() => setViewMode('list')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Back to List
          </button>
        </div>
      )}
    </div>
  );
}