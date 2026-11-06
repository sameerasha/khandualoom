import { filterAndSortProducts, CatalogFilterState } from './catalogFilterUtils';
import { Product } from '@/types';

const sampleProducts: Product[] = [
  {
    id: 1,
    name: 'Nuapatna Khandua Pata',
    category: 'Khandua Pata',
    price: 18500,
    originalPrice: 24000,
    image: '/images/khandua_1.jpg',
    description: 'Authentic Khandua silk',
    fabric: 'Mulberry Silk',
    weave: 'Khandua',
    weaveType: 'Khandua',
    color: 'Red & Yellow',
    rating: 4.8,
    reviews: 42,
    stock: 1,
    isGiTagged: true,
    occasion: 'Bridal',
    artisanSociety: 'Nuapatna Weavers',
  },
  {
    id: 2,
    name: 'Sambalpuri Ikat Saree',
    category: 'Sambalpuri',
    price: 8200,
    originalPrice: 10500,
    image: '/images/sambalpuri_1.jpg',
    description: 'Cotton bandha saree',
    fabric: 'Cotton',
    weave: 'Sambalpuri',
    weaveType: 'Sambalpuri',
    color: 'Black & Red',
    rating: 4.5,
    reviews: 30,
    stock: 5,
    isGiTagged: true,
    occasion: 'Festive',
    artisanSociety: 'Bargarh Society',
  },
  {
    id: 3,
    name: 'Bomkai Silk Saree',
    category: 'Bomkai',
    price: 14000,
    originalPrice: 18000,
    image: '/images/bomkai_1.jpg',
    description: 'Handwoven Bomkai pata',
    fabric: 'Tussar Silk',
    weave: 'Bomkai',
    weaveType: 'Bomkai',
    color: 'Royal Blue',
    rating: 4.2,
    reviews: 15,
    stock: 2,
    isGiTagged: false,
    occasion: 'Casual',
    artisanSociety: 'Sonepur Weavers',
  },
];

describe('Catalog Filter Engine', () => {
  it('filters by weave technique and price range', () => {
    const filters: CatalogFilterState = {
      weaves: ['Khandua'],
      fabrics: [],
      priceRange: [15000, 20000],
      giTaggedOnly: false,
      occasions: [],
      artisanSocieties: [],
      sortBy: 'recommended',
    };
    const result = filterAndSortProducts(sampleProducts, filters);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Nuapatna Khandua Pata');
  });

  it('sorts by price low to high', () => {
    const filters: CatalogFilterState = {
      weaves: [],
      fabrics: [],
      priceRange: [0, 50000],
      giTaggedOnly: false,
      occasions: [],
      artisanSocieties: [],
      sortBy: 'price_low_high',
    };
    const result = filterAndSortProducts(sampleProducts, filters);
    expect(result[0].price).toBe(8200);
    expect(result[2].price).toBe(18500);
  });
});
