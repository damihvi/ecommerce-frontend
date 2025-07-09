import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { apiClient } from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

// Types
interface Product {
  id: number;
  title: string;
  price: number;
  imageUrl?: string;
  stock: number;
}

interface CartItem {
  id: number;
  product: Product;
  quantity: number;
  price: number;
  subtotal: number;
}

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  totalItems: number;
  totalPrice: number;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  removeFromCart: (cartItemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

// Context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider
interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const refreshCart = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      const response = await apiClient.get(`/cart/user/${user.id}`);
      setItems(response.data.items || []);
    } catch (error) {
      console.error('Error loading cart:', error);
      toast.error('Error loading cart');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Load cart when user logs in
  useEffect(() => {
    if (isAuthenticated && user) {
      refreshCart();
    } else {
      setItems([]);
    }
  }, [isAuthenticated, user, refreshCart]);

  const addToCart = async (productId: number, quantity: number = 1) => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      await apiClient.post('/cart/add', {
        userId: user.id,
        productId,
        quantity,
      });
      
      await refreshCart();
      toast.success('Item added to cart');
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      toast.error(error.response?.data?.message || 'Error adding to cart');
    }
  };

  const updateQuantity = async (cartItemId: number, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(cartItemId);
      return;
    }

    try {
      await apiClient.put(`/cart/item/${cartItemId}`, { quantity });
      await refreshCart();
      toast.success('Cart updated');
    } catch (error: any) {
      console.error('Error updating cart:', error);
      toast.error(error.response?.data?.message || 'Error updating cart');
    }
  };

  const removeFromCart = async (cartItemId: number) => {
    try {
      await apiClient.delete(`/cart/item/${cartItemId}`);
      await refreshCart();
      toast.success('Item removed from cart');
    } catch (error: any) {
      console.error('Error removing from cart:', error);
      toast.error(error.response?.data?.message || 'Error removing from cart');
    }
  };

  const clearCart = async () => {
    if (!user) return;

    try {
      await apiClient.delete(`/cart/user/${user.id}/clear`);
      setItems([]);
      toast.success('Cart cleared');
    } catch (error: any) {
      console.error('Error clearing cart:', error);
      toast.error(error.response?.data?.message || 'Error clearing cart');
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.subtotal, 0);

  const value = {
    items,
    loading,
    totalItems,
    totalPrice,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Hook
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
