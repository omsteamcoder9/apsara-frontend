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
  const storeName = process.env.NEXT_PUBLIC_SITE_NAME || 'Apsara';

  // =========================================================
  // BEAUTY HERO SLIDES
  // =========================================================
  const slides = [
    {
      id: 1,
      label: `Beauty • ${storeName} • Confidence`,
      title: `Your Beauty`,
      highlight: `Our Passion`,
      description:
        "Discover premium beauty essentials carefully selected for your natural glow.",
      image: `${STATIC_URL}/hero1.webp`,
    },
    {
      id: 2,
      label: `Glow • ${storeName} • Confidence`,
      title: `Glow Naturally`,
      highlight: `Stay Beautiful`,
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
      <section
        className="
          relative
          w-full
          overflow-hidden
          bg-[#FBF7F1]
          text-[#3F3A32]
        "
      >
        {/* =================================================
            BACKGROUND DECORATION
        ================================================== */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">

          {/* Soft cream glow */}
          <div
            className="
              absolute
              left-[-10%]
              top-[10%]
              h-[350px]
              w-[350px]
              sm:h-[500px]
              sm:w-[500px]
              rounded-full
              bg-[#F3E8D7]/60
              blur-[120px]
            "
          />

          {/* Gold glow */}
          <div
            className="
              absolute
              right-[15%]
              top-[5%]
              h-[350px]
              w-[350px]
              sm:h-[500px]
              sm:w-[500px]
              rounded-full
              bg-[#B8860B]/10
              blur-[130px]
            "
          />

          {/* Soft decorative circle */}
          <div
            className="
              absolute
              right-[-150px]
              top-[-100px]
              h-[600px]
              w-[600px]
              rounded-full
              border
              border-[#B8860B]/10
              hidden
              sm:block
            "
          />

          <div
            className="
              absolute
              right-[-100px]
              top-[-50px]
              h-[500px]
              w-[500px]
              rounded-full
              border
              border-[#B8860B]/10
              hidden
              sm:block
            "
          />

          {/* Soft bottom wave */}
          <div
            className="
              absolute
              bottom-[-180px]
              left-[-10%]
              w-[120%]
              h-[280px]
              rounded-[50%]
              bg-white/60
              blur-[1px]
            "
          />
        </div>

        {/* =================================================
            MAIN HERO
        ================================================== */}
        <div
          className="
            relative
            mx-auto
            flex
            h-full
            w-full
            max-w-[1440px]
            items-center
            px-3
            min-[375px]:px-4
            sm:px-6
            lg:px-12
            mt-5
            sm:mt-0
          "
        >
          {/* =================================================
              LEFT CONTENT
          ================================================== */}
          <div
            className="
              relative
              z-20
              w-full
              lg:w-[45%]
              xl:w-[43%]
            "
          >
            {/* Small Label */}
            <div
              className="
                mb-2
                sm:mb-4
                flex
                items-center
                gap-2
                sm:gap-3
              "
            >
              <span
                className="
                  h-[2px]
                  w-6
                  sm:w-10
                  bg-[#B8860B]
                  shrink-0
                "
              />

              <span
                className="
                  text-[6px]
                  min-[375px]:text-[6.5px]
                  min-[425px]:text-[7px]
                  sm:text-[11px]
                  lg:text-[12px]
                  xl:text-[13px]
                  font-semibold
                  uppercase
                  tracking-[0.18em]
                  sm:tracking-[0.25em]
                  text-[#B8860B]
                  whitespace-nowrap
                "
              >
                {current.label}
              </span>
            </div>

            {/* Heading */}
            <h1
              className="
                max-w-[650px]
                text-[20px]
                min-[375px]:text-[22px]
                min-[425px]:text-[24px]
                sm:text-[42px]
                md:text-[48px]
                lg:text-[54px]
                xl:text-[60px]
                font-serif
                font-medium
                leading-[0.98]
                tracking-[-0.035em]
              "
            >
              <span className="block text-[#3F3A32]">
                {current.title}
              </span>

              <span className="block text-[#B8860B] mt-1">
                {current.highlight}
              </span>
            </h1>

            {/* =================================================
                DESCRIPTION
            ================================================== */}
            <p
              className="
                mt-3
                sm:mt-5
                w-full
                max-w-[240px]
                min-[375px]:max-w-[260px]
                min-[425px]:max-w-[280px]
                sm:max-w-[570px]
                text-[9px]
                sm:text-[14px]
                lg:text-[15px]
                leading-[1.55]
                sm:leading-6
                text-[#6B6258]
              "
            >
              {/* Mobile — 4 words per row */}
              <span className="sm:hidden">
                {current.description.split(" ").map((word, index) => (
                  <span key={index}>
                    {word}{" "}
                    {(index + 1) % 4 === 0 && <br />}
                  </span>
                ))}
              </span>

              {/* Tablet / Desktop */}
              <span className="hidden sm:inline">
                {current.description}
              </span>
            </p>

            {/* =================================================
                BUTTONS
            ================================================== */}
            <div
              className="
                mt-4
                sm:mt-7
                flex
                flex-row
                items-center
                gap-2.5
                sm:gap-4
                w-full
                sm:w-auto
              "
            >
              {/* Shop Now */}
              <button
                onClick={handleShopNow}
                className="
                  group
                  flex
                  h-7
                  w-[72px]
                  min-[375px]:w-[76px]
                  min-[425px]:w-[80px]
                  sm:h-12
                  sm:w-auto
                  items-center
                  justify-center
                  gap-1
                  sm:gap-3
                  rounded-full
                  bg-[#B8860B]
                  px-2
                  sm:px-7
                  text-[6.5px]
                  min-[375px]:text-[7px]
                  min-[425px]:text-[7.5px]
                  sm:text-xs
                  font-bold
                  uppercase
                  tracking-[0.03em]
                  sm:tracking-wide
                  text-white
                  transition-all
                  duration-300
                  hover:bg-[#9A7008]
                  hover:-translate-y-0.5
                  hover:shadow-md
                  hover:shadow-[#B8860B]/20
                  active:scale-95
                  whitespace-nowrap
                  cursor-pointer
                "
              >
                <span>Shop Now</span>

                <ArrowRight
                  size={9}
                  className="
                    min-[375px]:w-[10px]
                    min-[375px]:h-[10px]
                    min-[425px]:w-[11px]
                    min-[425px]:h-[11px]
                    sm:w-[14px]
                    sm:h-[14px]
                    shrink-0
                    transition-transform
                    duration-300
                    group-hover:translate-x-0.5
                  "
                />
              </button>

              {/* About */}
              <button
                onClick={handleAboutUs}
                className="
                  group
                  flex
                  h-7
                  w-[72px]
                  min-[375px]:w-[76px]
                  min-[425px]:w-[80px]
                  sm:h-12
                  sm:w-auto
                  items-center
                  justify-center
                  gap-1
                  sm:gap-3
                  rounded-full
                  border
                  border-[#B8860B]/50
                  bg-white/70
                  px-2
                  sm:px-7
                  text-[6.5px]
                  min-[375px]:text-[7px]
                  min-[425px]:text-[7.5px]
                  sm:text-xs
                  font-bold
                  uppercase
                  tracking-[0.02em]
                  sm:tracking-wide
                  text-[#3F3A32]
                  transition-all
                  duration-300
                  hover:bg-[#B8860B]
                  hover:text-white
                  hover:border-[#B8860B]
                  active:scale-95
                  whitespace-nowrap
                  cursor-pointer
                "
              >
                <span>About Us</span>

                <ArrowRight
                  size={9}
                  className="
                    min-[375px]:w-[10px]
                    min-[375px]:h-[10px]
                    min-[425px]:w-[11px]
                    min-[425px]:h-[11px]
                    sm:w-[14px]
                    sm:h-[14px]
                    shrink-0
                    transition-transform
                    duration-300
                    group-hover:translate-x-0.5
                  "
                />
              </button>
            </div>

            {/* =================================================
                TRUST FEATURES
            ================================================== */}
            <div
              className="
                mt-4
                sm:mt-8
                flex
                flex-wrap
                items-center
                justify-center
                gap-x-3
                gap-y-2
                min-[375px]:gap-x-4
                min-[425px]:gap-x-5
                sm:gap-x-6
                text-[6.5px]
                min-[375px]:text-[7px]
                min-[425px]:text-[8px]
                sm:text-[10px]
                lg:text-[11px]
                text-[#6B6258]
              "
            >
              {/* Genuine Products */}
              <span
                className="
                  flex
                  items-center
                  gap-1
                  min-[375px]:gap-1.5
                  whitespace-nowrap
                "
              >
                <span
                  className="
                    flex
                    h-4
                    w-4
                    min-[375px]:h-[17px]
                    min-[375px]:w-[17px]
                    min-[425px]:h-[18px]
                    min-[425px]:w-[18px]
                    sm:h-5
                    sm:w-5
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[#B8860B]/40
                    text-[7px]
                    min-[375px]:text-[8px]
                    sm:text-[10px]
                    text-[#B8860B]
                  "
                >
                  ✓
                </span>

                <span>Genuine Products</span>
              </span>

              {/* Trusted Brands */}
              <span
                className="
                  flex
                  items-center
                  gap-1
                  min-[375px]:gap-1.5
                  whitespace-nowrap
                "
              >
                <span
                  className="
                    flex
                    h-4
                    w-4
                    min-[375px]:h-[17px]
                    min-[375px]:w-[17px]
                    min-[425px]:h-[18px]
                    min-[425px]:w-[18px]
                    sm:h-5
                    sm:w-5
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[#B8860B]/40
                    text-[7px]
                    min-[375px]:text-[8px]
                    sm:text-[10px]
                    text-[#B8860B]
                  "
                >
                  ✓
                </span>

                <span>Trusted Brands</span>
              </span>

              {/* Secure Shopping */}
              <span
                className="
                  flex
                  items-center
                  gap-1
                  min-[375px]:gap-1.5
                  whitespace-nowrap
                "
              >
                <span
                  className="
                    flex
                    h-4
                    w-4
                    min-[375px]:h-[17px]
                    min-[375px]:w-[17px]
                    min-[425px]:h-[18px]
                    min-[425px]:w-[18px]
                    sm:h-5
                    sm:w-5
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[#B8860B]/40
                    text-[7px]
                    min-[375px]:text-[8px]
                    sm:text-[10px]
                    text-[#B8860B]
                  "
                >
                  ✓
                </span>

                <span>Secure Shopping</span>
              </span>
            </div>
          </div>

          {/* =================================================
              RIGHT IMAGE AREA
          ================================================== */}
          <div
            className="
              relative
              z-10
              hidden
              lg:block
              lg:w-[55%]
              xl:w-[57%]
            "
          >
            <div
              className="
                relative
                flex
                items-center
                justify-center
              "
            >
              {/* Gold Glow */}
              <div
                className="
                  absolute
                  inset-0
                  flex
                  items-center
                  justify-center
                "
              >
                <div
                  className="
                    h-[500px]
                    w-[500px]
                    xl:h-[600px]
                    xl:w-[600px]
                    rounded-full
                    bg-[#B8860B]/10
                    blur-[100px]
                  "
                />
              </div>

              {/* Image */}
              <div
                className="
                  relative
                  w-[min(620px,48vw)]
                  h-[min(460px,36vw)]
                  xl:w-[min(720px,50vw)]
                  xl:h-[min(520px,36vw)]
                "
              >
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
          <div
            className="
              absolute
              bottom-0
              right-[-20px]
              min-[375px]:right-[-18px]
              sm:right-[5%]
              h-[190px]
              min-[375px]:h-[200px]
              sm:h-[230px]
              w-[55%]
              min-[375px]:w-[52%]
              sm:w-[45%]
              lg:hidden
              mb-6
              mr-4
            "
          >
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
        <div
          className="
            absolute
            bottom-4
            sm:bottom-5
            left-1/2
            z-30
            -translate-x-1/2
            flex
            items-center
            gap-2
          "
        >
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