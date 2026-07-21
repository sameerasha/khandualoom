import { useState, useEffect } from 'react';
import { useProducts } from '../context/ProductContext';
import DeleteConfirmModal from './DeleteConfirmModal';
import './ProductManager.css';

export default function ProductManager({ onNavigate }) {
  const { products, categories, deleteProduct } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBadge, setSelectedBadge] = useState('All');
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'modified', 'price-asc', 'price-desc', 'name'
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  
  // States for overlays and detail view
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activePreviewImage, setActivePreviewImage] = useState('');
  const [productToDelete, setProductToDelete] = useState(null);

  // Filter products based on search, category, and badge
  const filteredProducts = products.filter((product) => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.color.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.fabric.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesBadge = selectedBadge === 'All' || product.badge === selectedBadge;
    
    return matchesSearch && matchesCategory && matchesBadge;
  });

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedBadge]);

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.createdDate || 0) - new Date(a.createdDate || 0);
    }
    if (sortBy === 'modified') {
      return new Date(b.modifiedDate || 0) - new Date(a.modifiedDate || 0);
    }
    if (sortBy === 'price-asc') {
      return a.price - b.price;
    }
    if (sortBy === 'price-desc') {
      return b.price - a.price;
    }
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    }
    return 0;
  });

  // Calculate pagination
  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / itemsPerPage));
  // Ensure current page is within valid range after filtering
  const safeCurrentPage = Math.min(currentPage, totalPages);
  
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
  };

  const handleConfirmDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete.id);
      setProductToDelete(null);
      // If we deleted the product we are currently viewing inline, reset the selection
      if (selectedProduct && selectedProduct.id === productToDelete.id) {
        setSelectedProduct(null);
      }
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Initial Weave';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateStr;
    }
  };

  const selectProductForDetails = (product) => {
    setSelectedProduct(product);
    setActivePreviewImage(product.image);
  };

  const badges = ['All', 'Bestseller', 'Premium', 'New Arrival', 'Trending', 'Heirloom', 'Popular'];

  // 1. INLINE DETAILED VIEW
  if (selectedProduct) {
    const hasDiscount = selectedProduct.originalPrice > selectedProduct.price;
    const allGalleryImages = Array.from(new Set([
      selectedProduct.image,
      ...(selectedProduct.images || [])
    ])).filter(img => img && img.trim() !== '');

    return (
      <div className="product-manager">
        <div className="product-manager__header">
          <div>
            <button 
              className="product-manager__back-inline-btn" 
              onClick={() => setSelectedProduct(null)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
              </svg>
              Back to Catalog List
            </button>
            <h1 className="product-manager__title" style={{ marginTop: '8px' }}>Product Profile Summary</h1>
          </div>
        </div>

        <div className="product-details-inline card-glow animate-scale-in">
          <div className="product-details-inline__grid">
            
            {/* Left side: Images gallery preview board */}
            <div className="product-details-inline__gallery-col">
              <div className="product-details-inline__main-frame">
                <img src={activePreviewImage} alt={selectedProduct.name} />
              </div>
              
              {allGalleryImages.length > 1 && (
                <div className="product-details-inline__thumbs">
                  {allGalleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`product-details-inline__thumb-btn ${activePreviewImage === img ? 'active' : ''}`}
                      onClick={() => setActivePreviewImage(img)}
                    >
                      <img src={img} alt={`Angle ${idx + 1}`} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right side: Detailed descriptions and specs */}
            <div className="product-details-inline__info-col">
              <div className="product-details-inline__header-info">
                <span className="product-details-inline__category">{selectedProduct.category} Collection</span>
                <h2 className="product-details-inline__name">{selectedProduct.name}</h2>
                <div className="product-details-inline__badges">
                  {selectedProduct.badge && (
                    <span className={`product-manager__badge-tag product-manager__badge-tag--${selectedProduct.badge.toLowerCase().replace(' ', '-')}`}>
                      {selectedProduct.badge}
                    </span>
                  )}
                  <span className="details-inline-id">ID: #{selectedProduct.id}</span>
                </div>
              </div>

              {/* Action Operations: Edit and Delete */}
              <div className="product-details-inline__actions">
                <button
                  className="product-details-inline__btn product-details-inline__btn--edit"
                  onClick={() => onNavigate(`admin/products/edit/${selectedProduct.id}`)}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  Edit Product
                </button>
                <button
                  className="product-details-inline__btn product-details-inline__btn--delete"
                  onClick={() => handleDeleteClick(selectedProduct)}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                  </svg>
                  Delete Product
                </button>
              </div>

              {/* Detailed specs */}
              <div className="product-details-inline__section">
                <h3>Fabric Specifications</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Fabric Type</span>
                    <span className="info-val">{selectedProduct.fabric}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Weaving Technique</span>
                    <span className="info-val">{selectedProduct.weave}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Color Shade</span>
                    <span className="info-val">{selectedProduct.color}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Rating</span>
                    <span className="info-val">★ {selectedProduct.rating} ({selectedProduct.reviews} reviews)</span>
                  </div>
                </div>
              </div>

              {/* Pricing & Auditing */}
              <div className="product-details-inline__section">
                <h3>Pricing & Weave Audits</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Selling Price</span>
                    <span className="info-val" style={{ color: 'var(--color-accent)' }}>
                      ₹{selectedProduct.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Original Price (M.R.P.)</span>
                    <span className="info-val" style={{ textDecoration: 'line-through', opacity: 0.7 }}>
                      ₹{selectedProduct.originalPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Weave Date</span>
                    <span className="info-val">{formatDate(selectedProduct.createdDate)}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Last Modified Date</span>
                    <span className="info-val">{formatDate(selectedProduct.modifiedDate)}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="product-details-inline__section">
                <h3>Catalog Description</h3>
                <p className="product-details-inline__desc">{selectedProduct.description}</p>
              </div>

            </div>

          </div>
        </div>

        <DeleteConfirmModal
          isOpen={productToDelete !== null}
          onClose={() => setProductToDelete(null)}
          onConfirm={handleConfirmDelete}
          productName={productToDelete?.name}
        />
      </div>
    );
  }

  // 2. STANDARD PRODUCT LIST VIEW
  return (
    <div className="product-manager">
      <div className="product-manager__header">
        <div>
          <h1 className="product-manager__title">Manage Products</h1>
          <p className="product-manager__subtitle">Catalog management for the storefront collection</p>
        </div>
        <button 
          className="product-manager__add-btn" 
          onClick={() => onNavigate('admin/products/new')}
          id="btn-add-product"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add New Product
        </button>
      </div>

      {/* Enhanced Filters Bar */}
      <div className="product-manager__filters">
        <div className="product-manager__search-wrap">
          <svg className="product-manager__search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="product-manager__search"
            placeholder="Search by name, color, fabric..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            id="search-products-input"
          />
        </div>

        <div className="product-manager__filter-row">
          {/* Category Filter */}
          <div className="product-manager__select-wrap">
            <select
              id="category-filter"
              className="product-manager__select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              {categories.filter(c => c !== 'All').map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Badge Filter */}
          <div className="product-manager__select-wrap">
            <select
              id="badge-filter"
              className="product-manager__select"
              value={selectedBadge}
              onChange={(e) => setSelectedBadge(e.target.value)}
            >
              <option value="All">All Badges</option>
              {badges.filter(b => b !== 'All').map((badge) => (
                <option key={badge} value={badge}>{badge}</option>
              ))}
            </select>
          </div>

          {/* Sorter */}
          <div className="product-manager__select-wrap">
            <select
              id="sort-filter"
              className="product-manager__select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Weave Date (Newest)</option>
              <option value="modified">Modified Date (Newest)</option>
              <option value="price-asc">Price (Low → High)</option>
              <option value="price-desc">Price (High → Low)</option>
              <option value="name">Name (A → Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Catalog Table */}
      <div className="product-manager__content">
        {sortedProducts.length === 0 ? (
          <div className="product-manager__empty">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
            <h3>No products found</h3>
            <p>Try adjusting your search query or category filter, or add a new product.</p>
          </div>
        ) : (
          <div className="product-manager__table-container animate-fade-in">
            <table className="product-manager__table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Specifications</th>
                  <th>Badge</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.map((product) => {
                  const hasDiscount = product.originalPrice > product.price;
                  return (
                    <tr 
                      key={product.id} 
                      className="product-manager__row product-manager__row--clickable"
                      onClick={() => selectProductForDetails(product)}
                      title="Click to view full product specifications & actions"
                    >
                      <td>
                        <div className="product-manager__info-cell">
                          <div className="product-manager__img-wrap">
                            <img src={product.image} alt={product.name} />
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
                          {hasDiscount && (
                            <span className="product-manager__old-price">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="product-manager__details-cell">
                          <span>{product.fabric}</span>
                          <span className="product-manager__separator">•</span>
                          <span>{product.weave}</span>
                        </div>
                      </td>
                      <td>
                        {product.badge ? (
                          <span className={`product-manager__badge-tag product-manager__badge-tag--${product.badge.toLowerCase().replace(' ', '-')}`}>
                            {product.badge}
                          </span>
                        ) : (
                          <span className="product-manager__no-badge">—</span>
                        )}
                      </td>
                      <td>
                        <div className="product-manager__actions-cell">
                          <button
                            className="product-manager__action-btn product-manager__action-btn--edit"
                            onClick={(e) => { e.stopPropagation(); onNavigate(`admin/products/edit/${product.id}`); }}
                            aria-label={`Edit ${product.name}`}
                            title="Edit Product"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                          <button
                            className="product-manager__action-btn product-manager__action-btn--delete"
                            onClick={(e) => { e.stopPropagation(); handleDeleteClick(product); }}
                            aria-label={`Delete ${product.name}`}
                            title="Delete Product"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {sortedProducts.length > itemsPerPage && (
          <div className="product-manager__pagination">
            <button 
              className="product-manager__page-btn" 
              disabled={safeCurrentPage === 1}
              onClick={() => handlePageChange(safeCurrentPage - 1)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
              Previous
            </button>
            <span className="product-manager__page-info">
              Page <strong>{safeCurrentPage}</strong> of <strong>{totalPages}</strong>
            </span>
            <button 
              className="product-manager__page-btn" 
              disabled={safeCurrentPage === totalPages}
              onClick={() => handlePageChange(safeCurrentPage + 1)}
            >
              Next
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        )}
      </div>

      <DeleteConfirmModal
        isOpen={productToDelete !== null}
        onClose={() => setProductToDelete(null)}
        onConfirm={handleConfirmDelete}
        productName={productToDelete?.name}
      />
    </div>
  );
}
