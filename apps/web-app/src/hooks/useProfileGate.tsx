'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useCallback } from 'react';

interface ProfileGateOptions {
  /** Custom message to show when profile is incomplete */
  message?: string;
  /** Whether to redirect to onboarding (default: false, shows toast) */
  redirect?: boolean;
}

interface ProfileGateResult {
  /** Whether the user's profile is complete */
  isProfileComplete: boolean;
  /** Whether the profile completion status is still loading */
  isLoading: boolean;
  /**
   * Check if action is allowed. If not, shows a prompt to complete profile.
   * Returns true if action can proceed, false if blocked.
   */
  checkAccess: (options?: ProfileGateOptions) => boolean;
  /**
   * Wrapper for async actions. Shows prompt if profile incomplete.
   * Returns the result of the action, or undefined if blocked.
   */
  gatedAction: <T>(action: () => Promise<T>, options?: ProfileGateOptions) => Promise<T | undefined>;
}

const DEFAULT_MESSAGE = 'Complete your profile to unlock this feature';

/**
 * Hook to gate features behind profile completion.
 *
 * Usage:
 * ```tsx
 * const { checkAccess, gatedAction, isProfileComplete } = useProfileGate();
 *
 * // Option 1: Check before action
 * const handleApply = () => {
 *   if (!checkAccess({ message: 'Complete your profile to apply' })) return;
 *   // ... proceed with apply
 * };
 *
 * // Option 2: Wrap async action
 * const handleMessage = async () => {
 *   await gatedAction(async () => {
 *     // ... send message
 *   }, { message: 'Complete your profile to message companies' });
 * };
 *
 * // Option 3: Conditional rendering
 * {isProfileComplete ? (
 *   <Button onClick={handleApply}>Apply</Button>
 * ) : (
 *   <Button onClick={() => checkAccess()}>Apply (Complete Profile)</Button>
 * )}
 * ```
 */
export function useProfileGate(): ProfileGateResult {
  const { data: session, status } = useSession();
  const router = useRouter();

  const isLoading = status === 'loading';
  const isProfileComplete = session?.user?.profileCompleted !== false;

  const showPrompt = useCallback((message: string, redirect: boolean) => {
    if (redirect) {
      router.push('/app/onboarding');
    } else {
      toast((t) => (
        <div className="flex flex-col gap-2">
          <p className="font-medium">{message}</p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                router.push('/app/onboarding');
              }}
              className="px-3 py-1.5 bg-navy text-white text-sm font-medium rounded-lg hover:bg-navy-dark transition-colors"
            >
              Complete profile
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1.5 text-text-secondary text-sm font-medium hover:text-text-primary transition-colors"
            >
              Later
            </button>
          </div>
        </div>
      ), {
        duration: 8000,
        position: 'top-center',
      });
    }
  }, [router]);

  const checkAccess = useCallback((options?: ProfileGateOptions): boolean => {
    if (isLoading) return false;
    if (isProfileComplete) return true;

    const message = options?.message || DEFAULT_MESSAGE;
    const redirect = options?.redirect || false;
    showPrompt(message, redirect);
    return false;
  }, [isLoading, isProfileComplete, showPrompt]);

  const gatedAction = useCallback(async <T,>(
    action: () => Promise<T>,
    options?: ProfileGateOptions
  ): Promise<T | undefined> => {
    if (!checkAccess(options)) return undefined;
    return action();
  }, [checkAccess]);

  return {
    isProfileComplete,
    isLoading,
    checkAccess,
    gatedAction,
  };
}

export default useProfileGate;
