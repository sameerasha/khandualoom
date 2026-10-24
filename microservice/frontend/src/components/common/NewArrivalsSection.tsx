import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Eye, ShoppingBag } from 'lucide-react';
import { Product } from '@/types';
import { useAppDispatch } from '@/app/hooks';
import { addToCart } from '@/features/cart/cartSlice';
import { setSelectedCategory, setSearchQuery } from '@/features/products/productsSlice';

interface NewArrivalsSectionProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const NewArrivalsSection: React.FC<NewArrivalsSectionProps> = ({
  products,
  onSelectProduct,
}) => {
  const dispatch = useAppDispatch();

  // Curate 4 recent arrivals
  const newArrivals = products
    .filter((p) => p.badge?.includes('New') || p.id >= 10 || p.badge === 'Heirloom' || p.badge === 'Popular')
    .slice(0, 4);

  const handleViewAll = () => {
    dispatch(setSelectedCategory('All'));
    dispatch(setSearchQuery(''));
    const catalogElement = document.getElementById('catalog-section');
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (newArrivals.length === 0) return null;

  return (
    <section id="new-arrivals-section" className="py-16 sm:py-20 text-brand-ivory relative overflow-hidden">
      {/* Contrast Gradients matching Hero for WCAG AA readability */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0F0617]/95 via-[#0F0617]/85 to-[#0F0617]/95 pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-brand-gold font-mono font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
              <span>Fresh Off the Wooden Pit Looms</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-ivory leading-tight">
              New Arrivals
            </h2>
            <p className="text-xs sm:text-sm text-brand-ivory/60 mt-1 font-light">
              The latest consecrated handlooms woven with traditional motifs and sacred temple spires.
            </p>
          </div>

          <button
            onClick={handleViewAll}
            className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-brand-gold/15 border border-brand-gold/30 hover:border-brand-gold text-brand-gold hover:text-white text-xs font-semibold uppercase tracking-wider transition-all self-start sm:self-end cursor-pointer"
          >
            <span>View All Sarees</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.map((product, idx) => {
            const discountPercent =
              product.originalPrice && product.originalPrice > product.price
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                : 0;

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => onSelectProduct(product)}
                className="group relative rounded-2xl overflow-hidden border border-brand-gold/25 bg-gradient-to-b from-[#180828] to-[#0D0216] shadow-xl hover:border-brand-gold/70 hover:shadow-[0_12px_35px_rgba(197,160,89,0.2)] transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                {/* Image */}
                <div className="relative aspect-[3/3.8] w-full overflow-hidden bg-black/40">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D0216] via-transparent to-black/20" />

                  {/* Badges */}
                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10 pointer-events-none">
                    <span className="bg-brand-crimson/95 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow">
                      New Arrival
                    </span>
                    {discountPercent > 0 && (
                      <span className="bg-brand-gold text-brand-purple-dark text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow w-fit">
                        {discountPercent}% OFF
                      </span>
                    )}
                  </div>

                  {/* Hover Overlay Button */}
                  <div className="hidden sm:flex absolute inset-0 items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-brand-gold text-brand-purple-dark text-xs font-bold uppercase tracking-wider shadow-lg">
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Details</span>
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 flex flex-col flex-1 justify-between gap-2">
                  <div>
                    <div className="flex items-center justify-between text-[10px] text-brand-gold/80 font-mono uppercase tracking-wider mb-1">
                      <span>{product.category}</span>
                      <span className="text-brand-ivory/50">{product.fabric}</span>
                    </div>
                    <h3 className="font-serif font-bold text-sm text-brand-ivory group-hover:text-brand-gold transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                  </div>

                  <div className="pt-2 border-t border-brand-gold/15 flex items-center justify-between">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-serif font-bold text-base text-brand-gold">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      {product.originalPrice && (
                        <span className="text-[10px] text-brand-ivory/40 line-through">
                          ₹{product.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(addToCart({ product, quantity: 1 }));
                      }}
                      className="p-1.5 rounded-lg bg-brand-gold/20 hover:bg-brand-gold text-brand-gold hover:text-brand-purple-dark border border-brand-gold/40 transition-colors"
                      title="Add to Cart"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
