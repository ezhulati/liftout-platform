import { MessageCenter } from '@/components/messaging/MessageCenter';
import { Suspense } from 'react';

export default function MessagesPage() {
  return (
    <div className="h-screen">
      <Suspense fallback={<div className="animate-pulse h-screen bg-bg-elevated"></div>}>
        <MessageCenter />
      </Suspense>
    </div>
  );
}