import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import {
  constructWebhookEvent,
  handleCheckoutCompleted,
  handleSubscriptionUpdated,
  handleInvoicePaid,
  handleInvoicePaymentFailed,
} from '@/lib/stripe';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  const event = constructWebhookEvent(body, signature);

  if ('error' in event) {
    console.error('Webhook error:', event.error);
    return NextResponse.json({ error: event.error }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const result = await handleCheckoutCompleted(session);

        if (result.type === 'subscription') {
          // Create or update subscription in database
          await prisma.subscription.upsert({
            where: {
              stripeSubscriptionId: result.subscriptionId,
            },
            create: {
              userId: result.userId,
              stripeCustomerId: result.customerId,
              stripeSubscriptionId: result.subscriptionId,
              planType: (result.plan as 'free' | 'pro' | 'premium' | 'enterprise') || 'pro',
              status: 'active',
              amount: 0, // Will be updated by subscription.updated event
              billingCycle: 'monthly',
            },
            update: {
              status: 'active',
              stripeCustomerId: result.customerId,
            },
          });

          console.log(`Subscription created for user ${result.userId}`);
        } else if (result.type === 'connection_fee' && result.interestId) {
          // Mark connection fee as paid
          await prisma.expressionOfInterest.update({
            where: { id: result.interestId },
            data: {
              connectionFeePaid: true,
              revealed: true,
              revelationExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            },
          });

          // Create transaction record
          await prisma.transaction.create({
            data: {
              userId: result.userId,
              amount: 0, // Amount from session
              transactionType: 'connection_fee',
              description: `Connection fee for interest ${result.interestId}`,
              status: 'completed',
              processedAt: new Date(),
            },
          });

          console.log(`Connection fee paid for interest ${result.interestId}`);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const result = await handleSubscriptionUpdated(subscription);

        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: result.subscriptionId },
          data: {
            status: result.status as 'active' | 'canceled' | 'past_due' | 'unpaid',
            currentPeriodEnd: result.currentPeriodEnd,
            cancelAtPeriodEnd: result.cancelAtPeriodEnd,
          },
        });

        console.log(`Subscription ${result.subscriptionId} updated to ${result.status}`);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;

        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            status: 'canceled',
            canceledAt: new Date(),
          },
        });

        console.log(`Subscription ${subscription.id} canceled`);
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;
        const result = await handleInvoicePaid(invoice);

        // Create transaction record
        await prisma.transaction.create({
          data: {
            subscriptionId: result.subscriptionId || undefined,
            amount: result.amountPaid,
            currency: result.currency.toUpperCase(),
            transactionType: 'subscription',
            description: `Invoice ${result.invoiceId}`,
            stripeChargeId: result.invoiceId,
            status: 'completed',
            processedAt: new Date(),
          },
        });

        // Update subscription renewal count
        if (result.subscriptionId) {
          await prisma.subscription.updateMany({
            where: { stripeSubscriptionId: result.subscriptionId },
            data: {
              renewalCount: { increment: 1 },
            },
          });
        }

        console.log(`Invoice ${result.invoiceId} paid: $${result.amountPaid / 100}`);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const result = await handleInvoicePaymentFailed(invoice);

        // Update subscription status
        if (result.subscriptionId) {
          await prisma.subscription.updateMany({
            where: { stripeSubscriptionId: result.subscriptionId },
            data: {
              status: result.attemptCount >= 3 ? 'unpaid' : 'past_due',
            },
          });
        }

        // Create failed transaction record
        await prisma.transaction.create({
          data: {
            subscriptionId: result.subscriptionId || undefined,
            amount: 0,
            transactionType: 'subscription',
            description: `Failed payment for invoice ${result.invoiceId}`,
            stripeChargeId: result.invoiceId,
            status: 'failed',
            failureReason: 'Payment failed',
          },
        });

        console.log(`Invoice ${result.invoiceId} payment failed (attempt ${result.attemptCount})`);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
