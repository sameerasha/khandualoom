import { baseApi } from '@/services/baseApi';
import { Order } from '@/types';

export interface CheckoutRequest {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  paymentMethod: string;
  items: {
    productId: number;
    productName: string;
    productImage?: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  shippingCost?: number;
  discountAmount?: number;
  paymentId?: string;
}

export interface RazorpayOrderResponse {
  keyId: string;
  razorpayOrderId: string;
  amount: number;
  currency: string;
}

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createCheckoutOrder: builder.mutation<Order, CheckoutRequest>({
      query: (body) => ({
        url: '/api/orders/checkout',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Orders'],
    }),
    getMyOrders: builder.query<Order[], void>({
      query: () => '/api/orders/my-orders',
      providesTags: ['Orders'],
    }),
    getAllOrders: builder.query<Order[], void>({
      query: () => '/api/orders/admin/all',
      providesTags: ['Orders'],
    }),
    updateOrderStatus: builder.mutation<
      Order,
      { id: number; status: string }
    >({
      query: ({ id, status }) => ({
        url: `/api/orders/admin/${id}/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: ['Orders'],
    }),
    createPaymentOrder: builder.mutation<
      RazorpayOrderResponse,
      { amount: number; receipt: string }
    >({
      query: (body) => ({
        url: '/api/payment/create-order',
        method: 'POST',
        body,
      }),
    }),
    verifyPayment: builder.mutation<
      { status: string; message: string },
      {
        razorpayOrderId: string;
        razorpayPaymentId: string;
        razorpaySignature: string;
      }
    >({
      query: (body) => ({
        url: '/api/payment/verify',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useCreateCheckoutOrderMutation,
  useGetMyOrdersQuery,
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
  useCreatePaymentOrderMutation,
  useVerifyPaymentMutation,
} = ordersApi;
