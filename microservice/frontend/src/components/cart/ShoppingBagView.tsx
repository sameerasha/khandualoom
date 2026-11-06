import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BagItemCard } from './BagItemCard';
import { WeaverDonationTile } from './WeaverDonationTile';
import { AuthoritativePriceSummary } from './AuthoritativePriceSummary';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { clearCart, removeFromCart } from '@/features/cart/cartSlice';
import { calculateCartTotals } from '@/features/cart/cartCalculations';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export const ShoppingBagView: React.FC = () => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const appliedCoupon = useAppSelector((state) => state.cart.appliedCoupon);
  const donationAmount = useAppSelector((state) => state.cart.donationAmount);

  // Local state for item selection (defaults to all selected)
  const [selectedIds, setSelectedIds] = useState<number[]>(
    cartItems.map((item) => item.product.id)
  );

  const itemsWithSelection = cartItems.map((item) => ({
    ...item,
    selected: selectedIds.includes(item.product.id),
  }));

  const totals = calculateCartTotals({
    items: itemsWithSelection,
    coupon: appliedCoupon,
    donationAmount,
  });

  const handleToggleSelect = (productId: number) => {
    setSelectedIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(cartItems.map((item) => item.product.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleRemoveSelected = () => {
    for (const id of selectedIds) {
      dispatch(removeFromCart(id));
    }
    setSelectedIds([]);
  };

  const allSelected = cartItems.length > 0 && selectedIds.length === cartItems.length;

  if (cartItems.length === 0) {
    return (
      <div className="py-20 px-4 max-w-7xl mx-auto text-center">
        <div className="w-20 h-20 rounded-full bg-brand-gold/10 border border-brand-gold/25 flex items-center justify-center mx-auto mb-4 text-brand-gold">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-brand-gold">
          Your Shopping Bag is Empty
        </h1>
        <p className="text-sm text-brand-ivory/60 max-w-md mx-auto mt-2 mb-8">
          Explore our collection of authentic, handwoven Khandua Pata, Sambalpuri, and Bomkai sarees directly from Odisha artisans.
        </p>
        <Link
          to="/catalog"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-brand-gold to-brand-gold-light text-brand-purple-dark font-bold text-xs uppercase tracking-widest shadow-xl hover:shadow-[0_0_20px_rgba(197,160,89,0.5)] transition-all"
        >
          <span>Explore Sarees</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Page Title */}
      <div className="mb-6 flex items-baseline justify-between border-b border-brand-gold/15 pb-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-gold">
            Shopping Bag
          </h1>
          <p className="text-xs text-brand-ivory/60 mt-0.5">
            Authentic Handwoven Sarees • Free Insured Delivery
          </p>
        </div>
        <span className="text-xs font-semibold text-brand-gold-light">
          {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Selection Bar & Items List (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Bulk Selection Header matching Screenshot 4 */}
          <div className="p-3.5 rounded-xl bg-[#170928] border border-brand-gold/20 flex items-center justify-between text-xs font-medium">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={handleSelectAll}
                className="w-4 h-4 accent-brand-gold rounded cursor-pointer"
              />
              <span className="text-brand-ivory font-bold uppercase tracking-wider">
                {selectedIds.length}/{cartItems.length} ITEMS SELECTED
              </span>
            </label>

            <div className="flex items-center gap-4 text-xs">
              <button
                type="button"
                onClick={handleRemoveSelected}
                disabled={selectedIds.length === 0}
                className="font-bold text-brand-ivory/70 hover:text-red-400 uppercase tracking-wider disabled:opacity-40 cursor-pointer"
              >
                REMOVE
              </button>
              <button
                type="button"
                onClick={() => dispatch(clearCart())}
                className="font-bold text-brand-ivory/50 hover:text-red-400 uppercase tracking-wider cursor-pointer"
              >
                CLEAR ALL
              </button>
            </div>
          </div>

          {/* Cart Item Cards */}
          <div className="space-y-3">
            {itemsWithSelection.map((item) => (
              <BagItemCard
                key={`bag-${item.product.id}`}
                item={item}
                onToggleSelect={handleToggleSelect}
              />
            ))}
          </div>

          {/* Weaver Welfare Donation Tile */}
          <WeaverDonationTile />
        </div>

        {/* Right Column: Authoritative Price Details (5 cols) */}
        <div className="lg:col-span-5 lg:sticky lg:top-24">
          <AuthoritativePriceSummary totals={totals} />
        </div>
      </div>
    </div>
  );
};
