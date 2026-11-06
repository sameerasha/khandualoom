import React, { useState } from 'react';
import { CategoryNode } from '@/features/admin/categoryApi';
import { X, Check, FolderPlus } from 'lucide-react';

interface CategoryTreeEditorProps {
  category: CategoryNode | null;
  parentOptions: { id: string; name: string }[];
  defaultParentId?: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (cat: CategoryNode, parentId?: string) => void;
}

export const CategoryTreeEditor: React.FC<CategoryTreeEditorProps> = ({
  category,
  parentOptions,
  defaultParentId,
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(category?.name || '');
  const [slug, setSlug] = useState(category?.slug || '');
  const [description, setDescription] = useState(category?.description || '');
  const [bannerImage, setBannerImage] = useState(category?.bannerImage || '');
  const [selectedParentId, setSelectedParentId] = useState<string>(
    defaultParentId || ''
  );
  const [isVisible, setIsVisible] = useState(category?.isVisible ?? true);

  if (!isOpen) return null;

  const handleNameChange = (val: string) => {
    setName(val);
    if (!category) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '')
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: CategoryNode = {
      id: category?.id || `cat-${Date.now()}`,
      name,
      slug,
      description,
      bannerImage,
      isVisible,
      order: category?.order ?? 0,
      subcategories: category?.subcategories || [],
    };
    onSave(updated, selectedParentId || undefined);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#170928] border border-brand-gold/30 rounded-2xl max-w-lg w-full p-6 text-xs text-brand-ivory space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center border-b border-brand-gold/15 pb-3">
          <div className="flex items-center gap-2">
            <FolderPlus className="w-4 h-4 text-brand-gold" />
            <h3 className="font-serif text-lg font-bold text-brand-gold">
              {category ? 'Edit Category' : 'Create Category Node'}
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
              Category Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Sambalpuri Ikat"
              className="w-full px-3 py-2 rounded-lg bg-[#140622] border border-brand-gold/25 text-brand-ivory text-xs focus:outline-none focus:border-brand-gold"
            />
          </div>

          <div>
            <label className="block text-brand-gold font-semibold uppercase text-[10px] tracking-wider mb-1">
              SEO URL Slug *
            </label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. sambalpuri-ikat"
              className="w-full px-3 py-2 rounded-lg bg-[#140622] border border-brand-gold/25 text-brand-ivory text-xs focus:outline-none focus:border-brand-gold"
            />
          </div>

          {!category && (
            <div>
              <label className="block text-brand-gold font-semibold uppercase text-[10px] tracking-wider mb-1">
                Parent Hierarchy
              </label>
              <select
                value={selectedParentId}
                onChange={(e) => setSelectedParentId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#140622] border border-brand-gold/25 text-brand-ivory text-xs focus:outline-none focus:border-brand-gold"
              >
                <option value="">Root Category (Top Level Mega-Menu)</option>
                {parentOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    Child of {opt.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-brand-gold font-semibold uppercase text-[10px] tracking-wider mb-1">
              Editorial Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Authentic handloom narrative..."
              className="w-full px-3 py-2 rounded-lg bg-[#140622] border border-brand-gold/25 text-brand-ivory text-xs focus:outline-none focus:border-brand-gold resize-none"
            />
          </div>

          <div>
            <label className="block text-brand-gold font-semibold uppercase text-[10px] tracking-wider mb-1">
              Category Header Banner Image URL
            </label>
            <input
              type="text"
              value={bannerImage}
              onChange={(e) => setBannerImage(e.target.value)}
              placeholder="/images/category_banner.jpg"
              className="w-full px-3 py-2 rounded-lg bg-[#140622] border border-brand-gold/25 text-brand-ivory text-xs focus:outline-none focus:border-brand-gold"
            />
          </div>

          <div className="pt-2 flex items-center gap-2">
            <input
              type="checkbox"
              id="catVisible"
              checked={isVisible}
              onChange={(e) => setIsVisible(e.target.checked)}
              className="accent-brand-gold w-4 h-4 cursor-pointer"
            />
            <label htmlFor="catVisible" className="text-xs text-brand-ivory/80 cursor-pointer">
              Visible in Storefront Mega-Menu and Filter Sidebar
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
              <span>Save Category</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
