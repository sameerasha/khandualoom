import React, { useState } from 'react';
import { Tag, Check, Sparkles } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { applyCoupon, Coupon } from '@/features/cart/cartSlice';

const availableCoupons: Coupon[] = [
  {
    code: 'KHANDUA500',
    discountType: 'FLAT',
    value: 500,
    minOrder: 4999,
    description: 'Flat ₹500 OFF on authentic handloom sarees above ₹4,999',
  },
  {
    code: 'HERITAGE10',
    discountType: 'PERCENT',
    value: 10,
    minOrder: 2999,
    description: '10% Instant Savings across all traditional weaves',
  },
  {
    code: 'PATA1000',
    discountType: 'FLAT',
    value: 1000,
    minOrder: 9999,
    description: 'Flat ₹1,000 OFF on Bridal Nuapatna & Khandua Pata',
  },
];

export const CouponsCorner: React.FC = () => {
  const dispatch = useAppDispatch();
  const appliedCoupon = useAppSelector((state) => state.cart.appliedCoupon);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleApply = (coupon: Coupon) => {
    dispatch(applyCoupon(coupon));
    setCopiedCode(coupon.code);
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(coupon.code).catch(() => {});
    }
    setTimeout(() => setCopiedCode(null), 3000);
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/25 text-brand-gold text-xs font-medium uppercase tracking-widest mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Exclusive Handloom Savings</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl text-brand-gold font-normal">
          Coupons Corner
        </h2>
        <p className="text-sm text-brand-ivory/70 mt-1">
          Apply during checkout or click to auto-apply to your bag
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {availableCoupons.map((coupon) => {
          const isApplied = appliedCoupon?.code === coupon.code || copiedCode === coupon.code;

          return (
            <div
              key={coupon.code}
              className="relative rounded-xl border border-brand-gold/20 bg-gradient-to-br from-[#1C0D2E] to-[#12051E] p-6 shadow-lg hover:border-brand-gold/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-brand-gold">
                    <Tag className="w-4 h-4" />
                    <span className="text-xs uppercase font-bold tracking-wider">
                      {coupon.discountType === 'FLAT' ? `FLAT ₹${coupon.value} OFF*` : `${coupon.value}% OFF*`}
                    </span>
                  </div>
                  <span className="text-[11px] text-brand-ivory/50">Min. ₹{coupon.minOrder}</span>
                </div>

                <p className="text-sm text-brand-ivory/90 font-medium mb-4">
                  {coupon.description}
                </p>
              </div>

              <div className="pt-3 border-t border-brand-gold/15 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-brand-gold-light/60 uppercase tracking-wider block">
                    Voucher Code
                  </span>
                  <span className="font-mono text-sm font-bold text-brand-gold tracking-wider">
                    {coupon.code}
                  </span>
                </div>

                <button
                  type="button"
                  aria-label={`USE CODE: ${coupon.code}`}
                  onClick={() => handleApply(coupon)}
                  className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                    isApplied
                      ? 'bg-emerald-600/80 text-white border border-emerald-400'
                      : 'bg-brand-gold text-brand-purple-dark hover:bg-brand-gold-light'
                  }`}
                >
                  {isApplied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>APPLIED</span>
                    </>
                  ) : (
                    <span>USE CODE: {coupon.code}</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
