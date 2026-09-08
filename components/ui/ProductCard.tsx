'use client';

// src/components/ProductCard.tsx
import { Product, Size } from '@/types/product';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { ShoppingBag, ChevronLeft, ArrowRight, Check } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { GiButterfly } from 'react-icons/gi';

interface ProductCardProps {
  product: Product;
}

// Format price with commas
const formatPrice = (price: number): string => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// ============= OFFER LOGIC =============
const getProductOfferInfo = (product: Product) => {
  // PRODUCT HAS VARIANTS
  if (product.variants && product.variants.length > 0) {
    const defaultVariant = product.variants.find(v => v.isDefault) || product.variants[0];

    if (
      defaultVariant.originalPrice &&
      defaultVariant.price &&
      parseFloat(defaultVariant.originalPrice.toString()) > parseFloat(defaultVariant.price.toString())
    ) {
      const original = parseFloat(defaultVariant.originalPrice.toString());
      const discounted = parseFloat(defaultVariant.price.toString());
      const discountPercentage = defaultVariant.discountPercentage || ((original - discounted) / original) * 100;

      return {
        hasOffer: true,
        originalPrice: original,
        discountedPrice: discounted,
        discountPercentage: Math.round(discountPercentage * 100) / 100,
      };
    }

    return {
      hasOffer: false,
      originalPrice: parseFloat(defaultVariant.price.toString()),
      discountedPrice: parseFloat(defaultVariant.price.toString()),
      discountPercentage: 0,
    };
  }

  // PRODUCT LEVEL OFFER
  if (
    product.hasOffer &&
    product.originalPrice &&
    product.basePrice &&
    parseFloat(product.originalPrice.toString()) > parseFloat(product.basePrice.toString())
  ) {
    const original = parseFloat(product.originalPrice.toString());
    const discounted = parseFloat(product.basePrice.toString());
    const discountPercentage = product.discountPercentage || ((original - discounted) / original) * 100;

    return {
      hasOffer: true,
      originalPrice: original,
      discountedPrice: discounted,
      discountPercentage: Math.round(discountPercentage * 100) / 100,
    };
  }

  return {
    hasOffer: false,
    originalPrice: parseFloat(product.basePrice?.toString() || '0'),
    discountedPrice: parseFloat(product.basePrice?.toString() || '0'),
    discountPercentage: 0,
  };
};

// Get product image
const getProductImage = (product: Product) => {
  const API_FILE_URL = process.env.NEXT_PUBLIC_IMG_URL || 'http://localhost:5002';

  // Variant image
  if (product.variants && product.variants.length > 0) {
    const defaultVariant = product.variants.find(v => v.isDefault) || product.variants[0];
    if (defaultVariant?.images?.[0]?.image) {
      const imagePath = defaultVariant.images[0].image;
      if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath;
      if (imagePath.startsWith('/uploads/')) return `${API_FILE_URL}${imagePath}`;
      return `${API_FILE_URL}/uploads/${imagePath}`;
    }
  }

  // Product image
  if (product.images?.[0]?.image) {
    const imagePath = product.images[0].image;
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath;
    if (imagePath.startsWith('/uploads/')) return `${API_FILE_URL}${imagePath}`;
    return `${API_FILE_URL}/uploads/${imagePath}`;
  }

  // OG image
  if (product.ogImage) {
    const imagePath = product.ogImage;
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath;
    if (imagePath.startsWith('/uploads/')) return `${API_FILE_URL}${imagePath}`;
    return `${API_FILE_URL}/uploads/${imagePath}`;
  }

  return '/placeholder-image.jpg';
};

