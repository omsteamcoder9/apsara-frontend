// components/CartDrawer.tsx
'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import { useState, useEffect } from 'react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

// Helper function to safely get product name
const getProductName = (product: any): string => {
  if (typeof product === 'object' && product !== null) {
    return product.name || 'Unnamed Product';
  }
  return 'Product';
};

// Helper function to safely get product image
const getProductImage = (item: any): string | null => {
  const baseUrl = process.env.NEXT_PUBLIC_IMG_URL;
  
  const formatImageUrl = (imagePath: string): string => {
    if (!imagePath) return '';
    
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    let cleanPath = imagePath;
    
    if (cleanPath.startsWith('/')) {
      cleanPath = cleanPath.slice(1);
    }
    
    if (cleanPath.startsWith('uploads/')) {
      cleanPath = cleanPath.slice(8);
    }
    
    const fullUrl = `${baseUrl}/${cleanPath}`;
    return fullUrl;
  };
  
  let imageUrl = null;
  
  if (item.variantImages && item.variantImages.length > 0) {
    const firstImage = item.variantImages[0];
    if (firstImage) {
      imageUrl = formatImageUrl(firstImage);
    }
  }
  
  if (!imageUrl && item.selectedVariant?.images && item.selectedVariant.images.length > 0) {
    const firstVariantImage = item.selectedVariant.images[0];
    if (firstVariantImage.image) {
      imageUrl = formatImageUrl(firstVariantImage.image);
    }
  }
  
  if (!imageUrl && item.product?.images && item.product.images.length > 0) {
    const firstImage = item.product.images[0];
    if (firstImage.image) {
      imageUrl = formatImageUrl(firstImage.image);
    }
  }
  
  if (!imageUrl && item.product?.ogImage) {
    imageUrl = formatImageUrl(item.product.ogImage);
  }
  
  return imageUrl;
};

