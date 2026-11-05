import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '@/types';
import { RootState } from '@/app/store';

interface WishlistState {
  items: Product[];
  isOpen: boolean;
}

const WISHLIST_STORAGE_KEY = 'khandua_wishlist';

const loadWishlistFromStorage = (): Product[] => {
  try {
    const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveWishlistToStorage = (items: Product[]) => {
  try {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to persist wishlist to storage', err);
  }
};

const initialState: WishlistState = {
  items: loadWishlistFromStorage(),
  isOpen: false,
};

export const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist: (state, action: PayloadAction<Product>) => {
      const exists = state.items.some((item) => item.id === action.payload.id);
      if (!exists) {
        state.items.push(action.payload);
        saveWishlistToStorage(state.items);
      }
    },
    removeFromWishlist: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      saveWishlistToStorage(state.items);
    },
    toggleWishlist: (state, action: PayloadAction<Product>) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.push(action.payload);
      }
      saveWishlistToStorage(state.items);
    },
    clearWishlist: (state) => {
      state.items = [];
      saveWishlistToStorage([]);
    },
    setWishlistOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
    toggleWishlistOpen: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});

export const {
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
  clearWishlist,
  setWishlistOpen,
  toggleWishlistOpen,
} = wishlistSlice.actions;

export const selectWishlistItems = (state: RootState) => state.wishlist.items;
export const selectWishlistOpen = (state: RootState) => state.wishlist.isOpen;
export const selectWishlistTotalItems = (state: RootState) => state.wishlist.items.length;
export const selectIsInWishlist = (productId: number) => (state: RootState) =>
  state.wishlist.items.some((item) => item.id === productId);

export default wishlistSlice.reducer;
