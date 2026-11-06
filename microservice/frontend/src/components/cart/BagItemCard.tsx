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
    <div className="relative p-4 rounded-xl bg-[#170928] border border-brand-gold/20 flex gap-4 transition-all">
      {/* Checkbox selector */}
      <div className="pt-1">
        <input
          type="checkbox"
          checked={item.selected !== false}
          onChange={() => onToggleSelect(product.id)}
          className="w-4 h-4 accent-brand-gold rounded cursor-pointer"
        />
      </div>

      {/* Saree Thumbnail */}
      <div className="w-24 h-32 sm:w-28 sm:h-36 rounded-lg overflow-hidden bg-[#12051E] shrink-0 border border-brand-gold/15">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-top"
        />
      </div>

      {/* Item Details matching Myntra benchmark */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start gap-2">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-brand-gold-light truncate">
                Sold by: {product.artisanSociety || 'Nuapatna Master Weavers Co-op'}
              </p>
              <h3 className="font-serif text-sm font-semibold text-brand-ivory mt-0.5 line-clamp-1">
                {product.name}
              </h3>
            </div>

            {/* Remove (X) Button */}
            <button
              type="button"
              onClick={() => dispatch(removeFromCart(product.id))}
              aria-label={`Remove ${product.name} from bag`}
              className="text-brand-ivory/50 hover:text-brand-ivory p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Saree specs & quantity */}
          <div className="flex items-center gap-4 mt-2 text-xs text-brand-ivory/70">
            <span className="bg-[#1D0C30] px-2 py-0.5 rounded border border-brand-gold/15 text-[11px]">
              Size: 5.5m Standard
            </span>

            <div className="flex items-center gap-1.5">
              <span>Qty:</span>
              <select
                value={item.quantity}
                onChange={(e) =>
                  dispatch(updateQuantity({ productId: product.id, quantity: Number(e.target.value) }))
                }
                className="bg-[#1D0C30] border border-brand-gold/25 rounded px-1.5 py-0.5 text-xs text-brand-gold focus:outline-none"
              >
                {[1, 2, 3, 4, 5].map((q) => (
                  <option key={q} value={q}>
                    {q}
                  </option>
                ))}
              </select>
            </div>

            {product.stock && product.stock <= 2 && (
              <span className="text-orange-400 font-semibold text-[11px]">
                {product.stock} left in stock
              </span>
            )}
          </div>

          {/* Pricing Row */}
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-base font-bold text-brand-gold">
              ₹{(product.price * item.quantity).toLocaleString()}
            </span>

            {product.originalPrice && product.originalPrice > product.price && (
              <>
                <span className="text-xs text-brand-ivory/50 line-through">
                  ₹{(product.originalPrice * item.quantity).toLocaleString()}
                </span>
                <span className="text-xs font-bold text-orange-400">
                  ({discountPercent}% OFF)
                </span>
              </>
            )}
          </div>
        </div>

        {/* Bottom guarantee & Move to Wishlist */}
        <div className="mt-3 pt-2.5 border-t border-brand-gold/10 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-brand-ivory/60 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>7 days return & exchange available</span>
          </div>

          <button
            type="button"
            onClick={handleMoveToWishlist}
            className="text-[11px] font-semibold text-brand-gold hover:text-brand-gold-light flex items-center gap-1 cursor-pointer"
          >
            <Heart className="w-3 h-3" />
            <span>Move to Wishlist</span>
          </button>
        </div>
      </div>
    </div>
  );
};
