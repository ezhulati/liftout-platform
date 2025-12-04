'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  CreditCardIcon,
  CheckIcon,
  SparklesIcon,
  RocketLaunchIcon,
  BuildingOffice2Icon,
  ArrowTopRightOnSquareIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

interface Subscription {
  id: string;
  plan: 'free' | 'pro' | 'premium' | 'enterprise';
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

interface BillingInfo {
  subscription: Subscription | null;
  stripeCustomerId: string | null;
}

const planDetails = {
  free: {
    name: 'Starter',
    price: 0,
    icon: SparklesIcon,
    features: ['1 Team Profile', '2 Opportunity Posts', '50 Messages/month', 'Basic Analytics'],
  },
  pro: {
    name: 'Pro',
    price: 49,
    icon: SparklesIcon,
    features: ['5 Team Profiles', '10 Opportunity Posts', '500 Messages/month', 'Advanced Analytics'],
  },
  premium: {
    name: 'Premium',
    price: 149,
    icon: RocketLaunchIcon,
    features: ['20 Team Profiles', '50 Opportunity Posts', '2000 Messages/month', 'Priority Support', 'Custom Branding'],
  },
  enterprise: {
    name: 'Enterprise',
    price: 499,
    icon: BuildingOffice2Icon,
    features: ['Unlimited Team Profiles', 'Unlimited Opportunities', 'Unlimited Messages', 'API Access', 'Dedicated Support'],
  },
};

export function BillingSettings() {
  const { data: session } = useSession();
  const [billing, setBilling] = useState<BillingInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isManaging, setIsManaging] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);

  const isDemoUser = session?.user?.email === 'demo@example.com' || session?.user?.email === 'company@example.com';

  useEffect(() => {
    fetchBillingInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchBillingInfo = async () => {
    if (isDemoUser) {
      // Demo user - show mock data
      setBilling({
        subscription: {
          id: 'demo-sub-1',
          plan: 'pro',
          status: 'active',
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          cancelAtPeriodEnd: false,
        },
        stripeCustomerId: null,
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/stripe/subscription');
      if (response.ok) {
        const data = await response.json();
        setBilling(data);
      } else {
        // No subscription found
        setBilling({ subscription: null, stripeCustomerId: null });
      }
    } catch (error) {
      console.error('Error fetching billing info:', error);
      setBilling({ subscription: null, stripeCustomerId: null });
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageBilling = async () => {
    if (isDemoUser) {
      toast.success('Billing portal opened (demo mode)');
      return;
    }

    setIsManaging(true);
    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error('Failed to open billing portal');
      }
    } catch (error) {
      console.error('Error opening billing portal:', error);
      toast.error('Failed to open billing portal');
    } finally {
      setIsManaging(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (isDemoUser) {
      toast.success('Subscription canceled (demo mode)');
      setBilling(prev => prev ? {
        ...prev,
        subscription: prev.subscription ? {
          ...prev.subscription,
          cancelAtPeriodEnd: true,
        } : null,
      } : null);
      setIsCanceling(false);
      return;
    }

    try {
      const response = await fetch('/api/stripe/subscription', {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Subscription will be canceled at the end of the billing period');
        fetchBillingInfo();
      } else {
        toast.error('Failed to cancel subscription');
      }
    } catch (error) {
      console.error('Error canceling subscription:', error);
      toast.error('Failed to cancel subscription');
    } finally {
      setIsCanceling(false);
    }
  };

  const handleResumeSubscription = async () => {
    if (isDemoUser) {
      toast.success('Subscription resumed (demo mode)');
      setBilling(prev => prev ? {
        ...prev,
        subscription: prev.subscription ? {
          ...prev.subscription,
          cancelAtPeriodEnd: false,
        } : null,
      } : null);
      return;
    }

    try {
      const response = await fetch('/api/stripe/subscription/resume', {
        method: 'POST',
      });

      if (response.ok) {
        toast.success('Subscription resumed');
        fetchBillingInfo();
      } else {
        toast.error('Failed to resume subscription');
      }
    } catch (error) {
      console.error('Error resuming subscription:', error);
      toast.error('Failed to resume subscription');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="pb-4 border-b border-border">
          <div className="h-6 w-48 bg-bg-elevated rounded animate-pulse"></div>
          <div className="h-4 w-72 bg-bg-elevated rounded animate-pulse mt-2"></div>
        </div>
        <div className="h-64 bg-bg-elevated rounded-lg animate-pulse"></div>
      </div>
    );
  }

  const currentPlan = billing?.subscription?.plan || 'free';
  const plan = planDetails[currentPlan];
  const Icon = plan.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-border">
        <h3 className="text-lg font-bold text-text-primary">Billing & Subscription</h3>
        <p className="mt-1 text-sm text-text-secondary">
          Manage your subscription plan and billing information.
        </p>
      </div>

      {/* Current Plan */}
      <div className="card">
        <div className="px-6 py-4 border-b border-border">
          <h4 className="text-base font-bold text-text-primary flex items-center">
            <CreditCardIcon className="h-5 w-5 text-text-tertiary mr-2" />
            Current Plan
          </h4>
        </div>
        <div className="px-6 py-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-navy-50 rounded-lg">
                <Icon className="h-6 w-6 text-navy" />
              </div>
              <div>
                <h5 className="text-xl font-bold text-text-primary">{plan.name}</h5>
                <p className="text-text-secondary">
                  {plan.price === 0 ? (
                    'Free forever'
                  ) : (
                    <span>
                      <span className="text-2xl font-bold text-text-primary">${plan.price}</span>
                      <span className="text-text-tertiary">/month</span>
                    </span>
                  )}
                </p>
                {billing?.subscription && (
                  <div className="mt-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      billing.subscription.status === 'active' ? 'bg-success-light text-success' :
                      billing.subscription.status === 'trialing' ? 'bg-info-light text-info' :
                      billing.subscription.status === 'past_due' ? 'bg-error-light text-error' :
                      'bg-bg-alt text-text-tertiary'
                    }`}>
                      {billing.subscription.status === 'active' && !billing.subscription.cancelAtPeriodEnd && 'Active'}
                      {billing.subscription.status === 'active' && billing.subscription.cancelAtPeriodEnd && 'Canceling'}
                      {billing.subscription.status === 'trialing' && 'Trial'}
                      {billing.subscription.status === 'past_due' && 'Past Due'}
                      {billing.subscription.status === 'canceled' && 'Canceled'}
                    </span>
                    {billing.subscription.currentPeriodEnd && (
                      <p className="text-xs text-text-tertiary mt-1">
                        {billing.subscription.cancelAtPeriodEnd ? 'Ends' : 'Renews'} on{' '}
                        {new Date(billing.subscription.currentPeriodEnd).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Link href="/pricing" className="btn-primary text-center">
                {currentPlan === 'free' ? 'Upgrade Plan' : 'Change Plan'}
              </Link>
              {billing?.subscription && billing.subscription.plan !== 'free' && (
                <button
                  onClick={handleManageBilling}
                  disabled={isManaging}
                  className="btn-outline flex items-center justify-center"
                >
                  {isManaging ? (
                    'Loading...'
                  ) : (
                    <>
                      Manage Billing
                      <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-1" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Features */}
          <div className="mt-6 pt-6 border-t border-border">
            <h6 className="text-sm font-bold text-text-primary mb-3">Plan Features</h6>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center text-sm text-text-secondary">
                  <CheckIcon className="h-4 w-4 text-success mr-2 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Cancel Warning */}
          {billing?.subscription?.cancelAtPeriodEnd && (
            <div className="mt-6 p-4 bg-gold-50 border border-gold-200 rounded-lg">
              <div className="flex items-start gap-3">
                <ExclamationTriangleIcon className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gold-800">
                    Your subscription is set to cancel
                  </p>
                  <p className="text-sm text-gold-700 mt-1">
                    You will lose access to {plan.name} features on{' '}
                    {new Date(billing.subscription.currentPeriodEnd).toLocaleDateString()}.
                  </p>
                  <button
                    onClick={handleResumeSubscription}
                    className="text-sm font-medium text-gold-800 hover:text-gold-900 underline mt-2"
                  >
                    Resume subscription
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Usage */}
      <div className="card">
        <div className="px-6 py-4 border-b border-border">
          <h4 className="text-base font-bold text-text-primary">Current Usage</h4>
        </div>
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-bg-alt rounded-lg">
              <p className="text-sm text-text-tertiary">Team Profiles</p>
              <p className="text-2xl font-bold text-text-primary mt-1">
                1 <span className="text-sm font-normal text-text-tertiary">/ {currentPlan === 'enterprise' ? 'Unlimited' : plan.features[0].split(' ')[0]}</span>
              </p>
            </div>
            <div className="p-4 bg-bg-alt rounded-lg">
              <p className="text-sm text-text-tertiary">Opportunities Posted</p>
              <p className="text-2xl font-bold text-text-primary mt-1">
                0 <span className="text-sm font-normal text-text-tertiary">/ {currentPlan === 'enterprise' ? 'Unlimited' : plan.features[1].split(' ')[0]}</span>
              </p>
            </div>
            <div className="p-4 bg-bg-alt rounded-lg">
              <p className="text-sm text-text-tertiary">Messages This Month</p>
              <p className="text-2xl font-bold text-text-primary mt-1">
                0 <span className="text-sm font-normal text-text-tertiary">/ {currentPlan === 'enterprise' ? 'Unlimited' : plan.features[2].split(' ')[0]}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Subscription */}
      {billing?.subscription && billing.subscription.plan !== 'free' && !billing.subscription.cancelAtPeriodEnd && (
        <div className="card border-error/20">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-bold text-text-primary">Cancel Subscription</h4>
                <p className="text-sm text-text-secondary mt-1">
                  You can cancel anytime. Your subscription will remain active until the end of your billing period.
                </p>
              </div>
              {isCanceling ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-text-secondary">Are you sure?</span>
                  <button
                    onClick={handleCancelSubscription}
                    className="btn-danger text-sm"
                  >
                    Yes, cancel
                  </button>
                  <button
                    onClick={() => setIsCanceling(false)}
                    className="btn-outline text-sm"
                  >
                    No, keep it
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsCanceling(true)}
                  className="text-sm text-error hover:text-error-dark font-medium"
                >
                  Cancel subscription
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Payment History Link */}
      {billing?.subscription && billing.subscription.plan !== 'free' && (
        <div className="text-center">
          <button
            onClick={handleManageBilling}
            className="text-sm text-navy hover:text-navy-dark font-medium"
          >
            View payment history and invoices
          </button>
        </div>
      )}
    </div>
  );
}
