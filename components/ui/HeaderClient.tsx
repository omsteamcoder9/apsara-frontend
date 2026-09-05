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
  FaSignOutAlt
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
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const categoriesDropdownRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const performSearch = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const response = await quickSearchProducts(searchQuery, 5);
        if (response.success) {
          setSearchResults(response.data);
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSearch(false);
        setSearchQuery('');
        setSearchResults([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoriesDropdownRef.current && !categoriesDropdownRef.current.contains(event.target as Node)) {
        setShowCategoriesDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    setIsMobileMenuOpen(false);
    router.push('/');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  const handleProductClick = (product: SearchProduct) => {
    router.push(`/products/${product.slug}`);
    setShowSearch(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleViewAllResults = () => {
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  const handleOpenCart = () => setIsCartOpen(true);
  const handleCloseCart = () => setIsCartOpen(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const getCartItemCount = () => {
    if (!cart?.items) return 0;
    return cart.items.reduce((total, item) => total + (item.quantity || 0), 0);
  };

  const cartItemsCount = getCartItemCount();

  const getSearchImageUrl = (imagePath: string | null) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
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

      {/* --- STICKY HEADER CONTAINER - ALWAYS VISIBLE --- */}
      <div className="sticky top-0 z-50">
        
        {/* --- GRID CONTAINER --- */}
        <div className="bg-[#FBF7F1] border-b border-[#D4AF37]/30 shadow-sm">
          <div className="max-w-7xl mx-auto grid grid-cols-[auto_1fr] items-center">
            
            {/* LEFT COLUMN: LOGO SPANNING BOTH ROWS */}
            <div className="row-span-2 px-1 sm:px-2 md:px-3 py-1 flex items-center bg-[#FBF7F1]">
              <Link href="/" className="group relative flex items-center">
                <div className="relative w-20 h-10 sm:w-28 sm:h-14 md:w-36 md:h-16 lg:w-38 lg:h-20 overflow-hidden transition-transform duration-300 group-hover:scale-105">
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

            {/* RIGHT COLUMN ROW 1: TOP BAR - ALWAYS VISIBLE */}
            <div className="bg-[#FBF7F1] text-[#3F3A32] text-xs px-4 sm:px-8 py-2 flex justify-between items-center gap-6">
              {/* Email - LEFT */}
              {settings.contactEmail && (
                <a
                  href={`mailto:${settings.contactEmail}`}
                  className="hidden md:flex items-center space-x-2 hover:text-[#B8860B] transition-colors"
                >
                  <span className="w-5 h-5 rounded-full bg-[#B8860B]/10 flex items-center justify-center text-[#B8860B] text-[10px]">
                    <FaEnvelope />
                  </span>
                  <span className="font-light tracking-wide">
                    {settings.contactEmail}
                  </span>
                </a>
              )}

              {/* CENTER - "Enjoy Your Shopping" */}
              <span className="hidden md:block text-[10px] uppercase tracking-[0.2em] font-semibold text-[#B8860B]/80">
                Enjoy Your Shopping
              </span>

              {/* Social Icons - RIGHT */}
              <div className="flex items-center space-x-2">
                <span className="text-[11px] uppercase tracking-widest font-semibold text-[#B8860B]">
                  Connect
                </span>
                <div className="flex items-center space-x-1">
                  {settings.facebookUrl && (
                    <a
                      href={settings.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-6 h-6 rounded-full bg-white border border-[#B8860B]/30 text-[#B8860B] flex items-center justify-center hover:bg-[#B8860B] hover:text-white transition-all"
                    >
                      <FaFacebookF className="text-[10px]" />
                    </a>
                  )}

                  {settings.twitterUrl && (
                    <a
                      href={settings.twitterUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-6 h-6 rounded-full bg-white border border-[#B8860B]/30 text-[#B8860B] flex items-center justify-center hover:bg-[#B8860B] hover:text-white transition-all"
                    >
                      <FaTwitter className="text-[10px]" />
                    </a>
                  )}

                  {settings.instagramUrl && (
                    <a
                      href={settings.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-6 h-6 rounded-full bg-white border border-[#B8860B]/30 text-[#B8860B] flex items-center justify-center hover:bg-[#B8860B] hover:text-white transition-all"
                    >
                      <FaInstagram className="text-[10px]" />
                    </a>
                  )}

                  {settings.youtubeUrl && (
                    <a
                      href={settings.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-6 h-6 rounded-full bg-white border border-[#B8860B]/30 text-[#B8860B] flex items-center justify-center hover:bg-[#B8860B] hover:text-white transition-all"
                    >
                      <FaYoutube className="text-[10px]" />
                    </a>
                  )}

                  {settings.linkedinUrl && (
                    <a
                      href={settings.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-6 h-6 rounded-full bg-white border border-[#B8860B]/30 text-[#B8860B] flex items-center justify-center hover:bg-[#B8860B] hover:text-white transition-all"
                    >
                      <FaLinkedinIn className="text-[10px]" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN ROW 2: MAIN NAVBAR - ALWAYS VISIBLE */}
            <div className="px-4 sm:px-8 py-3.5 flex items-center justify-between gap-6 bg-white">
              
              {/* Central Navigation Links */}
              <nav className="hidden lg:flex items-center space-x-1 bg-white/60 border border-[#D4AF37]/20 rounded-full px-6 py-1.5 shadow-inner">
                <Link href="/" className="text-[#D4AF37] font-bold text-sm tracking-wide px-4 py-1.5 rounded-full bg-[#D4AF37]/10 transition-all">
                  Home
                </Link>
                
                {firstCategory && (
                  <Link 
                    href={`/products?category=${firstCategory.slug}`} 
                    className="text-[#0F172A] font-medium text-sm tracking-wide px-4 py-1.5 rounded-full hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] transition-all"
                  >
                    {firstCategory.name}
                  </Link>
                )}
                
                {remainingCategories.length > 0 && (
                  <div className="relative" ref={categoriesDropdownRef}>
                    <button
                      onClick={() => setShowCategoriesDropdown(!showCategoriesDropdown)}
                      className="flex items-center gap-1 text-[#0F172A] font-medium text-sm tracking-wide px-4 py-1.5 rounded-full hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] transition-all"
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
                
                <Link href="/about" className="text-[#0F172A] font-medium text-sm tracking-wide px-4 py-1.5 rounded-full hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] transition-all">
                  About
                </Link>
                <Link href="/contact" className="text-[#0F172A] font-medium text-sm tracking-wide px-4 py-1.5 rounded-full hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] transition-all">
                  Contact
                </Link>
              </nav>

              {/* Expanded Search & Action Cluster */}
              <div className="flex items-center space-x-4 ml-auto">
                
                {/* Search Bar */}
                <div ref={searchContainerRef} className="relative hidden md:block w-56 lg:w-72">
                  <div className="flex items-center border border-[#D4AF37]/30 rounded-full bg-white/90 px-4 py-2 focus-within:border-[#D4AF37] focus-within:ring-2 focus-within:ring-[#D4AF37]/20 transition-all shadow-sm">
                    <input 
                      type="text" 
                      placeholder="Search products..." 
                      className="w-full bg-transparent text-xs sm:text-sm focus:outline-none text-[#0F172A] placeholder-[#64748B]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setShowSearch(true)}
                      ref={searchInputRef}
                    />
                    <button 
                      onClick={handleSearchSubmit}
                      className="text-[#64748B] hover:text-[#D4AF37] transition-colors ml-2"
                    >
                      <FaSearch className="text-xs" />
                    </button>
                  </div>

                  {/* Live Search Popup */}
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
                                    <Image
                                      src={getSearchImageUrl(product.image) || '/placeholder-image.jpg'}
                                      alt={product.name}
                                      fill
                                      className="object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                      <FaSearch className="text-xs" />
                                    </div>
                                  )}
                                </div>
                                <div className="ml-3.5 flex-1 min-w-0">
                                  <p className="text-xs font-semibold text-[#0F172A] truncate group-hover:text-[#D4AF37]">{product.name}</p>
                                  <div className="flex items-center justify-between mt-1">
                                    <span className="text-[10px] text-[#64748B] bg-gray-100 px-2 py-0.5 rounded-md truncate max-w-[100px]">{product.category}</span>
                                    <span className="text-[#D4AF37] font-bold text-xs">₹{product.basePrice}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div
                            className="p-3 bg-gradient-to-r from-[#0F172A] to-[#1E293B] text-center cursor-pointer transition-all hover:opacity-95"
                            onClick={handleViewAllResults}
                          >
                            <p className="text-xs font-bold text-[#F3E5AB] tracking-wide flex items-center justify-center gap-1.5">
                              View all matches for "{searchQuery}" &rarr;
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Mobile Search Icon */}
                <button 
                  onClick={() => setShowSearch(!showSearch)}
                  className="md:hidden flex items-center justify-center w-8 h-8 rounded-full bg-white border border-[#D4AF37]/30 text-[#0F172A] hover:text-[#D4AF37] transition-all"
                >
                  <FaSearch className="text-xs" />
                </button>

                {/* Mobile Search Bar */}
                {showSearch && (
                  <div className="absolute top-full left-0 right-0 mt-1 px-2 md:hidden">
                    <div className="flex items-center border border-[#D4AF37]/30 rounded-full bg-white px-4 py-2 shadow-lg">
                      <input 
                        type="text" 
                        placeholder="Search products..." 
                        className="w-full bg-transparent text-sm focus:outline-none text-[#0F172A] placeholder-[#64748B]"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                      />
                      <button 
                        onClick={handleSearchSubmit}
                        className="text-[#D4AF37] ml-2"
                      >
                        <FaSearch className="text-sm" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Authentication Buttons (Desktop) */}
                {!user && (
                  <div className="hidden md:flex items-center gap-2 text-xs font-semibold">
                    <Link
                      href="/login"
                      className="h-10 flex items-center justify-center px-4 rounded-full border border-[#D4AF37]/30 bg-white/80 text-[#0F172A] hover:text-[#D4AF37] transition-all hover:shadow-sm"
                    >
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      className="h-10 w-[84px] flex items-center justify-center whitespace-nowrap gold-gradient gold-gradient-hover text-white px-5 rounded-full shadow-md shadow-[#D4AF37]/20 transition-all hover:-translate-y-0.5"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}

                {/* User Profile Dropdown Menu (If logged in) */}
                {user && (
                  <div className="relative hidden sm:block" ref={dropdownRef}>
                    <button 
                      onClick={toggleDropdown}
                      className="flex items-center space-x-2.5 p-1.5 pr-3 rounded-full border border-[#D4AF37]/30 bg-white/80 hover:bg-white transition-all shadow-sm"
                    >
                      <div className="w-8 h-8 rounded-full gold-gradient text-white flex items-center justify-center font-bold text-xs shadow-inner">
                        {user.email?.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-xs font-semibold text-[#0F172A] max-w-[100px] truncate">{user.name || user.email}</span>
                      <FaChevronDown className={`text-[10px] text-[#64748B] transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    {showDropdown && (
                      <div className="absolute right-0 mt-3 w-56 bg-white border border-[#D4AF37]/30 rounded-2xl shadow-2xl py-2 z-50 overflow-hidden">
                        <div className="px-4 py-2.5 border-b border-gray-100 bg-[#FAF6ED]">
                          <p className="text-[10px] uppercase tracking-wider text-[#64748B]">Signed in as</p>
                          <p className="text-xs font-bold text-[#0F172A] truncate mt-0.5">{user.email}</p>
                        </div>
                        <Link href="/profile" className="flex items-center px-4 py-2.5 text-xs font-medium text-[#0F172A] hover:bg-[#FAF6ED] hover:text-[#D4AF37] transition-colors" onClick={() => setShowDropdown(false)}>
                          <FaUser className="mr-2 text-[#D4AF37]" /> My Account
                        </Link>
                        <div className="border-t border-gray-100 my-1"></div>
                        <button 
                          onClick={handleLogout}
                          className="w-full flex items-center px-4 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors text-left"
                        >
                          <FaSignOutAlt className="mr-2" /> Logout
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Cart Button */}
                <button 
                  onClick={handleOpenCart} 
                  className="relative w-11 h-11 rounded-full bg-white border border-[#D4AF37]/30 flex items-center justify-center text-[#0F172A] hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all shadow-sm group cursor-pointer"
                  aria-label="Shopping Cart"
                >
                  <FaShoppingCart className="text-base transition-transform group-hover:scale-110" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 gold-gradient text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                      {cartItemsCount > 9 ? '9+' : cartItemsCount}
                    </span>
                  )}
                </button>

                {/* Hamburger Menu */}
                <button 
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="lg:hidden flex items-center justify-center w-11 h-11 rounded-full bg-white border border-[#D4AF37]/30 text-[#0F172A] hover:text-[#D4AF37] transition-all shadow-sm"
                  aria-label="Open Menu"
                >
                  <FaBars className="w-4 h-4" />
                </button>

              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="absolute top-0 right-0 h-full w-[85%] max-w-sm bg-[#FFFCF7] shadow-2xl flex flex-col border-l border-[#D4AF37]/30">
            
            <div className="flex items-center justify-between p-5 border-b border-[#D4AF37]/20 bg-gradient-to-r from-[#0F172A] to-[#1E293B]">
              <div className="relative w-32 h-10">
                <Image 
                  src={`${STATIC_URL}/logo.webp`} 
                  alt={siteName} 
                  fill 
                  className="object-contain object-left brightness-0 invert"
                />
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="w-9 h-9 rounded-full bg-white/10 border border-[#D4AF37]/30 flex items-center justify-center text-white hover:bg-[#D4AF37] hover:text-[#0F172A] transition-all"
              >
                <FaTimes />
              </button>
            </div>

            <nav className="flex-1 p-6 overflow-y-auto space-y-4">
              <Link 
                href="/" 
                className="flex items-center px-4 py-3 rounded-xl text-[#0F172A] bg-[#D4AF37]/10 font-bold text-sm tracking-wide transition-all" 
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>

              {categories.length > 0 && (
                <div>
                  <p className="px-4 pb-2 text-[11px] font-bold text-[#64748B] uppercase tracking-widest">Collections</p>
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

              <div className="border-t border-gray-200 pt-3 space-y-1">
                <Link 
                  href="/about" 
                  className="flex items-center px-4 py-2.5 rounded-xl text-[#0F172A] hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] font-semibold text-sm transition-all" 
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About Us
                </Link>
                <Link 
                  href="/contact" 
                  className="flex items-center px-4 py-2.5 rounded-xl text-[#0F172A] hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] font-semibold text-sm transition-all" 
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact Us
                </Link>
              </div>
            </nav>

            <div className="p-5 border-t border-[#D4AF37]/20 bg-[#FAF6ED]">
              {user ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-10 h-10 rounded-full gold-gradient text-white flex items-center justify-center font-bold text-sm shadow-md flex-shrink-0">
                      {user.email?.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#0F172A] truncate">{user.name || user.email}</p>
                      <Link href="/profile" className="text-[11px] text-[#D4AF37] font-semibold hover:underline" onClick={() => setIsMobileMenuOpen(false)}>Manage Account</Link>
                    </div>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="text-red-500 hover:bg-red-50 p-2 rounded-xl border border-red-200 transition-colors"
                    title="Logout"
                  >
                    <FaSignOutAlt className="text-sm" />
                  </button>
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
      )}

      <CartDrawer isOpen={isCartOpen} onClose={handleCloseCart} />
    </>
  );
}