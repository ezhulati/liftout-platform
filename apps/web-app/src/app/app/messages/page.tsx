import { MessageCenter } from '@/components/messaging/MessageCenter';
import { Suspense } from 'react';

export default function MessagesPage() {
  return (
    <div className="h-screen">
      <Suspense fallback={<div className="animate-pulse h-screen bg-gray-200"></div>}>
        <MessageCenter />
      </Suspense>
    </div>
  );
}