// components/home/HomeClient.tsx
'use client';

import { Truck, Shield, Minus, Plus, Clock, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRef, useState, useEffect } from 'react';
import { Category } from '@/types/category';
import ProductGrid from '@/components/products/ProductGrid';
import Image from "next/image";
import { settingsAPI } from '@/lib/settings-api';
import { getAllProducts } from '@/lib/productService';
import Link from 'next/link';
import Carousel from '@/components/home/Carousal';
import AdSection from '@/components/AdSection';
import HeroSection from '@/components/herosection';
import TestimonialSection from '@/components/TestimonialSection';
import BuyingGuideSection from '@/components/BuyingGuideSection';
import SolutionsContactSection from '@/components/SolutionsContactSection';
import ReviewsAndFAQSection from '@/components/ReviewsAndFAQSection';
import FeaturesBarSection from '@/components/FeaturesBarSection';
import CallUsBannerSection from '@/components/CallUsBannerSection';

interface HomeClientProps {
  categories: Category[];
}

const heroSlides = [
  {
    id: 1,
    topBadge: "TRADITIONAL ELEGANCE. MODERN GRACE.",
    mainTitle: "Aariwork-Blouses, Kurthis, Chudhidhars, Salwars, Shirts, Pavadai Sets, Sarees & More",
    tagline: "",
    description: "Discover our exquisite collection of Aariwork blouses, terracotta jewellery, silk thread bangles, sarees, and complete bridal sets. Each piece is handcrafted with love to celebrate your unique style.",
    features: [
      { title: "AARIWORK & EMBROIDERY", sub: "Blouses, Kurthis, Salwars" },
      { title: "TERRA COTTA JEWELLERY", sub: "Handcrafted Elegance" },
      { title: "BRIDAL COLLECTIONS", sub: "Complete Wedding Sets" },
      { title: "ETHNIC WEAR", sub: "Sarees, Shirts, Pavadai Sets" }
    ],
    ctaText: "SHOP NOW",
    bgImage: "/images/hero1.png",
    imageSize: { width: 1920, height: 1080 },
    objectPosition: "center center",
    objectFit: "contain",
  },
  {
    id: 2,
    topBadge: "HANDCRAFTED FOR YOUR SPECIAL MOMENTS.",
    mainTitle: "Terracotta Jewellery, Silk Thread Bangles, Rain Drop Bangles, Brooches, Hair Accessories, Safety Pins & Complete Bridal Sets",
    tagline: "TRADITIONAL. ELEGANT. TIMELESS.",
    description: "From exquisite Aariwork blouses to elegant terracotta jewellery, from beautiful sarees to complete bridal sets - we offer premium quality products that make every occasion special.",
    features: [
      { title: "TERRA COTTA", sub: "Handcrafted Jewellery" },
      { title: "SILK THREAD BANGLES", sub: "Rain Drop Bangles" },
      { title: "BRIDAL SETS", sub: "Complete Wedding Collection" },
      { title: "ACCESSORIES", sub: "Brooches, Hair Accessories" }
    ],
    ctaText: "SHOP NOW",
    bgImage: "/images/hero.png",
    imageSize: { width: 1920, height: 1060 },
    objectPosition: "center top",
    objectFit: "contain",
  },
];

