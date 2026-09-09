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

  const getImageUrl = (imagePath?: string) => {
    if (!imagePath || !mounted) return null;

    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }

    if (imagePath.startsWith('/uploads/')) {
      return `${imageBaseUrl}${imagePath}`;
    }

    const cleanPath = imagePath.replace(/^\/+/, '');
    return `${imageBaseUrl}/${cleanPath}`;
  };

  const getDuplicatedArray = () => {
    if (!categories.length) return [];

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

    if (value.includes('laptop') || value.includes('notebook')) {
      return Laptop;
    }

    if (value.includes('desktop') || value.includes('computer') || value.includes('monitor')) {
      return Monitor;
    }

    if (value.includes('printer') || value.includes('printing')) {
      return Printer;
    }

    if (value.includes('mobile') || value.includes('phone') || value.includes('accessor')) {
      return Smartphone;
    }

    if (value.includes('network') || value.includes('router') || value.includes('wifi')) {
      return Wifi;
    }

    return Cpu;
  };

  if (loading || !mounted) {
    return (
      <section className="w-full py-8 sm:py-12 lg:py-16">
        <div className="mx-auto max-w-[1440px] px-3 sm:px-4 sm:px-6 lg:px-10">
          <div className="mb-6 sm:mb-10 text-center">
            <div className="mx-auto h-2 w-20 sm:h-3 sm:w-32 animate-pulse rounded-full bg-[#D4AF37]/20" />
            <div className="mx-auto mt-3 sm:mt-4 h-6 sm:h-8 w-48 sm:w-64 animate-pulse rounded bg-[#D4AF37]/10" />
          </div>
          <div className="flex gap-4 sm:gap-6 overflow-hidden justify-center">
            {[...Array(isMobile ? 3 : 6)].map((_, i) => (
              <div
                key={i}
                className="h-[130px] w-[130px] sm:h-[160px] sm:w-[160px] md:h-[180px] md:w-[180px] animate-pulse rounded-full bg-[#FBF7F1]"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!categories.length) return null;

  return (
    <section className="relative w-full overflow-hidden py-8 sm:py-12 lg:py-16 bg-white">
      <div className="mx-auto max-w-[1440px] px-3 sm:px-4 sm:px-6 lg:px-10">

        {/* SECTION HEADER */}
        <div className="mb-6 sm:mb-9 text-center">
          <div className="mb-2 sm:mb-3 flex items-center justify-center gap-2 sm:gap-3">
            <span className="text-[15px] sm:text-[19px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em]">
              <span className="text-[#0F172A]">Shop By </span>
              <span className="text-[#D4AF37]">Category</span>
            </span>
          </div>
        </div>

        {/* CAROUSEL WRAPPER */}
        <div className="relative">
          {/* Side fade */}
          <div className="pointer-events-none absolute left-0 top-0 z-20 h-full w-6 sm:w-10 lg:w-16 bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 z-20 h-full w-6 sm:w-10 lg:w-16 bg-gradient-to-l from-white to-transparent" />

          {/* MOVING TRACK */}
          <div className="overflow-hidden py-4">
            <div
              ref={containerRef}
              className="flex items-center gap-4 sm:gap-6 lg:gap-8"
              style={{
                transform: `translateX(${position}px)`,
                willChange: 'transform',
              }}
            >
              {carouselCategories.map((category, index) => {
                const imageUrl = mounted ? getImageUrl(category.image) : null;
                const Icon = getCategoryIcon(category.name);

                // Responsive circle dimensions
                const circleSize = isMobile 
                  ? 'w-[120px] h-[120px]' 
                  : 'w-[150px] h-[150px] sm:w-[170px] sm:h-[170px] md:w-[190px] md:h-[190px]';

                return (
                  <div
                    key={`${category._id}-${index}`}
                    className="flex-shrink-0 cursor-pointer group flex flex-col items-center"
                    onClick={() => handleCategoryClick(category)}
                  >
                    {/* CIRCLE CONTAINER */}
                    <div className={`relative ${circleSize} rounded-full border border-[#D4AF37]/50 bg-[#FBF7F1] overflow-hidden flex items-center justify-center transition-all duration-500 group-hover:-translate-y-1.5 group-hover:border-[#D4AF37] group-hover:shadow-[0_12px_30px_rgba(212,175,55,0.2)]`}>

                      {/* Subtle gold background glow */}
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#D4AF37]/5 to-transparent opacity-60" />

                      {/* Image / Fallback Area */}
                      <div className="relative z-10 w-full h-full flex items-center justify-center p-3 sm:p-4">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={category.name}
                            className="max-h-full max-w-full object-contain transition-all duration-500 group-hover:scale-110 group-hover:brightness-105"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const fallback = e.currentTarget.parentElement?.querySelector('.fallback-category');
                              if (fallback) {
                                fallback.classList.remove('hidden');
                              }
                            }}
                          />
                        ) : null}

                        {/* Fallback Icon */}
                        <div
                          className={`fallback-category ${
                            imageUrl ? 'hidden' : ''
                          } flex items-center justify-center rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 w-12 h-12 sm:w-16 sm:h-16 text-[#D4AF37]`}
                        >
                          <Icon size={isMobile ? 24 : 32} strokeWidth={1.5} />
                        </div>
                      </div>

                      {/* Hover ring highlight */}
                    </div>

                    {/* Category Name & Status */}
                    <div className="mt-2.5 sm:mt-3 text-center max-w-[130px] sm:max-w-[160px]">
                      <h3 className="text-xs sm:text-sm font-semibold text-[#0F172A] truncate transition-colors duration-300 group-hover:text-[#D4AF37]">
                        {category.name}
                      </h3>

                      {category.status === 'inactive' && (
                        <span className="mt-0.5 block text-[10px] font-medium text-[#D4AF37]">
                          Coming Soon
                        </span>
                      )}
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