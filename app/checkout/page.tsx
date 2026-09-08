// app/checkout/page.tsx
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
import { 
  ShieldCheck, 
  Lock, 
  CreditCard, 
  Truck, 
  ShoppingBag, 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  Compass, 
  Hash, 
  Globe, 
  AlertCircle,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

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
          name: 'Apsara',
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
            color: '#D4AF37',
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#D4AF37] border-t-transparent mx-auto mb-4"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-8 w-8 rounded-full bg-[#D4AF37]/20 animate-pulse"></div>
            </div>
          </div>
          <p className="text-[#0F172A] font-medium tracking-wide text-sm">Preparing your boutique checkout experience...</p>
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
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="bg-[#FBF7F1] rounded-[2.5rem] shadow-2xl p-10 max-w-md w-full border border-[#D4AF37]/30 text-center relative overflow-hidden">
          <div className="w-20 h-20 bg-[#D4AF37]/10 rounded-3xl flex items-center justify-center mx-auto mb-6 text-[#B8860B] shadow-inner">
            <AlertCircle className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-[#0F172A] mb-2 tracking-tight">No Payment Methods Available</h2>
          <p className="text-[#64748B] mb-8 text-sm leading-relaxed">All payment gateways are temporarily offline. Please contact our boutique support.</p>
          <button
            onClick={() => router.push('/cart')}
            className="w-full bg-[#0F172A] text-white py-4 rounded-2xl hover:bg-[#1E293B] transition-all duration-300 font-bold tracking-wider uppercase text-xs shadow-xl shadow-[#0F172A]/20 cursor-pointer active:scale-95"
          >
            Return to Cart
          </button>
        </div>
      </div>
    );
  }

  const clampedItems = displayItems.slice(0, 4);
  const hasMoreItems = displayItems.length > 4;

  return (
    <div className="min-h-screen bg-white py-10 sm:py-16 selection:bg-[#D4AF37] selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
<div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-[#D4AF37]/20">
  <div className="flex flex-wrap items-center gap-3">
    <Link href="/cart" className="group flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#64748B] hover:text-[#0F172A] bg-[#FBF7F1] hover:bg-[#FBF7F1] px-3.5 py-2 rounded-xl border border-[#D4AF37]/20 transition-all shadow-sm">
      <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
      <span>Back to Bag</span>
    </Link>
    <span className="text-[#D4AF37]">•</span>
    <span className="text-xs font-bold uppercase tracking-widest text-[#B8860B] flex items-center gap-1.5">
      <Sparkles className="w-3.5 h-3.5" /> Secure Checkout
    </span>
    <span className="text-[#D4AF37]">•</span>
    <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">
      Finalize Your Order
    </h1>
  </div>
  
  <div className="flex flex-wrap items-center gap-3">
    {!user && !isBuyNowMode && (
      <div className="bg-[#FBF7F1] backdrop-blur-md border border-[#D4AF37]/30 text-[#0F172A] px-4 py-2.5 rounded-2xl text-xs flex items-center gap-2.5 shadow-sm">
        <ShieldCheck className="w-4 h-4 text-[#B8860B]" />
        <span className="font-medium">
          Guest Shopper •{' '}
          <Link href="/signup" className="font-bold text-[#B8860B] underline hover:text-[#0F172A] transition-colors">
            Create Account
          </Link>
        </span>
      </div>
    )}
    {isBuyNowMode && (
      <div className="bg-[#0F172A] text-white px-4 py-2.5 rounded-2xl text-xs font-extrabold tracking-wider uppercase shadow-md flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping"></span>
        Express Buy Now
      </div>
    )}
  </div>
</div>

{authError && (
  <div className="mb-8 bg-rose-50/90 backdrop-blur-md border border-rose-200 text-rose-800 px-6 py-4 rounded-3xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-sm">
    <div className="flex items-center gap-3 text-sm font-semibold">
      <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
      <span>{authError}</span>
    </div>
    <Link href="/login" className="bg-rose-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-rose-700 transition-colors text-xs uppercase tracking-wider whitespace-nowrap shadow-sm text-center">
      Log in again →
    </Link>
  </div>
)}
        
        {/* Mobile: Order Summary at Top */}
        <div className="lg:hidden mb-8">
          <div className="bg-[#FBF7F1] rounded-[2rem] shadow-xl border border-[#D4AF37]/30 p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#D4AF37]/15">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#B8860B]">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-[#0F172A]">Order Summary</h2>
              </div>
              <span className="text-xs font-bold text-[#B8860B] bg-[#D4AF37]/10 px-3 py-1 rounded-full">
                {itemCount} Items
              </span>
            </div>
            
            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
              {clampedItems.map((item: any) => (
                <div key={item.product._id} className="flex justify-between items-center py-2.5 border-b border-[#D4AF37]/10 last:border-0">
                  <div className="flex-1 min-w-0 pr-3">
                    <p className="font-bold text-xs text-[#0F172A] truncate">{item.product.name}</p>
                    {item.selectedVariant && (
                      <p className="text-[11px] text-[#B8860B] font-semibold truncate">{item.selectedVariant.variantName}</p>
                    )}
                    <p className="text-[11px] text-[#64748B]">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-extrabold text-xs text-[#0F172A] whitespace-nowrap">₹{((item.price || 0) * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              {hasMoreItems && (
                <p className="text-xs text-[#64748B] text-center pt-2 italic">+ {displayItems.length - 4} additional items</p>
              )}
            </div>

            <div className="border-t border-[#D4AF37]/20 mt-5 pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-[#64748B]">
                <span>Subtotal</span>
                <span className="font-bold text-[#0F172A]">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#64748B]">
                <span>Shipping</span>
                <span className="text-emerald-700 font-extrabold uppercase tracking-widest text-[10px] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">Free</span>
              </div>
              <div className="flex justify-between text-[#64748B]">
                <span>Estimated Tax (5%)</span>
                <span className="font-bold text-[#0F172A]">₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-bold pt-3 border-t border-[#D4AF37]/30 mt-2">
                <span className="text-[#0F172A]">Total Amount</span>
                <span className="text-[#B8860B]">₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Asymmetric Grid Layout (12 Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column - Shipping & Delivery Details (7 Columns on LG) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-[#FBF7F1] rounded-[2.5rem] shadow-xl border border-[#D4AF37]/30 p-8 sm:p-10 relative overflow-hidden">
              
              <div className="flex items-center gap-4 mb-8 pb-5 border-b border-[#D4AF37]/20">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D4AF37]/20 to-[#B8860B]/10 flex items-center justify-center text-[#B8860B] shadow-inner">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#0F172A] tracking-tight">
                    {user ? 'Shipping Coordinates' : 'Guest Delivery Destination'}
                  </h2>
                  <p className="text-xs text-[#64748B] font-medium">Precise routing for your luxury items</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                <div>
                  <label className="block text-[11px] font-bold text-[#0F172A] mb-2 uppercase tracking-widest">
                    First Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative group">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#64748B] group-focus-within:text-[#B8860B] transition-colors">
                      <User className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-4 py-3.5 text-sm font-medium border border-[#D4AF37]/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all duration-300 bg-white hover:bg-white text-[#0F172A] shadow-sm"
                      placeholder="Enter first name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#0F172A] mb-2 uppercase tracking-widest">
                    Last Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative group">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#64748B] group-focus-within:text-[#B8860B] transition-colors">
                      <User className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-4 py-3.5 text-sm font-medium border border-[#D4AF37]/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all duration-300 bg-white hover:bg-white text-[#0F172A] shadow-sm"
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-[#0F172A] mb-2 uppercase tracking-widest">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative group">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#64748B] group-focus-within:text-[#B8860B] transition-colors">
                      <Mail className="w-4 h-4" />
                    </span>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-4 py-3.5 text-sm font-medium border border-[#D4AF37]/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all duration-300 bg-white hover:bg-white text-[#0F172A] shadow-sm"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-[#0F172A] mb-2 uppercase tracking-widest">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative group">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#64748B] group-focus-within:text-[#B8860B] transition-colors">
                      <Phone className="w-4 h-4" />
                    </span>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-4 py-3.5 text-sm font-medium border border-[#D4AF37]/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all duration-300 bg-white hover:bg-white text-[#0F172A] shadow-sm"
                      placeholder="+91 00000 00000"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-[#0F172A] mb-2 uppercase tracking-widest">
                    Street Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative group">
                    <span className="absolute top-4 left-4 pointer-events-none text-[#64748B] group-focus-within:text-[#B8860B] transition-colors">
                      <MapPin className="w-4 h-4" />
                    </span>
                    <textarea
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full pl-11 pr-4 py-3.5 text-sm font-medium border border-[#D4AF37]/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all duration-300 bg-white hover:bg-white resize-none text-[#0F172A] shadow-sm"
                      placeholder="Apartment, suite, building, street name..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#0F172A] mb-2 uppercase tracking-widest">
                    City <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative group">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#64748B] group-focus-within:text-[#B8860B] transition-colors">
                      <Building2 className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-4 py-3.5 text-sm font-medium border border-[#D4AF37]/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all duration-300 bg-white hover:bg-white text-[#0F172A] shadow-sm"
                      placeholder="City"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#0F172A] mb-2 uppercase tracking-widest">
                    State <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative group">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#64748B] group-focus-within:text-[#B8860B] transition-colors">
                      <Compass className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-4 py-3.5 text-sm font-medium border border-[#D4AF37]/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all duration-300 bg-white hover:bg-white text-[#0F172A] shadow-sm"
                      placeholder="State"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#0F172A] mb-2 uppercase tracking-widest">
                    PIN Code <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative group">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#64748B] group-focus-within:text-[#B8860B] transition-colors">
                      <Hash className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      name="pincode"
                      required
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-4 py-3.5 text-sm font-medium border border-[#D4AF37]/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all duration-300 bg-white hover:bg-white text-[#0F172A] shadow-sm"
                      placeholder="PIN Code"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#0F172A] mb-2 uppercase tracking-widest">
                    Country <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative group">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#64748B] group-focus-within:text-[#B8860B] transition-colors">
                      <Globe className="w-4 h-4" />
                    </span>
                    <select
                      name="country"
                      required
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-4 py-3.5 text-sm font-medium border border-[#D4AF37]/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all duration-300 bg-white hover:bg-white text-[#0F172A] shadow-sm cursor-pointer"
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
          </div>

          {/* Right Column - Order Summary & Payment Gateway (5 Columns on LG) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-8">
            
            {/* Desktop Order Summary */}
            <div className="hidden lg:block bg-[#FBF7F1] rounded-[2.5rem] shadow-xl border border-[#D4AF37]/30 p-8 relative overflow-hidden">
              
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#D4AF37]/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#B8860B]">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold text-[#0F172A]">Order Summary</h2>
                </div>
                <span className="text-xs font-bold text-[#B8860B] bg-[#D4AF37]/10 px-3.5 py-1.5 rounded-full border border-[#D4AF37]/20">
                  {itemCount} Items
                </span>
              </div>
              
              <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
                {displayItems.map((item: any) => {
                  const itemWeight = item.weight || item.selectedVariant?.weight || 0;
                  const itemWeightUnit = item.weightUnit || item.selectedVariant?.weightUnit || 'gram';
                  const weightDisplay = itemWeight > 0 ? `${itemWeight} ${itemWeightUnit}` : '';
                  const sizeDisplay = item.selectedSize ? `Size: ${item.selectedSize}` : '';
                  
                  return (
                    <div key={item.product._id} className="flex justify-between items-center py-3 border-b border-[#D4AF37]/10 last:border-0">
                      <div className="flex-1 min-w-0 pr-3">
                        <p className="font-bold text-sm text-[#0F172A] truncate">{item.product.name}</p>
                        {item.selectedVariant && (
                          <p className="text-xs text-[#B8860B] font-bold truncate">{item.selectedVariant.variantName}</p>
                        )}
                        <div className="flex flex-wrap gap-2 mt-1">
                          {sizeDisplay && (
                            <span className="text-[10px] text-[#0F172A] font-bold bg-white px-2 py-0.5 rounded-md border border-[#D4AF37]/25">{sizeDisplay}</span>
                          )}
                          {weightDisplay && (
                            <span className="text-[10px] text-[#64748B] font-medium">Wt: {weightDisplay}</span>
                          )}
                          <span className="text-[10px] text-[#64748B] font-medium">Qty: {item.quantity}</span>
                        </div>
                      </div>
                      <p className="font-bold text-sm text-[#0F172A] whitespace-nowrap ml-2">₹{((item.price || 0) * item.quantity).toFixed(2)}</p>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-[#D4AF37]/25 mt-6 pt-5 space-y-2.5 text-xs">
                <div className="flex justify-between text-[#64748B]">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-bold text-[#0F172A]">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#64748B]">
                  <span className="font-medium">Shipping</span>
                  <span className="text-emerald-700 font-extrabold uppercase tracking-widest text-[10px] bg-emerald-50 px-3 py-0.5 rounded-full border border-emerald-200">Free</span>
                </div>
                <div className="flex justify-between text-[#64748B]">
                  <span className="font-medium">Estimated Tax (5%)</span>
                  <span className="font-bold text-[#0F172A]">₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-4 border-t border-[#D4AF37]/30 mt-2">
                  <span className="text-[#0F172A]">Total Amount</span>
                  <span className="text-[#B8860B]">₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Payment Options Card */}
            <div className="bg-[#FBF7F1] rounded-[2.5rem] shadow-xl border border-[#D4AF37]/30 p-8 relative overflow-hidden">
              
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#D4AF37]/20">
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#B8860B]">
                  <CreditCard className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-[#0F172A]">Payment Gateway</h2>
              </div>
              
              <div className="space-y-4">
                {paymentSettings.razorpayEnabled && (
                  <button
                    onClick={handleRazorpayPayment}
                    disabled={paymentLoading || loading || !!authError || !paymentSettings.razorpayKeyId}
                    className="w-full py-4.5 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all duration-300 gold-gradient text-white shadow-xl shadow-[#D4AF37]/30 hover:shadow-2xl hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2.5"
                  >
                    {!paymentSettings.razorpayKeyId ? (
                      'Razorpay Configuration Required'
                    ) : paymentLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        <span>Processing Secure Encrypted Transaction...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Pay ₹{total.toFixed(2)} Securely</span>
                      </>
                    )}
                  </button>
                )}

                {paymentSettings.cashOnDeliveryEnabled && (
                  <button
                    onClick={handleCashOnDelivery}
                    disabled={loading || paymentLoading || !!authError}
                    className="w-full py-4.5 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all duration-300 bg-white border-2 border-[#D4AF37] text-[#0F172A] hover:bg-[#FBF7F1] hover:border-[#B8860B] active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2.5 shadow-sm"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#D4AF37] border-t-transparent"></div>
                        <span>Processing Order...</span>
                      </>
                    ) : (
                      <span>Cash On Delivery (COD)</span>
                    )}
                  </button>
                )}

                {!paymentSettings.razorpayEnabled && !paymentSettings.cashOnDeliveryEnabled && (
                  <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-2xl">
                    <p className="text-yellow-800 text-xs font-semibold">No active payment options configured. Contact administrator.</p>
                  </div>
                )}
              </div>

              {paymentSettings.razorpayEnabled && !paymentSettings.razorpayKeyId && (
                <div className="mt-4 p-4 bg-amber-50/80 border border-amber-200 rounded-2xl text-xs text-amber-900 leading-relaxed font-medium">
                  Razorpay is enabled but lacks a Key ID in system settings.
                </div>
              )}

              <div className="mt-5 p-4 bg-white rounded-2xl border border-[#D4AF37]/20 flex items-center justify-between">
                {user ? (
                  <div className="text-xs text-[#0F172A] font-medium">
                    Account: <span className="font-bold text-[#B8860B]">{user.name}</span>
                    {!token && (
                      <span className="text-xs text-rose-600 font-bold ml-1">(Token missing!)</span>
                    )}
                  </div>
                ) : (
                  <div className="text-xs text-[#0F172A] font-medium">
                    Shopper Mode: <span className="font-bold text-[#B8860B]">Guest Checkout</span>
                  </div>
                )}
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>

              <div className="mt-5 flex items-center justify-center gap-2 text-xs text-[#64748B] font-semibold">
                <Lock className="w-4 h-4 text-[#B8860B]" />
                <span>Protected by 256-bit SSL Banking Encryption</span>
              </div>
            </div>

          </div>

          {/* Mobile: Payment Methods at Bottom */}
 

        </div>
      </div>
    </div>
  );
}