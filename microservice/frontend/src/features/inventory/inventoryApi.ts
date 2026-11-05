import { baseApi } from '@/services/baseApi';

export interface StockCheckResponse {
  productId: number;
  availableStock: number;
  inStock: boolean;
}

export const inventoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStock: builder.query<StockCheckResponse, number>({
      query: (productId) => `/api/inventory/${productId}`,
      providesTags: (_result, _error, id) => [{ type: 'Products', id }],
    }),
    batchCheckStock: builder.mutation<Record<number, boolean>, number[]>({
      query: (productIds) => ({
        url: '/api/inventory/batch-check',
        method: 'POST',
        body: productIds,
      }),
    }),
  }),
});

export const { useGetStockQuery, useBatchCheckStockMutation } = inventoryApi;
