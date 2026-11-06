import React, { useState } from 'react';
import {
  CouponDefinition,
  BankOffer,
  loadCoupons,
  saveCoupons,
  loadBankOffers,
  saveBankOffers,
} from '@/features/admin/couponApi';
import {
  Tag,
  Plus,
  CreditCard,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle,
  Copy,
  Clock,
  Sparkles,
} from 'lucide-react';
import { CouponEditorModal } from './CouponEditorModal';

export const PromotionsManagerView: React.FC = () => {
  const [coupons, setCoupons] = useState<CouponDefinition[]>(() => loadCoupons());
  const [bankOffers, setBankOffers] = useState<BankOffer[]>(() => loadBankOffers());
  const [activeTab, setActiveTab] = useState<'coupons' | 'bank_offers'>('coupons');
  const [editingCoupon, setEditingCoupon] = useState<CouponDefinition | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveCoupon = (saved: CouponDefinition) => {
    let next: CouponDefinition[];
    const exists = coupons.some((c) => c.id === saved.id);
    if (exists) {
      next = coupons.map((c) => (c.id === saved.id ? saved : c));
      showToast('Coupon voucher updated');
    } else {
      next = [saved, ...coupons];
      showToast('New coupon code created');
    }
    setCoupons(next);
    saveCoupons(next);
    setModalOpen(false);
    setEditingCoupon(null);
  };

  const handleDeleteCoupon = (id: string) => {
    if (window.confirm('Delete this coupon code?')) {
      const next = coupons.filter((c) => c.id !== id);
      setCoupons(next);
      saveCoupons(next);
      showToast('Coupon deleted');
    }
  };

  const handleToggleCoupon = (id: string) => {
    const next = coupons.map((c) =>
      c.id === id ? { ...c, isActive: !c.isActive } : c
    );
    setCoupons(next);
    saveCoupons(next);
    showToast('Coupon status updated');
  };

  const handleToggleBankOffer = (id: string) => {
    const next = bankOffers.map((b) =>
      b.id === id ? { ...b, isActive: !b.isActive } : b
    );
    setBankOffers(next);
    saveBankOffers(next);
    showToast('Bank offer visibility updated');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#170928] border border-brand-gold/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-brand-gold/70 block">
            Promotions & Incentive Engine
          </span>
          <h2 className="font-serif text-2xl font-bold text-brand-gold">
            Coupons & Bank Campaigns
          </h2>
          <p className="text-xs text-brand-ivory/60 mt-1">
            Manage discount codes, Coupons Corner vouchers, and banking partner tickers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {toastMessage && (
            <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-1.5 animate-fadeIn">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{toastMessage}</span>
            </span>
          )}

          {activeTab === 'coupons' && (
            <button
              type="button"
              onClick={() => {
                setEditingCoupon(null);
                setModalOpen(true);
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-gold to-brand-gold-light text-brand-purple-dark font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg hover:brightness-110 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Create New Coupon</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-brand-gold/15 pb-2 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('coupons')}
          className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'coupons'
              ? 'bg-brand-gold text-brand-purple-dark shadow'
              : 'text-brand-ivory/70 hover:text-white'
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          <span>Discount Coupons ({coupons.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('bank_offers')}
          className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'bank_offers'
              ? 'bg-brand-gold text-brand-purple-dark shadow'
              : 'text-brand-ivory/70 hover:text-white'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Bank Partner Offers ({bankOffers.length})</span>
        </button>
      </div>

      {/* Tab 1: Coupons */}
      {activeTab === 'coupons' && (
        <div className="space-y-3">
          {coupons.map((coupon) => (
            <div
              key={coupon.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                coupon.isActive
                  ? 'bg-[#170928] border-brand-gold/25 hover:border-brand-gold/40 shadow-lg'
                  : 'bg-[#130720]/60 border-brand-gold/10 opacity-60'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-gold/20 to-brand-gold/5 border border-brand-gold/30 flex flex-col items-center justify-center text-center shrink-0">
                  <span className="font-mono text-xs font-bold text-brand-gold">
                    {coupon.discountType === 'FLAT' ? `₹${coupon.value}` : `${coupon.value}%`}
                  </span>
                  <span className="text-[9px] uppercase text-brand-ivory/60 font-semibold">
                    OFF
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded font-mono font-bold text-xs uppercase bg-[#140622] text-brand-gold border border-brand-gold/30 flex items-center gap-1.5">
                      <span>{coupon.code}</span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard?.writeText(coupon.code);
                          showToast(`Copied ${coupon.code}`);
                        }}
                        className="text-brand-ivory/40 hover:text-brand-gold cursor-pointer"
                        title="Copy code"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </span>

                    <span className="text-[10px] text-brand-ivory/40">
                      Min Order: ₹{coupon.minOrder.toLocaleString()}
                    </span>
                  </div>

                  <p className="text-xs font-medium text-brand-ivory">
                    {coupon.description || 'Promotional Discount'}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-brand-ivory/50 mt-1">
                    <span>
                      Redemptions:{' '}
                      <strong className="text-brand-gold font-mono">
                        {coupon.usedCount}
                      </strong>
                      {coupon.usageLimit ? ` / ${coupon.usageLimit}` : ' (Unlimited)'}
                    </span>
                    {coupon.expiresAt && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Expires: {coupon.expiresAt}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                <button
                  type="button"
                  onClick={() => handleToggleCoupon(coupon.id)}
                  className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    coupon.isActive
                      ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400'
                      : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
                  }`}
                >
                  {coupon.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{coupon.isActive ? 'Active' : 'Disabled'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEditingCoupon(coupon);
                    setModalOpen(true);
                  }}
                  className="p-2 rounded-xl bg-[#140622] border border-brand-gold/20 text-brand-gold hover:bg-brand-gold/15 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteCoupon(coupon.id)}
                  className="p-2 rounded-xl bg-rose-950/30 border border-rose-500/20 text-rose-300 hover:bg-rose-900/40 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Bank Offers */}
      {activeTab === 'bank_offers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bankOffers.map((offer) => (
            <div
              key={offer.id}
              className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                offer.isActive
                  ? 'bg-[#170928] border-brand-gold/25 shadow-lg'
                  : 'bg-[#130720]/60 border-brand-gold/10 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-gold/10 border border-brand-gold/25 flex items-center justify-center text-brand-gold shrink-0">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-sm font-bold text-brand-gold">
                      {offer.bankName}
                    </span>
                    <span className="text-[10px] text-brand-ivory/50">
                      ({offer.cardType})
                    </span>
                  </div>
                  <p className="text-xs text-brand-ivory/80 mt-0.5 font-medium">
                    {offer.discountText}
                  </p>
                  <p className="text-[11px] text-brand-ivory/50 mt-0.5">
                    Min Spend: ₹{offer.minSpend.toLocaleString()} • Max Disc: ₹{offer.maxDiscount.toLocaleString()}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleToggleBankOffer(offer.id)}
                className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                  offer.isActive
                    ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400'
                    : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
                }`}
              >
                {offer.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>{offer.isActive ? 'Active' : 'Off'}</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Editor Modal */}
      <CouponEditorModal
        coupon={editingCoupon}
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingCoupon(null);
        }}
        onSave={handleSaveCoupon}
      />
    </div>
  );
};
