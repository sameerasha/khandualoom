import React from 'react';
import { X, Heart, Trash2, ShoppingBag } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  setWishlistOpen,
  removeFromWishlist,
} from '@/features/wishlist/wishlistSlice';
import { addToCart } from '@/features/cart/cartSlice';
import { Product } from '@/types';

interface WishlistDrawerProps {
  onSelectProduct?: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  onSelectProduct,
}) => {
  const dispatch = useAppDispatch();
  const { items, isOpen } = useAppSelector((state) => state.wishlist);

  if (!isOpen) return null;

  const handleMoveToBag = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(addToCart({ product, quantity: 1 }));
    dispatch(removeFromWishlist(product.id));
  };

  const handleProductClick = (product: Product) => {
    dispatch(setWishlistOpen(false));
    if (onSelectProduct) {
      onSelectProduct(product);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => dispatch(setWishlistOpen(false))}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-surface border-l border-border text-text-primary flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-6 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
              <h2 className="font-serif text-xl font-bold text-text-primary">
                Wishlist ({items.length})
              </h2>
            </div>
            <button
              onClick={() => dispatch(setWishlistOpen(false))}
              className="p-1 rounded-full text-text-muted hover:text-text-primary hover:bg-background-secondary transition-colors cursor-pointer"
              aria-label="Close wishlist"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-background-secondary border border-border flex items-center justify-center mx-auto text-text-muted">
                  <Heart className="w-8 h-8 opacity-60" />
                </div>
                <p className="font-serif text-lg text-text-primary">Your Wishlist is Empty</p>
                <p className="text-xs text-text-muted max-w-xs mx-auto">
                  Save Odisha handloom sarees that you love to review or buy later.
                </p>
                <button
                  onClick={() => dispatch(setWishlistOpen(false))}
                  className="mt-4 px-6 py-2.5 rounded-full bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-md transition-all cursor-pointer"
                >
                  Explore Sarees
                </button>
              </div>
            ) : (
              items.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleProductClick(product)}
                  className="flex gap-4 p-3.5 rounded-2xl bg-background-secondary border border-border hover:border-accent transition-all group cursor-pointer"
                >
                  <img
                    src={product.image || '/images/products/p1/front.jpg'}
                    alt={product.name}
                    className="w-20 h-24 object-cover rounded-xl border border-border bg-surface shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-serif text-sm font-semibold text-text-primary group-hover:text-primary transition-colors line-clamp-1">
                          {product.name}
                        </h3>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch(removeFromWishlist(product.id));
                          }}
                          className="text-text-muted hover:text-red-500 transition-colors p-1"
                          title="Remove from wishlist"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-text-muted mt-0.5">
                        ₹{product.price.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex justify-between items-center mt-3 pt-2 border-t border-border">
                      <span className="text-[10px] font-mono text-text-muted uppercase">
                        {product.weave || 'Handloom'}
                      </span>
                      <button
                        onClick={(e) => handleMoveToBag(product, e)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Move to Bag</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
