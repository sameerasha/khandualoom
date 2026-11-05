import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '@/app/store';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || '',
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const token = state.auth?.token || localStorage.getItem('khandua_token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      if (!headers.has('X-Correlation-Id')) {
        headers.set('X-Correlation-Id', crypto.randomUUID());
      }
      return headers;
    },
  }),
  tagTypes: ['Products', 'User', 'Orders', 'Reviews', 'Addresses'],
  endpoints: () => ({}),
});
