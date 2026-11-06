import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck, Calendar, ArrowRight, Eye, ShieldCheck, AlertCircle } from 'lucide-react';
import { useGetMyOrdersQuery } from '@/features/orders/ordersApi';
import { Order } from '@/types';
import { OrderDetailModal } from './OrderDetailModal';

export const OrderHistoryView: React.FC = () => {
  const { data: orders = [], isLoading, error } = useGetMyOrdersQuery();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-brand-gold/20 pb-5 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-brand-gold/70">
            Account & Deliveries
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-gold">
            My Handloom Orders
          </h1>
          <p className="text-xs text-brand-ivory/60 mt-1">
            Track your authentic GI-tagged Khandua and Sambalpuri silk handloom orders.
          </p>
        </div>

        <Link
          to="/catalog"
          className="self-start sm:self-auto px-4 py-2 rounded-full bg-brand-gold/15 border border-brand-gold/30 text-brand-gold text-xs font-bold uppercase tracking-wider hover:bg-brand-gold/25 transition-colors flex items-center gap-1.5"
        >
          <span>Explore Saree Collections</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-32 bg-[#170928]/60 rounded-xl border border-brand-gold/10 animate-pulse" />
          ))}
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 mb-6">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Unable to synchronize orders. Showing locally stored records.</span>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && orders.length === 0 && (
        <div className="text-center py-16 px-4 rounded-2xl bg-[#170928]/50 border border-brand-gold/15 space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-brand-gold/10 border border-brand-gold/25 flex items-center justify-center mx-auto text-brand-gold">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-lg font-bold text-brand-gold">No Orders Yet</h3>
          <p className="text-xs text-brand-ivory/60">
            You haven&apos;t placed any handloom orders yet. Explore our curated GI-certified Khandua silk collection.
          </p>
          <Link
            to="/catalog"
            className="inline-block px-6 py-2.5 rounded-full bg-gradient-to-r from-brand-gold to-brand-gold-light text-brand-purple-dark font-bold text-xs uppercase tracking-wider shadow-md"
          >
            Start Shopping
          </Link>
        </div>
      )}

      {/* Orders List */}
      <div className="space-y-5">
        {orders.map((order) => {
          const status = (order.orderStatus || order.status || 'CONFIRMED').toUpperCase();
          const isDelivered = status === 'DELIVERED';
          const isShipped = status === 'SHIPPED' || isDelivered;

          return (
            <div
              key={order.id}
              className="p-5 rounded-2xl bg-[#170928] border border-brand-gold/20 hover:border-brand-gold/40 transition-all space-y-4 shadow-lg"
            >
              {/* Top row: Order ID, Date, Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-brand-gold/15 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-brand-gold/10 border border-brand-gold/25 flex items-center justify-center text-brand-gold shrink-0">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-mono text-sm font-bold text-brand-gold">
                      #KHL-{order.id}
                    </span>
                    <div className="flex items-center gap-2 text-[11px] text-brand-ivory/50">
                      <Calendar className="w-3 h-3" />
                      <span>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Recent Order'}</span>
                      <span>•</span>
                      <span>{order.items?.length || 1} Item(s)</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <span
                    className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${
                      isDelivered
                        ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30'
                        : isShipped
                        ? 'bg-cyan-950/60 text-cyan-300 border-cyan-500/30'
                        : 'bg-amber-950/60 text-amber-300 border-amber-500/30'
                    }`}
                  >
                    {status}
                  </span>

                  <button
                    type="button"
                    onClick={() => setSelectedOrder(order)}
                    className="px-3 py-1.5 rounded-lg bg-[#140622] border border-brand-gold/25 text-brand-gold text-xs font-semibold hover:bg-brand-gold/15 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Details</span>
                  </button>
                </div>
              </div>

              {/* Items Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {(order.items || []).map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-[#140622] border border-brand-gold/10 flex items-center gap-3"
                  >
                    {item.productImage ? (
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-12 h-14 object-cover rounded-lg border border-brand-gold/20 shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-14 bg-brand-gold/10 rounded-lg flex items-center justify-center text-brand-gold shrink-0">
                        <Package className="w-5 h-5" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-brand-ivory truncate">{item.productName}</p>
                      <p className="text-[10px] text-brand-ivory/50">Qty: {item.quantity}</p>
                      <p className="text-xs font-mono font-bold text-brand-gold">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom footer: total and tracking progression */}
              <div className="pt-3 border-t border-brand-gold/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-brand-ivory/60">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-[11px]">GI Tag & Silk Mark Guaranteed</span>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <span className="text-[11px] text-brand-ivory/50">Total Paid:</span>
                  <span className="font-serif text-base font-bold text-brand-gold">
                    ₹{(order.totalAmount || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Order Detail Modal */}
      <OrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
};
