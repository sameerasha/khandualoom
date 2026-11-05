import React from 'react';
import { X, Trash2, ShoppingBag, Heart, ArrowRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  setWishlistOpen,
  removeFromWishlist,
  clearWishlist,
  selectWishlistItems,
  selectWishlistOpen,
} from '@/features/wishlist/wishlistSlice';
import { addToCart, setCartOpen } from '@/features/cart/cartSlice';
import { Product } from '@/types';

interface WishlistDrawerProps {
  onSelectProduct?: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({ onSelectProduct }) => {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectWishlistItems);
  const isOpen = useAppSelector(selectWishlistOpen);

  if (!isOpen) return null;

  const handleMoveToCart = (product: Product) => {
    dispatch(addToCart({ product, quantity: 1 }));
    dispatch(removeFromWishlist(product.id));
    dispatch(setWishlistOpen(false));
    dispatch(setCartOpen(true));
  };

  const handleSelect = (product: Product) => {
    dispatch(setWishlistOpen(false));
    onSelectProduct?.(product);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/65 backdrop-blur-sm transition-opacity"
        onClick={() => dispatch(setWishlistOpen(false))}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-gradient-to-b from-[#180B28] via-[#12051E] to-[#0A0212] border-l border-brand-gold/30 text-brand-ivory flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-6 border-b border-brand-gold/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-brand-gold fill-brand-gold" />
              <h2 className="font-serif text-xl font-bold text-brand-ivory">
                Saved Masterpieces ({items.length})
              </h2>
            </div>
            <button
              onClick={() => dispatch(setWishlistOpen(false))}
              className="p-1 rounded-full text-brand-gold hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close wishlist"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-brand-purple/60 border border-brand-gold/20 flex items-center justify-center mx-auto text-brand-gold">
                  <Heart className="w-8 h-8 opacity-60" />
                </div>
                <p className="font-serif text-lg text-brand-ivory">Your Wishlist is Empty</p>
                <p className="text-xs text-brand-ivory/60 max-w-xs mx-auto">
                  Bookmark Odisha handloom sarees that captivate your senses to review or purchase later.
                </p>
                <button
                  onClick={() => dispatch(setWishlistOpen(false))}
                  className="mt-4 px-6 py-2.5 rounded-full bg-gradient-to-r from-brand-gold to-brand-gold-dark text-brand-purple-dark text-xs font-bold hover:brightness-110 shadow-md transition-all cursor-pointer"
                >
                  Explore Collections
                </button>
              </div>
            ) : (
              items.map((product) => (
                <div
                  key={product.id}
                  className="flex gap-4 p-3.5 rounded-2xl bg-white/5 border border-brand-gold/20 hover:border-brand-gold/50 transition-all group"
                >
                  <img
                    src={product.image || '/images/products/p1/front.jpg'}
                    alt={product.name}
                    onClick={() => handleSelect(product)}
                    className="w-20 h-24 object-cover object-top rounded-xl border border-brand-gold/20 shrink-0 cursor-pointer group-hover:scale-105 transition-transform"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[10px] text-brand-gold/80 font-mono uppercase tracking-wider mb-0.5">
                        <span className="truncate max-w-[120px]">{product.category}</span>
                        <span className="text-brand-ivory/50">{product.fabric || 'Pure Silk'}</span>
                      </div>
                      <h3
                        onClick={() => handleSelect(product)}
                        className="font-serif text-sm font-bold text-brand-ivory hover:text-brand-gold transition-colors line-clamp-1 cursor-pointer"
                      >
                        {product.name}
                      </h3>
                      <p className="font-serif text-sm font-bold text-brand-gold mt-1">
                        ₹{product.price.toLocaleString('en-IN')}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-brand-gold/10 mt-2">
                      <button
                        onClick={() => handleMoveToCart(product)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-brand-gold to-amber-400 text-brand-purple-dark text-[11px] font-bold tracking-wider hover:brightness-110 shadow transition-all cursor-pointer"
                        title="Move to Bag"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Move to Bag</span>
                      </button>
                      <button
                        onClick={() => dispatch(removeFromWishlist(product.id))}
                        className="p-1.5 text-brand-ivory/50 hover:text-brand-crimson transition-colors rounded-lg hover:bg-white/5 cursor-pointer"
                        title="Remove from Wishlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer if items exist */}
          {items.length > 0 && (
            <div className="p-6 border-t border-brand-gold/20 bg-brand-purple-dark/80 flex items-center justify-between">
              <button
                onClick={() => dispatch(clearWishlist())}
                className="text-xs text-brand-ivory/50 hover:text-brand-crimson underline transition-colors cursor-pointer"
              >
                Clear All Saved
              </button>
              <button
                onClick={() => {
                  // Move all items to cart
                  items.forEach((item) => {
                    dispatch(addToCart({ product: item, quantity: 1 }));
                  });
                  dispatch(clearWishlist());
                  dispatch(setWishlistOpen(false));
                  dispatch(setCartOpen(true));
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-brand-gold hover:bg-brand-gold-light text-brand-purple-dark text-xs font-bold uppercase tracking-wider shadow-lg hover:brightness-110 transition-all cursor-pointer"
              >
                <span>Move All to Bag</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
