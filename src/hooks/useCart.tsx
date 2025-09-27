'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem } from '@/shared/types/ecommerce';

// Using CartItem from shared types - extending it for hook-specific needs
interface HookCartItem extends CartItem {
  name: string;
  image: string;
}

interface CartContextType {
  items: HookCartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (item: Omit<HookCartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateItemQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<HookCartItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('hessen_cart');
    if (savedCart) {
      try {
        const cartItems = JSON.parse(savedCart);
        setItems(cartItems);
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Update totals whenever items change
  useEffect(() => {
    const newTotalItems = items.reduce((total: number, item: HookCartItem) => total + item.quantity, 0);
    const newTotalPrice = items.reduce((total: number, item: HookCartItem) => total + (item.price * item.quantity), 0);
    
    setTotalItems(newTotalItems);
    setTotalPrice(newTotalPrice);
    
    // Save to localStorage
    localStorage.setItem('hessen_cart', JSON.stringify(items));
  }, [items]);

  const addItem = (newItem: Omit<HookCartItem, 'id'>) => {
    const itemId = `${newItem.productId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const cartItem: HookCartItem = { ...newItem, id: itemId };

    setItems(prevItems => {
      // Check if item already exists with same configuration
      const existingItemIndex = prevItems.findIndex(
        item =>
          item.productId === cartItem.productId &&
          JSON.stringify(item.configuration) === JSON.stringify(cartItem.configuration)
      );

      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += cartItem.quantity;
        return updatedItems;
      } else {
        // Add new item
        return [...prevItems, cartItem];
      }
    });
  };

  const removeItem = (id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const updateItemQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalItems = () => {
    return items.reduce((total: number, item: HookCartItem) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total: number, item: HookCartItem) => total + (item.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        totalPrice,
        addItem,
        removeItem,
        updateItemQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
