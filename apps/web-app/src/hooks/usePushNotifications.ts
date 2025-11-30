'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import {
  isPushSupported,
  getNotificationPermission,
  requestNotificationPermission,
  registerServiceWorker,
  subscribeToPush,
  unsubscribeFromPush,
  isPushSubscribed,
  saveSubscriptionToServer,
  removeSubscriptionFromServer,
  showLocalNotification,
  PushSubscriptionData,
} from '@/lib/push-notifications';

export type PushPermission = 'default' | 'granted' | 'denied' | 'unsupported';

export interface UsePushNotificationsResult {
  // State
  isSupported: boolean;
  permission: PushPermission;
  isSubscribed: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  requestPermission: () => Promise<NotificationPermission>;
  subscribe: () => Promise<boolean>;
  unsubscribe: () => Promise<boolean>;
  showNotification: (title: string, options?: NotificationOptions) => Promise<void>;
}

export function usePushNotifications(): UsePushNotificationsResult {
  const { data: session } = useSession();
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<PushPermission>('unsupported');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize on mount
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const supported = isPushSupported();
        setIsSupported(supported);

        if (supported) {
          // Register service worker
          await registerServiceWorker();

          // Check permission
          const perm = getNotificationPermission();
          setPermission(perm);

          // Check subscription status
          const subscribed = await isPushSubscribed();
          setIsSubscribed(subscribed);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to initialize push notifications';
        setError(message);
        console.error('Push notification init error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  // Request permission
  const requestPermission = useCallback(async (): Promise<NotificationPermission> => {
    setError(null);
    try {
      const perm = await requestNotificationPermission();
      setPermission(perm);
      return perm;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to request permission';
      setError(message);
      throw err;
    }
  }, []);

  // Subscribe to push notifications
  const subscribe = useCallback(async (): Promise<boolean> => {
    if (!session?.user?.id) {
      setError('User not authenticated');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Get push subscription
      const subscription = await subscribeToPush();
      if (!subscription) {
        throw new Error('Failed to create push subscription');
      }

      // Save to server
      const saved = await saveSubscriptionToServer(subscription, session.user.id);
      if (!saved) {
        console.warn('Failed to save subscription to server, but local subscription succeeded');
      }

      setIsSubscribed(true);
      setPermission('granted');
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to subscribe';
      setError(message);
      console.error('Push subscription error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.id]);

  // Unsubscribe from push notifications
  const unsubscribe = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Unsubscribe locally
      const success = await unsubscribeFromPush();

      // Remove from server
      if (session?.user?.id) {
        await removeSubscriptionFromServer(session.user.id);
      }

      setIsSubscribed(false);
      return success;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to unsubscribe';
      setError(message);
      console.error('Push unsubscription error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.id]);

  // Show a local notification
  const showNotification = useCallback(async (title: string, options?: NotificationOptions): Promise<void> => {
    try {
      await showLocalNotification(title, options);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to show notification';
      setError(message);
      throw err;
    }
  }, []);

  return {
    isSupported,
    permission,
    isSubscribed,
    isLoading,
    error,
    requestPermission,
    subscribe,
    unsubscribe,
    showNotification,
  };
}
