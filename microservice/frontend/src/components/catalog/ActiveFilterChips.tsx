import React from 'react';
import { X } from 'lucide-react';
import { CatalogFilterState } from '@/features/catalog/catalogFilterUtils';

interface ActiveFilterChipsProps {
  filters: CatalogFilterState;
  onRemoveWeave: (weave: string) => void;
  onRemoveFabric: (fabric: string) => void;
  onResetPrice: () => void;
  onToggleGi: () => void;
  onClearAll: () => void;
  totalResults: number;
}

export const ActiveFilterChips: React.FC<ActiveFilterChipsProps> = ({
  filters,
  onRemoveWeave,
  onRemoveFabric,
  onResetPrice,
  onToggleGi,
  onClearAll,
  totalResults,
}) => {
  const hasActiveFilters =
    filters.weaves.length > 0 ||
    filters.fabrics.length > 0 ||
    filters.giTaggedOnly ||
    filters.priceRange[0] > 1000 ||
    filters.priceRange[1] < 50000;

  if (!hasActiveFilters) {
    return (
      <div className="text-xs text-gray-500 mb-4">
        Showing <span className="text-gray-900 font-bold">{totalResults}</span> Sarees
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <span className="text-xs text-gray-500 mr-1">
        <span className="text-gray-900 font-bold">{totalResults}</span> items:
      </span>

      {filters.weaves.map((w) => (
        <span
          key={`weave-${w}`}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-gray-300 text-gray-800 text-xs font-medium shadow-sm"
        >
          {w}
          <button
            type="button"
            onClick={() => onRemoveWeave(w)}
            aria-label={`Remove ${w} filter`}
            className="hover:text-red-600"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}

      {filters.fabrics.map((f) => (
        <span
          key={`fabric-${f}`}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-gray-300 text-gray-800 text-xs font-medium shadow-sm"
        >
          {f}
          <button
            type="button"
            onClick={() => onRemoveFabric(f)}
            aria-label={`Remove ${f} filter`}
            className="hover:text-red-600"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}

      {filters.giTaggedOnly && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-medium shadow-sm">
          GI Tagged Only
          <button
            type="button"
            onClick={onToggleGi}
            aria-label="Remove GI Tag filter"
            className="hover:text-red-600"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {(filters.priceRange[0] > 1000 || filters.priceRange[1] < 50000) && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-gray-300 text-gray-800 text-xs font-medium shadow-sm">
          ₹{filters.priceRange[0].toLocaleString()} – ₹{filters.priceRange[1].toLocaleString()}
          <button
            type="button"
            onClick={onResetPrice}
            aria-label="Reset price filter"
            className="hover:text-red-600"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      <button
        type="button"
        onClick={onClearAll}
        className="text-xs font-bold text-rose-600 hover:text-rose-700 uppercase tracking-wider ml-2 cursor-pointer"
      >
        Clear All
      </button>
    </div>
  );
};