export default function ProductCard({ product }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Animation State
  const [flyingItem, setFlyingItem] = useState<{ startX: number; startY: number; endX: number; endY: number } | null>(null);

  const [showSizeSelector, setShowSizeSelector] = useState(false);
  const [selectedSize, setSelectedSize] = useState<Size | string>('');
  const [quantity, setQuantity] = useState(1);

  // Local state for button "In Cart" feedback
  const [showInCartFeedback, setShowInCartFeedback] = useState(false);

  const { addToCart, updateCartItem, cart } = useCart();
  const router = useRouter();

  const offerInfo = getProductOfferInfo(product);
  const hasValidOffer = offerInfo.hasOffer && offerInfo.originalPrice > offerInfo.discountedPrice;

  // Check if product is in cart and get the cart item
  const cartItem = cart?.items?.find(item => {
    if (!item || !item.product) return false;
    if (!product || !product._id) return false;
    return item.product._id === product._id;
  });

  const isInCart = !!cartItem;

  const isOutOfStock = product.stock <= 0;
  const imageUrl = getProductImage(product);
  const hasSizes = product.sizes && product.sizes.length > 0;

  const getSizePrice = (): number => {
    if (selectedSize && hasSizes) {
      const sizeData = product.sizes?.find(s => s.size === selectedSize);
      if (sizeData && sizeData.price !== null && sizeData.price !== undefined) {
        return sizeData.price;
      }
    }

    return offerInfo.discountedPrice;
  };

  const displayPrice = getSizePrice();

  const handleCardClick = () => {
    if (!showSizeSelector) {
      router.push(`/products/${product.slug}`);
    }
  };

  // ================= CART FLY ANIMATION TRIGGER =================
  const triggerFlyingAnimation = (e: React.MouseEvent) => {
    const buttonRect = e.currentTarget.getBoundingClientRect();
    const startX = buttonRect.left + buttonRect.width / 2;
    const startY = buttonRect.top + buttonRect.height / 2;

    const handleCoordsResponse = (evt: any) => {
      const { x: endX, y: endY } = evt.detail;
      setFlyingItem({ startX, startY, endX, endY });
      window.removeEventListener('cartCoordsResponse', handleCoordsResponse);
    };

    window.addEventListener('cartCoordsResponse', handleCoordsResponse, { once: true });
    window.dispatchEvent(new CustomEvent('getCartCoords'));
  };

  // ================= SHOW IN CART FEEDBACK =================
  const showInCartFeedbackFor2Seconds = () => {
    setShowInCartFeedback(true);
    setTimeout(() => {
      setShowInCartFeedback(false);
    }, 2000);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (hasSizes) {
      setShowSizeSelector(true);
      return;
    }

    triggerFlyingAnimation(e);

    try {
      const defaultVariant = product.variants && product.variants.length > 0
        ? product.variants.find(v => v.isDefault) || product.variants[0]
        : undefined;

      // CHECK IF ALREADY IN CART
      if (cartItem) {
        // UPDATE QUANTITY (increase by 1)
        const newQuantity = (cartItem.quantity || 1) + 1;
        await updateCartItem(cartItem._id, newQuantity);
      } else {
        // ADD NEW ITEM
        await addToCart(product, 1, defaultVariant);
      }

      // Show "In Cart" feedback for 2 seconds
      showInCartFeedbackFor2Seconds();

    } catch (error) {
      console.error('Failed to add product to cart:', error);
    }
  };

  const handleSizeSelect = (size: Size | string) => {
    setSelectedSize(size);
  };

  const handleAddToCartWithSize = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!selectedSize) {
      alert('Please select a size');
      return;
    }

    triggerFlyingAnimation(e);

    try {
      const defaultVariant = product.variants && product.variants.length > 0
        ? product.variants.find(v => v.isDefault) || product.variants[0]
        : undefined;

      // CHECK IF ALREADY IN CART (with same size)
      const existingItem = cart?.items?.find(item => {
        if (!item || !item.product) return false;
        if (item.product._id !== product._id) return false;
        // Check if same size
        return item.selectedSize === selectedSize;
      });

      if (existingItem) {
        // UPDATE QUANTITY (increase by selected quantity)
        const newQuantity = (existingItem.quantity || 1) + quantity;
        await updateCartItem(existingItem._id, newQuantity);
      } else {
        // ADD NEW ITEM
        await addToCart(product, quantity, defaultVariant, selectedSize);
      }

      // Show "In Cart" feedback for 2 seconds
      showInCartFeedbackFor2Seconds();

      setShowSizeSelector(false);
      setSelectedSize('');
      setQuantity(1);
    } catch (error) {
      console.error('Failed to add product to cart:', error);
    }
  };

  const handleBackToCard = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowSizeSelector(false);
    setSelectedSize('');
    setQuantity(1);
  };

  // BUTTON DECISION: ONLY use local state
  const showInCartOnButton = showInCartFeedback;

  return (
    <div
      className="
        group relative flex flex-col w-full
        bg-[#FBF7F1] rounded-3xl
        border border-[#D4AF37]/20
        shadow-[0_4px_20px_rgba(0,0,0,0.03)]
        hover:shadow-[0_12px_35px_rgba(212,175,55,0.15)]
        transition-all duration-300
        overflow-hidden
        cursor-pointer
      "
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* ================= TOP IMAGE CONTAINER ================= */}
      <div className="relative w-full pt-[100%] bg-white/50 overflow-hidden">
        {/* Offer Badge */}
        {hasValidOffer && (
          <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full bg-[#B8860B] text-white text-[10px] font-bold tracking-wider uppercase shadow-sm">
            {Math.round(offerInfo.discountPercentage)}% OFF
          </div>
        )}

        {/* In Cart Indicator Badge - Shows quantity if in cart */}


        {/* Product Image */}
        <div className="absolute inset-0 flex items-center justify-center p-6 max-md:p-3">
          {!imageError ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 300px"
              className={`object-contain transition-transform duration-500 ease-out ${isHovered ? 'scale-105' : 'scale-100'}`}
              onError={() => setImageError(true)}
              priority={false}
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[#D4AF37]/40">
              <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* ================= CONTENT CONTAINER ================= */}
      <div className="flex flex-col flex-1 p-5 max-md:p-3.5 bg-[#FBF7F1]">
  <h3 className="font-semibold text-[#0F172A] text-sm sm:text-base leading-snug line-clamp-2 mb-1 max-md:text-[13px]">
  {product.name}
</h3>

<p className="text-xs text-[#64748B] truncate mb-4 leading-relaxed">
  {product.description || 'No description available'}
</p>

        {/* Footer / Price & Action Row */}
{/* Footer / Price & Action Row */}
<div className="mt-auto pt-3 border-t border-[#D4AF37]/20 flex items-end justify-between gap-1">

  {/* PRICE + IN STOCK */}
  <div className="flex flex-col flex-1 min-w-0">

    {/* PRICE */}
    <div className="flex items-center gap-1 min-w-0">
      <span className="
        text-sm sm:text-base md:text-lg
        font-extrabold text-[#0F172A]
        whitespace-nowrap
        max-md:text-[11px]
        max-md:leading-tight
      ">
        ₹{formatPrice(displayPrice)}
      </span>

      {hasValidOffer && (
        <span className="
          text-[10px] sm:text-xs
          text-[#64748B] line-through
          whitespace-nowrap
          max-md:text-[7px]
        ">
          ₹{formatPrice(offerInfo.originalPrice)}
        </span>
      )}
    </div>

    {/* IN STOCK - ALWAYS ONE LINE */}
    <span
      className={`
        text-[10px] font-medium
        whitespace-nowrap
        mt-0.5
        max-md:text-[7px]
        max-md:leading-none
        ${!isOutOfStock ? 'text-[#B8860B]' : 'text-rose-500'}
      `}
    >
      {!isOutOfStock ? 'In Stock' : 'Out of Stock'}
    </span>

  </div>


  {/* ARROW + ADD */}
  <div className="
    flex items-center
    flex-shrink-0
    gap-1.5
    max-md:gap-[3px]
  ">

    {/* ARROW */}
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        router.push(`/products/${product.slug}`);
      }}
      className="
        w-8 h-8 sm:w-9 sm:h-9
        flex items-center justify-center
        rounded-xl
        bg-white text-[#0F172A]
        border border-[#D4AF37]/30
        transition-all duration-200
        hover:bg-[#D4AF37]
        hover:text-white
        hover:border-[#D4AF37]
        cursor-pointer

        max-md:w-[22px]
        max-md:h-[22px]
        max-md:rounded-md
        max-md:flex-shrink-0
      "
      aria-label="View product details"
    >
      <ArrowRight
        size={14}
        className="sm:w-4 sm:h-4 max-md:w-[9px] max-md:h-[9px]"
      />
    </button>


    {/* ADD BUTTON */}
    <button
      onClick={handleAddToCart}
      disabled={isOutOfStock}
      className={`
        h-8 sm:h-9
        min-w-[56px] sm:min-w-[72px]
        px-2.5 sm:px-4
        flex items-center justify-center
        rounded-xl
        font-medium
        text-[10px] sm:text-xs
        shadow-md shadow-[#D4AF37]/20
        transition-all duration-200
        hover:-translate-y-0.5
        active:scale-95
        disabled:opacity-50
        cursor-pointer
        disabled:hover:translate-y-0

        max-md:h-[22px]
        max-md:min-w-[34px]
        max-md:px-1.5
        max-md:rounded-md
        max-md:text-[7px]

        ${
          showInCartOnButton
            ? 'gold-gradient text-white'
            : 'gold-gradient gold-gradient-hover text-white'
        }
      `}
      aria-label="Add to cart"
    >
      {showInCartOnButton ? (
        <>
          {/* DESKTOP */}
          <Check
            size={12}
            className="hidden sm:block sm:w-[14px] sm:h-[14px]"
          />
          <span className="hidden sm:inline ml-1">
            In Cart
          </span>

          {/* MOBILE - TEXT ONLY */}
          <span className="sm:hidden whitespace-nowrap">
            In Cart
          </span>
        </>
      ) : (
        <>
          {/* DESKTOP */}
          <ShoppingBag
            size={12}
            className="hidden sm:block sm:w-[14px] sm:h-[14px]"
          />

          {/* MOBILE - NO ICON */}
          <span className="sm:hidden whitespace-nowrap">
            Add
          </span>

          <span className="hidden sm:inline">
            Add
          </span>
        </>
      )}
    </button>

  </div>
</div>
      </div>

      {/* ================= SIZE SELECTOR OVERLAY ================= */}
      {showSizeSelector && hasSizes && (
        <div
          className="absolute inset-0 z-20 flex flex-col bg-[#FBF7F1]/95 backdrop-blur-md p-5 overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleBackToCard}
            className="flex items-center gap-1 text-xs font-semibold text-[#64748B] mb-4 hover:text-[#B8860B]"
          >
            <ChevronLeft size={16} />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-3 pb-4 mb-4 border-b border-[#D4AF37]/20">
            <div className="relative h-12 w-12 rounded-xl bg-white/50 overflow-hidden shrink-0 border border-[#D4AF37]/20">
              <Image src={imageUrl} alt={product.name} fill className="object-contain p-1" />
            </div>

            <div className="min-w-0 flex-1">
              <h4 className="font-medium text-xs text-[#0F172A] truncate">{product.name}</h4>
              <p className="text-sm font-bold text-[#B8860B] mt-0.5">₹{formatPrice(displayPrice)}</p>
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-xs font-bold text-[#0F172A] mb-2">Select Size</label>

            <div className="grid grid-cols-3 gap-2">
              {product.sizes?.map((size) => {
                const isSelected = selectedSize === size.size;
                const sizePrice = size.price;
                const isPriceDifferent = sizePrice !== null && sizePrice !== offerInfo.discountedPrice;

                return (
                  <button
                    key={size.size}
                    onClick={() => handleSizeSelect(size.size)}
                    className={`
                      py-2.5 px-3 rounded-xl border text-xs font-medium transition-all
                      ${isSelected
                        ? 'border-[#D4AF37] bg-[#D4AF37] text-white shadow-sm'
                        : 'border-[#D4AF37]/30 bg-white text-[#0F172A] hover:border-[#D4AF37]'
                      }
                    `}
                  >
                    <div>{size.size}</div>

                    {isPriceDifferent && sizePrice !== null && (
                      <div className={`text-[9px] mt-0.5 ${isSelected ? 'text-white/70' : 'text-[#64748B]'}`}>
                        ₹{formatPrice(sizePrice)}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-xs font-bold text-[#0F172A] mb-2">Quantity</label>

            <div className="flex items-center justify-between border border-[#D4AF37]/30 rounded-xl p-1 bg-white/50">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-[#0F172A] shadow-sm disabled:opacity-40 border border-[#D4AF37]/20"
              >
                −
              </button>

              <span className="text-xs font-bold text-[#0F172A]">{quantity}</span>

              <button
                type="button"
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                disabled={quantity >= product.stock}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-[#0F172A] shadow-sm disabled:opacity-40 border border-[#D4AF37]/20"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToCartWithSize}
            disabled={!selectedSize}
            className="mt-auto w-full py-3 px-4 rounded-xl gold-gradient text-white font-semibold text-xs shadow-md shadow-[#D4AF37]/20 transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {!selectedSize ? 'Please Select a Size' : 'Confirm & Add to Cart'}
          </button>
        </div>
      )}

      {/* ================= FLYING BUTTERFLY ANIMATION OVERLAY ================= */}
      {typeof window !== 'undefined' && createPortal(
        <AnimatePresence>
          {flyingItem && (
            <motion.div
              initial={{
                position: 'fixed',
                top: flyingItem.startY,
                left: flyingItem.startX,
                scale: 0.8,
                opacity: 1,
                zIndex: 99999,
                x: '-50%',
                y: '-50%',
                rotate: 0,
              }}
              animate={{
                top: [flyingItem.startY, flyingItem.startY - 160, flyingItem.endY],
                left: [
                  flyingItem.startX,
                  flyingItem.startX + (flyingItem.endX > flyingItem.startX ? 120 : -120),
                  flyingItem.endX,
                ],
                scale: [0.8, 1.3, 0.4],
                rotate: [0, -25, 20, 0],
                opacity: [1, 1, 0.6],
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{
                duration: 0.8,
                ease: "easeInOut"
              }}
              onAnimationComplete={() => setFlyingItem(null)}
              className="w-9 h-9 rounded-full gold-gradient shadow-2xl flex items-center justify-center text-white pointer-events-none"
            >
              <GiButterfly size={18} className="animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}