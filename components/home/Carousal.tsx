'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Category } from '@/types/category';
import {
  Laptop,
  Monitor,
  Printer,
  Smartphone,
  Wifi,
  Cpu,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface CategoryCarouselProps {
  displayCategories?: Category[];
}

export default function CategoryCarousel({
  displayCategories = [],
}: CategoryCarouselProps) {
  const router = useRouter();

  const [position, setPosition] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  const speed = 0.11;

  const imageBaseUrl =
    typeof window !== 'undefined'
      ? process.env.NEXT_PUBLIC_IMG_URL || 'http://localhost:5002'
      : '';

  useEffect(() => {
    setMounted(true);

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);

        if (displayCategories.length > 0) {
          setCategories(displayCategories);
        } else {
          const { fetchActiveCategories } = await import(
            '@/lib/categoryService'
          );

          const data = await fetchActiveCategories();
          setCategories(data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [displayCategories]);

  // ✅ UPDATED: Get image URL - supports both local and R2 URLs
  const getImageUrl = (imagePath?: string) => {
    if (!imagePath || !mounted) return null;

    // ✅ If it's already a full URL (R2)
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }

    // ✅ If it's a local path
    if (imagePath.startsWith('/uploads/')) {
      return `${imageBaseUrl}${imagePath}`;
    }

    // ✅ Fallback - clean the path
    const cleanPath = imagePath.replace(/^\/+/, '');
    return `${imageBaseUrl}/${cleanPath}`;
  };

  const getDuplicatedArray = () => {
    if (!categories.length) return [];

    // Mobile: duplicate more for smooth scrolling
    const duplicateCount = isMobile 
      ? (categories.length <= 3 ? 8 : 5)
      : (categories.length <= 3 ? 6 : 3);

    return Array(duplicateCount).fill(categories).flat();
  };

  const carouselCategories = getDuplicatedArray();

  const animate = useCallback(
    (time: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = time;
      }

      const delta = time - lastTimeRef.current;
      lastTimeRef.current = time;

      setPosition((prev) => {
        if (!containerRef.current) return prev;

        const containerWidth = containerRef.current.scrollWidth;

        const singleSetWidth =
          containerWidth /
          (carouselCategories.length / categories.length);

        // Mobile: smoother reset with reduced speed
        const speedMultiplier = isMobile ? 0.8 : 1;
        const newPosition = prev - (speed * delta * speedMultiplier);

        if (newPosition <= -singleSetWidth) {
          return 0;
        }

        return newPosition;
      });

      animationRef.current = requestAnimationFrame(animate);
    },
    [categories.length, carouselCategories.length, isMobile]
  );

  useEffect(() => {
    if (!loading && categories.length > 0 && mounted) {
      lastTimeRef.current = 0;
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate, loading, categories.length, mounted]);

  const handleCategoryClick = (category: Category) => {
    router.push(
      `/products?category=${category.slug || category._id}`
    );
  };

  const getCategoryIcon = (name = '') => {
    const value = name.toLowerCase();

    if (
      value.includes('laptop') ||
      value.includes('notebook')
    ) {
      return Laptop;
    }

    if (
      value.includes('desktop') ||
      value.includes('computer') ||
      value.includes('monitor')
    ) {
      return Monitor;
    }

    if (
      value.includes('printer') ||
      value.includes('printing')
    ) {
      return Printer;
    }

    if (
      value.includes('mobile') ||
      value.includes('phone') ||
      value.includes('accessor')
    ) {
      return Smartphone;
    }

    if (
      value.includes('network') ||
      value.includes('router') ||
      value.includes('wifi')
    ) {
      return Wifi;
    }

    if (
      value.includes('component') ||
      value.includes('hardware') ||
      value.includes('gpu') ||
      value.includes('processor')
    ) {
      return Cpu;
    }

    return Cpu;
  };

  if (loading || !mounted) {
    return (
      <section className="w-full py-8 sm:py-12 sm:py-14 lg:py-16">
        <div className="mx-auto max-w-[1440px] px-3 sm:px-4 sm:px-6 lg:px-10">
          <div className="mb-6 sm:mb-10 text-center">
            <div className="mx-auto h-2 w-20 sm:h-3 sm:w-32 animate-pulse rounded-full bg-[#D4AF37]/20" />
            <div className="mx-auto mt-3 sm:mt-4 h-6 sm:h-8 w-48 sm:w-64 animate-pulse rounded bg-[#D4AF37]/10" />
            <div className="mx-auto mt-2 sm:mt-3 h-2 w-60 sm:h-3 sm:w-80 max-w-full animate-pulse rounded bg-[#D4AF37]/5" />
          </div>
          <div className="flex gap-3 sm:gap-5 overflow-hidden">
            {[...Array(isMobile ? 4 : 6)].map((_, i) => (
              <div
                key={i}
                className="h-[180px] sm:h-[240px] min-w-[120px] sm:min-w-[150px] animate-pulse rounded-xl bg-[#FBF7F1]"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!categories.length) return null;

  return (
    <section className="relative w-full overflow-hidden py-8 sm:py-12 sm:py-14 lg:py-16 bg-white">
      <div className="mx-auto max-w-[1440px] px-3 sm:px-4 sm:px-6 lg:px-10">

        {/* SECTION HEADER */}
        <div className="mb-6 sm:mb-9 text-center sm:mb-11">
          <div className="mb-2 sm:mb-3 flex items-center justify-center gap-2 sm:gap-3">
            <span className="text-[15px] sm:text-[19px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em]">
              <span className="text-[#0F172A]">Shop By </span>
              <span className="text-[#D4AF37]">Category</span>
            </span>
          </div>
        </div>

        {/* CAROUSEL WRAPPER */}
        <div className="relative">
          {/* Side fade - Reduced on mobile */}
          <div className="pointer-events-none absolute left-0 top-0 z-20 h-full w-6 sm:w-10 sm:w-16 bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 z-20 h-full w-6 sm:w-10 sm:w-16 bg-gradient-to-l from-white to-transparent" />

          {/* MOVING TRACK */}
          <div className="overflow-hidden">
            <div
              ref={containerRef}
              className="flex items-stretch gap-2 sm:gap-4 py-2 sm:py-3"
              style={{
                transform: `translateX(${position}px)`,
                willChange: 'transform',
              }}
            >
              {carouselCategories.map((category, index) => {
                const imageUrl = mounted
                  ? getImageUrl(category.image)
                  : null;

                const Icon = getCategoryIcon(category.name);

                // Mobile responsive widths
                const cardWidth = isMobile ? 'w-[120px]' : 'w-[150px] sm:w-[170px] md:w-[180px]';
                const cardHeight = isMobile ? 'h-[180px]' : 'h-[240px]';
                const imageHeight = isMobile ? 'h-[90px]' : 'h-[140px]';
                const iconSize = isMobile ? 28 : 40;
                const iconWrapperSize = isMobile ? 'h-8 w-8' : 'h-10 w-10';
                const titleSize = isMobile ? 'text-xs' : 'text-sm sm:text-sm';
                const imageContainerHeight = isMobile ? 'h-[100px]' : 'h-[140px]';

                return (
                  <div
                    key={`${category._id}-${index}`}
                    className={`${cardWidth} flex-shrink-0 cursor-pointer group`}
                    onClick={() =>
                      handleCategoryClick(category)
                    }
                  >
                    {/* CARD - Light background */}
                    <div className={`relative ${cardHeight} overflow-hidden rounded-xl border border-[#D4AF37]/20 bg-[#FBF7F1] transition-all duration-500 group-hover:-translate-y-1 group-hover:border-[#D4AF37]/70 group-hover:shadow-[0_12px_30px_rgba(212,175,55,0.15)]`}>

                      {/* Subtle gold glow - Reduced on mobile */}
                      <div className={`pointer-events-none absolute left-1/2 top-[-30px] -translate-x-1/2 rounded-full bg-[#D4AF37]/10 blur-3xl ${isMobile ? 'h-20 w-20' : 'h-32 w-32'}`} />

                      {/* Product image area */}
                      <div className={`relative flex ${imageContainerHeight} items-center justify-center px-2 sm:px-3 pt-2 sm:pt-4`}>

                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={category.name}
                            className={`relative z-10 ${imageHeight} w-full object-contain transition-all duration-500 group-hover:scale-110 group-hover:brightness-110`}
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';

                              const fallback =
                                e.currentTarget.parentElement?.querySelector(
                                  '.fallback-category'
                                );

                              if (fallback) {
                                fallback.classList.remove('hidden');
                              }
                            }}
                          />
                        ) : null}

                        {/* Fallback */}
                        <div
                          className={`fallback-category ${
                            imageUrl ? 'hidden' : ''
                          } relative z-10 flex ${isMobile ? 'h-16 w-16' : 'h-24 w-24'} items-center justify-center rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10`}
                        >
                          <Icon
                            size={isMobile ? 28 : 40}
                            strokeWidth={1.2}
                            className="text-[#D4AF37]"
                          />
                        </div>
                      </div>

                      {/* Icon */}
                      <div className="relative z-10 flex justify-center mt-2 sm:mt-4">
                        <div className={`flex ${iconWrapperSize} items-center justify-center rounded-full border border-[#D4AF37]/60 bg-[#D4AF37]/10 text-[#D4AF37] transition-all duration-300 group-hover:gold-gradient group-hover:text-white group-hover:border-[#D4AF37] group-hover:shadow-[0_0_18px_rgba(212,175,55,0.35)]`}>
                          <Icon size={isMobile ? 14 : 18} strokeWidth={1.7} />
                        </div>
                      </div>

                      {/* Category Name & Product Count */}
                      <div className="relative z-10 mt-1 sm:mt-2 text-center">

                        <h3 className={`truncate px-1 sm:px-2 ${titleSize} font-bold text-[#0F172A] transition-colors duration-300 group-hover:text-[#D4AF37]`}>
                          {category.name}
                        </h3>

                        {category.status === 'inactive' && (
                          <span className={`mt-0.5 sm:mt-1 block ${isMobile ? 'text-[8px]' : 'text-[10px]'} font-medium text-[#D4AF37]`}>
                            Coming Soon
                          </span>
                        )}
                      </div>

                      {/* Bottom gold line */}
                      <div className="absolute bottom-0 left-1/2 h-[2px] w-0 -translate-x-1/2 bg-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.5)] transition-all duration-500 group-hover:w-[60%]" />
                    </div>
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