'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import {
  BellIcon,
  BellSlashIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  DevicePhoneMobileIcon,
} from '@heroicons/react/24/outline';

export function PushNotificationSettings() {
  const {
    isSupported,
    permission,
    isSubscribed,
    isLoading,
    error,
    subscribe,
    unsubscribe,
    showNotification,
  } = usePushNotifications();

  const [isToggling, setIsToggling] = useState(false);

  const handleToggle = async () => {
    setIsToggling(true);
    try {
      if (isSubscribed) {
        const success = await unsubscribe();
        if (success) {
          toast.success('Push notifications disabled');
        } else {
          toast.error('Failed to disable push notifications');
        }
      } else {
        const success = await subscribe();
        if (success) {
          toast.success('Push notifications enabled');
          // Send a test notification
          await showNotification('Notifications Enabled', {
            body: 'You will now receive push notifications from Liftout.',
            icon: '/icon-192.png',
          });
        } else {
          toast.error('Failed to enable push notifications');
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      toast.error(message);
    } finally {
      setIsToggling(false);
    }
  };

  const handleTestNotification = async () => {
    try {
      await showNotification('Test Notification', {
        body: 'This is a test notification from Liftout. Push notifications are working correctly!',
        icon: '/icon-192.png',
        tag: 'test-notification',
      });
      toast.success('Test notification sent');
    } catch (err) {
      toast.error('Failed to send test notification');
    }
  };

  // Not supported
  if (!isSupported) {
    return (
      <div className="card p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-bg-alt flex items-center justify-center">
            <BellSlashIcon className="h-6 w-6 text-text-tertiary" aria-hidden="true" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-text-primary">Push Notifications</h3>
            <p className="text-sm text-text-secondary mt-1">
              Push notifications are not supported in your browser. Try using Chrome, Firefox, or Safari.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Permission denied
  if (permission === 'denied') {
    return (
      <div className="card p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-error-light flex items-center justify-center">
            <ExclamationTriangleIcon className="h-6 w-6 text-error" aria-hidden="true" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-text-primary">Push Notifications Blocked</h3>
            <p className="text-sm text-text-secondary mt-1">
              You've blocked notifications from Liftout. To enable them, click the lock icon in your browser's address bar and allow notifications.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
            isSubscribed ? 'bg-success-light' : 'bg-bg-alt'
          }`}>
            {isSubscribed ? (
              <BellIcon className="h-6 w-6 text-success" aria-hidden="true" />
            ) : (
              <BellSlashIcon className="h-6 w-6 text-text-tertiary" aria-hidden="true" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-text-primary">Push Notifications</h3>
            <p className="text-sm text-text-secondary mt-1">
              {isSubscribed
                ? 'You will receive push notifications for new messages, applications, and opportunities.'
                : 'Enable push notifications to stay updated on new messages, applications, and opportunities.'}
            </p>
            {isSubscribed && (
              <div className="flex items-center gap-2 mt-3">
                <CheckCircleIcon className="h-4 w-4 text-success" aria-hidden="true" />
                <span className="text-sm font-medium text-success">Notifications enabled</span>
              </div>
            )}
            {error && (
              <div className="flex items-center gap-2 mt-3">
                <ExclamationTriangleIcon className="h-4 w-4 text-error" aria-hidden="true" />
                <span className="text-sm text-error">{error}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isSubscribed && (
            <button
              onClick={handleTestNotification}
              className="btn-secondary min-h-10 px-3 text-sm"
              disabled={isLoading}
            >
              Test
            </button>
          )}
          <button
            onClick={handleToggle}
            disabled={isLoading || isToggling}
            className={`min-h-12 px-6 rounded-lg font-medium transition-colors ${
              isSubscribed
                ? 'bg-bg-alt text-text-primary hover:bg-error-light hover:text-error'
                : 'bg-navy text-white hover:bg-navy-600'
            }`}
          >
            {isLoading || isToggling ? (
              <span className="inline-flex items-center gap-2">
                <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
                Loading...
              </span>
            ) : isSubscribed ? (
              'Disable'
            ) : (
              'Enable'
            )}
          </button>
        </div>
      </div>

      {/* What notifications you'll receive */}
      {!isSubscribed && permission === 'default' && (
        <div className="mt-6 pt-6 border-t border-border">
          <h4 className="text-sm font-bold text-text-primary mb-3">What you'll be notified about:</h4>
          <ul className="space-y-2 text-sm text-text-secondary">
            <li className="flex items-center gap-2">
              <DevicePhoneMobileIcon className="h-4 w-4 text-navy" aria-hidden="true" />
              New messages in conversations
            </li>
            <li className="flex items-center gap-2">
              <DevicePhoneMobileIcon className="h-4 w-4 text-navy" aria-hidden="true" />
              Application status updates
            </li>
            <li className="flex items-center gap-2">
              <DevicePhoneMobileIcon className="h-4 w-4 text-navy" aria-hidden="true" />
              Expressions of interest in your team
            </li>
            <li className="flex items-center gap-2">
              <DevicePhoneMobileIcon className="h-4 w-4 text-navy" aria-hidden="true" />
              New opportunities matching your profile
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
