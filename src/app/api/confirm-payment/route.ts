import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

export async function POST(request: NextRequest) {
  try {
    const { paymentIntentId, orderId } = await request.json();

    if (!paymentIntentId || !orderId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      const order = await prisma.order.update({
        where: { id: orderId },
        data: {
          status: 'paid',
          paymentStatus: 'completed',
          stripePaymentIntentId: paymentIntent.id,
          paidAt: new Date(),
        },
      });
      return NextResponse.json({ order, message: 'Payment confirmed and order updated' }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Payment not succeeded', status: paymentIntent.status }, { status: 400 });
    }
  } catch (error) {
    console.error('Error confirming payment:', error);
    return NextResponse.json({ error: 'Failed to confirm payment' }, { status: 500 });
  }
}
