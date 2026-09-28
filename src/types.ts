export type Role = 'CUSTOMER' | 'ADMIN' | 'EMPLOYEE';

export type EmployeePermission = 'inventory' | 'orders' | 'customers' | 'reviews' | 'settings';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  employeeTitle?: string;
  permissions?: EmployeePermission[];
  phone?: string;
  avatar?: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  urduName: string;
  sku: string;
  category: string;
  subcategory: string;
  brand: string;
  price: number;
  salePrice?: number;
  stock: number;
  reservedStock: number;
  minStockAlert: number;
  description: string;
  urduDescription: string;
  specifications: { label: string; value: string }[];
  images: string[];
  rating: number;
  reviewCount: number;
  isFeatured?: boolean;
  isNew?: boolean;
  variants?: ProductVariant[];
  createdAt: string;
}

export interface CartItem {
  productId: string;
  variantId?: string;
  quantity: number;
  product: Product;
  image?: string;
}

export type OrderStatus =
  | 'placed'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned';

export type PaymentMethod = 'cod' | 'jazzcash' | 'easypaisa' | 'bank_transfer';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface OrderItem {
  productId: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  image: string;
  variantName?: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  area: string;
  postalCode: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  discountAmount: number;
  couponCode?: string;
  shippingFee: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  transactionRef?: string;
  paymentProofUrl?: string;
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryLog {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  changeAmount: number;
  previousStock: number;
  newStock: number;
  reason: string;
  employeeName: string;
  timestamp: string;
}

export interface Review {
  id: string;
  productId: string;
  customerName: string;
  customerEmail: string;
  rating: number;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percent' | 'fixed';
  value: number;
  minOrder: number;
  maxUses: number;
  currentUses: number;
  expiryDate: string;
  isActive: boolean;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  urduName: string;
  description: string;
  itemCount: number;
  image: string;
}

export interface StoreSettings {
  brandName: string;
  supportEmail: string;
  supportPhone: string;
  currency: string;
  taxRate: number;
  freeShippingThreshold: number;
  standardShippingFee: number;
  expressShippingFee: number;
  jazzCashAccount: string;
  jazzCashTitle: string;
  easypaisaAccount: string;
  easypaisaTitle: string;
  bankName: string;
  bankTitle: string;
  bankIban: string;
  bankBranch: string;
  announcementText: string;
  maintenanceMode: boolean;
}
