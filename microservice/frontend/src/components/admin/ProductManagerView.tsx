import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  ChevronDown,
  X,
  Eye,
  Sparkles,
  Layers,
  ShieldCheck,
  ChevronRight,
  Package,
} from 'lucide-react';
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
  const [inspectingProduct, setInspectingProduct] = useState<Product | null>(null);
  const [activeAngleImage, setActiveAngleImage] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = viewMode === 'grid' ? 9 : 8;

  // Extract unique categories and badges
  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category)))];
  const badges = ['All', 'Bestseller', 'Premium', 'Heirloom', 'Trending', 'New Arrival', 'Popular', 'Exclusive'];

  // Catalog Valuation & Metrics
  const catalogStats = {
    total: products.length,
    silkWeaves: products.filter((p) => (p.fabric || '').toLowerCase().includes('silk')).length,
    distinctClusters: new Set(products.map((p) => p.category)).size,
    totalValuation: products.reduce((acc, p) => acc + (p.price || 0), 0),
    avgRealization: products.length > 0 ? Math.round(products.reduce((acc, p) => acc + (p.price || 0), 0) / products.length) : 0,
  };

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

  const openInspection = (p: Product) => {
    setInspectingProduct(p);
    setActiveAngleImage(p.image || '/images/products/p3/front.jpg');
  };

  // Angles list for inspecting product
  const getProductAngles = (p: Product): string[] => {
    if (p.images && p.images.length > 0) {
      return p.images.map((img) => (typeof img === 'string' ? img : img.imageUrl));
    }
    // Standard multi-angle fallback sequence if base image has folder structure
    const base = p.image || '/images/products/p3/front.jpg';
    if (base.includes('/front.jpg')) {
      const dir = base.substring(0, base.lastIndexOf('/'));
      return [
        `${dir}/front.jpg`,
        `${dir}/pallu.jpg`,
        `${dir}/border.jpg`,
        `${dir}/side.jpg`,
      ];
    }
    return [base];
  };

  return (
    <div className="product-manager animate-fadeIn">
      {/* Header */}
      <div className="product-manager__header">
        <div>
          <h1 className="product-manager__title flex items-center gap-3">
            Atelier Catalog Vault
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full border border-brand-gold/40 bg-brand-gold/10 text-brand-gold font-normal">
              {products.length} MASTERPIECES
            </span>
          </h1>
          <p className="product-manager__subtitle">
            Curate heirloom sarees, manage multi-angle asset imagery, review fabric purity, and commission new weaves.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer ${
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
              className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer ${
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
              Grid View
            </button>
          </div>

          <button className="product-manager__add-btn cursor-pointer" onClick={onAddNewProduct}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Product
          </button>
        </div>
      </div>

      {/* Catalog KPI Statistics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1C0C30] to-[#120622] border border-brand-gold/30 shadow-lg">
          <div className="flex items-center justify-between text-brand-gold/70 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider">Total Products</span>
            <Package className="w-4 h-4 text-brand-gold" />
          </div>
          <div className="font-mono text-xl sm:text-2xl font-bold text-white">{catalogStats.total} Pieces</div>
          <div className="text-[10px] font-sans text-brand-ivory/50 mt-0.5">Active Products in Store</div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1C0C30] to-[#120622] border border-amber-500/30 shadow-lg">
          <div className="flex items-center justify-between text-amber-400 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider">Silk Products</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-mono text-xl sm:text-2xl font-bold text-amber-300">{catalogStats.silkWeaves} Mulberry</div>
          <div className="text-[10px] font-sans text-brand-ivory/50 mt-0.5">Pure Handwoven Silk</div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1C0C30] to-[#120622] border border-emerald-500/30 shadow-lg">
          <div className="flex items-center justify-between text-emerald-400 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider">Categories</span>
            <Layers className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-mono text-xl sm:text-2xl font-bold text-emerald-300">{catalogStats.distinctClusters} Regions</div>
          <div className="text-[10px] font-sans text-brand-ivory/50 mt-0.5">Nuapatna, Sambalpur, Kotpad</div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1C0C30] to-[#120622] border border-brand-gold/40 shadow-lg">
          <div className="flex items-center justify-between text-brand-gold mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider">Total Stock Value</span>
            <ShieldCheck className="w-4 h-4 text-brand-gold" />
          </div>
          <div className="font-mono text-xl sm:text-2xl font-bold text-brand-gold">
            ₹{(catalogStats.totalValuation).toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] font-sans text-brand-ivory/50 mt-0.5">Avg: ₹{catalogStats.avgRealization.toLocaleString('en-IN')} / piece</div>
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
            placeholder="Search by product name, color, or fabric..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-ivory/50 hover:text-white p-1 cursor-pointer"
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
              aria-label="Filter by Category"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Categories' : cat}
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
              aria-label="Filter by Badge"
            >
              {badges.map((b) => (
                <option key={b} value={b}>
                  {b === 'All' ? 'All Badges' : b}
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
          <div className="rounded-2xl border border-brand-gold/25 bg-[#0D0317]/95 overflow-hidden shadow-2xl">
            <div className="px-5 py-2.5 bg-brand-gold/5 border-b border-brand-gold/15 flex items-center justify-between text-[11px] font-mono text-brand-gold/80">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-gold animate-ping" />
                Handloom Masterpieces Registry
              </span>
              <span className="flex items-center gap-1.5 text-brand-ivory/50">
                <span>Scroll horizontally to inspect weave details</span>
                <span className="text-brand-gold font-bold">⟷</span>
              </span>
            </div>

            <div className="overflow-x-auto custom-gold-scrollbar">
              <table className="w-full min-w-[980px] text-left border-collapse">
                <thead>
                  <tr className="border-b border-brand-gold/20 bg-white/[0.02] text-xs font-mono uppercase tracking-wider text-brand-gold/90">
                    <th className="py-4 px-5 whitespace-nowrap min-w-[280px]">Masterpiece Weave</th>
                    <th className="py-4 px-5 whitespace-nowrap min-w-[160px]">Category</th>
                    <th className="py-4 px-5 whitespace-nowrap min-w-[140px]">Valuation</th>
                    <th className="py-4 px-5 whitespace-nowrap min-w-[220px]">Fabric & Technique</th>
                    <th className="py-4 px-5 whitespace-nowrap min-w-[140px]">Heirloom Badge</th>
                    <th className="py-4 px-5 text-right whitespace-nowrap min-w-[160px]">Atelier Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {paginatedProducts.length > 0 ? (
                    paginatedProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-white/[0.03] transition-colors group">
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3.5">
                            <div
                              onClick={() => openInspection(product)}
                              className="w-14 h-14 rounded-xl overflow-hidden bg-black/40 border border-brand-gold/30 shrink-0 cursor-pointer relative group/img shadow-md"
                              title="Click to Examine Weave"
                            >
                              <img
                                src={product.image || '/images/products/p3/front.jpg'}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-300"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = '/images/products/p3/front.jpg';
                                }}
                              />
                              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                <Eye className="w-4 h-4 text-brand-gold" />
                              </div>
                            </div>
                            <div>
                              <div
                                onClick={() => openInspection(product)}
                                className="font-serif font-bold text-white hover:text-brand-gold transition-colors cursor-pointer text-sm leading-snug line-clamp-1"
                              >
                                {product.name}
                              </div>
                              <div className="text-xs text-brand-ivory/60 font-sans mt-0.5 line-clamp-1">
                                {product.color}
                              </div>
                              <div className="text-[10px] font-mono text-brand-gold/80 mt-0.5">
                                #{String(product.id).padStart(3, '0')} • 4 View Angles Available
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-5">
                          <span className="text-xs px-2.5 py-1 rounded-full bg-brand-gold/15 text-brand-gold border border-brand-gold/30 font-mono inline-block">
                            {product.category}
                          </span>
                        </td>
                        <td className="py-4 px-5">
                          <div>
                            <span className="font-mono font-bold text-brand-gold text-base">
                              ₹{product.price.toLocaleString('en-IN')}
                            </span>
                            {product.originalPrice && product.originalPrice > product.price && (
                              <div className="text-xs font-mono text-brand-ivory/40 line-through">
                                ₹{product.originalPrice.toLocaleString('en-IN')}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-5">
                          <div className="text-xs text-brand-ivory/80 leading-relaxed">
                            <span className="font-semibold text-white">{product.fabric}</span>
                            <div className="text-brand-ivory/60 font-mono text-[11px]">{product.weave}</div>
                          </div>
                        </td>
                        <td className="py-4 px-5">
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-brand-ivory/80">
                            {product.badge || 'Artisan Heirloom'}
                          </span>
                        </td>
                        <td className="py-4 px-5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => openInspection(product)}
                              className="p-2 rounded-xl border border-brand-gold/40 text-brand-gold hover:bg-brand-gold/15 transition-all cursor-pointer shadow-xs"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => onEditProduct(product)}
                              className="p-2 rounded-xl border border-white/15 text-brand-ivory/70 hover:text-white hover:border-brand-gold/40 hover:bg-white/5 transition-all cursor-pointer"
                              title="Edit"
                            >
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                              </svg>
                            </button>
                            <button
                              type="button"
                              onClick={() => onDeleteProduct(product)}
                              className="p-2 rounded-xl border border-red-500/25 text-red-400 hover:bg-red-500/15 transition-all cursor-pointer"
                              title="Delete"
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
                      <td colSpan={6} className="text-center py-12 text-brand-ivory/50 font-sans">
                        No products match your search or filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Lookbook Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {paginatedProducts.map((product) => (
            <div
              key={product.id}
              className="group relative rounded-2xl bg-[#140924]/80 border border-brand-gold/25 overflow-hidden shadow-xl hover:border-brand-gold/70 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div
                  onClick={() => openInspection(product)}
                  className="relative aspect-[4/3] overflow-hidden bg-black/40 cursor-pointer"
                >
                  <img
                    src={product.image || '/images/products/p3/front.jpg'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/products/p3/front.jpg';
                    }}
                  />
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full border border-brand-gold/40 bg-black/70 text-brand-gold backdrop-blur-md">
                      {product.category}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full bg-brand-gold text-brand-purple-dark font-bold shadow-md">
                      {product.badge || 'Heirloom'}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-xs font-mono text-brand-gold flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5" />
                      <span>Examine High-Res Angles</span>
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <h3
                    onClick={() => openInspection(product)}
                    className="font-serif text-lg font-bold text-white group-hover:text-brand-gold transition-colors line-clamp-1 cursor-pointer"
                  >
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
                  type="button"
                  onClick={() => openInspection(product)}
                  className="flex-1 py-2 rounded-xl bg-brand-gold/10 hover:bg-brand-gold/20 border border-brand-gold/40 text-xs font-mono uppercase tracking-wider text-brand-gold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Examine</span>
                </button>
                <button
                  type="button"
                  onClick={() => onEditProduct(product)}
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono uppercase tracking-wider text-brand-ivory transition-colors cursor-pointer"
                  title="Edit Weave Details"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteProduct(product)}
                  className="px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs transition-colors cursor-pointer"
                  title="Delete Weave"
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
          className="product-manager__page-btn cursor-pointer"
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
          className="product-manager__page-btn cursor-pointer"
          disabled={safeCurrentPage >= totalPages}
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
        >
          Next →
        </button>
      </div>

      {/* ======================================================== */}
      {/* LUXURY WEAVE INSPECTION DOSSIER MODAL                    */}
      {/* ======================================================== */}
      {inspectingProduct && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
          onClick={() => setInspectingProduct(null)}
          data-lenis-prevent="true"
        >
          <div
            className="relative w-[96vw] max-w-4xl xl:max-w-5xl bg-gradient-to-b from-[#1C0C30] via-[#120622] to-[#0A0214] border border-brand-gold/50 rounded-3xl p-6 sm:p-8 shadow-[0_25px_90px_rgba(0,0,0,0.95),0_0_60px_rgba(223,191,122,0.2)] z-10 text-brand-ivory max-h-[92vh] overflow-y-auto my-auto custom-gold-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between pb-5 border-b border-brand-gold/25">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-brand-gold font-bold px-2 py-0.5 rounded bg-brand-gold/15 border border-brand-gold/30">
                    ATELIER WEAVE DOSSIER
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    AUTHENTIC HANDLOOM
                  </span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {inspectingProduct.name}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setInspectingProduct(null)}
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-brand-ivory/60 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body: 2 Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 py-6">
              {/* Left Column: Multi-Angle Interactive Gallery (5 cols) */}
              <div className="lg:col-span-5 space-y-3">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-black/60 border border-brand-gold/40 shadow-xl relative group">
                  <img
                    src={activeAngleImage || inspectingProduct.image || '/images/products/p3/front.jpg'}
                    alt={inspectingProduct.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/products/p3/front.jpg';
                    }}
                  />
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full bg-black/70 text-brand-gold border border-brand-gold/40 backdrop-blur-md">
                      {inspectingProduct.category}
                    </span>
                  </div>
                </div>

                {/* Thumbnails row */}
                <div className="grid grid-cols-4 gap-2">
                  {getProductAngles(inspectingProduct).map((angleImg, idx) => {
                    const labels = ['Front Silhouette', 'Pallu Motifs', 'Phoda Kumbha', 'Pleats View'];
                    const isSelected = activeAngleImage === angleImg;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveAngleImage(angleImg)}
                        className={`aspect-square rounded-xl overflow-hidden border transition-all cursor-pointer relative ${
                          isSelected
                            ? 'border-brand-gold ring-2 ring-brand-gold/60 scale-102'
                            : 'border-white/15 hover:border-brand-gold/40 opacity-70 hover:opacity-100'
                        }`}
                        title={labels[idx] || `Angle ${idx + 1}`}
                      >
                        <img
                          src={angleImg}
                          alt={labels[idx] || `Angle ${idx + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/products/p3/front.jpg';
                          }}
                        />
                        <div className="absolute bottom-0 inset-x-0 bg-black/70 text-[8px] font-mono text-center text-white/80 py-0.5 truncate">
                          {labels[idx] || `View ${idx + 1}`}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Full Specifications & Description (7 cols) */}
              <div className="lg:col-span-7 space-y-5">
                {/* Valuation & Badge */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-brand-gold/25 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-mono uppercase tracking-wider text-brand-ivory/50">
                      Commission Price
                    </div>
                    <div className="flex items-baseline gap-2.5 mt-0.5">
                      <span className="font-mono text-2xl sm:text-3xl font-bold text-brand-gold">
                        ₹{inspectingProduct.price.toLocaleString('en-IN')}
                      </span>
                      {inspectingProduct.originalPrice && inspectingProduct.originalPrice > inspectingProduct.price && (
                        <span className="font-mono text-sm text-brand-ivory/40 line-through">
                          ₹{inspectingProduct.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="px-3 py-1.5 rounded-full bg-brand-gold text-brand-purple-dark font-bold text-xs font-mono uppercase tracking-widest shadow-md">
                    {inspectingProduct.badge || 'Artisan Heirloom'}
                  </span>
                </div>

                {/* Technical Specifications Grid */}
                <div>
                  <div className="text-xs font-mono uppercase tracking-widest text-brand-gold mb-2.5">
                    Technical Weave Specifications
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
                      <span className="text-brand-ivory/50 font-mono block">Fabric Composition</span>
                      <span className="font-semibold text-white mt-0.5 block">{inspectingProduct.fabric || 'Pure Mulberry Silk'}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
                      <span className="text-brand-ivory/50 font-mono block">Weave Technique</span>
                      <span className="font-semibold text-white mt-0.5 block">{inspectingProduct.weave || 'Nuapatna Tie-Dye Ikat'}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
                      <span className="text-brand-ivory/50 font-mono block">Color Spectrum</span>
                      <span className="font-semibold text-white mt-0.5 block">{inspectingProduct.color || 'Sacred Crimson & Gold'}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
                      <span className="text-brand-ivory/50 font-mono block">Artisan Cluster</span>
                      <span className="font-semibold text-white mt-0.5 block">{inspectingProduct.category}</span>
                    </div>
                  </div>
                </div>

                {/* Artisan Story / Description */}
                <div>
                  <div className="text-xs font-mono uppercase tracking-widest text-brand-gold mb-1.5">
                    Artisan Story & Provenance
                  </div>
                  <p className="text-xs sm:text-sm text-brand-ivory/80 leading-relaxed font-sans bg-white/[0.02] p-4 rounded-xl border border-white/10">
                    {inspectingProduct.description ||
                      'An illustrious Nuapatna masterpiece crafted with needle-interlocked Phoda Kumbha spires and Gitagovinda calligraphic motifs in sanctified mulberry silk.'}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      const p = inspectingProduct;
                      setInspectingProduct(null);
                      onEditProduct(p);
                    }}
                    className="flex-1 py-3 rounded-xl bg-brand-gold text-brand-purple-dark font-bold text-xs uppercase tracking-wider hover:bg-brand-gold-light transition-all cursor-pointer shadow-lg shadow-brand-gold/20 flex items-center justify-center gap-2"
                  >
                    <span>Edit in Atelier Studio</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setInspectingProduct(null)}
                    className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-mono uppercase tracking-wider text-white transition-all cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
