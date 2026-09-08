// components/CartDrawer.tsx
'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GiButterfly } from 'react-icons/gi';
import { ShoppingBag, X, Trash2, ArrowRight, ShieldCheck } from 'lucide-react';

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

  // Listen for custom coordinate events for the butterfly flying animation
  useEffect(() => {
    const handleGetCoords = (e: Event) => {
      const drawerTarget = document.getElementById('cart-drawer-icon-target');
      if (drawerTarget) {
        const rect = drawerTarget.getBoundingClientRect();
        const coords = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
        window.dispatchEvent(new CustomEvent('cartCoordsResponse', { detail: coords }));
      }
    };
    window.addEventListener('getCartCoords', handleGetCoords);
    return () => window.removeEventListener('getCartCoords', handleGetCoords);
  }, []);

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
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="fixed inset-0 bg-[#0F172A]/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Drawer Panel with Hardware-Accelerated Smooth Easing */}
          <motion.div 
            initial={{ x: '100%', borderRadius: '60px 0 0 60px' }}
            animate={{ x: 0, borderRadius: '32px 0 0 32px' }}
            exit={{ x: '100%', borderRadius: '60px 0 0 60px' }}
            transition={{ 
              duration: 0.42, 
              ease: [0.16, 1, 0.3, 1] // Custom butter-smooth ease-out curve
            }}
            style={{ willChange: 'transform, border-radius' }}
            className="
              fixed top-0 right-0 h-full w-full sm:w-[440px] 
              bg-[#FBF7F1] border-l border-y border-[#D4AF37]/30 
              shadow-[-18px_0_55px_rgba(0,0,0,0.14)] z-50 
              flex flex-col overflow-hidden
            "
          >
            {/* Header */}
            <div className="flex-shrink-0">
              <div className="flex items-center justify-between p-5 border-b border-[#D4AF37]/20 bg-[#FBF7F1]/90 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div 
                    id="cart-drawer-icon-target"
                    className="w-10 h-10 gold-gradient rounded-2xl flex items-center justify-center text-white shadow-md shadow-[#D4AF37]/20"
                  >
                    <GiButterfly size={20} className="animate-pulse" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-[#0F172A] tracking-tight flex items-center gap-2">
                      Your Cart
                    </h2>
                    <p className="text-xs text-[#64748B]">{itemCount} {itemCount === 1 ? 'item' : 'items'} selected</p>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="w-9 h-9 flex items-center justify-center text-[#64748B] hover:text-[#0F172A] hover:bg-white/80 border border-transparent hover:border-[#D4AF37]/30 rounded-xl transition-all duration-200 group cursor-pointer"
                  aria-label="Close cart"
                >
                  <X className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
                </button>
              </div>

              {/* Guest Warning */}
              {isGuest && (
                <div className="bg-[#D4AF37]/10 border-b border-[#D4AF37]/20 text-[#0F172A] px-5 py-2.5 text-xs">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#B8860B] shrink-0" />
                    <span>
                      Shopping as Guest •{' '}
                      <Link href="/signup" className="font-bold text-[#B8860B] hover:underline transition-colors">
                        Sign up to save items
                      </Link>
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Cart Items Area */}
            <div className="flex-1 overflow-y-auto min-h-0 bg-transparent">
              <div className="p-4 sm:p-5">
                {!cart.items || cart.items.length === 0 ? (
                  <div className="text-center py-16 px-4">
                    <div className="w-20 h-20 bg-white rounded-3xl border border-[#D4AF37]/30 flex items-center justify-center mx-auto mb-4 shadow-sm text-[#D4AF37]">
                      <ShoppingBag className="w-8 h-8 opacity-60" />
                    </div>
                    <p className="font-bold text-[#0F172A] text-base mb-1">Your cart is empty</p>
                    <p className="text-xs text-[#64748B] mb-6">Explore our exclusive collections and add elegance to your cart.</p>
                    <button
                      onClick={onClose}
                      className="py-2.5 px-6 rounded-xl gold-gradient text-white text-xs font-semibold shadow-md shadow-[#D4AF37]/20 transition-all hover:-translate-y-0.5 cursor-pointer"
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3.5">
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
                        <div 
                          key={item._id} 
                          className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#D4AF37]/20 p-3.5 transition-all duration-300 hover:shadow-[0_8px_25px_rgba(212,175,55,0.12)] hover:border-[#D4AF37]/40"
                        >
                          <div className="flex gap-3.5">
                            {/* Product Image */}
                            <div className="w-18 h-18 bg-[#FBF7F1] rounded-xl flex-shrink-0 overflow-hidden relative border border-[#D4AF37]/20 p-1 flex items-center justify-center">
                              {imageUrl && !hasImageError ? (
                                <Image
                                  src={imageUrl}
                                  alt={productName}
                                  fill
                                  sizes="72px"
                                  className="object-contain p-1"
                                  onError={() => {
                                    setImageErrors(prev => ({ ...prev, [item._id]: true }));
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[#D4AF37]/40">
                                  <ShoppingBag className="w-6 h-6" />
                                </div>
                              )}
                            </div>
                            
                            {/* Product Info */}
                            <div className="flex-1 min-w-0 flex flex-col justify-between">
                              <div>
                                <div className="flex items-start justify-between gap-2">
                                  <h3 className="font-semibold text-xs sm:text-sm text-[#0F172A] line-clamp-1">
                                    {productName}
                                  </h3>
                                  <button
                                    onClick={() => handleRemoveItem(item._id)}
                                    disabled={isRemoving}
                                    className="text-[#64748B] hover:text-rose-500 hover:bg-rose-50 disabled:opacity-50 p-1.5 rounded-lg transition-all duration-200 cursor-pointer shrink-0"
                                    aria-label="Remove item"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                                
                                {item.selectedVariant && (
                                  <p className="text-[#B8860B] text-[11px] font-medium mt-0.5">
                                    {item.selectedVariant.variantName}
                                  </p>
                                )}
                                
                                {hasSize && (
                                  <p className="text-[#0F172A]/70 text-[11px] font-medium mt-0.5">
                                    Size: <span className="font-bold text-[#0F172A]">{selectedSize}</span>
                                  </p>
                                )}
                                
                                {isSizePriceDifferent && (
                                  <p className="text-emerald-600 text-[10px] font-medium">
                                    Size Price: ₹{sizePrice}
                                  </p>
                                )}
                              </div>
                              
                              <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#D4AF37]/10">
                                <span className="text-sm font-extrabold text-[#0F172A]">₹{item.price || 0}</span>
                                
                                <div className="flex items-center border border-[#D4AF37]/30 rounded-xl bg-[#FBF7F1] overflow-hidden shadow-sm">
                                  <button 
                                    onClick={() => updateCartItem(item._id, item.quantity - 1)}
                                    disabled={item.quantity <= 1 || isRemoving}
                                    className="w-7 h-7 flex items-center justify-center text-[#0F172A] hover:bg-[#D4AF37] hover:text-white transition-colors disabled:opacity-30 text-xs font-bold cursor-pointer"
                                  >
                                    −
                                  </button>
                                  <span className="w-7 text-center text-xs font-bold text-[#0F172A]">{item.quantity}</span>
                                  <button 
                                    onClick={() => updateCartItem(item._id, item.quantity + 1)}
                                    disabled={item.quantity >= maxStock || isRemoving}
                                    className="w-7 h-7 flex items-center justify-center text-[#0F172A] hover:bg-[#D4AF37] hover:text-white transition-colors disabled:opacity-30 text-xs font-bold cursor-pointer"
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
                      <div className="text-right pt-2 pb-1">
                        <button
                          onClick={handleClearCart}
                          disabled={isClearingCart}
                          className="text-xs text-rose-500 hover:text-rose-700 font-semibold transition-colors disabled:opacity-50 inline-flex items-center gap-1.5 cursor-pointer px-2 py-1 rounded-lg hover:bg-rose-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          {isClearingCart ? 'Clearing Cart...' : 'Clear Entire Cart'}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Footer with totals and actions */}
            {cart.items && cart.items.length > 0 && (
              <div className="flex-shrink-0 border-t border-[#D4AF37]/20 bg-white p-5 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-xs text-[#64748B]">
                    <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
                    <span className="font-semibold text-[#0F172A]">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-[#64748B]">
                    <span>Shipping</span>
                    <span className="text-emerald-600 font-bold uppercase tracking-wider text-[10px] bg-emerald-50 px-2 py-0.5 rounded-full">Free Delivery</span>
                  </div>
                  <div className="flex justify-between text-xs text-[#64748B]">
                    <span>Estimated Tax (5%)</span>
                    <span className="font-semibold text-[#0F172A]">₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-base font-extrabold pt-2.5 border-t border-[#D4AF37]/20 mt-1">
                    <span className="text-[#0F172A]">Total Amount</span>
                    <span className="text-[#B8860B]">₹{total.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="space-y-2.5">
                  <button
                    onClick={handleCheckout}
                    className="w-full py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all duration-300 gold-gradient text-white shadow-lg shadow-[#D4AF37]/25 hover:-translate-y-0.5 active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Proceed to Secure Checkout</span>
                    <ArrowRight size={16} />
                  </button>
                  
                  <button
                    onClick={onClose}
                    className="w-full py-2.5 text-xs font-semibold text-[#64748B] hover:text-[#0F172A] hover:bg-[#FBF7F1] rounded-xl transition-all duration-200 cursor-pointer border border-transparent hover:border-[#D4AF37]/20"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}