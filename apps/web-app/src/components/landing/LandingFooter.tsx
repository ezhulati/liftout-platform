import Link from 'next/link';
import Image from 'next/image';

export function LandingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy-950" role="contentinfo">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="inline-flex items-center mb-6"
              aria-label="Liftout Home"
            >
              <Image
                src="/Liftout-logo-white.png"
                alt="Liftout"
                width={160}
                height={44}
                className="h-10 w-auto"
              />
            </Link>

            <p className="text-white/70 max-w-md leading-relaxed mb-6">
              The strategic alternative to individual hiring and costly acquisitions.
              Connect with proven teams ready for new challenges.
            </p>

            {/* Contact */}
            <a
              href="mailto:hello@liftout.io"
              className="text-white/70 hover:text-white text-sm transition-colors duration-200"
            >
              hello@liftout.io
            </a>
          </div>

          {/* Platform links */}
          <nav aria-label="Platform navigation">
            <h3 className="font-semibold text-white mb-4">
              Platform
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/for-companies"
                  className="text-white/70 hover:text-white transition-colors duration-200 text-sm"
                >
                  For companies
                </Link>
              </li>
              <li>
                <Link
                  href="/for-teams"
                  className="text-white/70 hover:text-white transition-colors duration-200 text-sm"
                >
                  For teams
                </Link>
              </li>
              <li>
                <Link
                  href="/#features"
                  className="text-white/70 hover:text-white transition-colors duration-200 text-sm"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/#faq"
                  className="text-white/70 hover:text-white transition-colors duration-200 text-sm"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </nav>

          {/* Support links */}
          <nav aria-label="Support navigation">
            <h3 className="font-semibold text-white mb-4">
              Support
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:support@liftout.io"
                  className="text-white/70 hover:text-white transition-colors duration-200 text-sm"
                >
                  Contact support
                </a>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-white/70 hover:text-white transition-colors duration-200 text-sm"
                >
                  Privacy policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-white/70 hover:text-white transition-colors duration-200 text-sm"
                >
                  Terms of service
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-white/50 text-sm">
            &copy; {currentYear} Liftout. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
