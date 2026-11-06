import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { applyCoupon, removeCoupon, Coupon } from '@/features/cart/cartSlice';
import { CartTotals } from '@/features/cart/cartCalculations';

interface AuthoritativePriceSummaryProps {
  totals: CartTotals;
}

const promoCoupons: Coupon[] = [
  { code: 'KHANDUA500', discountType: 'FLAT', value: 500, minOrder: 4999, description: 'Flat ₹500 off' },
  { code: 'HERITAGE10', discountType: 'PERCENT', value: 10, minOrder: 2999, description: '10% off traditional weaves' },
  { code: 'PATA1000', discountType: 'FLAT', value: 1000, minOrder: 9999, description: 'Flat ₹1,000 off bridal sarees' },
];

export const AuthoritativePriceSummary: React.FC<AuthoritativePriceSummaryProps> = ({ totals }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const appliedCoupon = useAppSelector((state) => state.cart.appliedCoupon);
  const features = useAppSelector((state) => state.features.features);
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);

  const handleApplyInput = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    const code = couponInput.trim().toUpperCase();
    const matched = promoCoupons.find((c) => c.code === code);

    if (!matched) {
      setCouponError('Invalid coupon code. Try KHANDUA500 or HERITAGE10');
      return;
    }

    if (totals.subtotal < (matched.minOrder || 0)) {
      setCouponError(`Requires minimum order of ₹${matched.minOrder?.toLocaleString()}`);
      return;
    }

    dispatch(applyCoupon(matched));
    setCouponInput('');
  };

  return (
    <div className="space-y-6">
      {/* Coupons Section */}
      {features.coupons && (
        <div className="p-4 rounded-xl bg-surface border border-border shadow-xs">
          <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-accent">
            <Tag className="w-4 h-4" />
            <span>APPLY PROMO COUPON</span>
          </div>

          {appliedCoupon ? (
            <div className="flex items-center justify-between p-2.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-xs">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-medium">
                <Check className="w-4 h-4" />
                <span>
                  Code <strong>{appliedCoupon.code}</strong> applied (-₹{totals.couponDiscount})
                </span>
              </div>
              <button
                type="button"
                onClick={() => dispatch(removeCoupon())}
                className="text-[11px] font-bold text-red-500 hover:text-red-400 uppercase cursor-pointer"
              >
                Remove
              </button>
            </div>
          ) : (
            <form onSubmit={handleApplyInput} className="flex gap-2">
              <input
                type="text"
                placeholder="Enter coupon code (e.g. KHANDUA500)"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                className="flex-1 bg-input-background border border-input-border rounded px-3 py-2 text-xs text-text-primary placeholder-text-muted uppercase font-mono focus:outline-none focus:border-accent"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-primary hover:bg-primary-hover text-white font-bold text-xs uppercase tracking-wider rounded transition-colors cursor-pointer"
              >
                Apply
              </button>
            </form>
          )}

          {couponError && (
            <p className="text-[11px] text-rose-500 mt-2 font-medium">{couponError}</p>
          )}
        </div>
      )}

      {/* PRICE DETAILS Breakdown Card */}
      <div className="p-5 rounded-xl bg-surface border border-border text-xs space-y-3.5 shadow-xs">
        <h3 className="font-bold uppercase tracking-wider text-text-primary text-xs border-b border-border pb-2.5">
          PRICE DETAILS ({totals.totalItems} {totals.totalItems === 1 ? 'Item' : 'Items'})
        </h3>

        <div className="flex justify-between text-text-secondary">
          <span>Total MRP</span>
          <span>₹{totals.totalMrp.toLocaleString()}</span>
        </div>

        <div className="flex justify-between text-text-secondary">
          <span>Discount on MRP</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
            - ₹{totals.discountOnMrp.toLocaleString()}
          </span>
        </div>

        {totals.couponDiscount > 0 && (
          <div className="flex justify-between text-text-secondary">
            <span>Coupon Discount</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
              - ₹{totals.couponDiscount.toLocaleString()}
            </span>
          </div>
        )}

        {totals.donation > 0 && (
          <div className="flex justify-between text-rose-600 dark:text-rose-400">
            <span>Weaver Welfare Contribution</span>
            <span>+ ₹{totals.donation}</span>
          </div>
        )}

        <div className="flex justify-between text-text-secondary">
          <span>Delivery Fee</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">
            {totals.deliveryFee === 0 ? 'FREE' : `₹${totals.deliveryFee}`}
          </span>
        </div>

        {/* Total Payable Row */}
        <div className="pt-3 border-t border-border flex justify-between items-baseline font-bold text-sm">
          <span className="text-text-primary">Total Amount</span>
          <span className="text-lg font-mono text-text-primary">
            ₹{totals.totalPayable.toLocaleString()}
          </span>
        </div>

        {/* Savings Callout */}
        {totals.discountOnMrp + totals.couponDiscount > 0 && (
          <div className="p-2.5 rounded bg-emerald-500/10 border border-emerald-500/25 text-[11px] text-emerald-700 dark:text-emerald-300 font-semibold text-center">
            You will save ₹{(totals.discountOnMrp + totals.couponDiscount).toLocaleString()} on this order!
          </div>
        )}

        {/* Place Order CTA */}
        <button
          type="button"
          disabled={totals.totalItems === 0}
          onClick={() => navigate('/checkout')}
          className="w-full mt-2 py-4 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs uppercase tracking-widest shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span>PLACE ORDER</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {/* Trust Badges */}
        <div className="pt-2 flex items-center justify-center gap-2 text-[10px] text-text-muted">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>100% Genuine Handlooms • Encrypted Checkout</span>
        </div>
      </div>
    </div>
  );
};
