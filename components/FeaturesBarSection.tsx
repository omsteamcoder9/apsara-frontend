'use client';

import React from 'react';
import {
  Sparkles,
  Heart,
  Shield,
  PackageCheck,
} from 'lucide-react';

interface BeautyTipsHorizontalBannerProps {
  title?: string;
  description?: string;
  buttonText?: string;
  onReadMore?: () => void;
  items?: Array<{
    icon: React.ElementType;
    title: string;
  }>;
}

export default function BeautyTipsHorizontalBanner({
  title = 'Everything You Deserve',
  description = 'Authentic beauty essentials, thoughtfully selected to make every purchase simple, safe, and special.',
  onReadMore,
  items = [
    {
      icon: Shield,
      title: 'Authentic Products',
    },
    {
      icon: Heart,
      title: 'Trusted Brands',
    },
    {
      icon: Sparkles,
      title: 'Secure Checkout',
    },
    {
      icon: PackageCheck,
      title: 'Fast Delivery',
    },
  ],
}: BeautyTipsHorizontalBannerProps) {
  return (
    <section className="relative w-full overflow-hidden bg-white py-6 sm:py-8 lg:py-10">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div className="relative rounded-2xl bg-gradient-to-r from-[#FBF7F1] via-white to-[#FBF7F1] border border-[#D4AF37]/20 p-4 sm:p-6 lg:p-8 shadow-[0_10px_30px_rgba(212,175,55,0.08)] overflow-hidden">

          {/* Background decorative accents */}
          <div className="absolute top-0 left-0 w-48 h-48 bg-gradient-to-tr from-[#D4AF37]/10 to-transparent rounded-full blur-xl pointer-events-none" />

          <div className="absolute bottom-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#D4AF37]/10 to-transparent rounded-full blur-xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">

            {/* LEFT COLUMN: CONTENT */}
            <div className="lg:col-span-4 flex flex-col items-start justify-center">

              {/* Small label */}
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-[1px] bg-[#D4AF37]" />

                <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.25em] text-[#B8860B]">
                  SHOP WITH CONFIDENCE
                </span>
              </div>

              {/* Heading */}
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif font-normal text-[#0F172A] tracking-tight leading-tight mb-1 sm:mb-2">
                {title}
              </h2>

              {/* Description */}
              <p className="text-[10px] sm:text-xs text-[#64748B] leading-relaxed max-w-sm">
                {description}
              </p>

            </div>

            {/* RIGHT COLUMN: BENEFITS */}
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-3 items-center max-[767px]:grid-cols-4 max-[767px]:gap-1">

              {items.map((item, index) => {
                const IconComponent = item.icon;

                return (
                  <div
                    key={index}
                    className="relative flex flex-col items-center text-center group px-1 max-[767px]:px-0"
                  >

                    {/* Divider */}
                    {index > 0 && (
                      <div className="hidden sm:block absolute left-0 top-1/2 -translate-y-1/2 w-[1px] h-12 bg-[#D4AF37]/20" />
                    )}

                    {/* Icon */}
                    <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-[#D4AF37]/30 bg-white shadow-sm flex items-center justify-center text-[#D4AF37] transition-all duration-300 group-hover:border-[#D4AF37] group-hover:bg-[#FBF7F1] group-hover:shadow-[0_4px_15px_rgba(212,175,55,0.18)] max-[767px]:w-9 max-[767px]:h-9">
                      <IconComponent
                        size={16}
                        strokeWidth={1.5}
                        className="max-[767px]:w-[13px] max-[767px]:h-[13px]"
                      />
                    </div>

                    {/* Title */}
                    <span className="text-[9px] sm:text-[10px] font-semibold text-[#0F172A] tracking-wide transition-colors group-hover:text-[#B8860B] leading-tight mt-2 max-[767px]:text-[7px] max-[767px]:mt-1">
                      {item.title}
                    </span>

                  </div>
                );
              })}

            </div>

          </div>
        </div>
      </div>
    </section>
  );
}