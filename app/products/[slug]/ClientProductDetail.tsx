'use client';

import Image from 'next/image';
import AddToCartButton from '@/components/products/AddToCartButton';
import ProductCard from '@/components/ui/ProductCard';
import { Product, ProductVariant, Size } from '@/types/product';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { useCart } from '@/context/CartContext';

interface ClientProductDetailProps {
  product: Product;
  randomProducts: Product[];
}

// ✅ Helper function to get image URL - supports both local and R2
const getImageUrl = (imagePath: string | undefined): string => {
  if (!imagePath) return '/placeholder-image.jpg';
  
  // If it's already a full URL (R2)
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If it's a local path
  if (imagePath.startsWith('/uploads/')) {
    const baseUrl = process.env.NEXT_PUBLIC_IMG_URL || 'http://localhost:5002';
    return `${baseUrl}${imagePath}`;
  }
  
  // Fallback - try to construct URL
  const baseUrl = process.env.NEXT_PUBLIC_IMG_URL || 'http://localhost:5002';
  const cleanPath = imagePath.replace(/^\/+/, '');
  return `${baseUrl}/${cleanPath}`;
};

// ✅ Helper function to get variant image URL
const getVariantImageUrl = (variant: ProductVariant | null, product: Product): string => {
  if (variant?.images && variant.images.length > 0 && variant.images[0]?.image) {
    return getImageUrl(variant.images[0].image);
  }
  
  if (product?.images && product.images.length > 0 && product.images[0]?.image) {
    return getImageUrl(product.images[0].image);
  }
  
  return '/placeholder-image.jpg';
};

// Mobile Floating Button Component
interface MobileFloatingButtonProps {
  product: Product;
  selectedVariant: ProductVariant | null;
  selectedSize: Size | string | null;
  isVisible: boolean;
  onAddToCart: (quantity: number, variant: ProductVariant | null, size: Size | string | null) => Promise<void>;
}

