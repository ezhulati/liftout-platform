import { CultureDashboard } from '@/components/culture/CultureDashboard';
import { Suspense } from 'react';

export default function CulturePage() {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <Suspense fallback={<div className="animate-pulse h-96 bg-gray-200 rounded-lg"></div>}>
        <CultureDashboard />
      </Suspense>
    </div>
  );
}