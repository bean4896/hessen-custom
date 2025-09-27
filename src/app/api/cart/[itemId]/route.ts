import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const { itemId } = params
    const body = await request.json()
    const { quantity } = body
    
    if (!quantity || quantity < 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Valid quantity is required',
        },
        { status: 400 }
      )
    }

    const updatedItem = await DatabaseService.updateCartItem(itemId, quantity)
    
    return NextResponse.json({
      success: true,
      data: updatedItem,
    })
  } catch (error) {
    console.error('Error updating cart item:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update cart item',
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const { itemId } = params
    
    await DatabaseService.removeFromCart(itemId)
    
    return NextResponse.json({
      success: true,
      message: 'Item removed from cart',
    })
  } catch (error) {
    console.error('Error removing cart item:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to remove cart item',
      },
      { status: 500 }
    )
  }
}
