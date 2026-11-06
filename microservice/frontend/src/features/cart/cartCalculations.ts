import { CartItem } from '@/types';
import { Coupon } from './cartSlice';

export interface CartTotals {
  totalItems: number;
  totalMrp: number;
  subtotal: number;
  discountOnMrp: number;
  couponDiscount: number;
  donation: number;
  deliveryFee: number;
  totalPayable: number;
}

export interface CalculateCartParams {
  items: CartItem[];
  coupon?: Coupon | null;
  donationAmount?: number;
}

export const calculateCartTotals = ({
  items,
  coupon,
  donationAmount = 0,
}: CalculateCartParams): CartTotals => {
  const activeItems = items.filter((item) => item.selected !== false);

  let totalItems = 0;
  let totalMrp = 0;
  let subtotal = 0;

  for (const item of activeItems) {
    const qty = item.quantity || 1;
    const itemPrice = item.product.price || 0;
    const mrp = item.product.originalPrice || itemPrice;

    totalItems += qty;
    subtotal += itemPrice * qty;
    totalMrp += mrp * qty;
  }

  const discountOnMrp = Math.max(0, totalMrp - subtotal);

  // Calculate coupon discount
  let couponDiscount = 0;
  if (coupon && subtotal >= (coupon.minOrder || 0)) {
    if (coupon.discountType === 'PERCENT') {
      couponDiscount = Math.round((subtotal * coupon.value) / 100);
    } else {
      couponDiscount = coupon.value;
    }
  }

  // Cap coupon discount so total doesn't go below 0
  couponDiscount = Math.min(couponDiscount, subtotal);

  const donation = Math.max(0, donationAmount);

  // Free shipping on orders over ₹1,999
  const deliveryFee = subtotal === 0 || subtotal >= 1999 ? 0 : 150;

  const totalPayable = Math.max(0, subtotal - couponDiscount + donation + deliveryFee);

  return {
    totalItems,
    totalMrp,
    subtotal,
    discountOnMrp,
    couponDiscount,
    donation,
    deliveryFee,
    totalPayable,
  };
};