const MobileFloatingButton = ({ 
  product, 
  selectedVariant,
  selectedSize,
  isVisible, 
  onAddToCart 
}: MobileFloatingButtonProps) => {
  const router = useRouter();
  const [addingToCart, setAddingToCart] = useState(false);
  const [addingToBuy, setAddingToBuy] = useState(false);
  const [showAddedMessage, setShowAddedMessage] = useState(false);
  const [quantity, setQuantity] = useState(1);
  
  // ✅ Get price based on selected size
  const getDisplayPrice = () => {
    let basePrice = selectedVariant ? selectedVariant.price : (product?.basePrice || 0);
    
    if (selectedSize && product?.sizes) {
      const sizeData = product.sizes.find(s => s.size === selectedSize);
      if (sizeData && sizeData.price !== null && sizeData.price !== undefined) {
        return sizeData.price;
      }
    }
    
    if (selectedSize && selectedVariant?.sizes) {
      const sizeData = selectedVariant.sizes.find(s => s.size === selectedSize);
      if (sizeData && sizeData.price !== null && sizeData.price !== undefined) {
        return sizeData.price;
      }
    }
    
    return basePrice;
  };

  const currentStock = selectedVariant ? selectedVariant.stock : (product?.stock || 0);
  const isOutOfStock = currentStock <= 0;
  const displayPrice = getDisplayPrice();
  
  const handleCartClick = async () => {
    if (isOutOfStock || !product) return;
    
    try {
      setAddingToCart(true);
      await onAddToCart(quantity, selectedVariant, selectedSize);
      
      setShowAddedMessage(true);
      setTimeout(() => {
        setShowAddedMessage(false);
      }, 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAddingToCart(false);
    }
  };
  
  const handleBuyClick = async () => {
    if (isOutOfStock || !product) return;
    
    try {
      setAddingToBuy(true);
      const buyNowOrder = {
        items: [{
          product: product,
          quantity: quantity,
          selectedVariant: selectedVariant || null,
          selectedSize: selectedSize || null,
          price: displayPrice
        }],
        totalAmount: displayPrice * quantity,
        isBuyNow: true
      };
      sessionStorage.setItem('buyNowOrder', JSON.stringify(buyNowOrder));
      router.push('/checkout?buyNow=true');
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAddingToBuy(false);
    }
  };

  return (
    <div className={`
      lg:hidden fixed bottom-0 left-0 right-0 z-50 
      transform transition-transform duration-300 ease-in-out
      ${isVisible ? 'translate-y-0' : 'translate-y-full'}
    `}>
      <div className="bg-white border-t border-gray-300">
        <div className="flex items-center justify-between px-3 py-1.5 bg-gray-100 border-b border-gray-300">
          <span className="text-xs font-medium text-gray-800">Quantity:</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
              disabled={quantity <= 1}
              className="w-6 h-6 flex items-center justify-center bg-white border border-gray-400 rounded-md text-gray-800 disabled:opacity-40 hover:bg-[#2D1D0B] hover:text-[#F5E9D3] hover:border-[#4A3516] transition-colors duration-200"
            >
              -
            </button>
            <span className="text-sm font-medium w-6 text-center text-gray-900">{quantity}</span>
            <button
              onClick={() => {
                const maxStock = currentStock || 99;
                setQuantity(prev => Math.min(maxStock, prev + 1))
              }}
              disabled={isOutOfStock || quantity >= (currentStock || 99)}
              className="w-6 h-6 flex items-center justify-center bg-white border border-gray-400 rounded-md text-gray-800 disabled:opacity-40 hover:bg-[#2D1D0B] hover:text-[#F5E9D3] hover:border-[#4A3516] transition-colors duration-200"
            >
              +
            </button>
          </div>
        </div>
        
        <div className="flex items-stretch h-10">
          <button
            onClick={handleCartClick}
            disabled={isOutOfStock || addingToCart}
            className={`
              flex-1 flex items-center justify-center gap-1 transition-all duration-300 relative
              ${isOutOfStock || addingToCart
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-[#2D1D0B] text-[#F5E9D3] hover:bg-[#3D2D1B] hover:shadow-[0_8px_30px_rgba(212,175,55,0.15)] border border-[#4A3516] shadow-lg cursor-pointer'
              }
            `}
          >
            {addingToCart ? (
              <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-[#F5E9D3]"></div>
            ) : showAddedMessage ? (
              <span className="text-xs font-medium animate-pulse text-[#F5E9D3]">Added! ✓</span>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="text-xs font-medium">Cart</span>
              </>
            )}
          </button>
          
          <button
            onClick={handleBuyClick}
            disabled={isOutOfStock || addingToBuy}
            className={`
              flex-1 flex items-center justify-center gap-1 transition-colors duration-200
              ${isOutOfStock || addingToBuy
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-[#2D1D0B] text-[#F5E9D3] hover:bg-[#3D2D1B] hover:shadow-[0_8px_30px_rgba(212,175,55,0.15)] border border-[#4A3516] shadow-lg'
              }
            `}
          >
            {addingToBuy ? (
              <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-[#F5E9D3]"></div>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span className="text-xs font-medium">Buy</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Structured Data Component (JSON-LD)
const ProductStructuredData = ({ product, selectedVariant, selectedSize }: { product: Product, selectedVariant: ProductVariant | null, selectedSize: Size | string | null }) => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
  const storeName = process.env.NEXT_PUBLIC_SITE_NAME || '';
  
  let displayPrice = selectedVariant ? selectedVariant.price : (product?.basePrice || 0);
  if (selectedSize && product?.sizes) {
    const sizeData = product.sizes.find(s => s.size === selectedSize);
    if (sizeData && sizeData.price !== null && sizeData.price !== undefined) {
      displayPrice = sizeData.price;
    }
  }
  if (selectedSize && selectedVariant?.sizes) {
    const sizeData = selectedVariant.sizes.find(s => s.size === selectedSize);
    if (sizeData && sizeData.price !== null && sizeData.price !== undefined) {
      displayPrice = sizeData.price;
    }
  }
  
  const displayImage = selectedVariant && selectedVariant.images && selectedVariant.images.length > 0 && selectedVariant.images[0]?.image 
    ? getImageUrl(selectedVariant.images[0].image)
    : product?.images && product.images.length > 0 && product.images[0]?.image 
      ? getImageUrl(product.images[0].image)
      : `${siteUrl}/og-image.png`;
  
  const displayStock = selectedVariant ? selectedVariant.stock : (product?.stock || 0);
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": (product?.name || '') + (selectedVariant ? ` - ${selectedVariant.variantName}` : '') + (selectedSize ? ` (Size: ${selectedSize})` : ''),
    "description": selectedVariant?.description || product?.description || '',
    "image": displayImage,
    "brand": {
      "@type": "Brand",
      "name": product?.seller || storeName,
      "logo": `${siteUrl}/logo.png`
    },
    "sku": selectedVariant?.sku || product?._id || '',
    "gtin": product?.sNo?.toString() || `SNO${product?.sNo}` || '',
    "offers": {
      "@type": "Offer",
      "url": `${siteUrl}/products/${product?.slug || ''}`,
      "priceCurrency": "INR",
      "price": displayPrice,
      "availability": displayStock > 0 
        ? "https://schema.org/InStock" 
        : "https://schema.org/OutOfStock",
      "itemCondition": "https://schema.org/NewCondition",
      "seller": {
        "@type": "Organization",
        "name": product?.seller || storeName
      }
    },
    "category": product?.category && typeof product.category === 'object' ? product.category.name : "Farm Tools",
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "quality",
        "value": "premium"
      },
      {
        "@type": "PropertyValue",
        "name": "handforged",
        "value": "yes"
      },
      {
        "@type": "PropertyValue",
        "name": "durable",
        "value": "yes"
      }
    ]
  };

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": siteUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Farm Tools",
        "item": `${siteUrl}/products`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": (product?.name || '') + (selectedVariant ? ` - ${selectedVariant.variantName}` : '') + (selectedSize ? ` (Size: ${selectedSize})` : ''),
        "item": `${siteUrl}/products/${product?.slug || ''}`
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbData)
        }}
      />
    </>
  );
};

