'use client';

import React, { useState, useEffect } from 'react';
import { Star, Quote } from 'lucide-react';

interface TestimonialItem {
  id: string | number;
  name: string;
  avatar: string;
  rating: number;
  review: string;
}

interface TestimonialsSectionProps {
  subtitle?: string;
  titleMain?: string;
  titleHighlight?: string;
  testimonials?: TestimonialItem[];
}

export default function TestimonialsSection({
  subtitle = 'TESTIMONIALS',
  titleMain = 'What Our',
  titleHighlight = 'Customers Say',
  testimonials = [
    {
      id: 1,
      name: 'Priya S.',
      avatar: '',
      rating: 5,
      review: 'Amazing quality products! My hair feels healthier and shinier. Highly recommend Apsara!',
    },
    {
      id: 2,
      name: 'Meera K.',
      avatar: '',
      rating: 5,
      review: 'Fast delivery and genuine products. Skincare range is just perfect!',
    },
    {
      id: 3,
      name: 'Sneha R.',
      avatar: '',
      rating: 5,
      review: 'Apsara has become my go-to store for all beauty essentials. Love the variety and service!',
    },
    {
      id: 4,
      name: 'Ananya P.',
      avatar: '',
      rating: 5,
      review: 'The hair care products are a game changer! My hair has never looked this healthy.',
    },
    {
      id: 5,
      name: 'Riya M.',
      avatar: '',
      rating: 5,
      review: 'I love the natural ingredients. My skin feels so fresh and glowing!',
    },
    {
      id: 6,
      name: 'Kavya S.',
      avatar: '',
      rating: 5,
      review: 'Apsara is my favorite beauty destination. The quality and service are unmatched.',
    },
  ],
}: TestimonialsSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const itemsPerPage = 3;
  const totalPages = Math.ceil(testimonials.length / itemsPerPage);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  // Auto-play
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  // Get current visible testimonials
  const getVisibleTestimonials = () => {
    const start = currentIndex * itemsPerPage;
    return testimonials.slice(start, start + itemsPerPage);
  };

  const visibleTestimonials = getVisibleTestimonials();

  return (
    <section className="relative w-full overflow-hidden bg-white py-10 sm:py-14">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        
        {/* SECTION HEADER */}
        <div className="mb-8 sm:mb-10 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-6 h-[1px] bg-[#D4AF37]" />
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#D4AF37]">
              {subtitle}
            </span>
            <div className="w-6 h-[1px] bg-[#D4AF37]" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-normal text-[#0F172A] tracking-tight">
            {titleMain}{' '}
            <span className="font-serif italic text-[#B8860B] font-medium">{titleHighlight}</span>
          </h2>
          <p className="text-[10px] sm:text-xs text-[#64748B] mt-1.5">
            Real stories from our valued customers.
          </p>
        </div>

        {/* TESTIMONIALS CAROUSEL - Auto sliding only */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 transition-all duration-500">
            {visibleTestimonials.map((item) => (
              <div
                key={item.id}
                className="relative rounded-xl border border-[#D4AF37]/20 bg-[#FBF7F1] p-4 sm:p-6 shadow-[0_10px_30px_rgba(212,175,55,0.06)] transition-all duration-300 hover:border-[#D4AF37]/60 hover:shadow-[0_15px_35px_rgba(212,175,55,0.12)] flex flex-col justify-between group"
              >
                {/* Background Quote Icon Accent */}
                <div className="absolute top-4 right-4 text-[#D4AF37]/10 group-hover:text-[#D4AF37]/20 transition-colors">
                  <Quote size={28} />
                </div>

                <div>
                  {/* Customer Profile Row */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-[#D4AF37]/30 overflow-hidden bg-white flex-shrink-0">
                      {item.avatar ? (
                        <img
                          src={item.avatar}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs font-bold text-[#D4AF37]">
                          {item.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-[#0F172A]">
                        {item.name}
                      </h3>
                      {/* Star Rating */}
                      <div className="flex items-center gap-0.5 mt-0.5">
                        {[...Array(item.rating)].map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            className="fill-[#D4AF37] text-[#D4AF37]"
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Review Text */}
                  <p className="text-[10px] sm:text-xs text-[#64748B] leading-relaxed italic">
                    "{item.review}"
                  </p>
                </div>

                {/* Bottom decorative gold accent line */}
                <div className="absolute bottom-0 left-1/2 h-[1.5px] w-0 -translate-x-1/2 bg-[#D4AF37] transition-all duration-500 group-hover:w-[60%]" />
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}