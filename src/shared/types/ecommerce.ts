// Core Ecommerce Types
export interface Product {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  images: string[];
  category: string;
  inStock: boolean;
  variants?: ProductVariant[];
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  configuration: ProductConfiguration;
  quantity: number;
  price: number;
  totalPrice: number;
}

export interface ProductConfiguration {
  material: string;
  size: string;
  headboard: string;
  bedframeBody: string;
  finishColour: string;
  optional: string[];
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  itemCount: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  addresses: Address[];
}

export interface Address {
  id: string;
  type: 'billing' | 'shipping';
  name: string;
  line1: string;
  line2?: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  shippingAddress: Address;
  billingAddress: Address;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
