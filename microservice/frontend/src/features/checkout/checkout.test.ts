import checkoutReducer, { setCurrentStep, setDeliveryAddress, setPaymentMethod } from './checkoutSlice';

describe('Checkout State Slice', () => {
  it('advances from bag to delivery and payment steps', () => {
    let state = checkoutReducer(undefined, setCurrentStep('delivery'));
    expect(state.currentStep).toBe('delivery');

    state = checkoutReducer(
      state,
      setDeliveryAddress({
        fullName: 'Aarav Mohapatra',
        phone: '9876543210',
        pincode: '751001',
        locality: 'Saheed Nagar',
        address: 'Plot 42, Janpath',
        city: 'Bhubaneswar',
        state: 'Odisha',
      })
    );
    expect(state.deliveryAddress?.city).toBe('Bhubaneswar');

    state = checkoutReducer(state, setPaymentMethod('RAZORPAY'));
    expect(state.paymentMethod).toBe('RAZORPAY');
  });
});
