'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { signIn } from 'next-auth/react';
import { useAuth } from '@/contexts/AuthContext';
import { EyeIcon, EyeSlashIcon, UserGroupIcon, BuildingOffice2Icon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid';
import { FormField, RequiredFieldsNote } from '@/components/ui';

const industries = [
  'Investment Banking & Finance',
  'Law Firms',
  'Consulting',
  'Advertising & Marketing',
  'Technology & Software Development',
  'Healthcare/Medical Teams',
  'Private Equity & Fund Management',
  'Management Consulting',
  'Engineering',
  'Sales & Business Development',
  'Other',
];

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    userType: 'individual' as 'individual' | 'company',
    companyName: '',
    industry: '',
    location: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const { signUp } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    if (formData.userType === 'company' && !formData.companyName) {
      toast.error('Company name is required for company accounts');
      return;
    }

    setIsLoading(true);

    try {
      // First, create the account
      await signUp({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        userType: formData.userType,
        companyName: formData.companyName,
        industry: formData.industry,
        location: formData.location,
      });

      toast.success('Account created! Signing you in...');

      // Then sign in with the new credentials
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error('Account created but sign in failed. Please sign in manually.');
        router.push('/auth/signin');
        return;
      }

      router.push('/app/onboarding');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Sign up failed';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignUp = async (provider: 'google' | 'linkedin') => {
    setIsLoading(true);
    try {
      await signIn(provider, { callbackUrl: '/app/onboarding' });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : `${provider} sign up failed`;
      toast.error(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-bg">
      {/* Left side - Branding with background image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/Liftout_AdobeStock_577548004.jpeg)' }}
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          {/* Logo - Premium badge dark variant */}
          <Link href="/" className="group inline-flex">
            <div className="relative bg-gradient-to-b from-white/[0.08] to-white/[0.03] rounded-xl px-5 py-2.5 border border-white/10 group-hover:border-white/20 transition-all duration-300">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/[0.05] via-transparent to-transparent" />
              <div className="absolute inset-x-3 -bottom-px h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <Image
                src="/Liftout-logo-white.png"
                alt="Liftout"
                width={200}
                height={52}
                className="h-[52px] w-auto relative"
              />
            </div>
          </Link>

          {/* Content */}
          <div>
            <h1 className="font-heading text-4xl font-bold mb-4 leading-tight text-white">
              Join the Future of
              <span className="block text-purple-300">Team Acquisition</span>
            </h1>
            <p className="text-white/90 text-lg leading-relaxed max-w-md mb-8">
              Whether you&apos;re a high-performing team seeking opportunities or a company looking
              to acquire proven talent, Liftout is your platform for strategic growth.
            </p>

            {/* Benefits list */}
            <ul className="space-y-4">
              {[
                'Connect with verified, high-performing teams',
                'Confidential exploration and matching',
                'Streamlined acquisition process',
              ].map((benefit, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-purple-700/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-purple-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-white/90">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Social proof */}
          <div>
            <p className="text-white/70 text-sm">
              Trusted by teams and companies across Finance, Healthcare, and Technology
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Mobile logo - Premium badge light variant */}
          <Link href="/" className="lg:hidden inline-flex mb-8 group">
            <div className="relative bg-gradient-to-b from-white to-gray-50/80 rounded-xl px-4 py-2 border border-gray-200/80 group-hover:border-gray-300/90 transition-all duration-300">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/60 via-transparent to-transparent" />
              <div className="absolute inset-x-2 -bottom-px h-px bg-gradient-to-r from-transparent via-gray-300/50 to-transparent" />
              <Image
                src="/Liftout-logo-dark.png"
                alt="Liftout"
                width={160}
                height={44}
                className="h-10 w-auto relative"
              />
            </div>
          </Link>

          <div className="mb-8">
            <h2 className="font-heading text-3xl font-bold text-text-primary mb-2">
              Create your account
            </h2>
            <p className="text-text-secondary">
              Start connecting teams with opportunities today
            </p>
          </div>

          {/* OAuth Sign Up Buttons */}
          <div className="space-y-3">
            {/* Google Sign Up */}
            <button
              type="button"
              onClick={() => handleOAuthSignUp('google')}
              disabled={isLoading}
              className="btn-outline min-h-12 w-full flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>

            {/* LinkedIn Sign Up */}
            <button
              type="button"
              onClick={() => handleOAuthSignUp('linkedin')}
              disabled={isLoading}
              className="btn-outline min-h-12 w-full flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#0A66C2">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              Continue with LinkedIn
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-bg text-text-tertiary">Or create account with email</span>
            </div>
          </div>

          {/* Sign Up Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <RequiredFieldsNote />

            {/* User Type Selection */}
            <div>
              <label className="label-text mb-3">Account type</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, userType: 'individual' }))}
                  className={`relative rounded-xl border-2 p-4 text-center transition-all duration-200 ${
                    formData.userType === 'individual'
                      ? 'border-purple-700 bg-purple-700 ring-2 ring-purple-700/30 ring-offset-2 shadow-lg'
                      : 'border-border bg-white hover:border-purple-200 hover:bg-purple-50'
                  }`}
                >
                  {formData.userType === 'individual' && (
                    <CheckCircleIconSolid className="absolute top-2 right-2 w-6 h-6 text-white" />
                  )}
                  <UserGroupIcon className={`w-8 h-8 mx-auto mb-2 ${
                    formData.userType === 'individual' ? 'text-white' : 'text-gray-400'
                  }`} />
                  <div className={`font-semibold text-sm ${
                    formData.userType === 'individual' ? 'text-white' : 'text-text-primary'
                  }`}>Individual / Team</div>
                  <div className={`text-sm mt-1 ${
                    formData.userType === 'individual' ? 'text-white/80' : 'text-text-tertiary'
                  }`}>Looking for opportunities</div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, userType: 'company' }))}
                  className={`relative rounded-xl border-2 p-4 text-center transition-all duration-200 ${
                    formData.userType === 'company'
                      ? 'border-purple-600 bg-purple-600 ring-2 ring-purple-600/30 ring-offset-2 shadow-lg'
                      : 'border-border bg-white hover:border-purple-200 hover:bg-purple-50'
                  }`}
                >
                  {formData.userType === 'company' && (
                    <CheckCircleIconSolid className="absolute top-2 right-2 w-6 h-6 text-white" />
                  )}
                  <BuildingOffice2Icon className={`w-8 h-8 mx-auto mb-2 ${
                    formData.userType === 'company' ? 'text-white' : 'text-gray-400'
                  }`} />
                  <div className={`font-semibold text-sm ${
                    formData.userType === 'company' ? 'text-white' : 'text-text-primary'
                  }`}>Company</div>
                  <div className={`text-sm mt-1 ${
                    formData.userType === 'company' ? 'text-white/80' : 'text-text-tertiary'
                  }`}>Hiring teams</div>
                </button>
              </div>
            </div>

            {/* Name Fields - Single column per Practical UI */}
            <FormField label="First name" name="firstName" required>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                className="input-field"
                placeholder="John"
                value={formData.firstName}
                onChange={handleChange}
              />
            </FormField>

            <FormField label="Last name" name="lastName" required>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                className="input-field"
                placeholder="Smith"
                value={formData.lastName}
                onChange={handleChange}
              />
            </FormField>

            {/* Email */}
            <FormField label="Email address" name="email" required>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="input-field"
                placeholder="you@company.com"
                value={formData.email}
                onChange={handleChange}
              />
            </FormField>

            {/* Company Name (if company type) */}
            {formData.userType === 'company' && (
              <FormField label="Company name" name="companyName" required>
                <input
                  id="companyName"
                  name="companyName"
                  type="text"
                  required
                  className="input-field"
                  placeholder="Acme Corporation"
                  value={formData.companyName}
                  onChange={handleChange}
                />
              </FormField>
            )}

            {/* Industry */}
            <FormField label="Industry" name="industry">
              <select
                id="industry"
                name="industry"
                className="input-field"
                value={formData.industry}
                onChange={handleChange}
              >
                <option value="">Select industry (optional)</option>
                {industries.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
            </FormField>

            {/* Location */}
            <FormField label="Location" name="location">
              <input
                id="location"
                name="location"
                type="text"
                className="input-field"
                placeholder="New York, NY (optional)"
                value={formData.location}
                onChange={handleChange}
              />
            </FormField>

            {/* Password */}
            <FormField label="Password" name="password" required hint="Minimum 6 characters">
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  className="input-field pr-12"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
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

            {/* Confirm Password */}
            <FormField label="Confirm password" name="confirmPassword" required>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  className="input-field pr-12"
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
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

            {/* Terms */}
            <p className="text-text-tertiary text-sm">
              By creating an account, you agree to our{' '}
              <Link href="/terms" className="text-purple-700 hover:text-purple-600 underline underline-offset-2">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-purple-700 hover:text-purple-600 underline underline-offset-2">
                Privacy Policy
              </Link>
              .
            </p>

            {/* Submit Button */}
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
                  Creating account...
                </span>
              ) : (
                'Create account'
              )}
            </button>
          </form>

          {/* Sign in link */}
          <p className="mt-6 text-center text-text-secondary">
            Already have an account?{' '}
            <Link
              href="/auth/signin"
              className="text-link inline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
