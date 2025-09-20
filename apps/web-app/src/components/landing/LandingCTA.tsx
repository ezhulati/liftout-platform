import Link from 'next/link';

export function LandingCTA() {
  return (
    <div className="bg-primary-600">
      <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
          <span className="block">Ready to transform</span>
          <span className="block">your growth strategy?</span>
        </h2>
        <p className="mt-4 text-lg leading-6 text-primary-200">
          Whether you're a company seeking proven teams or a high-performing team exploring new opportunities, 
          Liftout connects you with the right strategic partnerships.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row sm:justify-center sm:space-x-4 space-y-4 sm:space-y-0">
          <Link
            href="/auth/signup"
            className="w-full sm:w-auto flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50 md:py-4 md:text-lg md:px-10"
          >
Join as a Team
          </Link>
          <Link
            href="/auth/signup"
            className="w-full sm:w-auto flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-500 hover:bg-primary-400 md:py-4 md:text-lg md:px-10"
          >
Acquire Proven Teams
          </Link>
        </div>
        <div className="mt-6">
          <p className="text-sm text-primary-200">
            Already have an account?{' '}
            <Link href="/auth/signin" className="text-white font-medium underline">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}