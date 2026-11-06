import React, { useState } from 'react';
import {
  Banner,
  loadBanners,
  saveBanners,
} from '@/features/admin/bannerApi';
import {
  Image as ImageIcon,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Calendar,
  CheckCircle,
} from 'lucide-react';
import { BannerEditorModal } from './BannerEditorModal';

export const BannerManagerView: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>(() => loadBanners());
  const [filterPlacement, setFilterPlacement] = useState<string>('all');
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveBanner = (saved: Banner) => {
    let next: Banner[];
    const exists = banners.some((b) => b.id === saved.id);
    if (exists) {
      next = banners.map((b) => (b.id === saved.id ? saved : b));
      showToast('Banner updated successfully');
    } else {
      next = [saved, ...banners];
      showToast('New banner published successfully');
    }
    setBanners(next);
    saveBanners(next);
    setModalOpen(false);
    setEditingBanner(null);
  };

  const handleDeleteBanner = (id: string) => {
    if (window.confirm('Delete this promotional banner?')) {
      const next = banners.filter((b) => b.id !== id);
      setBanners(next);
      saveBanners(next);
      showToast('Banner deleted');
    }
  };

  const handleToggleStatus = (id: string) => {
    const next = banners.map((b) =>
      b.id === id ? { ...b, isActive: !b.isActive } : b
    );
    setBanners(next);
    saveBanners(next);
    showToast('Banner visibility toggled');
  };

  const filteredBanners = banners.filter((b) => {
    if (filterPlacement === 'all') return true;
    return b.placement === filterPlacement;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#170928] border border-brand-gold/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-brand-gold/70 block">
            Media & Campaign Engine
          </span>
          <h2 className="font-serif text-2xl font-bold text-brand-gold">
            Banner & Promotional Studio
          </h2>
          <p className="text-xs text-brand-ivory/60 mt-1">
            Manage hero sliders, festive campaign assets, and right-edge sticky discount tabs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {toastMessage && (
            <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-1.5 animate-fadeIn">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{toastMessage}</span>
            </span>
          )}

          <button
            type="button"
            onClick={() => {
              setEditingBanner(null);
              setModalOpen(true);
            }}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-gold to-brand-gold-light text-brand-purple-dark font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg hover:brightness-110 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Create New Banner</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
        {[
          { id: 'all', label: 'All Placements' },
          { id: 'hero', label: 'Hero Promotional' },
          { id: 'festive_sale', label: 'Festive Campaigns' },
          { id: 'sticky_tab', label: 'Sticky Discount Tab' },
          { id: 'category', label: 'Category Headers' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilterPlacement(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl font-medium whitespace-nowrap transition-colors cursor-pointer ${
              filterPlacement === tab.id
                ? 'bg-brand-gold text-brand-purple-dark font-bold shadow'
                : 'bg-[#140622] text-brand-ivory/70 hover:text-white border border-brand-gold/15'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Banners Grid / Table */}
      <div className="space-y-3">
        {filteredBanners.map((banner) => (
          <div
            key={banner.id}
            className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
              banner.isActive
                ? 'bg-[#170928] border-brand-gold/25 hover:border-brand-gold/40 shadow-lg'
                : 'bg-[#130720]/60 border-brand-gold/10 opacity-60'
            }`}
          >
            {/* Banner Thumbnail & Info */}
            <div className="flex items-center gap-4">
              {banner.desktopImage ? (
                <img
                  src={banner.desktopImage}
                  alt={banner.title}
                  className="w-20 h-14 object-cover rounded-xl border border-brand-gold/20 shrink-0"
                  onError={(e) => {
                    (e.target as any).style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-20 h-14 rounded-xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center text-brand-gold shrink-0">
                  <ImageIcon className="w-5 h-5" />
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-brand-gold/15 text-brand-gold border border-brand-gold/25">
                    {banner.placement}
                  </span>
                  <span className="text-[10px] text-brand-ivory/40 font-mono">
                    ID: {banner.id}
                  </span>
                </div>

                <h3 className="font-serif text-sm font-bold text-brand-gold">
                  {banner.title}
                </h3>
                {banner.subtitle && (
                  <p className="text-xs text-brand-ivory/70 mt-0.5">
                    {banner.subtitle}
                  </p>
                )}

                <div className="flex items-center gap-3 text-[11px] text-brand-ivory/50 mt-1">
                  <span>Target: <strong className="text-brand-ivory">{banner.ctaUrl}</strong></span>
                  {banner.startDate && banner.endDate && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{banner.startDate} to {banner.endDate}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
              <button
                type="button"
                onClick={() => handleToggleStatus(banner.id)}
                className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  banner.isActive
                    ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400'
                    : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
                }`}
              >
                {banner.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>{banner.isActive ? 'Active' : 'Inactive'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEditingBanner(banner);
                  setModalOpen(true);
                }}
                className="p-2 rounded-xl bg-[#140622] border border-brand-gold/20 text-brand-gold hover:bg-brand-gold/15 text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>

              <button
                type="button"
                onClick={() => handleDeleteBanner(banner.id)}
                className="p-2 rounded-xl bg-rose-950/30 border border-rose-500/20 text-rose-300 hover:bg-rose-900/40 text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Editor Modal */}
      <BannerEditorModal
        banner={editingBanner}
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingBanner(null);
        }}
        onSave={handleSaveBanner}
      />
    </div>
  );
};
