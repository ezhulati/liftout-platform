'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';
import {
    ArrowLeftIcon,
    CheckCircleIcon,
    DocumentArrowUpIcon,
    ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { useQuery } from '@tanstack/react-query';

export default function TeamVerificationPage() {
    const { userData } = useAuth();
    const router = useRouter();
    const [files, setFiles] = useState<FileList | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data: team, isLoading } = useQuery({
        queryKey: ['my-team'],
        queryFn: () => fetch('/api/teams/my-team').then(res => res.json()),
        enabled: !!userData,
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFiles(e.target.files);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!files || files.length === 0) {
            toast.error('Please select at least one file to upload.');
            return;
        }
        setIsSubmitting(true);

        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }

        try {
            const response = await fetch('/api/teams/verification', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to submit documents for verification.');
            }

            toast.success('Documents submitted successfully!');
            router.push('/app/teams/manage');
        } catch (error) {
            toast.error((error as Error).message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!team) {
        return <div>You are not part of any team.</div>
    }

    return (
        <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
                <button
                    onClick={() => router.back()}
                    className="inline-flex items-center text-text-tertiary hover:text-text-secondary min-h-12 mb-4"
                >
                    <ArrowLeftIcon className="h-5 w-5 mr-2" />
                    Back to team management
                </button>

                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-navy-50 flex items-center justify-center">
                        <ShieldCheckIcon className="h-6 w-6 text-navy" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-text-primary font-heading leading-tight">Team Verification</h1>
                        <p className="text-base text-text-secondary mt-1">Submit documents to verify your team&apos;s credentials.</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="card">
                    <div className="px-6 py-4 border-b border-border">
                        <h2 className="text-lg font-medium text-text-primary">Upload Documents</h2>
                    </div>
                    <div className="px-6 py-6 space-y-5">
                        <p className="text-text-secondary">
                            Upload documents such as team portfolio, client testimonials, or any other relevant files that can help us verify your team&apos;s experience and expertise.
                        </p>
                        <div>
                            <label htmlFor="documents" className="label-text label-required">
                                Documents
                            </label>
                            <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-border border-dashed rounded-md">
                                <div className="space-y-1 text-center">
                                    <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-text-tertiary" />
                                    <div className="flex text-sm text-text-secondary">
                                        <label
                                            htmlFor="file-upload"
                                            className="relative cursor-pointer bg-bg-surface rounded-md font-medium text-navy hover:text-navy-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-navy"
                                        >
                                            <span>Upload files</span>
                                            <input id="file-upload" name="files" type="file" className="sr-only" multiple onChange={handleFileChange} />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-text-tertiary">PNG, JPG, GIF, PDF up to 10MB</p>
                                </div>
                            </div>
                        </div>

                        {files && (
                            <div>
                                <h3 className="text-lg font-medium text-text-primary">Selected files:</h3>
                                <ul className="list-disc list-inside mt-2">
                                    {Array.from(files).map((file, index) => (
                                        <li key={index} className="text-text-secondary">{file.name}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-4 pt-6 border-t border-border">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-primary min-h-12"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit for verification'}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="text-link min-h-12"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
