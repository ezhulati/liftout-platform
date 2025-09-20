'use client';

import { useState } from 'react';
import { Reference, ReferenceResponse } from '@/lib/due-diligence';
import {
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  StarIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';

interface ReferenceManagerProps {
  teamId: string;
}

const mockReferences: Reference[] = [
  {
    id: 'ref-001',
    name: 'Sarah Chen',
    title: 'Managing Director',
    company: 'JP Morgan Chase',
    relationship: 'former_client',
    contactInfo: {
      email: 'sarah.chen@jpmorgan.com',
      phone: '+1 (212) 555-0123',
      linkedin: 'https://linkedin.com/in/sarahchen-jpmc',
    },
    status: 'responded',
    response: {
      overallRating: 9,
      workQuality: 9,
      teamCollaboration: 8,
      reliability: 10,
      leadership: 8,
      adaptability: 9,
      technicalSkills: 9,
      communicationSkills: 8,
      strengths: ['Exceptional analytical skills', 'Strong leadership under pressure', 'Innovative problem-solving'],
      areasForImprovement: ['Could improve client presentation skills', 'Sometimes overly perfectionist'],
      specificExamples: 'Led the risk assessment for our $2.3B acquisition. Delivered comprehensive analysis 2 weeks ahead of schedule with 99.7% accuracy on risk predictions.',
      wouldRecommend: true,
      additionalComments: 'This team consistently exceeded expectations. Their risk models helped us avoid significant losses during market volatility.',
      verifiedBy: 'Due Diligence Team',
      verificationDate: '2024-09-18T00:00:00Z',
    },
  },
  {
    id: 'ref-002',
    name: 'Michael Rodriguez',
    title: 'Chief Risk Officer',
    company: 'BlackRock',
    relationship: 'current_client',
    contactInfo: {
      email: 'm.rodriguez@blackrock.com',
      phone: '+1 (212) 555-0456',
    },
    status: 'contacted',
  },
  {
    id: 'ref-003',
    name: 'Dr. Emily Watson',
    title: 'Head of Quantitative Research',
    company: 'Two Sigma',
    relationship: 'former_colleague',
    contactInfo: {
      email: 'ewatson@twosigma.com',
      linkedin: 'https://linkedin.com/in/emilywatson-quant',
    },
    status: 'pending',
  },
];

export function ReferenceManager({ teamId }: ReferenceManagerProps) {
  const [references, setReferences] = useState<Reference[]>(mockReferences);
  const [showAddForm, setShowAddForm] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'responded':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'contacted':
        return <ClockIcon className="h-5 w-5 text-blue-500" />;
      case 'verified':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      default:
        return <ExclamationTriangleIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'responded':
      case 'verified':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'contacted':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getRelationshipBadge = (relationship: string) => {
    const colors = {
      former_client: 'bg-purple-100 text-purple-800',
      current_client: 'bg-green-100 text-green-800',
      former_colleague: 'bg-blue-100 text-blue-800',
      former_manager: 'bg-orange-100 text-orange-800',
      peer: 'bg-gray-100 text-gray-800',
    };
    return colors[relationship as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const renderRatingStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(10)].map((_, i) => (
          <StarIcon
            key={i}
            className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600">{rating}/10</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Reference Management</h3>
            <p className="text-sm text-gray-500 mt-1">
              Client and colleague references for team validation
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-primary inline-flex items-center"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Reference
          </button>
        </div>

        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-2xl font-semibold text-gray-900">{references.length}</div>
            <div className="text-sm text-gray-500">Total References</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-2xl font-semibold text-green-600">
              {references.filter(r => r.status === 'responded' || r.status === 'verified').length}
            </div>
            <div className="text-sm text-gray-500">Responses Received</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-2xl font-semibold text-blue-600">
              {references.filter(r => r.status === 'contacted').length}
            </div>
            <div className="text-sm text-gray-500">Pending Response</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="text-2xl font-semibold text-yellow-600">
              {references.filter(r => r.response?.overallRating).reduce((acc, r) => acc + (r.response?.overallRating || 0), 0) / Math.max(references.filter(r => r.response?.overallRating).length, 1) || 0}
            </div>
            <div className="text-sm text-gray-500">Average Rating</div>
          </div>
        </div>
      </div>

      {/* Reference List */}
      <div className="space-y-4">
        {references.map((reference) => (
          <div key={reference.id} className="bg-white rounded-lg shadow">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="bg-gray-100 rounded-full p-3">
                    <UserIcon className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">{reference.name}</h4>
                    <p className="text-sm text-gray-600">{reference.title}</p>
                    <p className="text-sm font-medium text-gray-700">{reference.company}</p>
                    <div className="mt-2 flex items-center space-x-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRelationshipBadge(reference.relationship)}`}>
                        {reference.relationship.replace(/_/g, ' ')}
                      </span>
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(reference.status)}`}>
                        {getStatusIcon(reference.status)}
                        <span className="ml-1">{reference.status}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {reference.contactInfo.email && (
                    <a
                      href={`mailto:${reference.contactInfo.email}`}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <EnvelopeIcon className="h-5 w-5" />
                    </a>
                  )}
                  {reference.contactInfo.phone && (
                    <a
                      href={`tel:${reference.contactInfo.phone}`}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <PhoneIcon className="h-5 w-5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Reference Response */}
              {reference.response && (
                <div className="mt-6 border-t border-gray-200 pt-6">
                  <h5 className="text-sm font-medium text-gray-900 mb-4">Reference Response</h5>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Ratings */}
                    <div>
                      <h6 className="text-sm font-medium text-gray-700 mb-3">Performance Ratings</h6>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-gray-600">Overall Rating</span>
                          </div>
                          {renderRatingStars(reference.response.overallRating)}
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-gray-600">Work Quality</span>
                          </div>
                          {renderRatingStars(reference.response.workQuality)}
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-gray-600">Team Collaboration</span>
                          </div>
                          {renderRatingStars(reference.response.teamCollaboration)}
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-gray-600">Reliability</span>
                          </div>
                          {renderRatingStars(reference.response.reliability)}
                        </div>
                      </div>
                    </div>

                    {/* Qualitative Feedback */}
                    <div>
                      <h6 className="text-sm font-medium text-gray-700 mb-3">Qualitative Assessment</h6>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Key Strengths:</p>
                          <ul className="mt-1 list-disc list-inside text-sm text-gray-700">
                            {reference.response.strengths.map((strength, index) => (
                              <li key={index}>{strength}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-600">Specific Examples:</p>
                          <p className="mt-1 text-sm text-gray-700">{reference.response.specificExamples}</p>
                        </div>

                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-600">Would Recommend:</span>
                          <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${reference.response.wouldRecommend ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {reference.response.wouldRecommend ? 'Yes' : 'No'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {reference.response.additionalComments && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-600 mb-2">Additional Comments:</p>
                      <p className="text-sm text-gray-700">{reference.response.additionalComments}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="mt-6 flex items-center space-x-3">
                {reference.status === 'pending' && (
                  <button className="btn-sm bg-blue-600 text-white hover:bg-blue-700">
                    Send Request
                  </button>
                )}
                {reference.status === 'contacted' && (
                  <button className="btn-sm bg-yellow-600 text-white hover:bg-yellow-700">
                    Follow Up
                  </button>
                )}
                {reference.status === 'responded' && (
                  <button className="btn-sm bg-green-600 text-white hover:bg-green-700">
                    Mark Verified
                  </button>
                )}
                <button className="btn-sm border border-gray-300 text-gray-700 hover:bg-gray-50">
                  Edit Contact
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {references.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No references added</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding your first reference contact.</p>
          <div className="mt-6">
            <button
              onClick={() => setShowAddForm(true)}
              className="btn-primary inline-flex items-center"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Reference
            </button>
          </div>
        </div>
      )}
    </div>
  );
}