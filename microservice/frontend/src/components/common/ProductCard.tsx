import React, { useState } from 'react';
import { Star, ShoppingBag, Check, Eye } from 'lucide-react';
import { Product } from '@/types';
import { useAppDispatch } from '@/app/hooks';
import { addToCart } from '@/features/cart/cartSlice';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const dispatch = useAppDispatch();
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(addToCart({ product, quantity: 1 }));
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
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
      className="group relative bg-brand-purple-dark/80 rounded-2xl overflow-hidden border border-brand-gold/20 hover:border-brand-gold/60 transition-all duration-300 hover:shadow-2xl hover:shadow-brand-gold/10 flex flex-col cursor-pointer"
    >
      {/* Image Container with Badges */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-brand-purple">
        <img
          src={imageSrc}
          alt={product.name}
          onError={() => setImgError(true)}
          className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.badge && (
            <span className="bg-brand-crimson/90 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow">
              {product.badge}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-brand-gold text-brand-purple-dark text-[11px] font-bold px-2 py-0.5 rounded-full shadow">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Hover Quick View Trigger */}
        <div className="absolute inset-0 bg-brand-purple-dark/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product);
            }}
            className="bg-brand-ivory text-brand-purple-dark text-xs font-semibold py-2 px-4 rounded-full shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 hover:bg-brand-gold hover:text-brand-purple-dark"
          >
            <Eye className="w-3.5 h-3.5" /> Quick View
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Category & Fabric */}
          <div className="flex items-center justify-between text-xs text-brand-gold-light/70 uppercase tracking-wider mb-1.5">
            <span>{product.category}</span>
            <span>{product.fabric || 'Pure Silk'}</span>
          </div>

          {/* Title */}
          <h3 className="font-serif font-bold text-base text-brand-ivory group-hover:text-brand-gold transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="text-xs font-bold text-brand-ivory">
              {product.rating ? product.rating.toFixed(1) : '4.8'}
            </span>
            <span className="text-xs text-brand-ivory/50">
              ({product.reviews || 24})
            </span>
          </div>
        </div>

        {/* Price & Add to Cart Action */}
        <div className="mt-4 pt-3 border-t border-brand-gold/15 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-serif font-bold text-lg text-brand-gold">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-brand-ivory/40 line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className={`p-2.5 rounded-full transition-all duration-200 flex items-center justify-center ${
              added
                ? 'bg-emerald-600 text-white'
                : 'bg-brand-gold/20 text-brand-gold hover:bg-brand-gold hover:text-brand-purple-dark border border-brand-gold/30'
            }`}
            aria-label="Add to cart"
            title="Add to Cart"
          >
            {added ? (
              <Check className="w-4 h-4" />
            ) : (
              <ShoppingBag className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
