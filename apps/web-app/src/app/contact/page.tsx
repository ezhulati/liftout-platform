import { Metadata } from 'next';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { ContactForm } from '@/components/contact/ContactForm';
import { ContactOptions } from '@/components/contact/ContactOptions';
import {
  MapPinIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contact Us - Liftout',
  description: 'Get in touch with the Liftout team. Whether you\'re a company looking to acquire teams or a team exploring opportunities, we\'re here to help.',
};

export default function ContactPage() {
  return (
    <>
      <LandingHeader />
      <main id="main-content" tabIndex={-1} className="bg-bg outline-none">
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
                  <p className="text-success text-sm">Usually within 24 hours</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Options Grid - Links to form section */}
        <ContactOptions />

        {/* Contact Form Section */}
        <section id="contact-form" className="pb-16 lg:pb-20 scroll-mt-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
              {/* Left - Contact Info with personality (#29, #35) */}
              <div>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-text-primary tracking-tight mb-4">
                  Send us a message
                </h2>
                <p className="text-text-secondary leading-relaxed mb-8">
                  Fill out the form and our team will get back to you within 24 hours.
                </p>

                <div className="space-y-5">
                  {/* Email - display only, not mailto */}
                  <div className="flex items-center gap-4 p-4 bg-bg-surface rounded-xl border border-border">
                    <div className="w-12 h-12 rounded-xl bg-navy/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-text-primary">Email</p>
                      <p className="text-text-secondary text-sm">hello@liftout.io</p>
                    </div>
                  </div>

                  {/* Phone - display only */}
                  <div className="flex items-center gap-4 p-4 bg-bg-surface rounded-xl border border-border">
                    <div className="w-12 h-12 rounded-xl bg-navy/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-text-primary">Phone</p>
                      <p className="text-text-secondary text-sm">+1 (888) LIFTOUT</p>
                      <p className="text-text-tertiary text-xs mt-0.5">Mon-Fri, 9am-6pm EST</p>
                    </div>
                  </div>

                  {/* Address */}
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

                {/* Social Links */}
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

                {/* Trust signal - HBR insight */}
                <div className="mt-8 p-5 bg-navy/5 rounded-xl">
                  <p className="text-text-secondary text-sm leading-relaxed">
                    Liftouts are common practice in <span className="font-semibold text-text-primary">law, investment banking, consulting, and technology</span>—industries where team chemistry drives results.
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
                  className="btn-primary min-h-12 inline-flex items-center justify-center gap-2"
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
