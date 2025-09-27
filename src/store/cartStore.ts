import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '@/shared/types/ecommerce';

// Using CartItem from shared types - extending it for store-specific needs
interface StoreCartItem extends CartItem {
  name: string;
  image: string;
}

interface CartStore {
  items: StoreCartItem[];
  totalItems: number;
  totalPrice: number;
  
  // Actions
  addItem: (item: Omit<StoreCartItem, 'id'>) => void;
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

      addItem: (newItem: Omit<StoreCartItem, 'id'>) => {
        const itemId = `${newItem.productId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const cartItem: StoreCartItem = { ...newItem, id: itemId };

        set((state) => {
          // Check if item already exists with same configuration
          const existingItemIndex = state.items.findIndex(
            item =>
              item.productId === cartItem.productId &&
              JSON.stringify(item.configuration) === JSON.stringify(cartItem.configuration)
          );

          let updatedItems: StoreCartItem[];
          if (existingItemIndex >= 0) {
            // Update quantity of existing item
            updatedItems = [...state.items];
            updatedItems[existingItemIndex].quantity += cartItem.quantity;
          } else {
            // Add new item
            updatedItems = [...state.items, cartItem];
          }

          // Calculate totals
          const totalItems = updatedItems.reduce((total: number, item: StoreCartItem) => total + item.quantity, 0);
          const totalPrice = updatedItems.reduce((total: number, item: StoreCartItem) => total + (item.price * item.quantity), 0);

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
          const totalItems = updatedItems.reduce((total: number, item: StoreCartItem) => total + item.quantity, 0);
          const totalPrice = updatedItems.reduce((total: number, item: StoreCartItem) => total + (item.price * item.quantity), 0);

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
          const totalItems = updatedItems.reduce((total: number, item: StoreCartItem) => total + item.quantity, 0);
          const totalPrice = updatedItems.reduce((total: number, item: StoreCartItem) => total + (item.price * item.quantity), 0);

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
        return get().items.reduce((total: number, item: StoreCartItem) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total: number, item: StoreCartItem) => total + (item.price * item.quantity), 0);
      },
    }),
    {
      name: 'hessen-cart-storage',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
