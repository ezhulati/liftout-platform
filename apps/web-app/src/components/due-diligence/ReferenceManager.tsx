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
        return <CheckCircleIcon className="h-5 w-5 text-success" />;
      case 'contacted':
        return <ClockIcon className="h-5 w-5 text-navy" />;
      case 'verified':
        return <CheckCircleIcon className="h-5 w-5 text-success-dark" />;
      default:
        return <ExclamationTriangleIcon className="h-5 w-5 text-text-tertiary" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'responded':
      case 'verified':
        return 'bg-success-light text-success-dark border-success';
      case 'contacted':
        return 'bg-navy-50 text-navy-800 border-navy-200';
      default:
        return 'bg-bg-alt text-text-secondary border-border';
    }
  };

  const getRelationshipBadge = (relationship: string) => {
    const colors = {
      former_client: 'bg-gold-100 text-gold-800',
      current_client: 'bg-success-light text-success-dark',
      former_colleague: 'bg-navy-50 text-navy-800',
      former_manager: 'bg-gold-100 text-gold-800',
      peer: 'bg-bg-alt text-text-secondary',
    };
    return colors[relationship as keyof typeof colors] || 'bg-bg-alt text-text-secondary';
  };

  const renderRatingStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(10)].map((_, i) => (
          <StarIcon
            key={i}
            className={`h-4 w-4 ${i < rating ? 'text-gold fill-current' : 'text-text-tertiary'}`}
          />
        ))}
        <span className="ml-2 text-sm text-text-secondary">{rating}/10</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-text-primary">Reference management</h3>
            <p className="text-base text-text-tertiary mt-1">
              Client and colleague references for team validation
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-primary min-h-12 inline-flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add reference
          </button>
        </div>

        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-bg-alt rounded-lg p-4">
            <div className="text-2xl font-semibold text-text-primary">{references.length}</div>
            <div className="text-sm text-text-tertiary">Total references</div>
          </div>
          <div className="bg-success-light rounded-lg p-4">
            <div className="text-2xl font-semibold text-success-dark">
              {references.filter(r => r.status === 'responded' || r.status === 'verified').length}
            </div>
            <div className="text-sm text-text-tertiary">Responses received</div>
          </div>
          <div className="bg-navy-50 rounded-lg p-4">
            <div className="text-2xl font-semibold text-navy">
              {references.filter(r => r.status === 'contacted').length}
            </div>
            <div className="text-sm text-text-tertiary">Pending response</div>
          </div>
          <div className="bg-gold-100 rounded-lg p-4">
            <div className="text-2xl font-semibold text-gold-800">
              {references.filter(r => r.response?.overallRating).reduce((acc, r) => acc + (r.response?.overallRating || 0), 0) / Math.max(references.filter(r => r.response?.overallRating).length, 1) || 0}
            </div>
            <div className="text-sm text-text-tertiary">Average rating</div>
          </div>
        </div>
      </div>

      {/* Reference List */}
      <div className="space-y-4">
        {references.map((reference) => (
          <div key={reference.id} className="card">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="bg-bg-alt rounded-full p-3">
                    <UserIcon className="h-6 w-6 text-text-secondary" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-text-primary">{reference.name}</h4>
                    <p className="text-sm text-text-secondary">{reference.title}</p>
                    <p className="text-sm font-medium text-text-primary">{reference.company}</p>
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
                      className="text-text-tertiary hover:text-text-secondary"
                    >
                      <EnvelopeIcon className="h-5 w-5" />
                    </a>
                  )}
                  {reference.contactInfo.phone && (
                    <a
                      href={`tel:${reference.contactInfo.phone}`}
                      className="text-text-tertiary hover:text-text-secondary"
                    >
                      <PhoneIcon className="h-5 w-5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Reference Response */}
              {reference.response && (
                <div className="mt-6 border-t border-border pt-6">
                  <h5 className="text-sm font-medium text-text-primary mb-4">Reference response</h5>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Ratings */}
                    <div>
                      <h6 className="text-sm font-medium text-text-secondary mb-3">Performance ratings</h6>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-text-secondary">Overall rating</span>
                          </div>
                          {renderRatingStars(reference.response.overallRating)}
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-text-secondary">Work quality</span>
                          </div>
                          {renderRatingStars(reference.response.workQuality)}
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-text-secondary">Team collaboration</span>
                          </div>
                          {renderRatingStars(reference.response.teamCollaboration)}
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-text-secondary">Reliability</span>
                          </div>
                          {renderRatingStars(reference.response.reliability)}
                        </div>
                      </div>
                    </div>

                    {/* Qualitative Feedback */}
                    <div>
                      <h6 className="text-sm font-medium text-text-secondary mb-3">Qualitative assessment</h6>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium text-text-secondary">Key strengths:</p>
                          <ul className="mt-1 list-disc list-inside text-sm text-text-primary">
                            {reference.response.strengths.map((strength, index) => (
                              <li key={index}>{strength}</li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-text-secondary">Specific examples:</p>
                          <p className="mt-1 text-sm text-text-primary">{reference.response.specificExamples}</p>
                        </div>

                        <div className="flex items-center">
                          <span className="text-sm font-medium text-text-secondary">Would recommend:</span>
                          <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${reference.response.wouldRecommend ? 'bg-success-light text-success-dark' : 'bg-error-light text-error-dark'}`}>
                            {reference.response.wouldRecommend ? 'Yes' : 'No'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {reference.response.additionalComments && (
                    <div className="mt-4 p-4 bg-bg-alt rounded-lg">
                      <p className="text-sm font-medium text-text-secondary mb-2">Additional comments:</p>
                      <p className="text-sm text-text-primary">{reference.response.additionalComments}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                {reference.status === 'pending' && (
                  <button className="btn-primary min-h-12">
                    Send request
                  </button>
                )}
                {reference.status === 'contacted' && (
                  <button className="btn-primary min-h-12">
                    Follow up
                  </button>
                )}
                {reference.status === 'responded' && (
                  <button className="btn-primary min-h-12">
                    Mark verified
                  </button>
                )}
                <button className="btn-outline min-h-12">
                  Edit contact
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {references.length === 0 && (
        <div className="text-center py-12 card">
          <UserIcon className="mx-auto h-12 w-12 text-text-tertiary" />
          <h3 className="mt-2 text-sm font-medium text-text-primary">No references added</h3>
          <p className="mt-1 text-sm text-text-tertiary">Get started by adding your first reference contact.</p>
          <div className="mt-6">
            <button
              onClick={() => setShowAddForm(true)}
              className="btn-primary min-h-12 inline-flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add reference
            </button>
          </div>
        </div>
      )}
    </div>
  );
}