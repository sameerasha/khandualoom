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
    weave: 'Handloom',
    color: 'Royal Purple & Gold',
    badge: 'Bestseller',
    images: ['/images/saree_purple_gold.png'],
  });

  const [newImageUrl, setNewImageUrl] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        images: product.images && product.images.length > 0 ? [...product.images] : [product.image],
      });
    } else {
      setFormData({
        name: '',
        category: 'Banarasi',
        price: 19999,
        originalPrice: 24999,
        image: '/images/saree_purple_gold.png',
        description: '',
        fabric: 'Pure Mulberry Silk',
        weave: 'Handloom',
        color: 'Royal Purple & Gold',
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl max-h-[90vh] bg-[#160B24] border border-brand-gold/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10 text-brand-ivory"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-brand-gold/20 bg-brand-purple-dark/80">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-brand-gold" />
              <h3 className="font-serif text-xl font-bold text-white">
                {product ? 'Edit Heirloom Saree' : 'Curate New Handloom Saree'}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-brand-ivory/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 overflow-y-auto space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Saree Name */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-brand-gold mb-2">
                  Saree Title *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Royal Banarasi Shikargah"
                  className="w-full bg-[#1A0C28] border border-brand-gold/30 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-brand-gold"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-brand-gold mb-2">
                  Weave Category *
                </label>
                <select
                  name="category"
                  value={formData.category || 'Banarasi'}
                  onChange={handleChange}
                  className="w-full bg-[#1A0C28] border border-brand-gold/30 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-gold"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Price */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-brand-gold mb-2">
                  Price (₹ INR) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price || 0}
                  onChange={handleChange}
                  required
                  min={1}
                  className="w-full bg-[#1A0C28] border border-brand-gold/30 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-gold"
                />
              </div>

              {/* Original Price */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-brand-gold mb-2">
                  Original Price (₹ INR)
                </label>
                <input
                  type="number"
                  name="originalPrice"
                  value={formData.originalPrice || 0}
                  onChange={handleChange}
                  className="w-full bg-[#1A0C28] border border-brand-gold/30 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-gold"
                />
              </div>

              {/* Badge */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-brand-gold mb-2">
                  Atelier Badge
                </label>
                <select
                  name="badge"
                  value={formData.badge || 'Bestseller'}
                  onChange={handleChange}
                  className="w-full bg-[#1A0C28] border border-brand-gold/30 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-gold"
                >
                  {BADGES.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Fabric */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-brand-gold mb-2">
                  Fabric Composition
                </label>
                <input
                  type="text"
                  name="fabric"
                  value={formData.fabric || ''}
                  onChange={handleChange}
                  placeholder="e.g. Pure Katan Silk"
                  className="w-full bg-[#1A0C28] border border-brand-gold/30 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-gold"
                />
              </div>

              {/* Weave Type */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-brand-gold mb-2">
                  Weave Method
                </label>
                <input
                  type="text"
                  name="weave"
                  value={formData.weave || ''}
                  onChange={handleChange}
                  placeholder="e.g. Kadwa Handloom"
                  className="w-full bg-[#1A0C28] border border-brand-gold/30 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-gold"
                />
              </div>

              {/* Color */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-brand-gold mb-2">
                  Colorway
                </label>
                <input
                  type="text"
                  name="color"
                  value={formData.color || ''}
                  onChange={handleChange}
                  placeholder="e.g. Vermilion Red & Zari"
                  className="w-full bg-[#1A0C28] border border-brand-gold/30 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-gold"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-brand-gold mb-2">
                Curator Description
              </label>
              <textarea
                name="description"
                rows={3}
                value={formData.description || ''}
                onChange={handleChange}
                placeholder="Narrate the handloom origin, motifs, and zari technique..."
                className="w-full bg-[#1A0C28] border border-brand-gold/30 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-brand-gold resize-none"
              />
            </div>

            {/* Primary Image URL */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-brand-gold mb-2">
                Primary Showcase Image URL *
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  name="image"
                  value={formData.image || ''}
                  onChange={handleChange}
                  required
                  placeholder="/images/saree_purple_gold.png"
                  className="flex-1 bg-[#1A0C28] border border-brand-gold/30 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-brand-gold"
                />
                {formData.image && (
                  <div className="w-12 h-12 rounded-lg border border-brand-gold/30 overflow-hidden shrink-0 bg-black">
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>

            {/* Multi-Image Gallery */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-brand-gold mb-2">
                Gallery Angle URLs ({formData.images?.length || 0})
              </label>

              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="Paste additional angle URL (e.g. /images/saree_master_pallu.png)"
                  className="flex-1 bg-[#1A0C28] border border-brand-gold/30 rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-brand-gold"
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="px-4 py-2.5 rounded-xl bg-brand-gold/20 hover:bg-brand-gold/30 border border-brand-gold/40 text-brand-gold-light text-xs font-mono uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Angle</span>
                </button>
              </div>

              {formData.images && formData.images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {formData.images.map((img, i) => (
                    <div
                      key={i}
                      className="relative group rounded-xl border border-brand-gold/20 overflow-hidden h-20 bg-black"
                    >
                      <img
                        src={typeof img === 'string' ? img : img.imageUrl}
                        alt={`Gallery ${i}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(i)}
                        className="absolute top-1 right-1 p-1 rounded-md bg-black/70 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-950"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-brand-gold/15 flex items-center justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 rounded-full border border-brand-gold/30 text-xs font-mono uppercase tracking-wider text-brand-ivory hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 rounded-full bg-gradient-to-r from-brand-gold via-brand-gold-light to-brand-gold-dark text-brand-purple-dark font-serif font-bold text-sm shadow-xl shadow-brand-gold/20 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {loading ? 'Saving to Atelier...' : product ? 'Update Saree Record' : 'Publish Saree to Catalog'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
