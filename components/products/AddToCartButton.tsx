'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { Product, ProductVariant, Size, ProductSize } from '@/types/product';
import { ShoppingBag, Check } from 'lucide-react';

interface AddToCartButtonProps {
  product: Product;
  selectedVariant?: ProductVariant;
  selectedSize?: Size | string;
  quantity?: number;
  onQuantityChange?: (qty: number) => void;
  onSizeChange?: (size: Size | string) => void;
}

export default function AddToCartButton({ 
  product, 
  selectedVariant,
  selectedSize,
  quantity: externalQuantity,
  onQuantityChange,
  onSizeChange
}: AddToCartButtonProps) {
  const [internalQuantity, setInternalQuantity] = useState(1);
  const quantity = externalQuantity !== undefined ? externalQuantity : internalQuantity;
  const setQuantity = onQuantityChange || setInternalQuantity;  
  const { addToCart, loading, addingProductId, cart, updateCartItem } = useCart();

  const isAdding = loading && addingProductId === product._id;

  // Local state for "In Cart ✓" feedback (shows for 2 seconds)
  const [showInCartFeedback, setShowInCartFeedback] = useState(false);

  // Check if product is in cart with same variant and size
  const cartItem = cart?.items?.find(item => {
    const sameProduct = item.product._id === product._id;
    const sameVariant = item.selectedVariant?.variantName === selectedVariant?.variantName;
    const sameSize = item.selectedSize === selectedSize;
    return sameProduct && (!selectedVariant || sameVariant) && (!selectedSize || sameSize);
  });

  const isInCart = !!cartItem;

  // Auto-clear feedback after 2 seconds
  useEffect(() => {
    if (showInCartFeedback) {
      const timer = setTimeout(() => {
        setShowInCartFeedback(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showInCartFeedback]);

  const getAvailableSizes = (): ProductSize[] => {
    if (selectedVariant && selectedVariant.sizes && selectedVariant.sizes.length > 0) {
      return selectedVariant.sizes;
    }
    if (product.sizes && product.sizes.length > 0) {
      return product.sizes;
    }
    return [];
  };

  const getSizePrice = (): number => {
    const sizes = getAvailableSizes();
    if (sizes.length === 0 || !selectedSize) {
      return selectedVariant?.price || product.basePrice;
    }
    
    const sizeData = sizes.find(s => s.size === selectedSize);
    if (sizeData && sizeData.price !== null && sizeData.price !== undefined) {
      return sizeData.price;
    }
    
    return selectedVariant?.price || product.basePrice;
  };

  const getMaxQuantity = (): number => {
    if (selectedVariant) {
      return Math.max(0, selectedVariant.stock);
    }
    return Math.max(0, product.stock);
  };

  const isSizeAvailable = (): boolean => {
    const sizes = getAvailableSizes();
    if (sizes.length === 0) return true;
    if (!selectedSize) return false;
    return sizes.some(s => s.size === selectedSize);
  };

  const isOutOfStock = (): boolean => {
    const maxQty = getMaxQuantity();
    return maxQty <= 0 || !isSizeAvailable();
  };

  const displayPrice = getSizePrice();

  const handleAddToCart = async () => {
    console.log('🛒 START - Adding to cart WITH VARIANT AND SIZE:', {
      productId: product._id,
      productName: product.name,
      selectedVariant: selectedVariant?.variantName,
      selectedSize: selectedSize,
      quantity,
      price: displayPrice,
      timestamp: new Date().toISOString()
    });

    try {
      // Check if item already exists in cart with same variant and size
      const existingItem = cart?.items?.find(item => {
        const sameProduct = item.product._id === product._id;
        const sameVariant = item.selectedVariant?.variantName === selectedVariant?.variantName;
        const sameSize = item.selectedSize === selectedSize;
        return sameProduct && (!selectedVariant || sameVariant) && (!selectedSize || sameSize);
      });

      if (existingItem) {
        // Update quantity (increase by selected quantity)
        const newQuantity = (existingItem.quantity || 1) + quantity;
        console.log(`📦 Item exists, updating quantity from ${existingItem.quantity} to ${newQuantity}`);
        await updateCartItem(existingItem._id, newQuantity);
      } else {
        // Add new item
        console.log('📤 Calling addToCart function WITH VARIANT AND SIZE...');
        await addToCart(product, quantity, selectedVariant, selectedSize);
        console.log('✅ addToCart with variant and size successful');
      }

      // Show "In Cart ✓" feedback for 2 seconds
      setShowInCartFeedback(true);

    } catch (error) {
      console.error('❌ Error adding to cart:', error);
      alert('Failed to add item to cart. Please try again.');
    }
  };

  const maxQuantity = getMaxQuantity();
  const outOfStock = isOutOfStock();

  const availableSizes = getAvailableSizes();

  // Determine button state
  const getButtonState = () => {
    if (isAdding) return 'adding';
    if (outOfStock) return 'outOfStock';
    if (availableSizes.length > 0 && !selectedSize) return 'selectSize';
    if (showInCartFeedback) return 'inCartFeedback'; // Shows "In Cart ✓" for 2 seconds
    return 'addToCart';
  };

  const buttonState = getButtonState();

  const getButtonContent = () => {
    switch (buttonState) {
      case 'adding':
        return (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            <span>Adding...</span>
          </>
        );
      case 'outOfStock':
        return <span>Out of Stock</span>;
      case 'selectSize':
        return <span>Select Size</span>;
      case 'inCartFeedback':
        return (
          <>
            <Check size={16} />
            <span>In Cart ✓</span>
          </>
        );
      case 'addToCart':
      default:
        return (
          <>
            <ShoppingBag size={16} />
            <span>Add to Cart</span>
          </>
        );
    }
  };

  return (
    <div className="space-y-3">
      {/* Size Selector */}
      {availableSizes.length > 0 && onSizeChange && (
        <div className="space-y-1.5">
          <span className="text-xs font-medium text-[#0F172A]">Select Size:</span>
          <div className="flex flex-wrap gap-1.5">
            {availableSizes.map((size) => {
              const isSelected = selectedSize === size.size;
              const sizePrice = size.price;
              const isPriceDifferent = sizePrice !== null && sizePrice !== (selectedVariant?.price || product.basePrice);
              
              return (
                <button
                  key={size.size}
                  type="button"
                  onClick={() => onSizeChange(size.size)}
                  className={`
                    px-3 py-1.5 rounded-lg border text-xs font-medium transition-all duration-200 cursor-pointer
                    ${isSelected 
                      ? 'border-[#D4AF37] bg-[#D4AF37] text-white shadow-md hover:bg-[#B8860B] hover:shadow-[#D4AF37]/30 transform hover:scale-[1.02] active:scale-[0.98]' 
                      : 'border-[#D4AF37]/30 hover:border-[#D4AF37] text-[#0F172A] hover:bg-[#FBF7F1] hover:text-[#B8860B]'
                    }
                  `}
                >
                  <span>{size.size}</span>
                  {isPriceDifferent && sizePrice !== null && (
                    <span className="ml-1 text-[10px] text-[#64748B]">₹{sizePrice}</span>
                  )}
                </button>
              );
            })}
          </div>
          {selectedSize && (
            <p className="text-[10px] text-[#64748B]">
              Selected: {selectedSize}
              {displayPrice !== (selectedVariant?.price || product.basePrice) && 
                ` • Price: ₹${displayPrice}`
              }
            </p>
          )}
          {!selectedSize && (
            <p className="text-[10px] text-rose-500">Please select a size</p>
          )}
        </div>
      )}

      {/* Quantity Selector */}
      {!outOfStock && (
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-[#0F172A]">Qty:</span>
          <div className="flex items-center border border-[#D4AF37]/30 rounded-lg bg-white shadow-sm">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-2.5 py-1 hover:bg-[#FBF7F1] hover:text-[#B8860B] transition-colors disabled:opacity-50 cursor-pointer text-sm text-[#0F172A] rounded-l-lg"
              disabled={quantity <= 1}
            >
              -
            </button>
            <span className="px-2.5 py-1 min-w-8 text-center text-sm font-medium text-[#0F172A]">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
              className="px-2.5 py-1 hover:bg-[#FBF7F1] hover:text-[#B8860B] transition-colors disabled:opacity-50 cursor-pointer text-sm text-[#0F172A] rounded-r-lg"
              disabled={quantity >= maxQuantity}
            >
              +
            </button>
          </div>
          {maxQuantity > 0 && (
            <span className="text-xs text-[#64748B]">
              Max: {maxQuantity}
            </span>
          )}
        </div>
      )}

      {/* Add to Cart Button - Now using gold-gradient like Sign Up button */}
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={outOfStock || isAdding || (availableSizes.length > 0 && !selectedSize)}
        className={`
          w-full py-2.5 px-4 rounded-xl font-medium flex items-center justify-center gap-2 
          transition-all duration-300 shadow-md shadow-[#D4AF37]/20 cursor-pointer text-sm 
          transform hover:scale-[1.02] active:scale-[0.98] hover:-translate-y-0.5
          ${buttonState === 'inCartFeedback'
            ? 'gold-gradient text-white hover:gold-gradient-hover'
            : 'gold-gradient gold-gradient-hover text-white'
          }
          ${(outOfStock || isAdding || (availableSizes.length > 0 && !selectedSize))
            ? 'opacity-50 cursor-not-allowed transform-none hover:scale-100 hover:-translate-y-0'
            : ''
          }
        `}
      >
        <div className="min-w-[120px] flex items-center justify-center gap-2">
          {getButtonContent()}
        </div>
      </button>
    </div>
  );
}