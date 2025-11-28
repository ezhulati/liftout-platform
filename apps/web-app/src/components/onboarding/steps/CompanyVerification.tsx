'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import {
  ShieldCheckIcon,
  DocumentTextIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  CloudArrowUpIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { FormField, ButtonGroup, TextLink } from '@/components/ui';

const verificationSchema = z.object({
  companyRegistrationNumber: z.string().min(1, 'Registration number is required'),
  taxId: z.string().min(1, 'Tax ID is required'),
  businessAddress: z.string().min(10, 'Please enter a complete business address'),
  contactName: z.string().min(2, 'Contact name is required'),
  contactTitle: z.string().min(2, 'Contact title is required'),
  contactEmail: z.string().email('Please enter a valid email'),
  contactPhone: z.string().min(10, 'Please enter a valid phone number'),
});

type VerificationFormData = z.infer<typeof verificationSchema>;

interface CompanyVerificationProps {
  onComplete: () => void;
  onSkip?: () => void;
}

interface UploadedDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  status: 'uploading' | 'uploaded' | 'verified' | 'error';
}

const documentTypes = [
  {
    id: 'registration',
    name: 'Business Registration',
    description: 'Certificate of incorporation or business registration',
    required: true,
  },
  {
    id: 'tax',
    name: 'Tax Documentation',
    description: 'Tax ID certificate or recent tax filing',
    required: true,
  },
  {
    id: 'address',
    name: 'Proof of Address',
    description: 'Utility bill or bank statement (within 3 months)',
    required: false,
  },
  {
    id: 'insurance',
    name: 'Insurance Certificate',
    description: 'Liability or professional indemnity insurance',
    required: false,
  },
];