export default function HomeClient({ categories }: HomeClientProps) {
  const router = useRouter();
  const heroRef = useRef(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [contactNumber, setContactNumber] = useState('7200074221');
  
  const [categoriesWithProducts, setCategoriesWithProducts] = useState<string[]>([]);
  const [categoryProductCounts, setCategoryProductCounts] = useState<Record<string, number>>({});
  const [checkingProducts, setCheckingProducts] = useState(true);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const contactInfo = await settingsAPI.getContactInfo();
        setContactNumber(contactInfo.whatsappNumber || contactInfo.contactNumber || '7200074221');
      } catch (error) {
        console.error('Error fetching contact info:', error);
        setContactNumber('7200074221');
      }
    };

    fetchContactInfo();
  }, []);

  useEffect(() => {
    const checkCategoriesForProducts = async () => {
      try {
        setCheckingProducts(true);
        const categoriesWithProductsList: string[] = [];
        const counts: Record<string, number> = {};
        
        for (const category of categories) {
          const response = await getAllProducts({ category: category._id });
          if (response.data && response.data.length > 0) {
            categoriesWithProductsList.push(category._id);
            // Store the total count of products in this category
            counts[category._id] = response.data.length;
          }
        }
        
        setCategoriesWithProducts(categoriesWithProductsList);
        setCategoryProductCounts(counts);
      } catch (error) {
        console.error('Error checking categories for products:', error);
      } finally {
        setCheckingProducts(false);
      }
    };

    if (categories.length > 0) {
      checkCategoriesForProducts();
    }
  }, [categories]);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => clearInterval(interval);
  }, [currentSlide]);

  const navigateToProducts = () => {
    router.push('/products');
  };

  const nextSlide = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentSlide) return;
    
    setIsTransitioning(true);
    setCurrentSlide(index);
    
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const faqItems = [
    {
      question: "What is Aariwork embroidery?",
      answer: "Aariwork is a traditional hand-embroidery technique using a hooked needle, creating intricate and beautiful patterns on fabrics. Our Aariwork blouses, Kurthis, Chudhidhars, Salwars, Shirts, Pavadai sets, and ethnic wear are crafted with precision and love by skilled artisans."
    },
    {
      question: "How should I care for my terracotta jewellery?",
      answer: "Keep terracotta jewellery in a dry place, avoid contact with water and perfumes. Clean with a soft dry cloth. Store in a cool, dry place away from direct sunlight to maintain its earthy beauty."
    },
    {
      question: "Do you offer saree prepleating and draping services?",
      answer: "Yes, we offer professional saree prepleating and draping services to help you look your best for any occasion. Our experts ensure perfect pleats and elegant draping."
    },
    {
      question: "What is included in a complete bridal set?",
      answer: "Our complete bridal sets include carefully curated pieces like necklaces, earrings, bangles, maang tikka, and other accessories that complement each other perfectly. Each set is designed to make you look stunning on your special day."
    },
    {
      question: "How do I maintain silk thread bangles and rain drop bangles?",
      answer: "Keep silk thread bangles and rain drop bangles away from moisture and perfume. Store them in a soft pouch to prevent tangling. Avoid exposure to direct sunlight for extended periods."
    },
    {
      question: "What all do you offer in accessories?",
      answer: "We offer a wide range of accessories including Brooches, Hair Accessories, Safety Pins, and more. Each piece is designed to complement your ethnic wear and enhance your overall look."
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const visibleCategories = categories.filter(
    category => categoriesWithProducts.includes(category._id)
  );

  const primaryColor = '#D4AF37';

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <HeroSection />

      {/* Explore Products Section - Shows ALL categories that have products */}
      {!checkingProducts && visibleCategories.length > 0 && (
        <section className="py-6 xs:py-8 sm:py-12 bg-white" aria-label="Explore Our Ethnic Collections">
          <div className="container mx-auto px-1">
            <div className="text-center mb-4 xs:mb-6 sm:mb-8">
              <span className="text-[8px] xs:text-[9px] sm:text-[10px] font-bold tracking-[0.18em] text-[#B8860B] uppercase">
                Featured Products
              </span>

              <h2 className="mt-1 text-xl xs:text-2xl sm:text-3xl font-extrabold tracking-tight uppercase">
                <span className="text-[#0F172A]">Explore Top </span>
                <span className="text-[#D4AF37]">Products</span>
              </h2>

              <p className="text-[9px] xs:text-[10px] sm:text-xs text-[#64748B] max-w-2xl mx-auto px-2 mt-1.5">
                Quality, unmatched performance. This is for your needs.
              </p>
            </div>

            <div className="space-y-8 xs:space-y-10 sm:space-y-12">
              {visibleCategories.map((category, index) => {
                const productCount = categoryProductCounts[category._id] || 0;
                
                return (
                  <div 
                    key={category._id} 
                    className="animate-fade-in-up" 
                    style={{ 
                      animationDelay: `${index * 300}ms`,
                      animationFillMode: 'both'
                    }}
                  >
                    <div className="mb-4 xs:mb-5 sm:mb-6 px-2 xs:px-3 sm:px-4">
                      <div className="flex items-center justify-between gap-2 xs:gap-3 mb-3 xs:mb-4">
                        <div className="flex-1"></div> {/* Spacer */}
                        <h3 className="text-base xs:text-lg sm:text-2xl md:text-3xl font-bold text-[#0F172A] group-hover:text-[#D4AF37] transition-colors duration-300 text-center truncate">
                          {category.name}
                        </h3>
                        <div className="flex-1 flex justify-end">
                          {/* Show View Products button only if category has more than 4 products */}
                          {productCount > 4 && (
                            <Link 
                              href={`/products?category=${category.slug}`}
                              className="inline-flex items-center gap-1 px-2 xs:px-3 py-1 xs:py-1.5 gold-gradient text-white text-[10px] xs:text-xs font-semibold rounded-md transition-all duration-300 shadow-sm shadow-[#D4AF37]/20 hover:shadow-[#D4AF37]/30 flex-shrink-0 whitespace-nowrap"
                            >
                              View All
                              <ArrowRight className="w-4 h-4 xs:w-3 xs:h-3" />
                            </Link>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-center">
                        <div className="h-0.5 xs:h-1 w-16 xs:w-20 bg-[#D4AF37] rounded-full"></div>
                      </div>
                    </div>

                    <ProductGrid 
                      category={category._id} 
                      limit={4} 
                      hideFilters={true}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {!checkingProducts && visibleCategories.length === 0 && (
        <section className="py-6 xs:py-8 sm:py-12 bg-white">
          <div className="container mx-auto px-1 text-center">
            <p className="text-[#64748B] text-xs xs:text-sm">No products available at the moment. Please check back later.</p>
          </div>
        </section>
      )}
      
      <Carousel displayCategories={categories} />

      <AdSection />

      <BuyingGuideSection/>
      <SolutionsContactSection />

      <FeaturesBarSection />
      <ReviewsAndFAQSection/>


      <style jsx global>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.6s ease-out forwards;
        }
        
        @keyframes scroll {
          0% {
            transform: translateX(-30%);
          }
          100% {
            transform: translateX(0);
          }
        }

        .animate-scroll {
          animation: scroll 25s linear infinite;
          min-width: max-content;
          will-change: transform;
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-scroll {
            animation-duration: 40s;
          }
        }
      `}</style>
    </div>
  );
}