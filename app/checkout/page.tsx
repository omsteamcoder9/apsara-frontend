'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  createRazorpayOrder, 
  verifyPayment, 
  createGuestOrder, 
  createUserOrder 
} from '@/lib/payment-api';

declare global {
  interface Window {
    Razorpay: {
      new (options: RazorpayOptions): RazorpayInstance;
    };
  }
}

interface RazorpayOptions {
  key: string | undefined;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image: string;
  order_id: string;
  handler: (response: RazorpayResponse) => Promise<void> | void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  notes: {
    orderId: string;
    address: string;
  };
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
}

interface RazorpayInstance {
  open: () => void;
  on: (event: 'payment.failed', handler: (response: RazorpayErrorResponse) => void) => void;
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayErrorResponse {
  error: {
    code: string;
    description: string;
    source: string;
    step: string;
    reason: string;
  };
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

interface PublicSettings {
  razorpayEnabled: boolean;
  razorpayKeyId: string;
  cashOnDeliveryEnabled: boolean;
  contactNumber: string;
  contactEmail: string;
  companyAddress: string;
  siteName: string;
  siteTitle: string;
  siteDescription: string;
  footerText: string;
  footerLinks: Array<{name: string; url: string}>;
  facebookUrl: string;
  twitterUrl: string;
  instagramUrl: string;
  linkedinUrl: string;
  maintenanceMode: boolean;
  metaKeywords: string[];
  googleAnalyticsId: string;
  updatedAt: Date;
}

export default function CheckoutPage() {
  const { cart, clearCart, setBuyNowMode } = useCart();
  const { user, token } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isBuyNowParam = searchParams.get('buyNow');

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
  });

  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [paymentSettings, setPaymentSettings] = useState<{
    razorpayEnabled: boolean; 
    razorpayKeyId: string;
    cashOnDeliveryEnabled: boolean
  }>({
    razorpayEnabled: false,
    razorpayKeyId: '',
    cashOnDeliveryEnabled: true
  });
  const [settingsLoading, setSettingsLoading] = useState(true);
  
  const [buyNowOrder, setBuyNowOrder] = useState<any>(null);
  const [isBuyNowMode, setIsBuyNowMode] = useState(false);
  const [checkingBuyNow, setCheckingBuyNow] = useState(true);

  useEffect(() => {
    if (user?.email && !formData.email) {
      setFormData(prev => ({ ...prev, email: user.email }));
    }
  }, [user, formData.email]);

  useEffect(() => {
    if (isBuyNowParam === 'true') {
      const storedOrder = sessionStorage.getItem('buyNowOrder');
      console.log('🔍🔍🔍 DEBUG: storedOrder from sessionStorage:', storedOrder);
      if (storedOrder) {
        try {
          const order = JSON.parse(storedOrder);
          console.log('🔍🔍🔍 DEBUG: Parsed buyNowOrder:', order);
          setBuyNowOrder(order);
          setIsBuyNowMode(true);
          if (setBuyNowMode) {
            setBuyNowMode(true);
          }
        } catch (e) {
          console.error('Error parsing buyNowOrder:', e);
        }
      } else {
        console.log('🔍🔍🔍 DEBUG: No storedOrder found in sessionStorage');
      }
    }
    setCheckingBuyNow(false);
  }, [isBuyNowParam, setBuyNowMode]);

  useEffect(() => {
    if (settingsLoading || checkingBuyNow) return;
    
    const displayItems = getDisplayItems();
    const hasItems = displayItems.length > 0;
    
    const storedCart = sessionStorage.getItem('checkoutCart');
    let hasStoredItems = false;
    if (storedCart) {
      try {
        const checkoutData = JSON.parse(storedCart);
        if (checkoutData.items && checkoutData.items.length > 0) {
          hasStoredItems = true;
        }
      } catch (e) {}
    }
    
    const buyNowOrderStorage = sessionStorage.getItem('buyNowOrder');
    let hasBuyNowItems = false;
    if (buyNowOrderStorage) {
      try {
        const order = JSON.parse(buyNowOrderStorage);
        if (order.items && order.items.length > 0) {
          hasBuyNowItems = true;
        }
      } catch (e) {}
    }
    
    if (!hasItems && !hasStoredItems && !hasBuyNowItems && !isBuyNowMode) {
      console.log('🔄 No items found anywhere, redirecting to cart...');
      router.push('/cart');
    }
  }, [settingsLoading, checkingBuyNow, isBuyNowMode, router]);

