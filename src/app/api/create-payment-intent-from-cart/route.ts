import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

export async function POST(request: NextRequest) {
  try {
    const { items, total } = await request.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart items are required' }, { status: 400 });
    }

    if (!total || total <= 0) {
      return NextResponse.json({ error: 'Total amount is required' }, { status: 400 });
    }

    // Calculate total amount in cents
    const totalAmountInCents = Math.round(total * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmountInCents,
      currency: process.env.NEXT_PUBLIC_CURRENCY || 'SGD',
      metadata: {
        cartItems: JSON.stringify(items),
        total: total.toString(),
      },
    });

    return NextResponse.json({ 
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id 
    }, { status: 200 });
  } catch (error) {
    console.error('Error creating payment intent from cart:', error);
    return NextResponse.json({ error: 'Failed to create payment intent' }, { status: 500 });
  }
}
