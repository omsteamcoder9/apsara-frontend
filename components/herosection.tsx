"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Truck,
  ShieldCheck,
  Award,
  Headphones,
} from "lucide-react";

export default function HeroSection() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  // R2 Static URL for images
  const STATIC_URL = process.env.NEXT_PUBLIC_STATIC_URL;

  // =========================================================
  // BEAUTY HERO SLIDES
  // =========================================================
  const slides = [
    {
      id: 1,
      label: "Beauty • Care • Confidence",
      title: "Your Beauty",
      highlight: "Our Passion",
      description:
        "Discover premium skincare, haircare, makeup and personal care products selected to bring out your natural beauty.",
      image: `${STATIC_URL}/hero1.webp`,
    },
    {
      id: 2,
      label: "Glow • Style • Self Care",
      title: "Glow Naturally",
      highlight: "Stay Beautiful",
      description:
        "Explore trusted beauty products for radiant skin, beautiful hair and everyday confidence.",
      image: `${STATIC_URL}/hero2.webp`,
    },
  ];

  // =========================================================
  // AUTO SLIDER
  // DO NOT CHANGE — 5 SECOND AUTOMATIC MOVEMENT
  // =========================================================
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const current = slides[currentSlide];

  const handleShopNow = () => {
    router.push("/products");
  };

  const handleAboutUs = () => {
    router.push("/about");
  };

  return (
    <>
      {/* =====================================================
          HERO SECTION
      ====================================================== */}
      <section className="relative w-full  overflow-hidden bg-[#FBF7F1] text-[#3F3A32]">

        {/* =================================================
            BACKGROUND DECORATION
        ================================================== */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">

          {/* Soft cream glow */}
          <div className="absolute left-[-10%] top-[10%] h-[350px] w-[350px] sm:h-[500px] sm:w-[500px] rounded-full bg-[#F3E8D7]/60 blur-[120px]" />

          {/* Gold glow */}
          <div className="absolute right-[15%] top-[5%] h-[350px] w-[350px] sm:h-[500px] sm:w-[500px] rounded-full bg-[#B8860B]/10 blur-[130px]" />

          {/* Soft decorative circle */}
          <div className="absolute right-[-150px] top-[-100px] h-[600px] w-[600px] rounded-full border border-[#B8860B]/10 hidden sm:block" />

          <div className="absolute right-[-100px] top-[-50px] h-[500px] w-[500px] rounded-full border border-[#B8860B]/10 hidden sm:block" />

          {/* Soft bottom wave */}
          <div className="absolute bottom-[-180px] left-[-10%] w-[120%] h-[280px] rounded-[50%] bg-white/60 blur-[1px]" />
        </div>

        {/* =================================================
            MAIN HERO
        ================================================== */}
        <div className="relative mx-auto flex h-full max-w-[1440px] items-center px-4 sm:px-6 lg:px-12">

          {/* =================================================
              LEFT CONTENT
          ================================================== */}
          <div className="relative z-20 w-full lg:w-[45%] xl:w-[43%]">

            {/* Small Label */}
            <div className="mb-2 sm:mb-4 flex items-center gap-2 sm:gap-3">

              <span className="h-[2px] w-6 sm:w-10 bg-[#B8860B]" />

              <span className="text-[8px] sm:text-[11px] lg:text-[12px] xl:text-[13px] font-semibold uppercase tracking-[0.18em] sm:tracking-[0.25em] text-[#B8860B]">
                {current.label}
              </span>

            </div>

            {/* Heading */}
            <h1 className="max-w-[650px] text-[30px] sm:text-[42px] md:text-[48px] lg:text-[54px] xl:text-[60px] font-serif font-medium leading-[0.98] tracking-[-0.035em]">

              <span className="block text-[#3F3A32]">
                {current.title}
              </span>

              <span className="block text-[#B8860B] mt-1">
                {current.highlight}
              </span>

            </h1>

            {/* Description */}
            <p className="mt-4 sm:mt-5 max-w-[570px] text-[11px] sm:text-[14px] lg:text-[15px] leading-5 sm:leading-6 text-[#6B6258]">
              {current.description}
            </p>

            {/* =================================================
                BUTTONS
            ================================================== */}
            <div className="mt-5 sm:mt-7 flex flex-row gap-3 sm:gap-4">

              {/* Shop Now */}
              <button
                onClick={handleShopNow}
                className="group flex h-10 sm:h-12 items-center justify-center gap-2 sm:gap-3 rounded-full bg-[#B8860B] px-5 sm:px-7 text-[10px] sm:text-xs font-bold uppercase tracking-wide text-white transition-all duration-300 hover:bg-[#9A7008] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#B8860B]/20 whitespace-nowrap cursor-pointer"
              >
                Shop Now

                <ArrowRight
                  size={14}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>

              {/* About */}
              <button
                onClick={handleAboutUs}
                className="group flex h-10 sm:h-12 items-center justify-center gap-2 sm:gap-3 rounded-full border border-[#B8860B]/50 bg-white/70 px-5 sm:px-7 text-[10px] sm:text-xs font-bold uppercase tracking-wide text-[#3F3A32] transition-all duration-300 hover:bg-[#B8860B] hover:text-white hover:border-[#B8860B] whitespace-nowrap cursor-pointer"
              >
                About Us

                <ArrowRight
                  size={14}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>

            </div>

            {/* =================================================
                TRUST FEATURES
            ================================================== */}
            <div className="mt-6 sm:mt-8 flex flex-row flex-wrap items-center gap-x-4 sm:gap-x-6 gap-y-2 text-[8px] sm:text-[10px] lg:text-[11px] text-[#6B6258]">

              <span className="flex items-center gap-1.5 whitespace-nowrap">
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#B8860B]/40 text-[#B8860B]">
                  ✓
                </span>
                Genuine Products
              </span>

              <span className="flex items-center gap-1.5 whitespace-nowrap">
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#B8860B]/40 text-[#B8860B]">
                  ✓
                </span>
                Trusted Brands
              </span>

              <span className="flex items-center gap-1.5 whitespace-nowrap">
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#B8860B]/40 text-[#B8860B]">
                  ✓
                </span>
                Secure Shopping
              </span>

            </div>
          </div>

          {/* =================================================
              RIGHT IMAGE AREA
          ================================================== */}
          <div className="relative z-10 hidden lg:block lg:w-[55%] xl:w-[57%]">

            <div className="relative flex items-center justify-center">

              {/* Gold Glow */}
              <div className="absolute inset-0 flex items-center justify-center">

                <div className="h-[500px] w-[500px] xl:h-[600px] xl:w-[600px] rounded-full bg-[#B8860B]/10 blur-[100px]" />

              </div>


              {/* Image */}
              <div className="relative w-[620px] h-[460px] xl:w-[720px] xl:h-[520px]">

                <Image
                  src={current.image}
                  alt={current.label}
                  fill
                  className="object-contain"
                  priority
                />

              </div>

            </div>
          </div>

          {/* =================================================
              MOBILE IMAGE
          ================================================== */}
          <div className="absolute bottom-0 right-[-20px] sm:right-[5%] h-[190px] sm:h-[230px] w-[55%] sm:w-[45%] lg:hidden">

            <Image
              src={current.image}
              alt={current.label}
              fill
              className="object-contain"
              priority
            />

          </div>

        </div>

        {/* =================================================
            SLIDER DOTS
        ================================================== */}
        <div className="absolute bottom-4 sm:bottom-5 left-1/2 z-30 -translate-x-1/2 flex items-center gap-2">

          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentSlide
                  ? "h-2.5 w-7 bg-[#B8860B]"
                  : "h-2 w-2 bg-[#B8860B]/25 hover:bg-[#B8860B]/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}

        </div>

      </section>


    </>
  );
}