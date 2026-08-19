export type UserRole = 'CUSTOMER' | 'DELIVERY_PERSON' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  profileImage?: string;
  isActive: boolean;
  createdAt: string;
}

export type ProductUnit = 'CAN' | 'TANKER';

export interface Product {
  id: string;
  name: string;
  description: string;
  capacity: string; // e.g. "20L", "1000L"
  price: number;
  deliveryCharge: number;
  image?: string;
  stock: number;
  unit: ProductUnit;
  isAvailable: boolean;
  createdAt?: string;
}

export type AddressType = 'HOME' | 'OFFICE' | 'OTHER';

export interface Address {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  houseBuilding: string;
  street: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  type: AddressType;
  latitude?: number;
  longitude?: number;
  isDefault: boolean;
}

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'ASSIGNED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'FAILED_DELIVERY';

export type PaymentMethod = 'COD' | 'UPI' | 'ONLINE';
export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product?: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  user?: User;
  addressId: string;
  address?: Address;
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  deliveryDate: string;
  deliveryTime: string;
  deliveryOtp?: string;
  items: OrderItem[];
  deliveryPersonId?: string;
  deliveryPerson?: User;
  createdAt: string;
  updatedAt: string;
}

export type SubscriptionFrequency = 'DAILY' | 'ALTERNATE_DAYS' | 'WEEKLY' | 'MONTHLY';
export type SubscriptionStatus = 'ACTIVE' | 'PAUSED' | 'CANCELLED' | 'COMPLETED';

export interface Subscription {
  id: string;
  userId: string;
  user?: User;
  productId: string;
  product?: Product;
  quantity: number;
  frequency: SubscriptionFrequency;
  startDate: string;
  endDate?: string;
  deliveryTime: string;
  addressId: string;
  address?: Address;
  status: SubscriptionStatus;
  lastGeneratedOrder?: string;
  nextDeliveryDate: string;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minOrderAmount: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  usageLimit?: number;
  isActive: boolean;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export interface InventoryItem {
  id: string;
  productId: string;
  product?: Product;
  totalStock: number;
  availableStock: number;
  damagedStock: number;
  returnedStock: number;
  updatedAt: string;
}
