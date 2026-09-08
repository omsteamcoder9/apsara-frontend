'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OrderSuccessPage() {
  const router = useRouter();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(10);
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGuest, setIsGuest] = useState(false);

  // Initialize client-side state
  useEffect(() => {
    setIsClient(true);
    // Check if user is guest (no token in localStorage)
    const token = localStorage.getItem('userToken');
    if (!token) {
      setIsGuest(true);
    }
  }, []);

  // Get orderId and clear cart
  useEffect(() => {
    if (!isClient) return;

    try {
      // Get orderId from URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const orderIdParam = urlParams.get('orderId');
      
      if (orderIdParam) {
        setOrderId(orderIdParam);
      } else {
        setError('No order ID found in URL');
      }

      // Clear cart data (only if it exists)
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('guestCart');
      }
    } catch (err) {
      console.error('Error processing order success:', err);
      setError('Failed to process order details');
    } finally {
      setLoading(false);
    }
  }, [isClient]);

  // Countdown effect
  useEffect(() => {
    if (!orderId) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [orderId]);

  // Separate effect for redirect when countdown reaches 0
  useEffect(() => {
    if (countdown === 0 && orderId) {
      router.push('/');
    }
  }, [countdown, orderId, router]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center bg-[#FBF7F1] rounded-2xl shadow-sm border border-[#D4AF37]/20 p-8">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#D4AF37] border-t-transparent mx-auto mb-4"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-6 w-6 rounded-full bg-[#D4AF37]/20 animate-pulse"></div>
              </div>
            </div>
            <p className="text-[#64748B] font-medium">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center bg-[#FBF7F1] rounded-2xl shadow-sm border border-[#D4AF37]/20 p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            
            <h1 className="text-2xl font-bold text-[#0F172A] mb-4">Something went wrong</h1>
            
            <p className="text-[#64748B] mb-6">
              {error}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/"
                className="gold-gradient gold-gradient-hover text-white px-6 py-3 rounded-xl transition-all duration-200 font-medium text-center shadow-lg shadow-[#D4AF37]/20 hover:-translate-y-0.5"
              >
                Return to Home
              </Link>
              <Link 
                href="/cart"
                className="border-2 border-[#D4AF37] text-[#B8860B] px-6 py-3 rounded-xl hover:gold-gradient hover:text-white hover:shadow-[#D4AF37]/30 transition-all duration-200 font-medium text-center"
              >
                Back to Cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show success state
  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center bg-[#FBF7F1] rounded-2xl shadow-sm border border-[#D4AF37]/20 p-8 hover:shadow-md transition-shadow duration-200">
          <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-[#0F172A] mb-2">Order Placed Successfully!</h1>
          <p className="text-[#64748B] text-sm mb-1">Thank you for your purchase</p>
          <p className="text-[#64748B] text-sm mb-6">
            Your order has been confirmed and will be shipped soon.
          </p>

          <div className="bg-white rounded-xl p-4 mb-6 border border-[#D4AF37]/20">
            <p className="text-[#64748B] text-sm">
              Order ID: <span className="font-mono font-semibold text-[#B8860B]">#{orderId}</span>
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="bg-white border border-[#D4AF37]/30 rounded-xl p-5">
              {isGuest ? (
                <>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#B8860B] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div className="text-left">
                      <p className="text-[#0F172A] text-sm font-medium">
                        As a guest user, a login password has been sent to your email.
                      </p>
                      <p className="text-[#64748B] text-sm mt-1">
                        Use it to login and track your order. You will also receive an order confirmation email with all the details.
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#B8860B] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div className="text-left">
                    <p className="text-[#0F172A] text-sm">
                      You will receive an order confirmation email shortly with all the details.
                    </p>
                  </div>
                </div>
              )}
              <div className="mt-3 pt-3 border-t border-[#D4AF37]/20">
                <p className="text-[#B8860B] text-sm font-medium">
                  {countdown > 0 ? `Redirecting to home page in ${countdown} seconds...` : 'Redirecting now...'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/products"
              className="gold-gradient gold-gradient-hover text-white px-6 py-3 rounded-xl transition-all duration-200 font-medium text-center shadow-lg shadow-[#D4AF37]/20 transform hover:scale-[1.02] active:scale-[0.98] hover:-translate-y-0.5"
            >
              Continue Shopping
            </Link>
            <Link 
              href="/"
              className="border-2 border-[#D4AF37] text-[#B8860B] px-6 py-3 rounded-xl hover:gold-gradient hover:text-white hover:shadow-[#D4AF37]/30 transition-all duration-200 font-medium text-center"
              onClick={(e) => {
                e.preventDefault();
                router.push('/');
              }}
            >
              Go to Home Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}