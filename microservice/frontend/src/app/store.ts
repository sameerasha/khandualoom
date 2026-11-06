import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/authSlice';
import cartReducer from '@/features/cart/cartSlice';
import productsReducer from '@/features/products/productsSlice';
import wishlistReducer from '@/features/wishlist/wishlistSlice';
import i18nReducer from '@/features/i18n/i18nSlice';
import checkoutReducer from '@/features/checkout/checkoutSlice';
import featuresReducer from '@/features/admin/featureSlice';
import { baseApi } from '@/services/baseApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    products: productsReducer,
    wishlist: wishlistReducer,
    i18n: i18nReducer,
    checkout: checkoutReducer,
    features: featuresReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
