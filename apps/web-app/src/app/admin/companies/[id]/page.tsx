'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import {
  ArrowLeftIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  GlobeAltIcon,
  CheckBadgeIcon,
  ClockIcon,
  XCircleIcon,
  TrashIcon,
  PencilIcon,
  UserIcon,
  BriefcaseIcon,
} from '@heroicons/react/24/outline';
import {
  useAdminCompany,
  useUpdateCompany,
  useVerifyCompany,
  useRejectCompanyVerification,
  useDeleteCompany,
} from '@/hooks/admin/useAdminCompanies';

function VerificationBadge({ status }: { status: string }) {
  const config = {
    verified: { label: 'Verified', icon: CheckBadgeIcon, color: 'bg-green-500/10 text-green-400' },
    pending: { label: 'Pending', icon: ClockIcon, color: 'bg-yellow-500/10 text-yellow-400' },
    rejected: { label: 'Rejected', icon: XCircleIcon, color: 'bg-red-500/10 text-red-400' },
  }[status] || { label: status, icon: ClockIcon, color: 'bg-gray-500/10 text-gray-400' };

  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium ${config.color}`}>
      <Icon className="h-4 w-4" />
      {config.label}
    </span>
  );
}

export default function CompanyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const companyId = params.id as string;

  // Data fetching
  const { data: company, isLoading, error, refetch } = useAdminCompany(companyId);

  // Mutations
  const updateCompany = useUpdateCompany();
  const verifyCompany = useVerifyCompany();
  const rejectVerification = useRejectCompanyVerification();
  const deleteCompany = useDeleteCompany();

  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', description: '', industry: '' });

  const handleVerify = async () => {
    try {
      await verifyCompany.mutateAsync(companyId);
      toast.success('Company verified');
      refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to verify company');
    }
  };

  const handleReject = async () => {
    try {
      await rejectVerification.mutateAsync({ companyId });
      toast.success('Company verification rejected');
      refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to reject verification');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this company?')) return;
    try {
      await deleteCompany.mutateAsync(companyId);
      toast.success('Company deleted');
      router.push('/admin/companies');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete company');
    }
  };

  const startEditing = () => {
    if (company) {
      setEditForm({
        name: company.name,
        description: company.description || '',
        industry: company.industry || '',
      });
      setIsEditing(true);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateCompany.mutateAsync({
        companyId,
        data: editForm,
      });
      toast.success('Company updated');
      setIsEditing(false);
      refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update company');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-8 w-8 bg-gray-700 rounded animate-pulse"></div>
          <div className="h-8 w-48 bg-gray-700 rounded animate-pulse"></div>
        </div>
        <div className="h-64 bg-gray-800 rounded-xl animate-pulse"></div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="space-y-6">
        <Link
          href="/admin/companies"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          Back to Companies
        </Link>
        <div className="p-8 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
          <p className="text-red-400">Failed to load company details</p>
          <button
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/companies"
            className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gray-700 flex items-center justify-center">
              <BuildingOfficeIcon className="h-6 w-6 text-gray-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{company.name}</h1>
              <p className="text-gray-400">{company.industry || 'No industry specified'}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <VerificationBadge status={company.verificationStatus} />
          {company.deletedAt && (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-500/10 text-gray-400">
              <TrashIcon className="h-4 w-4" />
              Deleted
            </span>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        {!company.deletedAt && (
          <>
            {company.verificationStatus === 'pending' && (
              <>
                <button
                  onClick={handleVerify}
                  disabled={verifyCompany.isPending}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  <CheckBadgeIcon className="h-4 w-4" />
                  {verifyCompany.isPending ? 'Verifying...' : 'Verify Company'}
                </button>
                <button
                  onClick={handleReject}
                  disabled={rejectVerification.isPending}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  <XCircleIcon className="h-4 w-4" />
                  {rejectVerification.isPending ? 'Rejecting...' : 'Reject'}
                </button>
              </>
            )}
            <button
              onClick={handleDelete}
              disabled={deleteCompany.isPending}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              <TrashIcon className="h-4 w-4" />
              {deleteCompany.isPending ? 'Deleting...' : 'Delete Company'}
            </button>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Company Information */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
              <h2 className="text-lg font-semibold text-white">Company Information</h2>
              {!isEditing && (
                <button
                  onClick={startEditing}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <PencilIcon className="h-4 w-4" />
                  Edit
                </button>
              )}
            </div>
            <div className="p-6">
              {isEditing ? (
                <form onSubmit={handleUpdate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Company Name</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Industry</label>
                    <input
                      type="text"
                      value={editForm.industry}
                      onChange={(e) => setEditForm({ ...editForm, industry: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={updateCompany.isPending}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
                    >
                      {updateCompany.isPending ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              ) : (
                <dl className="space-y-4">
                  {company.website && (
                    <div className="flex items-start gap-3">
                      <GlobeAltIcon className="h-5 w-5 text-gray-500 mt-0.5" />
                      <div>
                        <dt className="text-sm text-gray-500">Website</dt>
                        <dd className="text-white">
                          <a
                            href={company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-red-400 hover:text-red-300"
                          >
                            {company.website}
                          </a>
                        </dd>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <CalendarIcon className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <dt className="text-sm text-gray-500">Created</dt>
                      <dd className="text-white">{formatDate(company.createdAt)}</dd>
                    </div>
                  </div>
                  {company.description && (
                    <div>
                      <dt className="text-sm text-gray-500 mb-1">Description</dt>
                      <dd className="text-white whitespace-pre-wrap">{company.description}</dd>
                    </div>
                  )}
                </dl>
              )}
            </div>
          </div>

          {/* Company Users */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-700">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <UserIcon className="h-5 w-5 text-gray-500" />
                Team Members ({company.users?.length || 0})
              </h2>
            </div>
            <div className="divide-y divide-gray-700">
              {!company.users || company.users.length === 0 ? (
                <div className="p-6 text-center text-gray-400">No team members</div>
              ) : (
                company.users.map((member) => (
                  <div key={member.id} className="px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
                        <UserIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">
                          {member.user.firstName} {member.user.lastName}
                        </p>
                        <p className="text-sm text-gray-400">{member.user.email}</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs font-medium">
                      {member.role}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Opportunities */}
          {company.opportunities && company.opportunities.length > 0 && (
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-700">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <BriefcaseIcon className="h-5 w-5 text-gray-500" />
                  Recent Opportunities
                </h2>
              </div>
              <div className="divide-y divide-gray-700">
                {company.opportunities.map((opportunity) => (
                  <div key={opportunity.id} className="px-6 py-4 flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">{opportunity.title}</p>
                      <p className="text-sm text-gray-400">{formatDate(opportunity.createdAt)}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      opportunity.status === 'active'
                        ? 'bg-green-500/10 text-green-400'
                        : opportunity.status === 'closed'
                          ? 'bg-red-500/10 text-red-400'
                          : 'bg-yellow-500/10 text-yellow-400'
                    }`}>
                      {opportunity.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
            <h3 className="font-semibold text-white mb-4">Company Stats</h3>
            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="text-gray-400 text-sm">Team Members</dt>
                <dd className="text-white font-medium">{company._count.users}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-400 text-sm">Opportunities</dt>
                <dd className="text-white font-medium">{company._count.opportunities}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
