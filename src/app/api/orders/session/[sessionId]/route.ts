import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { sessionId } = params;
    console.log('API called with sessionId:', sessionId);
    
    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    // Find order by stripePaymentIntentId with minimal includes
    const order = await prisma.order.findUnique({
      where: {
        stripePaymentIntentId: sessionId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        shippingAddress: true,
        items: true, // Simplified - just get items without relationships for now
      },
    });

    if (!order) {
      console.log('Order not found for sessionId:', sessionId);
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    console.log('Order found:', order.id, order.orderNumber);
    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order by session:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      sessionId,
    });
    return NextResponse.json(
      { 
        error: 'Failed to fetch order details',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}