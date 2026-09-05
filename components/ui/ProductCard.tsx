// src/components/ProductCard.tsx
import { Product, Size } from '@/types/product';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { ShoppingBag, ChevronLeft } from 'lucide-react';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
}

// Format price with commas
const formatPrice = (price: number): string => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// ============= OFFER LOGIC - WORKS FOR BOTH PRODUCT AND VARIANTS =============
const getProductOfferInfo = (product: Product) => {
  
  // 🎯 CASE 1: PRODUCT HAS VARIANTS - Check default variant for offer
  if (product.variants && product.variants.length > 0) {
    const defaultVariant = product.variants.find(v => v.isDefault) || product.variants[0];
    
    if (defaultVariant.originalPrice && 
        defaultVariant.price && 
        parseFloat(defaultVariant.originalPrice.toString()) > parseFloat(defaultVariant.price.toString())) {
      
      const original = parseFloat(defaultVariant.originalPrice.toString());
      const discounted = parseFloat(defaultVariant.price.toString());
      const discountPercentage = defaultVariant.discountPercentage || 
        ((original - discounted) / original) * 100;
      
      return {
        hasOffer: true,
        originalPrice: original,
        discountedPrice: discounted,
        discountPercentage: Math.round(discountPercentage * 100) / 100
      };
    }
    
    return {
      hasOffer: false,
      originalPrice: parseFloat(defaultVariant.price.toString()),
      discountedPrice: parseFloat(defaultVariant.price.toString()),
      discountPercentage: 0
    };
  }
  
  // 🎯 CASE 2: NO VARIANTS - Check product-level offer
  if (product.hasOffer && 
      product.originalPrice && 
      product.basePrice &&
      parseFloat(product.originalPrice.toString()) > parseFloat(product.basePrice.toString())) {
    
    const original = parseFloat(product.originalPrice.toString());
    const discounted = parseFloat(product.basePrice.toString());
    const discountPercentage = product.discountPercentage || 
      ((original - discounted) / original) * 100;
    
    return {
      hasOffer: true,
      originalPrice: original,
      discountedPrice: discounted,
      discountPercentage: Math.round(discountPercentage * 100) / 100
    };
  }
  
  return {
    hasOffer: false,
    originalPrice: parseFloat(product.basePrice?.toString() || '0'),
    discountedPrice: parseFloat(product.basePrice?.toString() || '0'),
    discountPercentage: 0
  };
};

// ✅ UPDATED: Get product image - supports both local and R2 URLs
const getProductImage = (product: Product) => {
  const API_FILE_URL = process.env.NEXT_PUBLIC_IMG_URL || 'http://localhost:5002';
  
  // Check variant images first
  if (product.variants && product.variants.length > 0) {
    const defaultVariant = product.variants.find(v => v.isDefault) || product.variants[0];
    
    if (defaultVariant?.images?.[0]?.image) {
      const imagePath = defaultVariant.images[0].image;
      // If it's already a full URL (R2)
      if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
      }
      // If it's a local path
      if (imagePath.startsWith('/uploads/')) {
        return `${API_FILE_URL}${imagePath}`;
      }
      return `${API_FILE_URL}/uploads/${imagePath}`;
    }
  }
  
  // Check main product images
  if (product.images?.[0]?.image) {
    const imagePath = product.images[0].image;
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    if (imagePath.startsWith('/uploads/')) {
      return `${API_FILE_URL}${imagePath}`;
    }
    return `${API_FILE_URL}/uploads/${imagePath}`;
  }
  
  // Check OG image as fallback
  if (product.ogImage) {
    const imagePath = product.ogImage;
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    if (imagePath.startsWith('/uploads/')) {
      return `${API_FILE_URL}${imagePath}`;
    }
    return `${API_FILE_URL}/uploads/${imagePath}`;
  }
  
  return '/placeholder-image.jpg';
};