// Helper function to format weight display
const formatWeightDisplay = (weight: number, unit: string): string => {
  if (!weight || weight <= 0) return '';
  
  let displayWeight = weight;
  let displayUnit = unit;
  
  if (unit === 'gram' && weight >= 1000) {
    displayWeight = weight / 1000;
    displayUnit = 'kg';
  } else if (unit === 'ml' && weight >= 1000) {
    displayWeight = weight / 1000;
    displayUnit = 'liter';
  }
  
  const formattedWeight = Number.isInteger(displayWeight) 
    ? displayWeight.toString()
    : parseFloat(displayWeight.toFixed(2)).toString();
  
  return `${formattedWeight} ${displayUnit}`;
};

export default function ClientProductDetail({ product, randomProducts }: ClientProductDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedSize, setSelectedSize] = useState<Size | string | null>(null);
  const [currentImages, setCurrentImages] = useState(product?.images || []);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { addToCart, cart } = useCart();
  const router = useRouter();

  const hasSizes = product?.sizes && product.sizes.length > 0;

  const getDisplayPrice = () => {
    let basePrice = selectedVariant ? selectedVariant.price : (product?.basePrice || 0);
    
    if (selectedSize && product?.sizes) {
      const sizeData = product.sizes.find(s => s.size === selectedSize);
      if (sizeData && sizeData.price !== null && sizeData.price !== undefined) {
        return sizeData.price;
      }
    }
    
    if (selectedSize && selectedVariant?.sizes) {
      const sizeData = selectedVariant.sizes.find(s => s.size === selectedSize);
      if (sizeData && sizeData.price !== null && sizeData.price !== undefined) {
        return sizeData.price;
      }
    }
    
    return basePrice;
  };

  const getOriginalPrice = () => {
    return selectedVariant?.originalPrice || product?.originalPrice || null;
  };

  const displayPrice = getDisplayPrice();
  const originalPrice = getOriginalPrice();
  const discountPercentage = originalPrice && displayPrice < originalPrice 
    ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100) 
    : selectedVariant?.discountPercentage || 0;

  // Set default variant on component mount
  useEffect(() => {
    console.log('Product loaded:', product);
    console.log('Product variants:', product?.variants);
    
    if (product?.variants && product.variants.length > 0) {
      const defaultVariant = product.variants.find(v => v.isDefault) || product.variants[0];
      console.log('Default variant selected:', defaultVariant);
      console.log('Default variant images:', defaultVariant.images);
      
      setSelectedVariant(defaultVariant);
      
      if (defaultVariant.images && defaultVariant.images.length > 0) {
        setCurrentImages(defaultVariant.images);
      }
    }
    
    if (hasSizes && product.sizes && product.sizes.length > 0) {
      setSelectedSize(product.sizes[0].size);
    }
  }, [product, hasSizes]);

  // Handle variant selection
  const handleVariantSelect = (variant: ProductVariant) => {
    console.log('📦 Variant clicked:', variant.variantName);
    console.log('🖼️ Variant images:', variant.images);
    
    setSelectedVariant(variant);
    setSelectedImageIndex(0);
    
    if (variant.sizes && variant.sizes.length > 0) {
      setSelectedSize(variant.sizes[0].size);
    } else if (product?.sizes && product.sizes.length > 0) {
      setSelectedSize(product.sizes[0].size);
    } else {
      setSelectedSize(null);
    }
    
    if (variant.images && variant.images.length > 0) {
      console.log('✅ Setting variant images:', variant.images);
      setCurrentImages(variant.images);
    } else {
      console.log('⚠️ No variant images, using product images');
      setCurrentImages(product?.images || []);
    }
  };

  // Handle size selection
  const handleSizeSelect = (size: Size | string) => {
    setSelectedSize(size);
  };

  // Handle image thumbnail click
  const handleImageThumbnailClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  // Handle scroll to show/hide floating button
  const handleScroll = useCallback(() => {
    if (typeof window !== 'undefined') {
      const currentScrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      const isScrollingUp = currentScrollY < lastScrollY;
      const isPastThreshold = currentScrollY > 100;
      const isNotAtBottom = currentScrollY < documentHeight - windowHeight - 100;
      
      setShowFloatingButton(isScrollingUp && isPastThreshold && isNotAtBottom);
      setLastScrollY(currentScrollY);
    }
  }, [lastScrollY]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  const handleMobileAddToCart = async (quantity: number, variant: ProductVariant | null, size: Size | string | null) => {
    if (!product) {
      alert('Product not found');
      return;
    }
    
    try {
      await addToCart(product, quantity, variant || undefined, size || undefined);
      return;
    } catch (error) {
      console.error('❌ Mobile - Error adding to cart:', error);
      throw error;
    }
  };

  // Buy Now function
  const handleBuyNow = async () => {
    if (!product) {
      alert('Product not found');
      return;
    }
    
    try {
      const buyNowOrder = {
        items: [{
          product: product,
          quantity: quantity,
          selectedVariant: selectedVariant || null,
          selectedSize: selectedSize || null,
          price: displayPrice,
          productName: product.name,
          variantName: selectedVariant?.variantName || null
        }],
        totalAmount: displayPrice * quantity,
        isBuyNow: true
      };
      
      sessionStorage.setItem('buyNowOrder', JSON.stringify(buyNowOrder));
      router.push('/checkout?buyNow=true');
    } catch (error) {
      console.error('❌ Error in Buy Now:', error);
      alert('Failed to process Buy Now. Please try again.');
    }
  };

  const currentStock = selectedVariant ? selectedVariant.stock : (product?.stock || 0);

  const getAvailableSizes = () => {
    if (selectedVariant && selectedVariant.sizes && selectedVariant.sizes.length > 0) {
      return selectedVariant.sizes;
    }
    return product?.sizes || [];
  };

  const availableSizes = getAvailableSizes();

  const groupedSpecifications = () => {
    if (!product?.specifications || !Array.isArray(product.specifications)) {
      return [];
    }

    const groups: { [key: string]: Array<{ key: string; value: string }> } = {};
    
    product.specifications.forEach(spec => {
      const category = 'Details';
      
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(spec);
    });
    
    return Object.entries(groups);
  };

  const specGroups = groupedSpecifications();

  if (!product) {
    return (
      <div className="min-h-screen bg-[#f2f2f2] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-800">Product not found</h1>
          <p className="text-gray-600 mt-2">The product you are looking for does not exist.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ProductStructuredData product={product} selectedVariant={selectedVariant} selectedSize={selectedSize} />
      
      <div className="min-h-screen bg-white pb-9 lg:pb-0">
        <div className="mx-auto">
          
          <div className="bg-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-4">
              {/* Product Images */}
              <div className="w-full">
                <div className="relative w-full overflow-hidden rounded-lg mt-5">
                  <div className="relative w-full h-auto min-h-[400px] lg:min-h-[500px] mb-3">
                    {currentImages && currentImages.length > selectedImageIndex && currentImages[selectedImageIndex]?.image ? (
                      <>
                        {currentImages.length > 1 && (
                          <button
                            onClick={() => handleImageThumbnailClick(Math.max(0, selectedImageIndex - 1))}
                            disabled={selectedImageIndex === 0}
                            className="absolute top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/80 hover:bg-[#2D1D0B] hover:text-[#F5E9D3] shadow-lg border border-gray-300 hover:border-[#4A3516] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            style={{ top: '50%', left: '10%' }}
                            aria-label="Previous image"
                          >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                        )}

                        <Image
                          src={getImageUrl(currentImages[selectedImageIndex].image)}
                          alt={`${product.name}${selectedVariant ? ` - ${selectedVariant.variantName}` : ''}`}
                          fill
                          className="object-contain" 
                          priority
                          sizes="(max-width: 768px) 100vw, 50vw"
                          onError={(e) => {
                            console.error('Image failed to load:', e);
                          }}
                        />
                        
                        {currentImages.length > 1 && (
                          <button
                            onClick={() => handleImageThumbnailClick(Math.min(currentImages.length - 1, selectedImageIndex + 1))}
                            disabled={selectedImageIndex === currentImages.length - 1}
                            className="absolute right-2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/80 hover:bg-[#2D1D0B] hover:text-[#F5E9D3] shadow-lg border border-gray-300 hover:border-[#4A3516] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            style={{ top: '50%', right: '10%' }}
                          >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        )}
                      </>
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400 text-sm">No image</span>
                      </div>
                    )}
                  </div>

                  {/* Image Thumbnail Gallery */}
                  {currentImages && currentImages.length > 1 && (
                    <div className="mt-4">
                      <div className="flex justify-center items-center gap-2">
                        <div className="flex items-center gap-2">
                          {(() => {
                            let startIndex = selectedImageIndex - 2;
                            if (startIndex < 0) startIndex = 0;
                            if (startIndex > currentImages.length - 5) startIndex = Math.max(0, currentImages.length - 5);
                            
                            const visibleThumbnails = currentImages.slice(startIndex, startIndex + 5);
                            
                            return visibleThumbnails.map((img, localIndex) => {
                              const actualIndex = startIndex + localIndex;
                              
                              return (
                                <button
                                  key={actualIndex}
                                  onClick={() => handleImageThumbnailClick(actualIndex)}
                                  className={`
                                    flex-shrink-0 w-16 h-16 md:w-20 md:h-20 relative rounded-md overflow-hidden transition-all
                                    ${selectedImageIndex === actualIndex 
                                      ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/10 scale-105' 
                                      : 'border-gray-200 hover:border-[#D4AF37]/60'
                                    }
                                  `}
                                >
                                  {img.image ? (
                                    <Image
                                      src={getImageUrl(img.image)}
                                      alt={`${product.name} - View ${actualIndex + 1}`}
                                      fill
                                      className="object-cover"
                                      sizes="80px"
                                    />
                                  ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                      <span className="text-gray-400 text-xs">Image {actualIndex + 1}</span>
                                    </div>
                                  )}
                                  
                                  {selectedImageIndex === actualIndex && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/10 via-[#D4AF37]/10 to-[#D4AF37]/10 flex items-center justify-center">
                                      <div className="w-6 h-6 rounded-full bg-[#2D1D0B] border border-[#4A3516] flex items-center justify-center">
                                        <svg className="w-3 h-3 text-[#F5E9D3]" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                      </div>
                                    </div>
                                  )}
                                </button>
                              );
                            });
                          })()}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Product Details */}
              <div className="space-y-3 p-3 sm:p-4">
                {/* Product Name */}
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                  {product.name}
                  {selectedVariant && (
                    <span className="text-base font-normal text-gray-600 ml-2">
                      - {selectedVariant.variantName}
                    </span>
                  )}
                </h1>

                {/* Variant Selection */}
                {product.variants && product.variants.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-900">Select Pack:</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.variants.map((variant) => {
                        const weightDisplay = variant.weight && variant.weightUnit 
                          ? formatWeightDisplay(variant.weight, variant.weightUnit)
                          : '';
                        
                        return (
                          <button
                            key={variant._id || variant.variantName}
                            onClick={() => handleVariantSelect(variant)}
                            className={`
                              px-3 py-2 rounded-lg text-sm font-medium transition-all relative
                              ${selectedVariant?.variantName === variant.variantName
                                ? 'bg-[#2D1D0B] text-[#F5E9D3] border-2 border-[#4A3516] shadow-[0_8px_30px_rgba(212,175,55,0.15)]'
                                : 'bg-gray-100 text-gray-800 border border-gray-300 hover:bg-[#2D1D0B] hover:text-[#F5E9D3] hover:border-[#4A3516] hover:shadow-[0_8px_30px_rgba(212,175,55,0.15)]'
                              }
                            `}
                          >
                            <div className="text-center">
                              <div className="font-medium">
                                {variant.variantName}
                              </div>
                              {weightDisplay && (
                                <div className="text-xs mt-1 opacity-75">
                                  {weightDisplay}
                                </div>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* SIZE SELECTION */}
                {availableSizes.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-900">Select Size:</h3>
                    <div className="flex flex-wrap gap-2">
                      {availableSizes.map((size) => {
                        const isSelected = selectedSize === size.size;
                        
                        return (
                          <button
                            key={size.size}
                            onClick={() => handleSizeSelect(size.size)}
                            className={`
                              px-4 py-2 rounded-lg text-sm font-medium transition-all relative
                              ${isSelected
                                ? 'bg-[#2D1D0B] text-[#F5E9D3] border-2 border-[#4A3516] shadow-[0_8px_30px_rgba(212,175,55,0.15)]'
                                : 'bg-gray-100 text-gray-800 border border-gray-300 hover:bg-[#2D1D0B] hover:text-[#F5E9D3] hover:border-[#4A3516] hover:shadow-[0_8px_30px_rgba(212,175,55,0.15)]'
                              }
                            `}
                          >
                            <span>{size.size}</span>
                          </button>
                        );
                      })}
                    </div>
                    {selectedSize && (
                      <p className="text-xs text-gray-500">
                        Selected: {selectedSize}
                      </p>
                    )}
                  </div>
                )}

                {/* Price - UPDATES BASED ON SELECTED SIZE */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {(() => {
                      const basePrice = selectedVariant ? selectedVariant.price : product.basePrice;
                      const isSizePrice = selectedSize && availableSizes.length > 0;
                      const sizeData = isSizePrice ? availableSizes.find(s => s.size === selectedSize) : null;
                      const isPriceDifferent = sizeData && sizeData.price !== null && sizeData.price !== undefined && sizeData.price !== basePrice;
                      
                      if (isPriceDifferent && sizeData && sizeData.price !== null) {
                        return (
                          <span className="text-xl sm:text-2xl font-bold text-gray-800">
                            ₹{sizeData.price.toLocaleString('en-IN')}
                          </span>
                        );
                      } else {
                        return (
                          <>
                            <span className="text-xl sm:text-2xl font-bold text-gray-800">
                              ₹{displayPrice.toLocaleString('en-IN')}
                            </span>
                            {originalPrice && originalPrice > displayPrice && (
                              <>
                                <span 
                                  className="text-lg text-gray-500"
                                  style={{ 
                                    textDecoration: 'line-through',
                                    textDecorationColor: '#6b7280',
                                    textDecorationThickness: '2px'
                                  }}
                                >
                                  ₹{originalPrice.toLocaleString('en-IN')}
                                </span>
                                <span className="text-sm font-bold text-[#D4AF37]">
                                  {discountPercentage}% OFF
                                </span>
                              </>
                            )}
                          </>
                        );
                      }
                    })()}
                  </div>
                </div>

                {/* Add to Cart */}
                <div className="pt-2">
                  <div className="max-w-sm">
                    {/* Desktop */}
                    <div className="hidden lg:block">
                      <div className="flex gap-3">
                        <div className="flex-1">
                          <AddToCartButton 
                            product={product} 
                            selectedVariant={selectedVariant || undefined}
                            selectedSize={selectedSize || undefined}
                            quantity={quantity}
                            onQuantityChange={setQuantity}
                          />
                        </div>
                        
                        <div className="flex-1">
                          <button
                            onClick={handleBuyNow}
                            disabled={currentStock <= 0}
                            className={`
                              w-full py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2 mt-10
                              transition-all duration-300 shadow cursor-pointer text-sm
                              ${currentStock <= 0 
                                ? 'bg-black text-gray-200 cursor-not-allowed' 
                                : 'bg-black text-[#F5E9D3] hover:bg-[#3D2D1B] hover:shadow-[0_8px_30px_rgba(212,175,55,0.15)] border border-[#4A3516] shadow-lg'
                              }
                            `}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            Buy Now
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Mobile - SINGLE ROW BUTTONS */}
                    <div className="lg:hidden">
                      <div className="flex flex-row gap-2">
                        <div className="flex-1">
                          <AddToCartButton 
                            product={product} 
                            selectedVariant={selectedVariant || undefined}
                            selectedSize={selectedSize || undefined}
                          />
                        </div>
                        
                        <div className="flex-1">
                          <button
                            onClick={handleBuyNow}
                            disabled={currentStock <= 0}
                            className={`
                              w-full py-2.5 px-2 rounded-lg font-medium text-xs flex items-center justify-center gap-1
                              transition-all duration-200 mt-10.5
                              ${currentStock <= 0 
                                ? 'bg-black text-gray-400 cursor-not-allowed' 
                                : 'bg-black text-[#F5E9D3] hover:bg-[#3D2D1B] hover:shadow-[0_8px_30px_rgba(212,175,55,0.15)] border border-[#4A3516] shadow-lg'
                              }
                            `}
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            <span className="text-[10px] xs:text-xs font-medium">Buy Now</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Product Details */}
                <div className="space-y-3 pt-2">
                  {/* Specifications */}
                  {specGroups.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium text-gray-900">Specifications</h3>
                      {specGroups.map(([category, specs], groupIndex) => (
                        <div key={groupIndex} className="space-y-1">
                          <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">{category}</h4>
                          <div className="space-y-1">
                            {specs.map((spec, index) => (
                              <div key={index} className="flex text-sm">
                                <span className="font-medium text-gray-700 w-2/5">{spec.key}:</span>
                                <span className="text-gray-600 w-3/5">{spec.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Key Features */}
                  {(selectedVariant?.features && selectedVariant.features.length > 0) || 
                   (product.keyFeatures && product.keyFeatures.length > 0) ? (
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-900">Key Features</h3>
                      <ul className="space-y-1">
                        {selectedVariant?.features && selectedVariant.features.length > 0 && (
                          <>
                            {selectedVariant.features.map((feature, index) => (
                              <li key={`variant-${index}`} className="flex items-start text-sm">
                                <span className="text-[#D4AF37] mr-2 mt-0.5">✓</span>
                                <span className="text-gray-700">{feature}</span>
                              </li>
                            ))}
                          </>
                        )}
                        {product.keyFeatures && product.keyFeatures.length > 0 && (
                          <>
                            {product.keyFeatures.map((feature, index) => (
                              <li key={`product-${index}`} className="flex items-start text-sm">
                                <span className="text-[#D4AF37] mr-2 mt-0.5">✓</span>
                                <span className="text-gray-700">{feature}</span>
                              </li>
                            ))}
                          </>
                        )}
                      </ul>
                    </div>
                  ) : null}

                  {/* Description */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1">Description</h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {selectedVariant?.description || product.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {randomProducts && randomProducts.length > 0 && (
            <div className="p-3 sm:p-8 mt-5 border-t border-gray-300 bg-white">
              <h2 className="text-base font-bold text-gray-800 mb-2 text-center">You may also like</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {randomProducts.slice(0, 4).map((relatedProduct) => (
                  <div key={relatedProduct._id} className="scale-95">
                    <ProductCard product={relatedProduct} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Mobile Floating Button */}
        {product && (
          <MobileFloatingButton 
            product={product} 
            selectedVariant={selectedVariant}
            selectedSize={selectedSize}
            isVisible={showFloatingButton}
            onAddToCart={handleMobileAddToCart}
          />
        )}
      </div>
    </>
  );
}