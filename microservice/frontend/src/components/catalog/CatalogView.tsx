import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { FilterSidebar } from './FilterSidebar';
import { SortDropdown } from './SortDropdown';
import { ActiveFilterChips } from './ActiveFilterChips';
import { CatalogProductCard } from './CatalogProductCard';
import {
  filterAndSortProducts,
  CatalogFilterState,
  initialFilterState,
  SortOption,
} from '@/features/catalog/catalogFilterUtils';
import { useGetProductsQuery } from '@/features/products/productsApi';
import { fallbackProducts } from '@/data/fallbackProducts';
import { SlidersHorizontal, Sparkles } from 'lucide-react';

export const CatalogView: React.FC = () => {
  const { category } = useParams<{ category?: string }>();
  const [searchParams] = useSearchParams();

  const [filters, setFilters] = useState<CatalogFilterState>({
    ...initialFilterState,
    category: category || searchParams.get('category') || undefined,
    searchQuery: searchParams.get('search') || '',
  });

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync category param change
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      category: category || searchParams.get('category') || undefined,
      searchQuery: searchParams.get('search') || '',
    }));
  }, [category, searchParams]);

  // Fetch catalog from product-service
  const { data: fetchedProducts, isLoading, isError, refetch } = useGetProductsQuery({});
  const allProducts = fetchedProducts && fetchedProducts.length > 0 ? fetchedProducts : fallbackProducts;

  // Execute in-memory multi-faceted filtering & sorting
  const filteredProducts = useMemo(() => {
    return filterAndSortProducts(allProducts, filters);
  }, [allProducts, filters]);

  const handleSortChange = (newSort: SortOption) => {
    setFilters((prev) => ({ ...prev, sortBy: newSort }));
  };

  const handleRemoveWeave = (weave: string) => {
    setFilters((prev) => ({
      ...prev,
      weaves: prev.weaves.filter((w) => w !== weave),
    }));
  };

  const handleRemoveFabric = (fabric: string) => {
    setFilters((prev) => ({
      ...prev,
      fabrics: prev.fabrics.filter((f) => f !== fabric),
    }));
  };

  const handleResetPrice = () => {
    setFilters((prev) => ({ ...prev, priceRange: [1000, 50000] }));
  };

  const handleToggleGi = () => {
    setFilters((prev) => ({ ...prev, giTaggedOnly: !prev.giTaggedOnly }));
  };

  const handleClearAll = () => {
    setFilters({
      ...initialFilterState,
      category: category || undefined,
    });
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Breadcrumbs Navigation */}
      <nav aria-label="Breadcrumb" className="mb-4 text-xs text-brand-ivory/60 flex items-center gap-2">
        <Link to="/" className="hover:text-brand-gold">Home</Link>
        <span>/</span>
        <Link to="/catalog" className="hover:text-brand-gold">Handloom Sarees</Link>
        {category && (
          <>
            <span>/</span>
            <span className="text-brand-gold font-semibold">{decodeURIComponent(category)}</span>
          </>
        )}
      </nav>

      {/* Title & Top Sorting Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 gap-4 mb-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 tracking-wide">
            {category ? decodeURIComponent(category) : 'Handloom Sarees'}
          </h1>
          <p className="text-xs text-gray-600 mt-1">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile Filter Drawer Button */}
          <button
            type="button"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden px-3 py-1.5 rounded-lg bg-white border border-gray-300 text-gray-800 text-xs font-semibold flex items-center gap-1.5 shadow-sm"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>

          <SortDropdown currentSort={filters.sortBy} onSortChange={handleSortChange} />
        </div>
      </div>

      {/* Main 2-Column Section: Filters + 4-Column Product Grid */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Filter Sidebar (Desktop) */}
        <div className="hidden lg:block shrink-0 sticky top-24">
          <FilterSidebar filters={filters} onFilterChange={setFilters} />
        </div>

        {/* Mobile Filter Drawer */}
        {mobileFilterOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="max-w-md mx-auto bg-white rounded-2xl p-6 border border-gray-200 shadow-2xl">
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
                <h3 className="font-bold text-gray-900 uppercase text-sm">Filters</h3>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="text-xs text-gray-500 hover:text-gray-900 font-bold"
                >
                  Close ✕
                </button>
              </div>
              <FilterSidebar filters={filters} onFilterChange={setFilters} />
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="w-full mt-4 py-2.5 rounded-xl bg-brand-gold hover:bg-brand-gold-light text-brand-purple-dark font-bold text-xs uppercase shadow transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Right: Active Chips + 4-Column Grid */}
        <div className="flex-1 w-full">
          <ActiveFilterChips
            filters={filters}
            onRemoveWeave={handleRemoveWeave}
            onRemoveFabric={handleRemoveFabric}
            onResetPrice={handleResetPrice}
            onToggleGi={handleToggleGi}
            onClearAll={handleClearAll}
            totalResults={filteredProducts.length}
          />

          {isLoading ? (
            <div className="py-24 text-center text-gray-500 text-sm animate-pulse">
              Loading products...
            </div>
          ) : isError && allProducts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
              <h3 className="font-serif text-lg font-semibold text-gray-900 mb-1">
                Unable to load products
              </h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto mb-4">
                Please check your network connection and try again.
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className="px-4 py-2 rounded-xl bg-brand-gold text-brand-purple-dark font-bold text-xs uppercase shadow"
              >
                Retry
              </button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
              <Sparkles className="w-8 h-8 text-gray-400 mx-auto mb-3" />
              <h3 className="font-serif text-lg font-semibold text-gray-900 mb-1">
                No products found in this collection
              </h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto mb-4">
                Try clearing your filters or exploring our other collections.
              </p>
              <button
                type="button"
                onClick={handleClearAll}
                className="px-4 py-2 rounded-xl bg-brand-gold text-brand-purple-dark font-bold text-xs uppercase shadow hover:bg-brand-gold-light transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <CatalogProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
