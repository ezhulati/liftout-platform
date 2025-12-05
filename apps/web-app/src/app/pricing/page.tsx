'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  CheckIcon,
  XMarkIcon,
  SparklesIcon,
  RocketLaunchIcon,
  BuildingOffice2Icon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

type PlanType = 'free' | 'pro' | 'premium' | 'enterprise';
type BillingCycle = 'monthly' | 'yearly';

interface PlanFeatures {
  teamProfiles: number | string;
  opportunityPosts: number | string;
  messagesPerMonth: number | string;
  aiMatchingCredits: number | string;
  prioritySupport: boolean;
  analytics: string;
  customBranding: boolean;
  apiAccess: boolean;
}

interface Plan {
  id: PlanType;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: PlanFeatures;
  icon: React.ComponentType<{ className?: string }>;
  popular?: boolean;
  cta: string;
}

const plans: Plan[] = [
  {
    id: 'free',
    name: 'Starter',
    description: 'Explore how team-based hiring works',
    monthlyPrice: 0,
    yearlyPrice: 0,
    icon: UserGroupIcon,
    cta: 'Get Started Free',
    features: {
      teamProfiles: 1,
      opportunityPosts: 2,
      messagesPerMonth: 50,
      aiMatchingCredits: 5,
      prioritySupport: false,
      analytics: 'Basic',
      customBranding: false,
      apiAccess: false,
    },
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For teams ready to find their next opportunity',
    monthlyPrice: 49,
    yearlyPrice: 470,
    icon: SparklesIcon,
    cta: 'Start Pro Trial',
    features: {
      teamProfiles: 5,
      opportunityPosts: 10,
      messagesPerMonth: 500,
      aiMatchingCredits: 50,
      prioritySupport: false,
      analytics: 'Advanced',
      customBranding: false,
      apiAccess: false,
    },
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'For teams and companies executing liftouts',
    monthlyPrice: 149,
    yearlyPrice: 1430,
    icon: RocketLaunchIcon,
    popular: true,
    cta: 'Start Premium Trial',
    features: {
      teamProfiles: 20,
      opportunityPosts: 50,
      messagesPerMonth: 2000,
      aiMatchingCredits: 200,
      prioritySupport: true,
      analytics: 'Advanced',
      customBranding: true,
      apiAccess: false,
    },
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For high-volume team acquisitions',
    monthlyPrice: 499,
    yearlyPrice: 4790,
    icon: BuildingOffice2Icon,
    cta: 'Contact Sales',
    features: {
      teamProfiles: 'Unlimited',
      opportunityPosts: 'Unlimited',
      messagesPerMonth: 'Unlimited',
      aiMatchingCredits: 'Unlimited',
      prioritySupport: true,
      analytics: 'Enterprise',
      customBranding: true,
      apiAccess: true,
    },
  },
];

