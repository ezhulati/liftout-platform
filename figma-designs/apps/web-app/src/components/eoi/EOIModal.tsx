'use client';

import React, { useState } from 'react';
import { XMarkIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface EOIModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamId: string;
  teamName: string;
}

interface EOIFormData {
  message: string;
  interestLevel: 'low' | 'medium' | 'high';
  specificRole?: string;
  timeline: string;
  budgetRange?: string;
}

export function EOIModal({ isOpen, onClose, teamId, teamName }: EOIModalProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<EOIFormData>({
    message: '',
    interestLevel: 'medium',
    timeline: '1-3 months',
  });

  const createEOI = useMutation({
    mutationFn: async (data: EOIFormData) => {
      const response = await fetch('/api/eoi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toType: 'team',
          toId: teamId,
          ...data,
        }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send EOI');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eois'] });
      onClose();
      setFormData({
        message: '',
        interestLevel: 'medium',
        timeline: '1-3 months',
      });
    },
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createEOI.mutate(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-bg-surface rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between sticky top-0 bg-bg-surface">
          <div>
            <h3 className="text-lg font-semibold text-text-primary">Express Interest</h3>
            <p className="text-sm text-text-secondary">{teamName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-text-tertiary hover:text-text-primary p-1"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              Message to Team *
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Introduce your company and explain why you're interested in this team..."
              rows={4}
              className="w-full px-3 py-2 border border-border rounded-lg bg-bg-surface text-text-primary placeholder-text-tertiary focus:ring-2 focus:ring-navy focus:border-navy"
              required
            />
          </div>

          {/* Interest Level */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              Interest Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['low', 'medium', 'high'] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setFormData({ ...formData, interestLevel: level })}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    formData.interestLevel === level
                      ? level === 'high'
                        ? 'bg-success/10 border-success text-success'
                        : level === 'medium'
                        ? 'bg-navy/10 border-navy text-navy'
                        : 'bg-gold-100 border-gold-500 text-gold-700'
                      : 'border-border text-text-secondary hover:bg-bg-alt'
                  }`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
            <p className="text-xs text-text-tertiary mt-1">
              {formData.interestLevel === 'high' && 'Ready to move quickly with serious intent'}
              {formData.interestLevel === 'medium' && 'Actively exploring opportunities'}
              {formData.interestLevel === 'low' && 'Initial exploration, gathering information'}
            </p>
          </div>

          {/* Specific Role */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              Specific Role/Position (Optional)
            </label>
            <input
              type="text"
              value={formData.specificRole || ''}
              onChange={(e) => setFormData({ ...formData, specificRole: e.target.value })}
              placeholder="e.g., Lead our new AI division"
              className="w-full px-3 py-2 border border-border rounded-lg bg-bg-surface text-text-primary placeholder-text-tertiary focus:ring-2 focus:ring-navy focus:border-navy"
            />
          </div>

          {/* Timeline */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              Desired Timeline
            </label>
            <select
              value={formData.timeline}
              onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-bg-surface text-text-primary focus:ring-2 focus:ring-navy focus:border-navy"
            >
              <option value="immediate">Immediate (ASAP)</option>
              <option value="1-3 months">1-3 months</option>
              <option value="3-6 months">3-6 months</option>
              <option value="6-12 months">6-12 months</option>
              <option value="flexible">Flexible</option>
            </select>
          </div>

          {/* Budget Range */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              Budget Range (Optional)
            </label>
            <select
              value={formData.budgetRange || ''}
              onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-bg-surface text-text-primary focus:ring-2 focus:ring-navy focus:border-navy"
            >
              <option value="">Prefer not to say</option>
              <option value="under-500k">Under $500K total package</option>
              <option value="500k-1m">$500K - $1M total package</option>
              <option value="1m-2m">$1M - $2M total package</option>
              <option value="over-2m">Over $2M total package</option>
            </select>
          </div>

          {/* Error Message */}
          {createEOI.error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {createEOI.error.message}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-border rounded-lg text-text-primary hover:bg-bg-alt transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createEOI.isPending || !formData.message}
              className="flex-1 btn-primary inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createEOI.isPending ? (
                'Sending...'
              ) : (
                <>
                  <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                  Send EOI
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
