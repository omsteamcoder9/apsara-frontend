'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Phone, MapPin, Clock, ArrowRight } from 'lucide-react';
import { settingsAPI } from '@/lib/settings-api';

interface BeautyNewsletterProps {
  title?: string;
  description?: string;
  buttonText?: string;
}

export default function BeautyNewsletter({
  title = 'Get in Touch With Us',
  description = 'Have questions about our products or need assistance? Our team is here to help you.',
  buttonText = 'Contact Us',
}: BeautyNewsletterProps) {
  const router = useRouter();

  const [contactInfo, setContactInfo] = useState({
    contactEmail: 'support@apsara.com',
    contactNumber: '+91 98765 43210',
    companyAddress: 'Mumbai, Maharashtra, India',
    whatsappNumber: '+91 98765 43210',
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const data = await settingsAPI.getContactInfo();

        setContactInfo({
          contactEmail: data.contactEmail || 'support@apsara.com',
          contactNumber: data.contactNumber || '+91 98765 43210',
          companyAddress: data.companyAddress || 'Mumbai, Maharashtra, India',
          whatsappNumber: data.whatsappNumber || '+91 98765 43210',
        });
      } catch (error) {
        console.error('Error fetching contact info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContactInfo();
  }, []);

  const handleContact = () => {
    router.push('/contact');
  };

  const contactItems = [
    {
      icon: Mail,
      label: 'Email',
      value: contactInfo.contactEmail,
      href: `mailto:${contactInfo.contactEmail}`,
    },
    {
      icon: Phone,
      label: 'Phone',
      value: contactInfo.contactNumber,
      href: `tel:${contactInfo.contactNumber}`,
    },
    {
      icon: MapPin,
      label: 'Address',
      value: contactInfo.companyAddress,
      href: '#',
    },
    {
      icon: Clock,
      label: 'Working Hours',
      value: 'Mon-Sat, 9AM - 7PM',
      href: '#',
    },
  ];

  if (loading) {
    return (
      <section className="relative w-full overflow-hidden bg-white py-8 sm:py-10 lg:py-12 max-[767px]:py-5">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10 max-[767px]:px-2">
          <div className="relative rounded-2xl bg-gradient-to-r from-[#FBF7F1] via-white to-[#FBF7F1] border border-[#D4AF37]/20 p-4 sm:p-6 lg:p-8 shadow-[0_10px_30px_rgba(212,175,55,0.08)]">

            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">

              <div className="flex-1 text-center lg:text-left">
                <div className="h-8 w-48 animate-pulse rounded bg-[#D4AF37]/10" />
                <div className="mt-2 h-4 w-64 animate-pulse rounded bg-[#D4AF37]/5" />
              </div>

              <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 max-[767px]:grid-cols-4 max-[767px]:gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full animate-pulse bg-[#D4AF37]/10 max-[767px]:w-8 max-[767px]:h-8" />
                    <div className="mt-1 h-3 w-12 animate-pulse rounded bg-[#D4AF37]/5" />
                    <div className="mt-0.5 h-2 w-16 animate-pulse rounded bg-[#D4AF37]/5" />
                  </div>
                ))}
              </div>

              <div className="flex-shrink-0">
                <div className="h-10 w-28 animate-pulse rounded-md bg-[#D4AF37]/10" />
              </div>

            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full overflow-hidden bg-white py-8 sm:py-10 lg:py-12 max-[767px]:py-5">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10 max-[767px]:px-2">

        <div className="relative rounded-2xl bg-gradient-to-r from-[#FBF7F1] via-white to-[#FBF7F1] border border-[#D4AF37]/20 p-4 sm:p-6 lg:p-8 shadow-[0_10px_30px_rgba(212,175,55,0.08)]">

          {/* Background decorative curve accents */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#D4AF37]/10 to-transparent rounded-bl-full pointer-events-none" />

          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-[#D4AF37]/10 to-transparent rounded-tr-full pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8 relative z-10 max-[767px]:gap-3">

            {/* LEFT: Title & Description */}
            <div className="flex-1 text-center lg:text-left max-[767px]:w-full">

              <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif font-normal text-[#0F172A] tracking-tight leading-tight mb-1 max-[767px]:text-[17px] max-[767px]:mb-1">
                {title}
              </h2>

              <p className="text-[10px] sm:text-xs text-[#64748B] leading-relaxed max-w-md lg:max-w-lg max-[767px]:text-[8px] max-[767px]:leading-[1.4] max-[767px]:mx-auto">
                {description}
              </p>

            </div>

            {/* MIDDLE: Contact Information */}
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 max-[767px]:grid-cols-4 max-[767px]:gap-1 max-[767px]:w-full">

              {contactItems.map((item, index) => {
                const IconComponent = item.icon;

                return (
                  <a
                    key={index}
                    href={item.href}
                    className="flex flex-col items-center text-center group p-1.5 rounded-xl hover:bg-[#FBF7F1] transition-all duration-300 max-[767px]:p-0.5 min-w-0"
                  >

                    {/* Icon */}
                    <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-[#D4AF37]/30 bg-white shadow-sm flex items-center justify-center text-[#D4AF37] transition-all duration-300 max-[767px]:w-[30px] max-[767px]:h-[30px]">

                      <IconComponent
                        size={14}
                        strokeWidth={1.5}
                        className="max-[767px]:w-[12px] max-[767px]:h-[12px]"
                      />

                    </div>

                    {/* Label */}
                    <span className="text-[7px] sm:text-[8px] font-medium text-[#64748B] group-hover:text-[#B8860B] transition-colors max-[767px]:text-[7px] max-[767px]:leading-tight">
                      {item.label}
                    </span>

                    {/* Value */}
                    <span className="text-[6px] sm:text-[7px] font-semibold text-[#0F172A] truncate max-w-[50px] sm:max-w-[70px] max-[767px]:text-[6px] max-[767px]:max-w-[60px]">
                      {item.value}
                    </span>

                  </a>
                );
              })}

            </div>

            {/* RIGHT: Contact Us Button */}
            <div className="flex-shrink-0 max-[767px]:mt-0.5">

              <button
                onClick={handleContact}
                className="inline-flex items-center gap-1.5 px-4 py-2 sm:px-5 sm:py-2.5 rounded-md bg-[#B8860B] hover:bg-[#996D08] text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-wider transition-all duration-300 shadow-[0_4px_15px_rgba(184,134,11,0.3)] hover:shadow-[0_6px_20px_rgba(184,134,11,0.4)] group cursor-pointer max-[767px]:gap-1 max-[767px]:px-3 max-[767px]:py-1.5 max-[767px]:text-[7px]"
              >
                <span>{buttonText}</span>

                <ArrowRight
                  size={12}
                  className="transition-transform duration-300 group-hover:translate-x-1 max-[767px]:w-[9px] max-[767px]:h-[9px]"
                />
              </button>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}