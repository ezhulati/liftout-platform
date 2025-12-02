import { MessageCenter } from '@/components/messaging/MessageCenter';
import { Suspense } from 'react';

// Force dynamic rendering to prevent static prerender issues
export const dynamic = 'force-dynamic';

export default function MessagesPage() {
  return (
    // Use negative margins to break out of parent padding and fill available height
    // Height calculation: 100vh - header height (64px on mobile, 80px on desktop)
    <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-6 -mb-6 h-[calc(100vh-64px)] lg:h-[calc(100vh-80px)]">
      <Suspense fallback={
        <div className="h-full flex items-center justify-center bg-bg-surface">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-navy border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-text-secondary">Loading messages...</p>
          </div>
        </div>
      }>
        <MessageCenter />
      </Suspense>
    </div>
  );
}
