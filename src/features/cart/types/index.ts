import { CartItem, Cart } from '../../../shared/types/ecommerce';

export interface CartContextType {
  cart: Cart;
  addItem: (item: Omit<CartItem, 'id' | 'totalPrice'>) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  isLoading: boolean;
}

export interface CartHookReturn {
  cart: Cart;
  addToCart: (configuration: any) => void;
  removeFromCart: (itemId: string) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  isLoading: boolean;
  error: string | null;
}
