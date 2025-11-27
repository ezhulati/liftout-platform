'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { signIn as nextAuthSignIn } from 'next-auth/react';
import { DEMO_ACCOUNTS } from '@/lib/demo-accounts';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

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
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-navy relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gold/10 blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-gold/5 blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gold flex items-center justify-center">
              <span className="text-navy-900 font-heading font-bold text-xl">L</span>
            </div>
            <span className="font-heading font-bold text-2xl tracking-tight">Liftout</span>
          </Link>

          {/* Content */}
          <div>
            <h1 className="font-heading text-4xl font-bold mb-4 leading-tight">
              Strategic Team
              <span className="block text-gold">Acquisition Platform</span>
            </h1>
            <p className="text-navy-200 text-lg leading-relaxed max-w-md">
              Connect with proven, intact teams ready for new opportunities.
              Transform your growth strategy today.
            </p>
          </div>

          {/* Stats */}
          <div className="flex gap-8">
            <div>
              <p className="text-gold font-heading text-3xl font-bold">85%</p>
              <p className="text-navy-300 text-sm">Faster Integration</p>
            </div>
            <div>
              <p className="text-gold font-heading text-3xl font-bold">3x</p>
              <p className="text-navy-300 text-sm">Productivity Gain</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link href="/" className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-lg bg-navy flex items-center justify-center">
              <span className="text-gold font-heading font-bold text-xl">L</span>
            </div>
            <span className="font-heading font-bold text-2xl text-navy tracking-tight">Liftout</span>
          </Link>

          <div className="mb-8">
            <h2 className="font-heading text-3xl font-bold text-text-primary mb-2">
              Welcome back
            </h2>
            <p className="text-text-secondary">
              Access your team profile or company dashboard
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="bg-navy-50 border border-navy-100 rounded-xl p-5 mb-8">
            <h3 className="font-semibold text-navy mb-3">Try the Demo</h3>
            <p className="text-text-secondary text-sm mb-4">
              Experience Liftout from both perspectives:
            </p>
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => fillDemoCredentials('individual')}
                className="w-full text-left p-3 bg-bg-surface rounded-lg border border-border hover:border-gold/50 hover:shadow-sm transition-all duration-fast group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-navy-100 rounded-full flex items-center justify-center group-hover:bg-navy-200 transition-colors">
                    <span className="text-lg">👤</span>
                  </div>
                  <div>
                    <p className="font-semibold text-text-primary text-sm">Team Lead / Individual</p>
                    <p className="text-text-tertiary text-xs">Alex Chen - Data Science Team Lead</p>
                  </div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('company')}
                className="w-full text-left p-3 bg-bg-surface rounded-lg border border-border hover:border-gold/50 hover:shadow-sm transition-all duration-fast group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gold-100 rounded-full flex items-center justify-center group-hover:bg-gold-200 transition-colors">
                    <span className="text-lg">🏢</span>
                  </div>
                  <div>
                    <p className="font-semibold text-text-primary text-sm">Company / Talent Acquisition</p>
                    <p className="text-text-tertiary text-xs">Sarah Rodriguez - VP Talent, NextGen Financial</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-bg-surface border border-border rounded-lg font-medium text-text-primary hover:bg-bg-elevated hover:border-border-hover transition-all duration-fast touch-target disabled:opacity-50 disabled:cursor-not-allowed"
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

          {/* Email/Password Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email-address" className="label-text">
                Email address
              </label>
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
            </div>

            <div>
              <label htmlFor="password" className="label-text">
                Password
              </label>
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
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-text-tertiary hover:text-text-secondary transition-colors"
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
            </div>

            <div className="flex items-center justify-end">
              <Link
                href="/auth/forgot-password"
                className="text-sm font-medium text-gold hover:text-gold-dark transition-colors"
              >
                Forgot your password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3 text-base"
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
              className="font-medium text-gold hover:text-gold-dark transition-colors"
            >
              Join the platform
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
