import React, { useMemo } from 'react';
import { SlidersHorizontal, Search, RefreshCw, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '@/types';
import { ProductCard } from './ProductCard';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  setSelectedCategory,
  setSearchQuery,
  setSortBy,
} from '@/features/products/productsSlice';
import { useGetProductsQuery } from '@/features/products/productsApi';
import { fallbackProducts } from '@/data/fallbackProducts';

const CATEGORIES = ['All', 'Banarasi', 'Kanjivaram', 'Chanderi', 'Tussar'];

interface ProductGridProps {
  onSelectProduct: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ onSelectProduct }) => {
  const dispatch = useAppDispatch();
  const { selectedCategory, searchQuery, sortBy } = useAppSelector(
    (state) => state.products
  );

  const {
    data: fetchedProducts,
    isLoading,
  } = useGetProductsQuery(
    {
      category: selectedCategory !== 'All' ? selectedCategory : undefined,
      search: searchQuery || undefined,
    },
    { refetchOnMountOrArgChange: true }
  );

  // Combine API data with fallback catalog if empty
  const productsToFilter = useMemo(() => {
    if (fetchedProducts && fetchedProducts.length > 0) {
      return fetchedProducts;
    }
    return fallbackProducts;
  }, [fetchedProducts]);

  // Client-side filtering & sorting
  const filteredProducts = useMemo(() => {
    let result = [...productsToFilter];

    if (selectedCategory && selectedCategory !== 'All') {
      result = result.filter(
        (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (searchQuery && searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.fabric && p.fabric.toLowerCase().includes(q)) ||
          (p.weave && p.weave.toLowerCase().includes(q))
      );
    }

    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return result;
  }, [productsToFilter, selectedCategory, searchQuery, sortBy]);

  const handleResetFilters = () => {
    dispatch(setSelectedCategory('All'));
    dispatch(setSearchQuery(''));
    dispatch(setSortBy('featured'));
  };

  return (
    <section id="catalog-section" className="relative py-24 text-brand-ivory border-b border-brand-gold/15 overflow-hidden">
      {/* Contrast Gradients matching Hero for WCAG AA readability over 3D canvas */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0F0617]/95 via-[#0F0617]/80 to-[#0F0617]/95 pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#0F0617] via-[#0F0617]/60 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0F0617] via-[#0F0617]/60 to-transparent pointer-events-none" />

      {/* Subtle ambient lighting */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-brand-purple/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Title & Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-brand-gold font-mono font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
              <span>Masterpieces of the Loom • {filteredProducts.length} Heirloom Sarees</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-ivory leading-tight">
              Handcrafted Saree Collection
            </h2>
          </div>

          {/* Sort Select */}
          <div className="flex items-center gap-2 self-start md:self-end bg-brand-purple-dark/85 p-1.5 px-3 rounded-xl border border-brand-gold/30 backdrop-blur-xl shadow-md">
            <SlidersHorizontal className="w-4 h-4 text-brand-gold" />
            <span className="text-xs text-brand-ivory/80 font-sans">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => dispatch(setSortBy(e.target.value as any))}
              className="bg-transparent border-none text-xs text-brand-gold font-medium py-1 px-2 focus:outline-none cursor-pointer"
            >
              <option value="featured" className="bg-[#13091B] text-brand-ivory">Featured Collection</option>
              <option value="price-low" className="bg-[#13091B] text-brand-ivory">Price: Low to High</option>
              <option value="price-high" className="bg-[#13091B] text-brand-ivory">Price: High to Low</option>
              <option value="rating" className="bg-[#13091B] text-brand-ivory">Highest Rated</option>
            </select>
          </div>
        </div>

      {/* Category Pills & Active Search Tag */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-10 pb-4 border-b border-brand-gold/15">
        <div className="flex flex-wrap gap-2.5">
          {CATEGORIES.map((cat) => {
            const count =
              cat === 'All'
                ? productsToFilter.length
                : productsToFilter.filter((p) => p.category.toLowerCase() === cat.toLowerCase()).length;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => dispatch(setSelectedCategory(cat))}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 flex items-center gap-2 ${
                  isSelected
                    ? 'bg-gradient-to-r from-brand-gold via-brand-gold-light to-brand-gold-dark text-brand-purple-dark shadow-lg shadow-brand-gold/20 scale-105 font-bold'
                    : 'bg-brand-purple-dark/60 text-brand-ivory/80 hover:bg-brand-purple-dark hover:text-brand-gold border border-brand-gold/25 backdrop-blur-sm'
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-brand-purple-dark/20 text-brand-purple-dark' : 'bg-white/10 text-brand-ivory/60'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {searchQuery && (
          <div className="flex items-center gap-2 bg-brand-purple-dark/90 px-3.5 py-1.5 rounded-full border border-brand-gold/40 text-xs shadow-md">
            <Search className="w-3.5 h-3.5 text-brand-gold" />
            <span className="text-brand-ivory/80">Query: "{searchQuery}"</span>
            <button
              onClick={() => dispatch(setSearchQuery(''))}
              className="text-brand-gold hover:text-white font-bold ml-1"
            >
              ×
            </button>
          </div>
        )}
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="aspect-[3/4] bg-brand-purple-dark/40 animate-pulse rounded-3xl border border-brand-gold/15"
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredProducts.length === 0 && (
        <div className="text-center py-20 bg-brand-purple-dark/40 backdrop-blur-md rounded-3xl border border-brand-gold/20">
          <p className="font-serif text-2xl text-brand-gold mb-2">No Sarees Found</p>
          <p className="text-sm text-brand-ivory/60 mb-6 font-light">
            We couldn't find matches for your active filters or search terms.
          </p>
          <button
            onClick={handleResetFilters}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-gold text-brand-purple-dark font-semibold text-xs shadow-xl hover:brightness-110"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset All Filters
          </button>
        </div>
      )}

      {/* Product Cards Grid with Staggered Entrance */}
      {!isLoading && filteredProducts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: (idx % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <ProductCard
                product={product}
                onSelect={onSelectProduct}
              />
            </motion.div>
          ))}
        </div>
      )}
      </div>
    </section>
  );
};
