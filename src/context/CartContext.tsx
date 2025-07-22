import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import { API_CONFIG } from '../routes';
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
  const queryClient = useQueryClient();

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

  const addToCart = useCallback(async (product: Product, quantity: number = 1) => {
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

    setLoading(true);

    try {
      // Decrementar stock en el backend
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_CONFIG.BASE_URL}/products/${product.id}/stock`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ quantity: -quantity }) // Cantidad negativa para decrementar
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || 'Error al actualizar stock');
        return;
      }

      const { data: updatedProduct } = await response.json();

      setItems(currentItems => {
        const existingItem = currentItems.find(item => item.product.id === product.id);
        let newItems: CartItem[];

        if (existingItem) {
          // Update existing item
          const newQuantity = existingItem.quantity + quantity;

          newItems = currentItems.map(item =>
            item.product.id === product.id
              ? {
                  ...item,
                  quantity: newQuantity,
                  subtotal: newQuantity * product.price,
                  product: { ...item.product, stock: updatedProduct.stock } // Actualizar stock local
                }
              : item
          );
        } else {
          // Add new item
          const cartItem: CartItem = {
            id: `${product.id}_${Date.now()}`,
            product: { ...product, stock: updatedProduct.stock }, // Usar stock actualizado
            quantity,
            price: product.price,
            subtotal: quantity * product.price
          };
          newItems = [...currentItems, cartItem];
        }

        saveCartToStorage(newItems);
        return newItems;
      });

      // Invalidar query de productos para actualizar el stock en la UI
      queryClient.invalidateQueries({ queryKey: ['products'] });

      toast.success(`${product.name} agregado al carrito`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Error al agregar producto al carrito');
    } finally {
      setLoading(false);
    }
  }, [user, saveCartToStorage]);

  const updateQuantity = useCallback(async (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    const currentItem = items.find(item => item.id === cartItemId);
    if (!currentItem) return;

    const quantityDifference = quantity - currentItem.quantity;
    
    // Verificar que hay suficiente stock para el incremento
    if (quantityDifference > 0 && quantity > currentItem.product.stock) {
      toast.error('No hay suficiente stock disponible');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      // Actualizar stock en el backend
      const response = await fetch(`${API_CONFIG.BASE_URL}/products/${currentItem.product.id}/stock`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ quantity: -quantityDifference })
      });

      if (response.ok) {
        const updatedProduct = await response.json();
        
        setItems(currentItems => {
          const newItems = currentItems.map(item => {
            if (item.id === cartItemId) {
              return {
                ...item,
                quantity,
                subtotal: quantity * item.price,
                product: {
                  ...item.product,
                  stock: updatedProduct.stock
                }
              };
            }
            return item;
          });

          saveCartToStorage(newItems);
          
          // Invalidar query de productos para actualizar el stock en la UI
          queryClient.invalidateQueries({ queryKey: ['products'] });
          
          toast.success('Carrito actualizado');
          return newItems;
        });
      } else {
        toast.error('Error al actualizar el stock');
      }
    } catch (error) {
      console.error('Error updating stock:', error);
      toast.error('Error al actualizar el carrito');
    }
  }, [items, saveCartToStorage]);

  const removeFromCart = useCallback(async (cartItemId: string) => {
    const itemToRemove = items.find(item => item.id === cartItemId);
    if (!itemToRemove) return;

    setLoading(true);

    try {
      // Incrementar stock en el backend cuando se remueve del carrito
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_CONFIG.BASE_URL}/products/${itemToRemove.product.id}/stock`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ quantity: itemToRemove.quantity }) // Cantidad positiva para incrementar
      });

      if (!response.ok) {
        console.error('Error restoring stock');
        // Continuar con la eliminación del carrito aunque falle el stock
      }

      setItems(currentItems => {
        const newItems = currentItems.filter(item => item.id !== cartItemId);
        saveCartToStorage(newItems);
        return newItems;
      });

      // Invalidar query de productos para actualizar el stock en la UI
      queryClient.invalidateQueries({ queryKey: ['products'] });

      toast.success('Producto eliminado del carrito');
    } catch (error) {
      console.error('Error removing from cart:', error);
      // Continuar con la eliminación local
      setItems(currentItems => {
        const newItems = currentItems.filter(item => item.id !== cartItemId);
        saveCartToStorage(newItems);
        return newItems;
      });
      
      // Invalidar query de productos para actualizar el stock en la UI
      queryClient.invalidateQueries({ queryKey: ['products'] });
      
      toast.success('Producto eliminado del carrito');
    } finally {
      setLoading(false);
    }
  }, [items, saveCartToStorage]);

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
