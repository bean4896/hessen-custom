import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, items, shippingInfo, isGuest } = body;

    if (!orderId || !items || !shippingInfo) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get the order from database
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
        shippingAddress: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // For authenticated users, verify order belongs to them
    const session = await getServerSession(authOptions);
    if (session?.user && (session.user as any).id && order.userId !== (session.user as any).id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Calculate total amount
    const subtotal = order.items.reduce((sum: number, item) => sum + (Number(item.price) * item.quantity), 0);
    const tax = subtotal * 0.09; // 9% GST
    const shipping = subtotal >= 500 ? 0 : 50;
    const total = subtotal + tax + shipping;

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        ...order.items.map(item => ({
          price_data: {
            currency: 'sgd',
            product_data: {
              name: item.product?.name || 'Custom Product',
              description: `Size: ${(item.configuration as any)?.size}, Material: ${(item.configuration as any)?.material}`,
              images: item.variant?.image ? [item.variant.image] : [],
            },
            unit_amount: Math.round(Number(item.price) * 100), // Convert to cents
          },
          quantity: item.quantity,
        })),
        // Add tax line item
        {
          price_data: {
            currency: 'sgd',
            product_data: {
              name: 'Tax (7%)',
            },
            unit_amount: Math.round(tax * 100),
          },
          quantity: 1,
        },
        // Add shipping line item if applicable
        ...(shipping > 0 ? [{
          price_data: {
            currency: 'sgd',
            product_data: {
              name: 'Shipping',
            },
            unit_amount: Math.round(shipping * 100),
          },
          quantity: 1,
        }] : []),
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout`,
      customer_email: shippingInfo.email,
      shipping_address_collection: {
        allowed_countries: ['SG', 'MY', 'TH', 'ID', 'PH', 'VN'],
      },
      metadata: {
        orderId: order.id,
        userId: order.userId,
        isGuest: isGuest ? 'true' : 'false',
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}