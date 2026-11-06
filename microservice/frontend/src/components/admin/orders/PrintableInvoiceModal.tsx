import React from 'react';
import { Order } from '@/types';
import { X, Printer, ShieldCheck, Award } from 'lucide-react';

interface PrintableInvoiceModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PrintableInvoiceModal: React.FC<PrintableInvoiceModalProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white text-gray-900 rounded-2xl max-w-2xl w-full p-8 text-xs space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl relative">
        {/* Header with Print & Close controls */}
        <div className="flex justify-between items-start border-b border-gray-200 pb-4">
          <div>
            <div className="flex items-center gap-2 text-brand-purple-dark font-serif text-xl font-bold">
              <span>KHANDUA LOOMS</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-sans uppercase font-bold tracking-wider">
                Certified Tax Invoice
              </span>
            </div>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Nuapatna Handloom Cluster, Cuttack, Odisha 754035 • GSTIN: 21AAACK1234F1Z8
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3.5 py-1.5 rounded-lg bg-gray-900 text-white font-bold text-xs flex items-center gap-1.5 hover:bg-gray-800 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Meta Grid */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-[10px] text-gray-400 uppercase font-bold block">
              Billed & Shipped To:
            </span>
            <p className="font-bold text-gray-900 text-sm mt-0.5">{order.customerName}</p>
            <p className="text-gray-600 mt-0.5">{order.shippingAddress}</p>
            {order.city && order.state && (
              <p className="text-gray-600">{order.city}, {order.state} - {order.pincode}</p>
            )}
            <p className="text-gray-500 mt-1">Contact: {order.customerPhone || order.customerEmail}</p>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-gray-400 uppercase font-bold block">
              Invoice Reference:
            </span>
            <p className="font-mono font-bold text-sm text-gray-900 mt-0.5">
              #INV-KHL-{order.id}
            </p>
            <p className="text-gray-500">
              Date: {order.createdDate ? new Date(order.createdDate).toLocaleDateString() : 'Today'}
            </p>
            <p className="text-gray-500">Payment: {order.paymentMethod || 'Razorpay Online'}</p>
            <p className="text-emerald-700 font-bold mt-1">STATUS: {order.status || 'CONFIRMED'}</p>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 text-[10px] uppercase font-bold">
              <tr>
                <th className="py-2.5 px-3">Description</th>
                <th className="py-2.5 px-3 text-center">Qty</th>
                <th className="py-2.5 px-3 text-right">Unit Price</th>
                <th className="py-2.5 px-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(order.items || []).map((item, idx) => (
                <tr key={idx}>
                  <td className="py-2.5 px-3 font-medium text-gray-900">
                    {item.productName}
                    <span className="block text-[10px] text-gray-400">
                      GI Tag: Nuapatna Khandua Silk • Silk Mark Certified
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono">{item.quantity}</td>
                  <td className="py-2.5 px-3 text-right font-mono">₹{item.price.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total Breakdown */}
        <div className="border-t border-gray-200 pt-3 flex justify-end">
          <div className="w-64 space-y-1.5 text-xs text-right">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal:</span>
              <span className="font-mono">₹{(order.totalAmount || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>GST (Included 5%):</span>
              <span className="font-mono">₹{Math.round((order.totalAmount || 0) * 0.05).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping & Insured Transit:</span>
              <span className="font-bold text-emerald-700">FREE</span>
            </div>
            <div className="border-t border-gray-300 pt-2 flex justify-between text-sm font-bold text-gray-900">
              <span>Total Paid:</span>
              <span className="font-mono">₹{(order.totalAmount || 0).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Authenticity Dossier Seal */}
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between text-[11px] text-amber-900">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0" />
            <span>
              <strong>Silk Mark & GI Tag Certified</strong>: Authenticated by the Textiles Ministry & Odisha State Handloom Cooperative.
            </span>
          </div>
          <Award className="w-6 h-6 text-amber-600 shrink-0" />
        </div>
      </div>
    </div>
  );
};
