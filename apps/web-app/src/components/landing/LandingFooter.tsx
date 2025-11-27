import Link from 'next/link';

export function LandingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy-900" role="contentinfo">
      {/* Main footer content - 8-point grid padding */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

          {/* Brand column - spans 2 cols on large screens */}
          <div className="lg:col-span-2">
            {/* Logo */}
            <Link
              href="/"
              className="inline-flex items-center gap-3 mb-6 min-h-[44px] group"
              aria-label="Liftout Home"
            >
              {/* Logo mark - 40px = 5 * 8px grid */}
              <div className="w-10 h-10 rounded-lg bg-gold flex items-center justify-center shadow-gold transition-all duration-fast group-hover:shadow-lg">
                <span className="text-navy-900 font-heading font-bold text-xl leading-none">L</span>
              </div>
              {/* Wordmark */}
              <span className="font-heading font-bold text-2xl text-white tracking-tight leading-none">
                Liftout
              </span>
            </Link>

            {/* Tagline */}
            <p className="font-body text-navy-200 max-w-md leading-relaxed text-base mb-6">
              The premier platform for strategic team acquisition. Connect companies with proven,
              intact teams ready for new opportunities.
            </p>

            {/* Quick action links for different user types */}
            <div className="flex flex-wrap gap-3">
              <Link
                href="/for-companies"
                className="text-sm font-medium text-gold hover:text-gold-300 transition-colors duration-fast"
              >
                For Companies
              </Link>
              <span className="text-navy-600">|</span>
              <Link
                href="/for-teams"
                className="text-sm font-medium text-gold hover:text-gold-300 transition-colors duration-fast"
              >
                For Teams
              </Link>
            </div>
          </div>

          {/* Platform links */}
          <nav aria-label="Platform navigation">
            <h3 className="font-heading font-bold text-lg text-white mb-5 leading-tight">
              Platform
            </h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/auth/signup"
                  className="font-body text-navy-200 hover:text-gold transition-colors duration-fast text-base inline-block min-h-[44px] py-1"
                >
                  Get Started
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/signin"
                  className="font-body text-navy-200 hover:text-gold transition-colors duration-fast text-base inline-block min-h-[44px] py-1"
                >
                  Sign In
                </Link>
              </li>
              <li>
                <Link
                  href="#features"
                  className="font-body text-navy-200 hover:text-gold transition-colors duration-fast text-base inline-block min-h-[44px] py-1"
                >
                  Features
                </Link>
              </li>
            </ul>
          </nav>

          {/* Support links */}
          <nav aria-label="Support navigation">
            <h3 className="font-heading font-bold text-lg text-white mb-5 leading-tight">
              Support
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="mailto:support@liftout.io"
                  className="font-body text-navy-200 hover:text-gold transition-colors duration-fast text-base inline-block min-h-[44px] py-1"
                >
                  support@liftout.io
                </a>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="font-body text-navy-200 hover:text-gold transition-colors duration-fast text-base inline-block min-h-[44px] py-1"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="font-body text-navy-200 hover:text-gold transition-colors duration-fast text-base inline-block min-h-[44px] py-1"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Bottom bar - copyright and social */}
        <div className="mt-12 pt-8 border-t border-navy-700">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-body text-navy-400 text-sm">
              &copy; {currentYear} Liftout. All rights reserved.
            </p>
            <p className="font-body text-navy-500 text-sm">
              Strategic Team Acquisition Platform
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
