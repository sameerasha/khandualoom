import { validateCouponCreation } from './couponApi';

describe('Admin Coupon Validation Engine', () => {
  it('enforces uppercase codes, positive discount value, and valid threshold', () => {
    const valid = validateCouponCreation({
      code: 'FESTIVE200',
      discountType: 'FLAT',
      value: 200,
      minOrder: 1500,
    });
    expect(valid.isValid).toBe(true);

    const invalid = validateCouponCreation({
      code: 'bad code',
      discountType: 'FLAT',
      value: -50,
      minOrder: 0,
    });
    expect(invalid.isValid).toBe(false);
    expect(invalid.error).toBeDefined();
  });
});
