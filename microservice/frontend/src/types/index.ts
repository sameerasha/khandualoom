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
  images?: Array<string | ProductImage>;
  description: string;
  fabric: string;
  weave: string;
  color: string;
  rating: number;
  reviews: number;
  badge?: string;
  stock?: number;
  weaveType?: string;
  isGiTagged?: boolean;
  occasion?: string;
  artisanSociety?: string;
  sareeLength?: string;
  blouseIncluded?: boolean;
  silkMarkCertified?: boolean;
  craftmarkCertified?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selected?: boolean;
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
  addresses?: Address[];
}

export interface Address {
  id?: number;
  addressType: 'HOME' | 'OFFICE' | 'OTHER' | string;
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
