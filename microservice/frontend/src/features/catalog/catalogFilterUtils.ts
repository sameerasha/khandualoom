import { Product } from '@/types';

export type SortOption =
  | 'recommended'
  | 'price_low_high'
  | 'price_high_low'
  | 'newest'
  | 'rating';

export interface CatalogFilterState {
  weaves: string[];
  fabrics: string[];
  priceRange: [number, number];
  giTaggedOnly: boolean;
  occasions: string[];
  artisanSocieties: string[];
  sortBy: SortOption;
  searchQuery?: string;
  category?: string;
}

export const initialFilterState: CatalogFilterState = {
  weaves: [],
  fabrics: [],
  priceRange: [1000, 50000],
  giTaggedOnly: false,
  occasions: [],
  artisanSocieties: [],
  sortBy: 'recommended',
  searchQuery: '',
};

export const filterAndSortProducts = (
  products: Product[],
  filters: CatalogFilterState
): Product[] => {
  return products
    .filter((product) => {
      // Category / Collection filter (supports slugs like /collections/khandua-silk or /collections/Khandua%20Silk)
      if (filters.category && filters.category !== 'All') {
        const normalizedTarget = decodeURIComponent(filters.category)
          .toLowerCase()
          .replace(/[-_]/g, ' ')
          .trim();
        const prodCat = (product.category || '').toLowerCase();
        const prodWeave = (product.weave || '').toLowerCase();
        const prodName = (product.name || '').toLowerCase();

        const isKhanduaMatch =
          (normalizedTarget.includes('khandua') || normalizedTarget.includes('khadua')) &&
          (prodCat.includes('khandua') || prodCat.includes('khadua') || prodWeave.includes('khandua') || prodWeave.includes('khadua') || prodName.includes('khandua') || prodName.includes('khadua'));

        const matchesCategory =
          isKhanduaMatch ||
          prodCat === normalizedTarget ||
          prodCat.includes(normalizedTarget) ||
          normalizedTarget.includes(prodCat) ||
          prodWeave.includes(normalizedTarget) ||
          prodName.includes(normalizedTarget);

        if (!matchesCategory) return false;
      }

      // Search Query filter
      if (filters.searchQuery && filters.searchQuery.trim().length > 0) {
        const q = filters.searchQuery.toLowerCase();
        const matchesSearch =
          product.name.toLowerCase().includes(q) ||
          product.description?.toLowerCase().includes(q) ||
          product.fabric?.toLowerCase().includes(q) ||
          product.weave?.toLowerCase().includes(q) ||
          product.color?.toLowerCase().includes(q);
        if (!matchesSearch) return false;
      }

      // Weaves facet
      if (filters.weaves.length > 0) {
        const weaveValue = product.weaveType || product.weave || '';
        const matchesWeave = filters.weaves.some((w) =>
          weaveValue.toLowerCase().includes(w.toLowerCase())
        );
        if (!matchesWeave) return false;
      }

      // Fabric facet
      if (filters.fabrics.length > 0) {
        const fabricValue = product.fabric || '';
        const matchesFabric = filters.fabrics.some((f) =>
          fabricValue.toLowerCase().includes(f.toLowerCase())
        );
        if (!matchesFabric) return false;
      }

      // Price range
      const price = product.price || 0;
      if (price < filters.priceRange[0] || price > filters.priceRange[1]) {
        return false;
      }

      // GI Tagged filter
      if (filters.giTaggedOnly && !product.isGiTagged) {
        return false;
      }

      // Occasion facet
      if (filters.occasions.length > 0 && product.occasion) {
        const matchesOccasion = filters.occasions.some((o) =>
          product.occasion?.toLowerCase().includes(o.toLowerCase())
        );
        if (!matchesOccasion) return false;
      }

      // Artisan society facet
      if (filters.artisanSocieties.length > 0 && product.artisanSociety) {
        const matchesSociety = filters.artisanSocieties.some((s) =>
          product.artisanSociety?.toLowerCase().includes(s.toLowerCase())
        );
        if (!matchesSociety) return false;
      }

      return true;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'price_low_high':
          return a.price - b.price;
        case 'price_high_low':
          return b.price - a.price;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'newest':
          return b.id - a.id;
        case 'recommended':
        default:
          return (b.rating || 0) * (b.reviews || 0) - (a.rating || 0) * (a.reviews || 0);
      }
    });
};
