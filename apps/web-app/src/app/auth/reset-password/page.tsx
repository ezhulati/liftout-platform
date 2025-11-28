'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { CheckCircleIcon, ExclamationTriangleIcon, EyeIcon, EyeSlashIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { FormField } from '@/components/ui';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [maskedEmail, setMaskedEmail] = useState('');
  const [error, setError] = useState('');

  // Validate token on mount
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setError('No reset token provided');
        setIsValidating(false);
        return;
      }

      try {
        const response = await fetch(`/api/auth/password-reset?token=${token}`);
        const data = await response.json();

        if (response.ok && data.valid) {
          setIsValid(true);
          setMaskedEmail(data.email || '');
        } else {
          setError(data.error || 'Invalid or expired reset link');
        }
      } catch {
        setError('Failed to validate reset link');
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset password');
      }

      setIsSuccess(true);
      toast.success('Password reset successfully!');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to reset password';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg py-12 px-6">
        <div className="max-w-md w-full text-center">
          <div className="animate-spin h-8 w-8 border-4 border-navy border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-text-secondary">Validating reset link...</p>
        </div>
      </div>
    );
  }

  // Invalid token
  if (!isValid && !isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg py-12 px-6">
        <div className="max-w-md w-full">
          <Link href="/" className="flex items-center justify-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-lg bg-navy flex items-center justify-center">
              <span className="text-gold font-heading font-bold text-xl">L</span>
            </div>
            <span className="font-heading font-bold text-2xl text-navy tracking-tight">Liftout</span>
          </Link>

          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-red-50 mb-6">
              <ExclamationTriangleIcon className="h-7 w-7 text-red-600" />
            </div>
            <h2 className="font-heading text-3xl font-bold text-text-primary mb-3">
              Invalid Reset Link
            </h2>
            <p className="text-text-secondary mb-6">
              {error || 'This password reset link is invalid or has expired.'}
            </p>
            <Link href="/auth/forgot-password" className="btn-primary inline-block min-h-12 px-6">
              Request New Reset Link
            </Link>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/auth/signin"
              className="inline-flex items-center gap-2 font-medium text-navy hover:text-navy-light transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg py-12 px-6">
        <div className="max-w-md w-full">
          <Link href="/" className="flex items-center justify-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-lg bg-navy flex items-center justify-center">
              <span className="text-gold font-heading font-bold text-xl">L</span>
            </div>
            <span className="font-heading font-bold text-2xl text-navy tracking-tight">Liftout</span>
          </Link>

          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-success-light mb-6">
              <CheckCircleIcon className="h-7 w-7 text-success" />
            </div>
            <h2 className="font-heading text-3xl font-bold text-text-primary mb-3">
              Password Reset Complete
            </h2>
            <p className="text-text-secondary mb-6">
              Your password has been reset successfully. You can now sign in with your new password.
            </p>
            <Link href="/auth/signin" className="btn-primary inline-block min-h-12 px-6">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Reset form
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg py-12 px-6">
      <div className="max-w-md w-full">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-lg bg-navy flex items-center justify-center">
            <span className="text-gold font-heading font-bold text-xl">L</span>
          </div>
          <span className="font-heading font-bold text-2xl text-navy tracking-tight">Liftout</span>
        </Link>

        <div className="text-center mb-8">
          <h2 className="font-heading text-3xl font-bold text-text-primary mb-3">
            Set New Password
          </h2>
          <p className="text-text-secondary">
            Enter your new password for {maskedEmail}
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <FormField label="New password" name="password" required hint="Minimum 6 characters">
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                className="input-field pr-12"
                placeholder="Enter your new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-text-tertiary hover:text-text-secondary transition-colors touch-target"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
            </div>
          </FormField>

          <FormField label="Confirm new password" name="confirmPassword" required>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                className="input-field pr-12"
                placeholder="Re-enter your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-text-tertiary hover:text-text-secondary transition-colors touch-target"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
            </div>
          </FormField>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full min-h-12"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Resetting password...
              </span>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link
            href="/auth/signin"
            className="inline-flex items-center gap-2 font-medium text-navy hover:text-navy-light transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
