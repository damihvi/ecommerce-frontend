import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

// Types
interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  stock: number;
}

interface CartItem {
  id: string;
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
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  refreshCart: () => void;
}

// Context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider Props
interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // Load cart from localStorage
  const loadCartFromStorage = useCallback(() => {
    if (!user) return;
    
    try {
      const cartKey = `cart_${user.id}`;
      const storedCart = localStorage.getItem(cartKey);
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        setItems(parsedCart);
      } else {
        setItems([]);
      }
    } catch (error) {
      console.error('Error loading cart from storage:', error);
      setItems([]);
    }
  }, [user]);

  // Save cart to localStorage
  const saveCartToStorage = useCallback((cartItems: CartItem[]) => {
    if (!user) return;
    
    try {
      const cartKey = `cart_${user.id}`;
      localStorage.setItem(cartKey, JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart to storage:', error);
    }
  }, [user]);

  const refreshCart = useCallback(() => {
    loadCartFromStorage();
  }, [loadCartFromStorage]);

  // Load cart when user logs in
  useEffect(() => {
    if (isAuthenticated && user) {
      loadCartFromStorage();
    } else {
      setItems([]);
    }
  }, [isAuthenticated, user, loadCartFromStorage]);

  const addToCart = useCallback((product: Product, quantity: number = 1) => {
    if (!user) {
      toast.error('Por favor inicia sesión para agregar productos al carrito');
      return;
    }

    if (quantity <= 0) {
      toast.error('La cantidad debe ser mayor a 0');
      return;
    }

    if (quantity > product.stock) {
      toast.error('No hay suficiente stock disponible');
      return;
    }

    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.product.id === product.id);
      let newItems: CartItem[];

      if (existingItem) {
        // Update existing item
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > product.stock) {
          toast.error('No hay suficiente stock disponible');
          return currentItems;
        }

        newItems = currentItems.map(item =>
          item.product.id === product.id
            ? {
                ...item,
                quantity: newQuantity,
                subtotal: newQuantity * product.price
              }
            : item
        );
      } else {
        // Add new item
        const cartItem: CartItem = {
          id: `${product.id}_${Date.now()}`,
          product,
          quantity,
          price: product.price,
          subtotal: quantity * product.price
        };
        newItems = [...currentItems, cartItem];
      }

      saveCartToStorage(newItems);
      toast.success('Producto agregado al carrito');
      return newItems;
    });
  }, [user, saveCartToStorage]);

  const updateQuantity = useCallback((cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    setItems(currentItems => {
      const newItems = currentItems.map(item => {
        if (item.id === cartItemId) {
          if (quantity > item.product.stock) {
            toast.error('No hay suficiente stock disponible');
            return item;
          }
          return {
            ...item,
            quantity,
            subtotal: quantity * item.price
          };
        }
        return item;
      });

      saveCartToStorage(newItems);
      toast.success('Carrito actualizado');
      return newItems;
    });
  }, [saveCartToStorage]);

  const removeFromCart = useCallback((cartItemId: string) => {
    setItems(currentItems => {
      const newItems = currentItems.filter(item => item.id !== cartItemId);
      saveCartToStorage(newItems);
      toast.success('Producto eliminado del carrito');
      return newItems;
    });
  }, [saveCartToStorage]);

  const clearCart = useCallback(() => {
    setItems([]);
    if (user) {
      const cartKey = `cart_${user.id}`;
      localStorage.removeItem(cartKey);
    }
    toast.success('Carrito vaciado');
  }, [user]);

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
