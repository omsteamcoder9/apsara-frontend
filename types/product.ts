// types/product.ts - UPDATED WITH SIZE SUPPORT

// ✅ ADD THIS: Size type and interface
export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL';

export const SIZES: Size[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

export interface ProductSize {
  size: Size;
  price: number | null;  // null means use parent price (basePrice or variant.price)
  _id?: string;
}

export interface ProductImage {
  image: string;
  _id: string;
}

export interface ProductColor {
  name: string;
  code?: string; // hex color code: #FFFFFF
  stock: number;
  _id?: string;
}

export interface ProductVariant {
  variantName: string;
  variantSlug?: string;
  price: number;
  originalPrice?: number; // For variant-specific offers
  description?: string;
  // Weight fields
  weight?: number;
  weightUnit?: 'gram' | 'kg' | 'ml' | 'liter' | 'piece';
  stock: number;
  images: ProductImage[];
  sku?: string;
  isDefault: boolean;
  status: 'active' | 'inactive' | 'out-of-stock';
  discountPercentage?: number; // Variant-specific discount
  features?: string[];
  sizes?: ProductSize[];  // ✅ ADD THIS
  _id?: string;
}

export interface ProductSpecification {
  key: string;
  value: string;
  _id?: string;
}

export interface Product {
  _id: string;
  sNo: number;
  name: string;
  slug: string;
  basePrice: number;
  
  // Offer fields
  originalPrice?: number;
  discountPercentage?: number;
  hasOffer?: boolean;
  
  description: string;
  category: string | {
    _id: string;
    name: string;
    slug: string;
    description?: string;
  };
  rating: number;
  images: ProductImage[];
  seller: string;
  stock: number;
  numberOfReviews: number;
  
  // Color variants
  colors?: ProductColor[];
  
  // Product variants (combo packs) with weight support
  variants?: ProductVariant[];
  
  // Sizes for simple products with price
  sizes?: ProductSize[];  // ✅ ADD THIS
  
  // Specifications
  specifications?: ProductSpecification[];
  
  // Key Features
  keyFeatures?: string[];
  
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[] | string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  status: 'active' | 'inactive' | 'out-of-stock';
  featured: boolean;
  tags?: string[];
  isActive?: boolean;
  isFeatured?: boolean;
  ratings?: {
    average: number;
    count: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse {
  success: boolean;
  count: number;
  data: Product[];
}

export interface RawApiResponse {
  success: boolean;
  count: number;
  data?: Product[];
  products?: Product[];
  message?: string;
}

export interface FilterOptions {
  category?: string;
  priceRange?: string;
  categories?: string | string[];
  minPrice?: number;
  maxPrice?: number;
  colors?: string[];
  featured?: boolean;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  minDiscount?: number;
  maxDiscount?: number;
  hasOffer?: boolean;
}

export interface PriceRange {
  range: string;
  count: number;
  minPrice: number;
  maxPrice: number;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface FilteredProductsResponse {
  success: boolean;
  data: Product[];
  pagination: PaginationInfo;
}

export interface FeaturedProductsResponse {
  success: boolean;
  count: number;
  data: Product[];
}

export interface PriceRangesResponse {
  success: boolean;
  data: PriceRange[];
}

export interface CreateProductData {
  name: string;
  basePrice: number;
  
  // Offer fields
  originalPrice?: number;
  discountPercentage?: number;
  hasOffer?: boolean;
  
  description: string;
  category: string;
  seller: string;
  stock?: number;
  
  // Color variants
  colors?: ProductColor[];
  
  // Product variants with weight support
  variants?: ProductVariant[];
  
  // Sizes for simple products
  sizes?: ProductSize[];  // ✅ ADD THIS
  
  specifications?: ProductSpecification[];
  keyFeatures?: string[];
  images?: File[];
  slug?: string;
  rating?: number;
  numberOfReviews?: number;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: File | string;
  status?: 'active' | 'inactive' | 'out-of-stock';
  featured?: boolean;
  tags?: string[];
}

export interface UpdateProductData extends Partial<CreateProductData> {
  _id: string;
}

export interface ColorFilterOption {
  name: string;
  code: string;
  count: number;
}

export interface ProductDetailResponse {
  success: boolean;
  data: Product;
}

export interface CartProduct extends Omit<Product, 'colors' | 'variants'> {
  selectedColor?: ProductColor;
  selectedVariant?: ProductVariant;
  selectedSize?: Size;  // ✅ ADD THIS
  quantity: number;
}

export interface SingleProductResponse {
  success: boolean;
  data: Product;
}

export interface CreateProductResponse {
  success: boolean;
  message: string;
  data: Product;
}

export interface ProductOfferInfo {
  hasOffer: boolean;
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  discountAmount: number;
}

export type WeightUnit = 'gram' | 'kg' | 'ml' | 'liter' | 'piece';

export function formatWeight(weight: number, unit: WeightUnit): string {
  if (unit === 'gram' && weight >= 1000) {
    return `${(weight / 1000).toFixed(2)} kg`;
  } else if (unit === 'ml' && weight >= 1000) {
    return `${(weight / 1000).toFixed(2)} liter`;
  }
  return `${weight} ${unit}`;
}

export interface OfferProductsResponse {
  success: boolean;
  data: Product[];
  count: number;
}