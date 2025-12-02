'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  KeyIcon,
} from '@heroicons/react/24/outline';

export default function Verify2FAPage() {
  const { update: updateSession } = useSession();
  const router = useRouter();

  const [code, setCode] = useState('');
  const [isBackupCode, setIsBackupCode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!code) {
      setError('Please enter a code');
      return;
    }

    if (!isBackupCode && code.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, isBackupCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Verification failed');
      }

      // Update session to mark 2FA as verified
      await updateSession({
        twoFactorVerified: true,
      });

      router.push('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="max-w-md w-full">
        <div className="rounded-2xl border border-gray-700 bg-gray-800/50 p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
              <ShieldCheckIcon className="h-8 w-8 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Two-Factor Authentication
            </h1>
            <p className="text-gray-400">
              Enter the verification code from your authenticator app to continue.
            </p>
          </div>

          <div className="space-y-4">
            {!isBackupCode ? (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Authentication Code
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  autoFocus
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Backup Code
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="XXXXXXXX"
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white text-center text-lg font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  autoFocus
                />
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <ExclamationTriangleIcon className="h-4 w-4" />
                {error}
              </div>
            )}

            <button
              onClick={handleVerify}
              disabled={loading || !code}
              className="w-full px-4 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Verify'}
            </button>

            <div className="text-center pt-4 border-t border-gray-700">
              <button
                onClick={() => {
                  setIsBackupCode(!isBackupCode);
                  setCode('');
                  setError(null);
                }}
                className="flex items-center gap-2 mx-auto text-sm text-gray-400 hover:text-white transition-colors"
              >
                <KeyIcon className="h-4 w-4" />
                {isBackupCode ? 'Use authenticator app instead' : 'Use a backup code'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
