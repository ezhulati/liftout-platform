'use client';

import React, { useState } from 'react';
import {
  AcademicCapIcon,
  PlusIcon,
  XMarkIcon,
  CalendarIcon,
  LinkIcon,
  BuildingOfficeIcon,
  CheckBadgeIcon,
} from '@heroicons/react/24/outline';

export interface Certification {
  id: string;
  name: string;
  issuingOrganization: string;
  issueDate: string;
  expirationDate?: string;
  doesNotExpire: boolean;
  credentialId?: string;
  credentialUrl?: string;
}

interface LicensesCertificationsProps {
  certifications: Certification[];
  onCertificationsChange: (certifications: Certification[]) => void;
  isEditing: boolean;
}

// Common certifications for autocomplete suggestions
const POPULAR_CERTIFICATIONS = [
  { name: 'AWS Certified Solutions Architect', org: 'Amazon Web Services' },
  { name: 'AWS Certified Developer', org: 'Amazon Web Services' },
  { name: 'Google Cloud Professional Data Engineer', org: 'Google Cloud' },
  { name: 'Microsoft Azure Administrator', org: 'Microsoft' },
  { name: 'Certified Kubernetes Administrator (CKA)', org: 'CNCF' },
  { name: 'PMP (Project Management Professional)', org: 'PMI' },
  { name: 'Certified Scrum Master (CSM)', org: 'Scrum Alliance' },
  { name: 'CompTIA Security+', org: 'CompTIA' },
  { name: 'CISSP', org: 'ISC2' },
  { name: 'CPA (Certified Public Accountant)', org: 'AICPA' },
  { name: 'CFA (Chartered Financial Analyst)', org: 'CFA Institute' },
  { name: 'Series 7', org: 'FINRA' },
  { name: 'Six Sigma Green Belt', org: 'ASQ' },
  { name: 'Six Sigma Black Belt', org: 'ASQ' },
  { name: 'Google Analytics Certified', org: 'Google' },
  { name: 'HubSpot Inbound Marketing', org: 'HubSpot' },
  { name: 'Salesforce Administrator', org: 'Salesforce' },
  { name: 'SHRM-CP', org: 'SHRM' },
  { name: 'PHR (Professional in Human Resources)', org: 'HRCI' },
];

