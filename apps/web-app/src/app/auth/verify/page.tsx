'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  EnvelopeIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

type VerificationStatus = 'loading' | 'success' | 'error' | 'expired' | 'already-verified';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<VerificationStatus>('loading');
  const [message, setMessage] = useState('');
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided.');
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage(data.message || 'Your email has been verified successfully!');
          // Redirect to signin after 3 seconds
          setTimeout(() => {
            router.push('/auth/signin?verified=true');
          }, 3000);
        } else {
          if (data.error?.includes('expired')) {
            setStatus('expired');
            setMessage('This verification link has expired. Please request a new one.');
          } else if (data.error?.includes('already')) {
            setStatus('already-verified');
            setMessage('Your email is already verified. You can sign in.');
          } else {
            setStatus('error');
            setMessage(data.error || 'Failed to verify email.');
          }
        }
      } catch {
        setStatus('error');
        setMessage('An error occurred. Please try again.');
      }
    };

    verifyEmail();
  }, [token, router]);

  const handleResendVerification = async () => {
    setResending(true);
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      if (response.ok) {
        setResendSuccess(true);
      } else {
        const data = await response.json();
        setMessage(data.error || 'Failed to resend verification email.');
      }
    } catch {
      setMessage('Failed to resend verification email.');
    }
    setResending(false);
  };

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-navy-50 flex items-center justify-center mb-6">
              <ArrowPathIcon className="h-8 w-8 text-navy animate-spin" />
            </div>
            <h2 className="text-xl font-bold text-text-primary mb-2">Verifying your email...</h2>
            <p className="text-text-secondary">Please wait while we verify your email address.</p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-success-light flex items-center justify-center mb-6">
              <CheckCircleIcon className="h-8 w-8 text-success" />
            </div>
            <h2 className="text-xl font-bold text-text-primary mb-2">Email Verified!</h2>
            <p className="text-text-secondary mb-6">{message}</p>
            <p className="text-sm text-text-tertiary mb-4">Redirecting you to sign in...</p>
            <Link href="/auth/signin" className="btn-primary">
              Sign In Now
            </Link>
          </div>
        );

      case 'already-verified':
        return (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-blue-100 flex items-center justify-center mb-6">
              <CheckCircleIcon className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-text-primary mb-2">Already Verified</h2>
            <p className="text-text-secondary mb-6">{message}</p>
            <Link href="/auth/signin" className="btn-primary">
              Sign In
            </Link>
          </div>
        );

      case 'expired':
        return (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-gold-100 flex items-center justify-center mb-6">
              <ExclamationCircleIcon className="h-8 w-8 text-gold-600" />
            </div>
            <h2 className="text-xl font-bold text-text-primary mb-2">Link Expired</h2>
            <p className="text-text-secondary mb-6">{message}</p>
            {resendSuccess ? (
              <div className="p-4 bg-success-light rounded-lg">
                <p className="text-success-dark">
                  A new verification email has been sent. Please check your inbox.
                </p>
              </div>
            ) : (
              <button
                onClick={handleResendVerification}
                disabled={resending}
                className="btn-primary flex items-center justify-center mx-auto"
              >
                {resending ? (
                  <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <EnvelopeIcon className="h-4 w-4 mr-2" />
                )}
                Resend Verification Email
              </button>
            )}
          </div>
        );

      case 'error':
      default:
        return (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-error/10 flex items-center justify-center mb-6">
              <ExclamationCircleIcon className="h-8 w-8 text-error" />
            </div>
            <h2 className="text-xl font-bold text-text-primary mb-2">Verification Failed</h2>
            <p className="text-text-secondary mb-6">{message}</p>
            <div className="flex flex-col gap-3">
              <Link href="/auth/signin" className="btn-primary">
                Go to Sign In
              </Link>
              <Link href="/auth/signup" className="btn-outline">
                Create New Account
              </Link>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-bg-alt flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="card">
          <div className="px-8 py-10">{renderContent()}</div>
        </div>

        <p className="text-center text-sm text-text-tertiary mt-6">
          Having trouble?{' '}
          <a href="mailto:support@liftout.com" className="text-navy hover:underline">
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
}
