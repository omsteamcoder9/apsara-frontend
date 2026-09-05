// types/order.ts - UPDATED WITH SIZE SUPPORT
export interface OrderItem {
  product: {
    _id: string;
    name: string;
    price: number;
    image?: string;
  };
  quantity: number;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  name?: string;
  
  // Variant support
  variantId?: string;
  variantName?: string;
  
  // ✅ SIZE SUPPORT
  selectedSize?: string;
  selectedSizePrice?: number | null;
  variantSizes?: Array<{
    size: string;
    price: number;
  }>;
  
  // Color support
  selectedColor?: string;
  
  image?: string;
  sku?: string;
}

export interface Order {
  _id: string;
  orderId: string;
  sNo?: number;
  
  user?: {
    _id: string;
    name: string;
    email: string;
  };
  guestUser?: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  
  isGuestOrder?: boolean;
  
  products: OrderItem[];
  
  totalAmount: number;
  subtotal?: number;
  discountAmount?: number;
  shippingFee?: number;
  taxAmount?: number;
  finalAmount?: number;
  
  razorpayOrderId?: string;
  paymentId?: string;
  paymentSignature?: string;
  
  shippingAddress: {
    firstName?: string;
    lastName?: string;
    fullName?: string;
    email?: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode?: string;
    postalCode?: string;
    country: string;
  };
  
  paymentMethod: 'razorpay' | 'stripe' | 'cod' | 'paypal';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded' | 'partially_refunded';
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded' | 'partially_refunded';
  
  shipmentId?: string;
  shippingStatus?: string;
  awbNumber?: string;
  courierName?: string;
  
  paidAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
  
  cancelledBy?: string;
  cancellationReason?: string;
  
  refunds?: Array<{
    refundId: string;
    amount: number;
    razorpayPaymentId: string;
    type: 'full' | 'partial';
    createdAt: string;
    notes?: any;
  }>;
}

export interface OrdersResponse {
  success: boolean;
  orders: Order[];
  message?: string;
  pagination?: {
    page: number;
    pages: number;
    total: number;
  };
}

export interface OrderResponse {
  success: boolean;
  order: Order;
  message?: string;
}

export interface CreateOrderRequest {
  shippingAddress: {
    firstName?: string;
    lastName?: string;
    fullName: string;
    email?: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode?: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: 'razorpay' | 'stripe' | 'cod' | 'paypal';
  paymentId?: string;
  products?: Array<{
    product: string;
    variantId?: string;
    variantName?: string;
    selectedSize?: string;      // ✅ ADDED
    selectedSizePrice?: number; // ✅ ADDED
    quantity: number;
    price?: number;
  }>;
}

export interface GuestOrderRequest extends CreateOrderRequest {
  guestUser: {
    name: string;
    email: string;
    phone: string;
  };
  products: Array<{
    product: string;
    variantId?: string;
    variantName?: string;
    selectedSize?: string;      // ✅ ADDED
    selectedSizePrice?: number; // ✅ ADDED
    quantity: number;
    price?: number;
  }>;
}

export interface UpdateOrderStatusRequest {
  orderStatus: Order['orderStatus'];
  cancellationReason?: string;
}

export interface CancelOrderRequest {
  cancellationReason?: string;
}