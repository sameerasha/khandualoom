import React, { useMemo } from 'react';
import { SlidersHorizontal, Search, RefreshCw } from 'lucide-react';
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
        (p) =>
          p.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
          (selectedCategory === 'Kanjivaram' &&
            p.category.toLowerCase().includes('kanjeevaram'))
      );
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.fabric.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
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
    <section id="catalog-section" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Title & Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-brand-gold font-sans font-semibold">
            Masterpieces of the Loom
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-ivory mt-1">
            Handcrafted Saree Collection
          </h2>
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 self-start md:self-end">
          <SlidersHorizontal className="w-4 h-4 text-brand-gold" />
          <span className="text-xs text-brand-ivory/70">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => dispatch(setSortBy(e.target.value as any))}
            className="bg-brand-purple border border-brand-gold/30 rounded-lg text-xs text-brand-ivory py-1.5 px-3 focus:outline-none focus:border-brand-gold"
          >
            <option value="featured">Featured Collection</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Category Pills & Active Search Tag */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-10 pb-4 border-b border-brand-gold/15">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => dispatch(setSelectedCategory(cat))}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
                selectedCategory === cat
                  ? 'bg-brand-gold text-brand-purple-dark shadow-md'
                  : 'bg-brand-purple/50 text-brand-ivory/80 hover:bg-brand-purple hover:text-brand-gold border border-brand-gold/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {searchQuery && (
          <div className="flex items-center gap-2 bg-brand-purple px-3 py-1.5 rounded-full border border-brand-gold/40 text-xs">
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
              className="aspect-[3/4] bg-brand-purple/40 animate-pulse rounded-2xl border border-brand-gold/10"
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredProducts.length === 0 && (
        <div className="text-center py-20 bg-brand-purple/20 rounded-2xl border border-brand-gold/15">
          <p className="font-serif text-xl text-brand-gold mb-2">No Sarees Found</p>
          <p className="text-sm text-brand-ivory/60 mb-6">
            We couldn't find matches for your active filters or search terms.
          </p>
          <button
            onClick={handleResetFilters}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-gold text-brand-purple-dark font-semibold text-xs shadow hover:brightness-110"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset All Filters
          </button>
        </div>
      )}

      {/* Product Cards Grid */}
      {!isLoading && filteredProducts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      )}
    </section>
  );
};
