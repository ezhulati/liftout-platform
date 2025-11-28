'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { signIn as nextAuthSignIn } from 'next-auth/react';
import { DEMO_ACCOUNTS } from '@/lib/demo-accounts';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { FormField } from '@/components/ui';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      const result = await nextAuthSignIn('credentials', {
        email,
        password,
        callbackUrl: '/app/dashboard',
        redirect: false,
      });

      if (result?.error) {
        toast.error('Invalid credentials');
      } else if (result?.ok) {
        toast.success('Signed in successfully');
        window.location.href = '/app/dashboard';
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Sign in failed';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await nextAuthSignIn('google', { callbackUrl: '/app/dashboard' });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Google sign in failed';
      toast.error(errorMessage);
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = (type: 'individual' | 'company') => {
    const account = DEMO_ACCOUNTS[type];
    setEmail(account.email);
    setPassword(account.password);
  };

  return (
    <div className="min-h-screen flex bg-bg">
      {/* Left side - Branding with background image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-no-repeat"
          style={{ backgroundImage: 'url(/signin-hero.jpeg)', backgroundPosition: '65% center' }}
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          {/* Logo */}
          <Link href="/" className="group">
            <Image
              src="/Liftout-logo-white.png"
              alt="Liftout"
              width={240}
              height={66}
              className="h-[66px] w-auto transition-opacity duration-fast group-hover:opacity-80"
            />
          </Link>

          {/* Content */}
          <div>
            <h1 className="font-heading text-4xl font-bold mb-4 leading-tight text-white">
              Strategic Team
              <span className="block text-gold">Acquisition Platform</span>
            </h1>
            <p className="text-white/90 text-lg leading-relaxed max-w-md">
              Connect with proven, intact teams ready for new opportunities.
              Transform your growth strategy today.
            </p>
          </div>

          {/* Stats */}
          <div className="flex gap-8">
            <div>
              <p className="text-gold font-heading text-3xl font-bold">85%</p>
              <p className="text-white/70 text-sm">Faster Integration</p>
            </div>
            <div>
              <p className="text-gold font-heading text-3xl font-bold">3x</p>
              <p className="text-white/70 text-sm">Productivity Gain</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link href="/" className="lg:hidden flex items-center mb-8">
            <Image
              src="/Liftout-logo-dark.png"
              alt="Liftout"
              width={180}
              height={50}
              className="h-12 w-auto"
            />
          </Link>

          <div className="mb-8">
            <h2 className="font-heading text-3xl font-bold text-text-primary mb-2">
              Welcome back
            </h2>
            <p className="text-text-secondary">
              Access your team profile or company dashboard
            </p>
          </div>

          {/* Demo Credentials - Less prominent, below main form conceptually */}
          <details className="mb-6 group">
            <summary className="cursor-pointer text-sm text-text-tertiary hover:text-text-secondary transition-colors list-none flex items-center gap-2">
              <span className="text-gold">▸</span>
              <span className="group-open:hidden">Try demo credentials</span>
              <span className="hidden group-open:inline">Hide demo credentials</span>
            </summary>
            <div className="mt-3 bg-bg-alt border border-border-decorative rounded-lg p-4">
              <p className="text-text-tertiary text-sm mb-3">
                Click to fill credentials:
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => fillDemoCredentials('individual')}
                  className="text-link text-sm"
                >
                  Team lead demo
                </button>
                <span className="text-text-tertiary">|</span>
                <button
                  type="button"
                  onClick={() => fillDemoCredentials('company')}
                  className="text-link text-sm"
                >
                  Company demo
                </button>
              </div>
            </div>
          </details>

          {/* Google Sign In - Outline style (not competing with primary) */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="btn-outline w-full flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-bg text-text-tertiary">Or continue with email</span>
            </div>
          </div>

          {/* Email/Password Form - Single column, sentence case labels */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <FormField
              label="Email address"
              name="email-address"
              required
            >
              <input
                id="email-address"
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

            <FormField
              label="Password"
              name="password"
              required
            >
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  className="input-field pr-12"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-text-tertiary hover:text-text-secondary transition-colors touch-target"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </FormField>

            <div className="flex items-center justify-end">
              <Link
                href="/auth/forgot-password"
                className="text-link text-sm"
              >
                Forgot your password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          {/* Sign up link */}
          <p className="mt-6 text-center text-text-secondary">
            Don&apos;t have an account?{' '}
            <Link
              href="/auth/signup"
              className="text-link inline"
            >
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
