import React from 'react';
import { HeartHandshake } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { setDonationAmount } from '@/features/cart/cartSlice';

const donationPills = [10, 20, 50, 100];

export const WeaverDonationTile: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentDonation = useAppSelector((state) => state.cart.donationAmount);

  const handlePillClick = (amount: number) => {
    if (currentDonation === amount) {
      dispatch(setDonationAmount(0));
    } else {
      dispatch(setDonationAmount(amount));
    }
  };

  return (
    <div className="p-4 rounded-xl bg-[#1A0A2C] border border-brand-gold/20 mb-6">
      <div className="flex items-center gap-2 mb-2">
        <HeartHandshake className="w-4 h-4 text-rose-400" />
        <span className="font-bold text-xs uppercase tracking-wider text-brand-gold-light">
          SUPPORT ODISHA HANDLOOM WEAVERS WELFARE
        </span>
      </div>

      <p className="text-xs text-brand-ivory/70 mb-3">
        Contribute directly to yarn subsidies and medical aid for master artisan families in Nuapatna and Bargarh.
      </p>

      <div className="flex items-center gap-2">
        {donationPills.map((amount) => {
          const isSelected = currentDonation === amount;
          return (
            <button
              key={amount}
              type="button"
              onClick={() => handlePillClick(amount)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-rose-600 text-white border border-rose-400 shadow-md'
                  : 'bg-[#140622] text-brand-gold border border-brand-gold/25 hover:bg-brand-gold/15'
              }`}
            >
              ₹{amount}
            </button>
          );
        })}

        {currentDonation > 0 && (
          <span className="text-xs text-emerald-400 font-semibold ml-2">
            +₹{currentDonation} added to bag
          </span>
        )}
      </div>
    </div>
  );
};
