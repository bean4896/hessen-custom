import { prisma } from './prisma'

// Database utility functions
export class DatabaseService {
  // User operations
  static async createUser(data: {
    email: string
    name: string
    phone?: string
  }) {
    return prisma.user.create({
      data,
    })
  }

  static async getUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        addresses: true,
        cartItems: {
          include: {
            product: true,
            variant: true,
          },
        },
        orders: {
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
        },
      },
    })
  }

  static async getUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    })
  }

  // Product operations
  static async getProducts() {
    return prisma.product.findMany({
      where: { isActive: true },
      include: {
        variants: {
          where: { isActive: true },
        },
      },
    })
  }

  static async getProductById(id: string) {
    return prisma.product.findUnique({
      where: { id },
      include: {
        variants: {
          where: { isActive: true },
        },
      },
    })
  }

  // Cart operations
  static async getCartItems(userId: string) {
    return prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: true,
        variant: true,
      },
    })
  }

  static async addToCart(data: {
    userId: string
    productId: string
    variantId?: string
    quantity: number
    price: number
  }) {
    return prisma.cartItem.create({
      data,
      include: {
        product: true,
        variant: true,
      },
    })
  }

  static async updateCartItem(id: string, quantity: number) {
    return prisma.cartItem.update({
      where: { id },
      data: { quantity },
      include: {
        product: true,
        variant: true,
      },
    })
  }

  static async removeFromCart(id: string) {
    return prisma.cartItem.delete({
      where: { id },
    })
  }

  static async clearCart(userId: string) {
    return prisma.cartItem.deleteMany({
      where: { userId },
    })
  }

  // Order operations
  static async createOrder(data: {
    userId: string
    orderNumber: string
    subtotal: number
    tax: number
    shipping: number
    total: number
    shippingAddressId: string
    billingAddressId: string
    items: Array<{
      productId: string
      variantId?: string
      quantity: number
      price: number
      total: number
    }>
  }) {
    return prisma.order.create({
      data: {
        userId: data.userId,
        orderNumber: data.orderNumber,
        subtotal: data.subtotal,
        tax: data.tax,
        shipping: data.shipping,
        total: data.total,
        shippingAddressId: data.shippingAddressId,
        billingAddressId: data.billingAddressId,
        items: {
          create: data.items,
        },
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
    })
  }

  static async getOrders(userId: string) {
    return prisma.order.findMany({
      where: { userId },
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
      orderBy: { createdAt: 'desc' },
    })
  }

  static async getOrderById(id: string) {
    return prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
        shippingAddress: true,
        billingAddress: true,
        user: true,
      },
    })
  }

  // Address operations
  static async createAddress(data: {
    userId: string
    type: 'billing' | 'shipping'
    name: string
    line1: string
    line2?: string
    city: string
    postalCode: string
    country?: string
    isDefault?: boolean
  }) {
    return prisma.address.create({
      data,
    })
  }

  static async getAddresses(userId: string) {
    return prisma.address.findMany({
      where: { userId },
      orderBy: { isDefault: 'desc' },
    })
  }

  static async updateAddress(id: string, data: any) {
    return prisma.address.update({
      where: { id },
      data,
    })
  }

  static async deleteAddress(id: string) {
    return prisma.address.delete({
      where: { id },
    })
  }
}

export { prisma }
