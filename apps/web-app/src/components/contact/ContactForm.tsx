'use client';

import { useState } from 'react';
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

type InquiryType = 'company' | 'team' | 'general' | 'press' | 'partnership';

interface FormData {
  name: string;
  email: string;
  company: string;
  inquiryType: InquiryType;
  subject: string;
  message: string;
}

const inquiryTypes: { value: InquiryType; label: string }[] = [
  { value: 'company', label: 'Company looking to acquire teams' },
  { value: 'team', label: 'Team exploring opportunities' },
  { value: 'general', label: 'General inquiry' },
  { value: 'partnership', label: 'Partnership opportunity' },
  { value: 'press', label: 'Press & Media' },
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    // Simulate form submission - replace with actual API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        company: '',
        inquiryType: 'general',
        subject: '',
        message: '',
      });
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === 'success') {
    return (
      <div className="bg-bg-surface border border-border rounded-xl p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success/10 flex items-center justify-center">
          <CheckCircleIcon className="w-8 h-8 text-success" />
        </div>
        <h3 className="font-semibold text-text-primary text-lg mb-2">
          Message sent!
        </h3>
        <p className="text-text-secondary mb-6">
          Thanks for reaching out. Our team will get back to you within 24 hours.
        </p>
        <button
          onClick={() => setSubmitStatus('idle')}
          className="btn-outline"
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
    >
      <div className="space-y-5">
        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-text-primary mb-1.5"
          >
            Full name <span className="text-error">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="input-field w-full"
            placeholder="John Smith"
          />
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-text-primary mb-1.5"
          >
            Email address <span className="text-error">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="input-field w-full"
            placeholder="john@company.com"
          />
        </div>

        {/* Company */}
        <div>
          <label
            htmlFor="company"
            className="block text-sm font-medium text-text-primary mb-1.5"
          >
            Company / Team name
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="input-field w-full"
            placeholder="Acme Inc."
          />
        </div>

        {/* Inquiry Type */}
        <div>
          <label
            htmlFor="inquiryType"
            className="block text-sm font-medium text-text-primary mb-1.5"
          >
            I am a... <span className="text-error">*</span>
          </label>
          <select
            id="inquiryType"
            name="inquiryType"
            required
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
            Subject <span className="text-error">*</span>
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            required
            value={formData.subject}
            onChange={handleChange}
            className="input-field w-full"
            placeholder="How can we help?"
          />
        </div>

        {/* Message */}
        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-text-primary mb-1.5"
          >
            Message <span className="text-error">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            value={formData.message}
            onChange={handleChange}
            className="input-field w-full resize-none"
            placeholder="Tell us more about your inquiry..."
          />
        </div>

        {/* Error message */}
        {submitStatus === 'error' && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-error/10 text-error text-sm">
            <ExclamationCircleIcon className="w-5 h-5 flex-shrink-0" />
            <p>Something went wrong. Please try again or email us directly.</p>
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Sending...' : 'Send message'}
        </button>

        <p className="text-text-tertiary text-xs text-center">
          By submitting this form, you agree to our{' '}
          <a href="/privacy" className="text-navy hover:underline">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </form>
  );
}
