import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { CatalogFilterState } from '@/features/catalog/catalogFilterUtils';

interface FilterSidebarProps {
  filters: CatalogFilterState;
  onFilterChange: (filters: CatalogFilterState) => void;
  availableWeaves?: string[];
  availableFabrics?: string[];
}

const defaultWeaves = [
  'Khandua Pata',
  'Sambalpuri',
  'Bomkai',
  'Berhampuri',
  'Pasapalli',
  'Kotpad',
  'Dongria',
];

const defaultFabrics = [
  'Mulberry Silk',
  'Tussar Silk',
  'Organic Cotton',
  'Silk-Cotton Blend',
];

const defaultOccasions = [
  'Bridal & Wedding',
  'Festive Celebrations',
  'Temple & Rituals',
  'Formal Ethnic',
];

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFilterChange,
  availableWeaves = defaultWeaves,
  availableFabrics = defaultFabrics,
}) => {
  const [weaveSearch, setWeaveSearch] = useState('');

  const toggleWeave = (weave: string) => {
    const exists = filters.weaves.includes(weave);
    const updated = exists
      ? filters.weaves.filter((w) => w !== weave)
      : [...filters.weaves, weave];
    onFilterChange({ ...filters, weaves: updated });
  };

  const toggleFabric = (fabric: string) => {
    const exists = filters.fabrics.includes(fabric);
    const updated = exists
      ? filters.fabrics.filter((f) => f !== fabric)
      : [...filters.fabrics, fabric];
    onFilterChange({ ...filters, fabrics: updated });
  };

  const toggleOccasion = (occasion: string) => {
    const exists = filters.occasions.includes(occasion);
    const updated = exists
      ? filters.occasions.filter((o) => o !== occasion)
      : [...filters.occasions, occasion];
    onFilterChange({ ...filters, occasions: updated });
  };

  const handlePriceMaxChange = (max: number) => {
    onFilterChange({
      ...filters,
      priceRange: [filters.priceRange[0], max],
    });
  };

  const filteredWeaves = availableWeaves.filter((w) =>
    w.toLowerCase().includes(weaveSearch.toLowerCase())
  );

  return (
    <aside className="w-full lg:w-64 bg-white rounded-2xl border border-gray-200 p-5 divide-y divide-gray-100 text-xs shadow-sm">
      <div className="pb-4 flex items-center justify-between">
        <h3 className="font-bold uppercase tracking-wider text-gray-900 text-sm">
          Filters
        </h3>
        <button
          type="button"
          onClick={() =>
            onFilterChange({
              ...filters,
              weaves: [],
              fabrics: [],
              occasions: [],
              giTaggedOnly: false,
              priceRange: [1000, 50000],
            })
          }
          className="text-[11px] font-semibold text-brand-purple hover:underline uppercase"
        >
          Clear All
        </button>
      </div>

      {/* GI Certified Tag Filter */}
      <div className="py-4">
        <label className="flex items-center justify-between cursor-pointer group">
          <span className="font-bold text-gray-800 group-hover:text-brand-purple uppercase tracking-wider">
            GI Tagged Only
          </span>
          <input
            type="checkbox"
            checked={filters.giTaggedOnly}
            onChange={(e) => onFilterChange({ ...filters, giTaggedOnly: e.target.checked })}
            className="w-4 h-4 accent-brand-gold rounded cursor-pointer"
          />
        </label>
      </div>

      {/* Weave Technique Facet */}
      <div className="py-4">
        <div className="flex items-center justify-between mb-2.5">
          <span className="font-bold uppercase tracking-wider text-gray-700">
            Weave Style
          </span>
        </div>

        {/* Inline Search within Weaves */}
        <div className="relative mb-2.5">
          <input
            type="text"
            placeholder="Search weave style..."
            value={weaveSearch}
            onChange={(e) => setWeaveSearch(e.target.value)}
            className="w-full bg-gray-50 border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-brand-gold"
          />
          <Search className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {filteredWeaves.map((weave) => (
            <label
              key={weave}
              className="flex items-center justify-between text-gray-700 hover:text-gray-900 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.weaves.includes(weave)}
                  onChange={() => toggleWeave(weave)}
                  className="w-3.5 h-3.5 accent-brand-gold rounded cursor-pointer"
                />
                <span>{weave}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Fabric Purity Facet */}
      <div className="py-4">
        <span className="font-bold uppercase tracking-wider text-gray-700 block mb-2.5">
          Fabric
        </span>
        <div className="space-y-2">
          {availableFabrics.map((fabric) => (
            <label
              key={fabric}
              className="flex items-center justify-between text-gray-700 hover:text-gray-900 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.fabrics.includes(fabric)}
                  onChange={() => toggleFabric(fabric)}
                  className="w-3.5 h-3.5 accent-brand-gold rounded cursor-pointer"
                />
                <span>{fabric}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Price Slider */}
      <div className="py-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold uppercase tracking-wider text-gray-700">
            Price Range
          </span>
          <span className="text-gray-900 font-mono font-bold">
            Up to ₹{filters.priceRange[1].toLocaleString()}
          </span>
        </div>
        <input
          type="range"
          min="5000"
          max="50000"
          step="2500"
          value={filters.priceRange[1]}
          onChange={(e) => handlePriceMaxChange(Number(e.target.value))}
          className="w-full accent-brand-gold cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
          <span>₹5,000</span>
          <span>₹25,000</span>
          <span>₹50,000+</span>
        </div>
      </div>

      {/* Occasion Facet */}
      <div className="pt-4">
        <span className="font-bold uppercase tracking-wider text-gray-700 block mb-2.5">
          Occasion
        </span>
        <div className="space-y-2">
          {defaultOccasions.map((occasion) => (
            <label
              key={occasion}
              className="flex items-center justify-between text-gray-700 hover:text-gray-900 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.occasions.includes(occasion)}
                  onChange={() => toggleOccasion(occasion)}
                  className="w-3.5 h-3.5 accent-brand-gold rounded cursor-pointer"
                />
                <span>{occasion}</span>
              </div>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
};
