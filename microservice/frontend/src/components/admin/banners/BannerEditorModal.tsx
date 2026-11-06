import React, { useState } from 'react';
import { Banner } from '@/features/admin/bannerApi';
import { X, Image as ImageIcon, Check } from 'lucide-react';

interface BannerEditorModalProps {
  banner: Banner | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (banner: Banner) => void;
}

export const BannerEditorModal: React.FC<BannerEditorModalProps> = ({
  banner,
  isOpen,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState(banner?.title || '');
  const [subtitle, setSubtitle] = useState(banner?.subtitle || '');
  const [ctaText, setCtaText] = useState(banner?.ctaText || 'Shop Now');
  const [ctaUrl, setCtaUrl] = useState(banner?.ctaUrl || '/catalog');
  const [placement, setPlacement] = useState<Banner['placement']>(
    banner?.placement || 'hero'
  );
  const [desktopImage, setDesktopImage] = useState(banner?.desktopImage || '');
  const [mobileImage, setMobileImage] = useState(banner?.mobileImage || '');
  const [startDate, setStartDate] = useState(banner?.startDate || '');
  const [endDate, setEndDate] = useState(banner?.endDate || '');
  const [isActive, setIsActive] = useState(banner?.isActive ?? true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: Banner = {
      id: banner?.id || `ban-${Date.now()}`,
      title,
      subtitle,
      ctaText,
      ctaUrl,
      placement,
      desktopImage,
      mobileImage,
      startDate,
      endDate,
      isActive,
      order: banner?.order ?? 0,
    };
    onSave(updated);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#170928] border border-brand-gold/30 rounded-2xl max-w-xl w-full p-6 text-xs text-brand-ivory space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center border-b border-brand-gold/15 pb-3">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-brand-gold" />
            <h3 className="font-serif text-lg font-bold text-brand-gold">
              {banner ? 'Edit Promotional Banner' : 'Create New Banner'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-brand-ivory/60 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-brand-gold font-semibold uppercase text-[10px] tracking-wider mb-1">
              Banner Placement
            </label>
            <select
              value={placement}
              onChange={(e) => setPlacement(e.target.value as any)}
              className="w-full px-3 py-2 rounded-lg bg-[#140622] border border-brand-gold/25 text-brand-ivory text-xs focus:outline-none focus:border-brand-gold"
            >
              <option value="hero">Homepage Hero Banner</option>
              <option value="festive_sale">Festive Campaign Banner</option>
              <option value="sticky_tab">Right Sticky Discount Tab</option>
              <option value="category">Category Page Header</option>
              <option value="footer">Footer Offer Strip</option>
            </select>
          </div>

          <div>
            <label className="block text-brand-gold font-semibold uppercase text-[10px] tracking-wider mb-1">
              Banner Headline *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Right to Fashion Sale — 50-80% Off"
              className="w-full px-3 py-2 rounded-lg bg-[#140622] border border-brand-gold/25 text-brand-ivory text-xs focus:outline-none focus:border-brand-gold"
            />
          </div>

          <div>
            <label className="block text-brand-gold font-semibold uppercase text-[10px] tracking-wider mb-1">
              Subtitle / Subtext
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="e.g. Celebrate India, Celebrate Fashion"
              className="w-full px-3 py-2 rounded-lg bg-[#140622] border border-brand-gold/25 text-brand-ivory text-xs focus:outline-none focus:border-brand-gold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-brand-gold font-semibold uppercase text-[10px] tracking-wider mb-1">
                CTA Button Label
              </label>
              <input
                type="text"
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                placeholder="e.g. Explore Her"
                className="w-full px-3 py-2 rounded-lg bg-[#140622] border border-brand-gold/25 text-brand-ivory text-xs focus:outline-none focus:border-brand-gold"
              />
            </div>
            <div>
              <label className="block text-brand-gold font-semibold uppercase text-[10px] tracking-wider mb-1">
                CTA Target URL
              </label>
              <input
                type="text"
                value={ctaUrl}
                onChange={(e) => setCtaUrl(e.target.value)}
                placeholder="/catalog or /collections/Khandua"
                className="w-full px-3 py-2 rounded-lg bg-[#140622] border border-brand-gold/25 text-brand-ivory text-xs focus:outline-none focus:border-brand-gold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-brand-gold font-semibold uppercase text-[10px] tracking-wider mb-1">
                Desktop Image URL
              </label>
              <input
                type="text"
                value={desktopImage}
                onChange={(e) => setDesktopImage(e.target.value)}
                placeholder="/images/hero_handloom.jpg"
                className="w-full px-3 py-2 rounded-lg bg-[#140622] border border-brand-gold/25 text-brand-ivory text-xs focus:outline-none focus:border-brand-gold"
              />
            </div>
            <div>
              <label className="block text-brand-gold font-semibold uppercase text-[10px] tracking-wider mb-1">
                Mobile Image URL
              </label>
              <input
                type="text"
                value={mobileImage}
                onChange={(e) => setMobileImage(e.target.value)}
                placeholder="/images/hero_handloom_mob.jpg"
                className="w-full px-3 py-2 rounded-lg bg-[#140622] border border-brand-gold/25 text-brand-ivory text-xs focus:outline-none focus:border-brand-gold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-brand-gold font-semibold uppercase text-[10px] tracking-wider mb-1">
                Schedule Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#140622] border border-brand-gold/25 text-brand-ivory text-xs focus:outline-none focus:border-brand-gold"
              />
            </div>
            <div>
              <label className="block text-brand-gold font-semibold uppercase text-[10px] tracking-wider mb-1">
                Schedule End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#140622] border border-brand-gold/25 text-brand-ivory text-xs focus:outline-none focus:border-brand-gold"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="accent-brand-gold w-4 h-4 cursor-pointer"
            />
            <label htmlFor="isActive" className="text-xs text-brand-ivory/80 cursor-pointer">
              Set banner as active on storefront
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
              <span>Save Banner</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
