'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from "next/image"

export default function CartPage() {
  const { cart, updateCartItem, removeFromCart, clearCart, isGuest } = useCart();
  const router = useRouter();

  const handleCheckout = () => {
    router.push('/checkout');
  };

  const itemCount = cart.totalItems || 0;
  const subtotal = cart.totalPrice || 0;
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-white py-8 sm:py-12 cursor-pointer">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mx-auto text-center bg-white rounded-lg shadow-sm border border-stone-200 p-6 sm:p-8">
            <svg className="w-12 h-12 sm:w-16 sm:h-16 text-stone-400 mx-auto mb-3 sm:mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h1 className="text-xl sm:text-2xl font-bold text-stone-900 mb-3 sm:mb-4">Your Cart is Empty</h1>
            <p className="text-stone-600 mb-4 sm:mb-6 text-sm sm:text-base">Add some tech products to your cart to see them here.</p>
            <Link 
              href="/products"
              className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 hover:shadow-orange-500/30 transition-all duration-200 font-medium text-sm sm:text-base shadow-lg cursor-pointer"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900">Shopping Cart</h1>
          {isGuest && (
            <div className="bg-orange-50 border border-orange-200 text-orange-700 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm">
              <p>
                🛒 Shopping as Guest •{' '}
                <Link href="/signup" className="font-semibold underline hover:text-orange-600 transition-colors duration-200">
                  Sign up to save your cart
                </Link>
              </p>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-stone-200 p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-stone-900">
                  Cart Items ({itemCount})
                </h2>
                <button 
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-800 text-xs sm:text-sm font-medium transition-colors duration-200 cursor-pointer"
                >
                  Clear Cart
                </button>
              </div>

              <div className="space-y-4 sm:space-y-6">
                {cart.items.map((item) => {
                  const getImageUrl = () => {
                    if (item.variantImages && item.variantImages.length > 0) {
                      const variantImage = item.variantImages[0];
                      if (variantImage && variantImage.trim() !== '') {
                        return `${process.env.NEXT_PUBLIC_BASE_URL}${variantImage}`;
                      }
                    }
                    
                    if (item.selectedVariant?.images && item.selectedVariant.images.length > 0) {
                      const variantImage = item.selectedVariant.images[0]?.image;
                      if (variantImage && variantImage.trim() !== '') {
                        return `${process.env.NEXT_PUBLIC_BASE_URL}${variantImage}`;
                      }
                    }
                    
                    const productImage = item.product?.images?.[0]?.image;
                    if (productImage && productImage.trim() !== '') {
                      return `${process.env.NEXT_PUBLIC_BASE_URL}${productImage}`;
                    }
                    
                    return null;
                  };

                  const imageUrl = getImageUrl();
                  
                  // ✅ Get size display info
                  const selectedSize = item.selectedSize || '';
                  const hasSize = selectedSize !== '';
                  const sizePrice = item.selectedSizePrice;
                  const isSizePriceDifferent = sizePrice !== null && sizePrice !== item.price;
                  
                  return (
                    <div key={item._id} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 border-b border-stone-200 pb-4 sm:pb-6">
                      {/* Product Image and Info - Mobile Layout */}
                      <div className="flex items-center gap-3 sm:gap-4">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={item.selectedVariant?.variantName || item.product?.name || 'Product image'}
                            width={80}
                            height={80}
                            className="object-cover rounded-lg w-16 h-16 sm:w-20 sm:h-20"
                          />
                        ) : (
                          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-stone-200 rounded-lg flex items-center justify-center">
                            <svg className="w-8 h-8 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                        
                        {/* Product Info - Mobile Layout */}
                        <div className="sm:hidden flex-grow">
                          <h3 className="font-semibold text-stone-900 text-sm line-clamp-2">
                            {item.product?.name || 'Unnamed Product'}
                          </h3>
                          {item.selectedVariant && (
                            <p className="text-orange-600 text-xs font-medium">📦 {item.selectedVariant.variantName}</p>
                          )}
                          {/* ✅ ADDED: Display size */}
                          {hasSize && (
                            <p className="text-blue-600 text-xs font-medium">📏 Size: {selectedSize}</p>
                          )}
                          {/* ✅ ADDED: Show if size has special price */}
                          {isSizePriceDifferent && (
                            <p className="text-green-600 text-xs">💰 Size Price: ₹{sizePrice}</p>
                          )}
                          <p className="text-stone-600 text-xs">₹{item.price || 0}</p>
                          {item.product?.stock && item.product.stock < 10 && (
                            <p className="text-orange-600 text-xs mt-1">
                              Only {item.product.stock} left
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {/* Product Info - Desktop Layout */}
                      <div className="hidden sm:block flex-grow">
                        <h3 className="font-semibold text-stone-900">
                          {item.product?.name || 'Unnamed Product'}
                        </h3>
                        {item.selectedVariant && (
                          <p className="text-orange-600 text-sm font-medium">📦 {item.selectedVariant.variantName}</p>
                        )}
                        {/* ✅ ADDED: Display size */}
                        {hasSize && (
                          <p className="text-blue-600 text-sm font-medium">📏 Size: {selectedSize}</p>
                        )}
                        {/* ✅ ADDED: Show if size has special price */}
                        {isSizePriceDifferent && (
                          <p className="text-green-600 text-sm">💰 Size Price: ₹{sizePrice}</p>
                        )}
                        <p className="text-stone-600 text-sm">₹{item.price || 0}</p>
                        {item.product?.stock && item.product.stock < 10 && (
                          <p className="text-orange-600 text-xs mt-1">
                            Only {item.product.stock} left in stock
                          </p>
                        )}
                      </div>
                      
                      {/* Quantity Controls and Price - Mobile Layout */}
                      <div className="flex items-center justify-between sm:justify-center sm:space-x-2">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => updateCartItem(item._id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-stone-300 flex items-center justify-center hover:bg-orange-500 hover:text-white hover:border-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm transition-all duration-200 cursor-pointer"
                          >
                            -
                          </button>
                          <span className="w-8 sm:w-12 text-center text-sm sm:text-base">{item.quantity}</span>
                          <button 
                            onClick={() => updateCartItem(item._id, item.quantity + 1)}
                            disabled={item.quantity >= (item.product?.stock || 0)}
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-stone-300 flex items-center justify-center hover:bg-orange-500 hover:text-white hover:border-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm transition-all duration-200 cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                        
                        {/* Price and Remove - Mobile Layout */}
                        <div className="sm:hidden text-right">
                          <p className="font-semibold text-stone-900 text-sm">₹{((item.price || 0) * item.quantity).toFixed(2)}</p>
                          <button 
                            onClick={() => removeFromCart(item._id)}
                            className="text-red-600 hover:text-red-800 text-xs transition-colors duration-200 cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      
                      {/* Price and Remove - Desktop Layout */}
                      <div className="hidden sm:block text-right min-w-[100px]">
                        <p className="font-semibold text-stone-900">₹{((item.price || 0) * item.quantity).toFixed(2)}</p>
                        <button 
                          onClick={() => removeFromCart(item._id)}
                          className="text-red-600 hover:text-red-800 text-sm transition-colors duration-200 cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-stone-200 p-4 sm:p-6 sticky top-4">
              <h2 className="text-lg sm:text-xl font-semibold text-stone-900 mb-3 sm:mb-4">Order Summary</h2>
              
              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                <div className="flex justify-between text-sm sm:text-base">
                  <span>Subtotal ({itemCount} items)</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base">
                  <span>Shipping</span>
                  <span className="text-orange-600">FREE</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base">
                  <span>Tax (5%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 sm:pt-3 flex justify-between text-base sm:text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-stone-700">₹{total.toFixed(2)}</span>
                </div>
              </div>

              <button 
                onClick={handleCheckout}
                className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 hover:shadow-orange-500/30 transition-all duration-200 font-medium mb-3 sm:mb-4 text-sm sm:text-base shadow-lg cursor-pointer"
              >
                Proceed to Checkout
              </button>

              {isGuest && (
                <div className="text-center mb-3 sm:mb-4 space-y-2">
                  <p className="text-xs sm:text-sm text-stone-600">Want faster checkout?</p>
                  <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
                    <Link 
                      href="/login"
                      className="bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 hover:shadow-orange-500/30 transition-all duration-200 font-medium text-center text-xs sm:text-sm shadow-lg cursor-pointer"
                    >
                      Login
                    </Link>
                    <Link 
                      href="/signup"
                      className="border border-orange-300 text-orange-600 py-2 px-4 rounded-lg hover:bg-orange-50 transition-all duration-200 font-medium text-center text-xs sm:text-sm"
                    >
                      Sign Up
                    </Link>
                  </div>
                </div>
              )}
              
              <Link 
                href="/products"
                className="w-full border border-orange-300 text-orange-600 py-3 rounded-lg hover:bg-orange-50 transition-all duration-200 font-medium text-center block text-sm sm:text-base"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}