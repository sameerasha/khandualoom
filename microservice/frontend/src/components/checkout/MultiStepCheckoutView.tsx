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
          className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{activeStep === 'payment' ? 'Back to Delivery Address' : 'Back to Shopping Bag'}</span>
        </button>

        <span className="text-xs font-mono uppercase tracking-wider text-text-muted font-medium">
          Step {activeStep === 'delivery' ? '2 of 3 (Delivery)' : '3 of 3 (Payment)'}
        </span>
      </div>

      {/* Main 2-Column Checkout Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Active Step (7 cols) */}
        <div className="lg:col-span-7">
          {activeStep === 'delivery' ? (
            <DeliveryAddressStep onProceed={() => setActiveStep('payment')} />
          ) : (
            <PaymentStep totals={totals} onSuccess={() => {}} />
          )}
        </div>

        {/* Right Column: Delivery Speed & Order Total Summary (5 cols) */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">
          {/* Delivery Speed Card */}
          <div className="p-4 rounded-lg bg-surface border border-border shadow-xs text-xs">
            <span className="font-bold text-[11px] text-text-muted uppercase tracking-wider block mb-2">
              DELIVERY SPEED
            </span>
            <div className="p-3.5 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                <span className="font-bold text-text-primary">Standard delivery</span>
              </div>
              <span className="text-xs text-teal-600 dark:text-teal-400 font-semibold">Free delivery</span>
            </div>
          </div>

          {/* Order Total Details Card */}
          <div className="p-5 rounded-lg bg-surface border border-border shadow-xs text-xs space-y-3">
            <div className="flex items-center justify-between border-b border-border pb-2.5">
              <span className="font-bold uppercase tracking-wider text-text-primary text-xs">
                {totals.totalItems} {totals.totalItems === 1 ? 'ITEM' : 'ITEMS'}
              </span>
              <span className="text-[11px] font-semibold text-primary hover:underline cursor-pointer">
                View Details
              </span>
            </div>

            {/* Saree thumbnails list */}
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item.product.id} className="flex items-center justify-between text-xs py-1 border-b border-border">
                  <div className="flex items-center gap-2 truncate pr-2">
                    <img src={item.product.image} alt={item.product.name} className="w-8 h-10 object-cover rounded shrink-0 border border-border" />
                    <span className="text-text-primary truncate">{item.product.name} × {item.quantity}</span>
                  </div>
                  <span className="font-mono text-text-primary font-semibold shrink-0">
                    ₹{(item.product.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between text-text-secondary pt-1">
              <span>Order Total</span>
              <span className="font-mono font-medium text-text-primary">₹{totals.subtotal.toLocaleString()}</span>
            </div>

            {totals.couponDiscount > 0 && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                <span>Coupon Savings</span>
                <span>- ₹{totals.couponDiscount.toLocaleString()}</span>
              </div>
            )}

            {totals.donation > 0 && (
              <div className="flex justify-between text-rose-600 dark:text-rose-400">
                <span>Weaver Welfare Contribution</span>
                <span>+ ₹{totals.donation}</span>
              </div>
            )}

            <div className="flex justify-between text-text-secondary">
              <span>Delivery</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">FREE</span>
            </div>

            <div className="pt-3 border-t border-border flex justify-between items-baseline font-bold">
              <span className="text-text-primary text-sm">Total Payable</span>
              <span className="text-text-primary text-lg font-mono">
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
                  className="w-full py-3.5 rounded-lg bg-primary hover:bg-primary-hover text-white font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-xs cursor-pointer"
                >
                  CONTINUE TO PAYMENT
                </button>
                {!deliveryAddress && (
                  <p className="text-[11px] text-text-muted text-center mt-2">
                    Please select a serviceable address to proceed
                  </p>
                )}
              </div>
            )}

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-text-muted pt-2 border-t border-border">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>100% Secure Checkout • Verified Handloom Quality</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
