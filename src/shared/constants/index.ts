// Ecommerce Configuration Constants
export const ECOMMERCE_CONFIG = {
  CURRENCY: 'SGD',
  CURRENCY_SYMBOL: '$',
  TAX_RATE: 0.07, // 7% GST for Singapore
  SHIPPING_FREE_THRESHOLD: 500,
  SHIPPING_COST: 50,
} as const;

// Product Configuration
export const PRODUCT_CONFIG = {
  BASE_PRICE: 1299,
  CLOUDINARY: {
    cloudName: 'dxpnm8bat',
    baseUrl: 'https://res.cloudinary.com/dxpnm8bat/image/upload',
    folder: 'bedframes',
    transformations: 'f_auto,q_auto'
  }
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  PRODUCTS: '/api/products',
  CART: '/api/cart',
  CHECKOUT: '/api/checkout',
  ORDERS: '/api/orders',
  USERS: '/api/users',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  CART: 'hessen_cart',
  USER_PREFERENCES: 'hessen_user_preferences',
  RECENT_CONFIGURATIONS: 'hessen_recent_configs',
} as const;
