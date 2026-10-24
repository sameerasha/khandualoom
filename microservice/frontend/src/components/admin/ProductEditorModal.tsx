import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Trash2, Sparkles } from 'lucide-react';
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

  const [newImageUrl, setNewImageUrl] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        images: product.images && product.images.length > 0 ? [...product.images] : [product.image || '/images/saree_purple_gold.png'],
      });
    } else {
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
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'originalPrice' ? Number(value) : value,
    }));
  };

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...(prev.images || []), newImageUrl.trim()],
      }));
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
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
                  <select
                    name="category"
                    value={formData.category || 'Banarasi'}
                    onChange={handleChange}
                    className="w-full bg-[#0E0518] border border-brand-gold/25 focus:border-brand-gold rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors cursor-pointer"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c} Weave
                      </option>
                    ))}
                  </select>
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
                  <select
                    name="badge"
                    value={formData.badge || 'Bestseller'}
                    onChange={handleChange}
                    className="w-full bg-[#0E0518] border border-brand-gold/25 focus:border-brand-gold rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors cursor-pointer"
                  >
                    {BADGES.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
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

            {/* Section 4: Imagery Showcase */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-brand-gold/15 space-y-4">
              <div className="text-xs font-mono uppercase tracking-wider text-brand-gold/90 border-b border-white/5 pb-2 flex items-center justify-between">
                <span>4. Master Showcase & Lookbook Angles</span>
                <span className="text-[10px] text-brand-ivory/50 font-normal">
                  {formData.images?.length || 1} Total Angles
                </span>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-brand-ivory/70 mb-2">
                  Primary Catalog Cover URL *
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    type="text"
                    name="image"
                    value={formData.image || ''}
                    onChange={handleChange}
                    required
                    placeholder="/images/saree_purple_gold.png"
                    className="flex-1 bg-[#0E0518] border border-brand-gold/25 focus:border-brand-gold rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none transition-colors"
                  />
                  {formData.image && (
                    <div className="w-14 h-14 rounded-xl border border-brand-gold/40 overflow-hidden shrink-0 bg-black shadow-md">
                      <img src={formData.image} alt="Cover Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Angles */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-brand-ivory/70 mb-2">
                  Add Additional Angle URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="Paste angle image path (e.g. /images/saree_detail_pallu.png)"
                    className="flex-1 bg-[#0E0518] border border-brand-gold/25 focus:border-brand-gold rounded-xl px-4 py-2 text-xs text-white placeholder-white/30 focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="px-4 py-2 rounded-xl bg-brand-gold/20 hover:bg-brand-gold/30 border border-brand-gold/40 text-brand-gold text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Attach</span>
                  </button>
                </div>

                {formData.images && formData.images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                    {formData.images.map((img, i) => (
                      <div
                        key={i}
                        className="relative group rounded-xl border border-brand-gold/25 overflow-hidden h-24 bg-black shadow-md"
                      >
                        <img
                          src={typeof img === 'string' ? img : (img as any).imageUrl}
                          alt={`Angle ${i}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(i)}
                          className="absolute top-1.5 right-1.5 p-1 rounded-md bg-black/80 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-950"
                          title="Remove Angle"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
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
    </AnimatePresence>
  );
};
