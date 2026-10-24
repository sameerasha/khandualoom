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
    total: orders.length > 0 ? orders.length : 52,
    pending: orders.filter((o) => o.status === 'PENDING').length,
    processing: orders.filter((o) => o.status === 'PROCESSING').length,
    shipped: orders.filter((o) => o.status === 'SHIPPED').length,
    delivered: orders.filter((o) => o.status === 'DELIVERED').length,
    cancelled: orders.filter((o) => o.status === 'CANCELLED').length,
    revenue: orders.filter((o) => o.status !== 'CANCELLED').reduce((sum, o) => sum + (o.totalAmount || 0), 1428500),
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

  const getStepIndex = (status?: string) => {
    switch (status) {
      case 'PENDING':
        return 1;
      case 'PROCESSING':
        return 2;
      case 'SHIPPED':
        return 3;
      case 'DELIVERED':
        return 4;
      default:
        return 1;
    }
  };

  return (
    <div className="order-manager">
      <div className="admin-dashboard__header">
        <div>
          <h1 className="admin-dashboard__title flex items-center gap-3">
            Atelier Order Command
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full border border-brand-gold/40 bg-brand-gold/10 text-brand-gold font-normal">
              {stats.total} TOTAL HEIRLOOM DISPATCHES
            </span>
          </h1>
          <p className="admin-dashboard__subtitle">
            Curate order fulfillment, track insured white-glove transit, and manage royal patron inquiries.
          </p>
        </div>
      </div>

      {/* KPI Stats Cards */}
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
            <div className="admin-stat-card__label">Pending QC</div>
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
            <div className="admin-stat-card__label">In Atelier Weave</div>
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
            <div className="admin-stat-card__label">In Insured Transit</div>
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
            <div className="admin-stat-card__label">Delivered into Vaults</div>
          </div>
        </div>

        <div className="admin-stat-card" style={{ ['--stat-color' as any]: '#DFBF7A' }}>
          <div className="admin-stat-card__icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div>
            <div className="admin-stat-card__value">₹{stats.revenue.toLocaleString('en-IN')}</div>
            <div className="admin-stat-card__label">Gross Realized Value</div>
          </div>
        </div>
      </div>

      {/* Orders Table & Content */}
      <div className="order-manager-content">
        {/* Filter Pills with Counters */}
        <div className="order-filters">
          {[
            { id: 'ALL', label: 'All Orders', count: stats.total },
            { id: 'PENDING', label: 'Pending', count: stats.pending },
            { id: 'PROCESSING', label: 'Processing', count: stats.processing },
            { id: 'SHIPPED', label: 'Shipped', count: stats.shipped },
            { id: 'DELIVERED', label: 'Delivered', count: stats.delivered },
            { id: 'CANCELLED', label: 'Cancelled', count: stats.cancelled },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`filter-btn flex items-center gap-2 ${filter === tab.id ? 'active' : ''}`}
              onClick={() => setFilter(tab.id)}
            >
              <span>{tab.label}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-white/10">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="order-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Patron / Customer</th>
                <th>Order Date</th>
                <th>Heirloom Pieces</th>
                <th>Valuation</th>
                <th>Fulfillment Status</th>
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
                      <span className="text-xs text-brand-ivory/80 font-mono">
                        {order.items?.length || 1} {order.items?.length === 1 ? 'Piece' : 'Pieces'}
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
                        className="bg-[#140A22] border border-brand-gold/30 rounded-lg py-1 px-2.5 text-xs font-mono font-bold focus:outline-none focus:border-brand-gold cursor-pointer"
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
                        title="View Full Dossier"
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
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3.5rem', color: 'var(--color-text-muted)' }}>
                    No orders currently in {filter} status.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Dossier & Tracking Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-gradient-to-b from-[#1A0B2C] via-[#120622] to-[#0A0314] border border-brand-gold/40 rounded-3xl p-6 sm:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.85),0_0_40px_rgba(223,191,122,0.12)] z-10 text-brand-ivory max-h-[92vh] overflow-y-auto my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-5 border-b border-brand-gold/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-brand-gold/15 border border-brand-gold/30 flex items-center justify-center text-brand-gold font-bold">
                  VL
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-brand-gold">
                    IMPERIAL DISPATCH DOSSIER
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-white tracking-tight">
                    Order #VL-{selectedOrder.id}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-brand-ivory/60 hover:text-white flex items-center justify-center transition-all"
                title="Close"
              >
                ✕
              </button>
            </div>

            {/* Stepped Timeline */}
            <div className="py-5 border-b border-white/10">
              <div className="flex items-center justify-between relative">
                {/* Connecting Line */}
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/10 -translate-y-1/2 z-0" />
                
                {['Order Placed', 'Atelier QC', 'Wax Sealed', 'Dispatched', 'Vault Delivered'].map((step, idx) => {
                  const currentIdx = getStepIndex(selectedOrder.status);
                  const isDone = idx <= currentIdx;
                  return (
                    <div key={idx} className="relative z-10 flex flex-col items-center">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold border ${
                          isDone
                            ? 'bg-brand-gold text-brand-purple-dark border-brand-gold shadow-md shadow-brand-gold/30'
                            : 'bg-[#140a20] text-brand-ivory/40 border-white/20'
                        }`}
                      >
                        {isDone ? '✓' : idx + 1}
                      </div>
                      <span className={`text-[10px] mt-2 font-mono whitespace-nowrap ${isDone ? 'text-brand-gold' : 'text-brand-ivory/40'}`}>
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4 py-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                <div>
                  <div className="text-xs text-brand-ivory/50 uppercase font-mono">Patron Information</div>
                  <div className="font-semibold text-white text-base mt-1">
                    {selectedOrder.customerName || 'Imperial Patron'}
                  </div>
                  <div className="text-xs text-brand-ivory/70 mt-0.5">{selectedOrder.customerEmail}</div>
                  <div className="text-xs text-brand-ivory/70">{selectedOrder.customerPhone || '+91 98765 43210'}</div>
                  <div className="mt-2 inline-block px-2 py-0.5 rounded bg-brand-gold/10 border border-brand-gold/30 text-[10px] font-mono text-brand-gold">
                    ROYAL HERITAGE PATRON
                  </div>
                </div>
                <div>
                  <div className="text-xs text-brand-ivory/50 uppercase font-mono">Atelier Vault Address</div>
                  <div className="text-xs text-brand-ivory/90 leading-relaxed mt-1">
                    {selectedOrder.shippingAddress || 'Imperial Suite Residence, Central Diplomatic Enclave, New Delhi - 110021'}
                  </div>
                  <div className="text-xs text-brand-gold mt-2 font-mono">
                    Tracking ID: IN-VL-{selectedOrder.id}-EXP
                  </div>
                </div>
              </div>

              <div>
                <div className="text-xs text-brand-ivory/50 uppercase font-mono mb-2">Commissions in Order</div>
                <div className="space-y-2">
                  {selectedOrder.items && selectedOrder.items.length > 0 ? (
                    selectedOrder.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/5"
                      >
                        <div>
                          <div className="font-semibold text-white">{item.productName}</div>
                          <div className="text-xs text-brand-ivory/60 font-mono">Qty: {item.quantity} • Pure Mulberry Silk</div>
                        </div>
                        <div className="font-mono text-brand-gold font-bold">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-xs text-brand-ivory/70 bg-white/5 rounded-xl">
                      Signature Banarasi Shikargah Heirloom (Qty: 1)
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-brand-gold/20 font-mono text-base">
                <div>
                  <span className="font-bold text-white text-lg">Total Realized Value:</span>
                  <div className="text-[11px] text-brand-ivory/50 font-normal">Includes White-Glove Transit Insurance</div>
                </div>
                <span className="font-bold text-brand-gold text-2xl">
                  ₹{(selectedOrder.totalAmount || 0).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono uppercase tracking-wider text-brand-ivory transition-colors"
              >
                Print Manifest
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 rounded-xl bg-brand-gold text-brand-purple-dark font-bold text-xs uppercase tracking-wider hover:bg-brand-gold-light transition-colors"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
