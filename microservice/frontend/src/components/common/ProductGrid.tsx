import React, { useMemo, useState, useEffect } from 'react';
import { SlidersHorizontal, Search, RefreshCw, Sparkles, ChevronDown } from 'lucide-react';
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

const PREFERRED_ORDER = ['All', 'Padua', 'Sambalpuri', 'Khandua', 'Bomkai', 'Berhampuri', 'Pasapalli', 'Kotpad', 'Dongria', 'Habaspuri'];
const INITIAL_LIMIT = 18;
const PAGE_SIZE = 18;

interface ProductGridProps {
  onSelectProduct: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ onSelectProduct }) => {
  const dispatch = useAppDispatch();
  const { selectedCategory, searchQuery, sortBy } = useAppSelector(
    (state) => state.products
  );

  const [visibleCount, setVisibleCount] = useState(INITIAL_LIMIT);

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

  // Dynamically derive available categories from products with Odia & Padua priorities
  const categories = useMemo(() => {
    const presentCats = Array.from(new Set(productsToFilter.map((p) => p.category).filter(Boolean)));
    const ordered = PREFERRED_ORDER.filter(
      (cat) => cat === 'All' || presentCats.some((c) => c.toLowerCase() === cat.toLowerCase())
    );
    // Add any remaining categories
    presentCats.forEach((cat) => {
      if (!ordered.some((c) => c.toLowerCase() === cat.toLowerCase())) {
        ordered.push(cat);
      }
    });
    return ordered;
  }, [productsToFilter]);

  // Client-side filtering & sorting
  const filteredProducts = useMemo(() => {
    let result = [...productsToFilter];

    if (selectedCategory && selectedCategory !== 'All') {
      result = result.filter(
        (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (searchQuery && searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.fabric.toLowerCase().includes(q) ||
          p.color.toLowerCase().includes(q) ||
          p.weave.toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case 'price-low':
        return result.sort((a, b) => a.price - b.price);
      case 'price-high':
        return result.sort((a, b) => b.price - a.price);
      case 'rating':
        return result.sort((a, b) => b.rating - a.rating);
      default:
        return result;
    }
  }, [productsToFilter, selectedCategory, searchQuery, sortBy]);

  // Reset pagination when filter criteria changes
  useEffect(() => {
    setVisibleCount(INITIAL_LIMIT);
  }, [selectedCategory, searchQuery, sortBy]);

  // Slice for progressive revealing
  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount);
  }, [filteredProducts, visibleCount]);

  const handleResetFilters = () => {
    dispatch(setSelectedCategory('All'));
    dispatch(setSearchQuery(''));
    dispatch(setSortBy('featured'));
    setVisibleCount(INITIAL_LIMIT);
  };

  return (
    <section id="catalog-section" className="relative py-14 sm:py-16 text-brand-ivory overflow-hidden">
      {/* Contrast Gradients matching Hero for WCAG AA readability over 3D canvas */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0F0617]/95 via-[#0F0617]/80 to-[#0F0617]/95 pointer-events-none" />

      {/* Subtle ambient lighting */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-brand-purple/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 relative z-10">
        {/* Title & Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-brand-gold font-mono font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
              <span>
                Masterpieces of the Loom • Showing {displayedProducts.length} of {filteredProducts.length} Heirloom Sarees
              </span>
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
            {categories.map((cat) => {
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

        {/* Loading Skeleton - 5 Columns Desktop / 2 Columns Mobile */}
        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5 md:gap-6 lg:gap-7">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <div
                key={n}
                className="aspect-[3/3.8] bg-brand-purple-dark/40 animate-pulse rounded-2xl border border-brand-gold/15"
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

        {/* 5-Column Product Cards Grid with Staggered Entrance */}
        {!isLoading && filteredProducts.length > 0 && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5 md:gap-6 lg:gap-7">
              {displayedProducts.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.5, delay: (idx % 5) * 0.08, ease: [0.16, 1, 0.3, 1] }}
                >
                  <ProductCard
                    product={product}
                    onSelect={onSelectProduct}
                  />
                </motion.div>
              ))}
            </div>

            {/* Load More Button if filtered exceeds visibleCount */}
            {visibleCount < filteredProducts.length ? (
              <div className="mt-14 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-full max-w-sm bg-white/5 border border-brand-gold/20 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-brand-gold to-brand-gold-light h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (displayedProducts.length / filteredProducts.length) * 100)}%`,
                    }}
                  />
                </div>
                <p className="text-xs font-mono text-brand-ivory/60">
                  Revealed <span className="text-brand-gold font-bold">{displayedProducts.length}</span> of{' '}
                  <span className="text-brand-gold font-bold">{filteredProducts.length}</span> Certified Masterpieces
                </p>
                <button
                  onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                  className="group px-8 py-3.5 rounded-full bg-gradient-to-r from-brand-gold via-brand-gold-light to-brand-gold text-brand-purple-dark font-serif font-bold text-sm tracking-wide shadow-xl shadow-brand-gold/25 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Load More Masterpieces</span>
                  <ChevronDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
                </button>
              </div>
            ) : filteredProducts.length > INITIAL_LIMIT ? (
              <div className="mt-14 text-center text-xs font-mono text-brand-gold/75 py-4 border-t border-brand-gold/15 tracking-widest uppercase">
                ✦ All {filteredProducts.length} Certified Masterpieces Unveiled ✦
              </div>
            ) : null}
          </>
        )}
      </div>
    </section>
  );
};
