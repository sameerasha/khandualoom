import React, { useState } from 'react';

export interface SocialItem {
  id: number;
  platform: string;
  url: string;
}

interface StoreSettingsViewProps {
  socials: SocialItem[];
  onSaveSocial: (social: { platform: string; url: string; id?: number }) => Promise<void>;
  onDeleteSocial: (id: number) => Promise<void>;
}

const PLATFORMS = [
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'facebook', label: 'Facebook' },
  { id: 'telegram', label: 'Telegram' },
  { id: 'twitter', label: 'Twitter / X' },
  { id: 'youtube', label: 'YouTube' },
];

export const StoreSettingsView: React.FC<StoreSettingsViewProps> = ({
  socials,
  onSaveSocial,
  onDeleteSocial,
}) => {
  const [platform, setPlatform] = useState('instagram');
  const [url, setUrl] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    await onSaveSocial({ platform, url: url.trim(), id: editingId || undefined });
    setUrl('');
    setEditingId(null);
  };

  const handleEdit = (item: SocialItem) => {
    setEditingId(item.id);
    setPlatform(item.platform);
    setUrl(item.url);
  };

  const getPlatformIcon = (plt: string) => {
    switch (plt.toLowerCase()) {
      case 'instagram':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
          </svg>
        );
      case 'facebook':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
          </svg>
        );
      case 'whatsapp':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        );
      case 'youtube':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z" />
            <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
          </svg>
        );
      default:
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
        );
    }
  };

  return (
    <div className="store-settings">
      <div className="store-settings__header">
        <div>
          <h1 className="store-settings__title">Social Media & Stories</h1>
          <p className="store-settings__subtitle">
            Configure official social channels and storytelling links.
          </p>
        </div>
      </div>

      {/* Channel Editor Form */}
      <form onSubmit={handleSubmit} className="mb-8 p-6 bg-white/5 border border-brand-gold/20 rounded-2xl">
        <h3 className="text-sm font-serif font-bold text-white mb-4">
          {editingId ? 'Edit Social Channel' : 'Add New Social Channel'}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-mono text-brand-ivory/60 mb-1">Platform</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full bg-[#131628] border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-brand-gold"
            >
              {PLATFORMS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-mono text-brand-ivory/60 mb-1">Profile / Channel URL</label>
            <div className="flex gap-2">
              <input
                type="url"
                required
                placeholder="https://..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 bg-[#131628] border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-brand-gold"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-brand-gold text-brand-purple-dark font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-brand-gold-light transition-colors"
              >
                {editingId ? 'Update' : 'Save'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setUrl('');
                  }}
                  className="px-4 py-2.5 bg-white/5 text-brand-ivory text-xs rounded-lg hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      </form>

      {/* Configured Social Links List */}
      <div className="store-settings__list">
        {socials.length > 0 ? (
          socials.map((link) => (
            <div key={link.id} className="store-settings__item">
              <div className="store-settings__item-icon">{getPlatformIcon(link.platform)}</div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-white capitalize">{link.platform}</h4>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-brand-gold hover:underline truncate block"
                >
                  {link.url}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(link)}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-brand-ivory hover:text-white transition-colors"
                  title="Edit"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
                <button
                  onClick={() => onDeleteSocial(link.id)}
                  className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                  title="Delete"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-brand-ivory/50 bg-white/5 rounded-2xl border border-dashed border-white/10">
            No official social channels configured yet.
          </div>
        )}
      </div>
    </div>
  );
};
