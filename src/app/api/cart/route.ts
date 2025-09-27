import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'User ID is required',
        },
        { status: 400 }
      )
    }

    const cartItems = await DatabaseService.getCartItems(userId)
    
    return NextResponse.json({
      success: true,
      data: cartItems,
    })
  } catch (error) {
    console.error('Error fetching cart:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch cart',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, productId, variantId, quantity, price } = body
    
    if (!userId || !productId || !quantity || !price) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
        },
        { status: 400 }
      )
    }

    const cartItem = await DatabaseService.addToCart({
      userId,
      productId,
      variantId,
      quantity,
      price,
    })
    
    return NextResponse.json({
      success: true,
      data: cartItem,
    })
  } catch (error) {
    console.error('Error adding to cart:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to add item to cart',
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const itemId = searchParams.get('itemId')
    
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'User ID is required',
        },
        { status: 400 }
      )
    }

    if (itemId) {
      // Remove specific item
      await DatabaseService.removeFromCart(itemId)
    } else {
      // Clear entire cart
      await DatabaseService.clearCart(userId)
    }
    
    return NextResponse.json({
      success: true,
      message: itemId ? 'Item removed from cart' : 'Cart cleared',
    })
  } catch (error) {
    console.error('Error updating cart:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update cart',
      },
      { status: 500 }
    )
  }
}
