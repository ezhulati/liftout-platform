import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { cancelSubscription } from '@/lib/stripe';

// GET - Fetch user's subscription info
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's most recent subscription
    // Valid statuses: active, canceled, past_due, unpaid
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: session.user.id,
        status: {
          in: ['active', 'past_due', 'canceled'],
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!subscription) {
      return NextResponse.json({
        subscription: null,
        stripeCustomerId: null,
      });
    }

    // Map database status to BillingSettings expected format
    const statusMap: Record<string, 'active' | 'canceled' | 'past_due' | 'trialing'> = {
      active: 'active',
      past_due: 'past_due',
      canceled: 'canceled',
      unpaid: 'past_due', // Map unpaid to past_due for UI display
    };

    // Map plan type to expected format
    const planMap: Record<string, 'free' | 'pro' | 'premium' | 'enterprise'> = {
      free: 'free',
      pro: 'pro',
      premium: 'premium',
      enterprise: 'enterprise',
      FREE: 'free',
      PRO: 'pro',
      PREMIUM: 'premium',
      ENTERPRISE: 'enterprise',
    };

    return NextResponse.json({
      subscription: {
        id: subscription.id,
        plan: planMap[subscription.planType] || 'free',
        status: statusMap[subscription.status] || 'active',
        currentPeriodEnd: subscription.currentPeriodEnd?.toISOString() || null,
        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
      },
      stripeCustomerId: subscription.stripeCustomerId,
    });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription' },
      { status: 500 }
    );
  }
}

// DELETE - Cancel subscription (at period end)
export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's active subscription
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: session.user.id,
        status: 'active',
        stripeSubscriptionId: { not: null },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!subscription?.stripeSubscriptionId) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 }
      );
    }

    // Cancel in Stripe (at period end by default)
    const result = await cancelSubscription(subscription.stripeSubscriptionId, false);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to cancel subscription' },
        { status: 500 }
      );
    }

    // Update local database
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        cancelAtPeriodEnd: true,
        canceledAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    return NextResponse.json(
      { error: 'Failed to cancel subscription' },
      { status: 500 }
    );
  }
}
