import { calculateCartTotals } from './cartCalculations';
import { CartItem } from '@/types';

const items: CartItem[] = [
  {
    product: {
      id: 1,
      name: 'Nuapatna Khandua Saree',
      price: 18000,
      originalPrice: 24000,
      image: '/images/khandua.jpg',
      category: 'Khandua',
      fabric: 'Silk',
      weave: 'Khandua',
      color: 'Red',
      rating: 4.8,
      reviews: 12,
      description: 'Saree description',
    },
    quantity: 1,
    selected: true,
  },
  {
    product: {
      id: 2,
      name: 'Sambalpuri Cotton Dupatta',
      price: 2000,
      originalPrice: 2500,
      image: '/images/dupatta.jpg',
      category: 'Dupatta',
      fabric: 'Cotton',
      weave: 'Sambalpuri',
      color: 'Black',
      rating: 4.5,
      reviews: 8,
      description: 'Dupatta description',
    },
    quantity: 1,
    selected: true,
  },
];

describe('Cart Calculations Engine', () => {
  it('computes MRP, product discount, coupon savings, and donation', () => {
    const totals = calculateCartTotals({
      items,
      coupon: {
        code: 'KHANDUA500',
        discountType: 'FLAT',
        value: 500,
        minOrder: 5000,
        description: 'Flat ₹500 off',
      },
      donationAmount: 50,
    });

    expect(totals.totalMrp).toBe(26500); // 24000 + 2500
    expect(totals.subtotal).toBe(20000); // 18000 + 2000
    expect(totals.discountOnMrp).toBe(6500); // 26500 - 20000
    expect(totals.couponDiscount).toBe(500);
    expect(totals.donation).toBe(50);
    expect(totals.deliveryFee).toBe(0); // free > 1999
    expect(totals.totalPayable).toBe(19550); // 20000 - 500 + 50
  });
});
