// app/shipping/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { settingsAPI } from '@/lib/settings-api';
import { PublicSettings } from '@/types/settings';

export default function ShippingPage() {
  const [settings, setSettings] = useState<PublicSettings | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await settingsAPI.getPublicSettings();
        if (response.success && response.data) {
          setSettings(response.data);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const contactEmail = settings?.contactEmail || 'support@example.com';
  const contactNumber = settings?.contactNumber || '+1 (555) 123-4567';

  // Use dynamic shipping settings from backend with fallback values
  const shippingInfo = {
    shippingInfo: settings?.shippingInfo || 'Learn about our shipping policies, delivery times, and tracking information',
    orderProcessingTime: settings?.orderProcessingTime || 'All orders are processed within 1-2 business days after payment confirmation. Orders placed on weekends or holidays will be processed on the next business day.',
    
    domestic: {
      standard: {
        delivery: settings?.standardShippingDelivery || '5-7 business days',
        cost: 'FREE',
        freeThreshold: 'All domestic orders are delivered for free of charge.'
      },
      express: {
        delivery: settings?.expressShippingDelivery || '2-3 business days',
        cost: 'FREE',
        freeThreshold: 'All domestic orders are delivered for free of charge.'
      },
      overnight: {
        delivery: settings?.overnightShippingDelivery || '1 business day',
        cost: 'FREE',
        freeThreshold: 'All domestic orders are delivered for free of charge.'
      }
    },
    international: {
      delivery: settings?.internationalShippingDelivery || '10-15 business days',
      note: settings?.internationalShippingNote || 'International shipping costs vary by destination. You\'ll see the exact shipping cost at checkout.'
    },
    processingTime: '1-2 business days',
    tracking: 'Available for all orders',
    shippingPartners: ['FedEx', 'UPS', 'USPS', 'DHL']
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mx-auto mb-4"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-8 w-8 rounded-full bg-orange-500/20 animate-pulse"></div>
            </div>
          </div>
          <p className="text-stone-600 font-medium">Loading shipping information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Hero Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-orange-500/10 rounded-full px-6 py-2 mb-4 border border-orange-200">
            <span className="text-orange-600 font-medium text-sm">Shipping & Delivery</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-stone-900 mb-4 tracking-tight">
            Shipping Information
          </h1>
          <p className="text-stone-600 text-lg max-w-2xl mx-auto">
            {shippingInfo.shippingInfo}
          </p>
        </div>

        <div className="space-y-8">
          {/* Processing Time */}
          <section className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 md:p-8 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-stone-900">Order Processing Time</h2>
            </div>
            
            <div className="bg-stone-50 p-5 rounded-xl border border-stone-200">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-stone-700 text-sm">
                  {shippingInfo.orderProcessingTime}
                </p>
              </div>
            </div>
          </section>

          {/* Shipping Methods */}
          <section className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 md:p-8 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-stone-900">Shipping Methods & Rates</h2>
            </div>
            
            {/* FREE DOMESTIC SHIPPING NOTICE */}
            <div className="mb-6 bg-emerald-50 p-4 rounded-xl border border-emerald-200">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-emerald-700 font-medium text-sm">
                  All domestic orders are delivered for free of charge.
                </p>
              </div>
            </div>
            
            {/* Domestic Shipping Options */}
            <div className="space-y-4">
              <div className="border border-stone-200 rounded-xl p-5 hover:border-orange-300 transition-all duration-200 hover:shadow-md">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center">
                    <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-stone-900">Standard Shipping</h3>
                  <span className="ml-auto bg-orange-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                    Most Popular
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                  <div className="bg-stone-50 p-3 rounded-lg">
                    <p className="text-stone-500 text-xs">Delivery Time</p>
                    <p className="text-stone-900 font-medium">{shippingInfo.domestic.standard.delivery}</p>
                  </div>
                  <div className="bg-stone-50 p-3 rounded-lg">
                    <p className="text-stone-500 text-xs">Cost</p>
                    <p className="text-emerald-600 font-bold">{shippingInfo.domestic.standard.cost}</p>
                  </div>
                  <div className="bg-stone-50 p-3 rounded-lg">
                    <p className="text-stone-500 text-xs">Free Shipping</p>
                    <p className="text-stone-900 font-medium text-xs">{shippingInfo.domestic.standard.freeThreshold}</p>
                  </div>
                </div>
              </div>

              <div className="border border-stone-200 rounded-xl p-5 hover:border-orange-300 transition-all duration-200 hover:shadow-md">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-stone-900">Express Shipping</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                  <div className="bg-stone-50 p-3 rounded-lg">
                    <p className="text-stone-500 text-xs">Delivery Time</p>
                    <p className="text-stone-900 font-medium">{shippingInfo.domestic.express.delivery}</p>
                  </div>
                  <div className="bg-stone-50 p-3 rounded-lg">
                    <p className="text-stone-500 text-xs">Cost</p>
                    <p className="text-emerald-600 font-bold">{shippingInfo.domestic.express.cost}</p>
                  </div>
                  <div className="bg-stone-50 p-3 rounded-lg">
                    <p className="text-stone-500 text-xs">Free Shipping</p>
                    <p className="text-stone-900 font-medium text-xs">{shippingInfo.domestic.express.freeThreshold}</p>
                  </div>
                </div>
              </div>

              <div className="border border-stone-200 rounded-xl p-5 hover:border-orange-300 transition-all duration-200 hover:shadow-md">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                    <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-stone-900">Overnight Shipping</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                  <div className="bg-stone-50 p-3 rounded-lg">
                    <p className="text-stone-500 text-xs">Delivery Time</p>
                    <p className="text-stone-900 font-medium">{shippingInfo.domestic.overnight.delivery}</p>
                  </div>
                  <div className="bg-stone-50 p-3 rounded-lg">
                    <p className="text-stone-500 text-xs">Cost</p>
                    <p className="text-emerald-600 font-bold">{shippingInfo.domestic.overnight.cost}</p>
                  </div>
                  <div className="bg-stone-50 p-3 rounded-lg">
                    <p className="text-stone-500 text-xs">Free Shipping</p>
                    <p className="text-stone-900 font-medium text-xs">{shippingInfo.domestic.overnight.freeThreshold}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* International Shipping */}
          <section className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 md:p-8 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-stone-900">International Shipping</h2>
            </div>
            
            <div className="border border-stone-200 rounded-xl p-5 hover:border-orange-300 transition-all duration-200 hover:shadow-md">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-stone-50 p-4 rounded-lg">
                  <p className="text-stone-500 text-xs mb-1">Delivery Time</p>
                  <p className="text-stone-900 font-medium">{shippingInfo.international.delivery}</p>
                </div>
                <div className="bg-stone-50 p-4 rounded-lg">
                  <p className="text-stone-500 text-xs mb-1">Cost</p>
                  <p className="text-stone-900 font-medium">Based on destination</p>
                </div>
              </div>
              <div className="mt-4 bg-orange-50 p-4 rounded-lg border border-orange-200">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-stone-700">
                    {shippingInfo.international.note}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Shipping Partners */}
          <section className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 md:p-8 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-stone-900">Our Shipping Partners</h2>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {shippingInfo.shippingPartners.map((partner, index) => (
                <div 
                  key={index}
                  className="bg-stone-50 px-4 py-2 rounded-lg border border-stone-200 text-stone-700 font-medium text-sm hover:border-orange-300 hover:bg-orange-50 transition-all duration-200"
                >
                  {partner}
                </div>
              ))}
            </div>
          </section>

          {/* Contact Section */}
          <section className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 md:p-8 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-stone-900">Need Help with Shipping?</h2>
            </div>
            
            <div className="bg-stone-50 p-6 rounded-xl border border-stone-200">
              <p className="text-stone-600 text-sm mb-6">
                If you have any questions about shipping or need assistance with your order, please contact our customer service team.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-stone-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                      <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-stone-500">Email</p>
                      <a href={`mailto:${contactEmail}`} className="text-sm text-stone-900 font-medium hover:text-orange-600 transition-colors">
                        {contactEmail}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-stone-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                      <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-stone-500">Phone</p>
                      <a href={`tel:${contactNumber}`} className="text-sm text-stone-900 font-medium hover:text-orange-600 transition-colors">
                        {contactNumber}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <Link
                href="/contact"
                className="mt-4 w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-orange-500 text-white font-medium rounded-xl hover:bg-orange-600 hover:shadow-orange-500/30 transition-all duration-200 shadow-lg text-sm"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Contact Support
              </Link>
            </div>
          </section>

          {/* Back Button */}
          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-white text-stone-700 font-medium rounded-xl hover:bg-stone-50 hover:shadow-md transition-all duration-200 border border-stone-200 text-sm"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}