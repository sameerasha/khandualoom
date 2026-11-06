import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  moveSectionUp,
  moveSectionDown,
  toggleSection,
  updateSection,
  publishHomepage,
  resetHomepageToDefault,
} from '@/features/admin/homepageConfigSlice';
import {
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Edit2,
  Save,
  RotateCcw,
  Sparkles,
  Monitor,
  CheckCircle,
} from 'lucide-react';
import { HomepageSectionEditor } from './HomepageSectionEditor';
import { HomepagePreviewModal } from './HomepagePreviewModal';

export const HomepageBuilderView: React.FC = () => {
  const dispatch = useAppDispatch();
  const { sections, isDraft } = useAppSelector((state) => state.homepageConfig);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [publishedToast, setPublishedToast] = useState(false);

  const handlePublish = () => {
    dispatch(publishHomepage());
    setPublishedToast(true);
    setTimeout(() => setPublishedToast(false), 3000);
  };

  const handleReset = () => {
    if (window.confirm('Reset homepage layout and sections to default?')) {
      dispatch(resetHomepageToDefault());
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Action Header */}
      <div className="p-6 rounded-2xl bg-[#170928] border border-brand-gold/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-brand-gold/70 block">
            Visual Experience Atelier
          </span>
          <h2 className="font-serif text-2xl font-bold text-brand-gold">
            Homepage Visual Builder
          </h2>
          <p className="text-xs text-brand-ivory/60 mt-1">
            Reorder, toggle, and customize storefront sections without code redeployments.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {isDraft && (
            <span className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold animate-pulse">
              Draft Layout
            </span>
          )}

          {publishedToast && (
            <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Published Live</span>
            </span>
          )}

          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-[#140622] border border-brand-gold/30 text-brand-gold hover:bg-brand-gold/15 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Live Preview</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2 rounded-xl bg-[#140622] border border-brand-gold/20 text-brand-ivory/70 hover:text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={handlePublish}
            disabled={!isDraft}
            className={`px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg transition-all cursor-pointer ${
              isDraft
                ? 'bg-gradient-to-r from-brand-gold to-brand-gold-light text-brand-purple-dark hover:brightness-110'
                : 'bg-brand-gold/20 text-brand-ivory/40 cursor-not-allowed border border-brand-gold/15'
            }`}
          >
            <Save className="w-4 h-4" />
            <span>Publish to Storefront</span>
          </button>
        </div>
      </div>

      {/* Sections List */}
      <div className="space-y-3">
        {sections.map((section, index) => {
          const isFirst = index === 0;
          const isLast = index === sections.length - 1;
          const isEditing = editingId === section.id;

          return (
            <div
              key={section.id}
              className={`p-4 rounded-2xl border transition-all ${
                section.enabled
                  ? 'bg-[#170928] border-brand-gold/25 hover:border-brand-gold/40 shadow-md'
                  : 'bg-[#12051E]/60 border-brand-gold/10 opacity-60'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Left: Reorder & Info */}
                <div className="flex items-center gap-3">
                  {/* Reorder Buttons */}
                  <div className="flex flex-col gap-1">
                    <button
                      type="button"
                      disabled={isFirst}
                      onClick={() => dispatch(moveSectionUp(section.id))}
                      className="p-1 rounded bg-[#140622] border border-brand-gold/20 text-brand-ivory/60 hover:text-brand-gold disabled:opacity-20 disabled:hover:text-brand-ivory/60 cursor-pointer"
                      title="Move section up"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      disabled={isLast}
                      onClick={() => dispatch(moveSectionDown(section.id))}
                      className="p-1 rounded bg-[#140622] border border-brand-gold/20 text-brand-ivory/60 hover:text-brand-gold disabled:opacity-20 disabled:hover:text-brand-ivory/60 cursor-pointer"
                      title="Move section down"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Section Details */}
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-mono text-[10px] text-brand-gold/70 font-bold uppercase">
                        #{index + 1}
                      </span>
                      <span className="font-serif text-sm font-bold text-brand-gold">
                        {section.name}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-brand-gold/15 text-brand-gold border border-brand-gold/25">
                        {section.deviceTarget}
                      </span>
                    </div>
                    <p className="text-xs text-brand-ivory/80">{section.title}</p>
                    {section.subtitle && (
                      <p className="text-[11px] text-brand-ivory/50 truncate max-w-xl">
                        {section.subtitle}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={() => dispatch(toggleSection(section.id))}
                    className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      section.enabled
                        ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400'
                        : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
                    }`}
                    title={section.enabled ? 'Disable section' : 'Enable section'}
                  >
                    {section.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span>{section.enabled ? 'Visible' : 'Hidden'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditingId(isEditing ? null : section.id)}
                    className="p-2 rounded-xl bg-[#140622] border border-brand-gold/20 text-brand-gold hover:bg-brand-gold/15 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    title="Edit headline & copy"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Copy</span>
                  </button>
                </div>
              </div>

              {/* Inline Section Editor */}
              {isEditing && (
                <HomepageSectionEditor
                  section={section}
                  onSave={(updates) => {
                    dispatch(updateSection({ id: section.id, updates }));
                    setEditingId(null);
                  }}
                  onCancel={() => setEditingId(null)}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Live Viewport Modal */}
      <HomepagePreviewModal
        isOpen={previewOpen}
        sections={sections}
        onClose={() => setPreviewOpen(false)}
      />
    </div>
  );
};
