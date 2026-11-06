import React, { useState } from 'react';
import { X, Monitor, Tablet, Smartphone, Sparkles, CheckCircle } from 'lucide-react';
import { HomepageSection } from '@/features/admin/homepageConfigSlice';

interface HomepagePreviewModalProps {
  isOpen: boolean;
  sections: HomepageSection[];
  onClose: () => void;
}

export const HomepagePreviewModal: React.FC<HomepagePreviewModalProps> = ({
  isOpen,
  sections,
  onClose,
}) => {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  if (!isOpen) return null;

  const enabledSections = sections
    .filter((s) => s.enabled)
    .filter((s) => s.deviceTarget === 'all' || s.deviceTarget === device);

  const containerWidthClass =
    device === 'desktop'
      ? 'w-full max-w-5xl'
      : device === 'tablet'
      ? 'w-[768px]'
      : 'w-[375px]';

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-6">
      {/* Top Bar with Device Switchers & Close */}
      <div className="w-full max-w-5xl flex items-center justify-between border-b border-brand-gold/20 pb-3 text-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brand-gold" />
          <span className="font-serif font-bold text-brand-gold text-sm">
            Live Viewport Preview
          </span>
          <span className="text-brand-ivory/50 hidden sm:inline">
            (Rendering {enabledSections.length} active sections)
          </span>
        </div>

        {/* Viewport Toggles */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#140622] border border-brand-gold/20">
          <button
            type="button"
            onClick={() => setDevice('desktop')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-semibold transition-all ${
              device === 'desktop'
                ? 'bg-brand-gold text-brand-purple-dark font-bold shadow'
                : 'text-brand-ivory/60 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Desktop</span>
          </button>

          <button
            type="button"
            onClick={() => setDevice('tablet')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-semibold transition-all ${
              device === 'tablet'
                ? 'bg-brand-gold text-brand-purple-dark font-bold shadow'
                : 'text-brand-ivory/60 hover:text-white'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tablet</span>
          </button>

          <button
            type="button"
            onClick={() => setDevice('mobile')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-semibold transition-all ${
              device === 'mobile'
                ? 'bg-brand-gold text-brand-purple-dark font-bold shadow'
                : 'text-brand-ivory/60 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mobile</span>
          </button>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-brand-ivory/60 hover:text-white hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Viewport Scroll Canvas */}
      <div className="flex-1 w-full overflow-y-auto py-6 flex items-start justify-center">
        <div
          className={`${containerWidthClass} bg-[#0F0617] border-2 border-brand-gold/30 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 min-h-[500px] text-xs text-brand-ivory space-y-4 p-4`}
        >
          {enabledSections.map((section, idx) => (
            <div
              key={section.id}
              className="p-4 rounded-xl bg-[#170928] border border-brand-gold/20 space-y-2 relative"
            >
              <div className="flex items-center justify-between text-[10px] text-brand-gold/60 uppercase font-bold">
                <span>
                  Section #{idx + 1}: {section.name}
                </span>
                <span className="px-2 py-0.5 rounded bg-brand-gold/15 text-brand-gold border border-brand-gold/30">
                  {section.type}
                </span>
              </div>
              <h4 className="font-serif text-base font-bold text-brand-gold">
                {section.title}
              </h4>
              {section.subtitle && (
                <p className="text-brand-ivory/70 text-xs">{section.subtitle}</p>
              )}

              {/* Wireframe Mock Content for Visual preview */}
              <div className="h-16 rounded bg-[#130720] border border-dashed border-brand-gold/20 flex items-center justify-center text-brand-ivory/40 text-[11px]">
                {section.type === 'hero' && 'Dynamic Campaign Carousel & Dual CTA'}
                {section.type === 'categories' && '5 Masterpiece Weave Tiles Grid'}
                {section.type === 'coupons' && 'Coupons Corner with Instant Code Copy'}
                {section.type === 'highlights' && 'Trending Saree 4-Column Product Grid'}
                {section.type === 'artisan' && 'Sacred Puri Weaving Narrative & GI Certificate'}
                {section.type === 'testimonials' && '5-Star Connoisseur Appraisals'}
                {section.type === 'newsletter' && 'Private Drops Newsletter Dispatch Box'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-[11px] text-brand-ivory/50 flex items-center gap-2">
        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
        <span>Layout accurately matches runtime ordering rules</span>
      </div>
    </div>
  );
};
