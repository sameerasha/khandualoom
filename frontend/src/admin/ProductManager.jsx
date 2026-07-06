import { useState } from 'react';
import { useProducts } from '../context/ProductContext';
import DeleteConfirmModal from './DeleteConfirmModal';
import './ProductManager.css';

export default function ProductManager({ onNavigate }) {
  const { products, categories, deleteProduct } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // State for delete modal
  const [productToDelete, setProductToDelete] = useState(null);

  // Filter products based on search & category
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.color.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.fabric.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
  };

  const handleConfirmDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete.id);
      setProductToDelete(null);
    }
  };

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

      {/* Filters Bar */}
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

        <div className="product-manager__categories-select">
          <label htmlFor="category-filter" className="sr-only">Filter by Category</label>
          <select
            id="category-filter"
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
      </div>

      {/* Catalog Table / Grid */}
      <div className="product-manager__content">
        {filteredProducts.length === 0 ? (
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
          <div className="product-manager__table-container">
            <table className="product-manager__table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Details</th>
                  <th>Badge</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="product-manager__row">
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
                        {product.originalPrice > product.price && (
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
                        <span className="product-manager__no-badge">-</span>
                      )}
                    </td>
                    <td>
                      <div className="product-manager__actions-cell">
                        <button
                          className="product-manager__action-btn product-manager__action-btn--edit"
                          onClick={() => onNavigate(`admin/products/edit/${product.id}`)}
                          aria-label={`Edit ${product.name}`}
                          title="Edit"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <button
                          className="product-manager__action-btn product-manager__action-btn--delete"
                          onClick={() => handleDeleteClick(product)}
                          aria-label={`Delete ${product.name}`}
                          title="Delete"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
