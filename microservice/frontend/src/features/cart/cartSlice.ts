import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem, Product } from '@/types';

export interface Coupon {
  code: string;
  discountType: 'PERCENT' | 'FLAT';
  value: number;
  minOrder?: number;
  description: string;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
  appliedCoupon: Coupon | null;
  donationAmount: number;
}

const CART_STORAGE_KEY = 'khandua_cart';

const loadCartFromStorage = (): CartItem[] => {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveCartToStorage = (items: CartItem[]) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to persist cart to storage', err);
  }
};

const initialState: CartState = {
  items: loadCartFromStorage(),
  isOpen: false,
  appliedCoupon: null,
  donationAmount: 0,
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<{ product: Product; quantity?: number }>
    ) => {
      const { product, quantity = 1 } = action.payload;
      const existing = state.items.find((item) => item.product.id === product.id);
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({ product, quantity });
      }
      saveCartToStorage(state.items);
      state.isOpen = true;
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.product.id !== action.payload);
      saveCartToStorage(state.items);
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ productId: number; quantity: number }>
    ) => {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        state.items = state.items.filter((item) => item.product.id !== productId);
      } else {
        const item = state.items.find((i) => i.product.id === productId);
        if (item) {
          item.quantity = quantity;
        }
      }
      saveCartToStorage(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      saveCartToStorage([]);
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    setCartOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
    applyCoupon: (state, action: PayloadAction<Coupon>) => {
      state.appliedCoupon = action.payload;
    },
    removeCoupon: (state) => {
      state.appliedCoupon = null;
    },
    setDonationAmount: (state, action: PayloadAction<number>) => {
      state.donationAmount = Math.max(0, action.payload);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleCart,
  setCartOpen,
  applyCoupon,
  removeCoupon,
  setDonationAmount,
} = cartSlice.actions;

export default cartSlice.reducer;
