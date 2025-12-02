import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { resumeSubscription } from '@/lib/stripe';

// POST - Resume a canceled subscription (before period end)
export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's subscription that's set to cancel
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: session.user.id,
        status: 'active',
        cancelAtPeriodEnd: true,
        stripeSubscriptionId: { not: null },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!subscription?.stripeSubscriptionId) {
      return NextResponse.json(
        { error: 'No subscription pending cancellation found' },
        { status: 404 }
      );
    }

    // Resume in Stripe
    const result = await resumeSubscription(subscription.stripeSubscriptionId);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to resume subscription' },
        { status: 500 }
      );
    }

    // Update local database
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        cancelAtPeriodEnd: false,
        canceledAt: null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error resuming subscription:', error);
    return NextResponse.json(
      { error: 'Failed to resume subscription' },
      { status: 500 }
    );
  }
}
