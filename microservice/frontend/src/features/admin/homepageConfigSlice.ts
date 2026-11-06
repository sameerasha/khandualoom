import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface HomepageSection {
  id: string;
  type: 'hero' | 'categories' | 'highlights' | 'coupons' | 'artisan' | 'testimonials' | 'newsletter';
  name: string;
  title: string;
  subtitle?: string;
  enabled: boolean;
  order: number;
  deviceTarget: 'all' | 'desktop' | 'mobile';
}

export interface HomepageConfigState {
  sections: HomepageSection[];
  isDraft: boolean;
}

const STORAGE_KEY = 'khandualoom_homepage_config';

export const initialSections: HomepageSection[] = [
  {
    id: 'sec-hero',
    type: 'hero',
    name: 'Hero Promotional Banner',
    title: 'Celebrate India, Celebrate Handloom Fashion',
    subtitle: '50-80% Off Handcrafted Khandua and Sambalpuri Silks',
    enabled: true,
    order: 0,
    deviceTarget: 'all',
  },
  {
    id: 'sec-categories',
    type: 'categories',
    name: 'Heritage Category Tiles',
    title: 'Explore Masterpiece Weaves of Odisha',
    subtitle: 'Khandua, Sambalpuri, Bomkai, Berhampuri & Kotpad',
    enabled: true,
    order: 1,
    deviceTarget: 'all',
  },
  {
    id: 'sec-coupons',
    type: 'coupons',
    name: 'Coupons Corner',
    title: 'Special Handloom Patron Vouchers',
    subtitle: 'Use code MYNTRA100 or MYNTRA200 for instant discount',
    enabled: true,
    order: 2,
    deviceTarget: 'all',
  },
  {
    id: 'sec-highlights',
    type: 'highlights',
    name: 'Trending Handloom Highlights',
    title: 'Curated Royal Brocades & Sarees',
    subtitle: 'GI-certified authentic silks direct from Nuapatna weaver cooperatives',
    enabled: true,
    order: 3,
    deviceTarget: 'all',
  },
  {
    id: 'sec-artisan',
    type: 'artisan',
    name: 'Artisan Heritage & Loom Stories',
    title: 'Centuries of Sacred Tie-Dye Weaving',
    subtitle: 'Woven for the deities of Jagannath Puri temple since the 12th century',
    enabled: true,
    order: 4,
    deviceTarget: 'all',
  },
  {
    id: 'sec-testimonials',
    type: 'testimonials',
    name: 'Patron Appraisals & Testimonials',
    title: 'Cherished by Connoisseurs Globally',
    subtitle: 'Verified appraisals from handloom patrons',
    enabled: true,
    order: 5,
    deviceTarget: 'all',
  },
  {
    id: 'sec-newsletter',
    type: 'newsletter',
    name: 'Newsletter & Heritage Dispatch',
    title: 'Stay Connected with Our Master Weaves',
    subtitle: 'Exclusive private drops and royal salon invitations',
    enabled: true,
    order: 6,
    deviceTarget: 'all',
  },
];

const loadSectionsFromStorage = (): HomepageSection[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialSections;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : initialSections;
  } catch {
    return initialSections;
  }
};

const initialState: HomepageConfigState = {
  sections: loadSectionsFromStorage(),
  isDraft: false,
};

export const homepageConfigSlice = createSlice({
  name: 'homepageConfig',
  initialState,
  reducers: {
    moveSectionUp: (state, action: PayloadAction<string>) => {
      const idx = state.sections.findIndex((s) => s.id === action.payload);
      if (idx > 0) {
        const item = state.sections[idx];
        state.sections[idx] = state.sections[idx - 1];
        state.sections[idx - 1] = item;
        state.sections.forEach((s, i) => {
          s.order = i;
        });
        state.isDraft = true;
      }
    },
    moveSectionDown: (state, action: PayloadAction<string>) => {
      const idx = state.sections.findIndex((s) => s.id === action.payload);
      if (idx !== -1 && idx < state.sections.length - 1) {
        const item = state.sections[idx];
        state.sections[idx] = state.sections[idx + 1];
        state.sections[idx + 1] = item;
        state.sections.forEach((s, i) => {
          s.order = i;
        });
        state.isDraft = true;
      }
    },
    toggleSection: (state, action: PayloadAction<string>) => {
      const section = state.sections.find((s) => s.id === action.payload);
      if (section) {
        section.enabled = !section.enabled;
        state.isDraft = true;
      }
    },
    updateSection: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<HomepageSection> }>
    ) => {
      const section = state.sections.find((s) => s.id === action.payload.id);
      if (section) {
        Object.assign(section, action.payload.updates);
        state.isDraft = true;
      }
    },
    publishHomepage: (state) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.sections));
      } catch {}
      state.isDraft = false;
    },
    resetHomepageToDefault: (state) => {
      state.sections = [...initialSections];
      state.isDraft = false;
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {}
    },
  },
});

export const {
  moveSectionUp,
  moveSectionDown,
  toggleSection,
  updateSection,
  publishHomepage,
  resetHomepageToDefault,
} = homepageConfigSlice.actions;

export default homepageConfigSlice.reducer;
