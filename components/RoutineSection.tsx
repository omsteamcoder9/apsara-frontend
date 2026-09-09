'use client';

import React from 'react';
import { Droplet, Sparkles, Shield, Sun, ChevronRight, ArrowRight } from 'lucide-react';

interface RoutineStep {
  number: string;
  icon: React.ElementType;
  title: string;
  description: string;
}

interface RoutineSectionProps {
  subtitle?: string;
  titleMain?: string;
  titleHighlight?: string;
  description?: string;
  buttonText?: string;
  onStartRoutine?: () => void;
  steps?: RoutineStep[];
}

export default function RoutineSection({
  subtitle = 'FIND YOUR ROUTINE',
  titleMain = 'Small Steps.',
  titleHighlight = 'Beautiful Results.',
  description = 'Build a simple routine that works for you. Choose the right essentials, follow your routine consistently, and enjoy a more confident everyday you.',
  onStartRoutine,
  steps = [
    {
      number: '01',
      icon: Droplet,
      title: 'Cleanse',
      description: 'Start fresh and prepare your skin.',
    },
    {
      number: '02',
      icon: Sparkles,
      title: 'Care',
      description: 'Nourish your skin and hair with the right essentials.',
    },
    {
      number: '03',
      icon: Shield,
      title: 'Protect',
      description: 'Keep your beauty routine balanced every day.',
    },
    {
      number: '04',
      icon: Sun,
      title: 'Glow',
      description: 'Finish your routine and let your natural beauty shine.',
    },
  ],
}: RoutineSectionProps) {
  return (
    <section className="relative w-full overflow-hidden bg-white py-12 sm:py-16 lg:py-10 max-[767px]:py-5">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10 max-[767px]:px-2">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10 max-[767px]:gap-3">

          {/* LEFT COLUMN: TITLE, DESCRIPTION & CTA */}
          <div className="lg:col-span-4 flex flex-col items-start justify-center max-[767px]:w-full">

            {/* Subtitle */}
            <div className="flex items-center gap-2 mb-3 max-[767px]:gap-1 max-[767px]:mb-1.5">
              <div className="w-8 sm:w-12 h-[1px] bg-[#D4AF37] max-[767px]:w-3" />

              <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-[#D4AF37] max-[767px]:text-[7px] max-[767px]:tracking-[0.12em]">
                {subtitle}
              </span>
            </div>

            {/* Main Heading */}
            <h2 className="text-3xl sm:text-4xl font-serif font-normal text-[#0F172A] tracking-tight leading-tight mb-3 max-[767px]:text-[17px] max-[767px]:leading-[1.2] max-[767px]:mb-1.5">
              {titleMain} <br />
              <span className="font-serif italic text-[#B8860B] font-medium">
                {titleHighlight}
              </span>
            </h2>

            {/* Description */}
            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed mb-6 max-w-sm max-[767px]:text-[8px] max-[767px]:leading-[1.4] max-[767px]:mb-1">
              {description}
            </p>

          </div>

          {/* RIGHT COLUMN: STEPS SEQUENCE WITH ARROWS */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 items-center max-[767px]:grid-cols-4 max-[767px]:gap-1">

            {steps.map((step, index) => {
              const IconComponent = step.icon;

              return (
                <div
                  key={index}
                  className="relative flex flex-col items-center text-center group max-[767px]:min-w-0"
                >

                  {/* Step Circle & Floating Number Badge */}
                  <div className="relative mb-3 sm:mb-4 max-[767px]:mb-2">

                    <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full border border-[#D4AF37]/30 bg-white shadow-sm flex items-center justify-center text-[#D4AF37] transition-all duration-300 max-[767px]:w-[38px] max-[767px]:h-[38px]">
                      <IconComponent
                        size={20}
                        className="sm:w-[28px] sm:h-[28px] max-[767px]:w-[15px] max-[767px]:h-[15px]"
                        strokeWidth={1.5}
                      />
                    </div>

                    {/* Number Indicator Pill */}
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 sm:px-3 py-0.5 rounded-full bg-[#FBF7F1] border border-[#D4AF37] text-[8px] sm:text-[10px] md:text-xs font-bold text-[#D4AF37] shadow-sm whitespace-nowrap max-[767px]:-bottom-1 max-[767px]:px-1 max-[767px]:text-[5px]">
                      {step.number}
                    </div>

                  </div>

                  {/* Arrow connector between cards on desktop */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:flex absolute -right-4 top-10 -translate-y-1/2 z-20 text-[#D4AF37]/60 items-center justify-center">
                      <ChevronRight size={20} />
                    </div>
                  )}

                  {/* Step Title & Details */}
                  <div className="px-0.5 sm:px-1 mt-1 sm:mt-2 max-[767px]:mt-0 max-[767px]:w-full">

                    <h3 className="text-[11px] sm:text-sm md:text-base font-bold text-[#0F172A] mb-0.5 sm:mb-1 transition-colors group-hover:text-[#B8860B] max-[767px]:text-[8px] max-[767px]:leading-[1.2] max-[767px]:mb-0.5">
                      {step.title}
                    </h3>

                    <p className="text-[9px] sm:text-xs text-[#64748B] leading-relaxed max-[767px]:text-[6px] max-[767px]:leading-[1.25]">
                      {step.description}
                    </p>

                  </div>

                </div>
              );
            })}

          </div>

        </div>
      </div>
    </section>
  );
}