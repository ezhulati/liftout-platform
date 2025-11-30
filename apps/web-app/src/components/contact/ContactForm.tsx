'use client';

import { useState } from 'react';
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

type InquiryType = 'company' | 'team' | 'general' | 'press' | 'partnership';

interface FormData {
  name: string;
  email: string;
  company: string;
  inquiryType: InquiryType;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  inquiryType?: string;
  subject?: string;
  message?: string;
}

const inquiryTypes: { value: InquiryType; label: string }[] = [
  { value: 'company', label: 'Company looking to acquire teams' },
  { value: 'team', label: 'Team exploring opportunities' },
  { value: 'general', label: 'General inquiry' },
  { value: 'partnership', label: 'Partnership opportunity' },
  { value: 'press', label: 'Press & media' },
];

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    inquiryType: 'general',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Enter your full name';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Enter your email address';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Enter a subject';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Enter your message';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      // Focus first error field (#Validation - focus first error)
      const firstError = document.querySelector('[aria-invalid="true"]') as HTMLElement;
      firstError?.focus();
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Check if this is a demo submission (demo email in form)
      const isDemoSubmission = formData.email === 'demo@example.com' ||
                               formData.email === 'company@example.com';

      if (isDemoSubmission) {
        // Simulate API call for demo users
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log('[Demo] Contact form submission:', formData);
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          company: '',
          inquiryType: 'general',
          subject: '',
          message: '',
        });
        setErrors({});
        return;
      }

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          company: '',
          inquiryType: 'general',
          subject: '',
          message: '',
        });
        setErrors({});
      } else {
        setSubmitStatus('error');
      }
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success state - clear next steps (#Multi-step: confirm completion with next steps)
  if (submitStatus === 'success') {
    return (
      <div className="bg-bg-surface border border-border rounded-xl p-8">
        <div className="w-16 h-16 mb-6 rounded-full bg-success/10 flex items-center justify-center">
          <CheckCircleIcon className="w-8 h-8 text-success" />
        </div>
        <h3 className="font-semibold text-text-primary text-xl mb-2">
          Message sent
        </h3>
        <p className="text-text-secondary mb-6 leading-relaxed">
          Thanks for reaching out. Our team will get back to you within 24 hours.
          Check your inbox for a confirmation email.
        </p>
        <button
          onClick={() => setSubmitStatus('idle')}
          className="text-navy font-semibold hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-bg-surface border border-border rounded-xl p-6 lg:p-8"
      noValidate
    >
      {/* Required fields instruction (#Form: include instruction) */}
      <p className="text-text-tertiary text-sm mb-6">
        Required fields are marked with an asterisk *
      </p>

      {/* Error summary at top (#Validation: summary at top) */}
      {Object.keys(errors).length > 0 && (
        <div className="mb-6 p-4 rounded-xl bg-error/10 border border-error/20">
          <div className="flex items-start gap-3">
            <ExclamationCircleIcon className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-error text-sm mb-1">Please fix the following errors:</p>
              <ul className="text-error text-sm space-y-1">
                {Object.values(errors).map((error, i) => (
                  <li key={i}>• {error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Single column layout (#Form: single column) */}
      <div className="space-y-5">
        {/* Name - labels on TOP (#Form: labels on top) */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-text-primary mb-1.5"
          >
            Full name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
            className={`input-field w-full ${errors.name ? 'border-error focus:border-error focus:ring-error/20' : ''}`}
          />
          {errors.name && (
            <p id="name-error" className="mt-1.5 text-error text-sm flex items-center gap-1.5">
              <ExclamationCircleIcon className="w-4 h-4" />
              {errors.name}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-text-primary mb-1.5"
          >
            Email address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
            className={`input-field w-full ${errors.email ? 'border-error focus:border-error focus:ring-error/20' : ''}`}
          />
          {errors.email && (
            <p id="email-error" className="mt-1.5 text-error text-sm flex items-center gap-1.5">
              <ExclamationCircleIcon className="w-4 h-4" />
              {errors.email}
            </p>
          )}
        </div>

        {/* Company - marked optional (#Form: mark optional) */}
        <div>
          <label
            htmlFor="company"
            className="block text-sm font-medium text-text-primary mb-1.5"
          >
            Company or team name <span className="text-text-tertiary font-normal">(optional)</span>
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="input-field w-full"
          />
        </div>

        {/* Inquiry Type - 5 options = dropdown is appropriate (#Input selection: ≤10 = radio or dropdown) */}
        <div>
          <label
            htmlFor="inquiryType"
            className="block text-sm font-medium text-text-primary mb-1.5"
          >
            Inquiry type *
          </label>
          <select
            id="inquiryType"
            name="inquiryType"
            value={formData.inquiryType}
            onChange={handleChange}
            className="input-field w-full"
          >
            {inquiryTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Subject */}
        <div>
          <label
            htmlFor="subject"
            className="block text-sm font-medium text-text-primary mb-1.5"
          >
            Subject *
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            aria-invalid={!!errors.subject}
            aria-describedby={errors.subject ? 'subject-error' : undefined}
            className={`input-field w-full ${errors.subject ? 'border-error focus:border-error focus:ring-error/20' : ''}`}
          />
          {errors.subject && (
            <p id="subject-error" className="mt-1.5 text-error text-sm flex items-center gap-1.5">
              <ExclamationCircleIcon className="w-4 h-4" />
              {errors.subject}
            </p>
          )}
        </div>

        {/* Message */}
        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-text-primary mb-1.5"
          >
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            value={formData.message}
            onChange={handleChange}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? 'message-error' : undefined}
            className={`input-field w-full resize-none ${errors.message ? 'border-error focus:border-error focus:ring-error/20' : ''}`}
          />
          {errors.message && (
            <p id="message-error" className="mt-1.5 text-error text-sm flex items-center gap-1.5">
              <ExclamationCircleIcon className="w-4 h-4" />
              {errors.message}
            </p>
          )}
        </div>

        {/* Submit error */}
        {submitStatus === 'error' && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-error/10 border border-error/20">
            <ExclamationCircleIcon className="w-5 h-5 text-error flex-shrink-0" />
            <p className="text-error text-sm">
              Something went wrong. Please try again or email us directly at{' '}
              <a href="mailto:enrizhulati@gmail.com" className="underline">enrizhulati@gmail.com</a>
            </p>
          </div>
        )}

        {/* Submit button - left aligned, verb + noun label (#Button: left-align, verb+noun) */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary min-h-12 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Sending message...' : 'Send message'}
          </button>
        </div>

        <p className="text-text-tertiary text-sm">
          By submitting, you agree to our{' '}
          <Link href="/privacy" className="text-navy underline hover:no-underline">
            privacy policy
          </Link>
          .
        </p>
      </div>
    </form>
  );
}
