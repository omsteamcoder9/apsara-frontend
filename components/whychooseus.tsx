'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Leaf, Truck, Diamond, Heart, ArrowRight, Sparkles, Shield, Star } from 'lucide-react';

interface WhyChooseUsProps {
  subtitle?: string;
  titleMain?: string;
  titleHighlight?: string;
  description?: string;
  imageSrc?: string;
  badgeText?: string;
  features?: Array<{
    icon: React.ElementType;
    title: string;
    description: string;
  }>;
  onDiscoverMore?: () => void;
}

export default function WhyChooseUs({
  subtitle = 'WHY CHOOSE US',
  titleMain = 'More Than Beauty,',
  titleHighlight = "It's a Better You",
  description = 'We bring you trusted products that care for your skin, hair, and nails — because you deserve to feel beautiful, every day.',
  imageSrc = `${process.env.NEXT_PUBLIC_STATIC_URL}/whychooseus.webp`,
  features = [
    {
      icon: Sparkles,
      title: 'Premium Quality',
      description: '100% authentic beauty products from trusted brands.',
    },
    {
      icon: Shield,
      title: 'Skin Safe',
      description: 'Gentle formulations crafted for all skin types.',
    },
    {
      icon: Star,
      title: 'Curated Collection',
      description: 'Thoughtfully selected skincare, hair, and nail essentials.',
    },
    {
      icon: Heart,
      title: 'Self-Care Rituals',
      description: 'Products designed to elevate your daily beauty routine.',
    },
  ],
  onDiscoverMore,
}: WhyChooseUsProps) {
  const router = useRouter();

  const handleDiscoverMore = () => {
    if (onDiscoverMore) {
      onDiscoverMore();
    } else {
      router.push('/about');
    }
  };

  return (
    <section className="relative w-full overflow-hidden bg-white py-12 sm:py-16 lg:py-20 max-[767px]:py-5">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10 max-[767px]:px-2">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center max-[767px]:grid-cols-[62%_38%] max-[767px]:gap-1">

          {/* LEFT COLUMN: IMAGE & BADGE ARTWORK */}
          <div className="lg:col-span-6 relative flex justify-center items-center max-[767px]:w-full max-[767px]:order-2">

            {/* Decorative Arch/Backdrop shape - Larger */}
            <div className="absolute w-[280px] h-[340px] sm:w-[380px] sm:h-[440px] md:w-[480px] md:h-[440px] rounded-t-full border border-[#D4AF37]/30 bg-[#FBF7F1]/40 -top-6 sm:-top-8 left-1/2 -translate-x-1/2 z-0 pointer-events-none" />

            {/* Main Feature Image / Illustration - Much Bigger */}
            <div className="relative z-10 w-full max-w-[560px] h-[300px] sm:h-[400px] flex items-center justify-center max-[767px]:h-auto max-[767px]:max-w-none">
              {imageSrc ? (
                <img
                  src={imageSrc}
                  alt="Why Choose Us"
                  className="w-full h-full object-contain drop-shadow-2xl max-[767px]:w-[180px] max-[767px]:h-auto"
                />
              ) : (
                /* Fallback placeholder graphic */
                <div className="w-full h-full rounded-2xl border border-[#D4AF37]/20 bg-gradient-to-b from-white/80 to-[#FBF7F1] flex flex-col items-center justify-center p-4 text-center shadow-inner">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center text-white mb-2 shadow-lg">
                    <Sparkles size={32} className="sm:w-[40px] sm:h-[40px]" />
                  </div>
                  <span className="text-sm sm:text-base font-semibold text-[#0F172A]">
                    Premium Beauty Essentials
                  </span>
                  <span className="text-xs sm:text-sm text-[#64748B] mt-0.5">
                    Skincare • Haircare • Nails
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: CONTENT & FEATURES GRID */}
          <div className="lg:col-span-6 flex flex-col justify-center max-[767px]:min-w-0 max-[767px]:pl-1 max-[767px]:order-1">

            {/* Section Subtitle */}
            <div className="flex items-center gap-3 mb-2 sm:mb-3 max-[767px]:gap-1 max-[767px]:mb-1">
              <div className="w-8 sm:w-10 h-[1px] bg-gradient-to-r from-[#D4AF37] to-[#B8860B] max-[767px]:w-3" />
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#D4AF37] max-[767px]:text-[6px] max-[767px]:tracking-[0.12em] whitespace-nowrap">
                {subtitle}
              </span>
              <div className="w-8 sm:w-10 h-[1px] bg-gradient-to-l from-[#D4AF37] to-[#B8860B] max-[767px]:w-3" />
            </div>

            {/* Main Heading */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-normal text-[#0F172A] tracking-tight leading-[1.15] mb-3 sm:mb-4 max-[767px]:text-[13px] max-[767px]:leading-[1.15] max-[767px]:mb-1">
              {titleMain}{' '}
              <span className="font-serif italic  font-medium">
                {titleHighlight}
              </span>
            </h2>

            {/* Description */}
            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed mb-6 sm:mb-8 max-w-xl max-[767px]:text-[7px] max-[767px]:leading-[1.35] max-[767px]:mb-2">
              {description}
            </p>

            {/* Features 2x2 Grid - Optimized */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8 max-[767px]:grid-cols-1 max-[767px]:gap-1.5 max-[767px]:mb-2">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                const gradientColors = [
                  'from-[#D4AF37] to-[#B8860B]',
                  'from-[#B8860B] to-[#D4AF37]',
                  'from-[#C49219] to-[#D4AF37]',
                  'from-[#D4AF37] to-[#C49219]'
                ];

                return (
                  <div
                    key={index}
                    className="flex items-start gap-3 group max-[767px]:gap-1.5 max-[767px]:w-full"
                  >
                    <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br ${gradientColors[index % gradientColors.length]} shadow-sm flex items-center justify-center text-white transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg max-[767px]:w-[18px] max-[767px]:h-[18px]`}>
                      <IconComponent
                        size={18}
                        strokeWidth={1.5}
                        className="max-[767px]:w-[9px] max-[767px]:h-[9px]"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm sm:text-base font-bold text-[#0F172A] mb-0.5 group-hover:text-[#B8860B] transition-colors max-[767px]:text-[7px] max-[767px]:leading-[1.15] max-[767px]:mb-0">
                        {feature.title}
                      </h3>

                      <p className="text-[10px] sm:text-xs text-[#64748B] leading-relaxed max-[767px]:text-[6px] max-[767px]:leading-[1.2]">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Button - Navigates to About page */}
            <div>
              <button
                onClick={handleDiscoverMore}
                className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-md bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:from-[#E5C158] hover:to-[#C49219] text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-[0_6px_20px_rgba(212,175,55,0.3)] hover:shadow-[0_8px_25px_rgba(212,175,55,0.4)] group cursor-pointer max-[767px]:gap-1 max-[767px]:px-2.5 max-[767px]:py-1.5 max-[767px]:text-[6px]"
              >
                <span>About Us</span>
                <ArrowRight
                  size={14}
                  className="transition-transform duration-300 group-hover:translate-x-1 max-[767px]:w-[8px] max-[767px]:h-[8px]"
                />
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}