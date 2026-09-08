'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import React, { useState, useEffect, useRef } from 'react';
import { quickSearchProducts } from '@/lib/productService';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { settingsAPI } from '@/lib/settings-api';
import CartDrawer from '@/components/CartDrawer';
import { fetchCategories } from '@/lib/categoryService';
import {
  FaSearch,
  FaChevronDown,
  FaBars,
  FaUser,
  FaShoppingCart,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
  FaEnvelope,
  FaTimes,
  FaSignOutAlt,
  FaUserCircle
} from 'react-icons/fa';

interface Category {
  _id: string;
  name: string;
  slug: string;
  createdAt: string;
}

interface SearchProduct {
  _id: string;
  name: string;
  slug: string;
  basePrice: number;
  image: string | null;
  category: string;
  featured: boolean;
}

export default function HeaderClient() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const router = useRouter();

  const [showDropdown, setShowDropdown] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchProduct[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [siteName, setSiteName] = useState('Ebaaz');
  const [categories, setCategories] = useState<Category[]>([]);
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);

  const STATIC_URL = `${process.env.NEXT_PUBLIC_STATIC_URL}`;
  const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const [settings, setSettings] = useState<{
    contactNumber: string;
    contactEmail: string;
    facebookUrl: string;
    twitterUrl: string;
    instagramUrl: string;
    youtubeUrl: string;
    linkedinUrl: string;
  }>({
    contactNumber: '',
    contactEmail: '',
    facebookUrl: '',
    twitterUrl: '',
    instagramUrl: '',
    youtubeUrl: '',
    linkedinUrl: ''
  });

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const mobileSearchContainerRef = useRef<HTMLDivElement>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const categoriesDropdownRef = useRef<HTMLDivElement>(null);
  
  // Ref for the Cart Button to calculate flying coordinates
  const cartButtonRef = useRef<HTMLButtonElement>(null);

  // ------------------------------------------------------------
  // CART ANIMATION COORDINATES EVENT LISTENER
  // ------------------------------------------------------------
  useEffect(() => {
    const handleGetCartCoords = (e: CustomEvent) => {
      if (cartButtonRef.current) {
        const rect = cartButtonRef.current.getBoundingClientRect();
        const coords = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        };
        window.dispatchEvent(new CustomEvent('cartCoordsResponse', { detail: coords }));
      }
    };

    window.addEventListener('getCartCoords' as any, handleGetCartCoords as any);
    return () => window.removeEventListener('getCartCoords' as any, handleGetCartCoords as any);
  }, []);

  // ------------------------------------------------------------
  // LOAD CATEGORIES
  // ------------------------------------------------------------
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    loadCategories();
  }, []);

  // ------------------------------------------------------------
  // LOAD SITE SETTINGS
  // ------------------------------------------------------------
  useEffect(() => {
    const loadSiteSettings = async () => {
      try {
        const response = await settingsAPI.getPublicSettings();

        if (response.success && response.data) {
          const data = response.data;

          if (data.siteName && data.siteName.trim() !== '') {
            setSiteName(data.siteName);
          }

          setSettings({
            contactNumber: data.contactNumber || '',
            contactEmail: data.contactEmail || '',
            facebookUrl: data.facebookUrl || '',
            twitterUrl: data.twitterUrl || '',
            instagramUrl: data.instagramUrl || '',
            youtubeUrl: data.youtubeUrl || '',
            linkedinUrl: data.linkedinUrl || ''
          });
        }
      } catch (error) {
        console.error('Error loading site settings:', error);
      }
    };

    loadSiteSettings();
  }, []);

  // ------------------------------------------------------------
  // LIVE SEARCH
  // ------------------------------------------------------------
  useEffect(() => {
    const performSearch = async () => {
      const query = searchQuery.trim();

      if (query.length < 2) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);

      try {
        const response = await quickSearchProducts(query, 5);

        if (response.success) {
          setSearchResults(response.data || []);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(performSearch, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // ------------------------------------------------------------
  // SEARCH OUTSIDE CLICK
  // ------------------------------------------------------------
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      const clickedDesktopSearch =
        searchContainerRef.current?.contains(target);

      const clickedMobileSearch =
        mobileSearchContainerRef.current?.contains(target);

      if (!clickedDesktopSearch && !clickedMobileSearch) {
        setShowSearch(false);
        setSearchQuery('');
        setSearchResults([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // ------------------------------------------------------------
  // CATEGORY DROPDOWN OUTSIDE CLICK
  // ------------------------------------------------------------
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        categoriesDropdownRef.current &&
        !categoriesDropdownRef.current.contains(event.target as Node)
      ) {
        setShowCategoriesDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // ------------------------------------------------------------
  // USER DROPDOWN OUTSIDE CLICK
  // ------------------------------------------------------------
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // ------------------------------------------------------------
  // LOGOUT
  // ------------------------------------------------------------
  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    setIsMobileMenuOpen(false);
    router.push('/');
  };

  // ------------------------------------------------------------
  // CLOSE SEARCH
  // ------------------------------------------------------------
  const closeSearch = () => {
    setShowSearch(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  // ------------------------------------------------------------
  // SEARCH SUBMIT
  // ------------------------------------------------------------
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const query = searchQuery.trim();

    if (!query) {
      return;
    }

    closeSearch();

    router.push(
      `/products?search=${encodeURIComponent(query)}`
    );
  };

  // ------------------------------------------------------------
  // PRODUCT CLICK
  // ------------------------------------------------------------
  const handleProductClick = (product: SearchProduct) => {
    if (!product?.slug) {
      console.error('Product slug missing:', product);
      return;
    }

    const productUrl = `/products/${encodeURIComponent(product.slug)}`;

    setShowSearch(false);
    setSearchQuery('');
    setSearchResults([]);

    router.push(productUrl);
  };

  // ------------------------------------------------------------
  // VIEW ALL SEARCH RESULTS
  // ------------------------------------------------------------
  const handleViewAllResults = () => {
    const query = searchQuery.trim();

    if (!query) {
      return;
    }

    closeSearch();

    router.push(
      `/products?search=${encodeURIComponent(query)}`
    );
  };

  // ------------------------------------------------------------
  // CART
  // ------------------------------------------------------------
  const handleOpenCart = () => setIsCartOpen(true);
  const handleCloseCart = () => setIsCartOpen(false);

  // ------------------------------------------------------------
  // PROFILE DROPDOWN
  // ------------------------------------------------------------
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // ------------------------------------------------------------
  // CART COUNT
  // ------------------------------------------------------------
  const getCartItemCount = () => {
    if (!cart?.items) return 0;

    return cart.items.reduce(
      (total, item) => total + (item.quantity || 0),
      0
    );
  };

  const cartItemsCount = getCartItemCount();

  // ------------------------------------------------------------
  // SEARCH IMAGE
  // ------------------------------------------------------------
  const getSearchImageUrl = (imagePath: string | null) => {
    if (!imagePath) return null;

    if (
      imagePath.startsWith('http://') ||
      imagePath.startsWith('https://')
    ) {
      return imagePath;
    }

    if (imagePath.startsWith('/uploads/')) {
      return `${API_BASE_URL}${imagePath}`;
    }

    return `${API_BASE_URL}/uploads/${imagePath}`;
  };

  const firstCategory = categories.length > 0 ? categories[0] : null;
  const remainingCategories = categories.length > 1 ? categories.slice(1) : [];

  return (
    <>
      <style>{`
        .luxury-gradient {
          background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
        }

        .gold-gradient {
          background: linear-gradient(135deg, #D4AF37 0%, #AA7C11 100%);
        }

        .gold-gradient-hover:hover {
          background: linear-gradient(135deg, #E5C158 0%, #C49219 100%);
        }

        .gold-text-gradient {
          background: linear-gradient(135deg, #F3E5AB 0%, #D4AF37 50%, #AA7C11 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .glass-panel {
          background: rgba(255, 252, 247, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
      `}</style>

      {/* =====================================================
          HEADER
      ===================================================== */}
      <div className="sticky top-0 z-50">
        <div className="bg-[#FBF7F1] border-b border-[#D4AF37]/30 shadow-sm">
          <div className="max-w-7xl lg:max-w-[1600px] mx-auto grid grid-cols-[auto_1fr] lg:grid-cols-[150px_minmax(0,1fr)] items-start sm:items-center">

            {/* =================================================
                LOGO
            ================================================= */}
            <div className="row-span-2 px-1 sm:px-2 md:px-3 py-2 sm:py-1 flex items-start sm:items-center lg:w-[150px] lg:px-2 lg:py-0 lg:justify-center bg-[#FBF7F1]">
              <Link href="/" className="group relative flex items-center">
                <div className="relative w-14 h-7 sm:w-28 sm:h-14 md:w-36 md:h-16 lg:w-36 lg:h-20 overflow-hidden transition-transform duration-300 group-hover:scale-105">
                  <Image
                    src={`${STATIC_URL}/logo.webp`}
                    alt={siteName}
                    fill
                    priority
                    className="object-contain object-left"
                  />
                </div>
              </Link>
            </div>

            {/* =================================================
                TOP BAR
            ================================================= */}
            <div className="bg-[#FBF7F1] text-[#3F3A32] text-[7px] sm:text-[8px] md:text-xs px-1 sm:px-2 md:px-4 lg:px-8 py-0.5 sm:py-1 md:py-2 flex justify-between items-center gap-0.5 sm:gap-1 md:gap-3 lg:gap-6 lg:relative lg:min-w-0">
              
              {/* EMAIL */}
              {settings.contactEmail && (
                <a
                  href={`mailto:${settings.contactEmail}`}
                  className="flex items-center space-x-0.5 sm:space-x-1 md:space-x-2 hover:text-[#B8860B] transition-colors min-w-0 flex-1"
                >
                  <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 rounded-full bg-[#B8860B]/10 flex items-center justify-center text-[#B8860B] text-[6px] sm:text-[7px] md:text-[10px] flex-shrink-0">
                    <FaEnvelope />
                  </span>
                  <span className="font-light tracking-wide text-[6px] sm:text-[7px] md:text-[10px] lg:text-xs truncate">
                    {settings.contactEmail}
                  </span>
                </a>
              )}

              {/* CENTER */}
              <span className="hidden sm:block text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] uppercase tracking-[0.1em] sm:tracking-[0.15em] md:tracking-[0.2em] font-semibold text-[#B8860B]/80 whitespace-nowrap lg:absolute lg:left-1/2 lg:-translate-x-1/2">
                Enjoy Your Shopping
              </span>

              {/* SOCIAL */}
              <div className="flex items-center space-x-0.5 sm:space-x-1 md:space-x-2 flex-shrink-0">
                <span className="hidden xs:inline text-[5px] sm:text-[7px] md:text-[9px] lg:text-[11px] uppercase tracking-widest font-semibold text-[#B8860B]">
                  Connect
                </span>
                <div className="flex items-center space-x-0.5 sm:space-x-0.5 md:space-x-1">
                  {settings.facebookUrl && (
                    <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 lg:w-6 lg:h-6 rounded-full bg-white border border-[#B8860B]/30 text-[#B8860B] flex items-center justify-center hover:bg-[#B8860B] hover:text-white transition-all">
                      <FaFacebookF className="text-[5px] sm:text-[6px] md:text-[8px] lg:text-[10px]" />
                    </a>
                  )}
                  {settings.twitterUrl && (
                    <a href={settings.twitterUrl} target="_blank" rel="noopener noreferrer" className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 lg:w-6 lg:h-6 rounded-full bg-white border border-[#B8860B]/30 text-[#B8860B] flex items-center justify-center hover:bg-[#B8860B] hover:text-white transition-all">
                      <FaTwitter className="text-[5px] sm:text-[6px] md:text-[8px] lg:text-[10px]" />
                    </a>
                  )}
                  {settings.instagramUrl && (
                    <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 lg:w-6 lg:h-6 rounded-full bg-white border border-[#B8860B]/30 text-[#B8860B] flex items-center justify-center hover:bg-[#B8860B] hover:text-white transition-all">
                      <FaInstagram className="text-[5px] sm:text-[6px] md:text-[8px] lg:text-[10px]" />
                    </a>
                  )}
                  {settings.youtubeUrl && (
                    <a href={settings.youtubeUrl} target="_blank" rel="noopener noreferrer" className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 lg:w-6 lg:h-6 rounded-full bg-white border border-[#B8860B]/30 text-[#B8860B] flex items-center justify-center hover:bg-[#B8860B] hover:text-white transition-all">
                      <FaYoutube className="text-[5px] sm:text-[6px] md:text-[8px] lg:text-[10px]" />
                    </a>
                  )}
                  {settings.linkedinUrl && (
                    <a href={settings.linkedinUrl} target="_blank" rel="noopener noreferrer" className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 lg:w-6 lg:h-6 rounded-full bg-white border border-[#B8860B]/30 text-[#B8860B] flex items-center justify-center hover:bg-[#B8860B] hover:text-white transition-all">
                      <FaLinkedinIn className="text-[5px] sm:text-[6px] md:text-[8px] lg:text-[10px]" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* =================================================
                MAIN NAVBAR
            ================================================= */}
            <div className="relative px-1 sm:px-2 md:px-4 lg:px-8 py-0.5 sm:py-1 md:py-2 lg:py-3.5 flex items-center justify-between gap-1 sm:gap-2 md:gap-3 lg:gap-5 bg-white lg:min-w-0">

              {/* MOBILE LINKS */}
              <div className="flex lg:hidden items-center space-x-1 sm:space-x-2">
                <Link href="/" className="text-[#D4AF37] font-bold text-[10px] sm:text-xs px-2 py-1 rounded-full bg-[#D4AF37]/10 transition-all">
                  Home
                </Link>
                <Link href="/about" className="text-[#0F172A] font-medium text-[10px] sm:text-xs px-2 py-1 rounded-full hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] transition-all">
                  About
                </Link>
                <Link href="/contact" className="text-[#0F172A] font-medium text-[10px] sm:text-xs px-2 py-1 rounded-full hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] transition-all">
                  Contact
                </Link>
              </div>

              {/* DESKTOP NAV */}
              <nav className="hidden lg:flex flex-shrink-0 items-center space-x-1 bg-white/60 border border-[#D4AF37]/20 rounded-full px-4 xl:px-5 py-1.5 shadow-inner">
                <Link href="/" className="text-[#D4AF37] font-bold text-sm tracking-wide px-3 xl:px-4 py-1.5 rounded-full bg-[#D4AF37]/10 transition-all">
                  Home
                </Link>
                {firstCategory && (
                  <Link href={`/products?category=${firstCategory.slug}`} className="text-[#0F172A] font-medium text-sm tracking-wide px-3 xl:px-4 py-1.5 rounded-full hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] transition-all">
                    {firstCategory.name}
                  </Link>
                )}
                {remainingCategories.length > 0 && (
                  <div className="relative" ref={categoriesDropdownRef}>
                    <button
                      onClick={() => setShowCategoriesDropdown(!showCategoriesDropdown)}
                      className="flex items-center gap-1 text-[#0F172A] font-medium text-sm tracking-wide px-3 xl:px-4 py-1.5 rounded-full hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] transition-all"
                    >
                      Categories
                      <FaChevronDown className={`text-[10px] transition-transform duration-300 ${showCategoriesDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    {showCategoriesDropdown && (
                      <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-[#D4AF37]/30 rounded-2xl shadow-2xl py-2 z-50 overflow-hidden">
                        {remainingCategories.map((category) => (
                          <Link
                            key={category._id}
                            href={`/products?category=${category.slug}`}
                            className="flex items-center px-4 py-2.5 text-sm font-medium text-[#0F172A] hover:bg-[#FAF6ED] hover:text-[#D4AF37] transition-colors"
                            onClick={() => setShowCategoriesDropdown(false)}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mr-2.5"></span>
                            {category.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                <Link href="/about" className="text-[#0F172A] font-medium text-sm tracking-wide px-3 xl:px-4 py-1.5 rounded-full hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] transition-all">
                  About
                </Link>
                <Link href="/contact" className="text-[#0F172A] font-medium text-sm tracking-wide px-3 xl:px-4 py-1.5 rounded-full hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] transition-all">
                  Contact
                </Link>
              </nav>

              {/* =================================================
                  SEARCH + ACTIONS
              ================================================= */}
              <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3 lg:space-x-3 xl:space-x-4 ml-auto flex-shrink-0">

                {/* =================================================
                    DESKTOP SEARCH
                ================================================= */}
                <div ref={searchContainerRef} className="relative hidden md:block w-40 lg:w-52 xl:w-64 2xl:w-72 flex-shrink-0">
                  <div className="flex items-center border border-[#D4AF37]/30 rounded-full bg-white/90 px-3 md:px-4 py-1 md:py-2 focus-within:border-[#D4AF37] focus-within:ring-2 focus-within:ring-[#D4AF37]/20 transition-all shadow-sm">
                    <input
                      type="text"
                      placeholder="Search products..."
                      className="w-full bg-transparent text-xs md:text-sm focus:outline-none text-[#0F172A] placeholder-[#64748B]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setShowSearch(true)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSearchSubmit(e);
                      }}
                      ref={searchInputRef}
                    />
                    <button type="button" onClick={handleSearchSubmit} className="text-[#64748B] hover:text-[#D4AF37] transition-colors ml-2">
                      <FaSearch className="text-[10px] md:text-xs" />
                    </button>
                  </div>

                  {/* DESKTOP SEARCH RESULTS */}
                  {(searchResults.length > 0 || isSearching) && showSearch && (
                    <div className="absolute top-full right-0 mt-3 w-70 bg-white border border-[#D4AF37]/30 rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl">
                      {isSearching ? (
                        <div className="p-6 text-center text-[#64748B]">
                          <div className="animate-spin rounded-full h-6 w-6 border-2 border-[#D4AF37] border-t-transparent mx-auto"></div>
                          <p className="mt-3 text-xs font-medium tracking-wide">Searching masterpieces...</p>
                        </div>
                      ) : (
                        <>
                          <div className="p-3 bg-[#F8F9FA] border-b border-gray-100 flex items-center justify-between">
                            <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Product Matches</span>
                            <span className="text-[10px] bg-[#D4AF37]/10 text-[#D4AF37] font-semibold px-2 py-0.5 rounded-full">{searchResults.length} found</span>
                          </div>
                          <div className="max-h-72 overflow-y-auto p-2 space-y-1">
                            {searchResults.map((product) => (
                              <div
                                key={product._id}
                                className="flex items-center p-2.5 hover:bg-[#FAF6ED] rounded-xl cursor-pointer transition-all border border-transparent hover:border-[#D4AF37]/30"
                                onClick={() => handleProductClick(product)}
                              >
                                <div className="w-12 h-12 bg-gray-50 rounded-lg flex-shrink-0 overflow-hidden relative border border-gray-200">
                                  {product.image ? (
                                    <Image src={getSearchImageUrl(product.image) || '/placeholder-image.jpg'} alt={product.name} fill className="object-cover" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                      <FaSearch className="text-xs" />
                                    </div>
                                  )}
                                </div>
                                <div className="ml-3.5 flex-1 min-w-0">
                                  <p className="text-xs font-semibold text-[#0F172A] truncate">{product.name}</p>
                                  <div className="flex items-center justify-between mt-1">
                                    <span className="text-[10px] text-[#64748B] bg-gray-100 px-2 py-0.5 rounded-md truncate max-w-[100px]">{product.category}</span>
                                    <span className="text-[#D4AF37] font-bold text-xs">₹{product.basePrice}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="p-3 bg-gradient-to-r from-[#0F172A] to-[#1E293B] text-center cursor-pointer transition-all hover:opacity-95" onClick={handleViewAllResults}>
                            <p className="text-xs font-bold text-[#F3E5AB] tracking-wide flex items-center justify-center gap-1.5">
                              View all matches for "{searchQuery}" &rarr;
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* =================================================
                    MOBILE SEARCH BUTTON
                ================================================= */}
                <button
                  type="button"
                  onClick={() => setShowSearch(true)}
                  className="md:hidden flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white border border-[#D4AF37]/30 text-[#0F172A] hover:text-[#D4AF37] transition-all"
                  aria-label="Open Search"
                >
                  <FaSearch className="text-[10px] sm:text-xs" />
                </button>

                {/* =================================================
                    MOBILE SEARCH OVERLAY
                ================================================= */}
                {showSearch && (
                  <div ref={mobileSearchContainerRef} className="fixed inset-0 z-[100] md:hidden bg-[#FBF7F1] flex flex-col">
                    <button
                      type="button"
                      onClick={closeSearch}
                      className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white border border-[#D4AF37]/30 flex items-center justify-center text-[#0F172A] hover:bg-[#D4AF37] hover:text-white transition-all shadow-lg"
                      aria-label="Close search"
                    >
                      <FaTimes className="text-lg" />
                    </button>
                    <div className="flex-1 flex items-start justify-center pt-20 px-4">
                      <div className="w-full max-w-md">
                        <form onSubmit={handleSearchSubmit} className="relative">
                          <div className="flex items-center border-2 border-[#D4AF37]/40 rounded-2xl bg-white shadow-xl px-4 py-3 focus-within:border-[#D4AF37] focus-within:ring-4 focus-within:ring-[#D4AF37]/20 transition-all">
                            <FaSearch className="text-[#64748B] text-lg mr-3 flex-shrink-0" />
                            <input
                              type="text"
                              placeholder="Search products..."
                              className="flex-1 bg-transparent text-base md:text-lg focus:outline-none text-[#0F172A] placeholder-[#94A3B8] min-w-0"
                              value={searchQuery}
                              onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setShowSearch(true);
                              }}
                              autoFocus
                            />
                            {searchQuery && (
                              <button
                                type="button"
                                onClick={() => setSearchQuery('')}
                                className="flex-shrink-0 ml-2 p-1.5 text-[#64748B] hover:text-[#0F172A] rounded-full hover:bg-gray-100 transition-colors"
                                aria-label="Clear search"
                              >
                                <FaTimes className="text-base" />
                              </button>
                            )}
                          </div>
                        </form>

                        {/* =================================================
                            MOBILE RESULTS
                        ================================================= */}
                        {(searchResults.length > 0 || isSearching) && (
                          <div className="mt-4 w-full bg-white border border-[#D4AF37]/30 rounded-2xl shadow-2xl overflow-hidden max-h-[60vh]">
                            {isSearching ? (
                              <div className="p-8 text-center text-[#64748B]">
                                <div className="animate-spin rounded-full h-8 w-8 border-3 border-[#D4AF37] border-t-transparent mx-auto"></div>
                              </div>
                            ) : (
                              <>
                                <div className="p-3 bg-[#F8F9FA] border-b border-gray-100 flex items-center justify-between">
                                  <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Results</span>
                                  <span className="text-[10px] bg-[#D4AF37]/10 text-[#D4AF37] font-semibold px-2.5 py-1 rounded-full">{searchResults.length}</span>
                                </div>
                                <div className="overflow-y-auto max-h-[50vh] p-2 space-y-1">
                                  {searchResults.map((product) => (
                                    <button
                                      key={product._id}
                                      type="button"
                                      onClick={() => handleProductClick(product)}
                                      className="w-full flex items-center text-left p-3 hover:bg-[#FAF6ED] rounded-xl cursor-pointer transition-all"
                                    >
                                      <div className="w-14 h-14 bg-gray-50 rounded-xl flex-shrink-0 overflow-hidden relative border border-gray-200">
                                        {product.image ? (
                                          <Image src={getSearchImageUrl(product.image) || '/placeholder-image.jpg'} alt={product.name} fill className="object-cover" />
                                        ) : (
                                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <FaSearch className="text-lg" />
                                          </div>
                                        )}
                                      </div>
                                      <div className="ml-4 flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-[#0F172A] truncate">{product.name}</p>
                                        <div className="flex items-center justify-between mt-1.5">
                                          <span className="text-[10px] text-[#64748B] bg-gray-100 px-2.5 py-1 rounded-md truncate max-w-[120px]">{product.category}</span>
                                          <span className="text-[#D4AF37] font-bold text-sm">₹{product.basePrice}</span>
                                        </div>
                                      </div>
                                    </button>
                                  ))}
                                </div>
                                <button type="button" onClick={handleViewAllResults} className="w-full p-4 bg-[#0F172A] text-center hover:opacity-95 transition-opacity cursor-pointer">
                                  <p className="text-sm font-bold text-[#F3E5AB] tracking-wide">View all results →</p>
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* =================================================
                    AUTH - Desktop
                ================================================= */}
                {!user && (
                  <div className="hidden md:flex items-center gap-1 lg:gap-2 text-xs font-semibold">
                    <Link href="/login" className="h-8 lg:h-10 flex items-center justify-center px-3 lg:px-4 rounded-full border border-[#D4AF37]/30 bg-white/80 text-[#0F172A] hover:text-[#D4AF37] transition-all hover:shadow-sm text-[10px] lg:text-xs">
                      Login
                    </Link>
                    <Link href="/signup" className="h-8 lg:h-10 flex items-center justify-center whitespace-nowrap gold-gradient gold-gradient-hover text-white px-3 lg:px-5 rounded-full shadow-md shadow-[#D4AF37]/20 transition-all hover:-translate-y-0.5 text-[10px] lg:text-xs">
                      Sign Up
                    </Link>
                  </div>
                )}

                {/* =================================================
                    USER DROPDOWN - Desktop
                ================================================= */}
                {user && (
                  <div className="relative hidden sm:block" ref={dropdownRef}>
                    <button type="button" onClick={toggleDropdown} className="flex items-center space-x-1 sm:space-x-2 p-0.5 sm:p-1 pr-1 sm:pr-2 md:pr-3 rounded-full border border-[#D4AF37]/30 bg-white/80 hover:bg-white transition-all shadow-sm">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 rounded-full gold-gradient text-white flex items-center justify-center font-bold text-[7px] sm:text-[8px] md:text-[10px] lg:text-xs shadow-inner">
                        {user.email?.charAt(0).toUpperCase()}
                      </div>
                      <span className="hidden md:inline text-[10px] lg:text-xs font-semibold text-[#0F172A] max-w-[100px] truncate">
                        {user.name || user.email}
                      </span>
                      <FaChevronDown className={`text-[6px] sm:text-[7px] md:text-[8px] lg:text-[10px] text-[#64748B] transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    {showDropdown && (
                      <div className="absolute right-0 mt-3 w-56 bg-white border border-[#D4AF37]/30 rounded-2xl shadow-2xl py-2 z-50 overflow-hidden">
                        <div className="px-4 py-2.5 border-b border-gray-100 bg-[#FAF6ED]">
                          <p className="text-[10px] uppercase tracking-wider text-[#64748B]">Signed in as</p>
                          <p className="text-xs font-bold text-[#0F172A] truncate mt-0.5">{user.email}</p>
                        </div>
                        <Link href="/profile" className="flex items-center px-4 py-2.5 text-xs font-medium text-[#0F172A] hover:bg-[#FAF6ED] hover:text-[#D4AF37] transition-colors" onClick={() => setShowDropdown(false)}>
                          <FaUser className="mr-2 text-[#D4AF37]" />
                          My Profile
                        </Link>
                        <div className="border-t border-gray-100 my-1"></div>
                        <button type="button" onClick={handleLogout} className="w-full flex items-center px-4 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors text-left">
                          <FaSignOutAlt className="mr-2" />
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* =================================================
                    CART
                ================================================= */}
                <button
                  ref={cartButtonRef}
                  type="button"
                  onClick={handleOpenCart}
                  className="relative w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-11 lg:h-11 rounded-full bg-white border border-[#D4AF37]/30 flex items-center justify-center text-[#0F172A] hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all shadow-sm group cursor-pointer"
                  aria-label="Shopping Cart"
                >
                  <FaShoppingCart className="text-xs sm:text-sm md:text-base transition-transform group-hover:scale-110" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 gold-gradient text-white text-[6px] sm:text-[7px] md:text-[8px] lg:text-[10px] font-bold w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-4.5 md:h-4.5 lg:w-5 lg:h-5 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                      {cartItemsCount > 9 ? '9+' : cartItemsCount}
                    </span>
                  )}
                </button>

                {/* =================================================
                    HAMBURGER
                ================================================= */}
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="lg:hidden flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full bg-white border border-[#D4AF37]/30 text-[#0F172A] hover:text-[#D4AF37] transition-all shadow-sm"
                  aria-label="Open Menu"
                >
                  <FaBars className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          MOBILE MENU
      ===================================================== */}
      <div className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className={`absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsMobileMenuOpen(false)} />
        <div className={`absolute top-0 right-0 h-full w-[85%] max-w-sm bg-white shadow-2xl flex flex-col border-l border-[#D4AF37]/30 transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex items-center justify-between p-5 border-b border-[#D4AF37]/20 bg-white">
            <div className="relative w-32 h-10">
              <Image src={`${STATIC_URL}/logo.webp`} alt={siteName} fill className="object-contain object-left" />
            </div>
            <button type="button" onClick={() => setIsMobileMenuOpen(false)} className="w-9 h-9 rounded-full bg-gray-100 border border-[#D4AF37]/30 flex items-center justify-center text-[#0F172A] hover:bg-[#D4AF37] hover:text-white transition-all">
              <FaTimes />
            </button>
          </div>
          
          <nav className="flex-1 p-6 overflow-y-auto bg-white">
            {/* Categories Section */}
            {categories.length > 0 && (
              <div className="mb-6">
                <p className="px-4 pb-2 text-[11px] font-bold text-[#64748B] uppercase tracking-widest">Categories</p>
                <div className="space-y-1 mt-1">
                  {categories.map((category) => (
                    <Link 
                      key={category._id} 
                      href={`/products?category=${category.slug}`} 
                      className="flex items-center px-4 py-2.5 rounded-xl text-[#334155] hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] font-medium text-sm transition-all" 
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mr-2.5"></span>
                      <span className="truncate">{category.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Profile Section - Only show when logged in */}
            {user && (
              <div className="mb-6">
                <p className="px-4 pb-2 text-[11px] font-bold text-[#64748B] uppercase tracking-widest">Profile</p>
                <div className="space-y-1 mt-1">
                  <Link 
                    href="/profile" 
                    className="flex items-center px-4 py-2.5 rounded-xl text-[#334155] hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] font-medium text-sm transition-all" 
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FaUser className="w-4 h-4 mr-3 text-[#D4AF37]" />
                    <span>My Profile</span>
                  </Link>
                  <button 
                    type="button" 
                    onClick={handleLogout} 
                    className="w-full flex items-center px-4 py-2.5 rounded-xl text-red-600 hover:bg-red-50 font-medium text-sm transition-all text-left"
                  >
                    <FaSignOutAlt className="w-4 h-4 mr-3" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </nav>

          {/* Bottom Section - Login/Signup or User Info */}
          <div className="p-5 border-t border-[#D4AF37]/20 bg-white">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full gold-gradient text-white flex items-center justify-center font-bold text-sm shadow-md flex-shrink-0">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-[#0F172A] truncate">{user.name || user.email}</p>
                  <p className="text-[10px] text-[#64748B] truncate">{user.email}</p>
                </div>
              </div>
            ) : (
              <div className="flex space-x-3">
                <Link href="/login" className="flex-1 text-center py-3 rounded-xl bg-white border border-[#D4AF37]/30 text-[#0F172A] font-semibold text-xs shadow-sm hover:bg-[#FAF6ED]" onClick={() => setIsMobileMenuOpen(false)}>
                  Login
                </Link>
                <Link href="/signup" className="flex-1 text-center py-3 rounded-xl gold-gradient text-white font-semibold text-xs shadow-md" onClick={() => setIsMobileMenuOpen(false)}>
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <CartDrawer isOpen={isCartOpen} onClose={handleCloseCart} />
    </>
  );
}