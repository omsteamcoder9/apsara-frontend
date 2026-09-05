// types/cart.ts
import { Product, ProductVariant, Size, ProductSize } from './product';

export interface CartItem {
  _id: string;
  product: Product;
  quantity: number;
  price: number;
  variantId?: string;
  variantName?: string;
  variantImages?: string[];
  variantSizes?: ProductSize[];     // ✅ ADDED
  selectedSize?: Size | string;      // ✅ ADDED
  selectedSizePrice?: number | null; // ✅ ADDED
  weight?: number;
  weightUnit?: string;
  selectedVariant?: ProductVariant;
  selectedColor?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  totalPrice: number;
  totalItems: number;
  createdAt: string;
  updatedAt: string;
}

export interface AddToCartData {
  productId: string;
  quantity: number;
  variantId?: string;
  selectedSize?: Size | string;     // ✅ ADDED
}

export interface UpdateCartItemData {
  quantity: number;
}

export interface GuestCartItem {
  product: Product;
  quantity: number;
  price: number;
  selectedSize?: Size | string;     // ✅ ADDED
  variantId?: string;
  variantName?: string;
  variantImages?: string[];
  variantSizes?: ProductSize[];     // ✅ ADDED
  selectedSizePrice?: number | null; // ✅ ADDED
}

export interface GuestCart {
  items: GuestCartItem[];
  totalPrice: number;
  totalItems: number;
}