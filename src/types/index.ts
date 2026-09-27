export type ProductCategory = 
  | 'Saree'
  | 'Three Piece'
  | 'Lehenga'
  | 'Kurti'
  | 'Abaya & Hijab'
  | 'Gown & Western';

export type ProductStatus = 'active' | 'out_of_stock' | 'draft';

export interface Product {
  id: string;
  code: string; // e.g. ODM-101
  name: string;
  bengaliName: string;
  category: ProductCategory;
  price: number;
  discountPrice?: number;
  description: string;
  bengaliDescription?: string;
  availableSizes: string[]; // e.g. ['S', 'M', 'L', 'XL', 'XXL', 'Free Size']
  availableColors: { name: string; hex: string }[];
  stock: number;
  images: string[];
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isPopular?: boolean;
  status: ProductStatus;
  fabric?: string;
  careInstructions?: string;
  rating?: number;
  reviewsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  selectedColor: { name: string; hex: string };
  quantity: number;
}

export type OrderStatus = 
  | 'new'
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export type PaymentMethod = 'cod' | 'bkash' | 'nagad';

export interface Order {
  id: string;
  orderNumber: string; // e.g. ODM-2026-8492
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryAddress: string;
  cityArea: 'dhaka' | 'sub_dhaka' | 'outside_dhaka';
  deliveryFee: number;
  items: CartItem[];
  subtotal: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'unpaid' | 'paid';
  status: OrderStatus;
  orderNote?: string;
  createdAt: string;
  updatedAt: string;
}

export type ComplaintType = 
  | 'delivery_delay'
  | 'product_quality'
  | 'wrong_item'
  | 'size_exchange'
  | 'payment_issue'
  | 'other';

export type ComplaintStatus = 
  | 'new'
  | 'reviewing'
  | 'processing'
  | 'resolved'
  | 'closed';

export interface Complaint {
  id: string;
  complaintId: string; // e.g. CMP-8492
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  orderId?: string;
  complaintType: ComplaintType;
  message: string;
  status: ComplaintStatus;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  address?: string;
  cityArea?: 'dhaka' | 'sub_dhaka' | 'outside_dhaka';
  role: 'customer' | 'admin';
  googleId?: string;
  createdAt: string;
}

export interface StoreSettings {
  brandName: string;
  hotline: string;
  whatsapp: string;
  facebookUrl: string;
  deliveryInsideDhaka: number;
  deliverySubDhaka: number;
  deliveryOutsideDhaka: number;
  freeDeliveryThreshold: number;
  bkashNumber: string;
  nagadNumber: string;
  announcementText: string;
  heroTagline: string;
  heroSubtitle: string;
}
