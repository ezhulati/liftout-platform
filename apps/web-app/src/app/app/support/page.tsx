'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  QuestionMarkCircleIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

const faqs = [
  {
    question: 'How do I create a team profile?',
    answer: 'Navigate to "My Team" in the sidebar and click "Create Team". Fill in your team details, add members, and showcase your collective experience.',
  },
  {
    question: 'How does the matching process work?',
    answer: 'Our platform uses intelligent matching to connect teams with companies based on skills, industry experience, location preferences, and cultural fit.',
  },
  {
    question: 'Is my profile confidential?',
    answer: 'Yes, you control your profile visibility. You can set it to Open, Selective, or Confidential. Your current employer will never be notified.',
  },
  {
    question: 'How do companies post opportunities?',
    answer: 'Company users can post liftout opportunities from their dashboard. Each opportunity includes team requirements, compensation details, and integration plans.',
  },
  {
    question: 'What happens after expressing interest?',
    answer: 'Once you express interest in an opportunity, the company receives a notification and can review your team profile. If interested, they\'ll initiate a conversation.',
  },
  {
    question: 'How do I invite team members?',
    answer: 'From your team profile, go to the Members section and send email invitations. Team members will receive a link to join your team.',
  },
];

export default function SupportPage() {
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  if (status === 'loading') {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-bg-elevated rounded w-48 mb-2"></div>
          <div className="h-4 bg-bg-elevated rounded w-72 mb-8"></div>
          <div className="h-96 bg-bg-elevated rounded"></div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <QuestionMarkCircleIcon className="h-12 w-12 text-text-tertiary mx-auto mb-4" />
          <h2 className="text-lg font-bold text-text-primary mb-2">Sign in required</h2>
          <p className="text-text-secondary">Please sign in to access support.</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ subject: '', message: '' });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Support</h1>
        <p className="page-subtitle">Get help with your account.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Options */}
        <div className="lg:col-span-2 space-y-8">
          {/* Contact Form */}
          <div className="bg-bg-surface rounded-lg border border-border p-6">
            <div className="flex items-center gap-3 mb-6">
              <EnvelopeIcon className="h-6 w-6 text-purple-500" />
              <h2 className="text-lg font-bold text-text-primary">Contact Us</h2>
            </div>

            {isSubmitted ? (
              <div className="text-center py-8">
                <CheckCircleIcon className="h-12 w-12 text-success mx-auto mb-4" />
                <h3 className="text-lg font-bold text-text-primary mb-2">Message Sent!</h3>
                <p className="text-text-secondary mb-4">
                  We&apos;ll get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-purple-500 hover:text-purple-600 font-medium"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-text-primary mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                    className="w-full px-4 py-3 min-h-12 rounded-lg border border-border bg-bg-surface text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="What can we help you with?"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-text-primary mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-bg-surface text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    placeholder="Describe your question or issue in detail..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-3 px-4 rounded-lg min-h-12 transition-colors duration-fast disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>

          {/* FAQs */}
          <div className="bg-bg-surface rounded-lg border border-border p-6">
            <div className="flex items-center gap-3 mb-6">
              <QuestionMarkCircleIcon className="h-6 w-6 text-purple-500" />
              <h2 className="text-lg font-bold text-text-primary">Frequently Asked Questions</h2>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full px-4 py-3 min-h-12 flex items-center justify-between text-left hover:bg-bg-elevated transition-colors"
                  >
                    <span className="font-medium text-text-primary">{faq.question}</span>
                    <span className={`text-text-tertiary transition-transform ${expandedFaq === index ? 'rotate-180' : ''}`}>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </button>
                  {expandedFaq === index && (
                    <div className="px-4 pb-4 text-text-secondary">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Links Sidebar */}
        <div className="space-y-6">
          {/* Chat Support */}
          <div className="bg-bg-surface rounded-lg border border-border p-6">
            <div className="flex items-center gap-3 mb-4">
              <ChatBubbleLeftRightIcon className="h-6 w-6 text-purple-500" />
              <h3 className="font-bold text-text-primary">Live Chat</h3>
            </div>
            <p className="text-sm text-text-secondary mb-4">
              Chat with our support team for quick answers.
            </p>
            <button className="w-full bg-bg-elevated hover:bg-navy-50 text-text-primary font-medium py-3 px-4 rounded-lg min-h-12 transition-colors border border-border">
              Start Chat
            </button>
          </div>

          {/* Documentation */}
          <div className="bg-bg-surface rounded-lg border border-border p-6">
            <div className="flex items-center gap-3 mb-4">
              <DocumentTextIcon className="h-6 w-6 text-purple-500" />
              <h3 className="font-bold text-text-primary">Documentation</h3>
            </div>
            <p className="text-sm text-text-secondary mb-4">
              Browse our guides and tutorials.
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/app/onboarding" className="text-purple-500 hover:text-purple-600">Getting Started Guide</Link>
              </li>
              <li>
                <Link href="/app/teams/create" className="text-purple-500 hover:text-purple-600">Team Profile Best Practices</Link>
              </li>
              <li>
                <Link href="/app/opportunities/create" className="text-purple-500 hover:text-purple-600">Company User Guide</Link>
              </li>
              <li>
                <Link href="/privacy" className="text-purple-500 hover:text-purple-600">Privacy & Security</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="bg-purple-50 rounded-lg p-6">
            <h3 className="font-bold text-text-primary mb-3">Need More Help?</h3>
            <p className="text-sm text-text-secondary mb-4">
              Our team is here to help you succeed.
            </p>
            <div className="space-y-2 text-sm">
              <p className="text-text-secondary">
                <span className="font-medium text-text-primary">Email:</span> support@liftout.com
              </p>
              <p className="text-text-secondary">
                <span className="font-medium text-text-primary">Hours:</span> Mon-Fri, 9am-6pm EST
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
