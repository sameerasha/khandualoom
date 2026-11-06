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
      {/* Coupons Section matching Screenshot 4 */}
      {features.coupons && (
        <div className="p-4 rounded-xl bg-[#170928] border border-brand-gold/20">
          <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-brand-gold">
            <Tag className="w-4 h-4" />
            <span>APPLY PROMO COUPON</span>
          </div>

          {appliedCoupon ? (
            <div className="flex items-center justify-between p-2.5 rounded bg-emerald-950/40 border border-emerald-500/30 text-xs">
              <div className="flex items-center gap-2 text-emerald-300 font-medium">
                <Check className="w-4 h-4" />
                <span>
                  Code <strong>{appliedCoupon.code}</strong> applied (-₹{totals.couponDiscount})
                </span>
              </div>
              <button
                type="button"
                onClick={() => dispatch(removeCoupon())}
                className="text-[11px] font-bold text-red-400 hover:text-red-300 uppercase cursor-pointer"
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
                className="flex-1 bg-[#1A0A2C] border border-brand-gold/25 rounded px-3 py-2 text-xs text-brand-ivory placeholder-brand-ivory/40 uppercase font-mono focus:outline-none focus:border-brand-gold"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-brand-gold text-brand-purple-dark font-bold text-xs uppercase tracking-wider rounded hover:bg-brand-gold-light transition-colors cursor-pointer"
              >
                Apply
              </button>
            </form>
          )}

          {couponError && (
            <p className="text-[11px] text-rose-400 mt-2 font-medium">{couponError}</p>
          )}
        </div>
      )}

      {/* PRICE DETAILS Breakdown Card matching Screenshot 4 */}
      <div className="p-5 rounded-xl bg-[#170928] border border-brand-gold/20 text-xs space-y-3.5">
        <h3 className="font-bold uppercase tracking-wider text-brand-gold text-xs border-b border-brand-gold/15 pb-2.5">
          PRICE DETAILS ({totals.totalItems} {totals.totalItems === 1 ? 'Item' : 'Items'})
        </h3>

        <div className="flex justify-between text-brand-ivory/80">
          <span>Total MRP</span>
          <span>₹{totals.totalMrp.toLocaleString()}</span>
        </div>

        <div className="flex justify-between text-brand-ivory/80">
          <span>Discount on MRP</span>
          <span className="text-emerald-400 font-semibold">
            - ₹{totals.discountOnMrp.toLocaleString()}
          </span>
        </div>

        {totals.couponDiscount > 0 && (
          <div className="flex justify-between text-brand-ivory/80">
            <span>Coupon Discount</span>
            <span className="text-emerald-400 font-semibold">
              - ₹{totals.couponDiscount.toLocaleString()}
            </span>
          </div>
        )}

        {totals.donation > 0 && (
          <div className="flex justify-between text-brand-ivory/80">
            <span>Weaver Welfare Contribution</span>
            <span className="text-rose-300 font-semibold">+ ₹{totals.donation}</span>
          </div>
        )}

        <div className="flex justify-between text-brand-ivory/80">
          <span>Delivery Fee</span>
          {totals.deliveryFee === 0 ? (
            <span className="text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
              FREE
            </span>
          ) : (
            <span>₹{totals.deliveryFee}</span>
          )}
        </div>

        {/* Divider & Total Amount */}
        <div className="pt-3 border-t border-brand-gold/20 flex justify-between items-baseline">
          <span className="font-bold text-sm text-brand-ivory">Total Amount</span>
          <span className="font-extrabold text-lg text-brand-gold">
            ₹{totals.totalPayable.toLocaleString()}
          </span>
        </div>

        <p className="text-[10px] text-brand-ivory/50 leading-relaxed pt-1">
          By placing your order, you agree to Khandua Looms's Authenticity Guarantee, Terms of Service, and Privacy Policy.
        </p>

        {/* Primary PLACE ORDER Action Button */}
        <button
          type="button"
          disabled={totals.totalItems === 0}
          onClick={() => navigate('/checkout')}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-rose-600 via-rose-700 to-rose-800 hover:from-rose-500 hover:to-rose-700 text-white font-bold text-sm uppercase tracking-wider shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border border-rose-400/40"
        >
          <span>PLACE ORDER</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-brand-ivory/60 pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Safe & Secure 256-Bit Encrypted Payments</span>
        </div>
      </div>
    </div>
  );
};
