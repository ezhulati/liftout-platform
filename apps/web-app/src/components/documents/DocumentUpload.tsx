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
import { FormField, RequiredFieldsNote, ButtonGroup, TextLink } from '@/components/ui';

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
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to upload document';
      toast.error(message);
    }
  };

  return (
    <div className="card max-w-4xl">
      <div className="px-6 py-4 border-b border-border">
        <h2 className="text-lg font-bold text-text-primary">Upload document</h2>
        <p className="text-sm font-normal text-text-secondary">
          Share documents securely for liftout discussions and due diligence
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
        <RequiredFieldsNote />

        {/* File Upload Area */}
        <div className="space-y-4">
          <label className="label-text">
            Select file *
          </label>

          {!selectedFile ? (
            <div
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors duration-fast min-h-[160px] flex flex-col items-center justify-center ${
                dragActive
                  ? 'border-navy bg-navy-50'
                  : 'border-border hover:border-navy-300'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <CloudArrowUpIcon className="mx-auto h-12 w-12 text-text-tertiary" aria-hidden="true" />
              <div className="mt-4">
                <p className="text-sm text-text-secondary">
                  <span className="font-bold text-navy">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-text-tertiary mt-1">
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
            <div className="border border-border rounded-xl p-4 bg-bg-alt">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <DocumentTextIcon className="h-8 w-8 text-navy" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-bold text-text-primary">{selectedFile.name}</p>
                    <p className="text-xs text-text-tertiary">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  className="p-2 min-h-10 min-w-10 text-text-tertiary hover:text-error transition-colors duration-fast rounded-lg hover:bg-bg-elevated"
                  aria-label="Remove file"
                >
                  <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Document Details - Single column per Practical UI */}
        <div className="space-y-5">
          <FormField label="Document name" name="name" required error={errors.name?.message}>
            <input
              {...register('name')}
              id="name"
              type="text"
              className="input-field"
              placeholder="e.g., Team Profile Q3 2024"
            />
          </FormField>

          <FormField label="Document type" name="type" required error={errors.type?.message}>
            <select {...register('type')} id="type" className="input-field">
              {documentTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Description" name="description">
            <textarea
              {...register('description')}
              id="description"
              rows={3}
              className="input-field"
              placeholder="Brief description of the document contents and purpose..."
            />
          </FormField>
        </div>

        {/* Access Control */}
        <div className="space-y-5">
          <h3 className="text-lg font-bold text-text-primary">Access control</h3>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              {...register('confidential')}
              type="checkbox"
              className="rounded border-border text-navy focus:ring-navy w-5 h-5"
            />
            <span className="text-text-secondary">Mark as confidential</span>
          </label>

          <div className="space-y-3">
            <label className="label-text">
              Who can access this document? *
            </label>
            {accessTypes.map((type) => {
              const Icon = type.icon;
              return (
                <label key={type.value} className="flex items-start gap-3 cursor-pointer p-3 rounded-xl border border-border hover:bg-bg-alt transition-colors duration-fast">
                  <input
                    {...register('accessType')}
                    type="radio"
                    value={type.value}
                    className="mt-1 h-5 w-5 text-navy focus:ring-navy border-border"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5 text-text-tertiary" aria-hidden="true" />
                      <span className="text-sm font-bold text-text-primary">{type.label}</span>
                    </div>
                    <p className="text-sm text-text-tertiary">{type.description}</p>
                  </div>
                </label>
              );
            })}
          </div>

          {accessType === 'restricted' && (
            <div className="space-y-5 pl-7">
              <FormField
                label="Allowed users (email addresses)"
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
                <label className="label-text">Allowed roles</label>
                <div className="space-y-3 mt-2">
                  {[
                    { value: 'individual', label: 'Team Members' },
                    { value: 'company', label: 'Company Users' },
                  ].map((role) => (
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
                        className="rounded border-border text-navy focus:ring-navy w-5 h-5"
                      />
                      <span className="text-sm text-text-secondary">{role.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          <FormField label="Access expires" name="expiresIn">
            <select {...register('expiresIn')} id="expiresIn" className="input-field">
              {expirationOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        {/* Metadata */}
        <div className="space-y-5">
          <h3 className="text-lg font-bold text-text-primary">Metadata</h3>

          <FormField
            label="Tags"
            name="tags"
            hint="Enter tags separated by commas to help organize documents"
          >
            <input
              {...register('tags')}
              id="tags"
              type="text"
              className="input-field"
              placeholder="performance, metrics, case-study"
            />
          </FormField>
        </div>

        {/* Actions - LEFT aligned per Practical UI */}
        <div className="pt-6 border-t border-border">
          <ButtonGroup>
            <button
              type="submit"
              disabled={createDocumentMutation.isPending || !selectedFile}
              className="btn-primary min-h-12"
            >
              {createDocumentMutation.isPending ? 'Uploading...' : 'Upload document'}
            </button>
            <TextLink onClick={onCancel || (() => router.back())}>
              Cancel
            </TextLink>
          </ButtonGroup>
        </div>
      </form>
    </div>
  );
}