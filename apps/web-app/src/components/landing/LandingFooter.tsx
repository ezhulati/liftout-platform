import Link from 'next/link';
import Image from 'next/image';

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
              Hire proven teams, not individuals. 500+ verified teams. 200+ companies. Zero team-building phase.
            </p>

            {/* Quick action links for different user types */}
            <div className="flex flex-wrap gap-3">
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
                  className="font-body text-white/80 hover:text-gold transition-colors duration-fast text-base inline-block min-h-[44px] py-1"
                >
                  Create account
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/signin"
                  className="font-body text-white/80 hover:text-gold transition-colors duration-fast text-base inline-block min-h-[44px] py-1"
                >
                  Sign in
                </Link>
              </li>
              <li>
                <Link
                  href="#features"
                  className="font-body text-white/80 hover:text-gold transition-colors duration-fast text-base inline-block min-h-[44px] py-1"
                >
                  View features
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
                  className="font-body text-white/80 hover:text-gold transition-colors duration-fast text-base inline-block min-h-[44px] py-1"
                >
                  Contact support
                </a>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="font-body text-white/80 hover:text-gold transition-colors duration-fast text-base inline-block min-h-[44px] py-1"
                >
                  Privacy policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="font-body text-white/80 hover:text-gold transition-colors duration-fast text-base inline-block min-h-[44px] py-1"
                >
                  Terms of service
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Bottom bar - copyright and social */}
        <div className="mt-12 pt-8 border-t border-white/20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="font-body text-white/60 text-sm">
              &copy; {currentYear} Liftout. All rights reserved.
            </p>
            <p className="font-body text-white/50 text-sm">
              Strategic Team Acquisition Platform
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
