'use client';

import React from 'react';
import { ShieldCheck, Heart, Sparkles, PackageCheck, Leaf, Droplets, Sun, Flower } from 'lucide-react';

interface PureIngredientsBannerProps {
  titleMain?: string;
  titleHighlight?: string;
  description?: string;
  imageSrc?: string;
  rightBadgeText?: string;
  features?: Array<{
    icon: React.ElementType;
    title: string;
  }>;
}

export default function PureIngredientsBanner({
  titleMain = 'Pure Ingredients,',
  titleHighlight = 'Visible Results',
  description = "Nature's goodness, crafted for your beauty. Experience the power of clean and effective ingredients for radiant skin, healthy hair, and beautiful nails.",
  imageSrc = `${process.env.NEXT_PUBLIC_STATIC_URL}/pure.webp`,
  rightBadgeText = 'Clean\nBeauty\nPure\nEssentials',
  features = [
    {
      icon: ShieldCheck,
      title: 'Paraben Free',
    },
    {
      icon: Heart,
      title: 'Cruelty Free',
    },
    {
      icon: Sparkles,
      title: 'Dermatologically Tested',
    },
    {
      icon: PackageCheck,
      title: 'Safe for Daily Use',
    },
  ],
}: PureIngredientsBannerProps) {
  const gradientColors = [
    'from-[#D4AF37] to-[#B8860B]',
    'from-[#B8860B] to-[#D4AF37]',
    'from-[#C49219] to-[#D4AF37]',
    'from-[#D4AF37] to-[#C49219]'
  ];

  return (
    <section className="relative w-full overflow-hidden bg-white py-8 sm:py-10 lg:py-15">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div className="relative rounded-2xl bg-gradient-to-r from-[#FBF7F1] via-white to-[#FBF7F1] border border-[#D4AF37]/20 p-4 sm:p-6 lg:p-8 shadow-[0_10px_30px_rgba(212,175,55,0.08)]">

          {/* Background decorative curve accents */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#D4AF37]/10 to-transparent rounded-bl-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-[#D4AF37]/10 to-transparent rounded-tr-full pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center relative z-10 max-[767px]:gap-3">

            {/* LEFT COLUMN: TITLE, DESCRIPTION & HORIZONTAL ICONS */}
            <div className="lg:col-span-5 flex flex-col items-center text-center justify-center max-[767px]:w-full">

              {/* Heading */}
              <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-normal text-[#0F172A] tracking-tight leading-tight mb-1.5 max-[767px]:text-[19px]">
                {titleMain}{' '}
                <span className="font-serif italic text-[#B8860B] font-medium">{titleHighlight}</span>
              </h2>

              {/* Description */}
              <p className="text-[10px] sm:text-xs text-[#64748B] max-w-md leading-relaxed mb-4 sm:mb-5 max-[767px]:text-[9px] max-[767px]:mb-2">
                {description}
              </p>

              {/* Mobile IMAGE - shown between description and cards */}
              <div className="hidden max-[767px]:flex justify-center items-center w-full">
                <div className="relative w-full h-[150px] flex items-center justify-center">
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt="Pure Ingredients Showcase"
                      className="w-full h-full object-contain drop-shadow-xl"
                    />
                  ) : (
                    <div className="w-full h-full rounded-xl border border-[#D4AF37]/30 bg-white/80 flex flex-col items-center justify-center p-3 text-center">
                      <Leaf size={32} className="text-[#D4AF37] mb-1" />
                      <span className="text-xs font-medium text-[#0F172A]">
                        Natural Beauty Essentials
                      </span>
                      <span className="text-[9px] text-[#64748B] mt-0.5">
                        Skin • Hair • Nails
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Features Horizontal Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 w-full max-[767px]:grid-cols-4 max-[767px]:gap-x-1 max-[767px]:gap-y-0 max-[767px]:mt-1">
                {features.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <div key={index} className="flex flex-col items-center group">

                      <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br ${gradientColors[index % gradientColors.length]} shadow-sm flex items-center justify-center text-white transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg max-[767px]:w-9 max-[767px]:h-9`}>
                        <IconComponent
                          size={14}
                          strokeWidth={1.5}
                          className="max-[767px]:w-[13px] max-[767px]:h-[13px]"
                        />
                      </div>

                      <span className="text-[8px] sm:text-[9px] font-semibold text-[#0F172A] leading-tight text-center transition-colors group-hover:text-[#B8860B] mt-1 max-[767px]:text-[7px] max-[767px]:mt-0.5">
                        {feature.title}
                      </span>

                    </div>
                  );
                })}
              </div>

            </div>

            {/* RIGHT COLUMN: PRODUCT IMAGE / SHOWCASE - DESKTOP ONLY */}
            <div className="lg:col-span-5 flex justify-center items-center max-[767px]:hidden">
              <div className="relative w-full max-w-[420px] sm:max-w-[480px] h-[200px] sm:h-[260px] lg:h-[300px] flex items-center justify-center">
                {imageSrc ? (
                  <img
                    src={imageSrc}
                    alt="Pure Ingredients Showcase"
                    className="w-full h-full object-contain drop-shadow-xl"
                  />
                ) : (
                  <div className="w-full h-full rounded-xl border border-[#D4AF37]/30 bg-white/80 flex flex-col items-center justify-center p-3 text-center">
                    <Leaf size={32} className="text-[#D4AF37] mb-1" />
                    <span className="text-xs font-medium text-[#0F172A]">
                      Natural Beauty Essentials
                    </span>
                    <span className="text-[9px] text-[#64748B] mt-0.5">
                      Skin • Hair • Nails
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: STYLISH SCRIPT TYPOGRAPHY BADGE */}
            <div className="lg:col-span-2 hidden lg:flex justify-end items-center">
              <div className="text-right pr-2">
                <span className="font-serif italic text-base sm:text-lg text-[#B8860B] font-medium leading-snug whitespace-pre-line block">
                  {rightBadgeText}
                </span>
                <div className="flex justify-end mt-0.5 text-[#D4AF37]">
                  ✦
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}