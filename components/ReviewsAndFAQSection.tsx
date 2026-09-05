'use client';

import { useState, useEffect } from 'react';
import { Star, Plus, Minus } from 'lucide-react';

interface Review {
  name: string;
  rating: number;
  comment: string;
}

interface FAQ {
  question: string;
  answer: string;
}

export default function ReviewsAndFAQSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [currentReviewIndex, setCurrentReviewIndex] = useState<number>(0);

  const reviews: Review[] = [
    {
      name: "Alex Johnson",
      rating: 5,
      comment: "Excellent service and fast delivery. The printer quality is amazing!",
    },
    {
      name: "Sarah Williams",
      rating: 5,
      comment: "Genuine products and best prices. Highly recommended!",
    },
    {
      name: "Michael Brown",
      rating: 5,
      comment: "Great support team. Helped me choose the perfect printer.",
    },
    {
      name: "Emily Davis",
      rating: 5,
      comment: "Super easy setup process. Ink efficiency is much better than expected.",
    },
    {
      name: "David Miller",
      rating: 4,
      comment: "Very quick shipping and solid packaging. Will definitely buy again.",
    },
    {
      name: "Jessica Taylor",
      rating: 5,
      comment: "Outstanding customer service and authentic toner cartridges!",
    },
  ];

  const faqs: FAQ[] = [
    {
      question: "Which printer is best for home use?",
      answer: "Ink tank printers or compact laser printers are ideal for home use, offering low running costs and reliable performance.",
    },
    {
      question: "Do you sell original ink & toner?",
      answer: "Yes, we provide 100% genuine ink and toner cartridges for all major printer brands.",
    },
    {
      question: "Is warranty available on products?",
      answer: "All printers come with full manufacturer warranty and local service support.",
    },
    {
      question: "How long does delivery take?",
      answer: "Standard delivery typically takes 2-3 business days depending on your location.",
    },
    {
      question: "Do you provide installation support?",
      answer: "Yes, we offer complete guidance and remote or on-site installation support.",
    },
  ];

  // Auto-slide effect for reviews (slides every 4 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentReviewIndex((prevIndex) => (prevIndex + 1) % reviews.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [reviews.length]);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // Helper to get 6 visible reviews (3 for the top row, 3 for the bottom row)
  const getVisibleReviews = () => {
    const visible = [];
    for (let i = 0; i < 6; i++) {
      const index = (currentReviewIndex + i) % reviews.length;
      visible.push(reviews[index]);
    }
    return visible;
  };

  return (
    <section className="w-full bg-white py-8 xs:py-10 sm:py-12 md:py-14 lg:py-16 px-3 xs:px-4 sm:px-6 lg:px-8 flex justify-center items-center">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-3 xs:gap-4 sm:gap-5 md:gap-6 lg:gap-8">
        
        {/* Left Side: Customer Reviews with Auto-Slider */}
        <div className="lg:col-span-7 bg-white border border-gray-200 rounded-xl xs:rounded-2xl p-3 xs:p-4 sm:p-5 md:p-6 lg:p-8 flex flex-col justify-between shadow-sm">
          <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-3 xs:mb-4 sm:mb-5 md:mb-6">
              <span className="text-orange-500 font-semibold tracking-widest text-[8px] xs:text-[9px] sm:text-[10px] md:text-xs uppercase">
                CUSTOMER <span className="text-gray-900">REVIEWS</span>
              </span>
            </div>
      
            {/* Reviews Grid - 3 columns on ALL screens */}
            <div className="grid grid-cols-3 gap-1.5 xs:gap-2 sm:gap-2.5 md:gap-3 lg:gap-4 transition-all duration-500 ease-in-out">
              {getVisibleReviews().map((review, index) => (
                <div 
                  key={`${currentReviewIndex}-${index}`} 
                  className="bg-gray-50 border border-gray-200 rounded-lg xs:rounded-xl p-1.5 xs:p-2 sm:p-2.5 md:p-3 lg:p-4 flex flex-col justify-between transition-opacity duration-300"
                >
                  <div>
                    <div className="flex space-x-0.5 mb-0.5 xs:mb-1 sm:mb-1.5 md:mb-2">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-1.5 h-1.5 xs:w-2 xs:h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 lg:w-3.5 lg:h-3.5 fill-orange-500 text-orange-500" />
                      ))}
                    </div>
                    <p className="text-gray-700 text-[6px] xs:text-[7px] sm:text-[8px] md:text-[9px] lg:text-xs leading-relaxed line-clamp-3">
                      "{review.comment}"
                    </p>
                  </div>
                  <div className="mt-1 xs:mt-1.5 sm:mt-2 md:mt-2.5 lg:mt-3 text-[6px] xs:text-[7px] sm:text-[8px] md:text-[9px] lg:text-[11px] font-semibold text-gray-500">
                    {review.name}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Slider Dots Indicator */}
            <div className="flex justify-center items-center space-x-1 xs:space-x-1.5 mt-3 xs:mt-3.5 sm:mt-4">
              {reviews.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentReviewIndex(idx)}
                  className={`h-1 xs:h-1.5 rounded-full transition-all duration-300 ${
                    currentReviewIndex === idx ? 'w-3 xs:w-3.5 sm:w-4 bg-orange-500' : 'w-1 xs:w-1.5 bg-gray-300'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Frequently Asked Questions */}
        <div className="lg:col-span-5 bg-white border border-gray-200 rounded-xl xs:rounded-2xl p-3 xs:p-4 sm:p-5 md:p-6 lg:p-8 flex flex-col justify-between shadow-sm">
          <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-3 xs:mb-4 sm:mb-5 md:mb-6">
              <span className="text-orange-500 font-semibold tracking-widest text-[8px] xs:text-[9px] sm:text-[10px] md:text-xs uppercase">
                FREQUENTLY <span className="text-gray-900">ASKED</span>
              </span>
            </div>

            {/* FAQ List */}
            <div className="flex flex-col space-y-2 xs:space-y-2.5">
              {faqs.map((faq, index) => (
                <div 
                  key={index}
                  className="bg-gray-50 border border-gray-200 rounded-lg xs:rounded-xl overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-2.5 xs:px-3 sm:px-3.5 md:px-4 py-2 xs:py-2.5 sm:py-3 text-left flex justify-between items-center text-gray-900 text-[9px] xs:text-[10px] sm:text-[11px] md:text-xs lg:text-sm font-medium hover:text-orange-500 transition-colors"
                  >
                    <span className="line-clamp-2 xs:line-clamp-2 sm:line-clamp-none">{faq.question}</span>
                    <div className={`w-4 h-4 xs:w-4.5 xs:h-4.5 sm:w-5 sm:h-5 md:w-5.5 md:h-5.5 lg:w-6 lg:h-6 rounded-lg flex items-center justify-center flex-shrink-0 ml-1.5 xs:ml-2 transition-all duration-200 ${
                      openFaq === index 
                        ? 'bg-orange-500 text-white border-orange-500' 
                        : 'bg-gray-200 text-orange-500 border-gray-300'
                    } border`}>
                      {openFaq === index ? (
                        <Minus className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-3.5 sm:h-3.5" />
                      ) : (
                        <Plus className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-3.5 sm:h-3.5" />
                      )}
                    </div>
                  </button>
                  <div 
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      openFaq === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="px-2.5 xs:px-3 sm:px-3.5 md:px-4 pb-2.5 xs:pb-3 text-gray-600 text-[8px] xs:text-[9px] sm:text-[10px] md:text-xs leading-relaxed border-t border-gray-200 pt-1.5 xs:pt-2">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}