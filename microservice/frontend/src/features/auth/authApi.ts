import { baseApi } from '@/services/baseApi';
import { User, Address } from '@/types';

export interface LoginRequest {
  email?: string;
  username?: string;
  password?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  username: string;
  role: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  phone?: string;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/api/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),
    ssoLogin: builder.mutation<
      AuthResponse,
      { provider: 'google' | 'facebook'; email?: string; name?: string }
    >({
      query: (body) => ({
        url: '/api/auth/sso',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'],
    }),
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (userData) => ({
        url: '/api/auth/register',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),
    logoutUser: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: '/api/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),
    getProfile: builder.query<User, void>({
      query: () => '/api/users/profile',
      providesTags: ['User'],
    }),
    updateProfile: builder.mutation<User, Partial<User>>({
      query: (data) => ({
        url: '/api/users/profile',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    requestOtp: builder.mutation<
      { success: boolean; message: string; debugOtp?: string },
      { emailOrPhone: string; channel?: 'EMAIL' | 'SMS' }
    >({
      query: (body) => ({
        url: '/api/auth/request-otp',
        method: 'POST',
        body,
      }),
    }),
    verifyOtp: builder.mutation<
      AuthResponse,
      { emailOrPhone: string; code: string }
    >({
      query: (body) => ({
        url: '/api/auth/verify-otp',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'],
    }),
    getAddresses: builder.query<Address[], void>({
      query: () => '/api/users/addresses',
      providesTags: ['Addresses'],
    }),
    addAddress: builder.mutation<Address, Address>({
      query: (body) => ({
        url: '/api/users/addresses',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Addresses'],
    }),
    deleteAddress: builder.mutation<void, number>({
      query: (id) => ({
        url: `/api/users/addresses/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Addresses'],
    }),
  }),
});

export const {
  useLoginMutation,
  useSsoLoginMutation,
  useRegisterMutation,
  useLogoutUserMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useRequestOtpMutation,
  useVerifyOtpMutation,
  useGetAddressesQuery,
  useAddAddressMutation,
  useDeleteAddressMutation,
} = authApi;
