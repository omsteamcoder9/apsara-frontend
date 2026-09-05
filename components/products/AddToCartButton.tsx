'use client';

import { useState } from 'react';
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
  const { addToCart, loading, addingProductId, cart } = useCart();

  const isAdding = loading && addingProductId === product._id;

  const isInCart = cart?.items?.some(item => {
    const sameProduct = item.product._id === product._id;
    const sameVariant = item.selectedVariant?.variantName === selectedVariant?.variantName;
    const sameSize = item.selectedSize === selectedSize;
    return sameProduct && (!selectedVariant || sameVariant) && (!selectedSize || sameSize);
  }) || false;

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
      console.log('📤 Calling addToCart function WITH VARIANT AND SIZE...');
      await addToCart(product, quantity, selectedVariant, selectedSize);
      console.log('✅ addToCart with variant and size successful');
    } catch (error) {
      console.error('❌ Error adding to cart:', error);
      alert('Failed to add item to cart. Please try again.');
    }
  };

  const maxQuantity = getMaxQuantity();
  const outOfStock = isOutOfStock();

  const availableSizes = getAvailableSizes();

  return (
    <div className="space-y-3">
      {/* Size Selector */}
      {availableSizes.length > 0 && onSizeChange && (
        <div className="space-y-1.5">
          <span className="text-xs font-medium text-stone-700">Select Size:</span>
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
                      ? 'border-orange-500 bg-orange-500 text-white shadow-md hover:bg-orange-600 hover:shadow-orange-500/30 transform hover:scale-[1.02] active:scale-[0.98]' 
                      : 'border-stone-200 hover:border-orange-300 text-stone-700 hover:bg-orange-50 hover:text-orange-600'
                    }
                  `}
                >
                  <span>{size.size}</span>
                  {isPriceDifferent && sizePrice !== null && (
                    <span className="ml-1 text-[10px] text-stone-400">₹{sizePrice}</span>
                  )}
                </button>
              );
            })}
          </div>
          {selectedSize && (
            <p className="text-[10px] text-stone-400">
              Selected: {selectedSize}
              {displayPrice !== (selectedVariant?.price || product.basePrice) && 
                ` • Price: ₹${displayPrice}`
              }
            </p>
          )}
          {!selectedSize && (
            <p className="text-[10px] text-red-500">Please select a size</p>
          )}
        </div>
      )}

      {/* Quantity Selector */}
      {!outOfStock && (
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-stone-700">Qty:</span>
          <div className="flex items-center border border-stone-200 rounded-lg bg-white shadow-sm">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-2.5 py-1 hover:bg-orange-50 hover:text-orange-600 transition-colors disabled:opacity-50 cursor-pointer text-sm text-stone-600 rounded-l-lg"
              disabled={quantity <= 1}
            >
              -
            </button>
            <span className="px-2.5 py-1 min-w-8 text-center text-sm font-medium text-stone-800">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
              className="px-2.5 py-1 hover:bg-orange-50 hover:text-orange-600 transition-colors disabled:opacity-50 cursor-pointer text-sm text-stone-600 rounded-r-lg"
              disabled={quantity >= maxQuantity}
            >
              +
            </button>
          </div>
          {maxQuantity > 0 && (
            <span className="text-xs text-stone-400">
              Max: {maxQuantity}
            </span>
          )}
        </div>
      )}

      {/* Add to Cart Button */}
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={outOfStock || isAdding || (availableSizes.length > 0 && !selectedSize)}
        className="w-full py-2.5 px-4 bg-orange-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-300 hover:bg-orange-600 hover:shadow-orange-500/30 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-md cursor-pointer text-sm transform hover:scale-[1.02] active:scale-[0.98]"
      >
        <div className="min-w-[120px] flex items-center justify-center gap-2">
          {isAdding ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              <span>Adding...</span>
            </>
          ) : outOfStock ? (
            <span>Out of Stock</span>
          ) : (availableSizes.length > 0 && !selectedSize) ? (
            <span>Select Size</span>
          ) : isInCart ? (
            <>
              <Check size={16} />
              <span>In Cart</span>
            </>
          ) : (
            <>
              <ShoppingBag size={16} />
              <span>Add to Cart</span>
            </>
          )}
        </div>
      </button>
    </div>
  );
}