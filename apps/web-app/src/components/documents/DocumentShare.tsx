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
import { FormField, ButtonGroup, TextLink } from '@/components/ui';

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
    color: 'text-error',
    bgColor: 'bg-error-light border-error',
  },
  {
    value: 'restricted',
    label: 'Restricted',
    description: 'Share with specific users or roles',
    icon: UsersIcon,
    color: 'text-navy',
    bgColor: 'bg-navy-50 border-navy-200',
  },
  {
    value: 'public',
    label: 'Public',
    description: 'All authenticated users can access',
    icon: GlobeAltIcon,
    color: 'text-success',
    bgColor: 'bg-success-light border-success',
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
          <div className="h-6 bg-bg-alt rounded w-48 mb-4"></div>
          <div className="space-y-4">
            <div className="h-4 bg-bg-alt rounded w-full"></div>
            <div className="h-4 bg-bg-alt rounded w-3/4"></div>
            <div className="h-4 bg-bg-alt rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="card max-w-2xl">
        <div className="p-6 text-center">
          <p className="text-text-secondary">Document not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card max-w-2xl">
      <div className="px-6 py-4 border-b border-border">
        <h2 className="text-lg font-medium text-text-primary">Share document</h2>
        <p className="text-sm text-text-secondary">
          Control who can access "{document.name}"
        </p>
      </div>

      {showShareUrl ? (
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-text-primary mb-2">Document shared successfully</h3>
            <p className="text-sm text-text-secondary">
              Your document sharing settings have been updated. Use the link below to share the document.
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="label-text mb-2">
                Share URL
              </label>
              <div className="flex">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 input-field rounded-r-none border-r-0"
                />
                <button
                  onClick={copyShareUrl}
                  className="btn-primary min-h-12 rounded-l-none px-4"
                  aria-label="Copy URL"
                >
                  <ClipboardDocumentIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="bg-navy-50 border border-navy-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <LinkIcon className="h-5 w-5 text-navy mt-0.5" />
                <div>
                  <h4 className="font-medium text-navy-900">Security notice</h4>
                  <p className="text-sm text-navy-700">
                    This link provides access according to your sharing settings.
                    {document.accessControl.expiresAt && (
                      <> Access will expire on {new Date(document.accessControl.expiresAt).toLocaleDateString()}.</>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <ButtonGroup>
              <button
                onClick={onCancel || (() => router.back())}
                className="btn-primary min-h-12"
              >
                Done
              </button>
              <TextLink onClick={() => setShowShareUrl(false)}>
                Update settings
              </TextLink>
            </ButtonGroup>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Current Access Level */}
          <div className="bg-bg-alt border border-border rounded-lg p-4">
            <h3 className="font-medium text-text-primary mb-2">Current access level</h3>
            <div className="flex items-center space-x-2">
              {(() => {
                const currentAccess = accessTypes.find(t => t.value === document.accessControl.type);
                const Icon = currentAccess?.icon || LockClosedIcon;
                return (
                  <>
                    <Icon className={`h-5 w-5 ${currentAccess?.color}`} />
                    <span className="font-medium text-text-primary">{currentAccess?.label}</span>
                    <span className="text-text-secondary">- {currentAccess?.description}</span>
                  </>
                );
              })()}
            </div>
          </div>

          {/* Access Control */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-text-primary">Who can access this document?</h3>
            <div className="space-y-3">
              {accessTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <label
                    key={type.value}
                    className={`flex items-start space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                      accessType === type.value ? type.bgColor : 'border-border hover:bg-bg-alt'
                    }`}
                  >
                    <input
                      {...register('accessType')}
                      type="radio"
                      value={type.value}
                      className="mt-1 h-5 w-5 text-navy focus:ring-navy"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <Icon className={`h-5 w-5 ${type.color}`} />
                        <span className="text-sm font-medium text-text-primary">{type.label}</span>
                      </div>
                      <p className="text-sm text-text-tertiary mt-1">{type.description}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Restricted Access Settings */}
          {accessType === 'restricted' && (
            <div className="space-y-5 pl-7">
              <FormField
                label="Specific users (email addresses)"
                name="allowedUsers"
                hint="Enter email addresses separated by commas"
              >
                <input
                  {...register('allowedUsers')}
                  id="allowedUsers"
                  type="text"
                  className="input-field"
                  placeholder="user1@example.com, user2@example.com"
                />
              </FormField>

              <div>
                <label className="label-text">User roles</label>
                <div className="space-y-3 mt-2">
                  {roleOptions.map((role) => (
                    <label key={role.value} className="flex items-center gap-3 cursor-pointer">
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
                        className="rounded border-border text-navy focus:ring-navy w-5 h-5"
                      />
                      <span className="text-sm text-text-secondary">{role.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Expiration */}
          <FormField label="Access expires" name="expiresIn">
            <select {...register('expiresIn')} id="expiresIn" className="input-field">
              {expirationOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </FormField>

          {/* Notification Settings */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              {...register('sendNotification')}
              type="checkbox"
              className="rounded border-border text-navy focus:ring-navy w-5 h-5"
            />
            <span className="text-text-secondary">Send notification emails to users when access is granted</span>
          </label>

          {/* Actions - LEFT aligned per Practical UI */}
          <div className="pt-6 border-t border-border">
            <ButtonGroup>
              <button
                type="submit"
                disabled={shareDocumentMutation.isPending}
                className="btn-primary min-h-12"
              >
                {shareDocumentMutation.isPending ? 'Updating...' : 'Update sharing'}
              </button>
              <TextLink onClick={onCancel || (() => router.back())}>
                Cancel
              </TextLink>
            </ButtonGroup>
          </div>
        </form>
      )}
    </div>
  );
}