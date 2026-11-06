import React from 'react';
import { Order } from '@/types';
import { X, ShieldCheck, Download, Truck } from 'lucide-react';

interface OrderDetailModalProps {
  order: Order | null;
  onClose: () => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#170928] border border-brand-gold/30 rounded-2xl max-w-2xl w-full p-6 text-xs text-brand-ivory/80 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-brand-gold/15 pb-3">
          <div>
            <h3 className="font-serif text-lg font-bold text-brand-gold">
              Order #{order.id} Details
            </h3>
            <span className="text-[11px] text-brand-ivory/50">
              Placed on {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Recent'}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-brand-ivory/60 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Banner */}
        <div className="p-3 rounded-lg bg-[#140622] border border-brand-gold/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-brand-gold" />
            <span className="font-semibold text-brand-ivory">Status:</span>
            <span className="px-2 py-0.5 rounded bg-brand-gold/15 text-brand-gold uppercase font-bold text-[10px]">
              {order.status || 'CONFIRMED'}
            </span>
          </div>

          <span className="text-brand-ivory/60 text-[11px]">Insured Delivery</span>
        </div>

        {/* Items List */}
        <div className="space-y-3">
          <span className="font-bold text-[11px] uppercase tracking-wider text-brand-gold-light block">
            Purchased Handloom Masterworks
          </span>

          {(order.items || []).map((item, idx) => (
            <div key={idx} className="p-3 rounded-lg bg-[#1A0A2C] border border-brand-gold/15 flex items-center gap-3">
              {item.productImage && (
                <img src={item.productImage} alt={item.productName} className="w-12 h-16 object-cover rounded" />
              )}
              <div className="flex-1">
                <p className="font-semibold text-brand-ivory">{item.productName}</p>
                <p className="text-[11px] text-brand-ivory/50">Qty: {item.quantity}</p>
              </div>
              <span className="font-mono font-bold text-brand-gold text-sm">
                ₹{(item.price * item.quantity).toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        {/* Shipping Address */}
        <div className="p-3.5 rounded-lg bg-[#140622] border border-brand-gold/15">
          <span className="font-bold text-[11px] uppercase tracking-wider text-brand-gold-light block mb-1">
            Shipping Address
          </span>
          <p className="text-brand-ivory font-medium">{order.shippingAddress || 'Customer Address'}</p>
          <p className="text-brand-ivory/60">Payment Method: {order.paymentMethod || 'Razorpay / UPI'}</p>
        </div>

        {/* Total & Invoice button */}
        <div className="pt-3 border-t border-brand-gold/15 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-brand-ivory/50 block">Total Amount Paid</span>
            <span className="font-serif text-lg font-bold text-brand-gold">
              ₹{(order.totalAmount || 0).toLocaleString()}
            </span>
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2 rounded bg-[#1D0C30] border border-brand-gold/30 text-brand-gold font-bold text-xs uppercase flex items-center gap-1.5 hover:bg-brand-gold/15 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Print Invoice</span>
          </button>
        </div>
      </div>
    </div>
  );
};
