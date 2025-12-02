'use client';

import { RealtimeMessageCenter } from './RealtimeMessageCenter';
import {
  ChatBubbleLeftRightIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  PaperClipIcon,
  EllipsisVerticalIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

interface MessageCenterProps {
  userId?: string;
}

export function MessageCenter({ userId }: MessageCenterProps) {
  return <RealtimeMessageCenter userId={userId} />;
}