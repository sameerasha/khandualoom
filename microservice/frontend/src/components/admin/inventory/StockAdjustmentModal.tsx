import React, { useState } from 'react';
import { InventoryRecord, StockAdjustmentRequest } from '@/features/admin/inventoryAdjustmentApi';
import { X, Boxes, Check, AlertCircle } from 'lucide-react';

interface StockAdjustmentModalProps {
  record: InventoryRecord | null;
  isOpen: boolean;
  adminUsername: string;
  onClose: () => void;
  onSave: (req: StockAdjustmentRequest) => void;
}

export const StockAdjustmentModal: React.FC<StockAdjustmentModalProps> = ({
  record,
  isOpen,
  adminUsername,
  onClose,
  onSave,
}) => {
  const [adjustmentType, setAdjustmentType] = useState<StockAdjustmentRequest['adjustmentType']>('RESTOCK');
  const [quantity, setQuantity] = useState<string>('1');
  const [reason, setReason] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen || !record) return null;

  const qtyNum = parseInt(quantity) || 0;
  const isDeduction = adjustmentType === 'DAMAGE_WRITEOFF';
  const delta = isDeduction ? -Math.abs(qtyNum) : Math.abs(qtyNum);
  const projectedStock = Math.max(0, record.availableStock + delta);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setErrorMsg('Mandatory audit compliance: please enter a detailed adjustment reason.');
      return;
    }
    if (qtyNum <= 0) {
      setErrorMsg('Quantity must be greater than zero.');
      return;
    }

    onSave({
      productId: record.id,
      sku: record.sku,
      adjustmentType,
      quantityDelta: delta,
      reason: reason.trim(),
      adjustedBy: adminUsername,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#170928] border border-brand-gold/30 rounded-2xl max-w-lg w-full p-6 text-xs text-brand-ivory space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center border-b border-brand-gold/15 pb-3">
          <div className="flex items-center gap-2">
            <Boxes className="w-4 h-4 text-brand-gold" />
            <h3 className="font-serif text-lg font-bold text-brand-gold">
              Stock Adjustment & Audit Ledger
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-brand-ivory/60 hover:text-white p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Product Reference Card */}
        <div className="p-3.5 rounded-xl bg-[#140622] border border-brand-gold/15 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-brand-gold">
              {record.sku}
            </span>
            <span className="text-[10px] text-brand-ivory/50 uppercase">
              {record.weave}
            </span>
          </div>
          <p className="font-medium text-brand-ivory">{record.name}</p>
          <div className="pt-2 flex items-center justify-between text-[11px] text-brand-ivory/60">
            <span>Current Available: <strong className="text-emerald-400 font-mono">{record.availableStock}</strong></span>
            <span>Reserved in Carts: <strong className="text-amber-400 font-mono">{record.reservedStock}</strong></span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-brand-gold font-semibold uppercase text-[10px] tracking-wider mb-1">
              Adjustment Type
            </label>
            <select
              value={adjustmentType}
              onChange={(e) => setAdjustmentType(e.target.value as any)}
              className="w-full px-3 py-2 rounded-lg bg-[#140622] border border-brand-gold/25 text-brand-ivory text-xs focus:outline-none focus:border-brand-gold"
            >
              <option value="RESTOCK">Restock / New Loom Production (+)</option>
              <option value="DAMAGE_WRITEOFF">Damage / Silk Weave Imperfection Write-off (-)</option>
              <option value="AUDIT_CORRECTION">Physical Atelier Audit Reconciliation (+/-)</option>
              <option value="RESERVATION_RELEASE">Expired Reservation Manual Release (+)</option>
            </select>
          </div>

          <div>
            <label className="block text-brand-gold font-semibold uppercase text-[10px] tracking-wider mb-1">
              Quantity Units *
            </label>
            <input
              type="number"
              min="1"
              max="500"
              required
              value={quantity}
              onChange={(e) => {
                setQuantity(e.target.value);
                setErrorMsg(null);
              }}
              className="w-full px-3 py-2 rounded-lg bg-[#140622] border border-brand-gold/25 text-brand-ivory text-xs focus:outline-none focus:border-brand-gold font-mono"
            />
          </div>

          <div>
            <label className="block text-brand-gold font-semibold uppercase text-[10px] tracking-wider mb-1">
              Mandatory Adjustment Reason (Audited) *
            </label>
            <textarea
              rows={2}
              required
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setErrorMsg(null);
              }}
              placeholder="e.g. Received new shipment of 2 pieces from Nuapatna Master Weaver Rabindra Patra"
              className="w-full px-3 py-2 rounded-lg bg-[#140622] border border-brand-gold/25 text-brand-ivory text-xs focus:outline-none focus:border-brand-gold resize-none"
            />
          </div>

          {/* Projected Stock Preview */}
          <div className="p-3 rounded-lg bg-[#1D0C30] border border-brand-gold/20 flex items-center justify-between text-xs">
            <span className="text-brand-ivory/70">Projected Available Stock:</span>
            <span className="font-mono font-bold text-brand-gold text-sm">
              {record.availableStock} ➔ {projectedStock} units
            </span>
          </div>

          <div className="pt-4 border-t border-brand-gold/15 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 text-brand-ivory/70 hover:text-white text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-brand-gold to-brand-gold-light text-brand-purple-dark font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Record & Audit Adjustment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