  useEffect(() => {
    if (user && !token) {
      setAuthError('Authentication token is missing. Please log in again.');
    } else {
      setAuthError('');
    }
  }, [user, token]);

  useEffect(() => {
    fetchPaymentSettings();
  }, []);

  const fetchPaymentSettings = async () => {
    try {
      setSettingsLoading(true);
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      
      const response = await fetch(`${API_URL}/settings/public`);
      const data = await response.json();
      
      if (data.success) {
        const settings: PublicSettings = data.data;
        setPaymentSettings({
          razorpayEnabled: settings.razorpayEnabled,
          razorpayKeyId: settings.razorpayKeyId || '',
          cashOnDeliveryEnabled: settings.cashOnDeliveryEnabled
        });
      }
    } catch (error) {
      console.error('Error fetching payment settings:', error);
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleAuthError = () => {
    setAuthError('Your session has expired. Please log in again.');
  };

  const getDisplayItems = () => {
    if (isBuyNowMode && buyNowOrder) {
      return buyNowOrder.items;
    }
    return cart.items;
  };

  const getSubtotal = () => {
    if (isBuyNowMode && buyNowOrder) {
      return buyNowOrder.totalAmount;
    }
    return cart.totalPrice || 0;
  };

  const getItemCount = () => {
    if (isBuyNowMode && buyNowOrder) {
      return buyNowOrder.items.length;
    }
    return cart.totalItems || 0;
  };

  const handleRazorpayPayment = async (): Promise<void> => {
    console.log('🚨🚨🚨 INSIDE handleRazorpayPayment - BEFORE ANYTHING ELSE 🚨🚨🚨');
    console.log('isBuyNowMode:', isBuyNowMode);
    console.log('buyNowOrder:', buyNowOrder);
    console.log('cart.items:', cart.items);
    console.log('getDisplayItems():', getDisplayItems());
    try {
      setPaymentLoading(true);
      setAuthError('');

      if (!paymentSettings.razorpayEnabled) {
        alert('Razorpay payment is currently disabled. Please use manual payment.');
        setPaymentLoading(false);
        return;
      }

      if (!paymentSettings.razorpayKeyId) {
        alert('Razorpay configuration is incomplete. Please contact the store administrator.');
        setPaymentLoading(false);
        return;
      }

      if (!formData.firstName || !formData.lastName || !formData.email || 
          !formData.phone || !formData.address || !formData.city || 
          !formData.state || !formData.pincode) {
        alert('Please fill all the required fields');
        setPaymentLoading(false);
        return;
      }

      if (user && !token) {
        handleAuthError();
        setPaymentLoading(false);
        return;
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert('Razorpay SDK failed to load. Please check your internet connection.');
        setPaymentLoading(false);
        return;
      }

      let orderId: string;
      let finalAmount: number;
      const displayItems = getDisplayItems();

      try {
        const shippingAddress = {
          fullName: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          postalCode: formData.pincode,
          country: formData.country
        };

        if (user && token) {
          if (!token) {
            handleAuthError();
            setPaymentLoading(false);
            return;
          }

          const orderData: any = {
            products: displayItems.map((item: any) => ({
              product: item.product._id,
              variantId: item.selectedVariant?._id,
              variantName: item.selectedVariant?.variantName,
              selectedSize: item.selectedSize || '',
              selectedSizePrice: item.selectedSizePrice || null,
              price: item.price,
              quantity: item.quantity,
              weight: item.weight || item.selectedVariant?.weight || 0,
              weightUnit: item.weightUnit || item.selectedVariant?.weightUnit || 'gram'
            })),
            shippingAddress: shippingAddress,
            paymentMethod: 'razorpay' as const
          };

          if (isBuyNowMode) {
            orderData.skipCartClear = true;
          }

          console.log('Creating user order with data:', orderData);
          const orderResult = await createUserOrder(orderData, token);
          orderId = orderResult.orderId;
          finalAmount = orderResult.finalAmount;
        } else {
          const orderData: any = {
            products: displayItems.map((item: any) => ({
              product: item.product._id,
              variantId: item.selectedVariant?._id,
              variantName: item.selectedVariant?.variantName,
              selectedSize: item.selectedSize || '',
              selectedSizePrice: item.selectedSizePrice || null,
              price: item.price,
              quantity: item.quantity,
              weight: item.weight || item.selectedVariant?.weight || 0,
              weightUnit: item.weightUnit || item.selectedVariant?.weightUnit || 'gram'
            })),
            shippingAddress: shippingAddress,
            guestUser: {
              name: `${formData.firstName} ${formData.lastName}`,
              email: formData.email,
              phone: formData.phone
            },
            paymentMethod: 'razorpay' as const
          };

          if (isBuyNowMode) {
            orderData.skipCartClear = true;
          }

          console.log('Creating guest order with data:', orderData);
          const orderResult = await createGuestOrder(orderData);
          orderId = orderResult.orderId;
          finalAmount = orderResult.finalAmount;
        }

        console.log('Database order created with ID:', orderId, 'Final amount:', finalAmount);

        const razorpayOrder = await createRazorpayOrder(orderId);

        if (!razorpayOrder || !razorpayOrder.id || !razorpayOrder.amount) {
          console.error('Invalid Razorpay order:', razorpayOrder);
          throw new Error('Invalid Razorpay order response - missing required fields');
        }

        console.log('Razorpay order created:', razorpayOrder);

        const razorpayKey = paymentSettings.razorpayKeyId;

        const options: RazorpayOptions = {
          key: razorpayKey,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency || 'INR',
          name: 'ebazz',
          description: 'Order Payment',
          image: '/logo.png',
          order_id: razorpayOrder.id,
          handler: async function (response: RazorpayResponse) {
            try {
              console.log('Razorpay payment response:', response);
              
              const verificationData = {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              };

              console.log('Verifying payment with data:', verificationData);
              const verificationResult = await verifyPayment(verificationData);

              if (verificationResult.success) {
                console.log('Payment verified successfully');
                
                if (isBuyNowMode) {
                  sessionStorage.removeItem('buyNowOrder');
                } else {
                  await clearCart();
                }
                
                if (user && token) {
                  console.log('Redirecting logged-in user to profile page with orderId:', orderId);
                  window.location.href = `/profile?orderSuccess=true&orderId=${orderId}`;
                } else {
                  console.log('Redirecting guest user to order success page with orderId:', orderId);
                  window.location.href = `/order-success?orderId=${orderId}`;
                }
              } else {
                console.error('Payment verification failed');
                alert('Payment verification failed. Please contact support.');
                setPaymentLoading(false);
              }
            } catch (error) {
              console.error('Payment verification error:', error);
              alert('Payment processing failed. Please contact support.');
              setPaymentLoading(false);
            }
          },
          prefill: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            contact: formData.phone,
          },
          notes: {
            orderId: orderId,
            address: formData.address,
          },
          theme: {
            color: '#FB923C',
          },
          modal: {
            ondismiss: function() {
              setPaymentLoading(false);
              alert('Payment cancelled. You can try again.');
            },
          },
        };

        const razorpay = new window.Razorpay(options);
        
        razorpay.on('payment.failed', function (response: RazorpayErrorResponse) {
          console.error('Payment failed:', response.error);
          alert(`Payment failed: ${response.error.description}`);
          setPaymentLoading(false);
        });

        razorpay.open();

      } catch (orderError: unknown) {
        console.error('Order creation error:', orderError);
        
        const errorMessage = orderError instanceof Error ? orderError.message : 'Unknown error occurred';
        
        if (errorMessage.includes('token') || errorMessage.includes('auth') || errorMessage.includes('unauthorized')) {
          handleAuthError();
        } else {
          alert(errorMessage || 'Failed to create order. Please try again.');
        }
        setPaymentLoading(false);
      }
      
    } catch (error: unknown) {
      console.error('Payment error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Payment initialization failed. Please try again.';
      alert(errorMessage);
      setPaymentLoading(false);
    }
  };

  const handleCashOnDelivery = async (): Promise<void> => {
    try {
      setLoading(true);
      setAuthError('');

      if (!paymentSettings.cashOnDeliveryEnabled) {
        alert('manual payment is currently disabled. Please use Razorpay payment.');
        setLoading(false);
        return;
      }

      if (!formData.firstName || !formData.lastName || !formData.email || 
          !formData.phone || !formData.address || !formData.city || 
          !formData.state || !formData.pincode) {
        alert('Please fill all the required fields');
        setLoading(false);
        return;
      }

      if (user && !token) {
        handleAuthError();
        setLoading(false);
        return;
      }

      const shippingAddress = {
        fullName: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        postalCode: formData.pincode,
        country: formData.country
      };

      let orderId: string;
      const displayItems = getDisplayItems();
      
      if (user && token) {
        if (!token) {
          handleAuthError();
          setLoading(false);
          return;
        }

        const orderData: any = {
          products: displayItems.map((item: any) => ({
            product: item.product._id,
            variantId: item.selectedVariant?._id,
            variantName: item.selectedVariant?.variantName,
            selectedSize: item.selectedSize || '',
            selectedSizePrice: item.selectedSizePrice || null,
            price: item.price,
            quantity: item.quantity,
            weight: item.weight || item.selectedVariant?.weight || 0,
            weightUnit: item.weightUnit || item.selectedVariant?.weightUnit || 'gram'
          })),
          shippingAddress: shippingAddress,
          paymentMethod: 'cod' as const
        };

        if (isBuyNowMode) {
          orderData.skipCartClear = true;
        }

        console.log('Creating COD user order:', orderData);
        const orderResult = await createUserOrder(orderData, token);
        orderId = orderResult.orderId;
      } else {
        const orderData: any = {
          products: displayItems.map((item: any) => ({
            product: item.product._id,
            variantId: item.selectedVariant?._id,
            variantName: item.selectedVariant?.variantName,
            selectedSize: item.selectedSize || '',
            selectedSizePrice: item.selectedSizePrice || null,
            price: item.price,
            quantity: item.quantity,
            weight: item.weight || item.selectedVariant?.weight || 0,
            weightUnit: item.weightUnit || item.selectedVariant?.weightUnit || 'gram'
          })),
          shippingAddress: shippingAddress,
          guestUser: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            phone: formData.phone
          },
          paymentMethod: 'cod' as const
        };

        if (isBuyNowMode) {
          orderData.skipCartClear = true;
        }

        console.log('Creating COD guest order:', orderData);
        const orderResult = await createGuestOrder(orderData);
        orderId = orderResult.orderId;
      }

      if (isBuyNowMode) {
        sessionStorage.removeItem('buyNowOrder');
      } else {
        await clearCart();
      }
      
      console.log('COD order created successfully');
      window.location.href = `/order-success?orderId=${orderId}`;
      
    } catch (error: unknown) {
      console.error('COD order error:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Order creation failed. Please try again.';
      
      if (errorMessage.includes('token') || errorMessage.includes('auth') || errorMessage.includes('unauthorized')) {
        handleAuthError();
      } else {
        alert(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  if (settingsLoading || checkingBuyNow) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mx-auto mb-4"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-8 w-8 rounded-full bg-orange-500/20 animate-pulse"></div>
            </div>
          </div>
          <p className="text-stone-600 font-medium">Loading checkout...</p>
        </div>
      </div>
    );
  }

  const displayItems = getDisplayItems();
  const subtotal = getSubtotal();
  const itemCount = getItemCount();
  const tax = subtotal * 0.05;
  const shippingFee = 0;
  const total = subtotal + tax + shippingFee;

  const isAnyPaymentMethodAvailable = paymentSettings.razorpayEnabled || paymentSettings.cashOnDeliveryEnabled;

  if (!isAnyPaymentMethodAvailable) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full border border-stone-200">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-stone-900 mb-2">No Payment Methods Available</h2>
          <p className="text-stone-600 mb-6">All payment methods are currently disabled. Please contact the store administrator.</p>
          <button
            onClick={() => router.push('/cart')}
            className="w-full bg-orange-500 text-white py-3 rounded-xl hover:bg-orange-600 hover:shadow-orange-500/30 transition-all duration-200 font-medium shadow-lg"
          >
            Return to Cart
          </button>
        </div>
      </div>
    );
  }

  // Create a clamped version of items (max 4 items)
  const clampedItems = displayItems.slice(0, 4);
  const hasMoreItems = displayItems.length > 4;

  return (
    <div className="min-h-screen bg-stone-50 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-stone-900 tracking-tight">
              Checkout
            </h1>
            <p className="text-stone-500 mt-1">Complete your order securely</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {!user && !isBuyNowMode && (
              <div className="bg-orange-50 border border-orange-200 text-orange-700 px-4 py-2 rounded-xl text-sm">
                <span>
                  Guest checkout •{' '}
                  <Link href="/signup" className="font-semibold underline hover:text-orange-600 transition-colors">
                    Create account
                  </Link>
                </span>
              </div>
            )}
            {isBuyNowMode && (
              <div className="bg-orange-50 border border-orange-200 text-orange-700 px-4 py-2 rounded-xl text-sm">
                <span>Buy Now Mode</span>
              </div>
            )}
          </div>
        </div>

        {/* Auth Error */}
        {authError && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-2">
              <span>{authError}</span>
            </div>
            <Link href="/login" className="text-red-600 font-semibold hover:text-red-700 underline text-sm whitespace-nowrap">
              Log in again →
            </Link>
          </div>
        )}
        
        {/* Mobile: Order Summary at Top */}
        <div className="lg:hidden mb-6">
          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-4 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-base font-semibold text-stone-900">Order Summary</h2>
              <span className="ml-auto text-xs text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
                {itemCount} items
              </span>
            </div>
            
            <div className="space-y-1.5 max-h-[200px] overflow-y-auto">
              {clampedItems.map((item: any) => {
                return (
                  <div key={item.product._id} className="flex justify-between items-center py-1.5 border-b border-stone-100 last:border-0">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-xs text-stone-900 truncate">{item.product.name}</p>
                      {item.selectedVariant && (
                        <p className="text-[10px] text-orange-600 font-medium truncate">{item.selectedVariant.variantName}</p>
                      )}
                      <p className="text-[10px] text-stone-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-xs text-stone-900 ml-2">₹{((item.price || 0) * item.quantity).toFixed(2)}</p>
                  </div>
                );
              })}
              {hasMoreItems && (
                <p className="text-xs text-stone-500 text-center pt-1">+ {displayItems.length - 4} more items</p>
              )}
            </div>

            <div className="border-t border-stone-200 mt-3 pt-3 space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-stone-600">Subtotal</span>
                <span className="font-medium text-stone-900">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-stone-600">Shipping</span>
                <span className="text-orange-600 font-medium">FREE</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-stone-600">Tax (5%)</span>
                <span className="font-medium text-stone-900">₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold pt-2 border-t border-stone-200">
                <span className="text-stone-900">Total</span>
                <span className="text-orange-600">₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Shipping Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 md:p-8 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-xl font-semibold text-stone-900">
                  {user ? 'Shipping Information' : 'Guest Checkout'}
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 text-sm border border-stone-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-200 bg-stone-50 hover:bg-white"
                    placeholder="First name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 text-sm border border-stone-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-200 bg-stone-50 hover:bg-white"
                    placeholder="Last name"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 text-sm border border-stone-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-200 bg-stone-50 hover:bg-white"
                    placeholder="Enter your email"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 text-sm border border-stone-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-200 bg-stone-50 hover:bg-white"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">
                    Delivery Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2.5 text-sm border border-stone-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-200 bg-stone-50 hover:bg-white resize-none"
                    placeholder="Enter your complete address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 text-sm border border-stone-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-200 bg-stone-50 hover:bg-white"
                    placeholder="City"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 text-sm border border-stone-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-200 bg-stone-50 hover:bg-white"
                    placeholder="State"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">
                    PIN Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    required
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 text-sm border border-stone-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-200 bg-stone-50 hover:bg-white"
                    placeholder="PIN Code"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="country"
                    required
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 text-sm border border-stone-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-200 bg-stone-50 hover:bg-white"
                  >
                    <option value="India">India</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary & Payment (Desktop) */}
          <div className="hidden lg:block space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-xl font-semibold text-stone-900">Order Summary</h2>
                <span className="ml-auto text-sm text-stone-500 bg-stone-100 px-3 py-1 rounded-full">
                  {itemCount} items
                </span>
              </div>
              
              {/* Items list - no scroll, shows all items */}
              <div className="space-y-2">
                {displayItems.map((item: any) => {
                  const itemWeight = item.weight || item.selectedVariant?.weight || 0;
                  const itemWeightUnit = item.weightUnit || item.selectedVariant?.weightUnit || 'gram';
                  const weightDisplay = itemWeight > 0 ? `${itemWeight} ${itemWeightUnit}` : '';
                  const sizeDisplay = item.selectedSize ? `Size: ${item.selectedSize}` : '';
                  
                  return (
                    <div key={item.product._id} className="flex justify-between items-center py-2 border-b border-stone-100 last:border-0">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-stone-900 truncate">{item.product.name}</p>
                        {item.selectedVariant && (
                          <p className="text-xs text-orange-600 font-medium truncate">{item.selectedVariant.variantName}</p>
                        )}
                        <div className="flex flex-wrap gap-2 mt-0.5">
                          {sizeDisplay && (
                            <span className="text-xs text-blue-600 font-medium">{sizeDisplay}</span>
                          )}
                          {weightDisplay && (
                            <span className="text-xs text-stone-500">Weight: {weightDisplay}</span>
                          )}
                          <span className="text-xs text-stone-500">Qty: {item.quantity}</span>
                        </div>
                      </div>
                      <p className="font-semibold text-sm text-stone-900 whitespace-nowrap ml-2">₹{((item.price || 0) * item.quantity).toFixed(2)}</p>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-stone-200 mt-4 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600">Subtotal</span>
                  <span className="font-medium text-stone-900">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600">Shipping</span>
                  <span className="text-orange-600 font-medium">FREE</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600">Tax (5%)</span>
                  <span className="font-medium text-stone-900">₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-3 border-t border-stone-200">
                  <span className="text-stone-900">Total</span>
                  <span className="text-orange-600">₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-xl font-semibold text-stone-900">Payment Method</h2>
              </div>
              
              <div className="space-y-3">
                {paymentSettings.razorpayEnabled && (
                  <button
                    onClick={handleRazorpayPayment}
                    disabled={paymentLoading || loading || !!authError || !paymentSettings.razorpayKeyId}
                    className="w-full bg-orange-500 text-white py-3.5 rounded-xl hover:bg-orange-600 hover:shadow-orange-500/30 transition-all duration-200 font-medium disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 shadow-lg text-sm"
                  >
                    {!paymentSettings.razorpayKeyId ? (
                      'Razorpay Configuration Required'
                    ) : paymentLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        Processing...
                      </>
                    ) : (
                      `Pay ₹${total.toFixed(2)}`
                    )}
                  </button>
                )}

                {paymentSettings.cashOnDeliveryEnabled && (
                  <button
                    onClick={handleCashOnDelivery}
                    disabled={loading || paymentLoading || !!authError}
                    className="w-full border-2 border-orange-500 text-orange-600 py-3.5 rounded-xl hover:bg-orange-500 hover:text-white transition-all duration-200 font-medium disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 text-sm"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-orange-500 border-t-transparent"></div>
                        Processing...
                      </>
                    ) : (
                      'Cash On Delivery'
                    )}
                  </button>
                )}

                {!paymentSettings.razorpayEnabled && !paymentSettings.cashOnDeliveryEnabled && (
                  <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                    <p className="text-yellow-700 text-sm">No payment methods available. Please contact support.</p>
                  </div>
                )}
              </div>

              {paymentSettings.razorpayEnabled && !paymentSettings.razorpayKeyId && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <span className="text-sm text-yellow-700">
                    Razorpay is enabled but not fully configured. Admin needs to add Razorpay Key ID in settings.
                  </span>
                </div>
              )}

              <div className="mt-4 p-3 bg-orange-50 rounded-xl border border-orange-200">
                {user ? (
                  <div className="text-orange-700 text-sm">
                    Logged in as <span className="font-semibold">{user.name}</span>
                    {!token && (
                      <span className="text-xs text-red-600 font-semibold"> (Token missing!)</span>
                    )}
                  </div>
                ) : (
                  <div className="text-orange-700 text-sm">
                    Checking out as guest
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-stone-500">
                <span>Secure checkout • 256-bit encryption</span>
              </div>
            </div>
          </div>

          {/* Mobile: Payment Methods at Bottom */}
          <div className="lg:hidden">
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-4 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-base font-semibold text-stone-900">Payment Method</h2>
              </div>
              
              <div className="space-y-2.5">
                {paymentSettings.razorpayEnabled && (
                  <button
                    onClick={handleRazorpayPayment}
                    disabled={paymentLoading || loading || !!authError || !paymentSettings.razorpayKeyId}
                    className="w-full bg-orange-500 text-white py-3 rounded-xl hover:bg-orange-600 hover:shadow-orange-500/30 transition-all duration-200 font-medium disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 shadow-lg text-sm"
                  >
                    {!paymentSettings.razorpayKeyId ? (
                      'Razorpay Configuration Required'
                    ) : paymentLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Processing...
                      </>
                    ) : (
                      `Pay ₹${total.toFixed(2)}`
                    )}
                  </button>
                )}

                {paymentSettings.cashOnDeliveryEnabled && (
                  <button
                    onClick={handleCashOnDelivery}
                    disabled={loading || paymentLoading || !!authError}
                    className="w-full border-2 border-orange-500 text-orange-600 py-3 rounded-xl hover:bg-orange-500 hover:text-white transition-all duration-200 font-medium disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 text-sm"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-orange-500 border-t-transparent"></div>
                        Processing...
                      </>
                    ) : (
                      'Cash On Delivery'
                    )}
                  </button>
                )}

                {!paymentSettings.razorpayEnabled && !paymentSettings.cashOnDeliveryEnabled && (
                  <div className="text-center p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
                    <p className="text-yellow-700 text-xs">No payment methods available.</p>
                  </div>
                )}
              </div>

              {paymentSettings.razorpayEnabled && !paymentSettings.razorpayKeyId && (
                <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <span className="text-xs text-yellow-700">
                    Razorpay needs Key ID in settings.
                  </span>
                </div>
              )}

              <div className="mt-3 p-2 bg-orange-50 rounded-lg border border-orange-200">
                {user ? (
                  <div className="text-orange-700 text-xs">
                    Logged in as <span className="font-semibold">{user.name}</span>
                  </div>
                ) : (
                  <div className="text-orange-700 text-xs">
                    Checking out as guest
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}