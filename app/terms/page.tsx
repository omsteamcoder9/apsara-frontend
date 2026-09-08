// app/terms/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { settingsAPI } from '@/lib/settings-api';

interface TermsOfServiceSettings {
  termsOfServiceTitle: string;
  termsOfServiceLastUpdated: string;
  termsImportantNotice: string;
  termsUserRequirements: string[];
  termsSections: Array<{ number: number; title: string; content: string }>;
  termsIntellectualProperty: string;
  termsLimitationLiability: string;
  termsChangesNotice: string;
  termsContactInfo: string;
}

export default function TermsPage() {
  const [settings, setSettings] = useState<TermsOfServiceSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const termsSettings = await settingsAPI.getTermsOfServiceSettings();
        setSettings(termsSettings);
      } catch (error) {
        console.error('Error fetching terms settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

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
          <p className="text-[#64748B] font-medium">Loading terms of service...</p>
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
            <span className="text-[#B8860B] font-medium text-sm">Legal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-4 tracking-tight">
            {settings?.termsOfServiceTitle || 'Terms of Service'}
          </h1>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <div className="gold-gradient text-white px-4 py-1.5 rounded-full text-sm font-medium">
              Last updated: {settings?.termsOfServiceLastUpdated || new Date().getFullYear()}
            </div>
          </div>
          <p className="text-[#64748B] text-lg max-w-2xl mx-auto">
            Please read these terms carefully before using our website. By accessing or using our services, you agree to be bound by these terms.
          </p>
        </div>

        <div className="space-y-8">
          {/* Important Notice */}
          <section className="bg-[#FBF7F1] rounded-2xl shadow-sm border border-[#D4AF37]/20 p-6 md:p-8 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 gold-gradient rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-[#0F172A]">Important Notice</h2>
            </div>
            
            <div className="bg-white p-5 rounded-xl border border-[#D4AF37]/20">
              <p className="text-[#0F172A] text-sm mb-4">
                {settings?.termsImportantNotice || 'These Terms of Service govern your use of our website and services. By using our website, you acknowledge that you have read, understood, and agree to be bound by these terms.'}
              </p>
              {settings?.termsUserRequirements && settings.termsUserRequirements.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {settings.termsUserRequirements.map((point, index) => (
                    <div 
                      key={index} 
                      className="flex items-center gap-2 bg-[#FBF7F1] px-3 py-2 rounded-lg border border-[#D4AF37]/20"
                    >
                      <svg className="w-4 h-4 text-[#B8860B] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-[#0F172A]">{point}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    'You must be at least 18 years old to place an order',
                    'Payment processing is handled by secure third-party providers',
                    'All product images are for illustrative purposes only',
                    'Shipping times are estimates and not guarantees',
                    'We reserve the right to refuse service to anyone'
                  ].map((point, index) => (
                    <div 
                      key={index} 
                      className="flex items-center gap-2 bg-[#FBF7F1] px-3 py-2 rounded-lg border border-[#D4AF37]/20"
                    >
                      <svg className="w-4 h-4 text-[#B8860B] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-[#0F172A]">{point}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Terms Sections */}
          <section className="bg-[#FBF7F1] rounded-2xl shadow-sm border border-[#D4AF37]/20 p-6 md:p-8 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 gold-gradient rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-[#0F172A]">Terms & Conditions</h2>
            </div>
            
            <div className="space-y-6">
              {settings?.termsSections && settings.termsSections.length > 0 ? (
                settings.termsSections.map((section) => (
                  <div key={section.number} className="border-b border-[#D4AF37]/20 pb-6 last:border-0 last:pb-0">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full gold-gradient text-white flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">
                        {section.number}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-[#0F172A] mb-2">{section.title}</h3>
                        <p className="text-[#64748B] text-sm leading-relaxed">{section.content}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                // Fallback to default sections
                [
                  {
                    number: 1,
                    title: 'Agreement to Terms',
                    content: 'By accessing and using our website, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Website.'
                  },
                  {
                    number: 2,
                    title: 'User Accounts',
                    content: 'When you create an account with us, you must provide accurate and complete information. You are responsible for maintaining the confidentiality of your account and password and for restricting access to your account. You agree to accept responsibility for all activities that occur under your account.'
                  },
                  {
                    number: 3,
                    title: 'Product Information',
                    content: 'We make every effort to display as accurately as possible the colors, features, specifications, and details of products available on the Website. However, we do not guarantee that the colors, features, specifications, and details will be completely accurate. All products are subject to availability, and we cannot guarantee that items will be in stock. We reserve the right to discontinue any products at any time.'
                  },
                  {
                    number: 4,
                    title: 'Orders and Payment',
                    content: 'By placing an order through our Website, you warrant that you are legally capable of entering into binding contracts and are at least 18 years old. We accept various payment methods as indicated on the Website. All payments are processed through secure third-party payment processors. We do not store your credit card information.'
                  },
                  {
                    number: 5,
                    title: 'Shipping and Delivery',
                    content: 'Shipping times and costs will vary depending on your location and the shipping method selected. Estimated delivery times are provided at checkout and are estimates only. Risk of loss and title for items purchased pass to you upon delivery of the items to the carrier. You are responsible for filing any claims with carriers for damaged and/or lost shipments.'
                  },
                  {
                    number: 6,
                    title: 'Returns and Refunds',
                    content: 'Please review our Returns Policy for detailed information about returning products. Returns must be initiated within the specified return period and meet all return requirements.'
                  },
                  {
                    number: 7,
                    title: 'Intellectual Property',
                    content: settings?.termsIntellectualProperty || 'All content on this Website, including text, graphics, logos, images, and software, is the property of our company or its content suppliers and is protected by copyright and other intellectual property laws.'
                  },
                  {
                    number: 8,
                    title: 'Limitation of Liability',
                    content: settings?.termsLimitationLiability || 'To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the Website.'
                  },
                  {
                    number: 9,
                    title: 'Changes to Terms',
                    content: settings?.termsChangesNotice || 'We reserve the right to modify these terms at any time. We will notify users of any material changes by posting the new Terms of Service on this page and updating the "Last updated" date.'
                  },
                  {
                    number: 10,
                    title: 'Contact Information',
                    content: settings?.termsContactInfo || 'Questions about the Terms of Service should be sent to us at the contact information provided in our website footer.'
                  }
                ].map((section) => (
                  <div key={section.number} className="border-b border-[#D4AF37]/20 pb-6 last:border-0 last:pb-0">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full gold-gradient text-white flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">
                        {section.number}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-[#0F172A] mb-2">{section.title}</h3>
                        <p className="text-[#64748B] text-sm leading-relaxed">{section.content}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Acceptance Section */}
          <section className="bg-[#FBF7F1] rounded-2xl border border-[#D4AF37]/30 p-6 md:p-8">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#0F172A] mb-1">You Accept These Terms</h3>
                <p className="text-[#64748B] text-sm">
                  By using our website, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
                </p>
              </div>
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
              <h2 className="text-2xl font-semibold text-[#0F172A]">Questions About These Terms?</h2>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-[#D4AF37]/20">
              <p className="text-[#64748B] text-sm mb-6">
                {settings?.termsContactInfo || 'Questions about the Terms of Service should be sent to us at the contact information provided in our website footer.'}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  href="/contact"
                  className="flex items-center justify-center gap-2 px-6 py-3 gold-gradient gold-gradient-hover text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-[#D4AF37]/20 hover:-translate-y-0.5 text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Contact Support
                </Link>
                
                <Link
                  href="/privacy"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-[#0F172A] font-medium rounded-xl hover:bg-[#FBF7F1] hover:shadow-md transition-all duration-200 border border-[#D4AF37]/30 text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  View Privacy Policy
                </Link>
              </div>
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