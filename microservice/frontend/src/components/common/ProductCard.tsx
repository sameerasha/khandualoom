import React, { useState } from 'react';
import { Star, ShoppingBag, Check, Eye } from 'lucide-react';
import { Product } from '@/types';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { addToCart } from '@/features/cart/cartSlice';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.cart);
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Check if this item is currently in the cart
  const cartItem = items.find((item) => item.product.id === product.id);
  const isInCart = Boolean(cartItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(addToCart({ product, quantity: 1 }));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const imageSrc =
    !imgError && product.image
      ? product.image
      : '/images/saree_crimson_red.png';

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  return (
    <div
      onClick={() => onSelect(product)}
      className="group relative bg-gradient-to-b from-[#180B28]/95 via-[#11041D]/90 to-[#0A0212]/95 rounded-2xl overflow-hidden border border-brand-gold/20 hover:border-brand-gold/60 transition-all duration-300 hover:shadow-[0_10px_30px_rgba(223,191,122,0.18)] flex flex-col cursor-pointer"
    >
      {/* Image Container with Badges */}
      <div className="relative aspect-[3/3.8] w-full overflow-hidden bg-[#0A0210]">
        <img
          src={imageSrc}
          alt={product.name}
          onError={() => setImgError(true)}
          className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.badge && (
            <span className="bg-brand-crimson/95 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
              {product.badge}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-brand-gold text-brand-purple-dark text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm w-fit">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Hover Quick View Trigger */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product);
            }}
            className="bg-brand-ivory text-brand-purple-dark text-xs font-semibold py-1.5 px-3.5 rounded-full shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 hover:bg-brand-gold hover:text-brand-purple-dark"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Card Body - Compact & Editorial */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between gap-2.5">
        <div>
          {/* Category & Fabric */}
          <div className="flex items-center justify-between text-[10px] text-brand-gold/75 font-mono uppercase tracking-wider mb-1">
            <span className="truncate max-w-[55%]">{product.category}</span>
            <span className="truncate max-w-[45%] text-brand-ivory/60 text-right">{product.fabric || 'Pure Silk'}</span>
          </div>

          {/* Title */}
          <h3 className="font-serif font-bold text-sm sm:text-base text-brand-ivory group-hover:text-brand-gold transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-1">
            <div className="flex items-center text-amber-400">
              <Star className="w-3 h-3 fill-current" />
            </div>
            <span className="text-xs font-bold text-brand-ivory">
              {product.rating ? product.rating.toFixed(1) : '4.8'}
            </span>
            <span className="text-[10px] text-brand-ivory/50">
              ({product.reviews || 24})
            </span>
          </div>
        </div>

        {/* Price & Add to Cart Action */}
        <div className="pt-2 border-t border-brand-gold/15 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="font-serif font-bold text-base sm:text-lg text-brand-gold tracking-tight">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-[10px] text-brand-ivory/40 line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
          </div>

          {/* Add to Cart Button with Green Right Mark */}
          {added || isInCart ? (
            <button
              onClick={handleAddToCart}
              className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/90 hover:bg-emerald-600 text-white text-[11px] font-bold uppercase tracking-wider shadow-[0_2px_10px_rgba(16,185,129,0.3)] border border-emerald-400/40 transition-all active:scale-95 cursor-pointer"
              aria-label="Item in cart"
              title="Added to Cart"
            >
              <Check className="w-3.5 h-3.5 stroke-[2.8]" />
              <span>{added ? 'Added' : cartItem?.quantity && cartItem.quantity > 1 ? `In Bag (${cartItem.quantity})` : 'In Bag'}</span>
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-brand-gold/20 via-brand-gold/10 to-transparent hover:bg-brand-gold text-brand-gold hover:text-brand-purple-dark text-[11px] font-bold uppercase tracking-wider border border-brand-gold/40 hover:border-brand-gold transition-all duration-200 active:scale-95 shadow-sm group/btn cursor-pointer"
              aria-label="Add to cart"
              title="Add to Cart"
            >
              <ShoppingBag className="w-3.5 h-3.5 transition-transform group-hover/btn:scale-110" />
              <span>Add to Cart</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
