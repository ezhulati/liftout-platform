import Stripe from 'stripe';

// Initialize Stripe client
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
  typescript: true,
});

const APP_URL = process.env.NEXTAUTH_URL || 'https://liftout.com';

// Price IDs - these should be set up in your Stripe dashboard
const PRICE_IDS = {
  pro_monthly: process.env.STRIPE_PRICE_PRO_MONTHLY || 'price_pro_monthly',
  pro_yearly: process.env.STRIPE_PRICE_PRO_YEARLY || 'price_pro_yearly',
  premium_monthly: process.env.STRIPE_PRICE_PREMIUM_MONTHLY || 'price_premium_monthly',
  premium_yearly: process.env.STRIPE_PRICE_PREMIUM_YEARLY || 'price_premium_yearly',
  enterprise_monthly: process.env.STRIPE_PRICE_ENTERPRISE_MONTHLY || 'price_enterprise_monthly',
  enterprise_yearly: process.env.STRIPE_PRICE_ENTERPRISE_YEARLY || 'price_enterprise_yearly',
  connection_fee: process.env.STRIPE_PRICE_CONNECTION_FEE || 'price_connection_fee',
};

export type PlanType = 'free' | 'pro' | 'premium' | 'enterprise';
export type BillingCycle = 'monthly' | 'yearly';

export interface CreateCheckoutSessionParams {
  customerId?: string;
  customerEmail: string;
  userId: string;
  companyId?: string;
  plan: PlanType;
  billingCycle: BillingCycle;
  successUrl?: string;
  cancelUrl?: string;
}

export interface CreateCustomerParams {
  email: string;
  name: string;
  userId: string;
  metadata?: Record<string, string>;
}

export interface SubscriptionResult {
  success: boolean;
  subscriptionId?: string;
  customerId?: string;
  error?: string;
}

// ============================================
// CUSTOMER MANAGEMENT
// ============================================

export async function createCustomer(params: CreateCustomerParams): Promise<{ customerId: string } | { error: string }> {
  const { email, name, userId, metadata = {} } = params;

  try {
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        userId,
        ...metadata,
      },
    });

    return { customerId: customer.id };
  } catch (err) {
    console.error('Error creating Stripe customer:', err);
    return { error: err instanceof Error ? err.message : 'Failed to create customer' };
  }
}

export async function getCustomer(customerId: string): Promise<Stripe.Customer | null> {
  try {
    const customer = await stripe.customers.retrieve(customerId);
    if (customer.deleted) return null;
    return customer as Stripe.Customer;
  } catch (err) {
    console.error('Error retrieving Stripe customer:', err);
    return null;
  }
}

export async function updateCustomer(customerId: string, data: Stripe.CustomerUpdateParams): Promise<boolean> {
  try {
    await stripe.customers.update(customerId, data);
    return true;
  } catch (err) {
    console.error('Error updating Stripe customer:', err);
    return false;
  }
}

// ============================================
// CHECKOUT SESSIONS
// ============================================

export async function createCheckoutSession(params: CreateCheckoutSessionParams): Promise<{ sessionId: string; url: string } | { error: string }> {
  const {
    customerId,
    customerEmail,
    userId,
    companyId,
    plan,
    billingCycle,
    successUrl = `${APP_URL}/app/settings/billing?success=true`,
    cancelUrl = `${APP_URL}/app/settings/billing?canceled=true`,
  } = params;

  if (plan === 'free') {
    return { error: 'Cannot create checkout for free plan' };
  }

  const priceKey = `${plan}_${billingCycle}` as keyof typeof PRICE_IDS;
  const priceId = PRICE_IDS[priceKey];

  if (!priceId || priceId.startsWith('price_')) {
    return { error: `Invalid price ID for ${plan} ${billingCycle}. Please configure STRIPE_PRICE_${plan.toUpperCase()}_${billingCycle.toUpperCase()} in environment variables.` };
  }

  try {
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId,
        companyId: companyId || '',
        plan,
        billingCycle,
      },
      subscription_data: {
        metadata: {
          userId,
          companyId: companyId || '',
          plan,
        },
      },
    };

    // Use existing customer or create new one
    if (customerId) {
      sessionParams.customer = customerId;
    } else {
      sessionParams.customer_email = customerEmail;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return {
      sessionId: session.id,
      url: session.url || '',
    };
  } catch (err) {
    console.error('Error creating checkout session:', err);
    return { error: err instanceof Error ? err.message : 'Failed to create checkout session' };
  }
}

