export interface CategoryNode {
  id: string;
  name: string;
  slug: string;
  description?: string;
  bannerImage?: string;
  isVisible: boolean;
  order: number;
  subcategories?: CategoryNode[];
}

const STORAGE_KEY = 'khandualoom_category_tree';

export const initialCategoryTree: CategoryNode[] = [
  {
    id: 'cat-women',
    name: 'Women Handlooms',
    slug: 'women',
    description: 'Authentic GI-certified sarees and ethnic wear woven by heritage artisans',
    isVisible: true,
    order: 0,
    subcategories: [
      {
        id: 'cat-khandua',
        name: 'Khandua Silk Sarees',
        slug: 'khandua',
        description: 'Nuapatna holy tie-dye temple silks with sacred Gitagovinda verses',
        isVisible: true,
        order: 0,
      },
      {
        id: 'cat-sambalpuri',
        name: 'Sambalpuri Ikat',
        slug: 'sambalpuri',
        description: 'Bandhakala double-ikat masterworks from Western Odisha',
        isVisible: true,
        order: 1,
      },
      {
        id: 'cat-bomkai',
        name: 'Bomkai Cotton & Silk',
        slug: 'bomkai',
        description: 'Ganjam tribal extra-weft heritage brocades',
        isVisible: true,
        order: 2,
      },
      {
        id: 'cat-berhampuri',
        name: 'Berhampuri Pattu',
        slug: 'berhampuri',
        description: 'Silk sarees with distinct temple borders (Phoda Kumbha)',
        isVisible: true,
        order: 3,
      },
      {
        id: 'cat-pasapalli',
        name: 'Pasapalli Sarees',
        slug: 'pasapalli',
        description: 'Iconic checkerboard patterns representing the game of dice',
        isVisible: true,
        order: 4,
      },
      {
        id: 'cat-kotpad',
        name: 'Kotpad Organic Weave',
        slug: 'kotpad',
        description: 'Tribal natural dye from Aal tree roots from Koraput Mirgan community',
        isVisible: true,
        order: 5,
      },
    ],
  },
  {
    id: 'cat-men',
    name: 'Men Ethnic Handlooms',
    slug: 'men',
    description: 'Handwoven tussar silk kurtas, dhotis, and ceremonial shawls',
    isVisible: true,
    order: 1,
    subcategories: [
      {
        id: 'cat-kurtas',
        name: 'Silk Kurtas & Dhotis',
        slug: 'kurtas',
        description: 'Pure handspun silk kurtas with subtle ikat borders',
        isVisible: true,
        order: 0,
      },
      {
        id: 'cat-shawls',
        name: 'Uttariya & Shawls',
        slug: 'shawls',
        description: 'Sacred Khandua stoles and ceremonial wraps',
        isVisible: true,
        order: 1,
      },
    ],
  },
  {
    id: 'cat-collectibles',
    name: 'Heritage Collectibles',
    slug: 'collectibles',
    description: 'Framed ikat tapestries, sacred cloth banners, and puja silks',
    isVisible: true,
    order: 2,
    subcategories: [
      {
        id: 'cat-tapestry',
        name: 'Ikat Wall Hangings',
        slug: 'wall-hangings',
        description: 'Museum-grade woven artworks of Odishan folklore',
        isVisible: true,
        order: 0,
      },
    ],
  },
];

export const loadCategoryTree = (): CategoryNode[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialCategoryTree;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : initialCategoryTree;
  } catch {
    return initialCategoryTree;
  }
};

export const saveCategoryTree = (tree: CategoryNode[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tree));
  } catch {}
};
