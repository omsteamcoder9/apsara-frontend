"use client";

import React, { useState } from "react";

export default function TestimonialSection() {
  const [current, setCurrent] = useState(0);

  const reviews = [
    {
      id: 1,
      name: "Lakshmi Narayanan",
      role: "Ethnic Wear Enthusiast",
      location: "Chennai, TN",
      review:
        "The Aariwork blouses are absolutely stunning! The intricate embroidery and perfect fit made my wedding outfit truly special. Every piece feels like a work of art.",
      product: "Aariwork Blouse",
      avatar: "LN",
    },
    {
      id: 2,
      name: "Dr. Ananthakrishnan",
      role: "Fashion Curator",
      location: "Bengaluru, KA",
      review:
        "I recommend these collections to everyone looking for authentic ethnic wear. The terracotta jewelry sets are particularly beautiful with their rich festive shades and eco-friendly craftsmanship.",
      product: "Terracotta Jewels",
      avatar: "DA",
    },
    {
      id: 3,
      name: "Priya Sundaram",
      role: "Regular Customer",
      location: "Coimbatore, TN",
      review:
        "Shopping for my bridal set was a wonderful experience. The quality of the Aariwork, the elegance of the terracotta jewelry, and the overall craftsmanship exceeded my expectations.",
      product: "Bridal Sets",
      avatar: "PS",
    },
  ];

  return (
    <section className="py-24 sm:py-12 bg-transparent relative overflow-hidden" aria-label="Customer Testimonials">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Header Heading */}
    <div className="text-center max-w-xl mx-auto mb-8 sm:mb-12 md:mb-16 space-y-2 sm:space-y-3">
  <span className="text-[#D4AF37] text-[10px] sm:text-xs font-mono tracking-[0.2em] sm:tracking-[0.3em] uppercase block">
    Client Stories
  </span>
  <h2 className="text-xl sm:text-2xl font-semibold tracking-wide text-stone-900 uppercase">
    Trusted by Connoisseurs
  </h2>
  <div className="w-12 h-0.5 bg-[#D4AF37] mx-auto mt-2" />
</div>

        {/* Clean, High-End Card Showcase Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {reviews.map((rev, index) => {
            const isActive = current === index;
            return (
              <div
                key={rev.id}
                onClick={() => setCurrent(index)}
                className={`group relative rounded-3xl p-8 sm:p-10 transition-all duration-500 cursor-pointer flex flex-col justify-between border bg-white ${
                  isActive 
                    ? 'border-[#D4AF37] shadow-2xl shadow-stone-900/10 ring-2 ring-[#D4AF37]/20 -translate-y-2' 
                    : 'border-stone-200/90 hover:border-stone-300 shadow-sm hover:shadow-md'
                }`}
              >
                {/* Top Badge & Rating */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono tracking-wider uppercase text-[#D4AF37] bg-stone-50 px-3.5 py-1 rounded-full border border-stone-200/60">
                      {rev.product}
                    </span>
                    <div className="flex text-[#D4AF37] text-xs tracking-widest">
                      ★★★★★
                    </div>
                  </div>

                  {/* Review Text */}
                  <p className="text-stone-700 text-base sm:text-lg font-serif leading-relaxed">
                    "{rev.review}"
                  </p>
                </div>

                {/* Author Information Footer */}
                <div className="mt-8 pt-6 border-t border-stone-100 flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl font-bold text-sm flex items-center justify-center shadow-sm shrink-0 transition-all duration-300 ${
                    isActive ? 'bg-[#D4AF37] text-stone-950 scale-105' : 'bg-stone-100 text-stone-700'
                  }`}>
                    {rev.avatar}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-stone-900">
                      {rev.name}
                    </h3>
                    <p className="text-xs text-stone-500">
                      {rev.role} &bull; <span className="text-[#D4AF37] font-medium">{rev.location}</span>
                    </p>
                  </div>
                </div>

                {/* Active Indicator Top Border Ribbon */}
                {isActive && (
                  <div className="absolute top-0 left-8 right-8 h-1 bg-[#D4AF37] rounded-full" />
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}