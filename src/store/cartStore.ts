import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  name: string;
  image: string;
  configuration?: {
    material: string;
    size: string;
    headboard: string;
    bedframeBody: string;
    finishColour: string;
    optional: string[];
  };
}

interface CartStore {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  
  // Actions
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateItemQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  
  // Computed values
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,

      addItem: (newItem: Omit<CartItem, 'id'>) => {
        const itemId = `${newItem.productId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const cartItem: CartItem = { ...newItem, id: itemId };

        set((state) => {
          // Check if item already exists with same configuration
          const existingItemIndex = state.items.findIndex(
            item =>
              item.productId === cartItem.productId &&
              JSON.stringify(item.configuration) === JSON.stringify(cartItem.configuration)
          );

          let updatedItems: CartItem[];
          if (existingItemIndex >= 0) {
            // Update quantity of existing item
            updatedItems = [...state.items];
            updatedItems[existingItemIndex].quantity += cartItem.quantity;
          } else {
            // Add new item
            updatedItems = [...state.items, cartItem];
          }

          // Calculate totals
          const totalItems = updatedItems.reduce((total: number, item) => total + item.quantity, 0);
          const totalPrice = updatedItems.reduce((total: number, item) => total + (item.price * item.quantity), 0);

          return {
            items: updatedItems,
            totalItems,
            totalPrice,
          };
        });
      },

      removeItem: (id: string) => {
        set((state) => {
          const updatedItems = state.items.filter(item => item.id !== id);
          const totalItems = updatedItems.reduce((total: number, item) => total + item.quantity, 0);
          const totalPrice = updatedItems.reduce((total: number, item) => total + (item.price * item.quantity), 0);

          return {
            items: updatedItems,
            totalItems,
            totalPrice,
          };
        });
      },

      updateItemQuantity: (id: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        set((state) => {
          const updatedItems = state.items.map(item =>
            item.id === id ? { ...item, quantity } : item
          );
          const totalItems = updatedItems.reduce((total: number, item) => total + item.quantity, 0);
          const totalPrice = updatedItems.reduce((total: number, item) => total + (item.price * item.quantity), 0);

          return {
            items: updatedItems,
            totalItems,
            totalPrice,
          };
        });
      },

      clearCart: () => {
        set({
          items: [],
          totalItems: 0,
          totalPrice: 0,
        });
      },

      getTotalItems: () => {
        return get().items.reduce((total: number, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total: number, item) => total + (item.price * item.quantity), 0);
      },
    }),
    {
      name: 'hessen-cart-storage',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
