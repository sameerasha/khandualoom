import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, Sparkles, ChevronDown, Upload } from 'lucide-react';
import { Product } from '@/types';

interface ProductEditorModalProps {
  isOpen: boolean;
  product?: Product | null;
  onSave: (productData: Partial<Product>) => Promise<void>;
  onClose: () => void;
  loading?: boolean;
}

const CATEGORIES = ['Banarasi', 'Kanjeevaram', 'Chanderi', 'Tussar', 'Patola', 'Paithani', 'Mysore'];
const BADGES = ['Bestseller', 'Premium', 'Exclusive', 'Heirloom', 'New Arrival', 'Trending', 'Popular', 'Limited Edition'];

const ANGLE_METADATA = [
  { id: 1, name: 'Angle 1 (Cover)', label: 'Master Front View / Catalog Cover', placeholder: 'https://... or /images/saree_front.png' },
  { id: 2, name: 'Angle 2 (Pallu)', label: 'Pallu & Grand Zari Artistry', placeholder: 'https://... or /images/saree_pallu.png' },
  { id: 3, name: 'Angle 3 (Border)', label: 'Border & Selvedge Close-Up', placeholder: 'https://... or /images/saree_border.png' },
  { id: 4, name: 'Angle 4 (Pleats)', label: 'Pleats & Drape Silhouette', placeholder: 'https://... or /images/saree_pleats.png' },
  { id: 5, name: 'Angle 5 (Detail)', label: 'Blouse Piece & Reverse Texture', placeholder: 'https://... or /images/saree_blouse.png' },
];

