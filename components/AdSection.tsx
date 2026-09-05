import Image from 'next/image';
import { Laptop, Monitor, Smartphone, Headphones } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getAllProducts } from '@/lib/productService';
import { Product } from '@/types/product';

export default function VisionSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const features = [
    {
      icon: <Laptop className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500" />,
      title: "Laptops",
      description: "High-performance laptops for work and gaming.",
    },
    {
      icon: <Monitor className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500" />,
      title: "Desktops",
      description: "Powerful desktop computers for professionals.",
    },
    {
      icon: <Smartphone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500" />,
      title: "Mobile Phones",
      description: "Latest smartphones with cutting-edge features.",
    },
    {
      icon: <Headphones className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500" />,
      title: "Accessories",
      description: "Premium accessories to enhance your experience.",
    },
  ];

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

  // Auto-slide effect
  useEffect(() => {
    if (products.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === products.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [products.length]);

  const getProductImage = (product: Product) => {
    const baseUrl = process.env.NEXT_PUBLIC_IMG_URL || 'http://localhost:5002/uploads';
    
    // Check if product has images array
    if (product.images && product.images.length > 0 && product.images[0].image) {
      let imagePath = product.images[0].image;
      
      // If it's already a full URL, return it
      if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
      }
      
      // Remove leading slash if present
      if (imagePath.startsWith('/')) {
        imagePath = imagePath.substring(1);
      }
      
      // Check if path already contains 'uploads/'
      if (imagePath.startsWith('uploads/')) {
        // Remove 'uploads/' from the path since baseUrl already includes it
        imagePath = imagePath.substring(8); // Remove 'uploads/'
      }
      
      return `${baseUrl}/${imagePath}`;
    }
    
    // Check if product has ogImage
    if (product.ogImage) {
      let ogImagePath = product.ogImage;
      
      if (ogImagePath.startsWith('http://') || ogImagePath.startsWith('https://')) {
        return ogImagePath;
      }
      
      if (ogImagePath.startsWith('/')) {
        ogImagePath = ogImagePath.substring(1);
      }
      
      // Check if path already contains 'uploads/'
      if (ogImagePath.startsWith('uploads/')) {
        ogImagePath = ogImagePath.substring(8); // Remove 'uploads/'
      }
      
      return `${baseUrl}/${ogImagePath}`;
    }
    
    return '/placeholder-image.jpg';
  };

  return (
    <section className="w-full min-h-[350px] xs:min-h-[380px] sm:min-h-[400px] md:min-h-[420px] lg:min-h-[400px] xl:min-h-[420px] 2xl:min-h-[450px] h-auto bg-[#0d0d0d] px-1.5 xs:px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8 2xl:px-10 flex items-center py-2 xs:py-3 sm:py-3 md:py-4 lg:py-0">
      <div className="max-w-7xl w-full mx-auto bg-[#121212] border border-neutral-800 rounded-xl xs:rounded-2xl overflow-hidden shadow-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-1 xs:gap-1.5 sm:gap-2 md:gap-3 lg:gap-4 xl:gap-5 2xl:gap-6 items-center p-1.5 xs:p-2 sm:p-2.5 md:p-3 lg:p-4 xl:p-5 2xl:p-6 h-auto">
        
        {/* Image Slider - CONTAIN MODE to show full image */}
        <div className="sm:col-span-1 lg:col-span-5 relative h-[140px] xs:h-[160px] sm:h-[200px] md:h-[240px] lg:h-[280px] xl:h-[320px] 2xl:h-[360px] w-full rounded-lg xs:rounded-xl overflow-hidden shadow-inner bg-neutral-900">
          {loading ? (
            <div className="w-full h-full bg-neutral-800 animate-pulse flex items-center justify-center">
              <span className="text-neutral-500 text-[8px] xs:text-[9px] sm:text-xs md:text-sm">Loading...</span>
            </div>
          ) : products.length > 0 ? (
            <>
              <Image
                src={getProductImage(products[currentIndex])}
                alt={products[currentIndex].name || 'Product'}
                fill
                className="object-contain transition-opacity duration-500 p-2 xs:p-3 sm:p-4 md:p-5 lg:p-6"
                priority
                unoptimized={true}
                onError={(e) => {
                  console.error('Image failed to load:', getProductImage(products[currentIndex]));
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-image.jpg';
                }}
              />
              {/* Slide indicators */}
              <div className="absolute bottom-1 xs:bottom-1.5 sm:bottom-2 left-1/2 transform -translate-x-1/2 flex gap-0.5 xs:gap-1 z-10">
                {products.slice(0, 5).map((_, index) => (
                  <button
                    key={index}
                    className={`w-0.5 h-0.5 xs:w-1 xs:h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 rounded-full transition-all ${
                      index === currentIndex % 5 ? 'bg-orange-500 w-1.5 xs:w-2 sm:w-2.5 md:w-3' : 'bg-neutral-600'
                    }`}
                    onClick={() => setCurrentIndex(index)}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
              <span className="text-neutral-500 text-[8px] xs:text-[9px] sm:text-xs md:text-sm">No products available</span>
            </div>
          )}
        </div>

        {/* Vision Text */}
        <div className="sm:col-span-1 lg:col-span-4 flex flex-col justify-center space-y-0.5 xs:space-y-1 sm:space-y-1.5 md:space-y-2 px-0.5 xs:px-0">
          <span className="text-orange-500 font-semibold tracking-widest text-[15px] xs:text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] xl:text-[11px] uppercase">
            Our Vision
          </span>
          <h2 className="text-xs xs:text-sm sm:text-[5px] md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl font-bold text-white leading-tight">
            Simplifying Technology, <br className="hidden xs:inline" />Empowering <span className="text-orange-500">Possibilities</span>.
          </h2>
          <p className="text-neutral-400 text-[8px] xs:text-[9px] sm:text-xs md:text-sm lg:text-sm xl:text-base leading-relaxed line-clamp-2 xs:line-clamp-2 sm:line-clamp-2 md:line-clamp-3 lg:line-clamp-2">
            Our vision is to make advanced technology accessible to everyone. We aim to deliver innovative, reliable, and cost-effective solutions.
          </p>
        </div>

        {/* Features */}
        <div className="sm:col-span-2 lg:col-span-3 relative flex flex-col justify-center mt-1 sm:mt-0">
          <div className="absolute left-2 top-0 bottom-0 w-[1px] bg-neutral-800 hidden lg:block" />

          <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-1 gap-0.5 xs:gap-1 sm:gap-1.5 md:gap-2 lg:gap-1.5 xl:gap-2 2xl:gap-2.5 lg:pl-3">
            {features.map((item, index) => (
              <div 
                key={index} 
                className="relative flex flex-col items-center xs:flex-row xs:items-start sm:flex-col sm:items-center md:flex-row md:items-center lg:flex-row lg:items-start space-y-0.5 xs:space-y-0 xs:space-x-1 sm:space-x-0 sm:space-y-1 md:space-x-2 md:space-y-0 lg:space-x-2 lg:space-y-0 group p-0.5 xs:p-1 sm:p-1.5 md:p-2 lg:p-1 xl:p-1.5 rounded-lg lg:rounded-none hover:bg-neutral-800/20 xs:hover:bg-neutral-800/20 sm:hover:bg-neutral-800/30 md:hover:bg-neutral-800/30 lg:hover:bg-transparent transition-colors"
              >
                <div className="relative z-10 flex-shrink-0 w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-8 lg:h-8 xl:w-9 xl:h-9 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center shadow-[0_0_10px_rgba(249,115,22,0.1)] group-hover:border-orange-500/50 transition-colors">
                  <div className="scale-75 xs:scale-90 sm:scale-100 md:scale-100 lg:scale-100">
                    {item.icon}
                  </div>
                </div>
                <div className="flex-1 min-w-0 text-center xs:text-left sm:text-center md:text-left lg:text-left">
                  <h3 className="text-white font-semibold text-[7px] xs:text-[8px] sm:text-[9px] md:text-[10px] lg:text-sm xl:text-base mb-0 truncate max-w-full">
                    {item.title}
                  </h3>
                  <p className="text-neutral-400 text-[5px] xs:text-[6px] sm:text-[7px] md:text-[8px] lg:text-[10px] xl:text-[11px] 2xl:text-xs leading-tight xs:leading-tight sm:leading-tight md:leading-relaxed lg:leading-relaxed line-clamp-1 truncate max-w-full">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}