export async function createConnectionFeeCheckout(params: {
  customerId?: string;
  customerEmail: string;
  userId: string;
  interestId: string;
  amount: number; // in cents
}): Promise<{ sessionId: string; url: string } | { error: string }> {
  const { customerId, customerEmail, userId, interestId, amount } = params;

  try {
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Connection Fee',
              description: 'One-time fee to reveal team/company contact information',
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      success_url: `${APP_URL}/app/interests/${interestId}?payment=success`,
      cancel_url: `${APP_URL}/app/interests/${interestId}?payment=canceled`,
      metadata: {
        userId,
        interestId,
        type: 'connection_fee',
      },
    };

    if (customerId) {
      sessionParams.customer = customerId;
    } else {
      sessionParams.customer_email = customerEmail;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return {
      sessionId: session.id,
      url: session.url || '',
    };
  } catch (err) {
    console.error('Error creating connection fee checkout:', err);
    return { error: err instanceof Error ? err.message : 'Failed to create checkout session' };
  }
}

// ============================================
// SUBSCRIPTION MANAGEMENT
// ============================================

export async function getSubscription(subscriptionId: string): Promise<Stripe.Subscription | null> {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    return subscription;
  } catch (err) {
    console.error('Error retrieving subscription:', err);
    return null;
  }
}

export async function cancelSubscription(subscriptionId: string, immediately = false): Promise<SubscriptionResult> {
  try {
    if (immediately) {
      await stripe.subscriptions.cancel(subscriptionId);
    } else {
      await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      });
    }
    return { success: true, subscriptionId };
  } catch (err) {
    console.error('Error canceling subscription:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Failed to cancel subscription' };
  }
}

export async function resumeSubscription(subscriptionId: string): Promise<SubscriptionResult> {
  try {
    await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: false,
    });
    return { success: true, subscriptionId };
  } catch (err) {
    console.error('Error resuming subscription:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Failed to resume subscription' };
  }
}

export async function changeSubscriptionPlan(
  subscriptionId: string,
  newPlan: PlanType,
  billingCycle: BillingCycle
): Promise<SubscriptionResult> {
  const priceKey = `${newPlan}_${billingCycle}` as keyof typeof PRICE_IDS;
  const priceId = PRICE_IDS[priceKey];

  if (!priceId || priceId.startsWith('price_')) {
    return { success: false, error: 'Invalid price ID for the selected plan' };
  }

  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    await stripe.subscriptions.update(subscriptionId, {
      items: [
        {
          id: subscription.items.data[0].id,
          price: priceId,
        },
      ],
      proration_behavior: 'create_prorations',
    });

    return { success: true, subscriptionId };
  } catch (err) {
    console.error('Error changing subscription plan:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Failed to change plan' };
  }
}

// ============================================
// BILLING PORTAL
// ============================================

export async function createBillingPortalSession(customerId: string, returnUrl?: string): Promise<{ url: string } | { error: string }> {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl || `${APP_URL}/app/settings/billing`,
    });

    return { url: session.url };
  } catch (err) {
    console.error('Error creating billing portal session:', err);
    return { error: err instanceof Error ? err.message : 'Failed to create billing portal session' };
  }
}

// ============================================
// WEBHOOK HANDLING
// ============================================

export function constructWebhookEvent(payload: string | Buffer, signature: string): Stripe.Event | { error: string } {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return { error: 'Webhook secret not configured' };
  }

  try {
    const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    return event;
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return { error: 'Invalid webhook signature' };
  }
}

// Webhook event handlers - to be called from the webhook API route
export async function handleCheckoutCompleted(session: Stripe.Checkout.Session): Promise<{
  type: 'subscription' | 'connection_fee';
  userId: string;
  customerId: string;
  subscriptionId?: string;
  interestId?: string;
  plan?: string;
}> {
  const metadata = session.metadata || {};
  const customerId = typeof session.customer === 'string' ? session.customer : session.customer?.id || '';

  if (metadata.type === 'connection_fee') {
    return {
      type: 'connection_fee',
      userId: metadata.userId,
      customerId,
      interestId: metadata.interestId,
    };
  }

  return {
    type: 'subscription',
    userId: metadata.userId,
    customerId,
    subscriptionId: typeof session.subscription === 'string' ? session.subscription : session.subscription?.id,
    plan: metadata.plan,
  };
}

