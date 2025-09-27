import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { items, shippingInfo, total, isGuest, stripePaymentIntentId } = await request.json();
    
    let userId: string;
    
    if (isGuest) {
      // Create or get a guest user account
      const guestUser = await prisma.user.upsert({
        where: { email: shippingInfo.email },
        update: {
          name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
          phone: shippingInfo.phone,
        },
        create: {
          name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
          email: shippingInfo.email,
          phone: shippingInfo.phone,
          password: '', // Guest users don't have a password initially
          role: 'customer',
        },
      });
      userId = guestUser.id;
    } else {
      // Use authenticated user
      const session = await getServerSession(authOptions);
      if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      userId = session.user.id;
    }

    // Generate order number
    const orderNumber = `HES-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    // Create address
    const address = await prisma.address.create({
      data: {
        userId: userId,
        type: 'shipping',
        firstName: shippingInfo.firstName,
        lastName: shippingInfo.lastName,
        email: shippingInfo.email,
        phone: shippingInfo.phone,
        line1: shippingInfo.address,
        line2: shippingInfo.addressLine2 || null,
        city: shippingInfo.city,
        postalCode: shippingInfo.postalCode,
        country: shippingInfo.country,
        isDefault: false,
      },
    });

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: userId,
        orderNumber,
        status: stripePaymentIntentId ? 'confirmed' : 'pending',
        subtotal: total,
        tax: total * 0.09,
        shipping: 0, // Free shipping
        total: total * 1.09,
        shippingAddressId: address.id,
        billingAddressId: address.id,
        stripePaymentIntentId: stripePaymentIntentId || null,
      },
    });

    // Create order items
    console.log('Creating order items for order:', order.id);
    console.log('Items to create:', items);
    
    for (const item of items) {
      try {
        console.log('Creating item:', item);
        const orderItem = await prisma.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            variantId: item.variantId || null,
            quantity: item.quantity,
            price: item.price,
            total: item.price * item.quantity,
            configuration: item.configuration || null,
          },
        });
        console.log('Successfully created order item:', orderItem.id);
      } catch (itemError) {
        console.error('Error creating order item:', itemError);
        console.error('Item data:', item);
        // Continue with other items even if one fails
      }
    }

    return NextResponse.json({ 
      success: true, 
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        total: order.total,
      }
    });
  } catch (error) {
    console.error('Order creation error:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json({ 
      error: 'Failed to create order', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
        shippingAddress: true,
        billingAddress: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Orders fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}