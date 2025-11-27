'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { EyeIcon, EyeSlashIcon, UserGroupIcon, BuildingOffice2Icon } from '@heroicons/react/24/outline';
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
  const { signUp, signInWithGoogle } = useAuth();

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

      toast.success('Account created successfully!');
      router.push('/app/onboarding');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Sign up failed';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      toast.success('Account created with Google successfully');
      router.push('/app/onboarding');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Google sign up failed';
      toast.error(errorMessage);
      setIsLoading(false);
    }
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
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-lg bg-gold flex items-center justify-center shadow-gold transition-all duration-fast group-hover:shadow-lg">
              <span className="text-navy-900 font-heading font-bold text-xl">L</span>
            </div>
            <span className="font-heading font-bold text-2xl tracking-tight">Liftout</span>
          </Link>

          {/* Content */}
          <div>
            <h1 className="font-heading text-4xl font-bold mb-4 leading-tight">
              Join the Future of
              <span className="block text-gold">Team Acquisition</span>
            </h1>
            <p className="text-navy-200 text-lg leading-relaxed max-w-md mb-8">
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
                  <div className="w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-gold" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-navy-200">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Social proof */}
          <div>
            <p className="text-navy-400 text-sm">
              Trusted by teams and companies across Finance, Healthcare, and Technology
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link href="/" className="lg:hidden flex items-center gap-2 mb-8 group">
            <div className="w-10 h-10 rounded-lg bg-navy flex items-center justify-center shadow-navy transition-all duration-fast group-hover:shadow-lg">
              <span className="text-gold font-heading font-bold text-xl">L</span>
            </div>
            <span className="font-heading font-bold text-2xl text-navy tracking-tight">Liftout</span>
          </Link>

          <div className="mb-8">
            <h2 className="font-heading text-3xl font-bold text-text-primary mb-2">
              Create your account
            </h2>
            <p className="text-text-secondary">
              Start connecting teams with opportunities today
            </p>
          </div>

          {/* Google Sign Up */}
          <button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-bg-surface border border-border rounded-lg font-medium text-text-primary hover:bg-bg-elevated hover:border-border-hover transition-all duration-fast touch-target disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

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
            {/* User Type Selection */}
            <div>
              <label className="label-text mb-3">Account Type</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, userType: 'individual' }))}
                  className={`rounded-xl border-2 p-4 text-center transition-all duration-fast ${
                    formData.userType === 'individual'
                      ? 'border-navy bg-navy-50'
                      : 'border-border hover:border-border-hover'
                  }`}
                >
                  <UserGroupIcon className={`w-8 h-8 mx-auto mb-2 ${
                    formData.userType === 'individual' ? 'text-navy' : 'text-navy-400'
                  }`} />
                  <div className="font-semibold text-text-primary text-sm">Individual / Team</div>
                  <div className="text-text-tertiary text-xs mt-1">Looking for opportunities</div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, userType: 'company' }))}
                  className={`rounded-xl border-2 p-4 text-center transition-all duration-fast ${
                    formData.userType === 'company'
                      ? 'border-gold bg-gold-50'
                      : 'border-border hover:border-border-hover'
                  }`}
                >
                  <BuildingOffice2Icon className={`w-8 h-8 mx-auto mb-2 ${
                    formData.userType === 'company' ? 'text-gold-600' : 'text-gold-400'
                  }`} />
                  <div className="font-semibold text-text-primary text-sm">Company</div>
                  <div className="text-text-tertiary text-xs mt-1">Hiring teams</div>
                </button>
              </div>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="firstName" className="label-text">First Name</label>
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
              </div>
              <div>
                <label htmlFor="lastName" className="label-text">Last Name</label>
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
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="label-text">Email address</label>
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
            </div>

            {/* Company Name (if company type) */}
            {formData.userType === 'company' && (
              <div>
                <label htmlFor="companyName" className="label-text">Company Name</label>
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
              </div>
            )}

            {/* Industry */}
            <div>
              <label htmlFor="industry" className="label-text">Industry</label>
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
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="label-text">Location</label>
              <input
                id="location"
                name="location"
                type="text"
                className="input-field"
                placeholder="New York, NY (optional)"
                value={formData.location}
                onChange={handleChange}
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="label-text">Password</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  className="input-field pr-12"
                  placeholder="Min 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-text-tertiary hover:text-text-secondary transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="label-text">Confirm Password</label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  className="input-field pr-12"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-text-tertiary hover:text-text-secondary transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Terms */}
            <p className="text-text-tertiary text-xs">
              By creating an account, you agree to our{' '}
              <Link href="/terms" className="text-gold hover:text-gold-dark underline underline-offset-2">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-gold hover:text-gold-dark underline underline-offset-2">
                Privacy Policy
              </Link>
              .
            </p>

            {/* Submit Button */}
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
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Sign in link */}
          <p className="mt-6 text-center text-text-secondary">
            Already have an account?{' '}
            <Link
              href="/auth/signin"
              className="font-medium text-gold hover:text-gold-dark transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
