export interface ProductImage {
  imageUrl: string;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: ProductImage[];
  description: string;
  fabric: string;
  weave: string;
  color: string;
  rating: number;
  reviews: number;
  badge?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: 'ROLE_USER' | 'ROLE_ADMIN' | 'ROLE_SUPER_ADMIN';
  emailVerified: boolean;
  phoneVerified: boolean;
  avatarUrl?: string;
}

export interface Address {
  id?: number;
  addressType: 'HOME' | 'WORK' | 'OTHER';
  fullName: string;
  streetAddress: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  phone: string;
  isPrimary: boolean;
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productImage?: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  userId?: number;
  orderTrackingNumber?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city?: string;
  state?: string;
  pincode?: string;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus?: string;
  orderStatus?: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | string;
  status?: string;
  createdDate?: string;
  items?: OrderItem[];
  orderItems?: OrderItem[];
}
