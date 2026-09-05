// lib/productService.ts - UPDATED WITH SIZE SUPPORT AND R2

import { 
  Product, 
  ApiResponse, 
  FilterOptions, 
  FilteredProductsResponse,
  FeaturedProductsResponse,
  PriceRangesResponse,
  CreateProductData,
  UpdateProductData,
  SingleProductResponse,
  CreateProductResponse,
  ProductOfferInfo,
  OfferProductsResponse,
  WeightUnit,
  ProductSize,
  ProductVariant,
  Size,
  SIZES
} from '@/types/product';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Define a type for API parameters
type APIParams = Record<string, string | number | boolean | string[] | number[] | undefined>;

// Helper function to handle API calls
async function fetchAPI<T>(endpoint: string, params: APIParams = {}): Promise<T> {
  try {
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    
    console.log('🌐 API Call:', url.toString());
    console.log('📋 Params:', params);
    
    // Add query parameters
    Object.keys(params).forEach(key => {
      const value = params[key];
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach((item) => {
            url.searchParams.append(key, item.toString());
          });
        } else {
          url.searchParams.append(key, value.toString());
        }
      }
    });

    console.log('🔗 Final URL:', url.toString());

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });

    console.log('📡 Response Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error Response:', errorText);
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ API Success:', data);
    return data as T;
  } catch (error) {
    console.error('❌ API call failed:', error);
    throw error;
  }
}

