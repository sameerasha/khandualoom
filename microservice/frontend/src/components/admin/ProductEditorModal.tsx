import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Trash2,
  Sparkles,
  ChevronDown,
  Upload,
  ArrowLeft,
  Crown,
  Tag,
  Layers,
  CheckCircle2,
  Percent,
  Check,
  ShieldCheck,
  Image as ImageIcon,
} from 'lucide-react';
import { Product } from '@/types';

interface ProductEditorModalProps {
  isOpen: boolean;
  product?: Product | null;
  onSave: (productData: Partial<Product>) => Promise<void>;
  onClose: () => void;
  loading?: boolean;
  inline?: boolean;
}

const CATEGORIES = [
  { name: 'Banarasi', region: 'Varanasi, UP' },
  { name: 'Kanjeevaram', region: 'Tamil Nadu' },
  { name: 'Chanderi', region: 'Madhya Pradesh' },
  { name: 'Tussar', region: 'Bengal / Bihar' },
  { name: 'Patola', region: 'Patan, Gujarat' },
  { name: 'Paithani', region: 'Yeola, Maharashtra' },
  { name: 'Mysore', region: 'Karnataka' },
];

const BADGES = ['Bestseller', 'Heirloom', 'Exclusive', 'Limited Edition', 'New Arrival', 'Trending', 'Artisan Guild'];

const ANGLE_METADATA = [
  { id: 1, name: 'Angle 01 (Cover)', label: 'Master Front View & 3D Canvas Anchor', placeholder: 'https://... or /images/saree_front.png', desc: 'Primary thumbnail in catalog & hero cards' },
  { id: 2, name: 'Angle 02 (Pallu)', label: 'Grand Pallu & 24K Zari Artistry', placeholder: 'https://... or /images/saree_pallu.png', desc: 'Detailed ornamental weave & metallic lustre' },
  { id: 3, name: 'Angle 03 (Border)', label: 'Border, Selvedge & Motif Close-Up', placeholder: 'https://... or /images/saree_border.png', desc: 'High-res macro shot of zari weft density' },
  { id: 4, name: 'Angle 04 (Pleats)', label: 'Pleats Silhouette & Architectural Fall', placeholder: 'https://... or /images/saree_pleats.png', desc: 'Full length drape fluidity & fall dynamics' },
  { id: 5, name: 'Angle 05 (Lookbook)', label: 'Model Lookbook & Styling Ensemble', placeholder: 'https://... or /images/saree_blouse.png', desc: 'Editorial drape aesthetic with bespoke blouse' },
];

