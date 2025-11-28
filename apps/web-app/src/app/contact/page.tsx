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
  NewspaperIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contact Us - Liftout',
  description: 'Get in touch with the Liftout team. Whether you\'re a company looking to acquire teams or a team exploring opportunities, we\'re here to help.',
};

const contactOptions = [
  {
    title: 'For companies',
    description: 'Looking to acquire a high-performing team? Our enterprise team will help you find the perfect match.',
    email: 'companies@liftout.io',
    icon: BuildingOffice2Icon,
    responseTime: 'Same-day response',
  },
  {
    title: 'For teams',
    description: 'Ready to explore new opportunities together? We\'ll guide you through the liftout process.',
    email: 'teams@liftout.io',
    icon: UserGroupIcon,
    responseTime: 'Same-day response',
  },
  {
    title: 'General inquiries',
    description: 'Have questions about how Liftout works? Our support team is here to help.',
    email: 'hello@liftout.io',
    icon: QuestionMarkCircleIcon,
    responseTime: 'Within 24 hours',
  },
  {
    title: 'Press & media',
    description: 'For press inquiries, interview requests, or media-related questions.',
    email: 'press@liftout.io',
    icon: NewspaperIcon,
    responseTime: 'Within 48 hours',
  },
];

export default function ContactPage() {
  return (
    <>
      <LandingHeader />
      <main className="bg-bg">
        {/* Hero Section - Clear hierarchy with response time promise (#12, #43) */}
        <section className="pt-32 pb-16 lg:pt-40 lg:pb-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-navy font-semibold text-base mb-3">
                Get in touch
              </p>
              <h1 className="font-heading text-4xl sm:text-5xl font-bold text-text-primary tracking-tight leading-tight mb-6">
                We&apos;re here to help
              </h1>
              <p className="text-text-secondary text-lg leading-relaxed mb-8">
                Whether you&apos;re a company looking to acquire proven teams,
                a team exploring new opportunities, or just curious about how liftouts work
                — we&apos;d love to hear from you.
              </p>

              {/* Response time promise - builds trust (#12, #47) */}
              <div className="inline-flex items-center gap-3 px-4 py-3 bg-success/10 rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
                  <ChatBubbleLeftRightIcon className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="font-semibold text-text-primary text-sm">Fast response guaranteed</p>
                  <p className="text-success text-sm">Usually within 2 hours during business hours</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Options Grid - Reduce choices, clear hierarchy (#Hick's Law) */}
        <section className="pb-16 lg:pb-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {contactOptions.map((option) => (
                <a
                  key={option.title}
                  href={`mailto:${option.email}`}
                  className="group bg-bg-surface border border-border rounded-xl p-6 hover:border-navy/30 hover:shadow-sm transition-all duration-200"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-navy/10 flex items-center justify-center flex-shrink-0 group-hover:bg-navy transition-colors">
                      <option.icon className="w-6 h-6 text-navy group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-text-primary text-lg mb-1">
                        {option.title}
                      </h3>
                      <p className="text-text-secondary text-sm mb-3 leading-relaxed">
                        {option.description}
                      </p>
                      <div className="flex items-center justify-between gap-4">
                        <span className="inline-flex items-center gap-2 text-navy font-semibold text-sm group-hover:underline">
                          <EnvelopeIcon className="w-4 h-4" />
                          {option.email}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-text-tertiary text-xs">
                          <ClockIcon className="w-3.5 h-3.5" />
                          {option.responseTime}
                        </span>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="pb-16 lg:pb-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
              {/* Left - Contact Info with personality (#29, #35) */}
              <div>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-text-primary tracking-tight mb-4">
                  Send us a message
                </h2>
                <p className="text-text-secondary leading-relaxed mb-8">
                  Fill out the form and our team will get back to you within 24 hours.
                  For urgent matters, reach out directly via phone or email.
                </p>

                <div className="space-y-5">
                  {/* Email - larger touch targets (#Fitts's Law) */}
                  <a
                    href="mailto:hello@liftout.io"
                    className="flex items-center gap-4 p-4 bg-bg-surface rounded-xl border border-border hover:border-navy/20 hover:shadow-sm transition-all group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-navy/10 flex items-center justify-center flex-shrink-0 group-hover:bg-navy transition-colors">
                      <EnvelopeIcon className="w-5 h-5 text-navy group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <p className="font-semibold text-text-primary">Email us</p>
                      <p className="text-text-secondary text-sm">hello@liftout.io</p>
                    </div>
                  </a>

                  {/* Phone */}
                  <a
                    href="tel:+1-888-LIFTOUT"
                    className="flex items-center gap-4 p-4 bg-bg-surface rounded-xl border border-border hover:border-navy/20 hover:shadow-sm transition-all group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-navy/10 flex items-center justify-center flex-shrink-0 group-hover:bg-navy transition-colors">
                      <PhoneIcon className="w-5 h-5 text-navy group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <p className="font-semibold text-text-primary">Schedule a call</p>
                      <p className="text-text-secondary text-sm">+1 (888) LIFTOUT</p>
                      <p className="text-text-tertiary text-xs mt-0.5">Mon-Fri, 9am-6pm EST</p>
                    </div>
                  </a>

                  {/* Address - not clickable, just info */}
                  <div className="flex items-start gap-4 p-4 bg-bg-surface rounded-xl border border-border">
                    <div className="w-12 h-12 rounded-xl bg-navy/10 flex items-center justify-center flex-shrink-0">
                      <MapPinIcon className="w-5 h-5 text-navy" />
                    </div>
                    <div>
                      <p className="font-semibold text-text-primary">Office</p>
                      <p className="text-text-secondary text-sm">
                        123 Innovation Drive, Suite 400<br />
                        San Francisco, CA 94105
                      </p>
                    </div>
                  </div>
                </div>

                {/* Social Links - adequate spacing (#Fitts's Law) */}
                <div className="mt-8 pt-8 border-t border-border">
                  <p className="font-semibold text-text-primary mb-4">Follow us</p>
                  <div className="flex gap-3">
                    <a
                      href="https://linkedin.com/company/liftout"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-xl bg-bg-surface border border-border hover:border-navy/20 hover:bg-navy/5 flex items-center justify-center text-text-secondary hover:text-navy transition-all"
                      aria-label="Follow us on LinkedIn"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    </a>
                    <a
                      href="https://twitter.com/liftouthq"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-xl bg-bg-surface border border-border hover:border-navy/20 hover:bg-navy/5 flex items-center justify-center text-text-secondary hover:text-navy transition-all"
                      aria-label="Follow us on X (Twitter)"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    </a>
                  </div>
                </div>

                {/* Trust signal - social proof (#52) */}
                <div className="mt-8 p-5 bg-navy/5 rounded-xl">
                  <p className="text-text-secondary text-sm leading-relaxed">
                    <span className="font-semibold text-text-primary">150+ teams</span> and companies have connected through Liftout.
                    Our team has helped facilitate liftouts across 12 industries.
                  </p>
                </div>
              </div>

              {/* Right - Contact Form */}
              <div>
                <ContactForm />
              </div>
            </div>
          </div>
        </section>

        {/* FAQ CTA - Clear action (#04) */}
        <section className="pb-24 lg:pb-32">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="bg-bg-elevated rounded-2xl p-8 lg:p-12">
              <div className="max-w-2xl">
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-text-primary tracking-tight mb-4">
                  Looking for quick answers?
                </h2>
                <p className="text-text-secondary mb-6">
                  Check out our FAQ section for answers to common questions about
                  the liftout process, pricing, and platform features.
                </p>
                <Link
                  href="/#faq"
                  className="btn-primary inline-flex items-center justify-center gap-2"
                >
                  View frequently asked questions
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <LandingFooter />
    </>
  );
}
