import React, { useState } from 'react';
import { X, Star, ShoppingBag, ShieldCheck, Truck, RotateCcw, Check } from 'lucide-react';
import { Product } from '@/types';
import { useAppDispatch } from '@/app/hooks';
import { addToCart } from '@/features/cart/cartSlice';

interface ProductDetailsProps {
  product: Product;
  onClose: () => void;
  onProceedToCheckout?: () => void;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({
  product,
  onClose,
  onProceedToCheckout,
}) => {
  const dispatch = useAppDispatch();
  const [selectedQty, setSelectedQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeImage, setActiveImage] = useState(product.image || '/images/saree_crimson_red.png');

  const galleryImages = [
    product.image || '/images/saree_crimson_red.png',
    '/images/saree_master_pallu.png',
    '/images/saree_master_border.png',
    '/images/saree_master_back.png',
  ];

  const handleAdd = () => {
    dispatch(addToCart({ product, quantity: selectedQty }));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    dispatch(addToCart({ product, quantity: selectedQty }));
    onClose();
    onProceedToCheckout?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-black/75 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-brand-purple-dark border border-brand-gold/30 rounded-3xl overflow-hidden shadow-2xl text-brand-ivory my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-brand-purple-dark/80 text-brand-gold hover:text-white border border-brand-gold/30"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Gallery */}
          <div className="p-6 bg-brand-purple/20 flex flex-col items-center justify-center">
            <div className="aspect-[3/4] w-full max-w-sm rounded-2xl overflow-hidden border border-brand-gold/20 shadow-lg mb-4 bg-brand-purple">
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover object-top"
              />
            </div>

            {/* Thumbnail Strip */}
            <div className="flex gap-2.5 overflow-x-auto pb-1 max-w-full">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-14 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                    activeImage === img
                      ? 'border-brand-gold scale-105 shadow'
                      : 'border-brand-gold/20 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Specifications & CTA */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div>
              {/* Badges & Category */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs uppercase tracking-widest text-brand-gold font-semibold">
                  {product.category} Saree
                </span>
                {product.badge && (
                  <span className="bg-brand-crimson text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Title */}
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-ivory">
                {product.name}
              </h2>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating || 5)
                          ? 'fill-current'
                          : 'opacity-40'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-brand-ivory">
                  {product.rating ? product.rating.toFixed(1) : '4.9'}
                </span>
                <span className="text-xs text-brand-ivory/50">
                  ({product.reviews || 85} verified reviews)
                </span>
              </div>

              {/* Price */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="font-serif text-3xl font-bold text-brand-gold">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-brand-ivory/40 line-through">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                <span className="text-xs text-emerald-400 font-semibold">
                  Inclusive of all taxes
                </span>
              </div>

              {/* Description */}
              <p className="mt-4 text-xs sm:text-sm text-brand-ivory/80 leading-relaxed font-sans">
                {product.description}
              </p>

              {/* Specifications Box */}
              <div className="mt-6 rounded-xl border border-brand-gold/20 bg-brand-purple/40 p-3 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-brand-ivory/50">Fabric:</span>
                  <p className="font-semibold text-brand-gold-light">{product.fabric || 'Pure Mulberry Silk'}</p>
                </div>
                <div>
                  <span className="text-brand-ivory/50">Weave:</span>
                  <p className="font-semibold text-brand-gold-light">{product.weave || 'Traditional Handloom'}</p>
                </div>
                <div>
                  <span className="text-brand-ivory/50">Length:</span>
                  <p className="font-semibold text-brand-gold-light">6.3 Metres (Includes Blouse)</p>
                </div>
                <div>
                  <span className="text-brand-ivory/50">Certification:</span>
                  <p className="font-semibold text-emerald-400">Silk Mark Certified</p>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-4 pt-4 border-t border-brand-gold/15">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-brand-gold/30 rounded-xl px-3 py-1.5 bg-brand-purple-dark">
                  <span className="text-xs text-brand-ivory/60 mr-3">Qty:</span>
                  <button
                    onClick={() => setSelectedQty(Math.max(1, selectedQty - 1))}
                    className="text-brand-gold px-2 py-0.5 hover:text-white"
                  >
                    -
                  </button>
                  <span className="text-sm font-bold px-2">{selectedQty}</span>
                  <button
                    onClick={() => setSelectedQty(selectedQty + 1)}
                    className="text-brand-gold px-2 py-0.5 hover:text-white"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAdd}
                  className={`flex-1 py-3 px-6 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 border transition-all ${
                    added
                      ? 'bg-emerald-600 border-emerald-500 text-white'
                      : 'bg-brand-purple border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-purple-dark'
                  }`}
                >
                  {added ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                  <span>{added ? 'Added to Bag' : 'Add to Bag'}</span>
                </button>
              </div>

              <button
                onClick={handleBuyNow}
                className="w-full py-3.5 px-6 rounded-xl font-serif font-bold text-sm bg-gradient-to-r from-brand-gold to-brand-gold-dark text-brand-purple-dark hover:brightness-110 shadow-xl transition-all"
              >
                Instant Checkout
              </button>

              {/* Guarantees */}
              <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] text-brand-ivory/60 text-center">
                <div className="flex flex-col items-center">
                  <ShieldCheck className="w-4 h-4 text-brand-gold mb-1" />
                  <span>100% Authentic Silk</span>
                </div>
                <div className="flex flex-col items-center">
                  <Truck className="w-4 h-4 text-brand-gold mb-1" />
                  <span>Free Insured Express</span>
                </div>
                <div className="flex flex-col items-center">
                  <RotateCcw className="w-4 h-4 text-brand-gold mb-1" />
                  <span>7-Day Return Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
