import Link from 'next/link';
import Image from 'next/image';
import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';

export function LandingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy-900" role="contentinfo">
      {/* Pre-sale support banner */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <p className="text-white font-semibold text-base mb-1">
                Questions before signing up?
              </p>
              <p className="text-white/70 text-sm">
                Our team is here to help you find the right solution.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="mailto:hello@liftout.io"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors duration-fast"
              >
                <EnvelopeIcon className="w-4 h-4" aria-hidden="true" />
                hello@liftout.io
              </a>
              <a
                href="tel:+1-888-LIFTOUT"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gold/20 hover:bg-gold/30 text-gold text-sm font-medium transition-colors duration-fast"
              >
                <PhoneIcon className="w-4 h-4" aria-hidden="true" />
                Schedule a call
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer content - 8-point grid padding */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

          {/* Brand column - spans 2 cols on large screens */}
          <div className="lg:col-span-2">
            {/* Logo */}
            <Link
              href="/"
              className="inline-flex items-center gap-4 mb-6 group"
              aria-label="Liftout Home"
            >
              <Image
                src="/logo-icon.png"
                alt="Liftout"
                width={48}
                height={48}
                className="w-12 h-12 brightness-0 invert transition-transform duration-fast group-hover:scale-[1.02]"
              />
              <span className="font-heading font-bold text-3xl text-white tracking-tight leading-none">Liftout</span>
            </Link>

            {/* Tagline */}
            <p className="font-body text-white/80 max-w-md leading-relaxed text-base mb-6">
              The strategic alternative to individual hiring and costly acquisitions. Connect with proven teams ready for new challenges.
            </p>

            {/* Quick action links for different user types */}
            <div className="flex flex-wrap gap-3 mb-8">
              <Link
                href="/for-companies"
                className="text-sm font-medium text-gold hover:text-gold-300 transition-colors duration-fast"
              >
                For Companies
              </Link>
              <span className="text-white/30">|</span>
              <Link
                href="/for-teams"
                className="text-sm font-medium text-gold hover:text-gold-300 transition-colors duration-fast"
              >
                For Teams
              </Link>
            </div>

            {/* Social links */}
            <div className="flex items-center gap-4">
              <a
                href="https://linkedin.com/company/liftout"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors duration-fast"
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
                className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors duration-fast"
                aria-label="Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Platform links */}
          <nav aria-label="Platform navigation">
            <h3 className="font-heading font-bold text-lg text-white mb-5 leading-tight">
              Platform
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/auth/signup"
                  className="font-body text-white/80 hover:text-gold transition-colors duration-fast text-base inline-block py-1"
                >
                  Create account
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/signin"
                  className="font-body text-white/80 hover:text-gold transition-colors duration-fast text-base inline-block py-1"
                >
                  Sign in
                </Link>
              </li>
              <li>
                <Link
                  href="/#features"
                  className="font-body text-white/80 hover:text-gold transition-colors duration-fast text-base inline-block py-1"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/#faq"
                  className="font-body text-white/80 hover:text-gold transition-colors duration-fast text-base inline-block py-1"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </nav>

          {/* Support links */}
          <nav aria-label="Support navigation">
            <h3 className="font-heading font-bold text-lg text-white mb-5 leading-tight">
              Support
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:support@liftout.io"
                  className="font-body text-white/80 hover:text-gold transition-colors duration-fast text-base inline-block py-1"
                >
                  Contact support
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@liftout.io"
                  className="font-body text-white/80 hover:text-gold transition-colors duration-fast text-base inline-block py-1"
                >
                  Sales inquiries
                </a>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="font-body text-white/80 hover:text-gold transition-colors duration-fast text-base inline-block py-1"
                >
                  Privacy policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="font-body text-white/80 hover:text-gold transition-colors duration-fast text-base inline-block py-1"
                >
                  Terms of service
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Bottom bar - copyright and badges */}
        <div className="mt-12 pt-8 border-t border-white/20">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-body text-white/60 text-sm">
              &copy; {currentYear} Liftout. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-white/50 text-sm">
                <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>SOC 2 Compliant</span>
              </div>
              <div className="flex items-center gap-2 text-white/50 text-sm">
                <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span>256-bit encryption</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
