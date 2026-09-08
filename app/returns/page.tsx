// app/returns/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { settingsAPI } from '@/lib/settings-api';
import { PublicSettings } from '@/types/settings';

export default function ReturnsPage() {
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

  // Use dynamic returns policy settings from backend with fallback values
  const returnsPolicy = {
    title: settings?.returnsPolicyTitle || 'Returns & Refunds Policy',
    description: settings?.returnsPolicyDescription || 'We stand behind our products. If you\'re not completely satisfied, we\'re here to help.',
    
    returnSteps: settings?.returnProcessSteps || [
      {
        title: 'Request Initiation',
        description: 'Submit your return request through our online portal within 30 days of delivery.',
      },
      {
        title: 'Approval & Instructions',
        description: 'Once approved, you\'ll receive detailed return instructions and a shipping label.',
      },
      {
        title: 'Ship & Track',
        description: 'Package your items securely and ship them back using the provided label.',
      },
      {
        title: 'Refund Processing',
        description: 'We\'ll process your refund within 5-7 business days after receiving your return.',
      }
    ],
    
    timeframe: settings?.returnTimeframe || '30 days from delivery date',
    
    conditions: settings?.returnConditions || [
      'Items must be unused and in original packaging',
      'All tags must be attached',
      'Returns accepted within 30 days',
      'Proof of purchase required'
    ],
    
    shippingResponsibility: settings?.customerShippingResponsibility || 'Customers are responsible for return shipping costs unless the item is defective or damaged.',
    
    nonReturnableItems: settings?.nonReturnableItems || [
      'Custom or personalized items',
      'Perishable goods',
      'Final sale items',
      'Gift cards',
      'Downloadable software'
    ],
    
    defectiveItemsNote: settings?.defectiveItemsNote || 'If you receive a defective or damaged item, please contact us immediately. We\'ll cover return shipping and provide a full refund or replacement.',
    
    refundProcessingTime: settings?.refundProcessingTime || '5-7 business days',
    refundNote: settings?.refundNote || 'Refunds will be issued to the original payment method within 5-7 business days after we receive and inspect the returned item.',
    refundAmountFormula: settings?.refundAmountFormula || 'Refund = Purchase price - Return shipping (if applicable)',
    refundAmountDescription: settings?.refundAmountDescription || 'We refund the full purchase price minus any return shipping costs if applicable. Original shipping costs are non-refundable.',
    
    exchangePolicy: settings?.exchangePolicy || 'We offer exchanges within 30 days of delivery for the same item or a different size/color subject to availability.'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#D4AF37] border-t-transparent mx-auto mb-4"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-8 w-8 rounded-full bg-[#D4AF37]/20 animate-pulse"></div>
            </div>
          </div>
          <p className="text-[#64748B] font-medium">Loading policy...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Hero Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-[#D4AF37]/10 rounded-full px-6 py-2 mb-4 border border-[#D4AF37]/30">
            <span className="text-[#B8860B] font-medium text-sm">Returns & Refunds</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-4 tracking-tight">
            {returnsPolicy.title}
          </h1>
          <p className="text-[#64748B] text-lg max-w-2xl mx-auto">
            {returnsPolicy.description}
          </p>
        </div>

        <div className="space-y-8">
          {/* Return Process Steps */}
          <section className="bg-[#FBF7F1] rounded-2xl shadow-sm border border-[#D4AF37]/20 p-6 md:p-8 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 gold-gradient rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-[#0F172A]">How to Return</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {returnsPolicy.returnSteps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="bg-white rounded-xl p-5 border border-[#D4AF37]/20 hover:border-[#D4AF37]/60 transition-all duration-200 hover:shadow-md">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full gold-gradient text-white flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      <h3 className="font-semibold text-[#0F172A]">{step.title}</h3>
                    </div>
                    <p className="text-[#64748B] text-sm">{step.description}</p>
                  </div>
                  {index < returnsPolicy.returnSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-2 transform -translate-y-1/2 text-[#D4AF37]/30">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Return Conditions */}
          <section className="bg-[#FBF7F1] rounded-2xl shadow-sm border border-[#D4AF37]/20 p-6 md:p-8 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 gold-gradient rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-[#0F172A]">Return Requirements</h2>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-xl border border-[#D4AF37]/20">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-[#B8860B] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-[#0F172A] text-sm">
                      <strong className="text-[#0F172A]">Timeframe:</strong> {returnsPolicy.timeframe}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-[#D4AF37]/20">
                <p className="text-[#0F172A] text-sm mb-3">
                  <strong className="text-[#0F172A]">What We Accept:</strong>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {returnsPolicy.conditions.map((condition, index) => (
                    <div 
                      key={index} 
                      className="flex items-center gap-2 bg-[#FBF7F1] px-3 py-2 rounded-lg border border-[#D4AF37]/20"
                    >
                      <svg className="w-4 h-4 text-[#B8860B] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-[#0F172A]">{condition}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-[#D4AF37]/20">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-[#B8860B] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <div>
                    <p className="text-[#0F172A] text-sm">
                      <strong className="text-[#0F172A]">Shipping:</strong> {returnsPolicy.shippingResponsibility}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Non-Returnable Items */}
          <section className="bg-[#FBF7F1] rounded-2xl shadow-sm border border-[#D4AF37]/20 p-6 md:p-8 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 gold-gradient rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-[#0F172A]">Non-Returnable Items</h2>
            </div>
            
            <div className="bg-white p-5 rounded-xl border border-[#D4AF37]/20">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {returnsPolicy.nonReturnableItems.map((item, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-2 bg-[#FBF7F1] px-3 py-2 rounded-lg border border-[#D4AF37]/20"
                  >
                    <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-sm text-[#0F172A]">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Defective Items */}
          <section className="bg-[#FBF7F1] rounded-2xl shadow-sm border border-[#D4AF37]/20 p-6 md:p-8 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 gold-gradient rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-[#0F172A]">Damaged or Defective Items</h2>
            </div>
            
            <div className="bg-[#FBF7F1] p-5 rounded-xl border border-[#D4AF37]/30">
              <p className="text-[#0F172A] text-sm">
                {returnsPolicy.defectiveItemsNote}
              </p>
            </div>
          </section>

          {/* Refund Information */}
          <section className="bg-[#FBF7F1] rounded-2xl shadow-sm border border-[#D4AF37]/20 p-6 md:p-8 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 gold-gradient rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v1m0 4v1m0-1c-1.11 0-2.08-.402-2.599-1M12 12c1.11 0 2.08.402 2.599 1M12 12v1m0-1v-1" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-[#0F172A]">Refund Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-xl border border-[#D4AF37]/20">
                <div className="flex items-start gap-2 mb-2">
                  <svg className="w-5 h-5 text-[#B8860B] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-[#0F172A] text-sm">Processing Time</h3>
                    <p className="text-[#64748B] text-sm mt-1">
                      {returnsPolicy.refundProcessingTime}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-[#D4AF37]/20">
                <div className="flex items-start gap-2 mb-2">
                  <svg className="w-5 h-5 text-[#B8860B] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-[#0F172A] text-sm">Refund Amount</h3>
                    <p className="text-[#64748B] text-sm mt-1">
                      {returnsPolicy.refundAmountDescription}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 bg-[#FBF7F1] p-4 rounded-xl border border-[#D4AF37]/30">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-[#B8860B] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-[#0F172A]">
                  <strong className="text-[#0F172A]">Note:</strong> {returnsPolicy.refundNote}
                </p>
              </div>
            </div>
          </section>

          {/* Exchange Policy */}
          <section className="bg-[#FBF7F1] rounded-2xl shadow-sm border border-[#D4AF37]/20 p-6 md:p-8 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 gold-gradient rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-[#0F172A]">Exchange Policy</h2>
            </div>
            
            <div className="bg-white p-5 rounded-xl border border-[#D4AF37]/20">
              <p className="text-[#0F172A] text-sm">
                {returnsPolicy.exchangePolicy}
              </p>
            </div>
          </section>

          {/* Contact Section */}
          <section className="bg-[#FBF7F1] rounded-2xl shadow-sm border border-[#D4AF37]/20 p-6 md:p-8 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 gold-gradient rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-[#0F172A]">Need Help?</h2>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-[#D4AF37]/20">
              <p className="text-[#64748B] text-sm mb-6">
                Have questions about our return policy? We're here to help!
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#FBF7F1] p-4 rounded-xl border border-[#D4AF37]/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full gold-gradient/10 flex items-center justify-center">
                      <svg className="w-5 h-5 text-[#B8860B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-[#64748B]">Email</p>
                      <a href={`mailto:${contactEmail}`} className="text-sm text-[#0F172A] font-medium hover:text-[#B8860B] transition-colors">
                        {contactEmail}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="bg-[#FBF7F1] p-4 rounded-xl border border-[#D4AF37]/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full gold-gradient/10 flex items-center justify-center">
                      <svg className="w-5 h-5 text-[#B8860B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-[#64748B]">Phone</p>
                      <a href={`tel:${contactNumber}`} className="text-sm text-[#0F172A] font-medium hover:text-[#B8860B] transition-colors">
                        {contactNumber}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <Link
                href="/contact"
                className="mt-4 w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 gold-gradient gold-gradient-hover text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-[#D4AF37]/20 hover:-translate-y-0.5 text-sm"
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
              className="inline-flex items-center px-6 py-3 bg-white text-[#0F172A] font-medium rounded-xl hover:bg-[#FBF7F1] hover:shadow-md transition-all duration-200 border border-[#D4AF37]/30 text-sm"
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