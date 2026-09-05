// CartContext.tsx - Fix the isGuest logic
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Product, ProductVariant, Size, ProductSize } from '@/types/product';
import { Cart, CartItem } from '@/types/cart';
import * as cartAPI from '@/lib/cart';
import { useAuth } from '@/context/AuthContext';

interface CartContextType {
  cart: Cart;
  loading: boolean;
  addingProductId: string | null;
  isGuest: boolean;
  isClearingCart: boolean; // ✅ ADDED
  addToCart: (product: Product, quantity: number, selectedVariant?: ProductVariant, selectedSize?: Size | string) => Promise<void>;
  updateCartItem: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  setBuyNowMode?: (value: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

const initialCart: Cart = {
  _id: 'guest-cart',
  user: '',
  items: [],
  totalPrice: 0,
  totalItems: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<Cart>(initialCart);
  const [loading, setLoading] = useState(false);
  const [addingProductId, setAddingProductId] = useState<string | null>(null);
  const [isClearingCart, setIsClearingCart] = useState(false); // ✅ ADDED
  const { user, loading: authLoading } = useAuth();

  const isGuest = !user;

  console.log('🛒 CartProvider state:', { 
    user: user ? 'authenticated' : 'guest', 
    isGuest, 
    authLoading 
  });

  useEffect(() => {
    if (isGuest && !authLoading) {
      console.log('🛒 Loading guest cart on mount');
      loadGuestCart();
    }
  }, [isGuest, authLoading]);

  const loadGuestCart = () => {
    try {
      const savedCart = localStorage.getItem('guestCart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (!parsedCart.items) {
          parsedCart.items = [];
        }
        setCart(parsedCart);
        console.log('🛒 Loaded guest cart from localStorage:', parsedCart);
      } else {
        setCart(initialCart);
        console.log('🛒 No saved guest cart, using initial cart');
      }
    } catch (error) {
      console.error('Error loading guest cart:', error);
      setCart(initialCart);
    }
  };

  const saveGuestCart = (guestCart: Cart) => {
    try {
      localStorage.setItem('guestCart', JSON.stringify(guestCart));
      console.log('🛒 Saved guest cart to localStorage:', guestCart);
    } catch (error) {
      console.error('Error saving guest cart:', error);
    }
  };

  const refreshCart = useCallback(async () => {
    console.log('🔄 refreshCart called, isGuest:', isGuest, 'authLoading:', authLoading);
    
    if (authLoading) {
      console.log('🔄 Waiting for auth to finish loading');
      return;
    }

    try {
      if (!isGuest && user) {
        console.log('🔄 Fetching user cart via API');
        const cartData = await cartAPI.getCart();
        setCart(cartData);
        console.log('🛒 Loaded user cart from API:', cartData);
      } else {
        console.log('🔄 Loading guest cart (user is guest)');
        loadGuestCart();
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      if (isGuest) {
        console.log('🔄 Falling back to guest cart due to error');
        loadGuestCart();
      }
    }
  }, [isGuest, authLoading, user]);

  useEffect(() => {
    console.log('🔄 Auth state changed, refreshing cart');
    refreshCart();
  }, [user, authLoading, refreshCart]);

  const handleGuestAddToCart = (product: Product, quantity: number, selectedVariant?: ProductVariant, selectedSize?: Size | string): Cart => {
    console.log('🛒 handleGuestAddToCart called for product:', product._id, 'variant:', selectedVariant?.variantName, 'size:', selectedSize);
    
    const guestCart = { 
      ...cart,
      items: cart.items ? [...cart.items] : []
    };
    
    let price = product.basePrice;
    let selectedSizePrice: number | null = null;
    let variantSizes: ProductSize[] = [];
    
    if (selectedVariant) {
      price = selectedVariant.price;
      variantSizes = selectedVariant.sizes || [];
      
      if (selectedSize && variantSizes.length > 0) {
        const sizeData = variantSizes.find(s => s.size === selectedSize);
        if (sizeData && sizeData.price !== null) {
          selectedSizePrice = sizeData.price;
          price = sizeData.price;
        }
      }
    } else {
      if (selectedSize && product.sizes && product.sizes.length > 0) {
        const sizeData = product.sizes.find(s => s.size === selectedSize);
        if (sizeData && sizeData.price !== null) {
          selectedSizePrice = sizeData.price;
          price = sizeData.price;
        }
        variantSizes = product.sizes;
      }
    }
    
    const existingItemIndex = guestCart.items.findIndex(
      item => item && item.product && item.product._id === product._id && 
              item.selectedVariant?._id === selectedVariant?._id &&
              item.selectedSize === selectedSize
    );
    
    if (existingItemIndex > -1) {
      guestCart.items[existingItemIndex].quantity += quantity;
      guestCart.items[existingItemIndex].price = price;
      guestCart.items[existingItemIndex].selectedSize = selectedSize || '';
      guestCart.items[existingItemIndex].selectedSizePrice = selectedSizePrice;
      guestCart.items[existingItemIndex].variantSizes = variantSizes;
      guestCart.items[existingItemIndex].updatedAt = new Date().toISOString();
      console.log('🛒 Updated existing item with size');
    } else {
      const guestItemId = `guest-${product._id}-${selectedVariant?._id || 'base'}-${selectedSize || 'nosize'}-${Date.now()}`;
      
      const variantWithImages = selectedVariant ? {
        ...selectedVariant,
        images: selectedVariant.images || []
      } : undefined;
      
      const newItem: CartItem = {
        _id: guestItemId,
        product,
        selectedVariant: variantWithImages,
        quantity,
        price: price,
        selectedSize: selectedSize || '',
        selectedSizePrice: selectedSizePrice,
        variantSizes: variantSizes,
        variantId: selectedVariant?._id || '',
        variantName: selectedVariant?.variantName || '',
        variantImages: selectedVariant?.images?.map(img => img.image) || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      guestCart.items.push(newItem);
      console.log('🛒 Added new item with size:', selectedSize, 'price:', price);
    }
    
    guestCart.totalItems = guestCart.items.reduce((sum, item) => sum + item.quantity, 0);
    guestCart.totalPrice = guestCart.items.reduce((sum, item) => 
      sum + (item.price * item.quantity), 0);
    guestCart.updatedAt = new Date().toISOString();
    
    saveGuestCart(guestCart);
    
    return guestCart;
  };

  const handleGuestUpdateCartItem = (itemId: string, quantity: number): Cart => {
    const guestCart = { 
      ...cart,
      items: cart.items ? [...cart.items] : []
    };
    const itemIndex = guestCart.items.findIndex(item => item._id === itemId);
    
    if (itemIndex > -1) {
      if (quantity <= 0) {
        guestCart.items.splice(itemIndex, 1);
      } else {
        guestCart.items[itemIndex].quantity = quantity;
        guestCart.items[itemIndex].updatedAt = new Date().toISOString();
      }
      
      guestCart.totalItems = guestCart.items.reduce((sum, item) => sum + item.quantity, 0);
      guestCart.totalPrice = guestCart.items.reduce((sum, item) => 
        sum + (item.price * item.quantity), 0);
      guestCart.updatedAt = new Date().toISOString();
      
      saveGuestCart(guestCart);
    }
    
    return guestCart;
  };

  const handleGuestRemoveFromCart = (itemId: string): Cart => {
    const guestCart = { 
      ...cart,
      items: cart.items ? [...cart.items] : []
    };
    guestCart.items = guestCart.items.filter(item => item._id !== itemId);
    
    guestCart.totalItems = guestCart.items.reduce((sum, item) => sum + item.quantity, 0);
    guestCart.totalPrice = guestCart.items.reduce((sum, item) => 
      sum + (item.price * item.quantity), 0);
    guestCart.updatedAt = new Date().toISOString();
    
    saveGuestCart(guestCart);
    
    return guestCart;
  };

  const handleGuestClearCart = (): Cart => {
    const emptyCart = { ...initialCart };
    emptyCart.updatedAt = new Date().toISOString();
    saveGuestCart(emptyCart);
    return emptyCart;
  };

  const addToCart = async (product: Product, quantity: number, selectedVariant?: ProductVariant, selectedSize?: Size | string) => {
    console.log('🛒 addToCart called, isGuest:', isGuest, 'variant:', selectedVariant?.variantName, 'size:', selectedSize);
    console.log('🛒 Variant images:', selectedVariant?.images?.length || 0);
    
    try {
      setAddingProductId(product._id);
      setLoading(true);
      
      if (isGuest) {
        console.log('🛒 Using guest cart handler with size');
        const updatedCart = handleGuestAddToCart(product, quantity, selectedVariant, selectedSize);
        setCart(updatedCart);
      } else {
        console.log('🛒 Using API cart handler with size');
        const variantId = selectedVariant?._id || selectedVariant?.variantName;
        
        let price = product.basePrice;
        if (selectedVariant) {
          price = selectedVariant.price;
          if (selectedSize && selectedVariant.sizes) {
            const sizeData = selectedVariant.sizes.find(s => s.size === selectedSize);
            if (sizeData && sizeData.price !== null) {
              price = sizeData.price;
            }
          }
        } else if (selectedSize && product.sizes) {
          const sizeData = product.sizes.find(s => s.size === selectedSize);
          if (sizeData && sizeData.price !== null) {
            price = sizeData.price;
          }
        }
        
        const updatedCart = await cartAPI.addToCart({
          productId: product._id,
          variantId: variantId,
          quantity,
          selectedSize: selectedSize
        });
        
        if (updatedCart.items) {
          updatedCart.items = updatedCart.items.map(item => {
            if (item.product._id === product._id) {
              return {
                ...item,
                selectedVariant: selectedVariant ? {
                  ...selectedVariant,
                  images: selectedVariant.images || []
                } : item.selectedVariant,
                selectedSize: selectedSize || item.selectedSize,
                variantSizes: selectedVariant?.sizes || product.sizes || [],
                price: price
              };
            }
            return item;
          });
        }
        
        setCart(updatedCart);
      }
    } catch (error) {
      console.error('❌ Error in addToCart:', error);
      throw error;
    } finally {
      setLoading(false);
      setAddingProductId(null);
    }
  };

  const updateCartItem = async (itemId: string, quantity: number) => {
    try {
      setLoading(true);
      
      if (isGuest) {
        setCart(handleGuestUpdateCartItem(itemId, quantity));
      } else {
        await cartAPI.updateCartItem(itemId, { quantity });
        const updatedCart = await cartAPI.getCart();
        setCart(updatedCart);
      }
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      setLoading(true);
      
      if (isGuest) {
        setCart(handleGuestRemoveFromCart(itemId));
      } else {
        await cartAPI.removeFromCart(itemId);
        const updatedCart = await cartAPI.getCart();
        setCart(updatedCart);
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED: clearCart with isClearingCart flag
  const clearCart = async () => {
    try {
      setLoading(true);
      setIsClearingCart(true); // ✅ Set flag BEFORE clearing
      
      if (isGuest) {
        const updatedCart = handleGuestClearCart();
        setCart(updatedCart);
      } else {
        await cartAPI.clearCart();
        setCart(initialCart);
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    } finally {
      setLoading(false);
      // ✅ Clear flag AFTER state update with delay
      setTimeout(() => {
        setIsClearingCart(false);
      }, 300);
    }
  };

  const value: CartContextType = {
    cart,
    loading,
    addingProductId,
    isGuest,
    isClearingCart, // ✅ EXPOSED to prevent redirects
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refreshCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};