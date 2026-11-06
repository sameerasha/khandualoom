import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  ChevronDown,
  Printer,
  X,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Sparkles,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { Order } from '@/types';

interface OrderManagerViewProps {
  orders: Order[];
  onStatusChange: (orderId: number, newStatus: string) => Promise<void>;
}

export const OrderManagerView: React.FC<OrderManagerViewProps> = ({ orders, onStatusChange }) => {
  const [filter, setFilter] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);

  // Helper to reliably retrieve status whether returned as orderStatus or status
  const getOrderStatus = (o?: Order | null): string => {
    return o?.orderStatus || o?.status || 'PENDING';
  };

  const filteredOrders =
    filter === 'ALL' ? orders : orders.filter((o) => getOrderStatus(o) === filter);

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => getOrderStatus(o) === 'PENDING').length,
    processing: orders.filter((o) => getOrderStatus(o) === 'PROCESSING').length,
    shipped: orders.filter((o) => getOrderStatus(o) === 'SHIPPED').length,
    delivered: orders.filter((o) => getOrderStatus(o) === 'DELIVERED').length,
    cancelled: orders.filter((o) => getOrderStatus(o) === 'CANCELLED').length,
    revenue: orders
      .filter((o) => getOrderStatus(o) !== 'CANCELLED')
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0),
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
        return '#DFBF7A';
    }
  };

  const getStepIndex = (status?: string) => {
    switch (status) {
      case 'PENDING':
        return 0;
      case 'PROCESSING':
        return 1;
      case 'CONFIRMED':
        return 2;
      case 'SHIPPED':
        return 3;
      case 'DELIVERED':
        return 4;
      default:
        return 0;
    }
  };

  // Artisanal Handloom Processing Stages
  const ARTISANAL_STAGES = [
    {
      id: 'PENDING',
      title: 'Atelier Commission Received',
      tagline: 'Order verified & pure silk warp assigned',
      details: 'Handloom cooperative registers patron request. Pure Mulberry silk threads assigned to master weaver pit loom.',
    },
    {
      id: 'PROCESSING',
      title: 'Artisan Loom Weaving & Audit',
      tagline: 'Nuapatna Ikat weave & Kumbha border inspection',
      details: 'Weaving of authentic tie-dye Bandha motifs. Thread density calibration, zari purity testing, and temple spire alignment.',
    },
    {
      id: 'CONFIRMED',
      title: 'Sanctification & Wax Boxing',
      tagline: 'Fragrant ritual folding & imperial lacquer seal',
      details: 'Heirloom drape layered in protective muslin with natural vetiver sachets. Hand-embossed with red lacquer Khandua seal.',
    },
    {
      id: 'SHIPPED',
      title: 'Insured White-Glove Transit',
      tagline: 'Air-transit dispatched with high-value seal',
      details: 'Secured with tamper-evident consignment packaging. Transferred to premium priority express logistics with insured protection.',
    },
    {
      id: 'DELIVERED',
      title: 'Royal Patron Vault Delivery',
      tagline: 'Archival handover & provenance registered',
      details: 'Safely delivered to patron residence. Authenticity certificate of GI-tagged handloom entered into permanent ledger.',
    },
  ];

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    setIsUpdatingStatus(true);
    setStatusFeedback(null);
    try {
      await onStatusChange(orderId, newStatus);
      setStatusFeedback(`Status advanced to ${newStatus}`);
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) =>
          prev ? { ...prev, orderStatus: newStatus, status: newStatus } : null
        );
      }
      setTimeout(() => setStatusFeedback(null), 3000);
    } catch (err) {
      console.error('Failed to change status:', err);
      setStatusFeedback('Failed to update status. Please try again.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const currentModalStatus = getOrderStatus(selectedOrder);
  const currentStep = getStepIndex(currentModalStatus);

  return (
    <div className="order-manager animate-fadeIn">
      {/* Header */}
      <div className="admin-dashboard__header">
        <div>
          <h1 className="admin-dashboard__title flex items-center gap-3">
            Order Management
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full border border-brand-gold/40 bg-brand-gold/10 text-brand-gold font-normal">
              {stats.total} Orders
            </span>
          </h1>
          <p className="admin-dashboard__subtitle">
            Order Management & Fulfillment Lifecycle across Nuapatna weaving cooperatives and insured courier dispatches.
          </p>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="admin-dashboard__stats">
        <div className="admin-stat-card" style={{ ['--stat-color' as any]: '#1DA1F2' }}>
          <div className="admin-stat-card__icon">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <div className="admin-stat-card__value">{stats.total}</div>
            <div className="admin-stat-card__label">Total Orders</div>
          </div>
        </div>

        <div className="admin-stat-card" style={{ ['--stat-color' as any]: '#DFBF7A' }}>
          <div className="admin-stat-card__icon">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="admin-stat-card__value">{stats.pending}</div>
            <div className="admin-stat-card__label">Pending Allotment</div>
          </div>
        </div>

        <div className="admin-stat-card" style={{ ['--stat-color' as any]: '#F59E0B' }}>
          <div className="admin-stat-card__icon">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="admin-stat-card__value">{stats.processing}</div>
            <div className="admin-stat-card__label">Atelier In-Weave</div>
          </div>
        </div>

        <div className="admin-stat-card" style={{ ['--stat-color' as any]: '#3B82F6' }}>
          <div className="admin-stat-card__icon">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <div className="admin-stat-card__value">{stats.shipped}</div>
            <div className="admin-stat-card__label">In Insured Transit</div>
          </div>
        </div>

        <div className="admin-stat-card" style={{ ['--stat-color' as any]: '#10B981' }}>
          <div className="admin-stat-card__icon">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="admin-stat-card__value">{stats.delivered}</div>
            <div className="admin-stat-card__label">Delivered into Vaults</div>
          </div>
        </div>

        <div className="admin-stat-card" style={{ ['--stat-color' as any]: '#C5A059' }}>
          <div className="admin-stat-card__icon">
            <ShieldCheck className="w-5 h-5" />
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
        <div className="order-filters flex flex-wrap gap-2 mb-4">
          {[
            { id: 'ALL', label: 'All Orders', count: stats.total },
            { id: 'PENDING', label: 'Pending', count: stats.pending },
            { id: 'PROCESSING', label: 'In Weave', count: stats.processing },
            { id: 'SHIPPED', label: 'Dispatched', count: stats.shipped },
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

        {/* Scrollable Orders Table */}
        <div className="rounded-2xl border border-brand-gold/25 bg-[#0D0317]/95 overflow-hidden shadow-2xl">
          <div className="px-5 py-2.5 bg-brand-gold/5 border-b border-brand-gold/15 flex items-center justify-between text-[11px] font-mono text-brand-gold/80">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-gold animate-ping" />
              Live Heirloom Orders Ledger
            </span>
            <span className="flex items-center gap-1.5 text-brand-ivory/50">
              <span>Scroll horizontally to inspect full timeline & details</span>
              <span className="text-brand-gold font-bold">⟷</span>
            </span>
          </div>

          <div className="overflow-x-auto custom-gold-scrollbar">
            <table className="w-full min-w-[980px] text-left border-collapse">
              <thead>
                <tr className="border-b border-brand-gold/20 bg-white/[0.02] text-xs font-mono uppercase tracking-wider text-brand-gold/90">
                  <th className="py-4 px-5 whitespace-nowrap min-w-[140px]">Order ID</th>
                  <th className="py-4 px-5 whitespace-nowrap min-w-[220px]">Patron / Customer</th>
                  <th className="py-4 px-5 whitespace-nowrap min-w-[130px]">Order Date</th>
                  <th className="py-4 px-5 whitespace-nowrap min-w-[150px]">Heirloom Pieces</th>
                  <th className="py-4 px-5 whitespace-nowrap min-w-[150px]">Valuation</th>
                  <th className="py-4 px-5 whitespace-nowrap min-w-[180px]">Fulfillment Status</th>
                  <th className="py-4 px-5 text-right whitespace-nowrap min-w-[120px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => {
                    const statusVal = getOrderStatus(order);
                    return (
                      <tr key={order.id} className="hover:bg-white/[0.03] transition-colors group">
                        <td className="py-4 px-5">
                          <span className="font-mono text-brand-gold font-bold">
                            #KL-{String(order.id).padStart(4, '0')}
                          </span>
                        </td>
                        <td className="py-4 px-5">
                          <div>
                            <div className="font-semibold text-white font-serif">
                              {order.customerName || 'Handloom Patron'}
                            </div>
                            <div className="text-xs text-brand-ivory/60 font-sans">
                              {order.customerEmail || 'patron@khandualoom.com'}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-5">
                          <span className="text-xs text-brand-ivory/70 font-mono">
                            {order.createdDate
                              ? new Date(order.createdDate).toLocaleDateString('en-IN', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                })
                              : 'Recent'}
                          </span>
                        </td>
                        <td className="py-4 px-5">
                          <span className="text-xs text-brand-ivory/80 font-mono">
                            {order.items?.length || 1} {order.items?.length === 1 ? 'Piece' : 'Pieces'}
                          </span>
                        </td>
                        <td className="py-4 px-5">
                          <span className="font-mono font-bold text-brand-gold">
                            ₹{(order.totalAmount || 0).toLocaleString('en-IN')}
                          </span>
                        </td>
                        <td className="py-4 px-5">
                          <div className="relative inline-block">
                            <select
                              value={statusVal}
                              onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                              className="appearance-none bg-[#140A22] border border-brand-gold/40 hover:border-brand-gold rounded-xl py-1.5 pl-3 pr-8 text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-brand-gold cursor-pointer shadow-inner transition-all"
                              style={{ color: getStatusColor(statusVal) }}
                            >
                              <option value="PENDING" className="bg-[#120822] text-amber-400">PENDING</option>
                              <option value="PROCESSING" className="bg-[#120822] text-blue-400">PROCESSING</option>
                              <option value="SHIPPED" className="bg-[#120822] text-purple-400">SHIPPED</option>
                              <option value="DELIVERED" className="bg-[#120822] text-emerald-400">DELIVERED</option>
                              <option value="CANCELLED" className="bg-[#120822] text-rose-400">CANCELLED</option>
                            </select>
                            <ChevronDown
                              className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-80"
                              style={{ color: getStatusColor(statusVal) }}
                            />
                          </div>
                        </td>
                        <td className="py-4 px-5 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedOrder(order)}
                            className="px-3 py-1.5 rounded-xl border border-brand-gold/40 hover:border-brand-gold bg-brand-gold/10 hover:bg-brand-gold/20 text-brand-gold text-xs font-mono transition-all flex items-center gap-1.5 ml-auto cursor-pointer shadow-sm"
                            title="Inspect Artisanal Processing & Print Manifest"
                          >
                            <span>Dossier</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-brand-ivory/50 font-sans">
                      No orders currently in {filter} status.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* LUXURY ARTISANAL ORDER DOSSIER MODAL                     */}
      {/* ======================================================== */}
      {selectedOrder && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
          onClick={() => setSelectedOrder(null)}
          data-lenis-prevent="true"
        >
          <div
            className="relative w-[96vw] max-w-4xl xl:max-w-5xl bg-gradient-to-b from-[#1C0C30] via-[#120622] to-[#0A0214] border border-brand-gold/50 rounded-3xl p-6 sm:p-8 shadow-[0_25px_90px_rgba(0,0,0,0.95),0_0_60px_rgba(223,191,122,0.2)] z-10 text-brand-ivory max-h-[92vh] overflow-y-auto my-auto custom-gold-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Header */}
            <div className="flex items-center justify-between pb-5 border-b border-brand-gold/25">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-gold to-amber-200 border border-brand-gold flex items-center justify-center text-brand-purple-dark font-serif font-black text-xl shadow-lg">
                  KL
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-brand-gold font-bold px-2 py-0.5 rounded bg-brand-gold/15 border border-brand-gold/30">
                      ATELIER DISPATCH DOSSIER
                    </span>
                    <span
                      className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border"
                      style={{
                        color: getStatusColor(currentModalStatus),
                        borderColor: `${getStatusColor(currentModalStatus)}55`,
                        backgroundColor: `${getStatusColor(currentModalStatus)}15`,
                      }}
                    >
                      {currentModalStatus}
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
                    Order #KL-{String(selectedOrder.id).padStart(4, '0')}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-3.5 py-2 rounded-xl bg-brand-gold/10 hover:bg-brand-gold/25 border border-brand-gold/40 text-brand-gold text-xs font-mono flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                  title="Print A4 Courier Manifest & Certificate"
                >
                  <Printer className="w-4 h-4" />
                  <span className="hidden sm:inline">Print Manifest</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-brand-ivory/60 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Status Feedback Toast */}
            {statusFeedback && (
              <div className="mt-4 p-3 rounded-xl bg-brand-gold/15 border border-brand-gold/40 text-xs font-mono text-brand-gold flex items-center gap-2 animate-fadeIn">
                <Sparkles className="w-4 h-4" />
                <span>{statusFeedback}</span>
              </div>
            )}

            {/* ARTISANAL PROGRESSION TIMELINE */}
            <div className="py-6 border-b border-brand-gold/20">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono uppercase tracking-widest text-brand-gold/90 font-bold">
                  Artisanal Handloom Fulfillment Pipeline
                </span>
                <span className="text-xs font-mono text-brand-ivory/50">
                  Stage {currentStep + 1} of 5
                </span>
              </div>

              {/* Progress Steps */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                {ARTISANAL_STAGES.map((stage, idx) => {
                  const isComplete = idx < currentStep;
                  const isCurrent = idx === currentStep;

                  return (
                    <div
                      key={stage.id}
                      onClick={() => handleStatusUpdate(selectedOrder.id, stage.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-left relative overflow-hidden group ${
                        isCurrent
                          ? 'bg-brand-gold/15 border-brand-gold shadow-[0_0_20px_rgba(223,191,122,0.25)] ring-1 ring-brand-gold/50'
                          : isComplete
                          ? 'bg-white/[0.04] border-emerald-500/30 hover:border-emerald-500/60'
                          : 'bg-white/[0.02] border-white/10 hover:border-brand-gold/30 opacity-60 hover:opacity-100'
                      }`}
                      title={`Click to set status to ${stage.id}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold border ${
                            isCurrent
                              ? 'bg-brand-gold text-brand-purple-dark border-brand-gold shadow-md'
                              : isComplete
                              ? 'bg-emerald-500 text-white border-emerald-500'
                              : 'bg-white/5 border-white/20 text-brand-ivory/40'
                          }`}
                        >
                          {isComplete ? '✓' : idx + 1}
                        </span>
                        {isCurrent && (
                          <span className="w-2 h-2 rounded-full bg-brand-gold animate-ping" />
                        )}
                      </div>
                      <div className="font-serif text-xs font-bold text-white line-clamp-1 group-hover:text-brand-gold transition-colors">
                        {stage.title}
                      </div>
                      <div className="text-[10px] text-brand-ivory/60 mt-1 line-clamp-2 leading-tight">
                        {stage.tagline}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ORDER DETAILS & ARTISAN PROVENANCE */}
            <div className="py-5 space-y-5">
              {/* Coordinates Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Patron Information */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-brand-gold/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-brand-gold">
                      Consignee / Patron
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-gold/10 text-brand-gold border border-brand-gold/30">
                      ROYAL PATRON
                    </span>
                  </div>
                  <div className="font-serif text-lg font-bold text-white">
                    {selectedOrder.customerName || 'Imperial Patron'}
                  </div>
                  <div className="space-y-1 text-xs text-brand-ivory/70">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-brand-gold" />
                      <span>{selectedOrder.customerEmail}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-brand-gold" />
                      <span>{selectedOrder.customerPhone || '+91 98765 43210'}</span>
                    </div>
                  </div>
                </div>

                {/* Shipping Destination */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-brand-gold/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-brand-gold">
                      Dispatch Address
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400">
                      INSURED TRANSIT
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-brand-ivory/80 leading-relaxed">
                    <MapPin className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                    <span>
                      {selectedOrder.shippingAddress || 'Imperial Suite Residence, Central Diplomatic Enclave, New Delhi - 110021'}
                      {selectedOrder.city ? `, ${selectedOrder.city}` : ''}
                      {selectedOrder.state ? `, ${selectedOrder.state}` : ''}
                      {selectedOrder.pincode ? ` - ${selectedOrder.pincode}` : ''}
                    </span>
                  </div>
                  <div className="pt-1 text-[11px] font-mono text-brand-gold">
                    Consignment Ref: KL-EXP-{String(selectedOrder.id).padStart(4, '0')}-IN
                  </div>
                </div>
              </div>

              {/* Commissioned Heirloom Pieces */}
              <div>
                <div className="text-xs font-mono uppercase tracking-widest text-brand-gold mb-2.5">
                  Commissioned Masterpieces in Vault Container
                </div>
                <div className="space-y-2.5">
                  {selectedOrder.items && selectedOrder.items.length > 0 ? (
                    selectedOrder.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.03] border border-brand-gold/15"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-black/40 border border-brand-gold/30 shrink-0">
                            <img
                              src={item.productImage || '/images/products/p3/front.jpg'}
                              alt={item.productName}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/images/products/p3/front.jpg';
                              }}
                            />
                          </div>
                          <div>
                            <div className="font-serif text-sm font-bold text-white">
                              {item.productName}
                            </div>
                            <div className="text-xs text-brand-ivory/60 font-mono">
                              Pure Mulberry Silk • Nuapatna Handloom • Qty: {item.quantity}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono text-brand-gold font-bold text-base">
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </div>
                          <div className="text-[10px] text-brand-ivory/50 font-mono">
                            ₹{item.price.toLocaleString('en-IN')} each
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 rounded-xl bg-white/[0.03] border border-brand-gold/15 flex items-center justify-between">
                      <div>
                        <div className="font-serif text-sm font-bold text-white">
                          Signature Nuapatna Khandua Silk Saree
                        </div>
                        <div className="text-xs text-brand-ivory/60 font-mono">
                          Pure Mulberry Silk • Phoda Kumbha Temple Border • Qty: 1
                        </div>
                      </div>
                      <div className="font-mono text-brand-gold font-bold text-base">
                        ₹{(selectedOrder.totalAmount || 34999).toLocaleString('en-IN')}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Total Realized Value & Advance Control */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-brand-gold/15 via-brand-gold/5 to-transparent border border-brand-gold/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-brand-gold">
                    Total Realized Valuation
                  </div>
                  <div className="font-mono text-2xl sm:text-3xl font-bold text-brand-gold-light mt-0.5">
                    ₹{(selectedOrder.totalAmount || 0).toLocaleString('en-IN')}
                  </div>
                  <div className="text-[11px] text-brand-ivory/50 font-sans mt-0.5">
                    Includes White-Glove Handloom Insurance & GI Authentication Seals
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-brand-ivory/70 hidden sm:inline">
                    Advance Status:
                  </span>
                  <select
                    value={currentModalStatus}
                    onChange={(e) => handleStatusUpdate(selectedOrder.id, e.target.value)}
                    disabled={isUpdatingStatus}
                    className="bg-[#140A22] border border-brand-gold rounded-xl py-2 pl-3 pr-8 text-xs font-mono font-bold focus:outline-none cursor-pointer text-brand-gold"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="PROCESSING">PROCESSING</option>
                    <option value="SHIPPED">SHIPPED</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Modal Bottom Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-brand-gold/20">
              <span className="text-xs font-mono text-brand-ivory/40">
                Payment: {selectedOrder.paymentMethod || 'COD'} ({selectedOrder.paymentStatus || 'VERIFIED'})
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-mono uppercase tracking-wider text-white transition-all cursor-pointer flex items-center gap-2"
                >
                  <Printer className="w-3.5 h-3.5 text-brand-gold" />
                  <span>Print A4 Manifest</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-5 py-2.5 rounded-xl bg-brand-gold text-brand-purple-dark font-bold text-xs uppercase tracking-wider hover:bg-brand-gold-light transition-all cursor-pointer shadow-lg shadow-brand-gold/20"
                >
                  Close Dossier
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ======================================================== */}
      {/* HIDDEN A4 PRINTABLE DISPATCH MANIFEST & SHIPPING LABEL    */}
      {/* ======================================================== */}
      {selectedOrder && (
        <div id="khandua-a4-manifest" className="print-manifest-container">
          <div className="manifest-page">
            {/* Manifest Header */}
            <div className="manifest-header">
              <div className="manifest-brand">
                <div className="manifest-logo">KL</div>
                <div>
                  <h1 className="manifest-title">KHANDUA LOOMS</h1>
                  <p className="manifest-subtitle">Atelier of Sacred Nuapatna Handlooms & Royal Silks</p>
                  <p className="manifest-reg">Govt. Handloom Cooperative Cluster Reg: #OR-NUAP-2024-KHD • GSTIN: 21AAACK1234F1Z8</p>
                </div>
              </div>
              <div className="manifest-barcode-box">
                <div className="manifest-barcode">||| | |||| ||| ||||| || |||</div>
                <div className="manifest-consignment">KL-EXP-{String(selectedOrder.id).padStart(4, '0')}-IN</div>
                <div className="manifest-date">
                  Date: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </div>
              </div>
            </div>

            {/* Courier Dispatch Band */}
            <div className="manifest-courier-band">
              <span>PRIORITY INSURED HANDLOOM AIR COURIER</span>
              <span>SIGNATURE MANDATORY UPON RECEIPT</span>
              <span>A4 DISPATCH MANIFEST & INVOICE</span>
            </div>

            {/* Addresses Grid */}
            <div className="manifest-address-grid">
              <div className="manifest-address-col">
                <div className="manifest-col-title">CONSIGNOR / SHIPPER:</div>
                <div className="manifest-name">KHANDUA LOOMS ATELIER VAULT</div>
                <div className="manifest-address-line">Weavers Cooperative Society, Sector 4</div>
                <div className="manifest-address-line">Nuapatna, Tigiria, Cuttack District</div>
                <div className="manifest-address-line">Odisha - 754035, Bharat (India)</div>
                <div className="manifest-contact">Telephone: +91 671 2894500 | concierge@khandualoom.com</div>
              </div>

              <div className="manifest-address-col manifest-consignee">
                <div className="manifest-col-title">CONSIGNEE / DELIVER TO:</div>
                <div className="manifest-name">{selectedOrder.customerName || 'Honorable Patron'}</div>
                <div className="manifest-address-line">{selectedOrder.shippingAddress || 'Residence Address'}</div>
                <div className="manifest-address-line">
                  {selectedOrder.city || ''} {selectedOrder.state || ''} - {selectedOrder.pincode || ''}
                </div>
                <div className="manifest-contact">
                  Telephone: {selectedOrder.customerPhone || 'N/A'} | {selectedOrder.customerEmail}
                </div>
              </div>
            </div>

            {/* Provenance & GI Tag Seal */}
            <div className="manifest-provenance-box">
              <div className="manifest-seal-text">
                <strong>CERTIFICATE OF AUTHENTICITY & PROVENANCE:</strong> This consignment contains authentic handwoven Odisha textiles certified by the Master Weavers of Nuapatna. 100% Handloom Mulberry Silk with sanctified temple calligraphic motifs. Silk Mark India & GI Tag registered.
              </div>
            </div>

            {/* Manifest Table */}
            <table className="manifest-table">
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>S.No</th>
                  <th>Description of Heirloom Weave</th>
                  <th style={{ width: '90px' }}>HSN Code</th>
                  <th style={{ width: '60px' }}>Quantity</th>
                  <th style={{ width: '100px' }}>Rate (₹)</th>
                  <th style={{ width: '110px' }}>Total Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.items && selectedOrder.items.length > 0 ? (
                  selectedOrder.items.map((item, idx) => (
                    <tr key={idx}>
                      <td style={{ textAlign: 'center' }}>{idx + 1}</td>
                      <td>
                        <strong>{item.productName}</strong>
                        <div style={{ fontSize: '9pt', color: '#555' }}>
                          Nuapatna Khandua Silk Saree • 100% Handcrafted
                        </div>
                      </td>
                      <td style={{ textAlign: 'center' }}>500720</td>
                      <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                      <td style={{ textAlign: 'right' }}>{item.price.toLocaleString('en-IN')}</td>
                      <td style={{ textAlign: 'right' }}>
                        {(item.price * item.quantity).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td style={{ textAlign: 'center' }}>1</td>
                    <td>
                      <strong>Traditional Nuapatna Khandua Silk Saree</strong>
                      <div style={{ fontSize: '9pt', color: '#555' }}>
                        Pure Mulberry Silk with Phoda Kumbha Border
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>500720</td>
                    <td style={{ textAlign: 'center' }}>1</td>
                    <td style={{ textAlign: 'right' }}>
                      {(selectedOrder.totalAmount || 34999).toLocaleString('en-IN')}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {(selectedOrder.totalAmount || 34999).toLocaleString('en-IN')}
                    </td>
                  </tr>
                )}
                <tr className="manifest-total-row">
                  <td colSpan={4} style={{ textAlign: 'left', fontWeight: 'bold' }}>
                    Payment Mode: {selectedOrder.paymentMethod || 'COD'} | Status: {getOrderStatus(selectedOrder)}
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 'bold' }}>Grand Total:</td>
                  <td style={{ textAlign: 'right', fontWeight: 'bold', fontSize: '11pt' }}>
                    ₹{(selectedOrder.totalAmount || 0).toLocaleString('en-IN')}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Handling and Security Notice */}
            <div className="manifest-instructions">
              <div className="manifest-care">
                <strong>Handling Instructions:</strong> Fragile Luxury Textile. Keep away from moisture & direct sunlight. Do not fold against zari weave.
              </div>
              <div className="manifest-courier-note">
                <strong>Courier Verification:</strong> Inspect outer lacquer seal before acceptance. For delivery discrepancies, call concierge immediately.
              </div>
            </div>

            {/* Signature Area */}
            <div className="manifest-signatures">
              <div className="manifest-sig-box">
                <div className="manifest-sig-line" />
                <div className="manifest-sig-label">Master Weaver / Loom Allotment</div>
              </div>
              <div className="manifest-sig-box">
                <div className="manifest-sig-line" />
                <div className="manifest-sig-label">Atelier Quality Assurance Officer</div>
              </div>
              <div className="manifest-sig-box">
                <div className="manifest-sig-line" />
                <div className="manifest-sig-label">Consignee Acceptance Signature</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
