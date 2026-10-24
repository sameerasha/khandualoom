import React, { useState, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { Product } from '@/types';

interface ProductManagerViewProps {
  products: Product[];
  onAddNewProduct: () => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (product: Product) => void;
}

export const ProductManagerView: React.FC<ProductManagerViewProps> = ({
  products,
  onAddNewProduct,
  onEditProduct,
  onDeleteProduct,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBadge, setSelectedBadge] = useState('All');
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc' | 'name'>('newest');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = viewMode === 'grid' ? 9 : 8;

  // Extract unique categories and badges
  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category)))];
  const badges = ['All', 'Bestseller', 'Premium', 'Heirloom', 'Trending', 'New Arrival', 'Popular', 'Exclusive'];

  // Filter
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.color.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.fabric.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesBadge = selectedBadge === 'All' || product.badge === selectedBadge;

    return matchesSearch && matchesCategory && matchesBadge;
  });

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedBadge, viewMode]);

  // Sort
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return b.id - a.id; // Newest
  });

  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="product-manager">
      <div className="product-manager__header">
        <div>
          <h1 className="product-manager__title flex items-center gap-3">
            Atelier Catalog Vault
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full border border-brand-gold/40 bg-brand-gold/10 text-brand-gold font-normal">
              {products.length} MASTERPIECES
            </span>
          </h1>
          <p className="product-manager__subtitle">
            Manage your saree catalog, update inventory, and add new weaves.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
                viewMode === 'table' ? 'bg-brand-gold text-brand-purple-dark font-bold' : 'text-brand-ivory/70 hover:text-white'
              }`}
              title="Table View"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
              Table
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
                viewMode === 'grid' ? 'bg-brand-gold text-brand-purple-dark font-bold' : 'text-brand-ivory/70 hover:text-white'
              }`}
              title="Lookbook Grid View"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
              Lookbook
            </button>
          </div>

          <button className="product-manager__add-btn" onClick={onAddNewProduct}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Commission Weave
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="product-manager__filters">
        <div className="product-manager__search-wrap">
          <svg
            className="product-manager__search-icon"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="product-manager__search"
            placeholder="Search by weave name, color tone, or silk fabric..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-ivory/50 hover:text-white p-1"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="product-manager__filter-row">
          <div className="product-manager__select-wrap">
            <select
              className="product-manager__select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label="Filter by Weave Category"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Weave Regions' : cat}
                </option>
              ))}
            </select>
            <ChevronDown className="product-manager__select-arrow w-4 h-4" />
          </div>

          <div className="product-manager__select-wrap">
            <select
              className="product-manager__select"
              value={selectedBadge}
              onChange={(e) => setSelectedBadge(e.target.value)}
              aria-label="Filter by Heirloom Badge"
            >
              {badges.map((b) => (
                <option key={b} value={b}>
                  {b === 'All' ? 'All Heirloom Badges' : b}
                </option>
              ))}
            </select>
            <ChevronDown className="product-manager__select-arrow w-4 h-4" />
          </div>

          <div className="product-manager__select-wrap">
            <select
              className="product-manager__select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              aria-label="Sort Catalog Items"
            >
              <option value="newest">Newest Commissioned</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
            <ChevronDown className="product-manager__select-arrow w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Grid or Table View */}
      {viewMode === 'table' ? (
        <div className="product-manager__content">
          <div className="product-manager__table-container">
            <table className="product-manager__table">
              <thead>
                <tr>
                  <th>Masterpiece</th>
                  <th>Category</th>
                  <th>Valuation</th>
                  <th>Fabric & Technique</th>
                  <th>Heirloom Badge</th>
                  <th>Atelier Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.length > 0 ? (
                  paginatedProducts.map((product) => (
                    <tr key={product.id} className="product-manager__row">
                      <td>
                        <div className="product-manager__info-cell">
                          <div className="product-manager__img-wrap group-hover:scale-105 transition-transform">
                            <img
                              src={product.image || '/images/saree_purple_gold.png'}
                              alt={product.name}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/images/saree_purple_gold.png';
                              }}
                            />
                          </div>
                          <div>
                            <div className="product-manager__name">{product.name}</div>
                            <div className="product-manager__color">{product.color}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="product-manager__category-badge">{product.category}</span>
                      </td>
                      <td>
                        <div className="product-manager__price-wrap">
                          <span className="product-manager__price font-mono font-bold">
                            ₹{product.price.toLocaleString('en-IN')}
                          </span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="product-manager__old-price font-mono">
                              ₹{product.originalPrice.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="text-sm text-brand-ivory/70">
                          {product.fabric} • {product.weave}
                        </div>
                      </td>
                      <td>
                        <span className="product-manager__badge-tag font-mono text-[10px]">
                          {product.badge || 'Active'}
                        </span>
                      </td>
                      <td>
                        <div className="product-manager__actions-cell">
                          <button
                            className="product-manager__action-btn product-manager__action-btn--edit"
                            title="Edit Weave Details"
                            onClick={() => onEditProduct(product)}
                          >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                          <button
                            className="product-manager__action-btn product-manager__action-btn--delete"
                            title="Delete Weave from Catalog"
                            onClick={() => onDeleteProduct(product)}
                          >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '3.5rem' }}>
                      <div style={{ color: 'var(--color-text-muted)' }}>No heirloom sarees match your current filter.</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Lookbook Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {paginatedProducts.map((product) => (
            <div
              key={product.id}
              className="group relative rounded-2xl bg-[#140924]/80 border border-brand-gold/20 overflow-hidden shadow-xl hover:border-brand-gold/60 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[4/3] overflow-hidden bg-black/40">
                  <img
                    src={product.image || '/images/saree_purple_gold.png'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/saree_purple_gold.png';
                    }}
                  />
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full border border-brand-gold/40 bg-black/60 text-brand-gold backdrop-blur-md">
                      {product.category}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full bg-brand-gold text-brand-purple-dark font-bold shadow-md">
                      {product.badge || 'Heirloom'}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-serif text-lg font-bold text-white group-hover:text-brand-gold transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-xs text-brand-ivory/60 mt-1 line-clamp-1">
                    {product.color} • {product.fabric}
                  </p>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="font-mono text-lg font-bold text-brand-gold">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="font-mono text-xs text-brand-ivory/40 line-through">
                        ₹{product.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 flex gap-2">
                <button
                  onClick={() => onEditProduct(product)}
                  className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono uppercase tracking-wider text-brand-ivory transition-colors flex items-center justify-center gap-1.5"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  Edit
                </button>
                <button
                  onClick={() => onDeleteProduct(product)}
                  className="px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs transition-colors"
                  title="Delete"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Bar */}
      <div className="product-manager__pagination rounded-2xl overflow-hidden mt-6">
        <button
          className="product-manager__page-btn"
          disabled={safeCurrentPage <= 1}
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
        >
          ← Previous
        </button>
        <span className="product-manager__page-info font-mono">
          Showing {sortedProducts.length > 0 ? startIndex + 1 : 0} to{' '}
          {Math.min(startIndex + itemsPerPage, sortedProducts.length)} of {sortedProducts.length} Heirloom Saree Weaves
        </span>
        <button
          className="product-manager__page-btn"
          disabled={safeCurrentPage >= totalPages}
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
        >
          Next →
        </button>
      </div>
    </div>
  );
};
