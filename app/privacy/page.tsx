// app/privacy/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { settingsAPI } from '@/lib/settings-api';

interface PrivacyPolicySettings {
  privacyPolicyTitle: string;
  privacyPolicyLastUpdated: string;
  privacyPolicyEffectiveImmediately: boolean;
  privacyPolicyIntroduction: string;
  dataWeCollect: string[];
  howWeUseInformation: string[];
  privacyIntroductionSection: string;
  informationWeCollectSection: string;
  howWeUseInformationSection: string;
  dataSecuritySection: string;
  dataProtectionRightsSection: string;
  contactUsSection: string;
  dataProtectionRightsList: string[];
  securityMeasuresSection: string;
}

export default function PrivacyPage() {
  const [settings, setSettings] = useState<PrivacyPolicySettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const privacySettings = await settingsAPI.getPrivacyPolicySettings();
        setSettings(privacySettings);
      } catch (error) {
        console.error('Error fetching privacy settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const privacySections = [
    {
      number: 1,
      title: 'Introduction',
      content: settings?.privacyIntroductionSection || 'Welcome to our website. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice, or our practices with regards to your personal information, please contact us at the email provided in our contact information.'
    },
    {
      number: 2,
      title: 'Information We Collect',
      content: settings?.informationWeCollectSection || 'We collect personal information that you voluntarily provide to us when you register on our website, place an order, subscribe to our newsletter, contact us with inquiries, or participate in promotions or surveys. The personal information we collect may include your name, email address, phone number, shipping address, and payment information.'
    },
    {
      number: 3,
      title: 'How We Use Your Information',
      content: settings?.howWeUseInformationSection || 'We use the information we collect for various purposes, including to process and fulfill your orders, send you order confirmations and updates, respond to your inquiries and provide customer support, send you marketing communications (with your consent), improve our website and services, and prevent fraud and enhance security.'
    },
    {
      number: 4,
      title: 'Data Security',
      content: settings?.dataSecuritySection || 'We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, please also remember that we cannot guarantee that the internet itself is 100% secure.'
    },
    {
      number: 5,
      title: 'Your Data Protection Rights',
      content: settings?.dataProtectionRightsSection || 'Depending on your location, you may have rights regarding your personal data including: the right to access your personal data, the right to rectification of inaccurate data, the right to erasure of your data, the right to restrict processing, the right to data portability, and the right to object to processing.'
    },
    {
      number: 6,
      title: 'Contact Us',
      content: settings?.contactUsSection || 'If you have questions or comments about this policy, you may contact us at the email or phone number provided in our website footer.'
    }
  ];

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
          <p className="text-[#64748B] font-medium">Loading privacy policy...</p>
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
            <span className="text-[#B8860B] font-medium text-sm">Privacy & Security</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-4 tracking-tight">
            {settings?.privacyPolicyTitle || 'Privacy Policy'}
          </h1>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <div className="gold-gradient text-white px-4 py-1.5 rounded-full text-sm font-medium">
              Last updated: {settings?.privacyPolicyLastUpdated || new Date().getFullYear()}
            </div>
            {settings?.privacyPolicyEffectiveImmediately && (
              <div className="bg-emerald-500 text-white px-4 py-1.5 rounded-full text-sm font-medium">
                Effective immediately
              </div>
            )}
          </div>
          <p className="text-[#64748B] text-lg max-w-2xl mx-auto">
            {settings?.privacyPolicyIntroduction || 'We value your privacy and are committed to protecting your personal information. This policy explains how we collect, use, and safeguard your data.'}
          </p>
        </div>

        <div className="space-y-8">
          {/* Data We Collect */}
          <section className="bg-[#FBF7F1] rounded-2xl shadow-sm border border-[#D4AF37]/20 p-6 md:p-8 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 gold-gradient rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-[#0F172A]">Data We Collect</h2>
            </div>
            
            <div className="bg-white p-5 rounded-xl border border-[#D4AF37]/20">
              <p className="text-[#64748B] text-sm mb-4">
                We collect the following types of personal information when you interact with our website:
              </p>
              {settings?.dataWeCollect && settings.dataWeCollect.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {settings.dataWeCollect.map((point, index) => (
                    <div 
                      key={index} 
                      className="flex items-center gap-2 bg-[#FBF7F1] px-3 py-2 rounded-lg border border-[#D4AF37]/20"
                    >
                      <svg className="w-4 h-4 text-[#B8860B] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm text-[#0F172A]">{point}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[#64748B] text-center py-4">No data collection information available.</p>
              )}
            </div>
          </section>

          {/* How We Use Your Information */}
          <section className="bg-[#FBF7F1] rounded-2xl shadow-sm border border-[#D4AF37]/20 p-6 md:p-8 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 gold-gradient rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-[#0F172A]">How We Use Your Information</h2>
            </div>
            
            <div className="bg-white p-5 rounded-xl border border-[#D4AF37]/20">
              <p className="text-[#64748B] text-sm mb-4">
                Your information is used for the following purposes:
              </p>
              {settings?.howWeUseInformation && settings.howWeUseInformation.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {settings.howWeUseInformation.map((purpose, index) => (
                    <div 
                      key={index} 
                      className="flex items-center gap-2 bg-[#FBF7F1] px-3 py-2 rounded-lg border border-[#D4AF37]/20"
                    >
                      <svg className="w-4 h-4 text-[#B8860B] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span className="text-sm text-[#0F172A]">{purpose}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[#64748B] text-center py-4">No usage information available.</p>
              )}
            </div>
          </section>

          {/* Privacy Sections */}
          <section className="bg-[#FBF7F1] rounded-2xl shadow-sm border border-[#D4AF37]/20 p-6 md:p-8 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 gold-gradient rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-[#0F172A]">Privacy Policy Details</h2>
            </div>
            
            <div className="space-y-6">
              {privacySections.map((section) => (
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
              ))}
            </div>
          </section>

          {/* Your Data Protection Rights */}
          <section className="bg-[#FBF7F1] rounded-2xl shadow-sm border border-[#D4AF37]/20 p-6 md:p-8 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 gold-gradient rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-[#0F172A]">Your Data Protection Rights</h2>
            </div>
            
            <div className="bg-white p-5 rounded-xl border border-[#D4AF37]/20">
              <p className="text-[#64748B] text-sm mb-4">
                You have the following rights regarding your personal data:
              </p>
              {settings?.dataProtectionRightsList && settings.dataProtectionRightsList.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {settings.dataProtectionRightsList.map((right, index) => (
                    <div 
                      key={index} 
                      className="flex items-center gap-2 bg-[#FBF7F1] px-3 py-2 rounded-lg border border-[#D4AF37]/20"
                    >
                      <svg className="w-4 h-4 text-[#B8860B] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-[#0F172A]">{right}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[#64748B] text-center py-4">No data protection rights information available.</p>
              )}
            </div>
          </section>

          {/* Security Measures */}
          <section className="bg-[#FBF7F1] rounded-2xl shadow-sm border border-[#D4AF37]/20 p-6 md:p-8 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 gold-gradient rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-[#0F172A]">Security Measures</h2>
            </div>
            
            <div className="bg-white p-5 rounded-xl border border-[#D4AF37]/20">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[#B8860B] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <p className="text-[#0F172A] text-sm">
                  {settings?.securityMeasuresSection || 'We implement industry-standard security measures to protect your personal information, including encryption, secure servers, and regular security audits.'}
                </p>
              </div>
            </div>
          </section>

          {/* Consent Notice */}
          <section className="bg-[#FBF7F1] rounded-2xl border border-[#D4AF37]/30 p-6 md:p-8">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#0F172A] mb-1">You Consent to This Policy</h3>
                <p className="text-[#64748B] text-sm">
                  By using our website, you consent to our Privacy Policy and agree to its terms.
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
              <h2 className="text-2xl font-semibold text-[#0F172A]">Questions About Privacy?</h2>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-[#D4AF37]/20">
              <p className="text-[#64748B] text-sm mb-6">
                {settings?.contactUsSection || 'If you have questions or comments about this policy, you may contact us at the email or phone number provided in our website footer.'}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  href="/contact"
                  className="flex items-center justify-center gap-2 px-6 py-3 gold-gradient gold-gradient-hover text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-[#D4AF37]/20 hover:-translate-y-0.5 text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Contact Privacy Team
                </Link>
                
                <Link
                  href="/terms"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-[#0F172A] font-medium rounded-xl hover:bg-[#FBF7F1] hover:shadow-md transition-all duration-200 border border-[#D4AF37]/30 text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  View Terms of Service
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