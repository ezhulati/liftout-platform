'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  UserGroupIcon,
  BuildingOfficeIcon,
  CheckIcon,
  XMarkIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

interface InvitationDetails {
  id: string;
  teamName: string;
  inviterName: string;
  inviteeEmail?: string;
  role: string;
  message?: string;
  expiresAt: string;
  status: string;
  type: 'team' | 'company';
}

export default function InviteAcceptPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const token = params?.token as string;

  const [invitation, setInvitation] = useState<InvitationDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (token) {
      fetchInvitation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchInvitation = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/invites/${token}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to load invitation');
        return;
      }

      setInvitation(data.invitation);
    } catch (err) {
      setError('Failed to load invitation details');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action: 'accept' | 'decline') => {
    if (!session?.user) {
      // Redirect to sign in with callback
      router.push(`/auth/signin?callbackUrl=/invites/${token}`);
      return;
    }

    try {
      setActionLoading(true);
      const response = await fetch(`/api/invites/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.requiresAuth) {
          router.push(data.redirectTo);
          return;
        }
        throw new Error(data.error || 'Failed to process invitation');
      }

      toast.success(data.message);
      router.push(data.redirectTo || '/app/dashboard');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to process invitation');
    } finally {
      setActionLoading(false);
    }
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'member':
        return 'Team Member';
      case 'admin':
        return 'Team Admin';
      case 'leader':
        return 'Team Leader';
      default:
        return role;
    }
  };

  // Loading state
  if (loading || sessionStatus === 'loading') {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="card animate-pulse">
            <div className="flex items-center justify-center mb-6">
              <div className="h-16 w-16 rounded-full bg-bg-alt"></div>
            </div>
            <div className="h-6 bg-bg-alt rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-bg-alt rounded w-1/2 mx-auto mb-8"></div>
            <div className="space-y-3">
              <div className="h-12 bg-bg-alt rounded"></div>
              <div className="h-12 bg-bg-alt rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="card text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-error/10 flex items-center justify-center mb-6">
              <ExclamationTriangleIcon className="h-8 w-8 text-error" />
            </div>
            <h1 className="text-xl font-bold text-text-primary mb-2">
              {error === 'This invitation has expired'
                ? 'Invitation Expired'
                : 'Invitation Not Found'}
            </h1>
            <p className="text-text-secondary mb-6 leading-relaxed">
              {error === 'This invitation has expired'
                ? 'This invitation has expired. Please ask the team leader to send you a new one.'
                : 'This invitation link is invalid or has already been used.'}
            </p>
            <Link href="/" className="btn-primary min-h-12 inline-flex items-center">
              Go to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!invitation) {
    return null;
  }

  const isExpired = new Date(invitation.expiresAt) < new Date();
  const Icon = invitation.type === 'company' ? BuildingOfficeIcon : UserGroupIcon;

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="card">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-purple-100 flex items-center justify-center mb-4">
              <Icon className="h-8 w-8 text-purple-600" />
            </div>
            <h1 className="text-xl font-bold text-text-primary mb-1">
              You&apos;ve been invited!
            </h1>
            <p className="text-text-secondary">
              {invitation.inviterName} invited you to join
            </p>
          </div>

          {/* Team/Company Info */}
          <div className="bg-bg-alt rounded-xl p-4 mb-6">
            <h2 className="text-lg font-bold text-text-primary mb-1">
              {invitation.teamName}
            </h2>
            <div className="flex items-center gap-2 text-sm text-text-tertiary">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-purple-100 text-purple-800">
                {getRoleDescription(invitation.role)}
              </span>
              <span>as {invitation.type === 'company' ? 'Company Rep' : 'Team Member'}</span>
            </div>
          </div>

          {/* Personal Message */}
          {invitation.message && (
            <div className="bg-navy-50 border border-navy-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-navy-800 italic">
                &ldquo;{invitation.message}&rdquo;
              </p>
            </div>
          )}

          {/* Expiration Warning */}
          {!isExpired && (
            <div className="flex items-center text-sm text-text-tertiary mb-6">
              <ClockIcon className="h-4 w-4 mr-2" />
              <span>
                Expires {formatDistanceToNow(new Date(invitation.expiresAt), { addSuffix: true })}
              </span>
            </div>
          )}

          {/* Expired State */}
          {isExpired ? (
            <div className="text-center">
              <div className="bg-warning/10 text-warning-dark rounded-lg p-4 mb-4">
                <p className="font-medium">This invitation has expired</p>
                <p className="text-sm mt-1">
                  Please ask {invitation.inviterName} to send you a new invitation.
                </p>
              </div>
              <Link href="/" className="btn-outline min-h-12 w-full inline-flex items-center justify-center">
                Go to Homepage
              </Link>
            </div>
          ) : !session?.user ? (
            /* Not logged in */
            <div className="space-y-3">
              <p className="text-sm text-text-secondary text-center mb-4">
                Sign in or create an account to accept this invitation
              </p>
              <Link
                href={`/auth/signin?callbackUrl=/invites/${token}`}
                className="btn-primary min-h-12 w-full inline-flex items-center justify-center"
              >
                Sign in to accept
              </Link>
              <Link
                href={`/auth/signup?invite=${token}&type=${invitation.type}&email=${encodeURIComponent(invitation.inviteeEmail || '')}`}
                className="btn-outline min-h-12 w-full inline-flex items-center justify-center"
              >
                Create account
              </Link>
            </div>
          ) : (
            /* Logged in - show accept/decline */
            <div className="space-y-3">
              <button
                onClick={() => handleAction('accept')}
                disabled={actionLoading}
                className="btn-primary min-h-12 w-full inline-flex items-center justify-center bg-success hover:bg-success-dark"
              >
                {actionLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <CheckIcon className="h-5 w-5 mr-2" />
                    Accept Invitation
                  </>
                )}
              </button>
              <button
                onClick={() => handleAction('decline')}
                disabled={actionLoading}
                className="btn-outline min-h-12 w-full inline-flex items-center justify-center"
              >
                <XMarkIcon className="h-5 w-5 mr-2" />
                Decline
              </button>
            </div>
          )}

          {/* Current user info */}
          {session?.user && (
            <p className="text-xs text-text-tertiary text-center mt-4">
              Signed in as {session.user.email}
            </p>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-text-tertiary mt-6">
          <Link href="/" className="hover:text-text-secondary">
            Liftout
          </Link>{' '}
          &mdash; The platform for team-based hiring
        </p>
      </div>
    </div>
  );
}
