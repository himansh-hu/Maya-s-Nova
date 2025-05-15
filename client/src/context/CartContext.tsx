import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@shared/schema';

export interface CartItem {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  product?: Product;
  customizations?: any;
}

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  error: string | null;
  addItem: (productId: number, quantity: number, customizations?: any) => Promise<void>;
  updateItem: (id: number, quantity: number) => Promise<void>;
  removeItem: (id: number) => Promise<void>;
  clearCart: () => Promise<void>;
  itemCount: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  // Calculate derived values
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => {
    if (item.product) {
      const price = item.product.salePrice || item.product.price;
      return sum + (price * item.quantity);
    }
    return sum;
  }, 0);

  // Fetch cart whenever user changes
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchCart();
    } else {
      setItems([]);
    }
  }, [isAuthenticated, user]);

  const fetchCart = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiRequest('GET', `/api/cart/${user.id}`);
      const cartItems = await response.json();
      
      setItems(cartItems);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      setError('Failed to load your cart. Please try again.');
      
      toast({
        title: 'Cart Error',
        description: 'Failed to load your cart items.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (productId: number, quantity: number, customizations?: any) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to add items to your cart.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const payload = {
        userId: user.id,
        productId,
        quantity,
        customizations
      };
      
      const response = await apiRequest('POST', '/api/cart', payload);
      const updatedItem = await response.json();
      
      // Update local cart state
      fetchCart();
      
      toast({
        title: 'Item Added',
        description: 'Product has been added to your cart.',
      });
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      setError('Failed to add item to cart. Please try again.');
      
      toast({
        title: 'Cart Error',
        description: 'Failed to add item to your cart.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (id: number, quantity: number) => {
    try {
      setLoading(true);
      setError(null);
      
      await apiRequest('PUT', `/api/cart/${id}`, { quantity });
      
      // Update local cart state
      fetchCart();
      
      toast({
        title: 'Cart Updated',
        description: 'Your cart has been updated.',
      });
    } catch (error) {
      console.error('Failed to update cart item:', error);
      setError('Failed to update cart. Please try again.');
      
      toast({
        title: 'Cart Error',
        description: 'Failed to update your cart.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      
      await apiRequest('DELETE', `/api/cart/${id}`);
      
      // Update local cart state
      fetchCart();
      
      toast({
        title: 'Item Removed',
        description: 'Item has been removed from your cart.',
      });
    } catch (error) {
      console.error('Failed to remove cart item:', error);
      setError('Failed to remove item from cart. Please try again.');
      
      toast({
        title: 'Cart Error',
        description: 'Failed to remove item from your cart.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      await apiRequest('DELETE', `/api/cart/user/${user.id}`);
      
      // Update local cart state
      setItems([]);
      
      toast({
        title: 'Cart Cleared',
        description: 'Your cart has been cleared.',
      });
    } catch (error) {
      console.error('Failed to clear cart:', error);
      setError('Failed to clear cart. Please try again.');
      
      toast({
        title: 'Cart Error',
        description: 'Failed to clear your cart.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider value={{
      items,
      loading,
      error,
      addItem,
      updateItem,
      removeItem,
      clearCart,
      itemCount,
      subtotal
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
