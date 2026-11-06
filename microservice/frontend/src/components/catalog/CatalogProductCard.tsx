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
      className="group relative bg-white rounded-2xl border border-gray-200/90 overflow-hidden hover:border-brand-gold hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
    >
      {/* Saree Image Showcase */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />

        {/* Rating Badge Overlay in Bottom-Left Corner */}
        <div className="absolute bottom-2.5 left-2.5 bg-white/95 backdrop-blur-md px-2 py-1 rounded-md flex items-center gap-1.5 text-xs font-semibold text-gray-900 border border-gray-200 shadow-sm">
          <span>{product.rating ? product.rating.toFixed(1) : '4.8'}</span>
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="text-gray-300">|</span>
          <span className="text-gray-600">{product.reviews || 24}</span>
        </div>

        {/* Quick Wishlist Action */}
        <button
          type="button"
          onClick={handleWishlistClick}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer shadow-sm ${
            isWishlisted
              ? 'bg-rose-50 text-rose-600 border border-rose-200'
              : 'bg-white/80 text-gray-600 hover:text-rose-600 hover:bg-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600 text-rose-600' : ''}`} />
        </button>

        {/* GI Tag Badge if present */}
        {product.isGiTagged && (
          <div className="absolute top-2.5 left-2.5 bg-emerald-600 text-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded shadow-sm">
            GI Tagged
          </div>
        )}
      </div>

      {/* Saree Information & Pricing */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Artisan Society / Brand attribution */}
          <p className="text-[11px] font-bold uppercase tracking-wider text-amber-700 truncate">
            {product.artisanSociety || `${product.weave || 'Traditional'} Weavers`}
          </p>

          {/* Saree Title */}
          <h3 className="font-serif text-sm font-semibold text-gray-900 group-hover:text-brand-purple transition-colors line-clamp-1 mt-0.5">
            {product.name}
          </h3>

          {/* Pricing Row */}
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-base font-bold text-gray-900">
              ₹{product.price.toLocaleString()}
            </span>

            {product.originalPrice && product.originalPrice > product.price && (
              <>
                <span className="text-xs text-gray-400 line-through">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
                <span className="text-xs font-bold text-rose-600">
                  ({discountPercent}% OFF)
                </span>
              </>
            )}
          </div>
        </div>

        {/* Stock status indicator */}
        <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
          {product.stock && product.stock <= 2 ? (
            <span className="text-amber-700 font-semibold tracking-wide flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
              Only {product.stock} Left!
            </span>
          ) : (
            <span className="text-emerald-700 font-medium">In Stock</span>
          )}

          <span className="text-gray-500">{product.fabric || 'Pure Silk'}</span>
        </div>
      </div>
    </div>
  );
};
