import Image from 'next/image';
import { ArrowRight, PhoneCall } from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAllProducts } from '@/lib/productService';
import { Product } from '@/types/product';

export default function SolutionsContactSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getAllProducts({});
        if (response.success && response.data) {
          setProducts(response.data);
          console.log('Products loaded:', response.data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Auto-slide effect - changes every 3 seconds
  useEffect(() => {
    if (products.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === products.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [products.length]);

  // ✅ UPDATED: Get product image - supports both local and R2 URLs
  const getProductImage = (product: Product) => {
    const API_FILE_URL = process.env.NEXT_PUBLIC_IMG_URL || 'http://localhost:5002';
    
    // Check main images first
    if (product.images && product.images.length > 0 && product.images[0].image) {
      const imagePath = product.images[0].image;
      
      if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
      }
      
      if (imagePath.startsWith('/uploads/')) {
        return `${API_FILE_URL}${imagePath}`;
      }
      
      const cleanPath = imagePath.replace(/^\/+/, '');
      return `${API_FILE_URL}/${cleanPath}`;
    }
    
    if (product.ogImage) {
      const imagePath = product.ogImage;
      
      if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
      }
      
      if (imagePath.startsWith('/uploads/')) {
        return `${API_FILE_URL}${imagePath}`;
      }
      
      const cleanPath = imagePath.replace(/^\/+/, '');
      return `${API_FILE_URL}/${cleanPath}`;
    }
    
    return '/placeholder-image.jpg';
  };

  // ✅ FIXED: Get 4 products starting from current index (with wrap-around)
  // Now uses a unique key combining product._id and position index
  const getDisplayProducts = () => {
    if (products.length === 0) return [];
    
    const displayProducts = [];
    for (let i = 0; i < 4; i++) {
      const index = (currentIndex + i) % products.length;
      displayProducts.push({
        ...products[index],
        // Add a unique position key to avoid duplicate keys when product list is small
        _displayKey: `${products[index]._id}-${i}`
      });
    }
    return displayProducts;
  };

  const displayProducts = getDisplayProducts();

  return (
    <section className="w-full bg-white py-8 xs:py-10 sm:py-12 md:py-14 lg:py-16 px-3 xs:px-4 sm:px-6 lg:px-8 flex justify-center items-center">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-4 xs:gap-5 sm:gap-6 md:gap-7 lg:gap-8 items-center">
        
        {/* Left Side: Solutions Info & 2x2 Image Cards */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4 xs:space-y-5 sm:space-y-6 md:space-y-7 lg:space-y-8">
          
          {/* Header & Grid Wrapper */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 xs:gap-5 sm:gap-6 items-center">
            
            {/* Text Content */}
            <div className="md:col-span-5 flex flex-col space-y-2 xs:space-y-2.5 sm:space-y-3 md:space-y-4">
              <span className="text-orange-500 font-semibold tracking-widest text-[8px] xs:text-[9px] sm:text-[10px] md:text-xs uppercase">
                Our Products
              </span>
              <h2 className="text-lg xs:text-xl sm:text-2xl md:text-2xl lg:text-3xl font-bold text-black leading-tight">
                Premium Tech <span className="text-orange-500">Solutions</span>
              </h2>
              <p className="text-neutral-600 text-[10px] xs:text-[11px] sm:text-xs md:text-sm leading-relaxed line-clamp-3 xs:line-clamp-3 sm:line-clamp-none">
                Discover our wide range of high-quality products designed to meet all your needs with reliability and excellence.
              </p>
              <div>
                <Link href="/products">
                  <button className="bg-black border border-neutral-800 text-white px-3 xs:px-4 sm:px-5 py-2 xs:py-2 sm:py-2.5 rounded-xl font-medium text-[10px] xs:text-[11px] sm:text-xs flex items-center space-x-1.5 xs:space-x-2 hover:border-orange-500/50 transition-colors shadow-lg">
                    <span>Explore Products</span>
                    <ArrowRight className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 text-orange-500" />
                  </button>
                </Link>
              </div>
            </div>

            {/* 2x2 Image Cards Grid with Name & Price Below - No BG Card */}
            <div className="md:col-span-7 grid grid-cols-2 gap-1.5 xs:gap-2 sm:gap-2.5 md:gap-3">
              {loading ? (
                // Loading skeletons
                Array.from({ length: 4 }).map((_, index) => (
                  <div key={`skeleton-${index}`} className="flex flex-col gap-1 xs:gap-1.5 sm:gap-2">
                    <div className="relative h-32 xs:h-40 sm:h-44 md:h-32 rounded-xl xs:rounded-2xl overflow-hidden bg-neutral-200 animate-pulse" />
                    <div className="h-3 xs:h-3.5 sm:h-4 bg-neutral-200 animate-pulse rounded w-3/4" />
                    <div className="h-2.5 xs:h-3 sm:h-3.5 bg-neutral-200 animate-pulse rounded w-1/2" />
                  </div>
                ))
              ) : displayProducts.length > 0 ? (
                displayProducts.map((product, index) => (
                  <Link 
                    href={`/products/${product.slug}`} 
                    key={product._displayKey || product._id || index}
                  >
                    <div className="flex flex-col gap-1 xs:gap-1.5 sm:gap-2">
                      <div className="relative h-32 xs:h-40 sm:h-44 md:h-32 rounded-xl xs:rounded-2xl overflow-hidden group cursor-pointer">
                        <Image
                          src={getProductImage(product)}
                          alt={product.name || 'Product'}
                          fill
                          className="object-cover md:object-cover group-hover:scale-105 transition-transform duration-500"
                          unoptimized={true}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder-image.jpg';
                          }}
                        />
                      </div>
                      {/* Product Name */}
                      <h3 className="text-black font-semibold text-[9px] xs:text-[10px] sm:text-xs md:text-sm truncate">
                        {product.name}
                      </h3>
                      {/* Product Price */}
                      <p className="text-orange-500 font-bold text-[8px] xs:text-[9px] sm:text-xs md:text-sm">
                        ₹{product.basePrice}
                      </p>
                    </div>
                  </Link>
                ))
              ) : (
                // No products message
                Array.from({ length: 4 }).map((_, index) => (
                  <div key={`empty-${index}`} className="flex flex-col gap-1 xs:gap-1.5 sm:gap-2">
                    <div className="relative h-32 xs:h-40 sm:h-44 md:h-32 rounded-xl xs:rounded-2xl overflow-hidden bg-neutral-100 flex items-center justify-center">
                      <span className="text-neutral-400 text-[8px] xs:text-[9px] sm:text-xs">No product</span>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>

        {/* Right Side: Contact Our Team Card */}
        <div className="lg:col-span-5 bg-[#121212] border border-neutral-800 rounded-2xl p-4 xs:p-5 sm:p-6 md:p-7 lg:p-8 relative overflow-hidden shadow-2xl group hover:border-orange-500/40 transition-colors">
          
          {/* Background Ambient Glow */}
          <div className="absolute -right-10 -bottom-10 w-36 xs:w-40 sm:w-44 md:w-48 lg:w-48 h-36 xs:h-40 sm:h-44 md:h-48 lg:h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col space-y-3 xs:space-y-4 sm:space-y-5 md:space-y-6">
            <div>
              <span className="text-orange-500 font-semibold tracking-widest text-[8px] xs:text-[9px] sm:text-[10px] md:text-xs uppercase mb-1 xs:mb-1.5 sm:mb-2 block">
                GET IN TOUCH
              </span>
              <h3 className="text-base xs:text-lg sm:text-xl md:text-xl lg:text-2xl font-bold text-white mb-1 xs:mb-1.5 sm:mb-2">
                Contact Our Expert Team
              </h3>
              <p className="text-neutral-400 text-[10px] xs:text-[11px] sm:text-xs md:text-sm leading-relaxed">
                Have questions or need a custom hardware solution? Talk directly with our specialists today.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 xs:gap-2.5 sm:gap-3">
              <Link href="/contact" className="flex-1">
                <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 xs:py-3 sm:py-3 px-3 xs:px-4 rounded-xl text-[10px] xs:text-[11px] sm:text-xs md:text-sm flex items-center justify-center space-x-1.5 xs:space-x-2 transition-colors shadow-[0_0_20px_rgba(249,115,22,0.3)]">
                  <PhoneCall className="w-3.5 h-3.5 xs:w-4 xs:h-4" />
                  <span>Contact Us</span>
                </button>
              </Link>
            </div>

            <div className="text-[9px] xs:text-[10px] sm:text-[11px] text-neutral-500 flex items-center space-x-1 xs:space-x-1.5">
              <span className="w-1.5 h-1.5 xs:w-2 xs:h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Our support team is online and ready to help you.</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}