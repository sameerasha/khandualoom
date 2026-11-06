import React, { useState } from 'react';
import { Order } from '@/types';
import {
  X,
  Truck,
  CheckCircle,
  Clock,
  Printer,
  ShieldCheck,
  Send,
  RotateCcw,
} from 'lucide-react';
import { PrintableInvoiceModal } from './PrintableInvoiceModal';

interface OrderFulfillmentDrawerProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (orderId: number, status: string, trackingInfo?: string) => Promise<void>;
}

export const OrderFulfillmentDrawer: React.FC<OrderFulfillmentDrawerProps> = ({
  order,
  isOpen,
  onClose,
  onStatusChange,
}) => {
  const [courierName, setCourierName] = useState('BlueDart Express');
  const [trackingNumber, setTrackingNumber] = useState(
    order?.orderTrackingNumber || `BD-KHL-${order?.id || 1001}`
  );
  const [targetStatus, setTargetStatus] = useState(
    order?.orderStatus || order?.status || 'CONFIRMED'
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [invoiceOpen, setInvoiceOpen] = useState(false);

  if (!isOpen || !order) return null;

  const currentStatus = (order.orderStatus || order.status || 'CONFIRMED').toUpperCase();

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      await onStatusChange(order.id, targetStatus, `${courierName}: ${trackingNumber}`);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end">
        <div className="w-full max-w-xl bg-[#170928] border-l border-brand-gold/25 h-full overflow-y-auto p-6 space-y-5 text-xs text-brand-ivory shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-brand-gold/15 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-brand-gold">
                  #KHL-{order.id}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-brand-gold/15 text-brand-gold border border-brand-gold/30">
                  {currentStatus}
                </span>
              </div>
              <span className="text-[11px] text-brand-ivory/50">
                Placed on {order.createdDate ? new Date(order.createdDate).toLocaleDateString() : 'Recent'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setInvoiceOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-[#140622] border border-brand-gold/25 text-brand-gold font-bold text-xs flex items-center gap-1.5 hover:bg-brand-gold/15 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Invoice</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-brand-ivory/60 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Fulfillment Status State Machine Transition */}
          <div className="p-4 rounded-xl bg-[#140622] border border-brand-gold/20 space-y-3">
            <span className="text-brand-gold font-bold uppercase text-[10px] tracking-wider block">
              Fulfillment State Machine Transition
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-brand-ivory/60 text-[10px] mb-1">
                  Change Fulfillment Status
                </label>
                <select
                  value={targetStatus}
                  onChange={(e) => setTargetStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#1D0C30] border border-brand-gold/25 text-brand-ivory text-xs focus:outline-none focus:border-brand-gold"
                >
                  <option value="CONFIRMED">CONFIRMED (Commission Received)</option>
                  <option value="PROCESSING">PROCESSING (Pit Loom Active)</option>
                  <option value="QUALITY_CHECK">QUALITY_CHECK (GI Tag Audit)</option>
                  <option value="SHIPPED">SHIPPED (Handed to Courier)</option>
                  <option value="DELIVERED">DELIVERED (Accepted by Patron)</option>
                  <option value="RETURN_REQUESTED">RETURN_REQUESTED (Inspection)</option>
                  <option value="CANCELLED">CANCELLED (Restocked)</option>
                </select>
              </div>

              <div>
                <label className="block text-brand-ivory/60 text-[10px] mb-1">
                  Courier Service
                </label>
                <select
                  value={courierName}
                  onChange={(e) => setCourierName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#1D0C30] border border-brand-gold/25 text-brand-ivory text-xs focus:outline-none focus:border-brand-gold"
                >
                  <option value="BlueDart Express">BlueDart Express (Insured)</option>
                  <option value="DTDC Heritage">DTDC Heritage Express</option>
                  <option value="India Post SpeedPost">India Post SpeedPost</option>
                  <option value="Delhivery Surface">Delhivery Surface</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-brand-ivory/60 text-[10px] mb-1">
                Tracking Waybill Number
              </label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="e.g. BD-892173910"
                className="w-full px-3 py-2 rounded-lg bg-[#1D0C30] border border-brand-gold/25 text-brand-ivory font-mono text-xs focus:outline-none focus:border-brand-gold"
              />
            </div>

            <button
              type="button"
              disabled={isUpdating}
              onClick={handleUpdate}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-gold to-brand-gold-light text-brand-purple-dark font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg hover:brightness-110 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isUpdating ? 'Updating Saga...' : 'Apply Status & Send Dispatch Notice'}</span>
            </button>
          </div>

          {/* Patron Delivery Information */}
          <div className="p-4 rounded-xl bg-[#140622] border border-brand-gold/15 space-y-2">
            <span className="text-brand-gold font-bold uppercase text-[10px] tracking-wider block">
              Patron & Delivery Destination
            </span>
            <p className="font-semibold text-brand-ivory text-sm">{order.customerName}</p>
            <p className="text-brand-ivory/70">{order.shippingAddress}</p>
            {order.city && order.state && (
              <p className="text-brand-ivory/60">
                {order.city}, {order.state} - <span className="font-mono">{order.pincode}</span>
              </p>
            )}
            <div className="pt-2 text-[11px] text-brand-ivory/50 flex flex-col gap-0.5">
              <span>Email: {order.customerEmail}</span>
              <span>Phone: {order.customerPhone || 'Not provided'}</span>
              <span>Payment Mode: {order.paymentMethod || 'Razorpay Gateway'}</span>
            </div>
          </div>

          {/* Ordered Saree Pieces */}
          <div className="space-y-2">
            <span className="text-brand-gold font-bold uppercase text-[10px] tracking-wider block">
              Ordered Handloom Masterpieces
            </span>
            {(order.items || []).map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-[#140622] border border-brand-gold/15 flex items-center gap-3"
              >
                {item.productImage && (
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="w-12 h-14 object-cover rounded-lg border border-brand-gold/20 shrink-0"
                  />
                )}
                <div className="flex-1">
                  <p className="font-semibold text-brand-ivory text-xs">{item.productName}</p>
                  <p className="text-[10px] text-brand-ivory/50">Qty: {item.quantity}</p>
                </div>
                <span className="font-mono font-bold text-brand-gold text-sm">
                  ₹{(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          {/* Total Paid */}
          <div className="pt-3 border-t border-brand-gold/15 flex items-center justify-between text-xs">
            <span className="text-brand-ivory/60 font-medium">Total Paid Valuation</span>
            <span className="font-serif text-lg font-bold text-brand-gold">
              ₹{(order.totalAmount || 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <PrintableInvoiceModal
        order={order}
        isOpen={invoiceOpen}
        onClose={() => setInvoiceOpen(false)}
      />
    </>
  );
};