export const ProductEditorModal: React.FC<ProductEditorModalProps> = ({
  isOpen,
  product,
  onSave,
  onClose,
  loading = false,
}) => {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    category: 'Banarasi',
    price: 19999,
    originalPrice: 24999,
    image: '/images/saree_purple_gold.png',
    description: '',
    fabric: 'Pure Mulberry Silk',
    weave: 'Kadwa Handloom',
    color: 'Royal Purple & Gold',
    badge: 'Bestseller',
    images: ['/images/saree_purple_gold.png'],
  });

  const [angleSlots, setAngleSlots] = useState<string[]>(['', '', '', '', '']);

  useEffect(() => {
    const slots = ['', '', '', '', ''];
    if (product) {
      if (product.images && product.images.length > 0) {
        product.images.slice(0, 5).forEach((img, idx) => {
          slots[idx] = typeof img === 'string' ? img : (img as any).imageUrl || '';
        });
      }
      if (!slots[0] && product.image) {
        slots[0] = product.image;
      }
      setFormData({
        ...product,
        images: slots.filter((s) => s.trim().length > 0),
      });
    } else {
      slots[0] = '/images/saree_purple_gold.png';
      setFormData({
        name: '',
        category: 'Banarasi',
        price: 24999,
        originalPrice: 29999,
        image: '/images/saree_purple_gold.png',
        description: '',
        fabric: 'Pure Katan Silk',
        weave: 'Kadwa Handloom Zari',
        color: 'Imperial Burgundy & 24K Gold',
        badge: 'Bestseller',
        images: ['/images/saree_purple_gold.png'],
      });
    }
    setAngleSlots(slots);
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'originalPrice' ? Number(value) : value,
    }));
  };

  const handleAngleUrlChange = (index: number, url: string) => {
    setAngleSlots((prev) => {
      const updated = [...prev];
      updated[index] = url;
      const validImages = updated.filter((u) => u.trim().length > 0);
      setFormData((f) => ({
        ...f,
        image: updated[0] || validImages[0] || f.image || '',
        images: validImages,
      }));
      return updated;
    });
  };

  const handleAngleFileUpload = (index: number, file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (!dataUrl) return;

      const img = new Image();
      img.onload = () => {
        const maxDimension = 1200;
        let width = img.width;
        let height = img.height;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          handleAngleUrlChange(index, compressedDataUrl);
        } else {
          handleAngleUrlChange(index, dataUrl);
        }
      };
      img.onerror = () => {
        handleAngleUrlChange(index, dataUrl);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleClearAngle = (index: number) => {
    handleAngleUrlChange(index, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validImages = angleSlots.filter((u) => u.trim().length > 0);
    const finalCover = angleSlots[0] || validImages[0] || formData.image || '/images/saree_purple_gold.png';
    await onSave({
      ...formData,
      image: finalCover,
      images: validImages.length > 0 ? validImages : [finalCover],
    });
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
        data-lenis-prevent="true"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-4xl max-h-[92vh] bg-gradient-to-b from-[#1A0B2C] via-[#120622] to-[#0A0314] border border-brand-gold/40 rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.85),0_0_40px_rgba(223,191,122,0.12)] overflow-hidden flex flex-col z-10 text-brand-ivory my-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-brand-gold/20 bg-[#160826]/90">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-brand-gold/15 border border-brand-gold/30 flex items-center justify-center text-brand-gold shadow-sm">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-brand-gold">
                  ATELIER COMMISSION PROTOCOL
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {product ? 'Edit Heirloom Saree Record' : 'Commission Masterpiece Saree'}
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-brand-ivory/60 hover:text-white flex items-center justify-center transition-all"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 overflow-y-auto space-y-6">
            {/* Section 1: Core Nomenclature */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-brand-gold/15 space-y-4">
              <div className="text-xs font-mono uppercase tracking-wider text-brand-gold/90 border-b border-white/5 pb-2">
                1. Identification & Nomenclature
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono uppercase tracking-wider text-brand-ivory/70 mb-2">
                    Saree Masterpiece Title *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Royal Shikargah Kadwa Silk Saree"
                    className="w-full bg-[#0E0518] border border-brand-gold/25 focus:border-brand-gold rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-brand-ivory/70 mb-2">
                    Weave Tradition *
                  </label>
                  <div className="relative">
                    <select
                      name="category"
                      value={formData.category || 'Banarasi'}
                      onChange={handleChange}
                      className="w-full appearance-none bg-[#0E0518] border border-brand-gold/30 hover:border-brand-gold/60 focus:border-brand-gold rounded-xl px-4 py-2.5 pr-10 text-sm text-white focus:outline-none transition-all cursor-pointer shadow-inner"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c} className="bg-[#120822] text-white py-1">
                          {c} Weave
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-brand-gold absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-80" />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Valuation & Attributes */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-brand-gold/15 space-y-4">
              <div className="text-xs font-mono uppercase tracking-wider text-brand-gold/90 border-b border-white/5 pb-2">
                2. Atelier Valuation & Craft Specifications
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-brand-ivory/70 mb-2">
                    Offered Price (₹ INR) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price || 0}
                    onChange={handleChange}
                    required
                    min={1}
                    className="w-full bg-[#0E0518] border border-brand-gold/25 focus:border-brand-gold rounded-xl px-4 py-2.5 text-sm font-mono text-brand-gold font-bold focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-brand-ivory/70 mb-2">
                    Original Price (₹ INR)
                  </label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice || 0}
                    onChange={handleChange}
                    className="w-full bg-[#0E0518] border border-brand-gold/25 focus:border-brand-gold rounded-xl px-4 py-2.5 text-sm font-mono text-brand-ivory/60 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-brand-ivory/70 mb-2">
                    Curatorial Badge
                  </label>
                  <div className="relative">
                    <select
                      name="badge"
                      value={formData.badge || 'Bestseller'}
                      onChange={handleChange}
                      className="w-full appearance-none bg-[#0E0518] border border-brand-gold/30 hover:border-brand-gold/60 focus:border-brand-gold rounded-xl px-4 py-2.5 pr-10 text-sm text-white focus:outline-none transition-all cursor-pointer shadow-inner"
                    >
                      {BADGES.map((b) => (
                        <option key={b} value={b} className="bg-[#120822] text-white py-1">
                          {b}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-brand-gold absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-80" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-brand-ivory/70 mb-2">
                    Fabric Composition
                  </label>
                  <input
                    type="text"
                    name="fabric"
                    value={formData.fabric || ''}
                    onChange={handleChange}
                    placeholder="e.g. Pure Katan Silk"
                    className="w-full bg-[#0E0518] border border-brand-gold/25 focus:border-brand-gold rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-brand-ivory/70 mb-2">
                    Weaving Technique
                  </label>
                  <input
                    type="text"
                    name="weave"
                    value={formData.weave || ''}
                    onChange={handleChange}
                    placeholder="e.g. Kadwa Handloom Zari"
                    className="w-full bg-[#0E0518] border border-brand-gold/25 focus:border-brand-gold rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-brand-ivory/70 mb-2">
                    Regal Colorway
                  </label>
                  <input
                    type="text"
                    name="color"
                    value={formData.color || ''}
                    onChange={handleChange}
                    placeholder="e.g. Crimson & 24K Gold"
                    className="w-full bg-[#0E0518] border border-brand-gold/25 focus:border-brand-gold rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Narrative Provenance */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-brand-gold/15 space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-brand-gold/90 border-b border-white/5 pb-2">
                3. Curatorial Storytelling & Historical Motif
              </div>
              <textarea
                name="description"
                rows={3}
                value={formData.description || ''}
                onChange={handleChange}
                placeholder="Narrate the ancestral loom origin, mythological motifs, zari purity, and draping character..."
                className="w-full bg-[#0E0518] border border-brand-gold/25 focus:border-brand-gold rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none transition-colors resize-none leading-relaxed"
              />
            </div>

            {/* Section 4: Imagery Showcase (5 Curated Angles with Direct Upload & URL) */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-brand-gold/15 space-y-4">
              <div className="border-b border-white/5 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-brand-gold/90 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
                    <span>4. Master Showcase Angles (Up to 5 Angles)</span>
                  </h4>
                  <p className="text-[11px] text-brand-ivory/60 mt-0.5 font-sans">
                    Upload image files directly or paste valid HTTP/HTTPS URLs for each perspective of the drape.
                  </p>
                </div>
                <div className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/30 text-brand-gold-light w-fit">
                  {angleSlots.filter((s) => s.trim().length > 0).length} / 5 Angles Configured
                </div>
              </div>

              {/* 5 Dedicated Angle Cards */}
              <div className="space-y-3.5">
                {ANGLE_METADATA.map((angle, idx) => {
                  const currentUrl = angleSlots[idx] || '';
                  const hasImage = currentUrl.trim().length > 0;

                  return (
                    <div
                      key={angle.id}
                      className={`p-3.5 rounded-xl border transition-all ${
                        hasImage
                          ? 'bg-black/40 border-brand-gold/35 shadow-sm'
                          : 'bg-black/20 border-white/10 hover:border-brand-gold/25'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-brand-gold/20 text-brand-gold border border-brand-gold/30">
                            {angle.name}
                          </span>
                          <span className="text-xs text-brand-ivory font-medium font-serif">
                            {angle.label}
                          </span>
                        </div>
                        {hasImage && (
                          <button
                            type="button"
                            onClick={() => handleClearAngle(idx)}
                            className="text-[11px] text-red-400/80 hover:text-red-300 flex items-center gap-1 self-start sm:self-auto transition-colors"
                            title="Remove this angle"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Clear Angle</span>
                          </button>
                        )}
                      </div>

                      <div className="flex items-start gap-3.5">
                        {/* Live Image Preview / Empty Slot */}
                        <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl border border-brand-gold/30 bg-[#0E0518] overflow-hidden shrink-0 flex items-center justify-center relative group shadow-md">
                          {hasImage ? (
                            <img
                              src={currentUrl}
                              alt={angle.label}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center p-2 text-center text-brand-ivory/30">
                              <Upload className="w-5 h-5 mb-1 text-brand-gold/40" />
                              <span className="text-[9px] font-mono uppercase">Empty</span>
                            </div>
                          )}
                        </div>

                        {/* Dual Input Controls: File Upload + URL Input */}
                        <div className="flex-1 space-y-2.5">
                          {/* Upload File Button */}
                          <div className="flex flex-wrap items-center gap-2">
                            <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-gold/15 hover:bg-brand-gold/25 border border-brand-gold/40 text-brand-gold text-xs font-mono uppercase tracking-wider transition-all hover:scale-[1.02] active:scale-[0.98]">
                              <Upload className="w-3.5 h-3.5" />
                              <span>{hasImage ? 'Replace Image File' : 'Upload Image File'}</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleAngleFileUpload(idx, file);
                                }}
                                className="hidden"
                              />
                            </label>
                            <span className="text-[10px] text-brand-ivory/40 font-mono">
                              PNG, JPG, WebP (Instant Preview)
                            </span>
                          </div>

                          {/* HTTP URL input */}
                          <div>
                            <div className="relative">
                              <input
                                type="text"
                                value={currentUrl}
                                onChange={(e) => handleAngleUrlChange(idx, e.target.value)}
                                placeholder={angle.placeholder}
                                className="w-full bg-[#0E0518] border border-brand-gold/25 focus:border-brand-gold rounded-lg px-3 py-1.5 text-xs text-white placeholder-white/25 focus:outline-none transition-colors font-mono"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions Bar */}
            <div className="pt-4 border-t border-brand-gold/20 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl border border-white/15 text-xs font-mono uppercase tracking-wider text-brand-ivory hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-brand-gold via-brand-gold-light to-brand-gold text-brand-purple-dark font-serif font-bold text-sm shadow-xl shadow-brand-gold/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {loading ? 'Publishing to Atelier...' : product ? 'Update Masterpiece Record' : 'Publish Saree to Catalog'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};
