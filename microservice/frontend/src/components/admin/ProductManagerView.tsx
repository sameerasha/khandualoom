import React, { useState, useEffect } from 'react';
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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

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
  }, [searchQuery, selectedCategory, selectedBadge]);

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
          <h1 className="product-manager__title">Product Management</h1>
          <p className="product-manager__subtitle">
            Manage your saree catalog, update inventory, and add new weaves.
          </p>
        </div>
        <button className="product-manager__add-btn" onClick={onAddNewProduct}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Product
        </button>
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
            placeholder="Search by name, color, or fabric..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="product-manager__filter-row">
          <div className="product-manager__select-wrap">
            <select
              className="product-manager__select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          <div className="product-manager__select-wrap">
            <select
              className="product-manager__select"
              value={selectedBadge}
              onChange={(e) => setSelectedBadge(e.target.value)}
            >
              {badges.map((b) => (
                <option key={b} value={b}>
                  {b === 'All' ? 'All Badges' : b}
                </option>
              ))}
            </select>
          </div>

          <div className="product-manager__select-wrap">
            <select
              className="product-manager__select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="product-manager__content">
        <div className="product-manager__table-container">
          <table className="product-manager__table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Fabric & Weave</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((product) => (
                  <tr key={product.id} className="product-manager__row">
                    <td>
                      <div className="product-manager__info-cell">
                        <div className="product-manager__img-wrap">
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
                        <span className="product-manager__price">₹{product.price.toLocaleString('en-IN')}</span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="product-manager__old-price">
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
                      <span className="product-manager__badge-tag">
                        {product.badge || 'Active'}
                      </span>
                    </td>
                    <td>
                      <div className="product-manager__actions-cell">
                        <button
                          className="product-manager__action-btn product-manager__action-btn--edit"
                          title="Edit Weave"
                          onClick={() => onEditProduct(product)}
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <button
                          className="product-manager__action-btn product-manager__action-btn--delete"
                          title="Delete Weave"
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
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem' }}>
                    <div style={{ color: 'var(--color-text-muted)' }}>No heirloom sarees match your filter.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="product-manager__pagination">
          <button
            className="product-manager__page-btn"
            disabled={safeCurrentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            ← Previous
          </button>
          <span className="product-manager__page-info">
            Showing {sortedProducts.length > 0 ? startIndex + 1 : 0} to{' '}
            {Math.min(startIndex + itemsPerPage, sortedProducts.length)} of {sortedProducts.length}
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
    </div>
  );
};
