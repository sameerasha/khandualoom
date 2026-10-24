import React from 'react';
import { Product, Order } from '@/types';

interface AdminDashboardViewProps {
  products: Product[];
  orders: Order[];
  onNavigate: (route: string) => void;
  onAddNewProduct: () => void;
  onEditProduct: (product: Product) => void;
  onBackToStore: () => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  products,
  orders,
  onNavigate,
  onAddNewProduct,
  onEditProduct,
  onBackToStore,
}) => {
  const categoriesCount = new Set(products.map((p) => p.category)).size;
  const avgPrice = Math.round(
    products.reduce((acc, p) => acc + (p.price || 0), 0) / (products.length || 1)
  );
  const totalValue =
    orders.length > 0
      ? orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0)
      : products.reduce((acc, p) => acc + (p.price || 0), 0);

  const stats = [
    {
      label: 'Total Products',
      value: products.length,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
          <line x1="7" y1="7" x2="7.01" y2="7" />
        </svg>
      ),
      color: 'var(--color-accent)',
    },
    {
      label: 'Categories',
      value: categoriesCount,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      ),
      color: 'var(--color-burgundy-500)',
    },
    {
      label: 'Avg. Price',
      value: `₹${avgPrice.toLocaleString('en-IN')}`,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
        </svg>
      ),
      color: 'var(--color-gold-300)',
    },
    {
      label: 'Total Value',
      value: `₹${totalValue.toLocaleString('en-IN')}`,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
          <polyline points="17 6 23 6 23 12" />
        </svg>
      ),
      color: 'var(--color-success)',
    },
  ];

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard__header">
        <div>
          <h1 className="admin-dashboard__title">
            Dashboard
            <span className="admin-dashboard__live-indicator" title="System Live"></span>
          </h1>
          <p className="admin-dashboard__subtitle">Welcome back, Admin. Here's your store overview.</p>
        </div>
        <button className="admin-dashboard__add-btn" onClick={onAddNewProduct}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Product
        </button>
      </div>

      {/* Stats Grid */}
      <div className="admin-dashboard__stats">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="admin-stat-card"
            style={{ ['--stat-color' as any]: stat.color, animationDelay: `${i * 0.1}s` }}
          >
            <div className="admin-stat-card__icon">{stat.icon}</div>
            <div>
              <div className="admin-stat-card__value">{stat.value}</div>
              <div className="admin-stat-card__label">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="admin-dashboard__section">
        <h2 className="admin-dashboard__section-title">Quick Actions</h2>
        <div className="admin-dashboard__actions">
          <button className="admin-action-card" onClick={onAddNewProduct}>
            <div className="admin-action-card__icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
            </div>
            <span>Add New Product</span>
          </button>
          <button className="admin-action-card" onClick={() => onNavigate('products')}>
            <div className="admin-action-card__icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </div>
            <span>Manage Products</span>
          </button>
          <button className="admin-action-card" onClick={onBackToStore}>
            <div className="admin-action-card__icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <span>View Storefront</span>
          </button>
        </div>
      </div>

      {/* Recent Products */}
      <div className="admin-dashboard__section">
        <h2 className="admin-dashboard__section-title">Recent Products</h2>
        <div className="admin-dashboard__recent">
          {products.slice(0, 10).map((product, i) => (
            <div
              key={product.id}
              className="admin-recent-item"
              style={{ animationDelay: `${i * 0.05 + 0.3}s` }}
              onClick={() => onEditProduct(product)}
            >
              <div className="admin-recent-item__image">
                <img
                  src={product.image || '/images/saree_purple_gold.png'}
                  alt={product.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/saree_purple_gold.png';
                  }}
                />
              </div>
              <div className="admin-recent-item__info">
                <h4 className="admin-recent-item__name">{product.name}</h4>
                <span className="admin-recent-item__category">{product.category}</span>
              </div>
              <span className="admin-recent-item__price">₹{product.price.toLocaleString('en-IN')}</span>
              <span className="admin-recent-item__badge">
                {product.badge || 'Heirloom'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
