'use client';

import { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import {
  ShieldCheckIcon,
  XMarkIcon,
  LockClosedIcon,
  DocumentTextIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';

interface NDAAcceptanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  teamName?: string;
  isLoading?: boolean;
}

export function NDAAcceptanceModal({
  isOpen,
  onClose,
  onAccept,
  teamName = 'this team',
  isLoading = false,
}: NDAAcceptanceModalProps) {
  const [hasAcknowledged, setHasAcknowledged] = useState(false);

  const handleAccept = () => {
    if (hasAcknowledged) {
      onAccept();
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setHasAcknowledged(false);
      onClose();
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-bg-surface text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <ShieldCheckIcon className="h-5 w-5 text-purple-700" />
                    </div>
                    <Dialog.Title as="h3" className="text-lg font-bold text-text-primary">
                      Confidentiality Agreement
                    </Dialog.Title>
                  </div>
                  <button
                    onClick={handleClose}
                    disabled={isLoading}
                    className="min-h-10 min-w-10 flex items-center justify-center text-text-tertiary hover:text-text-primary rounded-lg transition-colors disabled:opacity-50"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="px-6 py-4">
                  <div className="space-y-4">
                    <p className="text-text-secondary">
                      You are about to contact <span className="font-semibold text-text-primary">{teamName}</span>,
                      an anonymous team profile. To protect their identity and enable confidential communication,
                      you must agree to the following terms:
                    </p>

                    {/* NDA Terms */}
                    <div className="bg-bg-alt rounded-lg p-4 space-y-3">
                      <div className="flex items-start gap-3">
                        <LockClosedIcon className="h-5 w-5 text-purple-700 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-text-primary text-sm">Confidentiality</h4>
                          <p className="text-xs text-text-secondary mt-1">
                            You agree to keep all information shared in this conversation strictly confidential
                            and not disclose it to any third party.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <DocumentTextIcon className="h-5 w-5 text-purple-700 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-text-primary text-sm">Non-Disclosure</h4>
                          <p className="text-xs text-text-secondary mt-1">
                            You will not attempt to identify anonymous team members or their current employer
                            through external means.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <ShieldCheckIcon className="h-5 w-5 text-purple-700 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-text-primary text-sm">Professional Use Only</h4>
                          <p className="text-xs text-text-secondary mt-1">
                            Information obtained will be used solely for the purpose of evaluating
                            a potential hiring opportunity.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Acknowledgment checkbox */}
                    <label className="flex items-start gap-3 cursor-pointer">
                      <div className="flex-shrink-0 mt-0.5">
                        <input
                          type="checkbox"
                          checked={hasAcknowledged}
                          onChange={(e) => setHasAcknowledged(e.target.checked)}
                          disabled={isLoading}
                          className="sr-only peer"
                        />
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          hasAcknowledged
                            ? 'bg-purple-700 border-purple-700'
                            : 'border-border hover:border-purple-400'
                        } ${isLoading ? 'opacity-50' : ''}`}>
                          {hasAcknowledged && <CheckIcon className="h-3 w-3 text-white" />}
                        </div>
                      </div>
                      <span className="text-sm text-text-secondary">
                        I understand and agree to the confidentiality terms above. I acknowledge that
                        violation of these terms may result in legal action and removal from the platform.
                      </span>
                    </label>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-bg-alt">
                  <button
                    onClick={handleClose}
                    disabled={isLoading}
                    className="btn-outline min-h-10 px-4 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAccept}
                    disabled={!hasAcknowledged || isLoading}
                    className="btn-primary min-h-10 px-4 inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheckIcon className="h-4 w-4" />
                        <span>Accept & Continue</span>
                      </>
                    )}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
