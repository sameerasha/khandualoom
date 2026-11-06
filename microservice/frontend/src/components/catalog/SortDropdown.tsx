import React from 'react';
import { SortOption } from '@/features/catalog/catalogFilterUtils';
import { ChevronDown } from 'lucide-react';

interface SortDropdownProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export const SortDropdown: React.FC<SortDropdownProps> = ({ currentSort, onSortChange }) => {
  return (
    <div className="relative inline-flex items-center text-xs">
      <span className="text-brand-ivory/60 mr-2 font-medium">Sort by :</span>
      <div className="relative">
        <select
          aria-label="Sort products by"
          value={currentSort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="appearance-none bg-[#19092B] border border-brand-gold/30 text-brand-gold font-semibold rounded-md px-3 py-1.5 pr-8 focus:outline-none focus:border-brand-gold cursor-pointer"
        >
          <option value="recommended">Recommended</option>
          <option value="price_low_high">Price: Low to High</option>
          <option value="price_high_low">Price: High to Low</option>
          <option value="newest">Newest Arrivals</option>
          <option value="rating">Customer Rating</option>
        </select>
        <ChevronDown className="w-4 h-4 text-brand-gold/70 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );
};