export function CompanyVerification({ onComplete, onSkip }: CompanyVerificationProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, UploadedDocument>>({});
  const [activeUpload, setActiveUpload] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerificationFormData>({
    resolver: zodResolver(verificationSchema),
  });

  const handleFileUpload = (docTypeId: string, file: File) => {
    // Validate file
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];

    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a PDF or image file');
      return;
    }

    if (file.size > maxSize) {
      toast.error('File size must be less than 10MB');
      return;
    }

    // Simulate upload
    const uploadId = `${docTypeId}-${Date.now()}`;
    setUploadedDocs(prev => ({
      ...prev,
      [docTypeId]: {
        id: uploadId,
        name: file.name,
        type: file.type,
        size: file.size,
        status: 'uploading',
      },
    }));

    // Simulate upload progress
    setTimeout(() => {
      setUploadedDocs(prev => ({
        ...prev,
        [docTypeId]: {
          ...prev[docTypeId],
          status: 'uploaded',
        },
      }));
      toast.success(`${file.name} uploaded successfully`);
    }, 1500);
  };

  const removeDocument = (docTypeId: string) => {
    setUploadedDocs(prev => {
      const newDocs = { ...prev };
      delete newDocs[docTypeId];
      return newDocs;
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const onSubmit = async (data: VerificationFormData) => {
    // Check required documents
    const requiredDocs = documentTypes.filter(d => d.required);
    const missingDocs = requiredDocs.filter(d => !uploadedDocs[d.id]);

    if (missingDocs.length > 0) {
      toast.error(`Please upload required documents: ${missingDocs.map(d => d.name).join(', ')}`);
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast.success('Verification documents submitted successfully! We\'ll review them within 2 business days.');
      onComplete();
    } catch (error) {
      toast.error('Failed to submit verification');
    } finally {
      setIsSubmitting(false);
    }
  };

  const requiredDocsUploaded = documentTypes
    .filter(d => d.required)
    .every(d => uploadedDocs[d.id]?.status === 'uploaded' || uploadedDocs[d.id]?.status === 'verified');

  return (
    <div className="space-y-8">
      <div className="text-center">
        <ShieldCheckIcon className="mx-auto h-12 w-12 text-navy" />
        <h3 className="mt-2 text-lg font-bold text-text-primary">
          Verify your company
        </h3>
        <p className="mt-1 text-base text-text-secondary">
          Verified companies build trust with teams and get priority placement in search results.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Company Details */}
        <div className="space-y-5">
          <h4 className="text-base font-bold text-text-primary flex items-center">
            <BuildingOfficeIcon className="h-5 w-5 mr-2 text-text-tertiary" />
            Company details
          </h4>

          <FormField label="Company registration number" name="companyRegistrationNumber" required error={errors.companyRegistrationNumber?.message}>
            <input
              {...register('companyRegistrationNumber')}
              type="text"
              className="input-field"
              placeholder="e.g., 12345678"
            />
          </FormField>

          <FormField label="Tax ID / EIN" name="taxId" required error={errors.taxId?.message}>
            <input
              {...register('taxId')}
              type="text"
              className="input-field"
              placeholder="e.g., 12-3456789"
            />
          </FormField>

          <FormField label="Business address" name="businessAddress" required error={errors.businessAddress?.message}>
            <textarea
              {...register('businessAddress')}
              rows={2}
              className="input-field"
              placeholder="Full business address including city, state, and zip code"
            />
          </FormField>
        </div>

        {/* Verification Contact */}
        <div className="space-y-5">
          <h4 className="text-base font-bold text-text-primary flex items-center">
            <DocumentTextIcon className="h-5 w-5 mr-2 text-text-tertiary" />
            Verification contact
          </h4>
          <p className="text-sm text-text-tertiary">
            This person may be contacted to verify company information.
          </p>

          <FormField label="Contact name" name="contactName" required error={errors.contactName?.message}>
            <input
              {...register('contactName')}
              type="text"
              className="input-field"
              placeholder="Full name"
            />
          </FormField>

          <FormField label="Title / Position" name="contactTitle" required error={errors.contactTitle?.message}>
            <input
              {...register('contactTitle')}
              type="text"
              className="input-field"
              placeholder="e.g., CEO, HR Director"
            />
          </FormField>

          <FormField label="Email" name="contactEmail" required error={errors.contactEmail?.message}>
            <input
              {...register('contactEmail')}
              type="email"
              className="input-field"
              placeholder="work@company.com"
            />
          </FormField>

          <FormField label="Phone number" name="contactPhone" required error={errors.contactPhone?.message}>
            <input
              {...register('contactPhone')}
              type="tel"
              className="input-field"
              placeholder="+1 (555) 123-4567"
            />
          </FormField>
        </div>

        {/* Document Upload */}
        <div className="space-y-5">
          <h4 className="text-base font-bold text-text-primary flex items-center">
            <CloudArrowUpIcon className="h-5 w-5 mr-2 text-text-tertiary" />
            Verification documents
          </h4>
          <p className="text-sm text-text-tertiary">
            Upload documents to verify your company. PDF and image files accepted (max 10MB each).
          </p>

          <div className="space-y-4">
            {documentTypes.map((docType) => (
              <div
                key={docType.id}
                className={`border rounded-xl p-4 transition-colors ${
                  uploadedDocs[docType.id]
                    ? 'border-success bg-success-light/30'
                    : 'border-border hover:border-navy-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-text-primary">
                        {docType.name}
                      </span>
                      {docType.required && (
                        <span className="text-xs font-bold text-error">Required</span>
                      )}
                      {uploadedDocs[docType.id]?.status === 'uploaded' && (
                        <CheckCircleIcon className="h-5 w-5 text-success" />
                      )}
                    </div>
                    <p className="text-sm text-text-tertiary mt-1">
                      {docType.description}
                    </p>

                    {uploadedDocs[docType.id] && (
                      <div className="mt-3 flex items-center gap-3 text-sm">
                        <DocumentTextIcon className="h-4 w-4 text-text-tertiary" />
                        <span className="text-text-secondary">
                          {uploadedDocs[docType.id].name}
                        </span>
                        <span className="text-text-tertiary">
                          ({formatFileSize(uploadedDocs[docType.id].size)})
                        </span>
                        {uploadedDocs[docType.id].status === 'uploading' && (
                          <span className="text-navy">Uploading...</span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="ml-4">
                    {uploadedDocs[docType.id] ? (
                      <button
                        type="button"
                        onClick={() => removeDocument(docType.id)}
                        className="p-2 text-text-tertiary hover:text-error transition-colors min-h-10 min-w-10"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    ) : (
                      <label className="btn-outline min-h-12 cursor-pointer inline-flex items-center">
                        <CloudArrowUpIcon className="h-5 w-5 mr-2" />
                        Upload
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(docType.id, file);
                            e.target.value = '';
                          }}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Verification Notice */}
        <div className="bg-navy-50 border border-navy-200 rounded-xl p-4">
          <div className="flex">
            <ExclamationTriangleIcon className="h-5 w-5 text-navy flex-shrink-0 mt-0.5" />
            <div className="ml-3">
              <h4 className="text-sm font-bold text-navy-900">Verification process</h4>
              <div className="mt-2 text-sm text-navy-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>Verification typically takes 1-2 business days</li>
                  <li>You'll receive an email once verification is complete</li>
                  <li>Verified companies get a badge on their profile</li>
                  <li>You can continue using the platform while verification is pending</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6 border-t border-border">
          <ButtonGroup>
            <button
              type="submit"
              disabled={isSubmitting || !requiredDocsUploaded}
              className="btn-primary min-h-12 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <div className="loading-spinner mr-2" />
                  Submitting...
                </span>
              ) : (
                'Submit for verification'
              )}
            </button>
            {onSkip && (
              <TextLink onClick={onSkip} disabled={isSubmitting}>
                Skip for now
              </TextLink>
            )}
          </ButtonGroup>
          {!requiredDocsUploaded && (
            <p className="mt-2 text-sm text-text-tertiary">
              Please upload all required documents to continue
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