const featureLabels: Record<keyof PlanFeatures, string> = {
  teamProfiles: 'Team Profiles',
  opportunityPosts: 'Opportunity Posts',
  messagesPerMonth: 'Messages per Month',
  aiMatchingCredits: 'AI Matching Credits',
  prioritySupport: 'Priority Support',
  analytics: 'Analytics',
  customBranding: 'Custom Branding',
  apiAccess: 'API Access',
};

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('yearly');
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const { data: session } = useSession();
  const router = useRouter();

  const handleSelectPlan = async (plan: Plan) => {
    if (plan.id === 'enterprise') {
      window.location.href = 'mailto:sales@liftout.com?subject=Enterprise Plan Inquiry';
      return;
    }

    if (plan.id === 'free') {
      if (session) {
        router.push('/app/dashboard');
      } else {
        router.push('/auth/signup');
      }
      return;
    }

    if (!session) {
      router.push(`/auth/signup?plan=${plan.id}&billing=${billingCycle}`);
      return;
    }

    setIsLoading(plan.id);
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: plan.id,
          billingCycle,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('Failed to create checkout session:', data.error);
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
    } finally {
      setIsLoading(null);
    }
  };

  const formatPrice = (price: number) => {
    if (price === 0) return 'Free';
    return `$${price}`;
  };

  const getYearlySavings = (plan: Plan) => {
    if (plan.monthlyPrice === 0) return null;
    const yearlyCost = plan.yearlyPrice;
    const monthlyEquivalent = plan.monthlyPrice * 12;
    const savings = monthlyEquivalent - yearlyCost;
    return savings > 0 ? `Save $${savings}` : null;
  };

  return (
    <div className="min-h-screen bg-bg-alt">
      {/* Header */}
      <header className="bg-bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-navy">
              Liftout
            </Link>
            <div className="flex items-center gap-4">
              {session ? (
                <Link href="/app/dashboard" className="btn-primary">
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/auth/signin" className="btn-outline">
                    Sign In
                  </Link>
                  <Link href="/auth/signup" className="btn-primary">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-text-primary tracking-tight mb-4">
          Pricing for Team-Based Hiring
        </h1>
        <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-8">
          We built the first platform for liftouts. Choose the plan that fits your needs.
          Start free—no credit card required.
        </p>

        {/* Billing Toggle - Practical UI: 16px minimum text */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <span
            className={`text-base font-medium ${
              billingCycle === 'monthly' ? 'text-text-primary' : 'text-text-tertiary'
            }`}
          >
            Monthly
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              billingCycle === 'yearly' ? 'bg-navy' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span
            className={`text-base font-medium ${
              billingCycle === 'yearly' ? 'text-text-primary' : 'text-text-tertiary'
            }`}
          >
            Yearly
          </span>
          {billingCycle === 'yearly' && (
            <span className="ml-2 inline-flex items-center rounded-full bg-success-light px-2.5 py-1 text-base font-medium text-success">
              Save up to 20%
            </span>
          )}
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => {
            const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
            const perMonthPrice =
              billingCycle === 'yearly' && price > 0 ? Math.round(price / 12) : price;
            const savings = billingCycle === 'yearly' ? getYearlySavings(plan) : null;
            const Icon = plan.icon;

            return (
              <div
                key={plan.id}
                className={`relative bg-bg-surface rounded-2xl border-2 p-6 flex flex-col ${
                  plan.popular
                    ? 'border-navy shadow-xl ring-2 ring-navy/20'
                    : 'border-border hover:border-navy/30'
                } transition-all`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center rounded-full bg-navy px-3 py-1 text-base font-semibold text-white">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`p-2 rounded-lg ${
                      plan.popular ? 'bg-navy text-white' : 'bg-navy-50 text-navy'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-text-primary">{plan.name}</h3>
                    <p className="text-base text-text-tertiary">{plan.description}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-text-primary">
                      {formatPrice(perMonthPrice)}
                    </span>
                    {price > 0 && (
                      <span className="text-text-tertiary text-base">/month</span>
                    )}
                  </div>
                  {billingCycle === 'yearly' && price > 0 && (
                    <p className="text-base text-text-tertiary mt-1">
                      ${price} billed yearly
                    </p>
                  )}
                  {savings && (
                    <p className="text-base text-success font-medium mt-1">{savings}</p>
                  )}
                </div>

                <ul className="space-y-3 mb-6 flex-1">
                  {Object.entries(plan.features).map(([key, value]) => {
                    const featureKey = key as keyof PlanFeatures;
                    const isBoolean = typeof value === 'boolean';
                    const isPositive = isBoolean ? value : true;

                    return (
                      <li
                        key={key}
                        className={`flex items-center gap-2 text-base ${
                          isPositive ? 'text-text-secondary' : 'text-text-tertiary'
                        }`}
                      >
                        {isPositive ? (
                          <CheckIcon className="h-4 w-4 text-success flex-shrink-0" />
                        ) : (
                          <XMarkIcon className="h-4 w-4 text-text-tertiary flex-shrink-0" />
                        )}
                        <span>
                          {isBoolean
                            ? featureLabels[featureKey]
                            : `${value} ${featureLabels[featureKey]}`}
                        </span>
                      </li>
                    );
                  })}
                </ul>

                <button
                  onClick={() => handleSelectPlan(plan)}
                  disabled={isLoading === plan.id}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                    plan.popular
                      ? 'bg-navy text-white hover:bg-navy-dark'
                      : plan.id === 'free'
                      ? 'bg-bg-alt text-text-primary hover:bg-gray-200 border border-border'
                      : 'bg-navy-50 text-navy hover:bg-navy-100'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isLoading === plan.id ? 'Loading...' : plan.cta}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-2xl font-bold text-text-primary text-center mb-8">
          Compare All Features
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full bg-bg-surface rounded-xl border border-border">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 font-medium text-text-secondary text-base">Feature</th>
                {plans.map((plan) => (
                  <th key={plan.id} className="p-4 text-center font-bold text-text-primary text-base">
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {Object.keys(featureLabels).map((featureKey) => (
                <tr key={featureKey} className="hover:bg-bg-alt/50">
                  <td className="p-4 text-base text-text-secondary">
                    {featureLabels[featureKey as keyof PlanFeatures]}
                  </td>
                  {plans.map((plan) => {
                    const value = plan.features[featureKey as keyof PlanFeatures];
                    const isBoolean = typeof value === 'boolean';

                    return (
                      <td key={plan.id} className="p-4 text-center">
                        {isBoolean ? (
                          value ? (
                            <CheckIcon className="h-5 w-5 text-success mx-auto" />
                          ) : (
                            <XMarkIcon className="h-5 w-5 text-text-tertiary mx-auto" />
                          )
                        ) : (
                          <span className="text-base font-medium text-text-primary">{value}</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-2xl font-bold text-text-primary text-center mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {[
            {
              q: 'Can I change plans later?',
              a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any payments.",
            },
            {
              q: 'What happens when my trial ends?',
              a: "After your 14-day trial, you'll be automatically subscribed to your selected plan. You can cancel anytime before the trial ends.",
            },
            {
              q: 'Do you offer refunds?',
              a: "We offer a full refund within the first 30 days if you're not satisfied with our service.",
            },
            {
              q: 'What payment methods do you accept?',
              a: 'We accept all major credit cards (Visa, MasterCard, American Express) and wire transfers for enterprise plans.',
            },
            {
              q: 'Is there a setup fee?',
              a: 'No, there are no setup fees for any of our plans. Enterprise plans may have optional professional services.',
            },
          ].map((faq, i) => (
            <div key={i} className="bg-bg-surface rounded-lg border border-border p-6">
              <h3 className="font-semibold text-text-primary text-lg mb-2">{faq.q}</h3>
              <p className="text-base text-text-secondary">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-navy py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to find your next great team?
          </h2>
          <p className="text-navy-100 mb-8 max-w-2xl mx-auto">
            Be among the first to hire intact teams. This is a new way to build—join us.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/auth/signup"
              className="px-6 py-3 bg-white text-navy font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Start Free Trial
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 border border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-bg-surface border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-base text-text-tertiary">
            &copy; {new Date().getFullYear()} Liftout. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
