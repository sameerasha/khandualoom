import React from 'react';
import { CartItem } from '@/types';
import { useAppDispatch } from '@/app/hooks';
import { removeFromCart, updateQuantity } from '@/features/cart/cartSlice';
import { toggleWishlist } from '@/features/wishlist/wishlistSlice';
import { X, Heart, ShieldCheck } from 'lucide-react';

interface BagItemCardProps {
  item: CartItem;
  onToggleSelect: (productId: number) => void;
}

export const BagItemCard: React.FC<BagItemCardProps> = ({ item, onToggleSelect }) => {
  const dispatch = useAppDispatch();
  const product = item.product;

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const handleMoveToWishlist = () => {
    dispatch(toggleWishlist(product));
    dispatch(removeFromCart(product.id));
  };

  return (
    <div className="relative p-4 rounded-xl bg-surface border border-border flex gap-4 transition-all shadow-xs">
      {/* Checkbox selector */}
      <div className="pt-1">
        <input
          type="checkbox"
          checked={item.selected !== false}
          onChange={() => onToggleSelect(product.id)}
          className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
        />
      </div>

      {/* Saree Thumbnail */}
      <div className="w-24 h-32 sm:w-28 sm:h-36 rounded-lg overflow-hidden bg-background-secondary shrink-0 border border-border">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-top"
        />
      </div>

      {/* Item Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start gap-2">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-accent truncate">
                Sold by: {product.artisanSociety || 'Nuapatna Master Weavers Co-op'}
              </p>
              <h3 className="font-serif text-sm font-semibold text-text-primary mt-0.5 line-clamp-1">
                {product.name}
              </h3>
            </div>

            {/* Remove from bag button */}
            <button
              type="button"
              onClick={() => dispatch(removeFromCart(product.id))}
              className="text-text-muted hover:text-red-500 p-1 transition-colors cursor-pointer"
              title="Remove Item"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Pricing Row */}
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-base font-bold text-text-primary">
              ₹{(product.price * item.quantity).toLocaleString()}
            </span>

            {product.originalPrice && (
              <>
                <span className="text-xs text-text-muted line-through">
                  ₹{(product.originalPrice * item.quantity).toLocaleString()}
                </span>
                <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                  {discountPercent}% OFF
                </span>
              </>
            )}
          </div>

          <div className="mt-1 flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>14-day easy return policy & Silk Mark certified</span>
          </div>
        </div>

        {/* Bottom Actions: Quantity Selector & Move to Wishlist */}
        <div className="pt-3 mt-2 border-t border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-muted">Qty:</span>
            <select
              value={item.quantity}
              onChange={(e) =>
                dispatch(updateQuantity({ productId: product.id, quantity: Number(e.target.value) }))
              }
              className="bg-input-background border border-input-border text-text-primary text-xs rounded px-2 py-1 focus:outline-none focus:border-accent cursor-pointer"
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handleMoveToWishlist}
            className="flex items-center gap-1 text-xs text-text-muted hover:text-rose-500 transition-colors font-medium cursor-pointer"
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Move to Wishlist</span>
          </button>
        </div>
      </div>
    </div>
  );
};
