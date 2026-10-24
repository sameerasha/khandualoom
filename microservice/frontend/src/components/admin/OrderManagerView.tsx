import React, { useState } from 'react';
import { Order } from '@/types';

interface OrderManagerViewProps {
  orders: Order[];
  onStatusChange: (orderId: number, newStatus: string) => Promise<void>;
}

export const OrderManagerView: React.FC<OrderManagerViewProps> = ({ orders, onStatusChange }) => {
  const [filter, setFilter] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders =
    filter === 'ALL' ? orders : orders.filter((o) => o.status === filter);

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === 'PENDING').length,
    processing: orders.filter((o) => o.status === 'PROCESSING').length,
    shipped: orders.filter((o) => o.status === 'SHIPPED').length,
    delivered: orders.filter((o) => o.status === 'DELIVERED').length,
    revenue: orders.filter((o) => o.status !== 'CANCELLED').reduce((sum, o) => sum + (o.totalAmount || 0), 0),
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return '#10B981';
      case 'SHIPPED':
        return '#3B82F6';
      case 'PROCESSING':
        return '#F59E0B';
      case 'CANCELLED':
        return '#EF4444';
      default:
        return '#8B5CF6';
    }
  };

  return (
    <div className="order-manager">
      <div className="admin-dashboard__header">
        <div>
          <h1 className="admin-dashboard__title">Order Management</h1>
          <p className="admin-dashboard__subtitle">View and manage all customer orders.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="admin-dashboard__stats">
        <div className="admin-stat-card" style={{ ['--stat-color' as any]: '#1DA1F2' }}>
          <div className="admin-stat-card__icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </div>
          <div>
            <div className="admin-stat-card__value">{stats.total}</div>
            <div className="admin-stat-card__label">Total Orders</div>
          </div>
        </div>

        <div className="admin-stat-card" style={{ ['--stat-color' as any]: '#8B5CF6' }}>
          <div className="admin-stat-card__icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div>
            <div className="admin-stat-card__value">{stats.pending}</div>
            <div className="admin-stat-card__label">Pending</div>
          </div>
        </div>

        <div className="admin-stat-card" style={{ ['--stat-color' as any]: '#F59E0B' }}>
          <div className="admin-stat-card__icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div>
            <div className="admin-stat-card__value">{stats.processing}</div>
            <div className="admin-stat-card__label">Processing</div>
          </div>
        </div>

        <div className="admin-stat-card" style={{ ['--stat-color' as any]: '#3B82F6' }}>
          <div className="admin-stat-card__icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="1" y="3" width="15" height="13" />
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
          </div>
          <div>
            <div className="admin-stat-card__value">{stats.shipped}</div>
            <div className="admin-stat-card__label">Shipped</div>
          </div>
        </div>

        <div className="admin-stat-card" style={{ ['--stat-color' as any]: '#10B981' }}>
          <div className="admin-stat-card__icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <div>
            <div className="admin-stat-card__value">{stats.delivered}</div>
            <div className="admin-stat-card__label">Delivered</div>
          </div>
        </div>

        <div className="admin-stat-card" style={{ ['--stat-color' as any]: '#E8A87C' }}>
          <div className="admin-stat-card__icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div>
            <div className="admin-stat-card__value">₹{stats.revenue.toLocaleString('en-IN')}</div>
            <div className="admin-stat-card__label">Revenue</div>
          </div>
        </div>
      </div>

      {/* Orders Table & Content */}
      <div className="order-manager-content">
        {/* Filter Pills */}
        <div className="order-filters">
          {['ALL', 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((tab) => (
            <button
              key={tab}
              className={`filter-btn ${filter === tab ? 'active' : ''}`}
              onClick={() => setFilter(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="order-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Patron / Customer</th>
                <th>Date</th>
                <th>Items</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <span className="font-mono text-brand-gold font-bold">#VL-{order.id}</span>
                    </td>
                    <td>
                      <div>
                        <div className="font-semibold text-white">{order.customerName || 'Imperial Patron'}</div>
                        <div className="text-xs text-brand-ivory/60">{order.customerEmail || 'patron@vastraloom.com'}</div>
                      </div>
                    </td>
                    <td>
                      <span className="text-xs text-brand-ivory/70">
                        {order.createdDate
                          ? new Date(order.createdDate).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })
                          : 'Recent'}
                      </span>
                    </td>
                    <td>
                      <span className="text-xs text-brand-ivory/80">
                        {order.items?.length || 1} {order.items?.length === 1 ? 'Heirloom Piece' : 'Items'}
                      </span>
                    </td>
                    <td>
                      <span className="font-mono font-bold text-brand-gold">
                        ₹{(order.totalAmount || 0).toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td>
                      <select
                        value={order.status || 'PENDING'}
                        onChange={(e) => onStatusChange(order.id, e.target.value)}
                        className="bg-brand-purple-dark/80 border border-brand-gold/30 rounded-lg py-1 px-2.5 text-xs text-brand-ivory focus:outline-none focus:border-brand-gold"
                        style={{ color: getStatusColor(order.status || 'PENDING') }}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                    <td>
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-1.5 rounded-lg border border-brand-gold/20 hover:border-brand-gold/50 text-brand-gold hover:bg-brand-gold/10 transition-colors"
                        title="View Details"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                    No orders currently in {filter} status.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="relative w-full max-w-xl bg-[#140a20] border border-brand-gold/30 rounded-2xl p-6 sm:p-8 shadow-2xl z-10 text-brand-ivory max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-brand-gold/20">
              <div>
                <h3 className="font-serif text-xl font-bold text-white">Order Details #VL-{selectedOrder.id}</h3>
                <span className="text-xs text-brand-gold">Status: {selectedOrder.status}</span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-full text-brand-ivory/60 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 py-4 text-sm">
              <div className="grid grid-cols-2 gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                <div>
                  <div className="text-xs text-brand-ivory/50 uppercase font-mono">Customer</div>
                  <div className="font-semibold text-white">{selectedOrder.customerName || 'N/A'}</div>
                  <div className="text-xs text-brand-ivory/70">{selectedOrder.customerEmail}</div>
                  <div className="text-xs text-brand-ivory/70">{selectedOrder.customerPhone || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-xs text-brand-ivory/50 uppercase font-mono">Shipping Address</div>
                  <div className="text-xs text-brand-ivory/80 leading-relaxed">
                    {selectedOrder.shippingAddress || 'Imperial Atelier Vault, New Delhi'}
                  </div>
                </div>
              </div>

              <div>
                <div className="text-xs text-brand-ivory/50 uppercase font-mono mb-2">Ordered Weaves</div>
                <div className="space-y-2">
                  {selectedOrder.items && selectedOrder.items.length > 0 ? (
                    selectedOrder.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5"
                      >
                        <div>
                          <div className="font-semibold text-white">{item.productName}</div>
                          <div className="text-xs text-brand-ivory/60">Qty: {item.quantity}</div>
                        </div>
                        <div className="font-mono text-brand-gold font-bold">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-xs text-brand-ivory/60 bg-white/5 rounded-xl">
                      Signature Banarasi Heirloom (Qty: 1)
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-brand-gold/20 font-mono text-base">
                <span className="font-bold text-white">Total Amount</span>
                <span className="font-bold text-brand-gold text-lg">
                  ₹{(selectedOrder.totalAmount || 0).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
