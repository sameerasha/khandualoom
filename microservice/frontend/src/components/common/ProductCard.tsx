import React, { useState } from 'react';
import { Star, ShoppingBag, Check, Eye } from 'lucide-react';
import { Product } from '@/types';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { addToCart, setCartOpen } from '@/features/cart/cartSlice';

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

  const handleGoToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(setCartOpen(true));
  };

  const imageSrc =
    !imgError && product.image
      ? product.image
      : '/images/products/p1/front.jpg';

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  return (
    <div
      onClick={() => onSelect(product)}
      className="group relative bg-gradient-to-b from-[#180B28]/95 via-[#11041D]/90 to-[#0A0212]/95 rounded-2xl overflow-hidden border border-brand-gold/20 hover:border-brand-gold/60 transition-all duration-300 hover:shadow-[0_10px_30px_rgba(223,191,122,0.18)] flex flex-col cursor-pointer"
    >
      {/* Image Container with Badges & Center Action */}
      <div className="relative aspect-[3/3.8] w-full overflow-hidden bg-[#0A0210]">
        <img
          src={imageSrc}
          alt={product.name}
          onError={() => setImgError(true)}
          className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10 pointer-events-none">
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

        {/* Top Right Add to Cart Icon Button on Mobile / In-Cart Badge on Desktop */}
        <button
          onClick={isInCart ? handleGoToCart : handleAddToCart}
          className={`sm:hidden absolute top-2 right-2 z-30 w-7 h-7 rounded-full flex items-center justify-center transition-all active:scale-95 shadow-md border ${
            isInCart
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400/50'
              : 'bg-black/60 backdrop-blur-md text-brand-gold hover:text-white border-brand-gold/40'
          }`}
          aria-label={isInCart ? 'Go to Cart' : 'Add to Cart'}
          title={isInCart ? 'In Cart • Go to Cart' : 'Add to Cart'}
        >
          {isInCart ? (
            <Check className="w-3.5 h-3.5 stroke-[3] text-white" />
          ) : (
            <ShoppingBag className="w-3.5 h-3.5" />
          )}
        </button>

        {isInCart && (
          <div
            onClick={handleGoToCart}
            className="hidden sm:flex absolute top-2.5 right-2.5 z-10 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full p-1 shadow-md border border-emerald-400/40 items-center justify-center transition-transform hover:scale-110 cursor-pointer"
            title="Item in Cart • Click to View Bag"
          >
            <Check className="w-3 h-3 stroke-[3]" />
          </div>
        )}

        {/* ======================================================== */}
        {/* MIDDLE OF PRODUCT (DESKTOP ONLY HOVER OVERLAY)           */}
        {/* Completely hidden on mobile to keep saree image unblocked*/}
        {/* ======================================================== */}
        <div className="hidden sm:flex absolute inset-0 flex-col items-center justify-center p-3 z-20 transition-all duration-300 bg-black/45 opacity-0 group-hover:opacity-100 backdrop-blur-[1px]">
          {added || isInCart ? (
            <button
              onClick={handleGoToCart}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider shadow-[0_4px_20px_rgba(16,185,129,0.5)] border border-emerald-400/50 transform active:scale-95 transition-all duration-200 cursor-pointer pointer-events-auto"
              title="Click to Open Cart"
            >
              <Check className="w-4 h-4 stroke-[3] text-white" />
              <span>Go to Cart</span>
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-brand-gold via-amber-400 to-brand-gold text-brand-purple-dark text-xs font-bold uppercase tracking-wider shadow-[0_4px_20px_rgba(0,0,0,0.8),0_0_15px_rgba(223,191,122,0.4)] hover:brightness-110 active:scale-95 transition-all duration-200 cursor-pointer pointer-events-auto"
              title="Add to Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Cart</span>
            </button>
          )}

          {/* Quick View Link (Desktop hover only) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product);
            }}
            className="mt-2 text-[10px] font-mono text-brand-gold-light/90 hover:text-white flex items-center gap-1 transition-colors underline decoration-brand-gold/40 pointer-events-auto"
          >
            <Eye className="w-3 h-3" />
            <span>Quick View Details</span>
          </button>
        </div>
      </div>

      {/* Card Body - Compact & Editorial (Optimized for 2 cards per row on mobile) */}
      <div className="p-2.5 sm:p-3.5 flex flex-col flex-1 justify-between gap-1.5 sm:gap-2">
        <div>
          {/* Category & Fabric */}
          <div className="flex items-center justify-between text-[9px] sm:text-[10px] text-brand-gold/75 font-mono uppercase tracking-wider mb-1">
            <span className="truncate max-w-[55%]">{product.category}</span>
            <span className="truncate max-w-[45%] text-brand-ivory/60 text-right">{product.fabric || 'Pure Silk'}</span>
          </div>

          {/* Title */}
          <h3 className="font-serif font-bold text-xs sm:text-sm md:text-base text-brand-ivory group-hover:text-brand-gold transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-1">
            <div className="flex items-center text-amber-400">
              <Star className="w-3 h-3 fill-current" />
            </div>
            <span className="text-[11px] sm:text-xs font-bold text-brand-ivory">
              {product.rating ? product.rating.toFixed(1) : '4.8'}
            </span>
            <span className="text-[9px] sm:text-[10px] text-brand-ivory/50">
              ({product.reviews || 24})
            </span>
          </div>
        </div>

        {/* Bottom Price Row - Clean without bottom button */}
        <div className="pt-1.5 sm:pt-2 border-t border-brand-gold/15 flex items-center justify-between">
          <div className="flex items-baseline gap-1 sm:gap-1.5 flex-wrap">
            <span className="font-serif font-bold text-sm sm:text-base md:text-lg text-brand-gold tracking-tight">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[9px] sm:text-[10px] text-brand-ivory/40 line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Mobile Bottom Action: Compact Cart Button */}
          <div className="sm:hidden flex items-center">
            {isInCart ? (
              <button
                onClick={handleGoToCart}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-600 text-white text-[10px] font-mono font-bold uppercase tracking-wider border border-emerald-400/50 shadow-sm active:scale-95 cursor-pointer"
                title="Go to Cart"
              >
                <Check className="w-3 h-3 stroke-[3]" />
                <span>Cart</span>
              </button>
            ) : (
              <button
                onClick={handleAddToCart}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-brand-gold/20 hover:bg-brand-gold text-brand-gold hover:text-brand-purple-dark text-[10px] font-mono font-bold uppercase tracking-wider border border-brand-gold/40 shadow-sm active:scale-95 cursor-pointer"
                title="Add to Cart"
              >
                <ShoppingBag className="w-3 h-3" />
                <span>+Add</span>
              </button>
            )}
          </div>

          {/* Desktop Right Indicator */}
          <div className="hidden sm:flex items-center">
            {isInCart ? (
              <span
                onClick={handleGoToCart}
                className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 hover:text-emerald-300 font-bold transition-colors cursor-pointer"
                title="Click to Open Cart"
              >
                <Check className="w-3 h-3 stroke-[2.8]" />
                <span>In Cart</span>
              </span>
            ) : (
              <span className="text-[10px] font-mono text-brand-gold-light/60 uppercase tracking-wider">
                {product.fabric || 'Pure Silk'}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
