import { Metadata } from 'next';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { ContactForm } from '@/components/contact/ContactForm';
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  BuildingOffice2Icon,
  UserGroupIcon,
  QuestionMarkCircleIcon,
  NewspaperIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contact Us - Liftout',
  description: 'Get in touch with the Liftout team. Whether you\'re a company looking to acquire teams or a team exploring opportunities, we\'re here to help.',
};

const contactOptions = [
  {
    title: 'For Companies',
    description: 'Looking to acquire a high-performing team? Our enterprise team will help you find the perfect match.',
    email: 'companies@liftout.io',
    icon: BuildingOffice2Icon,
    cta: 'Talk to our enterprise team',
  },
  {
    title: 'For Teams',
    description: 'Ready to explore new opportunities together? We\'ll guide you through the liftout process.',
    email: 'teams@liftout.io',
    icon: UserGroupIcon,
    cta: 'Connect with our team advisors',
  },
  {
    title: 'General Inquiries',
    description: 'Have questions about how Liftout works? Our support team is here to help.',
    email: 'hello@liftout.io',
    icon: QuestionMarkCircleIcon,
    cta: 'Send us a message',
  },
  {
    title: 'Press & Media',
    description: 'For press inquiries, interview requests, or media-related questions.',
    email: 'press@liftout.io',
    icon: NewspaperIcon,
    cta: 'Contact our PR team',
  },
];

export default function ContactPage() {
  return (
    <>
      <LandingHeader />
      <main className="bg-bg">
        {/* Hero Section */}
        <section className="pt-32 pb-16 lg:pt-40 lg:pb-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-navy font-semibold text-base mb-3">
                Get in touch
              </p>
              <h1 className="font-heading text-4xl sm:text-5xl font-bold text-text-primary tracking-tight leading-tight mb-6">
                We&apos;re here to help
              </h1>
              <p className="text-text-secondary text-lg leading-relaxed">
                Whether you&apos;re a company looking to acquire proven teams,
                a team exploring new opportunities, or just curious about how liftouts work
                — we&apos;d love to hear from you.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Options Grid */}
        <section className="pb-16 lg:pb-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {contactOptions.map((option) => (
                <div
                  key={option.title}
                  className="bg-bg-surface border border-border rounded-xl p-6 hover:border-navy/30 transition-colors duration-200"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-navy/10 flex items-center justify-center flex-shrink-0">
                      <option.icon className="w-6 h-6 text-navy" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-text-primary text-lg mb-2">
                        {option.title}
                      </h3>
                      <p className="text-text-secondary text-sm mb-4 leading-relaxed">
                        {option.description}
                      </p>
                      <a
                        href={`mailto:${option.email}`}
                        className="inline-flex items-center gap-2 text-navy font-semibold text-sm hover:underline"
                      >
                        <EnvelopeIcon className="w-4 h-4" />
                        {option.email}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="pb-16 lg:pb-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
              {/* Left - Contact Info */}
              <div>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-text-primary tracking-tight mb-6">
                  Send us a message
                </h2>
                <p className="text-text-secondary leading-relaxed mb-8">
                  Fill out the form and our team will get back to you within 24 hours.
                  For urgent matters, please reach out directly via phone or email.
                </p>

                <div className="space-y-6">
                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-navy/10 flex items-center justify-center flex-shrink-0">
                      <EnvelopeIcon className="w-5 h-5 text-navy" />
                    </div>
                    <div>
                      <p className="font-semibold text-text-primary mb-1">Email</p>
                      <a
                        href="mailto:hello@liftout.io"
                        className="text-text-secondary hover:text-navy transition-colors"
                      >
                        hello@liftout.io
                      </a>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-navy/10 flex items-center justify-center flex-shrink-0">
                      <PhoneIcon className="w-5 h-5 text-navy" />
                    </div>
                    <div>
                      <p className="font-semibold text-text-primary mb-1">Phone</p>
                      <a
                        href="tel:+1-888-LIFTOUT"
                        className="text-text-secondary hover:text-navy transition-colors"
                      >
                        +1 (888) LIFTOUT
                      </a>
                      <p className="text-text-tertiary text-sm mt-1">
                        Mon-Fri, 9am-6pm EST
                      </p>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-navy/10 flex items-center justify-center flex-shrink-0">
                      <MapPinIcon className="w-5 h-5 text-navy" />
                    </div>
                    <div>
                      <p className="font-semibold text-text-primary mb-1">Office</p>
                      <p className="text-text-secondary">
                        123 Innovation Drive<br />
                        Suite 400<br />
                        San Francisco, CA 94105
                      </p>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="mt-8 pt-8 border-t border-border">
                  <p className="font-semibold text-text-primary mb-4">Follow us</p>
                  <div className="flex gap-4">
                    <a
                      href="https://linkedin.com/company/liftout"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-lg bg-bg-elevated hover:bg-navy/10 flex items-center justify-center text-text-secondary hover:text-navy transition-colors duration-200"
                      aria-label="LinkedIn"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    </a>
                    <a
                      href="https://twitter.com/liftouthq"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-lg bg-bg-elevated hover:bg-navy/10 flex items-center justify-center text-text-secondary hover:text-navy transition-colors duration-200"
                      aria-label="Twitter"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              {/* Right - Contact Form */}
              <div>
                <ContactForm />
              </div>
            </div>
          </div>
        </section>

        {/* FAQ CTA */}
        <section className="pb-24 lg:pb-32">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="bg-bg-elevated rounded-2xl p-8 lg:p-12 text-center">
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-text-primary tracking-tight mb-4">
                Looking for quick answers?
              </h2>
              <p className="text-text-secondary mb-6 max-w-2xl mx-auto">
                Check out our FAQ section for answers to common questions about
                the liftout process, pricing, and platform features.
              </p>
              <Link
                href="/#faq"
                className="btn-primary inline-flex items-center justify-center gap-2"
              >
                View FAQ
              </Link>
            </div>
          </div>
        </section>
      </main>
      <LandingFooter />
    </>
  );
}
