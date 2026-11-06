import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';
import { Product } from '@/types';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { toggleWishlist } from '@/features/wishlist/wishlistSlice';

interface CatalogProductCardProps {
  product: Product;
}

export const CatalogProductCard: React.FC<CatalogProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector((state) => state.wishlist.items);
  const isWishlisted = wishlistItems.some((item) => item.id === product.id);

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleWishlist(product));
  };

  const handleCardClick = () => {
    navigate(`/products/${product.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative bg-[#170928] rounded-xl border border-brand-gold/15 overflow-hidden hover:border-brand-gold/50 hover:shadow-[0_8px_30px_rgba(197,160,89,0.18)] transition-all duration-300 cursor-pointer flex flex-col"
    >
      {/* Saree Image Showcase with Pallu Flip */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#12051E]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />

        {/* Rating Badge Overlay in Bottom-Left Corner matching Myntra benchmark */}
        <div className="absolute bottom-2.5 left-2.5 bg-black/75 backdrop-blur-md px-2 py-1 rounded flex items-center gap-1.5 text-xs font-semibold text-brand-ivory border border-white/10 shadow-md">
          <span>{product.rating ? product.rating.toFixed(1) : '4.8'}</span>
          <Star className="w-3.5 h-3.5 fill-brand-gold text-brand-gold" />
          <span className="text-brand-ivory/50">|</span>
          <span className="text-brand-ivory/70">{product.reviews || 24}</span>
        </div>

        {/* Quick Wishlist Action */}
        <button
          type="button"
          onClick={handleWishlistClick}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
            isWishlisted
              ? 'bg-rose-900/80 text-rose-400 border border-rose-500/50'
              : 'bg-black/40 text-brand-ivory/70 hover:text-rose-400 hover:bg-black/60'
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-400' : ''}`} />
        </button>

        {/* GI Tag Badge if present */}
        {product.isGiTagged && (
          <div className="absolute top-2.5 left-2.5 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded shadow">
            GI TAGGED
          </div>
        )}
      </div>

      {/* Saree Information & Pricing */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Artisan Society / Brand attribution */}
          <p className="text-[11px] font-bold uppercase tracking-wider text-brand-gold-light/90 truncate">
            {product.artisanSociety || `${product.weave || 'Heritage'} Master Atelier`}
          </p>

          {/* Saree Title */}
          <h3 className="font-serif text-sm font-semibold text-brand-ivory group-hover:text-brand-gold transition-colors line-clamp-1 mt-0.5">
            {product.name}
          </h3>

          {/* Pricing Row */}
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-base font-bold text-brand-gold">
              Rs. {product.price.toLocaleString()}
            </span>

            {product.originalPrice && product.originalPrice > product.price && (
              <>
                <span className="text-xs text-brand-ivory/50 line-through">
                  Rs. {product.originalPrice.toLocaleString()}
                </span>
                <span className="text-xs font-bold text-orange-400">
                  ({discountPercent}% OFF)
                </span>
              </>
            )}
          </div>
        </div>

        {/* Stock Urgency indicator for single-piece handloom inventory */}
        <div className="mt-2.5 pt-2 border-t border-brand-gold/10 flex items-center justify-between text-[11px]">
          {product.stock && product.stock <= 2 ? (
            <span className="text-orange-400 font-semibold tracking-wide flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-ping inline-block" />
              Only {product.stock} Left!
            </span>
          ) : (
            <span className="text-emerald-400/90 font-medium">In Stock</span>
          )}

          <span className="text-brand-ivory/50">{product.fabric || 'Pure Silk'}</span>
        </div>
      </div>
    </div>
  );
};
