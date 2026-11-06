import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface DeliveryAddress {
  fullName: string;
  phone: string;
  pincode: string;
  locality: string;
  address: string;
  city: string;
  state: string;
  addressType?: 'HOME' | 'WORK' | 'OTHER';
}

export type CheckoutStep = 'bag' | 'delivery' | 'payment';
export type PaymentOption = 'RAZORPAY' | 'UPI' | 'COD';

interface CheckoutState {
  currentStep: CheckoutStep;
  deliveryAddress: DeliveryAddress | null;
  paymentMethod: PaymentOption;
  reservationExpiresAt: number; // 15-minute countdown
}

const initialState: CheckoutState = {
  currentStep: 'delivery',
  deliveryAddress: null,
  paymentMethod: 'RAZORPAY',
  reservationExpiresAt: Date.now() + 15 * 60 * 1000,
};

export const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    setCurrentStep: (state, action: PayloadAction<CheckoutStep>) => {
      state.currentStep = action.payload;
    },
    setDeliveryAddress: (state, action: PayloadAction<DeliveryAddress>) => {
      state.deliveryAddress = action.payload;
    },
    setPaymentMethod: (state, action: PayloadAction<PaymentOption>) => {
      state.paymentMethod = action.payload;
    },
    resetReservationTimer: (state) => {
      state.reservationExpiresAt = Date.now() + 15 * 60 * 1000;
    },
  },
});

export const {
  setCurrentStep,
  setDeliveryAddress,
  setPaymentMethod,
  resetReservationTimer,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