// Helper function for POST/PUT/PATCH requests
async function mutateAPI<T>(endpoint: string, method: 'POST' | 'PUT' | 'PATCH', data: any): Promise<T> {
  try {
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    
    console.log('🌐 API Call:', url.toString());
    console.log('📋 Method:', method);
    console.log('📦 Request Data:', data);

    const formData = new FormData();
    
    // FIRST: Handle File uploads separately
    // 1. Handle main ogImage file (MUST be File, not text)
    if (data.ogImage instanceof File) {
      formData.append('ogImage', data.ogImage);
      console.log('✅ OG Image added as File:', data.ogImage.name);
    }
    
    // 2. Handle main product images
    if (data.images && Array.isArray(data.images)) {
      data.images.forEach((file: File) => {
        formData.append('images', file);
      });
    }
    
    // 3. Handle variant images
    if (data.variants && Array.isArray(data.variants)) {
      data.variants.forEach((variant: any, index: number) => {
        if (variant.images && Array.isArray(variant.images)) {
          variant.images.forEach((imageFile: File) => {
            formData.append(`variants[${index}].images`, imageFile);
          });
        }
      });
    }
    
    // THEN: Handle all other fields
    Object.keys(data).forEach(key => {
      // SEO TEXT FIELDS (excluding ogImage which is handled as File above)
      if ([
        'metaTitle',
        'metaDescription',
        'canonicalUrl',
        'ogTitle',
        'ogDescription'
      ].includes(key)) {
        // Add SEO text fields
        if (data[key] !== undefined && data[key] !== null && data[key] !== '') {
          formData.append(key, data[key]);
        }
      }
      
      // Handle SCRIPT TAGS fields
      else if ([
        'headerScripts',
        'bodyScripts',
        'footerScripts'
      ].includes(key)) {
        // Add Script Tags text fields
        if (data[key] !== undefined && data[key] !== null && data[key] !== '') {
          formData.append(key, data[key]);
        }
      }
      
      // Handle metaKeywords array
      else if (key === 'metaKeywords') {
        if (Array.isArray(data[key])) {
          formData.append(key, JSON.stringify(data[key]));
        } else if (typeof data[key] === 'string' && data[key].trim() !== '') {
          // Handle comma-separated string like backend expects
          const keywords = data[key]
            .split(',')
            .map((k: string) => k.trim())
            .filter((k: string) => k !== '');
          formData.append(key, JSON.stringify(keywords));
        }
      }
      
      // Handle variants data (already handled images above)
      else if (key === 'variants' && Array.isArray(data[key])) {
        // Add variant JSON data (excluding images which are already added as files)
        const variantsWithoutImages = data[key].map((variant: any) => {
          const { images, ...variantData } = variant;
          return variantData;
        });
        formData.append('variants', JSON.stringify(variantsWithoutImages));
        
        // Also add individual variant fields for backend parsing
        data[key].forEach((variant: any, index: number) => {
          formData.append(`variants[${index}][variantName]`, variant.variantName || `Pack ${index + 1}`);
          formData.append(`variants[${index}][price]`, variant.price.toString());
          if (variant.originalPrice) {
            formData.append(`variants[${index}][originalPrice]`, variant.originalPrice.toString());
          }
          if (variant.description) {
            formData.append(`variants[${index}][description]`, variant.description);
          }
          if (variant.weight) {
            formData.append(`variants[${index}][weight]`, variant.weight.toString());
          }
          if (variant.weightUnit) {
            formData.append(`variants[${index}][weightUnit]`, variant.weightUnit);
          }
          formData.append(`variants[${index}][stock]`, (variant.stock || 0).toString());
          if (variant.sku) {
            formData.append(`variants[${index}][sku]`, variant.sku);
          }
          formData.append(`variants[${index}][isDefault]`, (variant.isDefault || (index === 0)).toString());
          if (variant.discountPercentage) {
            formData.append(`variants[${index}][discountPercentage]`, variant.discountPercentage.toString());
          }
          // ✅ Handle variant sizes
          if (variant.sizes && Array.isArray(variant.sizes) && variant.sizes.length > 0) {
            variant.sizes.forEach((sizeItem: any, sizeIndex: number) => {
              formData.append(`variants[${index}][sizes][${sizeIndex}][size]`, sizeItem.size);
              if (sizeItem.price !== undefined && sizeItem.price !== null && sizeItem.price !== '') {
                formData.append(`variants[${index}][sizes][${sizeIndex}][price]`, sizeItem.price.toString());
              }
            });
          }
        });
      }
      
      // Handle arrays that need JSON stringification
      else if (key === 'keyFeatures' && Array.isArray(data[key])) {
        formData.append(key, JSON.stringify(data[key]));
      } else if (key === 'specifications' && Array.isArray(data[key])) {
        formData.append(key, JSON.stringify(data[key]));
      }
      
      // ✅ Handle sizes field
      else if (key === 'sizes' && Array.isArray(data[key])) {
        formData.append(key, JSON.stringify(data[key]));
      }
      
      // Skip fields that are already handled or shouldn't be sent
      else if (
        key !== 'ogImage' &&
        key !== 'images' &&
        data[key] !== undefined && 
        data[key] !== null && 
        data[key] !== ''
      ) {
        // Handle all other text/number fields
        formData.append(key, data[key]);
      }
    });

    // DEBUG: Show what's being sent
    console.log('📋 FormData entries:');
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`  ${key}: File - ${value.name} (${value.size} bytes)`);
      } else if (typeof value === 'string' && value.length > 100) {
        console.log(`  ${key}: ${value.substring(0, 100)}...`);
      } else {
        console.log(`  ${key}: ${value}`);
      }
    }

    const response = await fetch(url.toString(), {
      method,
      body: formData,
    });

    console.log('📡 Response Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error Response:', errorText);
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    const responseData = await response.json();
    console.log('✅ API Success:', responseData);
    return responseData as T;
  } catch (error) {
    console.error('❌ API call failed:', error);
    throw error;
  }
}

// ============================================
// PRODUCT API FUNCTIONS
// ============================================

export async function getAllProducts(filters: { category?: string } = {}): Promise<ApiResponse> {
  return fetchAPI<ApiResponse>('/products', filters);
}

export async function getProductById(id: string): Promise<SingleProductResponse> {
  return fetchAPI<SingleProductResponse>(`/products/${id}`);
}

