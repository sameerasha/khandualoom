import React from 'react';
import { Product, Order } from '@/types';
import { AtelierSeal3D } from './AtelierSeal3D';
import { AtelierSparkline } from './AtelierSparkline';
import { AtelierMetricsPanel } from './AtelierMetricsPanel';

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
      trend: '+12% this season',
      trendUp: true,
      sparklineData: [18, 22, 20, 26, 28, 31, products.length],
      sparklineColor: '#DFBF7A',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
          <line x1="7" y1="7" x2="7.01" y2="7" />
        </svg>
      ),
      color: '#DFBF7A',
    },
    {
      label: 'Total Categories',
      value: categoriesCount,
      trend: '7 GI Regions',
      trendUp: true,
      sparklineData: [4, 5, 5, 6, 6, 7, categoriesCount],
      sparklineColor: '#C45B8A',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      ),
      color: '#C45B8A',
    },
    {
      label: 'Average Price',
      value: `₹${avgPrice.toLocaleString('en-IN')}`,
      trend: '+6.4% this month',
      trendUp: true,
      sparklineData: [34000, 38000, 39500, 42000, 45000, avgPrice],
      sparklineColor: '#3B82F6',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
        </svg>
      ),
      color: '#3B82F6',
    },
    {
      label: 'Total Sales Value',
      value: `₹${totalValue.toLocaleString('en-IN')}`,
      trend: '+24.8% growth',
      trendUp: true,
      sparklineData: [420000, 680000, 850000, 1120000, 1340000, totalValue],
      sparklineColor: '#10B981',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
          <polyline points="17 6 23 6 23 12" />
        </svg>
      ),
      color: '#10B981',
    },
  ];

  return (
    <div className="admin-dashboard">
      {/* Executive Welcome Hero Banner with 3D Seal */}
      <div className="relative mb-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#170B28] via-[#11061F] to-[#0A0414] border border-brand-gold/30 shadow-2xl overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Ambient Golden Radial Glow */}
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-brand-gold/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-brand-purple/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-gold/40 bg-brand-gold/10 text-brand-gold text-[11px] font-mono uppercase tracking-widest mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Admin Dashboard • Online
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Store Management
          </h1>
          <p className="text-sm text-brand-ivory/70 mt-2 font-light leading-relaxed">
            Manage products, track orders, view customer accounts, and update website content.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-5">
            <button
              onClick={onAddNewProduct}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-gold via-brand-gold-light to-brand-gold text-brand-purple-dark font-bold text-xs uppercase tracking-wider shadow-lg shadow-brand-gold/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add Product
            </button>
            <button
              onClick={() => onNavigate('orders')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs text-brand-ivory transition-colors cursor-pointer"
            >
              View Orders ({orders.length > 0 ? orders.length : 52})
            </button>
          </div>
        </div>

        {/* 3D Interactive Royal Seal */}
        <div className="relative z-10 flex flex-col items-center flex-shrink-0">
          <AtelierSeal3D size={120} />
        </div>
      </div>

      {/* KPI Stats Grid with Real-Time Sparklines */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="group relative p-5 rounded-2xl bg-white/[0.025] hover:bg-white/[0.04] border border-white/10 hover:border-brand-gold/40 transition-all duration-300 shadow-xl overflow-hidden flex flex-col justify-between min-h-[140px]"
          >
            {/* Top Accent Light Bar */}
            <div
              className="absolute top-0 left-0 right-0 h-1"
              style={{ backgroundColor: stat.color }}
            />

            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-brand-ivory/60">
                  {stat.label}
                </span>
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center border border-white/10"
                  style={{ backgroundColor: `${stat.color}15`, color: stat.color }}
                >
                  {stat.icon}
                </div>
              </div>

              <div className="mt-3 font-mono text-2xl font-bold text-white tracking-tight">
                {stat.value}
              </div>

              <div className="flex items-center gap-1.5 mt-1 text-xs">
                <span className="font-mono text-emerald-400 font-semibold">{stat.trend}</span>
              </div>
            </div>

            {/* Sparkline Visual at Card Bottom */}
            <div className="mt-4 pt-3 border-t border-white/5">
              <AtelierSparkline
                data={stat.sparklineData}
                color={stat.sparklineColor}
                height={32}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Atelier Portfolio Distribution & Live Pulse Feed */}
      <AtelierMetricsPanel products={products} orders={orders} />

      {/* Quick Actions Bar */}
      <div className="admin-dashboard__section">
        <h2 className="admin-dashboard__section-title">Quick Actions</h2>
        <div className="admin-dashboard__actions">
          <button className="admin-action-card group" onClick={onAddNewProduct}>
            <div className="admin-action-card__icon group-hover:rotate-90 transition-transform">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
            </div>
            <span>Add Product</span>
            <span className="text-[11px] text-brand-ivory/50 font-normal">Add a new saree</span>
          </button>

          <button className="admin-action-card group" onClick={() => onNavigate('products')}>
            <div className="admin-action-card__icon group-hover:scale-110 transition-transform">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </div>
            <span>Products</span>
            <span className="text-[11px] text-brand-ivory/50 font-normal">View and edit products</span>
          </button>

          <button className="admin-action-card group" onClick={() => onNavigate('users')}>
            <div className="admin-action-card__icon group-hover:scale-110 transition-transform">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 010 7.75" />
              </svg>
            </div>
            <span>Customers</span>
            <span className="text-[11px] text-brand-ivory/50 font-normal">View customer accounts</span>
          </button>

          <button className="admin-action-card group" onClick={onBackToStore}>
            <div className="admin-action-card__icon group-hover:-translate-y-1 transition-transform">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <span>View Store</span>
            <span className="text-[11px] text-brand-ivory/50 font-normal">Open customer website</span>
          </button>
        </div>
      </div>

      {/* Recent Products */}
      <div className="admin-dashboard__section">
        <div className="flex items-center justify-between mb-4">
          <h2 className="admin-dashboard__section-title mb-0">Recent Products</h2>
          <button
            onClick={() => onNavigate('products')}
            className="text-xs font-mono uppercase tracking-wider text-brand-gold hover:underline cursor-pointer"
          >
            View All Products →
          </button>
        </div>

        <div className="admin-dashboard__recent">
          {products.slice(0, 8).map((product, i) => (
            <div
              key={product.id}
              className="admin-recent-item group"
              style={{ animationDelay: `${i * 0.05 + 0.2}s` }}
              onClick={() => onEditProduct(product)}
            >
              <div className="admin-recent-item__image group-hover:scale-105 transition-transform">
                <img
                  src={product.image || '/images/saree_purple_gold.png'}
                  alt={product.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/saree_purple_gold.png';
                  }}
                />
              </div>
              <div className="admin-recent-item__info min-w-0">
                <h4 className="admin-recent-item__name group-hover:text-brand-gold transition-colors truncate">
                  {product.name}
                </h4>
                <span className="admin-recent-item__category">
                  {product.category} • {product.fabric}
                </span>
              </div>
              <span className="admin-recent-item__price font-mono">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              <div className="flex items-center gap-2">
                <span className="admin-recent-item__badge font-mono text-[10px]">
                  {product.badge || 'Heirloom'}
                </span>
                <span className="text-xs text-brand-gold opacity-0 group-hover:opacity-100 transition-opacity">
                  Edit ✎
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
