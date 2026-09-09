'use client';

import React from 'react';
import { BookOpen, Sparkles, Heart, Shield, ArrowRight } from 'lucide-react';

interface BeautyTipsBannerProps {
  title?: string;
  description?: string;
  imageSrc?: string;
  buttonText?: string;
  onReadMore?: () => void;
  items?: Array<{
    icon: React.ElementType;
    title: string;
  }>;
}

export default function BeautyTipsBanner({
  title = 'Beauty Tips & Inspiration',
  description = 'Get expert advice, beauty tips and the latest trends to look and feel your best.',
  imageSrc = `${process.env.NEXT_PUBLIC_STATIC_URL}/beauty.webp`,
  onReadMore,
  items = [
    {
      icon: Sparkles,
      title: 'Skincare Routines',
    },
    {
      icon: Heart,
      title: 'Hair Care Tips',
    },
    {
      icon: BookOpen,
      title: 'Makeup Guides',
    },
    {
      icon: Shield,
      title: 'Wellness & Self Care',
    },
  ],
}: BeautyTipsBannerProps) {
  const gradientColors = [
    'from-[#D4AF37] to-[#B8860B]',
    'from-[#B8860B] to-[#D4AF37]',
    'from-[#C49219] to-[#D4AF37]',
    'from-[#D4AF37] to-[#C49219]'
  ];

  return (
    <section className="relative w-full overflow-hidden bg-white py-12 sm:py-16 lg:py-4 max-[767px]:py-5">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10 max-[767px]:px-2">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10 max-[767px]:gap-2">

          {/* LEFT COLUMN: TITLE, DESCRIPTION & CTA BUTTON */}
          <div className="lg:col-span-4 flex flex-col items-start justify-center max-[767px]:w-full">

            <h2 className="text-3xl sm:text-4xl font-serif font-normal text-[#0F172A] tracking-tight leading-tight mb-3 max-[767px]:text-[17px] max-[767px]:leading-[1.2] max-[767px]:mb-1.5">
              {title}
            </h2>

            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed mb-6 max-w-sm max-[767px]:text-[8px] max-[767px]:leading-[1.4] max-[767px]:mb-1">
              {description}
            </p>

          </div>

          {/* MIDDLE COLUMN: FEATURED MODEL IMAGE */}
          <div className="lg:col-span-5 flex justify-center items-center max-[767px]:w-full">
            <div className="relative w-full max-w-[480px] sm:max-w-[560px] h-[340px] sm:h-[420px] lg:h-[480px] flex items-center justify-center max-[767px]:h-[145px] max-[767px]:max-w-none">
              {imageSrc ? (
                <img
                  src={imageSrc}
                  alt="Beauty Tips and Inspiration"
                  className="w-full h-full object-contain drop-shadow-2xl max-[767px]:w-[170px] max-[767px]:h-auto"
                />
              ) : (
                <div className="w-full h-full rounded-2xl border border-[#D4AF37]/30 bg-white/80 flex flex-col items-center justify-center p-4 text-center shadow-inner">
                  <Sparkles size={48} className="text-[#D4AF37] mb-2" />
                  <span className="text-sm font-medium text-[#0F172A]">
                    Add model showcase image here
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: VERTICAL LIST OF ICON-LABELS */}
          <div className="lg:col-span-3 flex flex-col justify-center space-y-4 lg:pl-6 max-[767px]:grid max-[767px]:grid-cols-4 max-[767px]:gap-1 max-[767px]:space-y-0 max-[767px]:w-full max-[767px]:mt-1">

            {items.map((item, index) => {
              const IconComponent = item.icon;

              return (
                <div
                  key={index}
                  className="flex items-center gap-4 group max-[767px]:flex-col max-[767px]:items-center max-[767px]:justify-start max-[767px]:gap-0.5 max-[767px]:min-w-0"
                >

                  {/* Icon */}
                  <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br ${gradientColors[index % gradientColors.length]} shadow-sm flex items-center justify-center text-white transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg max-[767px]:w-[30px] max-[767px]:h-[30px]`}>
                    <IconComponent
                      size={20}
                      strokeWidth={1.5}
                      className="max-[767px]:w-[13px] max-[767px]:h-[13px]"
                    />
                  </div>

                  {/* Title */}
                  <span className="text-sm font-semibold text-[#0F172A] tracking-wide transition-colors group-hover:text-[#B8860B] max-[767px]:text-[7px] max-[767px]:leading-[1.2] max-[767px]:text-center max-[767px]:tracking-normal">
                    {item.title}
                  </span>

                </div>
              );
            })}

          </div>

        </div>
      </div>
    </section>
  );
}