import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DeliveryAddressStep } from './DeliveryAddressStep';
import { PaymentStep } from './PaymentStep';
import { useAppSelector } from '@/app/hooks';
import { calculateCartTotals } from '@/features/cart/cartCalculations';
import { Truck, ShieldCheck, ArrowLeft } from 'lucide-react';

export const MultiStepCheckoutView: React.FC = () => {
  const navigate = useNavigate();
  const cartItems = useAppSelector((state) => state.cart.items);
  const appliedCoupon = useAppSelector((state) => state.cart.appliedCoupon);
  const donationAmount = useAppSelector((state) => state.cart.donationAmount);
  const deliveryAddress = useAppSelector((state) => state.checkout.deliveryAddress);

  const [activeStep, setActiveStep] = useState<'delivery' | 'payment'>('delivery');

  const totals = calculateCartTotals({
    items: cartItems,
    coupon: appliedCoupon,
    donationAmount,
  });

  return (
    <div className="space-y-6">
      {/* Back button & Stepper State */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            if (activeStep === 'payment') {
              setActiveStep('delivery');
            } else {
              navigate('/cart');
            }
          }}
          className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{activeStep === 'payment' ? 'Back to Delivery Address' : 'Back to Shopping Bag'}</span>
        </button>

        <span className="text-xs font-mono uppercase tracking-wider text-gray-500 font-medium">
          Step {activeStep === 'delivery' ? '2 of 3 (Delivery)' : '3 of 3 (Payment)'}
        </span>
      </div>

      {/* Main 2-Column Checkout Layout matching Screenshot 5 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Active Step (7 cols) */}
        <div className="lg:col-span-7">
          {activeStep === 'delivery' ? (
            <DeliveryAddressStep onProceed={() => setActiveStep('payment')} />
          ) : (
            <PaymentStep totals={totals} onSuccess={() => {}} />
          )}
        </div>

        {/* Right Column: Delivery Speed & Order Total Summary matching Screenshot 5 (5 cols) */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">
          {/* Delivery Speed Card matching Screenshot 5 */}
          <div className="p-4 rounded-lg bg-white border border-gray-200 shadow-xs text-xs">
            <span className="font-bold text-[11px] text-gray-500 uppercase tracking-wider block mb-2">
              DELIVERY SPEED
            </span>
            <div className="p-3.5 rounded-lg bg-teal-50/50 border border-teal-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-teal-600 shrink-0" />
                <span className="font-bold text-gray-900">Standard delivery</span>
              </div>
              <span className="text-xs text-teal-700 font-semibold">Free delivery</span>
            </div>
          </div>

          {/* Order Total Details Card matching Screenshot 5 */}
          <div className="p-5 rounded-lg bg-white border border-gray-200 shadow-xs text-xs space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
              <span className="font-bold uppercase tracking-wider text-gray-900 text-xs">
                {totals.totalItems} {totals.totalItems === 1 ? 'ITEM' : 'ITEMS'}
              </span>
              <span className="text-[11px] font-semibold text-teal-700 hover:underline cursor-pointer">
                View Details
              </span>
            </div>

            {/* Saree thumbnails list */}
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item.product.id} className="flex items-center justify-between text-xs py-1 border-b border-gray-100">
                  <div className="flex items-center gap-2 truncate pr-2">
                    <img src={item.product.image} alt={item.product.name} className="w-8 h-10 object-cover rounded shrink-0 border border-gray-200" />
                    <span className="text-gray-800 truncate">{item.product.name} × {item.quantity}</span>
                  </div>
                  <span className="font-mono text-gray-900 font-semibold shrink-0">
                    ₹{(item.product.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between text-gray-600 pt-1">
              <span>Order Total</span>
              <span className="font-mono font-medium text-gray-900">₹{totals.subtotal.toLocaleString()}</span>
            </div>

            {totals.couponDiscount > 0 && (
              <div className="flex justify-between text-teal-700 font-semibold">
                <span>Coupon Savings</span>
                <span>- ₹{totals.couponDiscount.toLocaleString()}</span>
              </div>
            )}

            {totals.donation > 0 && (
              <div className="flex justify-between text-rose-600">
                <span>Weaver Welfare Contribution</span>
                <span>+ ₹{totals.donation}</span>
              </div>
            )}

            <div className="flex justify-between text-gray-600">
              <span>Delivery</span>
              <span className="text-teal-700 font-bold uppercase tracking-wider">FREE</span>
            </div>

            <div className="pt-3 border-t border-gray-200 flex justify-between items-baseline font-bold">
              <span className="text-gray-900 text-sm">Total Payable</span>
              <span className="text-gray-900 text-lg font-mono">
                ₹{totals.totalPayable.toLocaleString()}
              </span>
            </div>

            {/* If in delivery step, prompt to proceed */}
            {activeStep === 'delivery' && (
              <div className="pt-2">
                <button
                  type="button"
                  disabled={!deliveryAddress}
                  onClick={() => setActiveStep('payment')}
                  className="w-full py-3.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-xs cursor-pointer"
                >
                  CONTINUE TO PAYMENT
                </button>
                {!deliveryAddress && (
                  <p className="text-[11px] text-gray-500 text-center mt-2">
                    Please select a serviceable address to proceed
                  </p>
                )}
              </div>
            )}

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-500 pt-2 border-t border-gray-100">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>100% Secure Checkout • Verified Handloom Quality</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
