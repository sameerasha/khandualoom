import React, { useState } from 'react';
import { CouponDefinition, validateCouponCreation } from '@/features/admin/couponApi';
import { X, Tag, Check, AlertCircle } from 'lucide-react';

interface CouponEditorModalProps {
  coupon: CouponDefinition | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (coupon: CouponDefinition) => void;
}

export const CouponEditorModal: React.FC<CouponEditorModalProps> = ({
  coupon,
  isOpen,
  onClose,
  onSave,
}) => {
  const [code, setCode] = useState(coupon?.code || '');
  const [discountType, setDiscountType] = useState<'FLAT' | 'PERCENT'>(
    coupon?.discountType || 'FLAT'
  );
  const [value, setValue] = useState(coupon?.value?.toString() || '100');
  const [minOrder, setMinOrder] = useState(coupon?.minOrder?.toString() || '999');
  const [maxDiscount, setMaxDiscount] = useState(coupon?.maxDiscount?.toString() || '');
  const [usageLimit, setUsageLimit] = useState(coupon?.usageLimit?.toString() || '500');
  const [description, setDescription] = useState(coupon?.description || '');
  const [expiresAt, setExpiresAt] = useState(coupon?.expiresAt || '');
  const [isActive, setIsActive] = useState(coupon?.isActive ?? true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const candidate = {
      code: code.trim().toUpperCase(),
      discountType,
      value: parseFloat(value) || 0,
      minOrder: parseFloat(minOrder) || 0,
      maxDiscount: maxDiscount ? parseFloat(maxDiscount) : undefined,
      usageLimit: usageLimit ? parseInt(usageLimit) : undefined,
      description,
      expiresAt: expiresAt || undefined,
      isActive,
    };

    const validation = validateCouponCreation(candidate);
    if (!validation.isValid) {
      setErrorMsg(validation.error || 'Invalid coupon parameters');
      return;
    }

    const saved: CouponDefinition = {
      id: coupon?.id || `c-${Date.now()}`,
      ...candidate,
      usedCount: coupon?.usedCount || 0,
    };
    onSave(saved);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#170928] border border-brand-gold/30 rounded-2xl max-w-lg w-full p-6 text-xs text-brand-ivory space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center border-b border-brand-gold/15 pb-3">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-brand-gold" />
            <h3 className="font-serif text-lg font-bold text-brand-gold">
              {coupon ? 'Edit Promotional Coupon' : 'Create New Coupon Voucher'}
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

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-brand-gold font-semibold uppercase text-[10px] tracking-wider mb-1">
              Coupon Code * (Uppercase, No Spaces)
            </label>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase().replace(/\s/g, ''));
                setErrorMsg(null);
              }}
              placeholder="e.g. KHANDUA100"
              className="w-full px-3 py-2 rounded-lg bg-[#140622] border border-brand-gold/25 text-brand-gold font-mono font-bold text-xs uppercase focus:outline-none focus:border-brand-gold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-brand-gold font-semibold uppercase text-[10px] tracking-wider mb-1">
                Discount Type
              </label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg bg-[#140622] border border-brand-gold/25 text-brand-ivory text-xs focus:outline-none focus:border-brand-gold"
              >
                <option value="FLAT">Flat ₹ Discount</option>
                <option value="PERCENT">Percentage % Discount</option>
              </select>
            </div>

            <div>
              <label className="block text-brand-gold font-semibold uppercase text-[10px] tracking-wider mb-1">
                Discount Value * {discountType === 'FLAT' ? '(₹)' : '(%)'}
              </label>
              <input
                type="number"
                min="1"
                max={discountType === 'PERCENT' ? 90 : 50000}
                required
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#140622] border border-brand-gold/25 text-brand-ivory text-xs focus:outline-none focus:border-brand-gold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-brand-gold font-semibold uppercase text-[10px] tracking-wider mb-1">
                Minimum Cart Subtotal (₹)
              </label>
              <input
                type="number"
                min="0"
                value={minOrder}
                onChange={(e) => setMinOrder(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#140622] border border-brand-gold/25 text-brand-ivory text-xs focus:outline-none focus:border-brand-gold"
              />
            </div>

            <div>
              <label className="block text-brand-gold font-semibold uppercase text-[10px] tracking-wider mb-1">
                Max Discount Cap (₹, for % discounts)
              </label>
              <input
                type="number"
                min="0"
                value={maxDiscount}
                onChange={(e) => setMaxDiscount(e.target.value)}
                placeholder="Optional"
                className="w-full px-3 py-2 rounded-lg bg-[#140622] border border-brand-gold/25 text-brand-ivory text-xs focus:outline-none focus:border-brand-gold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-brand-gold font-semibold uppercase text-[10px] tracking-wider mb-1">
                Total Usage Limit
              </label>
              <input
                type="number"
                min="1"
                value={usageLimit}
                onChange={(e) => setUsageLimit(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#140622] border border-brand-gold/25 text-brand-ivory text-xs focus:outline-none focus:border-brand-gold"
              />
            </div>

            <div>
              <label className="block text-brand-gold font-semibold uppercase text-[10px] tracking-wider mb-1">
                Expiration Date
              </label>
              <input
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#140622] border border-brand-gold/25 text-brand-ivory text-xs focus:outline-none focus:border-brand-gold"
              />
            </div>
          </div>

          <div>
            <label className="block text-brand-gold font-semibold uppercase text-[10px] tracking-wider mb-1">
              Public Voucher Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. FLAT ₹100 OFF on all Handloom Sarees"
              className="w-full px-3 py-2 rounded-lg bg-[#140622] border border-brand-gold/25 text-brand-ivory text-xs focus:outline-none focus:border-brand-gold"
            />
          </div>

          <div className="pt-2 flex items-center gap-2">
            <input
              type="checkbox"
              id="isActiveCoupon"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="accent-brand-gold w-4 h-4 cursor-pointer"
            />
            <label htmlFor="isActiveCoupon" className="text-xs text-brand-ivory/80 cursor-pointer">
              Active for redemption on storefront
            </label>
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
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-brand-gold to-brand-gold-light text-brand-purple-dark font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Coupon</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
