import React, { useState } from 'react';
import {
  CategoryNode,
  loadCategoryTree,
  saveCategoryTree,
} from '@/features/admin/categoryApi';
import {
  FolderTree,
  Plus,
  ChevronRight,
  ChevronDown,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle,
  FolderPlus,
} from 'lucide-react';
import { CategoryTreeEditor } from './CategoryTreeEditor';

export const CategoryManagerView: React.FC = () => {
  const [tree, setTree] = useState<CategoryNode[]>(() => loadCategoryTree());
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    'cat-women': true,
    'cat-men': true,
    'cat-collectibles': true,
  });
  const [editingNode, setEditingNode] = useState<CategoryNode | null>(null);
  const [targetParentId, setTargetParentId] = useState<string | undefined>(undefined);
  const [modalOpen, setModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSaveCategory = (saved: CategoryNode, parentId?: string) => {
    let nextTree: CategoryNode[];

    if (parentId) {
      // Add or update as child under parent
      nextTree = tree.map((parent) => {
        if (parent.id === parentId) {
          const subs = parent.subcategories || [];
          const exists = subs.some((s) => s.id === saved.id);
          const nextSubs = exists
            ? subs.map((s) => (s.id === saved.id ? saved : s))
            : [...subs, saved];
          return { ...parent, subcategories: nextSubs };
        }
        return parent;
      });
      showToast('Subcategory updated');
    } else {
      // Root level category
      const exists = tree.some((c) => c.id === saved.id);
      if (exists) {
        nextTree = tree.map((c) => (c.id === saved.id ? saved : c));
        showToast('Category updated');
      } else {
        nextTree = [...tree, saved];
        showToast('New root category added');
      }
    }

    setTree(nextTree);
    saveCategoryTree(nextTree);
    setModalOpen(false);
    setEditingNode(null);
    setTargetParentId(undefined);
  };

  const handleDeleteCategory = (id: string, parentId?: string) => {
    if (window.confirm('Delete this category node?')) {
      let nextTree: CategoryNode[];
      if (parentId) {
        nextTree = tree.map((parent) => {
          if (parent.id === parentId) {
            return {
              ...parent,
              subcategories: (parent.subcategories || []).filter((s) => s.id !== id),
            };
          }
          return parent;
        });
      } else {
        nextTree = tree.filter((c) => c.id !== id);
      }
      setTree(nextTree);
      saveCategoryTree(nextTree);
      showToast('Category removed');
    }
  };

  const handleToggleVisibility = (id: string, parentId?: string) => {
    let nextTree: CategoryNode[];
    if (parentId) {
      nextTree = tree.map((parent) => {
        if (parent.id === parentId) {
          return {
            ...parent,
            subcategories: (parent.subcategories || []).map((s) =>
              s.id === id ? { ...s, isVisible: !s.isVisible } : s
            ),
          };
        }
        return parent;
      });
    } else {
      nextTree = tree.map((c) =>
        c.id === id ? { ...c, isVisible: !c.isVisible } : c
      );
    }
    setTree(nextTree);
    saveCategoryTree(nextTree);
    showToast('Visibility updated');
  };

  const parentOptions = tree.map((c) => ({ id: c.id, name: c.name }));

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#170928] border border-brand-gold/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-brand-gold/70 block">
            Navigation Architecture
          </span>
          <h2 className="font-serif text-2xl font-bold text-brand-gold">
            Categories & Navigation
          </h2>
          <p className="text-xs text-brand-ivory/60 mt-1">
            Organize the storefront mega-menu, subcategory taxonomies, and faceted filters.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {toastMessage && (
            <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-1.5 animate-fadeIn">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{toastMessage}</span>
            </span>
          )}

          <button
            type="button"
            onClick={() => {
              setEditingNode(null);
              setTargetParentId(undefined);
              setModalOpen(true);
            }}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-gold to-brand-gold-light text-brand-purple-dark font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg hover:brightness-110 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Category</span>
          </button>
        </div>
      </div>

      {/* Category Tree Nodes */}
      <div className="space-y-4">
        {tree.map((root) => {
          const isExp = !!expanded[root.id];
          const hasChildren = (root.subcategories || []).length > 0;

          return (
            <div
              key={root.id}
              className={`p-4 rounded-2xl border transition-all ${
                root.isVisible
                  ? 'bg-[#170928] border-brand-gold/25 shadow-lg'
                  : 'bg-[#12051E]/60 border-brand-gold/10 opacity-60'
              }`}
            >
              {/* Root Level Node */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => toggleExpand(root.id)}
                    className="p-1 text-brand-gold/70 hover:text-brand-gold cursor-pointer"
                  >
                    {isExp ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>

                  <div className="w-8 h-8 rounded-lg bg-brand-gold/10 border border-brand-gold/25 flex items-center justify-center text-brand-gold font-bold text-xs">
                    <FolderTree className="w-4 h-4" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif text-base font-bold text-brand-gold">
                        {root.name}
                      </h3>
                      <span className="font-mono text-[10px] text-brand-ivory/40">
                        /{root.slug}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-brand-gold/15 text-brand-gold">
                        {root.subcategories?.length || 0} Subcategories
                      </span>
                    </div>
                    {root.description && (
                      <p className="text-xs text-brand-ivory/60 mt-0.5">{root.description}</p>
                    )}
                  </div>
                </div>

                {/* Root Actions */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingNode(null);
                      setTargetParentId(root.id);
                      setModalOpen(true);
                    }}
                    className="p-2 rounded-xl bg-brand-gold/15 border border-brand-gold/30 text-brand-gold text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    title="Add subcategory under this parent"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Add Subcategory</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleVisibility(root.id)}
                    className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1 cursor-pointer ${
                      root.isVisible
                        ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400'
                        : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
                    }`}
                  >
                    {root.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingNode(root);
                      setTargetParentId(undefined);
                      setModalOpen(true);
                    }}
                    className="p-2 rounded-xl bg-[#140622] border border-brand-gold/20 text-brand-gold text-xs hover:bg-brand-gold/15 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(root.id)}
                    className="p-2 rounded-xl bg-rose-950/30 border border-rose-500/20 text-rose-300 text-xs hover:bg-rose-900/40 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Subcategories Children */}
              {isExp && hasChildren && (
                <div className="mt-3 pl-8 border-l border-brand-gold/15 space-y-2 pt-2">
                  {root.subcategories!.map((sub) => (
                    <div
                      key={sub.id}
                      className="p-3 rounded-xl bg-[#140622] border border-brand-gold/15 flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-brand-ivory font-medium text-xs">
                            {sub.name}
                          </span>
                          <span className="font-mono text-[10px] text-brand-ivory/40">
                            /{root.slug}/{sub.slug}
                          </span>
                        </div>
                        {sub.description && (
                          <p className="text-[11px] text-brand-ivory/50 mt-0.5 truncate max-w-lg">
                            {sub.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleVisibility(sub.id, root.id)}
                          className={`p-1.5 rounded-lg border text-xs cursor-pointer ${
                            sub.isVisible
                              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400'
                              : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
                          }`}
                        >
                          {sub.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setEditingNode(sub);
                            setTargetParentId(root.id);
                            setModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-[#170928] border border-brand-gold/20 text-brand-gold hover:bg-brand-gold/15 text-xs cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(sub.id, root.id)}
                          className="p-1.5 rounded-lg bg-rose-950/30 border border-rose-500/20 text-rose-300 hover:bg-rose-900/40 text-xs cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Editor Modal */}
      <CategoryTreeEditor
        category={editingNode}
        parentOptions={parentOptions}
        defaultParentId={targetParentId}
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingNode(null);
          setTargetParentId(undefined);
        }}
        onSave={handleSaveCategory}
      />
    </div>
  );
};