export default function LicensesCertifications({
  certifications,
  onCertificationsChange,
  isEditing,
}: LicensesCertificationsProps) {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newCert, setNewCert] = useState<Omit<Certification, 'id'>>({
    name: '',
    issuingOrganization: '',
    issueDate: '',
    expirationDate: '',
    doesNotExpire: false,
    credentialId: '',
    credentialUrl: '',
  });

  const addCertification = () => {
    if (!newCert.name.trim() || !newCert.issuingOrganization.trim()) return;

    const cert: Certification = {
      id: Date.now().toString(),
      ...newCert,
    };
    onCertificationsChange([cert, ...certifications]);
    setNewCert({
      name: '',
      issuingOrganization: '',
      issueDate: '',
      expirationDate: '',
      doesNotExpire: false,
      credentialId: '',
      credentialUrl: '',
    });
    setIsAddingNew(false);
  };

  const updateCertification = (id: string, updates: Partial<Certification>) => {
    const newCerts = certifications.map(cert =>
      cert.id === id ? { ...cert, ...updates } : cert
    );
    onCertificationsChange(newCerts);
  };

  const removeCertification = (id: string) => {
    onCertificationsChange(certifications.filter(c => c.id !== id));
  };

  const selectSuggestion = (suggestion: { name: string; org: string }) => {
    setNewCert(prev => ({
      ...prev,
      name: suggestion.name,
      issuingOrganization: suggestion.org,
    }));
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const isExpired = (cert: Certification) => {
    if (cert.doesNotExpire || !cert.expirationDate) return false;
    return new Date(cert.expirationDate) < new Date();
  };

  return (
    <div className="space-y-4">
      {/* Add New Button */}
      {isEditing && !isAddingNew && (
        <button
          type="button"
          onClick={() => setIsAddingNew(true)}
          className="w-full py-4 border-2 border-dashed border-border rounded-lg flex items-center justify-center gap-2 text-text-secondary hover:border-navy hover:text-navy transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          Add license or certification
        </button>
      )}

      {/* Add New Form */}
      {isAddingNew && (
        <div className="border border-border rounded-lg p-6 space-y-4 bg-bg-secondary">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-text-primary">Add new certification</h4>
            <button
              type="button"
              onClick={() => {
                setIsAddingNew(false);
                setNewCert({
                  name: '',
                  issuingOrganization: '',
                  issueDate: '',
                  expirationDate: '',
                  doesNotExpire: false,
                  credentialId: '',
                  credentialUrl: '',
                });
              }}
              className="text-text-tertiary hover:text-text-primary"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Suggestions */}
          {!newCert.name && (
            <div className="mb-4">
              <p className="text-xs font-medium text-text-tertiary mb-2">Popular certifications:</p>
              <div className="flex flex-wrap gap-2">
                {POPULAR_CERTIFICATIONS.slice(0, 6).map((suggestion) => (
                  <button
                    key={suggestion.name}
                    type="button"
                    onClick={() => selectSuggestion(suggestion)}
                    className="px-3 py-1.5 bg-white text-text-primary rounded-full text-sm hover:bg-purple-100 hover:text-navy transition-colors border border-border"
                  >
                    {suggestion.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label-text mb-1">
                Certification name <span className="text-error">*</span>
              </label>
              <input
                type="text"
                value={newCert.name}
                onChange={(e) => setNewCert(prev => ({ ...prev, name: e.target.value }))}
                className="input-field min-h-12"
                placeholder="e.g., AWS Solutions Architect"
              />
            </div>
            <div>
              <label className="label-text mb-1">
                Issuing organization <span className="text-error">*</span>
              </label>
              <input
                type="text"
                value={newCert.issuingOrganization}
                onChange={(e) => setNewCert(prev => ({ ...prev, issuingOrganization: e.target.value }))}
                className="input-field min-h-12"
                placeholder="e.g., Amazon Web Services"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label-text mb-1">Issue date</label>
              <input
                type="month"
                value={newCert.issueDate}
                onChange={(e) => setNewCert(prev => ({ ...prev, issueDate: e.target.value }))}
                className="input-field min-h-12"
              />
            </div>
            <div>
              <label className="label-text mb-1">Expiration date</label>
              <input
                type="month"
                value={newCert.expirationDate}
                onChange={(e) => setNewCert(prev => ({ ...prev, expirationDate: e.target.value }))}
                className="input-field min-h-12"
                disabled={newCert.doesNotExpire}
              />
              <label className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  checked={newCert.doesNotExpire}
                  onChange={(e) => setNewCert(prev => ({
                    ...prev,
                    doesNotExpire: e.target.checked,
                    expirationDate: e.target.checked ? '' : prev.expirationDate,
                  }))}
                  className="rounded border-border text-navy focus:ring-navy"
                />
                <span className="text-sm text-text-secondary">This credential does not expire</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label-text mb-1">Credential ID</label>
              <input
                type="text"
                value={newCert.credentialId}
                onChange={(e) => setNewCert(prev => ({ ...prev, credentialId: e.target.value }))}
                className="input-field min-h-12"
                placeholder="Optional"
              />
            </div>
            <div>
              <label className="label-text mb-1">Credential URL</label>
              <input
                type="url"
                value={newCert.credentialUrl}
                onChange={(e) => setNewCert(prev => ({ ...prev, credentialUrl: e.target.value }))}
                className="input-field min-h-12"
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="btn-outline min-h-12"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={addCertification}
              disabled={!newCert.name.trim() || !newCert.issuingOrganization.trim()}
              className="btn-primary min-h-12"
            >
              Add certification
            </button>
          </div>
        </div>
      )}

      {/* Certifications List */}
      {certifications.length === 0 && !isAddingNew ? (
        <div className="text-center py-12">
          <CheckBadgeIcon className="h-12 w-12 text-text-tertiary mx-auto mb-4" />
          <p className="text-text-tertiary mb-2">No licenses or certifications added yet</p>
          {isEditing && (
            <p className="text-sm text-text-tertiary">
              Click the button above to add your credentials
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {certifications.map((cert) => (
            <div
              key={cert.id}
              className={`border rounded-lg p-5 ${
                isExpired(cert) ? 'border-error-light bg-error-light/20' : 'border-border bg-white'
              }`}
            >
              {editingId === cert.id ? (
                // Editing mode
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="label-text mb-1">Certification name</label>
                      <input
                        type="text"
                        value={cert.name}
                        onChange={(e) => updateCertification(cert.id, { name: e.target.value })}
                        className="input-field min-h-12"
                      />
                    </div>
                    <div>
                      <label className="label-text mb-1">Issuing organization</label>
                      <input
                        type="text"
                        value={cert.issuingOrganization}
                        onChange={(e) => updateCertification(cert.id, { issuingOrganization: e.target.value })}
                        className="input-field min-h-12"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="label-text mb-1">Issue date</label>
                      <input
                        type="month"
                        value={cert.issueDate}
                        onChange={(e) => updateCertification(cert.id, { issueDate: e.target.value })}
                        className="input-field min-h-12"
                      />
                    </div>
                    <div>
                      <label className="label-text mb-1">Expiration date</label>
                      <input
                        type="month"
                        value={cert.expirationDate || ''}
                        onChange={(e) => updateCertification(cert.id, { expirationDate: e.target.value })}
                        className="input-field min-h-12"
                        disabled={cert.doesNotExpire}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="btn-primary min-h-12"
                    >
                      Done editing
                    </button>
                  </div>
                </div>
              ) : (
                // Display mode
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <AcademicCapIcon className="h-6 w-6 text-navy" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-text-primary">{cert.name}</h4>
                        {isExpired(cert) && (
                          <span className="text-xs px-2 py-0.5 bg-error-light text-error-dark rounded-full font-medium">
                            Expired
                          </span>
                        )}
                        {!cert.doesNotExpire && !isExpired(cert) && cert.expirationDate && (
                          <span className="text-xs px-2 py-0.5 bg-success-light text-success-dark rounded-full font-medium">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-text-secondary mt-1">
                        <BuildingOfficeIcon className="h-4 w-4" />
                        <span>{cert.issuingOrganization}</span>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-text-tertiary">
                        {cert.issueDate && (
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="h-4 w-4" />
                            <span>Issued {formatDate(cert.issueDate)}</span>
                          </div>
                        )}
                        {cert.expirationDate && !cert.doesNotExpire && (
                          <span>Expires {formatDate(cert.expirationDate)}</span>
                        )}
                        {cert.doesNotExpire && (
                          <span>No expiration</span>
                        )}
                      </div>
                      {cert.credentialUrl && (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-navy hover:underline mt-2"
                        >
                          <LinkIcon className="h-4 w-4" />
                          Show credential
                        </a>
                      )}
                    </div>
                  </div>
                  {isEditing && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingId(cert.id)}
                        className="text-sm text-text-secondary hover:text-navy px-3 py-1.5 rounded hover:bg-bg-secondary transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => removeCertification(cert.id)}
                        className="text-text-tertiary hover:text-error p-1.5 rounded hover:bg-error-light transition-colors"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