// Helper function to get max stock from variant or product
const getItemMaxStock = (item: any): number => {
  if (item.selectedVariant?.stock !== undefined) {
    return item.selectedVariant.stock;
  }
  if (item.product?.stock !== undefined) {
    return item.product.stock;
  }
  return 999;
};

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, updateCartItem, removeFromCart, clearCart, isGuest } = useCart();
  const router = useRouter();
  const [removingItems, setRemovingItems] = useState<string[]>([]);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [isClearingCart, setIsClearingCart] = useState(false);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleCheckout = () => {
    onClose();
    
    if (cart.items && cart.items.length > 0) {
      const checkoutData = {
        items: cart.items,
        totalPrice: cart.totalPrice,
        totalItems: cart.totalItems,
        timestamp: Date.now()
      };
      sessionStorage.setItem('checkoutCart', JSON.stringify(checkoutData));
    }
    
    router.push('/checkout');
  };

  const handleRemoveItem = async (itemId: string) => {
    setRemovingItems(prev => [...prev, itemId]);
    try {
      await removeFromCart(itemId);
    } finally {
      setRemovingItems(prev => prev.filter(id => id !== itemId));
    }
  };

  const handleClearCart = async () => {
    setIsClearingCart(true);
    try {
      await clearCart();
    } catch (error) {
      console.error('❌ Error clearing cart:', error);
    } finally {
      setIsClearingCart(false);
    }
  };

  const itemCount = cart.totalItems || 0;
  const subtotal = cart.totalPrice || 0;
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div className={`
        fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white shadow-2xl z-50 
        transform transition-transform duration-300 ease-in-out
        flex flex-col
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        {/* Header - Fixed at top */}
        <div className="flex-shrink-0">
          <div className="flex items-center justify-between p-4 sm:p-5 border-b border-stone-200 bg-white">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-stone-900">
                Your Cart
                <span className="ml-2 text-sm font-normal text-stone-500">({itemCount})</span>
              </h2>
            </div>
            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-xl transition-all duration-200 group"
              aria-label="Close cart"
            >
              <svg 
                className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Guest Warning */}
          {isGuest && (
            <div className="bg-orange-50 border-b border-orange-200 text-orange-700 px-4 py-2 text-xs">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>
                  Shopping as Guest •{' '}
                  <Link href="/signup" className="font-semibold text-orange-600 hover:text-orange-700 underline transition-colors">
                    Sign up to save your cart
                  </Link>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Cart Items - No scroll, shows all items naturally */}
        <div className="flex-1 overflow-y-auto min-h-0 bg-stone-50/30">
          <div className="p-3 sm:p-4">
            {!cart.items || cart.items.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-12 h-12 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <p className="text-stone-500 mb-2">Your cart is empty</p>
                <p className="text-sm text-stone-400 mb-4">Start adding some amazing products!</p>
                <button
                  onClick={onClose}
                  className="text-orange-600 hover:text-orange-700 font-medium transition-colors inline-flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.items.map((item) => {
                  const imageUrl = getProductImage(item);
                  const productName = getProductName(item.product);
                  const maxStock = getItemMaxStock(item);
                  const isRemoving = removingItems.includes(item._id);
                  const hasImageError = imageErrors[item._id];
                  
                  const selectedSize = item.selectedSize || '';
                  const hasSize = selectedSize !== '';
                  const sizePrice = item.selectedSizePrice;
                  const isSizePriceDifferent = sizePrice !== null && sizePrice !== item.price;
                  
                  return (
                    <div key={item._id} className="bg-white rounded-xl shadow-sm border border-stone-100 p-3 transition-all hover:shadow-md hover:border-orange-200">
                      <div className="flex gap-3">
                        {/* Product Image */}
                        <div className="w-16 h-16 bg-gradient-to-br from-stone-50 to-stone-100 rounded-xl flex-shrink-0 overflow-hidden relative border border-stone-200">
                          {imageUrl && !hasImageError ? (
                            <Image
                              src={imageUrl}
                              alt={productName}
                              fill
                              sizes="64px"
                              className="object-contain p-1"
                              onError={() => {
                                setImageErrors(prev => ({ ...prev, [item._id]: true }));
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <svg className="w-8 h-8 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        
                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-1">
                            <h3 className="font-medium text-sm text-stone-900 line-clamp-2 flex-1">
                              {productName}
                            </h3>
                            <button
                              onClick={() => handleRemoveItem(item._id)}
                              disabled={isRemoving}
                              className="text-stone-300 hover:text-red-500 hover:bg-red-50 disabled:opacity-50 -mt-1 -mr-1 p-1.5 rounded-lg transition-all duration-200"
                              aria-label="Remove item"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                          
                          {item.selectedVariant && (
                            <p className="text-orange-600 text-xs font-medium mt-0.5">
                              {item.selectedVariant.variantName}
                            </p>
                          )}
                          
                          {hasSize && (
                            <p className="text-blue-600 text-xs font-medium mt-0.5">
                              Size: {selectedSize}
                            </p>
                          )}
                          
                          {isSizePriceDifferent && (
                            <p className="text-emerald-600 text-xs">
                              Size Price: ₹{sizePrice}
                            </p>
                          )}
                          
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-stone-900 text-sm font-semibold">₹{item.price || 0}</p>
                            
                            <div className="flex items-center border border-stone-200 rounded-lg bg-stone-50">
                              <button 
                                onClick={() => updateCartItem(item._id, item.quantity - 1)}
                                disabled={item.quantity <= 1 || isRemoving}
                                className="w-7 h-7 flex items-center justify-center text-stone-400 hover:text-orange-600 hover:bg-orange-50 rounded-l-lg transition-colors disabled:opacity-30 text-sm font-medium"
                              >
                                −
                              </button>
                              <span className="w-7 text-center text-sm font-medium text-stone-700">{item.quantity}</span>
                              <button 
                                onClick={() => updateCartItem(item._id, item.quantity + 1)}
                                disabled={item.quantity >= maxStock || isRemoving}
                                className="w-7 h-7 flex items-center justify-center text-stone-400 hover:text-orange-600 hover:bg-orange-50 rounded-r-lg transition-colors disabled:opacity-30 text-sm font-medium"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {cart.items.length > 0 && (
                  <div className="text-right pt-1">
                    <button
                      onClick={handleClearCart}
                      disabled={isClearingCart}
                      className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors disabled:opacity-50 inline-flex items-center gap-1"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      {isClearingCart ? 'Clearing...' : 'Clear Cart'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer with totals and actions */}
        {cart.items && cart.items.length > 0 && (
          <div className="flex-shrink-0 border-t border-stone-200 bg-white p-4 shadow-lg">
            <div className="space-y-1.5 mb-3">
              <div className="flex justify-between text-sm">
                <span className="text-stone-500">Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
                <span className="text-stone-900 font-medium">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stone-500">Shipping</span>
                <span className="text-emerald-600 font-medium">FREE</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stone-500">Tax (5%)</span>
                <span className="text-stone-900">₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-bold pt-2 border-t border-stone-200 mt-2">
                <span className="text-stone-900">Total</span>
                <span className="text-orange-600">₹{total.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <button
                onClick={handleCheckout}
                className="w-full py-3 rounded-xl font-medium text-sm transition-all duration-200 bg-orange-500 text-white hover:bg-orange-600 shadow-lg hover:shadow-orange-500/30 transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                Proceed to Checkout
              </button>
              
              <button
                onClick={onClose}
                className="w-full py-2.5 text-sm text-stone-500 hover:text-stone-700 hover:bg-stone-50 rounded-xl transition-all duration-200 cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}