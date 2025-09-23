'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import {
  CloudArrowUpIcon,
  DocumentTextIcon,
  XMarkIcon,
  LockClosedIcon,
  UsersIcon,
  GlobeAltIcon,
  EyeIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline';
import { useCreateDocument } from '@/hooks/useDocuments';

const documentUploadSchema = z.object({
  name: z.string().min(1, 'Document name is required'),
  description: z.string().optional(),
  type: z.enum(['team_profile', 'legal_document', 'term_sheet', 'nda', 'presentation', 'other']),
  confidential: z.boolean().default(false),
  accessType: z.enum(['public', 'restricted', 'private']).default('private'),
  allowedUsers: z.string().optional(),
  allowedRoles: z.array(z.string()).default([]),
  expiresIn: z.string().optional(),
  tags: z.string().optional(),
  opportunityId: z.string().optional(),
  applicationId: z.string().optional(),
});

type DocumentUploadFormData = z.infer<typeof documentUploadSchema>;

interface DocumentUploadProps {
  opportunityId?: string;
  applicationId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const documentTypes = [
  { value: 'team_profile', label: 'Team Profile' },
  { value: 'legal_document', label: 'Legal Document' },
  { value: 'term_sheet', label: 'Term Sheet' },
  { value: 'nda', label: 'NDA' },
  { value: 'presentation', label: 'Presentation' },
  { value: 'other', label: 'Other' },
];

const accessTypes = [
  {
    value: 'private',
    label: 'Private',
    description: 'Only you can access this document',
    icon: LockClosedIcon,
  },
  {
    value: 'restricted',
    label: 'Restricted',
    description: 'Share with specific users or roles',
    icon: UsersIcon,
  },
  {
    value: 'public',
    label: 'Public',
    description: 'All authenticated users can access',
    icon: GlobeAltIcon,
  },
];

const expirationOptions = [
  { value: '', label: 'Never expires' },
  { value: '7', label: '7 days' },
  { value: '14', label: '14 days' },
  { value: '30', label: '30 days' },
  { value: '90', label: '90 days' },
];

export function DocumentUpload({ opportunityId, applicationId, onSuccess, onCancel }: DocumentUploadProps) {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const createDocumentMutation = useCreateDocument();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<DocumentUploadFormData>({
    resolver: zodResolver(documentUploadSchema),
    defaultValues: {
      type: 'other',
      confidential: false,
      accessType: 'private',
      allowedRoles: [],
      opportunityId,
      applicationId,
    },
  });

  const accessType = watch('accessType');
  const confidential = watch('confidential');

  const handleFileSelect = (file: File) => {
    // Validate file type and size
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error('Only PDF, Word, Excel, and PowerPoint files are allowed');
      return;
    }

    if (file.size > maxSize) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setSelectedFile(file);
    if (!watch('name')) {
      setValue('name', file.name);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  const onSubmit = async (data: DocumentUploadFormData) => {
    if (!selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }

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

      // Parse tags
      const tags = data.tags 
        ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean)
        : [];

      const documentData = {
        name: data.name,
        description: data.description || '',
        type: data.type,
        fileType: selectedFile.type.split('/')[1] || 'pdf',
        size: selectedFile.size,
        confidential: data.confidential,
        accessControl: {
          type: data.accessType,
          allowedUsers,
          allowedRoles: data.allowedRoles,
          expiresAt,
        },
        metadata: {
          opportunityId: data.opportunityId || null,
          applicationId: data.applicationId || null,
          tags,
          version: '1.0',
        },
      };

      await createDocumentMutation.mutateAsync(documentData);
      toast.success('Document uploaded successfully!');
      
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/app/documents');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload document');
    }
  };

  return (
    <div className="card max-w-4xl">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Upload Document</h2>
        <p className="text-sm text-gray-600">
          Share documents securely for liftout discussions and due diligence
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        {/* File Upload Area */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Select File *
          </label>
          
          {!selectedFile ? (
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                dragActive 
                  ? 'border-primary-400 bg-primary-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <p className="text-sm text-gray-600">
                  <span className="font-medium text-primary-600">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PDF, Word, Excel, PowerPoint (max 10MB)
                </p>
              </div>
              <input
                id="file-input"
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              />
            </div>
          ) : (
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <DocumentTextIcon className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                    <p className="text-xs text-gray-500">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  className="text-gray-400 hover:text-red-500"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Document Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="label-text">
              Document Name *
            </label>
            <input
              {...register('name')}
              type="text"
              className="input-field"
              placeholder="e.g., Team Profile Q3 2024"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="type" className="label-text">
              Document Type *
            </label>
            <select {...register('type')} className="input-field">
              {documentTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {errors.type && (
              <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="description" className="label-text">
            Description
          </label>
          <textarea
            {...register('description')}
            rows={3}
            className="input-field"
            placeholder="Brief description of the document contents and purpose..."
          />
        </div>

        {/* Access Control */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Access Control</h3>
          
          <div className="flex items-center">
            <input
              {...register('confidential')}
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Mark as confidential
            </label>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Who can access this document? *
            </label>
            {accessTypes.map((type) => {
              const Icon = type.icon;
              return (
                <label key={type.value} className="flex items-start space-x-3 cursor-pointer">
                  <input
                    {...register('accessType')}
                    type="radio"
                    value={type.value}
                    className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <Icon className="h-5 w-5 text-gray-500" />
                      <span className="text-sm font-medium text-gray-900">{type.label}</span>
                    </div>
                    <p className="text-sm text-gray-500">{type.description}</p>
                  </div>
                </label>
              );
            })}
          </div>

          {accessType === 'restricted' && (
            <div className="space-y-4 pl-7">
              <div>
                <label htmlFor="allowedUsers" className="label-text">
                  Allowed Users (Email addresses)
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
                <label className="label-text">Allowed Roles</label>
                <div className="space-y-2">
                  {[
                    { value: 'individual', label: 'Team Members' },
                    { value: 'company', label: 'Company Users' },
                  ].map((role) => (
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
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">{role.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

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
        </div>

        {/* Metadata */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Metadata</h3>
          
          <div>
            <label htmlFor="tags" className="label-text">
              Tags
            </label>
            <input
              {...register('tags')}
              type="text"
              className="input-field"
              placeholder="performance, metrics, case-study"
            />
            <p className="mt-1 text-xs text-gray-500">
              Enter tags separated by commas to help organize documents
            </p>
          </div>
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
            disabled={createDocumentMutation.isPending || !selectedFile}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createDocumentMutation.isPending ? 'Uploading...' : 'Upload Document'}
          </button>
        </div>
      </form>
    </div>
  );
}