export const ProductEditorModal: React.FC<ProductEditorModalProps> = ({
  isOpen,
  product,
  onSave,
  onClose,
  loading = false,
  inline = false,
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
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isMasterDragOver, setIsMasterDragOver] = useState<boolean>(false);

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

  const handleAngleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleAngleDragLeave = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (dragOverIndex === index) {
      setDragOverIndex(null);
    }
  };

  const handleAngleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverIndex(null);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        handleAngleFileUpload(index, file);
      }
    }
  };

  const handleMasterDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMasterDragOver(true);
  };

  const handleMasterDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMasterDragOver(false);
  };

  const handleMasterDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMasterDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/'));
      files.slice(0, 5).forEach((file, idx) => {
        handleAngleFileUpload(idx, file);
      });
    }
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

  const price = Number(formData.price) || 0;
  const originalPrice = Number(formData.originalPrice) || 0;
  const hasDiscount = originalPrice > price && price > 0;
  const discountPercent = hasDiscount ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
  const savings = hasDiscount ? originalPrice - price : 0;
  const configuredAnglesCount = angleSlots.filter((s) => s.trim().length > 0).length;

  const renderFormFields = () => (
    <>
      {/* Section 1: Identification & Weave Lineage */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-brand-gold/30 shadow-lg space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/10 gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-brand-gold/15 border border-brand-gold/30 flex items-center justify-center text-brand-gold">
              <Crown className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-brand-gold font-bold">
                PHASE 01 • WEAVE NOMENCLATURE
              </span>
              <h3 className="font-serif text-base sm:text-lg font-bold text-white tracking-tight">
                Identification & Tradition Lineage
              </h3>
            </div>
          </div>
          <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/30 text-brand-gold-light w-fit">
            Master Registry
          </span>
        </div>

        {/* Saree Title and Weave Tradition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Saree Title */}
          <div className="lg:col-span-7">
            <label className="block text-xs font-mono uppercase tracking-wider text-brand-ivory/80 mb-2">
              Saree Masterpiece Title *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
              required
              placeholder="e.g. Royal Shikargah Kadwa Silk Saree"
              className="w-full bg-[#0E0518] border border-brand-gold/30 focus:border-brand-gold rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none transition-colors shadow-inner"
            />
            <p className="text-[11px] text-brand-ivory/50 font-sans mt-1.5">
              Enter the imperial curatorial title incorporating tradition and motif architecture.
            </p>
          </div>

          {/* Category / Tradition Selector */}
          <div className="lg:col-span-5">
            <label className="block text-xs font-mono uppercase tracking-wider text-brand-ivory/80 mb-2">
              Weave Tradition & Provenance *
            </label>
            <div className="relative">
              <select
                name="category"
                value={formData.category || 'Banarasi'}
                onChange={handleChange}
                className="w-full bg-[#0E0518] border border-brand-gold/30 focus:border-brand-gold rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors appearance-none cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.name} value={cat.name} className="bg-[#120622] text-white">
                    {cat.name} — {cat.region}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-brand-gold absolute right-3.5 top-3.5 pointer-events-none" />
            </div>
            <p className="text-[11px] text-brand-gold/70 font-mono mt-1.5">
              Origin: {CATEGORIES.find((c) => c.name === formData.category)?.region || 'Indian Handloom Enclave'}
            </p>
          </div>
        </div>

        {/* Instant Primary Cover Image & Dropzone (Prominently displayed right in Phase 01) */}
        <div
          onDragOver={(e) => handleAngleDragOver(e, 0)}
          onDragEnter={(e) => handleAngleDragOver(e, 0)}
          onDragLeave={(e) => handleAngleDragLeave(e, 0)}
          onDrop={(e) => handleAngleDrop(e, 0)}
          className={`p-4 rounded-2xl border-2 transition-all relative overflow-hidden ${
            dragOverIndex === 0
              ? 'border-brand-gold bg-brand-gold/25 shadow-[0_0_30px_rgba(223,191,122,0.4)] ring-2 ring-brand-gold/60 scale-[1.01]'
              : 'border-dashed border-brand-gold/40 bg-[#0E0418]/90 hover:border-brand-gold/70'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-xl border border-brand-gold/45 bg-black/60 overflow-hidden shrink-0 relative group shadow-md">
                <img
                  src={angleSlots[0] || formData.image || '/images/saree_purple_gold.png'}
                  alt="Cover Preview"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/saree_purple_gold.png';
                  }}
                />
                {dragOverIndex === 0 && (
                  <div className="absolute inset-0 bg-brand-purple-dark/85 backdrop-blur-xs flex flex-col items-center justify-center text-brand-gold text-center p-1 z-10">
                    <Upload className="w-5 h-5 mb-1 animate-bounce" />
                    <span className="text-[9px] font-mono font-bold uppercase">Drop Cover</span>
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-brand-gold font-bold px-2 py-0.5 rounded bg-brand-gold/15 border border-brand-gold/30">
                    PRIMARY CATALOG COVER PHOTO
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">Storefront Anchor</span>
                </div>
                <h4 className="font-serif font-bold text-white text-sm sm:text-base mt-1">
                  Cover Image & 3D Web Canvas Drape
                </h4>
                <p className="text-[11px] text-brand-ivory/60 font-sans mt-0.5">
                  Drag and drop a photo directly onto this card, or click the button to browse your device.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto shrink-0">
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-gold via-brand-gold-light to-amber-400 text-brand-purple-dark text-xs font-mono font-bold uppercase tracking-wider shadow-md shadow-brand-gold/25 hover:scale-[1.02] active:scale-[0.98] transition-all">
                <Upload className="w-4 h-4" />
                <span>Upload Cover Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleAngleFileUpload(0, file);
                  }}
                  className="hidden"
                />
              </label>
              <div className="text-[10px] text-brand-gold/80 font-mono px-2 py-1 rounded bg-black/40 border border-brand-gold/20">
                Or Drag & Drop file
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Pricing & Privilege Valuation Breakdown */}
        <div className="p-5 rounded-2xl bg-[#0B0314]/90 border border-brand-gold/25 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-2.5">
            <div className="flex items-center gap-2">
              <Percent className="w-4 h-4 text-brand-gold" />
              <span className="text-xs font-mono uppercase tracking-wider text-brand-gold font-bold">
                Live Pricing & Valuation Matrix
              </span>
            </div>
            {hasDiscount && (
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold animate-pulse">
                  {discountPercent}% PRIVILEGE ADVANTAGE
                </span>
                <span className="text-[11px] font-mono text-brand-gold">
                  (Save ₹{savings.toLocaleString('en-IN')})
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-brand-ivory/80 mb-2">
                Curated Acquisition Price (₹) *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-brand-gold font-mono text-sm font-bold">₹</span>
                <input
                  type="number"
                  name="price"
                  value={formData.price || 0}
                  onChange={handleChange}
                  required
                  min={0}
                  className="w-full bg-[#120620] border border-brand-gold/30 focus:border-brand-gold rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none transition-colors font-mono font-bold"
                />
              </div>
              <span className="text-[10px] text-brand-ivory/50 font-mono mt-1 block">
                Actual price charged to patron during acquisition
              </span>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-brand-ivory/80 mb-2">
                Original Vault Valuation (₹)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-brand-gold/60 font-mono text-sm">₹</span>
                <input
                  type="number"
                  name="originalPrice"
                  value={formData.originalPrice || 0}
                  onChange={handleChange}
                  min={0}
                  placeholder="e.g. 29999"
                  className="w-full bg-[#120620] border border-brand-gold/30 focus:border-brand-gold rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none transition-colors font-mono"
                />
              </div>
              <span className="text-[10px] text-brand-ivory/50 font-mono mt-1 block">
                Benchmark valuation struck through on storefront
              </span>
            </div>
          </div>
        </div>

        {/* Curatorial Badge Selector (Interactive Luxury Radio Pills) */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-brand-ivory/80 mb-2.5 flex items-center gap-2">
            <Tag className="w-3.5 h-3.5 text-brand-gold" />
            <span>Curatorial Badge & Storefront Distinction</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {BADGES.map((b) => {
              const isSelected = formData.badge === b;
              return (
                <button
                  key={b}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, badge: b }))}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 border cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-brand-gold/30 via-brand-gold/20 to-amber-400/20 border-brand-gold text-brand-gold-light ring-1 ring-brand-gold/50 shadow-[0_0_15px_rgba(223,191,122,0.2)] font-bold scale-[1.03]'
                      : 'bg-black/30 border-white/10 text-brand-ivory/70 hover:border-brand-gold/30 hover:text-white'
                  }`}
                >
                  {isSelected ? <Check className="w-3.5 h-3.5 text-brand-gold" /> : <span className="w-1.5 h-1.5 rounded-full bg-white/20" />}
                  <span>{b}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Section 2: Material & Handloom Architecture */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-brand-gold/30 shadow-lg space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-white/10">
          <div className="w-7 h-7 rounded-lg bg-brand-gold/15 border border-brand-gold/30 flex items-center justify-center text-brand-gold">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-brand-gold font-bold">
              PHASE 02 • MATERIAL ARCHITECTURE
            </span>
            <h3 className="font-serif text-base sm:text-lg font-bold text-white tracking-tight">
              Silk Composition & Loom Craftsmanship
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-brand-ivory/80 mb-2">
              Silk & Warp Composition *
            </label>
            <input
              type="text"
              name="fabric"
              value={formData.fabric || ''}
              onChange={handleChange}
              required
              placeholder="e.g. Pure Katan Silk (Mulberry 4-Ply)"
              className="w-full bg-[#0E0518] border border-brand-gold/30 focus:border-brand-gold rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
            />
            <span className="text-[10px] text-brand-ivory/50 font-mono mt-1 block">Warp & Weft Yarn Standard</span>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-brand-ivory/80 mb-2">
              Weaving Technique *
            </label>
            <input
              type="text"
              name="weave"
              value={formData.weave || ''}
              onChange={handleChange}
              required
              placeholder="e.g. Kadwa Handloom Zari"
              className="w-full bg-[#0E0518] border border-brand-gold/30 focus:border-brand-gold rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
            />
            <span className="text-[10px] text-brand-ivory/50 font-mono mt-1 block">Loom Apparatus & Shuttle Type</span>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-brand-ivory/80 mb-2">
              Heritage Colorway *
            </label>
            <input
              type="text"
              name="color"
              value={formData.color || ''}
              onChange={handleChange}
              placeholder="e.g. Imperial Burgundy & 24K Gold"
              className="w-full bg-[#0E0518] border border-brand-gold/30 focus:border-brand-gold rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
            />
            <span className="text-[10px] text-brand-ivory/50 font-mono mt-1 block">Botanical / Metallic Hue Palette</span>
          </div>
        </div>
      </div>

      {/* Section 3: Curatorial Storytelling & Historical Motif */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-brand-gold/30 shadow-lg space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-brand-gold/15 border border-brand-gold/30 flex items-center justify-center text-brand-gold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-brand-gold font-bold">
                PHASE 03 • CURATORIAL LORE
              </span>
              <h3 className="font-serif text-base sm:text-lg font-bold text-white tracking-tight">
                Provenance & Storytelling Narrative
              </h3>
            </div>
          </div>
          <span className="text-[11px] font-mono text-brand-ivory/50">
            {formData.description?.length || 0} characters
          </span>
        </div>

        <textarea
          name="description"
          rows={4}
          value={formData.description || ''}
          onChange={handleChange}
          placeholder="Narrate the ancestral loom lineage, mythological flora/fauna motifs, real electroplated gold zari purity, and architectural drape weight..."
          className="w-full bg-[#0E0518] border border-brand-gold/30 focus:border-brand-gold rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none transition-colors resize-none leading-relaxed shadow-inner"
        />
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-brand-gold/80 font-mono">
          <span className="px-2 py-0.5 rounded bg-brand-gold/10 border border-brand-gold/20">#AncestralLoom</span>
          <span className="px-2 py-0.5 rounded bg-brand-gold/10 border border-brand-gold/20">#ShikargahMotif</span>
          <span className="px-2 py-0.5 rounded bg-brand-gold/10 border border-brand-gold/20">#24KElectroplatedZari</span>
          <span className="px-2 py-0.5 rounded bg-brand-gold/10 border border-brand-gold/20">#SilkMarkCertified</span>
        </div>
      </div>

      {/* Section 4: Imagery Showcase (5 Curated Angles with Drag & Drop, Direct File Upload & URL) */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-brand-gold/30 shadow-lg space-y-5">
        <div className="border-b border-white/10 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-gold/30 to-brand-gold/10 border border-brand-gold/50 flex items-center justify-center text-brand-gold">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-brand-gold font-bold">
                PHASE 04 • CINEMATIC VISUAL SHOWCASE
              </span>
              <h3 className="font-serif text-base sm:text-lg font-bold text-white tracking-tight">
                Master 5-Perspective High-Definition Angles
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-brand-gold/15 border border-brand-gold/40 text-brand-gold-light font-bold">
              {configuredAnglesCount} / 5 Angles Configured
            </span>
            {configuredAnglesCount >= 3 && (
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Drape Complete
              </span>
            )}
          </div>
        </div>

        {/* Multi-Perspective Master Drag & Drop Zone */}
        <div
          onDragOver={handleMasterDragOver}
          onDragEnter={handleMasterDragOver}
          onDragLeave={handleMasterDragLeave}
          onDrop={handleMasterDrop}
          className={`p-6 sm:p-7 rounded-3xl border-2 border-dashed transition-all text-center relative overflow-hidden ${
            isMasterDragOver
              ? 'border-brand-gold bg-brand-gold/25 shadow-[0_0_40px_rgba(223,191,122,0.4)] scale-[1.01]'
              : 'border-brand-gold/40 bg-[#0E0418]/90 hover:border-brand-gold/70 hover:bg-[#120520]'
          }`}
        >
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-gold/25 via-brand-purple to-brand-gold/10 border border-brand-gold/40 flex items-center justify-center text-brand-gold shadow-md">
              <Upload className={`w-7 h-7 transition-transform ${isMasterDragOver ? '-translate-y-1 scale-110 text-amber-300' : ''}`} />
            </div>
            <div>
              <h4 className="font-serif font-bold text-base sm:text-lg text-white">
                {isMasterDragOver ? 'Drop Saree Photos Now!' : 'Upload or Drag & Drop Multiple Saree Photos'}
              </h4>
              <p className="text-xs text-brand-ivory/60 mt-1 font-sans max-w-lg mx-auto leading-relaxed">
                Drag multiple image files at once from your folder, or click the button below. Photos will automatically populate Angle 1 (Cover), Angle 2 (Pallu), Angle 3 (Border), Angle 4 (Pleats), and Angle 5 (Lookbook).
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-gold via-brand-gold-light to-amber-400 text-brand-purple-dark text-xs font-mono font-bold uppercase tracking-wider shadow-lg shadow-brand-gold/25 hover:scale-[1.02] active:scale-[0.98] transition-all">
                <Upload className="w-4 h-4" />
                <span>Browse Files from Device</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    if (files.length > 0) {
                      files.slice(0, 5).forEach((file, idx) => {
                        handleAngleFileUpload(idx, file);
                      });
                    }
                  }}
                  className="hidden"
                />
              </label>
              <span className="text-xs text-brand-ivory/50 font-mono">
                or drag & drop files here
              </span>
            </div>

            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-brand-ivory/60">
                PNG, JPG, WebP supported
              </span>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold">
                Auto-Compressed to 1200px Max
              </span>
            </div>
          </div>
        </div>

        {/* 5 Dedicated Luxury Angle Cards */}
        <div className="space-y-4">
          {ANGLE_METADATA.map((angle, idx) => {
            const currentUrl = angleSlots[idx] || '';
            const hasImage = currentUrl.trim().length > 0;
            const isDraggingOverThis = dragOverIndex === idx;

            return (
              <div
                key={angle.id}
                onDragOver={(e) => handleAngleDragOver(e, idx)}
                onDragEnter={(e) => handleAngleDragOver(e, idx)}
                onDragLeave={(e) => handleAngleDragLeave(e, idx)}
                onDrop={(e) => handleAngleDrop(e, idx)}
                className={`p-4 sm:p-5 rounded-2xl border transition-all relative overflow-hidden ${
                  isDraggingOverThis
                    ? 'border-brand-gold bg-brand-gold/20 shadow-[0_0_35px_rgba(223,191,122,0.4)] ring-2 ring-brand-gold/60 scale-[1.01]'
                    : hasImage
                    ? 'bg-[#10051C]/90 border-brand-gold/40 shadow-[0_4px_20px_rgba(0,0,0,0.3)]'
                    : 'bg-black/25 border-white/10 hover:border-brand-gold/30'
                }`}
              >
                {/* Drag over banner indicator */}
                {isDraggingOverThis && (
                  <div className="absolute top-2 right-4 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-gold text-brand-purple-dark text-[11px] font-mono font-bold animate-pulse shadow-md">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Drop image to upload {angle.name}</span>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg bg-brand-gold/20 text-brand-gold border border-brand-gold/30">
                      {angle.name}
                    </span>
                    <div>
                      <h4 className="text-xs sm:text-sm text-brand-ivory font-serif font-bold">
                        {angle.label}
                      </h4>
                      <p className="text-[11px] text-brand-ivory/50 font-sans">
                        {angle.desc}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    {hasImage ? (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        Active Angle
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-brand-ivory/40">
                        Upload or Drag File
                      </span>
                    )}
                    {hasImage && (
                      <button
                        type="button"
                        onClick={() => handleClearAngle(idx)}
                        className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1 bg-red-500/10 hover:bg-red-500/20 px-2 py-1 rounded-lg border border-red-500/30 transition-colors cursor-pointer"
                        title="Remove this perspective"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Clear</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Live Thumbnail Preview & Drop Target */}
                  <div className={`w-24 h-28 sm:w-28 sm:h-32 rounded-xl border bg-[#0A0214] overflow-hidden shrink-0 flex items-center justify-center relative group shadow-md transition-all ${
                    isDraggingOverThis ? 'border-brand-gold ring-2 ring-brand-gold' : 'border-brand-gold/35'
                  }`}>
                    {hasImage ? (
                      <img
                        src={currentUrl}
                        alt={angle.label}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center p-2 text-center text-brand-ivory/30">
                        <Upload className="w-6 h-6 mb-1 text-brand-gold/40" />
                        <span className="text-[9px] font-mono uppercase tracking-wider">Drag & Drop</span>
                      </div>
                    )}
                    {isDraggingOverThis && (
                      <div className="absolute inset-0 bg-brand-purple-dark/85 backdrop-blur-xs flex flex-col items-center justify-center text-brand-gold text-center p-1 z-10">
                        <Upload className="w-5 h-5 mb-1 animate-bounce" />
                        <span className="text-[9px] font-mono font-bold uppercase">Drop Image</span>
                      </div>
                    )}
                  </div>

                  {/* Dual Controls: File Upload & URL */}
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-gold/25 via-brand-gold/15 to-transparent hover:from-brand-gold/35 hover:to-brand-gold/25 border border-brand-gold/50 text-brand-gold text-xs font-mono font-bold uppercase tracking-wider transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm">
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
                      <span className="text-[11px] text-brand-gold-light/80 font-mono">
                        • Drag & drop photo directly onto this card
                      </span>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-brand-ivory/60 mb-1">
                        Or Enter Image URL (HTTP / HTTPS):
                      </label>
                      <input
                        type="text"
                        value={currentUrl}
                        onChange={(e) => handleAngleUrlChange(idx, e.target.value)}
                        placeholder={angle.placeholder}
                        className="w-full bg-[#0E0518] border border-brand-gold/30 focus:border-brand-gold rounded-xl px-3.5 py-2 text-xs text-white placeholder-white/30 focus:outline-none transition-colors font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );

  // INLINE VIEW MODE (Rendered directly in the page without modal popup)
  if (inline) {
    return (
      <div className="product-editor-inline-view w-full space-y-6 pb-12 animate-fadeIn">
        {/* Executive Studio Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#1E0D33] via-[#140624] to-[#0D0317] border border-brand-gold/40 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-brand-gold-light/90 hover:text-white mb-3 transition-colors group cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-brand-gold" />
                <span>Return to Masterpiece Catalog</span>
              </button>

              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
                  {product ? `Edit Masterpiece: ${product.name}` : 'Curate New Handloom Commission'}
                </h1>
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-brand-gold/20 border border-brand-gold/45 text-brand-gold font-bold">
                  {product ? `WEAVE #${product.id}` : 'NEW COMMISSION'}
                </span>
              </div>

              {/* Executive KPI Ribbon */}
              <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-brand-gold/20 text-xs font-mono">
                <div className="flex items-center gap-1.5 text-brand-gold-light">
                  <span className="text-brand-ivory/50">Price:</span>
                  <span className="font-bold">₹{price.toLocaleString('en-IN')}</span>
                </div>
                {hasDiscount && (
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <span className="text-brand-ivory/50">Advantage:</span>
                    <span className="font-bold">{discountPercent}% OFF</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-brand-ivory/80">
                  <span className="text-brand-ivory/50">Tradition:</span>
                  <span className="text-white font-medium">{formData.category || 'Banarasi'}</span>
                </div>
                <div className="flex items-center gap-1.5 text-brand-ivory/80">
                  <span className="text-brand-ivory/50">Curatorial Badge:</span>
                  <span className="text-brand-gold font-medium">{formData.badge || 'Bestseller'}</span>
                </div>
                <div className="flex items-center gap-1.5 text-brand-ivory/80">
                  <span className="text-brand-ivory/50">Lookbook Angles:</span>
                  <span className="text-emerald-400 font-bold">{configuredAnglesCount} / 5 Ready</span>
                </div>
              </div>
            </div>

            {/* Quick Action Pinned Buttons */}
            <div className="flex items-center gap-3 self-end lg:self-center shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-white/20 hover:border-white/40 text-xs font-mono uppercase tracking-wider text-brand-ivory hover:bg-white/5 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="px-7 py-3 rounded-xl bg-gradient-to-r from-brand-gold via-brand-gold-light to-amber-400 text-brand-purple-dark font-serif font-bold text-sm shadow-xl shadow-brand-gold/25 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center gap-2.5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-brand-purple-dark" />
                <span>{loading ? 'Saving Masterpiece...' : product ? 'Save Masterpiece Changes' : 'Publish to Catalog'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* In-Page Form Body */}
        <div className="bg-gradient-to-b from-[#180A26] via-[#11041D] to-[#0A0212] border border-brand-gold/30 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {renderFormFields()}

            {/* Bottom Actions Bar */}
            <div className="pt-6 border-t border-brand-gold/20 flex items-center justify-between gap-4">
              <div className="text-xs font-mono text-brand-ivory/50 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-gold" />
                <span>Changes will be instantly reflected in the storefront catalog & 3D canvases.</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl border border-white/15 text-xs font-mono uppercase tracking-wider text-brand-ivory hover:bg-white/5 transition-colors cursor-pointer"
                >
                  Discard Draft
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-brand-gold via-brand-gold-light to-brand-gold-dark text-brand-purple-dark font-serif font-bold text-sm shadow-xl shadow-brand-gold/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{loading ? 'Saving...' : product ? 'Save Masterpiece Changes' : 'Publish Masterpiece'}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

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
          className="relative w-[96vw] max-w-6xl xl:max-w-7xl max-h-[92vh] bg-gradient-to-b from-[#1A0B2C] via-[#120622] to-[#0A0314] border border-brand-gold/40 rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.85),0_0_40px_rgba(223,191,122,0.12)] overflow-hidden flex flex-col z-10 text-brand-ivory my-auto"
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
            {renderFormFields()}

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
