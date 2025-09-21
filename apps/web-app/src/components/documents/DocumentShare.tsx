'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import {
  LockClosedIcon,
  UsersIcon,
  GlobeAltIcon,
  CalendarDaysIcon,
  LinkIcon,
  ClipboardDocumentIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline';
import { useDocument, useShareDocument } from '@/hooks/useDocuments';

const shareDocumentSchema = z.object({
  accessType: z.enum(['public', 'restricted', 'private']),
  allowedUsers: z.string().optional(),
  allowedRoles: z.array(z.string()).default([]),
  expiresIn: z.string().optional(),
  sendNotification: z.boolean().default(true),
});

type ShareDocumentFormData = z.infer<typeof shareDocumentSchema>;

interface DocumentShareProps {
  documentId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const accessTypes = [
  {
    value: 'private',
    label: 'Private',
    description: 'Only you can access this document',
    icon: LockClosedIcon,
    color: 'text-red-600',
    bgColor: 'bg-red-50 border-red-200',
  },
  {
    value: 'restricted',
    label: 'Restricted',
    description: 'Share with specific users or roles',
    icon: UsersIcon,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 border-blue-200',
  },
  {
    value: 'public',
    label: 'Public',
    description: 'All authenticated users can access',
    icon: GlobeAltIcon,
    color: 'text-green-600',
    bgColor: 'bg-green-50 border-green-200',
  },
];

const expirationOptions = [
  { value: '', label: 'Never expires' },
  { value: '1', label: '24 hours' },
  { value: '7', label: '7 days' },
  { value: '14', label: '14 days' },
  { value: '30', label: '30 days' },
  { value: '90', label: '90 days' },
];

const roleOptions = [
  { value: 'individual', label: 'Team Members' },
  { value: 'company', label: 'Company Users' },
];

export function DocumentShare({ documentId, onSuccess, onCancel }: DocumentShareProps) {
  const router = useRouter();
  const [shareUrl, setShareUrl] = useState<string>('');
  const [showShareUrl, setShowShareUrl] = useState(false);
  
  const { data: document, isLoading } = useDocument(documentId);
  const shareDocumentMutation = useShareDocument();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ShareDocumentFormData>({
    resolver: zodResolver(shareDocumentSchema),
    defaultValues: {
      accessType: document?.accessControl.type || 'private',
      allowedUsers: document?.accessControl.allowedUsers?.join(', ') || '',
      allowedRoles: document?.accessControl.allowedRoles || [],
      sendNotification: true,
    },
  });

  const accessType = watch('accessType');

  const onSubmit = async (data: ShareDocumentFormData) => {
    try {
      // Calculate expiration date
      let expiresAt = null;
      if (data.expiresIn) {
        const days = parseInt(data.expiresIn);
        expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
      }

      // Parse allowed users
      const allowedUsers = data.allowedUsers 
        ? data.allowedUsers.split(',').map(email => email.trim()).filter(Boolean)
        : [];

      const accessControl = {
        type: data.accessType,
        allowedUsers,
        allowedRoles: data.allowedRoles,
        expiresAt,
      };

      await shareDocumentMutation.mutateAsync({
        documentId,
        accessControl,
      });

      // Generate share URL (in a real implementation, this would be a secure token-based URL)
      const baseUrl = window.location.origin;
      const documentShareUrl = `${baseUrl}/app/documents/${documentId}?shared=true`;
      setShareUrl(documentShareUrl);
      setShowShareUrl(true);

      toast.success('Document sharing settings updated!');
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update sharing settings');
    }
  };

  const copyShareUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Share URL copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy URL');
    }
  };

  if (isLoading) {
    return (
      <div className="card max-w-2xl">
        <div className="animate-pulse p-6">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="card max-w-2xl">
        <div className="p-6 text-center">
          <p className="text-gray-500">Document not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card max-w-2xl">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Share Document</h2>
        <p className="text-sm text-gray-600">
          Control who can access "{document.name}"
        </p>
      </div>

      {showShareUrl ? (
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Document Shared Successfully!</h3>
            <p className="text-sm text-gray-600">
              Your document sharing settings have been updated. Use the link below to share the document.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Share URL
              </label>
              <div className="flex">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md text-sm bg-gray-50"
                />
                <button
                  onClick={copyShareUrl}
                  className="px-4 py-2 bg-primary-600 text-white rounded-r-md hover:bg-primary-700 text-sm"
                >
                  <ClipboardDocumentIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <LinkIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Security Notice</h4>
                  <p className="text-sm text-blue-700">
                    This link provides access according to your sharing settings. 
                    {document.accessControl.expiresAt && (
                      <> Access will expire on {new Date(document.accessControl.expiresAt).toLocaleDateString()}.</>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setShowShareUrl(false)}
              className="btn-secondary"
            >
              Update Settings
            </button>
            <button
              onClick={onCancel || (() => router.back())}
              className="btn-primary"
            >
              Done
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Current Access Level */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Current Access Level</h3>
            <div className="flex items-center space-x-2">
              {(() => {
                const currentAccess = accessTypes.find(t => t.value === document.accessControl.type);
                const Icon = currentAccess?.icon || LockClosedIcon;
                return (
                  <>
                    <Icon className={`h-5 w-5 ${currentAccess?.color}`} />
                    <span className="font-medium">{currentAccess?.label}</span>
                    <span className="text-gray-600">- {currentAccess?.description}</span>
                  </>
                );
              })()}
            </div>
          </div>

          {/* Access Control */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Who can access this document?</h3>
            <div className="space-y-3">
              {accessTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <label 
                    key={type.value} 
                    className={`flex items-start space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                      accessType === type.value ? type.bgColor : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      {...register('accessType')}
                      type="radio"
                      value={type.value}
                      className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <Icon className={`h-5 w-5 ${type.color}`} />
                        <span className="text-sm font-medium text-gray-900">{type.label}</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{type.description}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Restricted Access Settings */}
          {accessType === 'restricted' && (
            <div className="space-y-4 pl-7">
              <div>
                <label htmlFor="allowedUsers" className="label-text">
                  Specific Users (Email addresses)
                </label>
                <input
                  {...register('allowedUsers')}
                  type="text"
                  className="input-field"
                  placeholder="user1@example.com, user2@example.com"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Enter email addresses separated by commas
                </p>
              </div>

              <div>
                <label className="label-text">User Roles</label>
                <div className="space-y-2">
                  {roleOptions.map((role) => (
                    <label key={role.value} className="flex items-center">
                      <input
                        type="checkbox"
                        value={role.value}
                        onChange={(e) => {
                          const currentRoles = watch('allowedRoles') || [];
                          if (e.target.checked) {
                            setValue('allowedRoles', [...currentRoles, role.value]);
                          } else {
                            setValue('allowedRoles', currentRoles.filter(r => r !== role.value));
                          }
                        }}
                        defaultChecked={document.accessControl.allowedRoles.includes(role.value)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">{role.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Expiration */}
          <div>
            <label htmlFor="expiresIn" className="label-text">
              Access Expires
            </label>
            <select {...register('expiresIn')} className="input-field">
              {expirationOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Notification Settings */}
          <div className="flex items-center">
            <input
              {...register('sendNotification')}
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Send notification emails to users when access is granted
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel || (() => router.back())}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={shareDocumentMutation.isPending}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {shareDocumentMutation.isPending ? 'Updating...' : 'Update Sharing'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}