export default function ProductCard({ product }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const [showSizeSelector, setShowSizeSelector] = useState(false);
  const [selectedSize, setSelectedSize] = useState<Size | string>('');
  const [quantity, setQuantity] = useState(1);
  
  const { addToCart, cart } = useCart();
  const router = useRouter();

  const offerInfo = getProductOfferInfo(product);
  const hasValidOffer = offerInfo.hasOffer && offerInfo.originalPrice > offerInfo.discountedPrice;
  
  // ✅ FIX: Safely check if product is in cart
  const isInCart = cart?.items?.some(item => {
    // Check if item.product exists and has _id
    if (!item || !item.product) return false;
    // Check if product._id exists
    if (!product || !product._id) return false;
    return item.product._id === product._id;
  }) || false;
  
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

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (hasSizes) {
      setShowSizeSelector(true);
      return;
    }
    
    try {
      const defaultVariant = product.variants && product.variants.length > 0
        ? product.variants.find(v => v.isDefault) || product.variants[0]
        : undefined;
      
      await addToCart(product, 1, defaultVariant);
    } catch (error) {
      console.error('Failed to add product to cart:', error);
    }
  };

  const handleSizeSelect = (size: Size | string) => {
    setSelectedSize(size);
  };

  const handleAddToCartWithSize = async () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }

    try {
      const defaultVariant = product.variants && product.variants.length > 0
        ? product.variants.find(v => v.isDefault) || product.variants[0]
        : undefined;
      
      await addToCart(product, quantity, defaultVariant, selectedSize);
      
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

  const primaryColor = '#D4AF37';

  return (
    <div
      className="group relative bg-[#0b0b0b] rounded-xl border border-[#ff6b00]/20 hover:border-[#ff6b00]/70 shadow-[0_8px_30px_rgba(0,0,0,0.35)] hover:shadow-[0_12px_40px_rgba(255,107,0,0.16)] transition-all duration-300 overflow-hidden cursor-pointer font-sans hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Orange glow on hover */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,107,0,0.10),transparent_55%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Cart indicator */}
      {isInCart && (
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 bg-[#ff6b00] text-white rounded-full w-5 h-5 sm:w-7 sm:h-7 flex items-center justify-center text-[8px] sm:text-xs font-bold shadow-[0_0_15px_rgba(255,107,0,0.5)]">
          ✓
        </div>
      )}

      {/* Image Section */}
      <div className="relative p-2 sm:p-3 md:p-4 pb-0">
        <div className="relative w-full aspect-[4/3] rounded-lg bg-gradient-to-br from-[#151515] via-[#0c0c0c] to-[#121212] flex items-center justify-center overflow-hidden border border-white/[0.04]">

          {/* Decorative orange glow */}
          <div className="absolute w-20 h-20 sm:w-32 sm:h-32 bg-[#ff6b00]/10 blur-3xl rounded-full" />

          <div className="relative w-full h-full">
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 480px) 100vw, (max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
              className={`object-contain p-2 sm:p-3 transition-transform duration-500 ${
                isHovered ? 'scale-110' : 'scale-100'
              }`}
              onError={() => setImageError(true)}
              priority={false}
              loading="lazy"
            />
          </div>

          {imageError && (
            <div className="absolute inset-0 bg-[#111] flex items-center justify-center">
              <svg
                className="w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 text-white/20"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}

          {/* Offer badge */}
          {hasValidOffer && (
            <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-[#ff6b00] text-white px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-md text-[7px] sm:text-[9px] md:text-[10px] font-bold uppercase tracking-wide shadow-[0_0_15px_rgba(255,107,0,0.35)]">
              {Math.round(offerInfo.discountPercentage)}% OFF
            </div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="relative p-2 sm:p-3 md:p-4">

        {/* Product Name */}
        <div className="min-h-[2rem] sm:min-h-[2.7rem] mb-1.5 sm:mb-2">
          <h3 className="font-semibold text-white line-clamp-2 text-[10px] sm:text-xs md:text-sm leading-4 sm:leading-5">
            {product.name}
          </h3>
        </div>

        {/* Price + Stock */}
        <div className="flex items-center justify-between gap-1.5 sm:gap-2 mb-2 sm:mb-3">

          <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
            <span className="text-sm sm:text-base md:text-lg font-bold text-[#ff6b00]">
              ₹{formatPrice(displayPrice)}
            </span>

            {hasValidOffer && (
              <span
                className="text-[8px] sm:text-[10px] md:text-xs text-white/35 font-medium"
                style={{
                  textDecoration: 'line-through',
                  textDecorationThickness: '1px'
                }}
              >
                ₹{formatPrice(offerInfo.originalPrice)}
              </span>
            )}
          </div>

          <span
            className={`px-1.5 py-0.5 sm:px-2 sm:py-1 text-[6px] sm:text-[8px] md:text-[9px] rounded-full font-semibold whitespace-nowrap ${
              !isOutOfStock
                ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                : 'bg-red-500/10 text-red-400 border border-red-500/20'
            }`}
          >
            {!isOutOfStock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>

        {/* Bottom Action */}
        <div className="flex items-center gap-1.5 sm:gap-2">

          {/* Add Cart */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="flex-1 py-1.5 sm:py-2 md:py-2.5 px-2 sm:px-3 rounded-lg font-semibold flex items-center justify-center gap-1 sm:gap-2 transition-all duration-300 bg-[#ff6b00] hover:bg-[#ff7b1a] text-white disabled:bg-gray-600 disabled:text-gray-300 disabled:cursor-not-allowed shadow-[0_5px_20px_rgba(255,107,0,0.18)] hover:shadow-[0_8px_25px_rgba(255,107,0,0.32)] text-[8px] sm:text-[10px] md:text-xs transform hover:scale-[1.02] cursor-pointer"
          >
            <ShoppingBag
              size={12}
              className="sm:w-3 sm:h-3 md:w-4 md:h-4"
            />

            <span className="truncate">
              {!isOutOfStock
                ? hasSizes
                  ? 'Select Size'
                  : 'Add to Cart'
                : 'Out of Stock'}
            </span>
          </button>

          {/* View Arrow */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/products/${product.slug}`);
            }}
            className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg border border-white/10 hover:border-[#ff6b00]/60 bg-white/[0.03] hover:bg-[#ff6b00]/10 flex items-center justify-center text-white/60 hover:text-[#ff6b00] transition-all duration-300 text-sm sm:text-base"
          >
            →
          </button>
        </div>
      </div>

      {/* Bottom orange line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ff6b00] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Size Selector Overlay */}
      {showSizeSelector && hasSizes && (
        <div
          className="absolute inset-0 bg-[#0b0b0b]/98 z-20 p-2 sm:p-3 md:p-4 flex flex-col backdrop-blur-md overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >

          {/* Back Button */}
          <button
            onClick={handleBackToCard}
            className="flex items-center gap-1 sm:gap-1.5 text-[#ff6b00] hover:text-white mb-2 sm:mb-3 text-[10px] sm:text-xs md:text-sm transition-colors"
          >
            <ChevronLeft size={14} className="sm:w-4 sm:h-4 md:w-[17px] md:h-[17px]" />
            <span>Back</span>
          </button>

          {/* Product Info */}
          <div className="flex gap-2 sm:gap-3 mb-2 sm:mb-3 pb-2 sm:pb-3 border-b border-white/10">
            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-[#151515] rounded-lg overflow-hidden flex-shrink-0 border border-white/5">
              <Image
                src={imageUrl}
                alt={product.name}
                width={56}
                height={56}
                className="object-contain w-full h-full"
              />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-white text-[10px] sm:text-xs md:text-sm truncate">
                {product.name}
              </h4>

              <p className="text-[#ff6b00] font-bold text-xs sm:text-sm md:text-base mt-0.5 sm:mt-1">
                ₹{formatPrice(displayPrice)}
              </p>
            </div>
          </div>

          {/* Size Options */}
          <div className="mb-2 sm:mb-3">
            <label className="block text-[10px] sm:text-xs font-medium text-white/80 mb-1 sm:mb-2">
              Select Size *
            </label>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 sm:gap-2">
              {product.sizes?.map((size) => {
                const isSelected = selectedSize === size.size;
                const sizePrice = size.price;
                const isPriceDifferent =
                  sizePrice !== null &&
                  sizePrice !== offerInfo.discountedPrice;

                return (
                  <button
                    key={size.size}
                    onClick={() => handleSizeSelect(size.size)}
                    className={`
                      py-1.5 sm:py-2 px-1 text-[10px] sm:text-xs md:text-sm font-medium rounded-lg border transition-all
                      ${
                        isSelected
                          ? 'border-[#ff6b00] bg-[#ff6b00]/10 text-[#ff6b00] ring-1 ring-[#ff6b00]/50'
                          : 'border-white/10 hover:border-[#ff6b00]/60 hover:text-[#ff6b00] text-white/70 bg-white/[0.02]'
                      }
                    `}
                  >
                    <div>{size.size}</div>

                    {isPriceDifferent && sizePrice !== null && (
                      <div className="text-[6px] sm:text-[8px] md:text-[10px] text-white/40">
                        ₹{formatPrice(sizePrice)}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-2 sm:mb-3">
            <label className="block text-[10px] sm:text-xs font-medium text-white/80 mb-1 sm:mb-1.5">
              Qty
            </label>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center border border-white/10 rounded-lg bg-white/[0.02]">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-2 sm:px-3 py-1 sm:py-1.5 hover:bg-[#ff6b00]/10 transition-colors disabled:opacity-50 cursor-pointer text-white text-xs sm:text-sm"
                  disabled={quantity <= 1}
                >
                  -
                </button>

                <span className="px-2 sm:px-3 py-1 sm:py-1.5 min-w-8 sm:min-w-10 text-center text-xs sm:text-sm text-white">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setQuantity(Math.min(product.stock, quantity + 1))
                  }
                  className="px-2 sm:px-3 py-1 sm:py-1.5 hover:bg-[#ff6b00]/10 transition-colors disabled:opacity-50 cursor-pointer text-white text-xs sm:text-sm"
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>

              {selectedSize && (
                <span className="text-[8px] sm:text-[10px] text-white/40">
                  Max: {product.stock}
                </span>
              )}
            </div>
          </div>

          {/* Add To Cart */}
          <button
            onClick={handleAddToCartWithSize}
            disabled={!selectedSize}
            className="w-full py-2 sm:py-2.5 md:py-3 bg-[#ff6b00] hover:bg-[#ff7b1a] text-white rounded-lg font-semibold flex items-center justify-center gap-1.5 sm:gap-2 transition-all disabled:bg-gray-600 disabled:cursor-not-allowed text-[10px] sm:text-xs md:text-sm mt-auto shadow-[0_8px_25px_rgba(255,107,0,0.2)]"
          >
            <ShoppingBag size={14} className="sm:w-4 sm:h-4 md:w-[16px] md:h-[16px]" />

            <span>
              {!selectedSize ? 'Select Size' : 'Add to Cart'}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}