'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { teamService } from '@/lib/services/teamService';
import { toast } from 'react-hot-toast';
import {
  DocumentTextIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  PlusIcon,
  TrashIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import type { TeamProfile, TeamVerification as TeamVerificationType } from '@/types/teams';

interface TeamVerificationProps {
  team: TeamProfile;
  onUpdate: () => void;
}

const documentTypes = [
  { value: 'employment_verification', label: 'Employment Verification' },
  { value: 'performance_review', label: 'Performance Reviews' },
  { value: 'client_testimonial', label: 'Client Testimonials' },
  { value: 'project_portfolio', label: 'Project Portfolio' },
  { value: 'references', label: 'Professional References' },
];

const verificationStatusColors = {
  pending: 'bg-gold-100 text-gold-800',
  in_progress: 'bg-navy-50 text-navy-800',
  verified: 'bg-success-light text-success-dark',
  rejected: 'bg-error-light text-error-dark',
};

const verificationStatusIcons = {
  pending: ClockIcon,
  in_progress: ExclamationTriangleIcon,
  verified: CheckCircleIcon,
  rejected: XCircleIcon,
};

export function TeamVerification({ team, onUpdate }: TeamVerificationProps) {
  const { userData } = useAuth();
  const [uploadingDocument, setUploadingDocument] = useState(false);
  const [selectedDocumentType, setSelectedDocumentType] = useState('');
  const [newReference, setNewReference] = useState({
    name: '',
    title: '',
    company: '',
    email: '',
    phone: '',
    relationship: 'former_manager' as const,
  });
  const [addingReference, setAddingReference] = useState(false);

  const isTeamLead = userData?.id === team.leaderId;
  const StatusIcon = verificationStatusIcons[team.verification.status];

  const handleDocumentUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedDocumentType) return;

    setUploadingDocument(true);
    try {
      await teamService.uploadVerificationDocument(
        team.id,
        file,
        selectedDocumentType as TeamVerificationType['documents'][0]['type']
      );
      toast.success('Document uploaded successfully');
      setSelectedDocumentType('');
      onUpdate();
    } catch (error) {
      toast.error('Failed to upload document');
    } finally {
      setUploadingDocument(false);
    }
  };

  const handleAddReference = async () => {
    if (!newReference.name || !newReference.email || !newReference.company) {
      toast.error('Please fill in all required fields');
      return;
    }

    setAddingReference(true);
    try {
      await teamService.addReference(team.id, {
        ...newReference,
        responseStatus: 'pending' as const,
      });
      toast.success('Reference added successfully');
      setNewReference({
        name: '',
        title: '',
        company: '',
        email: '',
        phone: '',
        relationship: 'former_manager',
      });
      onUpdate();
    } catch (error) {
      toast.error('Failed to add reference');
    } finally {
      setAddingReference(false);
    }
  };

  const handleSubmitForVerification = async () => {
    try {
      await teamService.submitForVerification(team.id);
      toast.success('Team submitted for verification');
      onUpdate();
    } catch (error) {
      toast.error('Failed to submit for verification');
    }
  };

  if (!isTeamLead) {
    return (
      <div className="text-center py-8">
        <ShieldCheckIcon className="mx-auto h-12 w-12 text-text-tertiary" />
        <h3 className="mt-2 text-sm font-medium text-text-primary">Verification access restricted</h3>
        <p className="mt-1 text-sm text-text-secondary">Only team leads can manage verification documents.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Verification Status */}
      <div className="card">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-lg font-medium text-text-primary flex items-center">
            <ShieldCheckIcon className="h-5 w-5 mr-2" />
            Verification status
          </h2>
        </div>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <StatusIcon className="h-6 w-6 text-text-tertiary" />
              <div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${verificationStatusColors[team.verification.status]}`}>
                  {team.verification.status.replace('_', ' ')}
                </span>
                {team.verification.verifiedAt && (
                  <p className="text-sm text-text-tertiary mt-1">
                    Verified on {team.verification.verifiedAt.toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
            
            {team.verification.status === 'pending' && team.verification.documents.length > 0 && (
              <button
                onClick={handleSubmitForVerification}
                className="btn-primary"
              >
                Submit for verification
              </button>
            )}
          </div>

          {team.verification.status === 'rejected' && (
            <div className="mt-4 p-4 bg-error-light rounded-lg">
              <p className="text-sm text-error-dark">
                Verification was rejected. Please review and resubmit required documents.
              </p>
            </div>
          )}

          {team.verification.status === 'pending' && (
            <div className="mt-4 p-4 bg-warning-light rounded-lg">
              <p className="text-sm text-warning-dark">
                Upload required documents and submit for verification review.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Document Upload */}
      <div className="card">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-lg font-medium text-text-primary">Verification documents</h2>
        </div>
        <div className="px-6 py-4">
          {/* Upload Form */}
          <div className="border-2 border-dashed border-border rounded-lg p-6 mb-6">
            <div className="text-center">
              <DocumentTextIcon className="mx-auto h-12 w-12 text-text-tertiary" />
              <h3 className="mt-2 text-sm font-medium text-text-primary">Upload verification document</h3>
              <p className="mt-1 text-sm text-text-secondary">
                Upload documents to verify your team&apos;s credentials and track record
              </p>
              
              <div className="mt-4 space-y-4">
                <div>
                  <select
                    value={selectedDocumentType}
                    onChange={(e) => setSelectedDocumentType(e.target.value)}
                    className="input-field max-w-xs"
                  >
                    <option value="">Select document type</option>
                    {documentTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                {selectedDocumentType && (
                  <div>
                    <input
                      type="file"
                      onChange={handleDocumentUpload}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      disabled={uploadingDocument}
                      className="block w-full text-sm text-text-secondary
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-navy-50 file:text-navy
                        hover:file:bg-navy-100"
                    />
                    {uploadingDocument && (
                      <p className="mt-2 text-sm text-text-tertiary">Uploading...</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Uploaded Documents */}
          <div className="space-y-3">
            <h4 className="font-medium text-text-primary">Uploaded documents</h4>
            {team.verification.documents.length === 0 ? (
              <p className="text-sm text-text-tertiary">No documents uploaded yet.</p>
            ) : (
              <div className="space-y-2">
                {team.verification.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <DocumentTextIcon className="h-5 w-5 text-text-tertiary" />
                      <div>
                        <p className="text-sm font-medium text-text-primary">
                          {documentTypes.find(t => t.value === doc.type)?.label || doc.type}
                        </p>
                        <p className="text-xs text-text-tertiary">
                          Uploaded {doc.uploadedAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {doc.verified ? (
                        <CheckCircleIcon className="h-5 w-5 text-success" />
                      ) : (
                        <ClockIcon className="h-5 w-5 text-warning" />
                      )}
                      <button
                        onClick={() => window.open(doc.url, '_blank')}
                        className="text-navy hover:text-navy-hover"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* References */}
      <div className="card">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-lg font-medium text-text-primary">Professional references</h2>
        </div>
        <div className="px-6 py-4">
          {/* Add Reference Form */}
          <div className="border border-border rounded-lg p-4 mb-6">
            <h4 className="font-medium text-text-primary mb-4">Add professional reference</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={newReference.name}
                  onChange={(e) => setNewReference({ ...newReference, name: e.target.value })}
                  className="input-field"
                  placeholder="Reference full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={newReference.title}
                  onChange={(e) => setNewReference({ ...newReference, title: e.target.value })}
                  className="input-field"
                  placeholder="Job title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Company *
                </label>
                <input
                  type="text"
                  value={newReference.company}
                  onChange={(e) => setNewReference({ ...newReference, company: e.target.value })}
                  className="input-field"
                  placeholder="Company name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={newReference.email}
                  onChange={(e) => setNewReference({ ...newReference, email: e.target.value })}
                  className="input-field"
                  placeholder="email@company.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={newReference.phone}
                  onChange={(e) => setNewReference({ ...newReference, phone: e.target.value })}
                  className="input-field"
                  placeholder="Phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Relationship
                </label>
                <select
                  value={newReference.relationship}
                  onChange={(e) => setNewReference({ ...newReference, relationship: e.target.value as any })}
                  className="input-field"
                >
                  <option value="former_manager">Former Manager</option>
                  <option value="client">Client</option>
                  <option value="peer">Peer</option>
                  <option value="direct_report">Direct Report</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleAddReference}
                disabled={addingReference}
                className="btn-primary"
              >
                {addingReference ? 'Adding...' : 'Add reference'}
              </button>
            </div>
          </div>

          {/* References List */}
          <div className="space-y-3">
            <h4 className="font-medium text-text-primary">Added references</h4>
            {team.verification.references.length === 0 ? (
              <p className="text-sm text-text-tertiary">No references added yet.</p>
            ) : (
              <div className="space-y-3">
                {team.verification.references.map((ref, index) => (
                  <div key={index} className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h5 className="font-medium text-text-primary">{ref.name}</h5>
                        <p className="text-sm text-text-secondary">{ref.title} at {ref.company}</p>
                        <p className="text-sm text-text-tertiary">{ref.email}</p>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-bg-alt text-text-secondary mt-2">
                          {ref.relationship.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          ref.responseStatus === 'positive' ? 'bg-success-light text-success-dark' :
                          ref.responseStatus === 'negative' ? 'bg-error-light text-error-dark' :
                          ref.responseStatus === 'neutral' ? 'bg-warning-light text-warning-dark' :
                          'bg-bg-alt text-text-secondary'
                        }`}>
                          {ref.responseStatus.replace('_', ' ')}
                        </span>
                        {ref.contactedAt && (
                          <p className="text-xs text-text-tertiary mt-1">
                            Contacted {ref.contactedAt.toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    {ref.notes && (
                      <div className="mt-3 p-2 bg-bg-alt rounded text-sm text-text-secondary">
                        {ref.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Background Checks */}
      <div className="card">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-lg font-medium text-text-primary">Background checks</h2>
        </div>
        <div className="px-6 py-4">
          {team.verification.backgroundChecks.length === 0 ? (
            <div className="text-center py-8">
              <ShieldCheckIcon className="mx-auto h-12 w-12 text-text-tertiary" />
              <h3 className="mt-2 text-sm font-medium text-text-primary">No background checks</h3>
              <p className="mt-1 text-sm text-text-secondary">
                Background checks will be initiated during the verification process.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {team.verification.backgroundChecks.map((check, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      Member background check #{index + 1}
                    </p>
                    {check.provider && (
                      <p className="text-xs text-text-tertiary">Provider: {check.provider}</p>
                    )}
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    check.status === 'clear' ? 'bg-success-light text-success-dark' :
                    check.status === 'flagged' ? 'bg-error-light text-error-dark' :
                    'bg-warning-light text-warning-dark'
                  }`}>
                    {check.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}