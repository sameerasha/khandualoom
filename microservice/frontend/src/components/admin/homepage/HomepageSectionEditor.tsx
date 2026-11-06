import React, { useState } from 'react';
import { HomepageSection } from '@/features/admin/homepageConfigSlice';
import { Check, X } from 'lucide-react';

interface HomepageSectionEditorProps {
  section: HomepageSection;
  onSave: (updates: Partial<HomepageSection>) => void;
  onCancel: () => void;
}

export const HomepageSectionEditor: React.FC<HomepageSectionEditorProps> = ({
  section,
  onSave,
  onCancel,
}) => {
  const [title, setTitle] = useState(section.title);
  const [subtitle, setSubtitle] = useState(section.subtitle || '');
  const [deviceTarget, setDeviceTarget] = useState<HomepageSection['deviceTarget']>(
    section.deviceTarget
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      subtitle,
      deviceTarget,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 rounded-xl bg-[#140622] border border-brand-gold/30 space-y-3 text-xs mt-3">
      <div>
        <label className="block text-brand-gold font-semibold uppercase text-[10px] tracking-wider mb-1">
          Section Headline
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-[#1D0C30] border border-brand-gold/25 text-brand-ivory text-xs focus:outline-none focus:border-brand-gold"
          required
        />
      </div>

      <div>
        <label className="block text-brand-gold font-semibold uppercase text-[10px] tracking-wider mb-1">
          Section Subtitle / Narrative
        </label>
        <input
          type="text"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-[#1D0C30] border border-brand-gold/25 text-brand-ivory text-xs focus:outline-none focus:border-brand-gold"
        />
      </div>

      <div>
        <label className="block text-brand-gold font-semibold uppercase text-[10px] tracking-wider mb-1">
          Device Target
        </label>
        <select
          value={deviceTarget}
          onChange={(e) => setDeviceTarget(e.target.value as any)}
          className="w-full px-3 py-2 rounded-lg bg-[#1D0C30] border border-brand-gold/25 text-brand-ivory text-xs focus:outline-none focus:border-brand-gold"
        >
          <option value="all">All Devices (Desktop & Mobile)</option>
          <option value="desktop">Desktop Only</option>
          <option value="mobile">Mobile Only</option>
        </select>
      </div>

      <div className="flex items-center justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 rounded-lg bg-white/5 text-brand-ivory/60 hover:text-white text-xs flex items-center gap-1"
        >
          <X className="w-3.5 h-3.5" />
          <span>Cancel</span>
        </button>

        <button
          type="submit"
          className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-brand-gold to-brand-gold-light text-brand-purple-dark font-bold text-xs flex items-center gap-1"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Apply Updates</span>
        </button>
      </div>
    </form>
  );
};
