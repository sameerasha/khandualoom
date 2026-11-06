export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaUrl: string;
  placement: 'hero' | 'category' | 'sticky_tab' | 'festive_sale' | 'footer';
  desktopImage: string;
  mobileImage?: string;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  order: number;
}

const STORAGE_KEY = 'khandualoom_admin_banners';

export const initialBanners: Banner[] = [
  {
    id: 'ban-001',
    title: 'Right to Fashion Sale — 50-80% Off',
    subtitle: 'Celebrate India, Celebrate Fashion with Authenticated Handlooms',
    ctaText: 'Explore Catalog',
    ctaUrl: '/catalog',
    placement: 'hero',
    desktopImage: '/images/hero_handloom_banner.jpg',
    mobileImage: '/images/hero_handloom_mobile.jpg',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    isActive: true,
    order: 0,
  },
  {
    id: 'ban-002',
    title: 'FLAT ₹300 OFF on First Saree Order',
    subtitle: 'Exclusive Welcome Incentive for Handloom Connoisseurs',
    ctaText: 'Claim Coupon',
    ctaUrl: '/catalog',
    placement: 'sticky_tab',
    desktopImage: '',
    isActive: true,
    order: 1,
  },
  {
    id: 'ban-003',
    title: 'GI-Certified Nuapatna Khandua Silk Special',
    subtitle: 'Temple-Blessed Handloom Heritage with Silk Mark Guarantee',
    ctaText: 'Shop Khandua',
    ctaUrl: '/collections/Khandua',
    placement: 'category',
    desktopImage: '/images/khandua_category_banner.jpg',
    isActive: true,
    order: 2,
  },
  {
    id: 'ban-004',
    title: 'Sambalpuri Double Ikat Masterpieces',
    subtitle: 'Intricate Geometric Precision Woven by Bargarh Artisans',
    ctaText: 'Shop Sambalpuri',
    ctaUrl: '/collections/Sambalpuri',
    placement: 'festive_sale',
    desktopImage: '/images/sambalpuri_banner.jpg',
    isActive: true,
    order: 3,
  },
];

export const loadBanners = (): Banner[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialBanners;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : initialBanners;
  } catch {
    return initialBanners;
  }
};

export const saveBanners = (banners: Banner[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(banners));
  } catch {}
};
