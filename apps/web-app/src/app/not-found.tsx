import Link from 'next/link';
import { HomeIcon } from '@heroicons/react/24/outline';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg-surface flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-bold text-navy mb-4">404</div>
        <h1 className="text-2xl font-bold text-text-primary mb-4">
          Page Not Found
        </h1>
        <p className="text-text-secondary mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/" className="btn-primary min-h-12 inline-flex items-center gap-2">
          <HomeIcon className="w-5 h-5" />
          Go home
        </Link>
      </div>
    </div>
  );
}