export async function getProductBySlug(slug: string): Promise<SingleProductResponse> {
  return fetchAPI<SingleProductResponse>(`/products/slug/${slug}`);
}

export async function createProduct(productData: CreateProductData): Promise<CreateProductResponse> {
  return mutateAPI<CreateProductResponse>('/products', 'POST', productData);
}

export async function updateProduct(productData: UpdateProductData): Promise<CreateProductResponse> {
  const { _id, ...data } = productData;
  return mutateAPI<CreateProductResponse>(`/products/${_id}`, 'PUT', data);
}

export async function deleteProduct(id: string): Promise<{ success: boolean; message: string }> {
  try {
    const url = new URL(`${API_BASE_URL}/products/${id}`);
    
    const response = await fetch(url.toString(), {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('❌ Delete product failed:', error);
    throw error;
  }
}

export async function getFeaturedProducts(filters: {
  priceRange?: string;
  category?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
} = {}): Promise<FeaturedProductsResponse> {
  return fetchAPI<FeaturedProductsResponse>('/products/featured', filters);
}

export async function getFeaturedPriceRanges(): Promise<PriceRangesResponse> {
  return fetchAPI<PriceRangesResponse>('/products/featured/price-ranges');
}

export async function getFilteredFeaturedProducts(filters: {
  priceRanges?: string | string[];
  categories?: string | string[];
  minPrice?: number;
  maxPrice?: number;
  colors?: string | string[];
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
} = {}): Promise<FilteredProductsResponse> {
  return fetchAPI<FilteredProductsResponse>('/products/featured/filter', filters);
}

export async function quickSearchProducts(
  query: string, 
  limit: number = 5
): Promise<{
  success: boolean;
  data: Array<{
    _id: string;
    name: string;
    slug: string;
    basePrice: number;
    image: string | null;
    category: string;
    featured: boolean;
  }>;
  count: number;
}> {
  const cleanQuery = query.trim();
  
  return fetchAPI<{
    success: boolean;
    data: Array<{
      _id: string;
      name: string;
      slug: string;
      basePrice: number;
      image: string | null;
      category: string;
      featured: boolean;
    }>;
    count: number;
  }>('/products/quick-search', { 
    q: cleanQuery, 
    limit: limit 
  });
}

export async function searchProducts(
  query: string, 
  filters: FilterOptions = {}
): Promise<ApiResponse> {
  const searchParams: APIParams = {
    search: query,
    ...filters
  };
  return fetchAPI<ApiResponse>('/products/search', searchParams);
}

export async function getProductsByCategories(categoryIds: string[]): Promise<ApiResponse> {
  return fetchAPI<ApiResponse>('/products', { category: categoryIds });
}

export async function getOfferProducts(filters: {
  category?: string;
  minDiscount?: number;
  maxDiscount?: number;
  limit?: number;
  sort?: 'discount-desc' | 'price-asc' | 'price-desc' | 'new';
} = {}): Promise<OfferProductsResponse> {
  const params: APIParams = {};
  
  if (filters.category) params.category = filters.category;
  if (filters.minDiscount !== undefined) params.minDiscount = filters.minDiscount;
  if (filters.maxDiscount !== undefined) params.maxDiscount = filters.maxDiscount;
  if (filters.limit) params.limit = filters.limit;
  if (filters.sort) params.sort = filters.sort;

  return fetchAPI<OfferProductsResponse>('/products/offers', params);
}

export async function uploadVariantImages(
  productId: string, 
  variantIndex: number, 
  images: File[]
): Promise<{ success: boolean; message: string; data: any }> {
  try {
    const url = new URL(`${API_BASE_URL}/products/${productId}/variants/${variantIndex}/images`);
    
    const formData = new FormData();
    images.forEach((image, index) => {
      formData.append('images', image);
    });

    const response = await fetch(url.toString(), {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('❌ Upload variant images failed:', error);
    throw error;
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

export function buildFilterParams(filters: FilterOptions): APIParams {
  const params: APIParams = {};

  if (filters.category) params.category = filters.category;
  if (filters.categories) params.categories = filters.categories;
  if (filters.priceRange) params.priceRange = filters.priceRange;
  if (filters.minPrice) params.minPrice = filters.minPrice;
  if (filters.maxPrice) params.maxPrice = filters.maxPrice;
  if (filters.colors) params.colors = filters.colors;
  if (filters.featured) params.featured = filters.featured;
  if (filters.status) params.status = filters.status;
  if (filters.search) params.search = filters.search;
  if (filters.page) params.page = filters.page;
  if (filters.limit) params.limit = filters.limit;
  if (filters.sortBy) params.sortBy = filters.sortBy;
  if (filters.sortOrder) params.sortOrder = filters.sortOrder;
  if (filters.minDiscount !== undefined) params.minDiscount = filters.minDiscount;
  if (filters.maxDiscount !== undefined) params.maxDiscount = filters.maxDiscount;
  if (filters.hasOffer !== undefined) params.hasOffer = filters.hasOffer;

  return params;
}

// ============================================
// CONSTANTS
// ============================================

export const PRICE_RANGES = [
  { value: '100-200', label: '₹100 - ₹200' },
  { value: '200-300', label: '₹200 - ₹300' },
  { value: '300-400', label: '₹300 - ₹400' },
  { value: '400-500', label: '₹400 - ₹500' },
  { value: '500-600', label: '₹500 - ₹600' },
  { value: 'above-600', label: 'Above ₹600' }
];

export const COLOR_OPTIONS = [
  { value: 'red', label: 'Red', code: '#FF0000' },
  { value: 'blue', label: 'Blue', code: '#0000FF' },
  { value: 'green', label: 'Green', code: '#00FF00' },
  { value: 'black', label: 'Black', code: '#000000' },
  { value: 'white', label: 'White', code: '#FFFFFF' },
  { value: 'yellow', label: 'Yellow', code: '#FFFF00' },
  { value: 'purple', label: 'Purple', code: '#800080' },
  { value: 'pink', label: 'Pink', code: '#FFC0CB' },
  { value: 'orange', label: 'Orange', code: '#FFA500' },
  { value: 'gray', label: 'Gray', code: '#808080' },
];

export const WEIGHT_UNITS: { value: WeightUnit; label: string }[] = [
  { value: 'gram', label: 'Gram (g)' },
  { value: 'kg', label: 'Kilogram (kg)' },
  { value: 'ml', label: 'Milliliter (ml)' },
  { value: 'liter', label: 'Liter (L)' },
  { value: 'piece', label: 'Piece' }
];

export const SORT_OPTIONS = [
  { value: 'createdAt-desc', label: 'Newest First' },
  { value: 'createdAt-asc', label: 'Oldest First' },
  { value: 'basePrice-asc', label: 'Price: Low to High' },
  { value: 'basePrice-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A to Z' },
  { value: 'name-desc', label: 'Name: Z to A' },
  { value: 'rating-desc', label: 'Highest Rated' }
];

export const DISCOUNT_RANGES = [
  { value: '10-20', label: '10% - 20% OFF', min: 10, max: 20 },
  { value: '20-30', label: '20% - 30% OFF', min: 20, max: 30 },
  { value: '30-50', label: '30% - 50% OFF', min: 30, max: 50 },
  { value: '50-70', label: '50% - 70% OFF', min: 50, max: 70 },
  { value: '70-90', label: '70% - 90% OFF', min: 70, max: 90 },
  { value: 'above-90', label: 'Above 90% OFF', min: 90, max: 100 }
];

export const OFFER_SORT_OPTIONS = [
  { value: 'discount-desc', label: 'Highest Discount' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'new', label: 'Newest Offers' }
];

export const SIZE_LABELS: Record<Size, string> = {
  'XS': 'Extra Small',
  'S': 'Small',
  'M': 'Medium',
  'L': 'Large',
  'XL': 'Extra Large',
  'XXL': 'Double Extra Large',
  'XXXL': 'Triple Extra Large'
};

// ============================================
// PRICE & FORMATTING HELPERS
// ============================================

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(price);
}

export function formatWeight(weight: number, unit: WeightUnit): string {
  if (unit === 'gram' && weight >= 1000) {
    return `${(weight / 1000).toFixed(2)} kg`;
  } else if (unit === 'ml' && weight >= 1000) {
    return `${(weight / 1000).toFixed(2)} liter`;
  }
  return `${weight} ${unit}`;
}

// ✅ UPDATED: Get product image URL - supports R2
export function getProductImageUrl(product: Product): string {
  const API_FILE_URL = process.env.NEXT_PUBLIC_IMG_URL || 'http://localhost:5002';
  
  if (product.images && product.images.length > 0 && product.images[0].image) {
    const imagePath = product.images[0].image;
    
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    if (imagePath.startsWith('/uploads/')) {
      return `${API_FILE_URL}${imagePath}`;
    }
    
    return `${API_FILE_URL}/uploads/${imagePath}`;
  }
  
  if (product.ogImage) {
    const imagePath = product.ogImage;
    
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    if (imagePath.startsWith('/uploads/')) {
      return `${API_FILE_URL}${imagePath}`;
    }
    
    return `${API_FILE_URL}/uploads/${imagePath}`;
  }
  
  return `${API_FILE_URL}/placeholder-image.jpg`;
}

// ✅ UPDATED: Get variant image URL - supports R2
export function getVariantImageUrl(variant: any): string {
  const API_FILE_URL = process.env.NEXT_PUBLIC_IMG_URL || 'http://localhost:5002';
  
  if (variant.images && variant.images.length > 0 && variant.images[0].image) {
    const imagePath = variant.images[0].image;
    
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    if (imagePath.startsWith('/uploads/')) {
      return `${API_FILE_URL}${imagePath}`;
    }
    
    return `${API_FILE_URL}/uploads/${imagePath}`;
  }
  
  return `${API_FILE_URL}/placeholder-image.jpg`;
}

export function getColorStockStatus(color: { name: string; stock: number }): string {
  if (color.stock > 10) return 'In Stock';
  if (color.stock > 0) return `Low Stock (${color.stock})`;
  return 'Out of Stock';
}

export function getVariantStockStatus(variant: { variantName: string; stock: number }): string {
  if (variant.stock > 10) return 'In Stock';
  if (variant.stock > 0) return `Low Stock (${variant.stock})`;
  return 'Out of Stock';
}

export function getKeyFeatures(product: Product): string[] {
  if (product.keyFeatures && Array.isArray(product.keyFeatures)) {
    return product.keyFeatures;
  }
  return [];
}

export function hasKeyFeatures(product: Product): boolean {
  return !!(product.keyFeatures && product.keyFeatures.length > 0);
}

export function formatKeyFeatures(keyFeatures: string[]): string[] {
  return keyFeatures.map(feature => feature.trim()).filter(feature => feature !== '');
}

export function createKeyFeaturesFromString(input: string): string[] {
  return input
    .split(',')
    .map(feature => feature.trim())
    .filter(feature => feature !== '');
}

export function getDefaultVariant(product: Product): any | null {
  if (product.variants && product.variants.length > 0) {
    const defaultVariant = product.variants.find(v => v.isDefault);
    return defaultVariant || product.variants[0];
  }
  return null;
}

export function getActivePrice(product: Product, selectedVariant?: any): number {
  if (selectedVariant && selectedVariant.price) {
    return selectedVariant.price;
  }
  return product.basePrice;
}

export function calculateDiscountedPrice(originalPrice: number, discountPercentage: number): number {
  const discountAmount = (originalPrice * discountPercentage) / 100;
  return originalPrice - discountAmount;
}

export function calculateDiscountPercentage(originalPrice: number, discountedPrice: number): number {
  if (originalPrice <= 0) return 0;
  const discountAmount = originalPrice - discountedPrice;
  const discountPercentage = (discountAmount / originalPrice) * 100;
  return Math.round(discountPercentage * 100) / 100;
}

export function getProductOfferInfo(product: Product, variant?: any): ProductOfferInfo {
  if (variant) {
    if (variant.originalPrice && variant.discountPercentage) {
      const discountedPrice = calculateDiscountedPrice(variant.originalPrice, variant.discountPercentage);
      return {
        hasOffer: variant.discountPercentage > 0,
        originalPrice: variant.originalPrice,
        discountedPrice: discountedPrice,
        discountPercentage: variant.discountPercentage,
        discountAmount: variant.originalPrice - discountedPrice
      };
    }
    return getProductOfferInfo(product);
  }
  
  if (product.hasOffer && product.originalPrice && product.discountPercentage) {
    const discountedPrice = calculateDiscountedPrice(product.originalPrice, product.discountPercentage);
    return {
      hasOffer: true,
      originalPrice: product.originalPrice,
      discountedPrice: discountedPrice,
      discountPercentage: product.discountPercentage,
      discountAmount: product.originalPrice - discountedPrice
    };
  }
  
  return {
    hasOffer: false,
    originalPrice: product.basePrice,
    discountedPrice: product.basePrice,
    discountPercentage: 0,
    discountAmount: 0
  };
}

export function formatPriceWithOffer(
  originalPrice: number, 
  discountedPrice: number
): {
  originalFormatted: string;
  discountedFormatted: string;
  discountPercentage: number;
} {
  const discountPercentage = calculateDiscountPercentage(originalPrice, discountedPrice);
  
  return {
    originalFormatted: formatPrice(originalPrice),
    discountedFormatted: formatPrice(discountedPrice),
    discountPercentage: discountPercentage
  };
}

export function hasActiveOffer(product: Product): boolean {
  return !!(product.hasOffer && product.originalPrice && product.discountPercentage && product.discountPercentage > 0);
}

export function getDisplayPrice(product: Product, variant?: any): {
  originalPrice: number;
  currentPrice: number;
  hasOffer: boolean;
  discountPercentage: number;
  formatted: {
    original: string;
    current: string;
    discount: string;
  };
} {
  const offerInfo = getProductOfferInfo(product, variant);
  const formattedPrices = formatPriceWithOffer(offerInfo.originalPrice, offerInfo.discountedPrice);
  
  return {
    originalPrice: offerInfo.originalPrice,
    currentPrice: offerInfo.discountedPrice,
    hasOffer: offerInfo.hasOffer,
    discountPercentage: offerInfo.discountPercentage,
    formatted: {
      original: formattedPrices.originalFormatted,
      current: formattedPrices.discountedFormatted,
      discount: `${offerInfo.discountPercentage}% OFF`
    }
  };
}

export function getBestPrice(product: Product): number {
  let lowestPrice = product.basePrice;
  
  if (product.hasOffer && product.originalPrice && product.discountPercentage) {
    const discountedPrice = calculateDiscountedPrice(product.originalPrice, product.discountPercentage);
    lowestPrice = Math.min(lowestPrice, discountedPrice);
  }
  
  if (product.variants && product.variants.length > 0) {
    product.variants.forEach(variant => {
      let variantPrice = variant.price;
      
      if (variant.originalPrice && variant.discountPercentage) {
        variantPrice = calculateDiscountedPrice(variant.originalPrice, variant.discountPercentage);
      }
      
      lowestPrice = Math.min(lowestPrice, variantPrice);
    });
  }
  
  return lowestPrice;
}

export function calculateTotalStockFromVariants(variants: any[]): number {
  if (!variants || variants.length === 0) return 0;
  return variants.reduce((sum, variant) => sum + (variant.stock || 0), 0);
}

export function getWeightDisplay(weight: number, unit: WeightUnit): string {
  return formatWeight(weight, unit);
}

export function validateVariant(variant: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!variant.variantName || variant.variantName.trim() === '') {
    errors.push('Variant name is required');
  }
  
  if (variant.price === undefined || variant.price === null || variant.price < 0) {
    errors.push('Valid price is required');
  }
  
  if (variant.stock === undefined || variant.stock === null || variant.stock < 0) {
    errors.push('Valid stock quantity is required');
  }
  
  if (variant.originalPrice && variant.originalPrice < variant.price) {
    errors.push('Original price cannot be less than current price');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

export function createDefaultVariant(basePrice: number): any {
  return {
    variantName: 'Standard Pack',
    price: basePrice,
    originalPrice: undefined,
    description: '',
    weight: 0,
    weightUnit: 'gram' as WeightUnit,
    stock: 0,
    images: [],
    sku: '',
    isDefault: true,
    status: 'active' as const,
    discountPercentage: 0,
    features: [],
    sizes: []
  };
}

// ============================================
// SIZE HELPER FUNCTIONS
// ============================================

/**
 * Get the price for a specific size
 * Returns the size-specific price if available, otherwise returns the default price
 */
export function getSizePrice(
  sizes: ProductSize[] | undefined,
  selectedSize: Size | string,
  defaultPrice: number
): number {
  if (!sizes || sizes.length === 0) return defaultPrice;
  const size = sizes.find(s => s.size === selectedSize);
  return size?.price ?? defaultPrice;
}

/**
 * Get the effective price for a product with size selection
 * Checks product-level sizes first, then variant sizes
 */
export function getProductSizePrice(
  product: Product,
  selectedSize: Size | string,
  variant?: ProductVariant
): number {
  // If variant is selected, check variant sizes first
  if (variant && variant.sizes && variant.sizes.length > 0) {
    const sizePrice = getSizePrice(variant.sizes, selectedSize, variant.price);
    return sizePrice;
  }
  
  // Check product-level sizes
  if (product.sizes && product.sizes.length > 0) {
    const sizePrice = getSizePrice(product.sizes, selectedSize, product.basePrice);
    return sizePrice;
  }
  
  // Fallback to base price
  return product.basePrice;
}

/**
 * Get the display price for a size
 * Returns the size-specific price with formatting
 */
export function getSizeDisplayPrice(
  sizes: ProductSize[] | undefined,
  selectedSize: Size | string,
  defaultPrice: number
): {
  price: number;
  formatted: string;
  isSpecialPrice: boolean;
} {
  const price = getSizePrice(sizes, selectedSize, defaultPrice);
  const isSpecialPrice = price !== defaultPrice;
  
  return {
    price,
    formatted: formatPrice(price),
    isSpecialPrice
  };
}

/**
 * Check if a specific size is available in the size list
 */
export function isSizeAvailable(
  sizes: ProductSize[] | undefined,
  size: Size | string
): boolean {
  if (!sizes || sizes.length === 0) return false;
  return sizes.some(s => s.size === size);
}

/**
 * Get available sizes from product or variant
 */
export function getAvailableSizes(
  product: Product,
  variant?: ProductVariant
): ProductSize[] {
  // If variant is selected and has sizes, return variant sizes
  if (variant && variant.sizes && variant.sizes.length > 0) {
    return variant.sizes;
  }
  
  // Return product-level sizes
  return product.sizes || [];
}

/**
 * Get all unique sizes from product and all variants
 */
export function getAllAvailableSizes(
  product: Product
): { size: Size; price: number | null; source: 'product' | 'variant'; variantName?: string }[] {
  const result: { size: Size; price: number | null; source: 'product' | 'variant'; variantName?: string }[] = [];
  
  // Add product-level sizes
  if (product.sizes && product.sizes.length > 0) {
    product.sizes.forEach(size => {
      result.push({
        size: size.size,
        price: size.price,
        source: 'product'
      });
    });
  }
  
  // Add variant-level sizes
  if (product.variants && product.variants.length > 0) {
    product.variants.forEach(variant => {
      if (variant.sizes && variant.sizes.length > 0) {
        variant.sizes.forEach(size => {
          result.push({
            size: size.size,
            price: size.price,
            source: 'variant',
            variantName: variant.variantName
          });
        });
      }
    });
  }
  
  return result;
}

/**
 * Format size label for display (e.g., "S" → "S", "XL" → "XL")
 */
export function formatSizeLabel(size: Size | string): string {
  const sizeMap: Record<string, string> = {
    'XS': 'XS',
    'S': 'S',
    'M': 'M',
    'L': 'L',
    'XL': 'XL',
    'XXL': 'XXL',
    'XXXL': 'XXXL'
  };
  return sizeMap[size] || size;
}

/**
 * Get size badge color (for UI styling)
 */
export function getSizeBadgeColor(size: Size | string): string {
  const colorMap: Record<string, string> = {
    'XS': 'blue',
    'S': 'green',
    'M': 'orange',
    'L': 'purple',
    'XL': 'red',
    'XXL': 'pink',
    'XXXL': 'gray'
  };
  return colorMap[size] || 'gray';
}

/**
 * Check if product has any sizes defined
 */
export function hasSizes(product: Product): boolean {
  return !!(product.sizes && product.sizes.length > 0);
}

/**
 * Check if variant has any sizes defined
 */
export function hasVariantSizes(variant: ProductVariant): boolean {
  return !!(variant.sizes && variant.sizes.length > 0);
}

/**
 * Get the minimum price among all sizes for a product
 */
export function getMinSizePrice(product: Product): number | null {
  if (!product.sizes || product.sizes.length === 0) return null;
  
  const prices = product.sizes
    .map(size => size.price)
    .filter(price => price !== null) as number[];
  
  if (prices.length === 0) return null;
  return Math.min(...prices);
}

/**
 * Get the maximum price among all sizes for a product
 */
export function getMaxSizePrice(product: Product): number | null {
  if (!product.sizes || product.sizes.length === 0) return null;
  
  const prices = product.sizes
    .map(size => size.price)
    .filter(price => price !== null) as number[];
  
  if (prices.length === 0) return null;
  return Math.max(...prices);
}

/**
 * Get price range string for sizes (e.g., "₹100 - ₹200")
 */
export function getSizePriceRange(product: Product): string | null {
  const minPrice = getMinSizePrice(product);
  const maxPrice = getMaxSizePrice(product);
  
  if (minPrice === null || maxPrice === null) return null;
  
  if (minPrice === maxPrice) {
    return formatPrice(minPrice);
  }
  
  return `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
}

/**
 * Check if a size has a custom price (different from default)
 */
export function hasCustomPrice(sizes: ProductSize[] | undefined, size: Size | string): boolean {
  if (!sizes || sizes.length === 0) return false;
  const found = sizes.find(s => s.size === size);
  return found?.price !== null && found?.price !== undefined;
}

/**
 * Get the default size (first available size)
 */
export function getDefaultSize(sizes: ProductSize[] | undefined): Size | null {
  if (!sizes || sizes.length === 0) return null;
  return sizes[0].size;
}

/**
 * Sort sizes in correct order (XS, S, M, L, XL, XXL, XXXL)
 */
export function sortSizes(sizes: ProductSize[]): ProductSize[] {
  const order: Record<Size, number> = {
    'XS': 0,
    'S': 1,
    'M': 2,
    'L': 3,
    'XL': 4,
    'XXL': 5,
    'XXXL': 6
  };
  
  return [...sizes].sort((a, b) => order[a.size] - order[b.size]);
}