import Link from 'next/link';
import Image from 'next/image';

export function LandingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="dark-section-deep" role="contentinfo">
      {/* Pre-sale support banner - Practical UI: 18px text, clear hierarchy */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <p className="text-white font-semibold text-xl mb-2">
                Questions before signing up?
              </p>
              <p className="text-white/70 text-lg">
                Our team responds within 24 hours.
              </p>
            </div>
            {/* Practical UI: Primary first, tertiary second */}
            <div className="flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="btn-primary-on-dark gap-2 px-6 py-3 text-lg"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Schedule a call
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-4 py-3 text-lg text-white/80 underline underline-offset-4 hover:text-white transition-colors duration-200 min-h-12"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Send a message
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

          {/* Brand column with personality (#29, #35, #100) */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="inline-flex items-center mb-6 group"
              aria-label="Liftout Home"
            >
              {/* Premium badge - dark variant with glass effect */}
              <div className="relative bg-gradient-to-b from-white/[0.08] to-white/[0.03] rounded-xl px-5 py-3 border border-white/10 group-hover:border-white/20 transition-all duration-300">
                {/* Inner glow effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/[0.05] via-transparent to-transparent" />
                {/* Subtle bottom highlight */}
                <div className="absolute inset-x-3 -bottom-px h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <img
                  src="/liftout.svg"
                  alt="Liftout"
                  className="h-16 w-auto relative brightness-0 invert"
                />
              </div>
            </Link>

            {/* Practical UI: 18px body text */}
            <p className="text-white/70 text-lg max-w-md leading-relaxed mb-6">
              The strategic alternative to individual hiring and costly acquisitions.
              Connect with proven teams ready for new challenges.
            </p>

            {/* Social links - Practical UI: 48pt touch targets */}
            <div className="flex gap-3">
              <a
                href="https://linkedin.com/company/liftout"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-all duration-200 hover:-translate-y-0.5"
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
                className="w-12 h-12 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-all duration-200 hover:-translate-y-0.5"
                aria-label="Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Platform links - Practical UI: 18px text, 48px touch targets */}
          <nav aria-label="Platform navigation">
            <h3 className="font-semibold text-white text-lg mb-5">
              Platform
            </h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/for-companies"
                  className="text-white/70 hover:text-white transition-colors duration-200 text-lg inline-block py-1"
                >
                  For companies
                </Link>
              </li>
              <li>
                <Link
                  href="/for-teams"
                  className="text-white/70 hover:text-white transition-colors duration-200 text-lg inline-block py-1"
                >
                  For teams
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-white/70 hover:text-white transition-colors duration-200 text-lg inline-block py-1"
                >
                  Insights
                </Link>
              </li>
              <li>
                <Link
                  href="/#features"
                  className="text-white/70 hover:text-white transition-colors duration-200 text-lg inline-block py-1"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/#faq"
                  className="text-white/70 hover:text-white transition-colors duration-200 text-lg inline-block py-1"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </nav>

          {/* Support links - Practical UI: 18px text, 48px touch targets */}
          <nav aria-label="Support navigation">
            <h3 className="font-semibold text-white text-lg mb-5">
              Support
            </h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/contact"
                  className="text-white/70 hover:text-white transition-colors duration-200 text-lg inline-block py-1"
                >
                  Contact us
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-white/70 hover:text-white transition-colors duration-200 text-lg inline-block py-1"
                >
                  Privacy policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-white/70 hover:text-white transition-colors duration-200 text-lg inline-block py-1"
                >
                  Terms of service
                </Link>
              </li>
            </ul>

            {/* Trust badges */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-white/50 text-sm uppercase tracking-wider mb-3">Trusted by</p>
              <div className="flex items-center gap-2 text-white/60 text-base">
                <span>150+ teams</span>
                <span className="text-white/30">|</span>
                <span>12 industries</span>
              </div>
            </div>
          </nav>
        </div>

        {/* Bottom bar - Practical UI: 16px minimum for small text */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <p className="text-white/50 text-base">
              &copy; {currentYear} Liftout. All rights reserved.
            </p>
            <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 bg-white/5 rounded text-white/50 text-sm">
              Founded 2024
            </span>
          </div>
          <div className="flex items-center gap-6 text-white/50 text-base">
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              256-bit encryption
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              SOC 2 Compliant
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