export async function handleSubscriptionUpdated(subscription: Stripe.Subscription): Promise<{
  subscriptionId: string;
  status: string;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
}> {
  return {
    subscriptionId: subscription.id,
    status: subscription.status,
    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
  };
}

export async function handleInvoicePaid(invoice: Stripe.Invoice): Promise<{
  invoiceId: string;
  customerId: string;
  subscriptionId: string | null;
  amountPaid: number;
  currency: string;
}> {
  return {
    invoiceId: invoice.id,
    customerId: typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id || '',
    subscriptionId: typeof invoice.subscription === 'string' ? invoice.subscription : invoice.subscription?.id || null,
    amountPaid: invoice.amount_paid,
    currency: invoice.currency,
  };
}

export async function handleInvoicePaymentFailed(invoice: Stripe.Invoice): Promise<{
  invoiceId: string;
  customerId: string;
  subscriptionId: string | null;
  attemptCount: number;
}> {
  return {
    invoiceId: invoice.id,
    customerId: typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id || '',
    subscriptionId: typeof invoice.subscription === 'string' ? invoice.subscription : invoice.subscription?.id || null,
    attemptCount: invoice.attempt_count || 0,
  };
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

export function getPlanFeatures(plan: PlanType): {
  teamProfiles: number;
  opportunityPosts: number;
  messagesPerMonth: number;
  aiMatchingCredits: number;
  prioritySupport: boolean;
  analytics: 'basic' | 'advanced' | 'enterprise';
  customBranding: boolean;
  apiAccess: boolean;
} {
  const features = {
    free: {
      teamProfiles: 1,
      opportunityPosts: 2,
      messagesPerMonth: 50,
      aiMatchingCredits: 5,
      prioritySupport: false,
      analytics: 'basic' as const,
      customBranding: false,
      apiAccess: false,
    },
    pro: {
      teamProfiles: 5,
      opportunityPosts: 10,
      messagesPerMonth: 500,
      aiMatchingCredits: 50,
      prioritySupport: false,
      analytics: 'advanced' as const,
      customBranding: false,
      apiAccess: false,
    },
    premium: {
      teamProfiles: 20,
      opportunityPosts: 50,
      messagesPerMonth: 2000,
      aiMatchingCredits: 200,
      prioritySupport: true,
      analytics: 'advanced' as const,
      customBranding: true,
      apiAccess: false,
    },
    enterprise: {
      teamProfiles: -1, // unlimited
      opportunityPosts: -1,
      messagesPerMonth: -1,
      aiMatchingCredits: -1,
      prioritySupport: true,
      analytics: 'enterprise' as const,
      customBranding: true,
      apiAccess: true,
    },
  };

  return features[plan];
}

export function getPlanPricing(plan: PlanType, billingCycle: BillingCycle): {
  amount: number;
  currency: string;
  interval: string;
  savings?: number;
} {
  const pricing = {
    free: { monthly: 0, yearly: 0 },
    pro: { monthly: 4900, yearly: 47000 }, // $49/mo or $470/yr (save ~$118)
    premium: { monthly: 14900, yearly: 143000 }, // $149/mo or $1430/yr (save ~$358)
    enterprise: { monthly: 49900, yearly: 479000 }, // $499/mo or $4790/yr (save ~$1198)
  };

  const amount = pricing[plan][billingCycle];
  const monthlyEquivalent = billingCycle === 'yearly' ? Math.round(amount / 12) : amount;
  const savings = billingCycle === 'yearly' ? (pricing[plan].monthly * 12) - amount : undefined;

  return {
    amount,
    currency: 'usd',
    interval: billingCycle === 'monthly' ? 'month' : 'year',
    savings,
  };
}

// Export the stripe instance for advanced usage
export { stripe };

// Export all functions as a service object
export const stripeService = {
  createCustomer,
  getCustomer,
  updateCustomer,
  createCheckoutSession,
  createConnectionFeeCheckout,
  getSubscription,
  cancelSubscription,
  resumeSubscription,
  changeSubscriptionPlan,
  createBillingPortalSession,
  constructWebhookEvent,
  handleCheckoutCompleted,
  handleSubscriptionUpdated,
  handleInvoicePaid,
  handleInvoicePaymentFailed,
  getPlanFeatures,
  getPlanPricing,
};
