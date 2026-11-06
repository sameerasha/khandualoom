import React from 'react';
import { Tag } from 'lucide-react';
import { useAppDispatch } from '@/app/hooks';
import { setCartOpen } from '@/features/cart/cartSlice';

export const StickyDiscountTab: React.FC = () => {
  const dispatch = useAppDispatch();

  return (
    <button
      type="button"
      onClick={() => dispatch(setCartOpen(true))}
      className="fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-gradient-to-l from-brand-gold via-brand-gold-light to-brand-gold text-brand-purple-dark px-2.5 py-4 rounded-l-lg shadow-2xl hover:px-3.5 transition-all flex flex-col items-center gap-2 group cursor-pointer border-y border-l border-brand-gold-light"
      aria-label="View Handloom Coupons - Flat ₹500 Off"
    >
      <Tag className="w-4 h-4 text-brand-purple-dark group-hover:rotate-12 transition-transform" />
      <span className="[writing-mode:vertical-rl] font-bold text-xs uppercase tracking-widest text-brand-purple-dark">
        FLAT ₹500 OFF
      </span>
    </button>
  );
};
