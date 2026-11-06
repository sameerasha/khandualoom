import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FeatureFlags {
  wishlist: boolean;
  coupons: boolean;
  threeDSheenCanvas: boolean;
  weaverDonation: boolean;
  pincodeChecker: boolean;
  guestCheckout: boolean;
  reviewsAndRatings: boolean;
  maintenanceMode: boolean;
  recentViews: boolean;
  bankDiscounts: boolean;
}

export interface FeatureState {
  features: FeatureFlags;
  hasUnsavedChanges: boolean;
}

const STORAGE_KEY = 'khandualoom_feature_flags';

export const defaultFeatures: FeatureFlags = {
  wishlist: true,
  coupons: true,
  threeDSheenCanvas: true,
  weaverDonation: true,
  pincodeChecker: true,
  guestCheckout: true,
  reviewsAndRatings: true,
  maintenanceMode: false,
  recentViews: true,
  bankDiscounts: true,
};

const loadFeaturesFromStorage = (): FeatureFlags => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultFeatures;
    const parsed = JSON.parse(raw);
    return { ...defaultFeatures, ...parsed };
  } catch {
    return defaultFeatures;
  }
};

const initialState: FeatureState = {
  features: loadFeaturesFromStorage(),
  hasUnsavedChanges: false,
};

export const featureSlice = createSlice({
  name: 'features',
  initialState,
  reducers: {
    toggleFeature: (state, action: PayloadAction<keyof FeatureFlags>) => {
      state.features[action.payload] = !state.features[action.payload];
      state.hasUnsavedChanges = true;
    },
    setFeature: (
      state,
      action: PayloadAction<{ key: keyof FeatureFlags; value: boolean }>
    ) => {
      state.features[action.payload.key] = action.payload.value;
      state.hasUnsavedChanges = true;
    },
    setAllFeatures: (state, action: PayloadAction<FeatureFlags>) => {
      state.features = action.payload;
      state.hasUnsavedChanges = true;
    },
    saveFeatureConfiguration: (state) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.features));
      } catch {}
      state.hasUnsavedChanges = false;
    },
    resetFeatures: (state) => {
      state.features = { ...defaultFeatures };
      state.hasUnsavedChanges = false;
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {}
    },
  },
});

export const {
  toggleFeature,
  setFeature,
  setAllFeatures,
  saveFeatureConfiguration,
  resetFeatures,
} = featureSlice.actions;

export default featureSlice.reducer;
