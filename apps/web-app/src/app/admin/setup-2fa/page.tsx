'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  ShieldCheckIcon,
  KeyIcon,
  ClipboardDocumentIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

export default function Setup2FAPage() {
  const { data: session, status, update: updateSession } = useSession();
  const router = useRouter();

  const [step, setStep] = useState<'intro' | 'scan' | 'verify' | 'backup' | 'complete'>('intro');
  const [checkingStatus, setCheckingStatus] = useState(true);

  // Check if 2FA is already enabled and redirect to admin
  useEffect(() => {
    async function check2FAStatus() {
      if (status === 'loading') return;

      try {
        const response = await fetch('/api/admin/2fa/setup');
        if (response.ok) {
          const data = await response.json();
          if (data.enabled) {
            // 2FA already enabled, redirect to admin dashboard
            router.push('/admin');
            return;
          }
        }
      } catch (err) {
        console.error('Error checking 2FA status:', err);
      }
      setCheckingStatus(false);
    }

    check2FAStatus();
  }, [status, router]);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedCodes, setCopiedCodes] = useState(false);

  const handleStartSetup = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/2fa/setup', { method: 'POST' });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to set up 2FA');
      }

      setQrCodeUrl(data.qrCodeDataUrl);
      setBackupCodes(data.backupCodes);
      setStep('scan');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (verificationCode.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: verificationCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Verification failed');
      }

      // Update session to reflect 2FA is now enabled and verified
      await updateSession({
        twoFactorEnabled: true,
        twoFactorVerified: true,
      });

      setStep('backup');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyBackupCodes = () => {
    navigator.clipboard.writeText(backupCodes.join('\n'));
    setCopiedCodes(true);
    setTimeout(() => setCopiedCodes(false), 2000);
  };

  const handleComplete = () => {
    router.push('/admin');
  };

  // Show loading while checking 2FA status
  if (checkingStatus) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div>
          <p className="text-gray-400">Checking authentication status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="max-w-md w-full">
        <div className="rounded-2xl border border-gray-700 bg-gray-800/50 p-8">
          {step === 'intro' && (
            <div className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
                <ShieldCheckIcon className="h-8 w-8 text-red-500" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">
                Set Up Two-Factor Authentication
              </h1>
              <p className="text-gray-400 mb-6">
                Two-factor authentication adds an extra layer of security to your admin account.
                You'll need an authenticator app like Google Authenticator or Authy.
              </p>
              <button
                onClick={handleStartSetup}
                disabled={loading}
                className="w-full px-4 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Setting up...' : 'Begin Setup'}
              </button>
            </div>
          )}

          {step === 'scan' && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4 text-center">
                Scan QR Code
              </h2>
              <p className="text-gray-400 text-sm mb-6 text-center">
                Open your authenticator app and scan this QR code to add your account.
              </p>

              {qrCodeUrl && (
                <div className="flex justify-center mb-6">
                  <div className="bg-white p-4 rounded-lg">
                    <Image
                      src={qrCodeUrl}
                      alt="2FA QR Code"
                      width={200}
                      height={200}
                      className="w-48 h-48"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Enter the 6-digit code from your app
                  </label>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-red-400 text-sm">
                    <ExclamationTriangleIcon className="h-4 w-4" />
                    {error}
                  </div>
                )}

                <button
                  onClick={handleVerify}
                  disabled={loading || verificationCode.length !== 6}
                  className="w-full px-4 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Verifying...' : 'Verify & Continue'}
                </button>
              </div>
            </div>
          )}

          {step === 'backup' && (
            <div>
              <div className="text-center mb-6">
                <div className="mx-auto w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                  <CheckCircleIcon className="h-6 w-6 text-green-500" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">
                  2FA Enabled Successfully
                </h2>
                <p className="text-gray-400 text-sm">
                  Save these backup codes in a secure location. You can use them to access your
                  account if you lose your authenticator device.
                </p>
              </div>

              <div className="bg-gray-900 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <KeyIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-300">Backup Codes</span>
                  </div>
                  <button
                    onClick={handleCopyBackupCodes}
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
                  >
                    <ClipboardDocumentIcon className="h-4 w-4" />
                    {copiedCodes ? 'Copied!' : 'Copy all'}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {backupCodes.map((code, index) => (
                    <code
                      key={index}
                      className="text-sm font-mono text-center py-1.5 px-2 bg-gray-800 rounded text-gray-300"
                    >
                      {code}
                    </code>
                  ))}
                </div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6">
                <div className="flex gap-3">
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                  <div className="text-sm text-yellow-200">
                    <strong>Important:</strong> Each backup code can only be used once. Store them
                    safely and don't share them with anyone.
                  </div>
                </div>
              </div>

              <button
                onClick={handleComplete}
                className="w-full px-4 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
              >
                Continue to Admin Panel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
