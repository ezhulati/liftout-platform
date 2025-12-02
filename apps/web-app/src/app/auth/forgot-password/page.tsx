'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircleIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { FormField } from '@/components/ui';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { sendPasswordReset } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setIsLoading(true);

    try {
      await sendPasswordReset(email);
      setIsSubmitted(true);
      toast.success('Password reset email sent!');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send reset email. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg py-12 px-6">
        <div className="max-w-md w-full">
          {/* Logo */}
          <Link href="/" className="flex items-center justify-center mb-8">
            <img
              src="/liftout.png"
              alt="Liftout"
              className="h-10 w-auto"
            />
          </Link>

          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-success-light mb-6">
              <CheckCircleIcon className="h-7 w-7 text-success" />
            </div>
            <h2 className="font-heading text-3xl font-bold text-text-primary mb-3">
              Check your email
            </h2>
            <p className="text-text-secondary mb-2">
              We&apos;ve sent a password reset link to
            </p>
            <p className="font-semibold text-text-primary mb-6">{email}</p>
            <p className="text-text-tertiary text-base">
              Didn&apos;t receive the email? Check your spam folder or{' '}
              <button
                onClick={() => setIsSubmitted(false)}
                className="font-medium text-gold hover:text-gold-dark transition-colors"
              >
                try again
              </button>
            </p>
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg py-12 px-6">
      <div className="max-w-md w-full">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center mb-8">
          <img
            src="/liftout.png"
            alt="Liftout"
            className="h-10 w-auto"
          />
        </Link>

        <div className="text-center mb-8">
          <h2 className="font-heading text-3xl font-bold text-text-primary mb-3">
            Reset your password
          </h2>
          <p className="text-text-secondary">
            Enter your email address and we&apos;ll send you a link to reset your password.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <FormField label="Email address" name="email" required>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="input-field"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
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
                Sending...
              </span>
            ) : (
              'Send reset link'
            )}
          </button>

          <div className="text-center">
            <Link
              href="/auth/signin"
              className="text-link inline-flex items-center gap-2"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Back to sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
