import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createCheckoutSession, createCustomer, type PlanType, type BillingCycle } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { plan, billingCycle } = body as { plan: PlanType; billingCycle: BillingCycle };

    if (!plan || !billingCycle) {
      return NextResponse.json({ error: 'Missing plan or billing cycle' }, { status: 400 });
    }

    if (plan === 'free') {
      return NextResponse.json({ error: 'Cannot create checkout for free plan' }, { status: 400 });
    }

    // Get user's subscription info
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        subscriptions: {
          where: { status: 'active' },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        companyMemberships: {
          include: { company: true },
          take: 1,
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let customerId = user.subscriptions[0]?.stripeCustomerId;

    // Create Stripe customer if they don't have one
    if (!customerId) {
      const customerResult = await createCustomer({
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        userId: user.id,
      });

      if ('error' in customerResult) {
        return NextResponse.json({ error: customerResult.error }, { status: 500 });
      }

      customerId = customerResult.customerId;
    }

    // Get company ID if user is associated with a company
    const companyId = user.companyMemberships[0]?.companyId;

    // Create checkout session
    const checkoutResult = await createCheckoutSession({
      customerId,
      customerEmail: user.email,
      userId: user.id,
      companyId,
      plan,
      billingCycle,
    });

    if ('error' in checkoutResult) {
      return NextResponse.json({ error: checkoutResult.error }, { status: 500 });
    }

    return NextResponse.json({
      sessionId: checkoutResult.sessionId,
      url: checkoutResult.url,
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
