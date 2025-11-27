import Link from 'next/link';

export function LandingFooter() {
  return (
    <footer className="bg-navy-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gold flex items-center justify-center">
                <span className="text-navy-900 font-heading font-bold text-xl">L</span>
              </div>
              <span className="font-heading font-bold text-2xl text-white tracking-tight">
                Liftout
              </span>
            </Link>
            <p className="text-navy-200 max-w-md leading-relaxed">
              The premier platform for strategic team acquisition. Connect companies with proven,
              intact teams ready for new opportunities.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-bold text-lg text-white mb-4">Platform</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/auth/signup" className="text-navy-200 hover:text-gold transition-colors duration-fast">
                  Get Started
                </Link>
              </li>
              <li>
                <Link href="/auth/signin" className="text-navy-200 hover:text-gold transition-colors duration-fast">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading font-bold text-lg text-white mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <a href="mailto:support@liftout.io" className="text-navy-200 hover:text-gold transition-colors duration-fast">
                  support@liftout.io
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-navy-700">
          <p className="text-navy-300 text-sm text-center">
            &copy; {new Date().getFullYear()} Liftout. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
