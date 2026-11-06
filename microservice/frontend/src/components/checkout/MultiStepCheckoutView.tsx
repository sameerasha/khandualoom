import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DeliveryAddressStep } from './DeliveryAddressStep';
import { PaymentStep } from './PaymentStep';
import { ReservationCountdown } from './ReservationCountdown';
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
          className="text-xs font-semibold text-brand-gold hover:text-brand-gold-light flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{activeStep === 'payment' ? 'Back to Delivery Address' : 'Back to Shopping Bag'}</span>
        </button>

        <span className="text-xs font-mono uppercase tracking-wider text-brand-gold-light">
          Step {activeStep === 'delivery' ? '2 of 3 (Delivery)' : '3 of 3 (Payment)'}
        </span>
      </div>

      {/* Reservation countdown alert for luxury single-piece sarees */}
      <ReservationCountdown />

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
          <div className="p-4 rounded-xl bg-[#170928] border border-brand-gold/20 text-xs">
            <span className="font-bold text-[11px] text-brand-gold-light uppercase tracking-wider block mb-2">
              DELIVERY SPEED
            </span>
            <div className="p-3 rounded-lg bg-[#140622] border border-emerald-500/30 flex items-center gap-3">
              <Truck className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <p className="font-bold text-brand-ivory">Standard Handloom Insured Delivery</p>
                <p className="text-[11px] text-emerald-400 font-semibold">Free delivery included</p>
              </div>
            </div>
          </div>

          {/* Order Total Details Card matching Screenshot 5 */}
          <div className="p-5 rounded-xl bg-[#170928] border border-brand-gold/20 text-xs space-y-3">
            <span className="font-bold uppercase tracking-wider text-brand-gold block border-b border-brand-gold/15 pb-2">
              ORDER TOTAL ({totals.totalItems} {totals.totalItems === 1 ? 'Item' : 'Items'})
            </span>

            {/* Saree thumbnails list */}
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item.product.id} className="flex items-center justify-between text-xs py-1 border-b border-brand-gold/10">
                  <div className="flex items-center gap-2 truncate pr-2">
                    <img src={item.product.image} alt={item.product.name} className="w-8 h-10 object-cover rounded shrink-0" />
                    <span className="text-brand-ivory/80 truncate">{item.product.name} × {item.quantity}</span>
                  </div>
                  <span className="font-mono text-brand-gold font-semibold shrink-0">
                    ₹{(item.product.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between text-brand-ivory/80 pt-1">
              <span>Order Subtotal</span>
              <span>₹{totals.subtotal.toLocaleString()}</span>
            </div>

            {totals.couponDiscount > 0 && (
              <div className="flex justify-between text-emerald-400 font-semibold">
                <span>Coupon Savings</span>
                <span>- ₹{totals.couponDiscount.toLocaleString()}</span>
              </div>
            )}

            {totals.donation > 0 && (
              <div className="flex justify-between text-rose-300">
                <span>Weaver Welfare Fund</span>
                <span>+ ₹{totals.donation}</span>
              </div>
            )}

            <div className="flex justify-between text-brand-ivory/80">
              <span>Delivery Charges</span>
              <span className="text-emerald-400 font-bold uppercase tracking-wider">FREE</span>
            </div>

            <div className="pt-3 border-t border-brand-gold/20 flex justify-between items-baseline font-bold">
              <span className="text-brand-ivory text-sm">Total Payable</span>
              <span className="text-brand-gold text-lg font-mono">
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
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow cursor-pointer"
                >
                  CONTINUE TO PAYMENT
                </button>
                {!deliveryAddress && (
                  <p className="text-[10px] text-brand-ivory/50 text-center mt-2">
                    Please select or save a delivery address to proceed to payment
                  </p>
                )}
              </div>
            )}

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-brand-ivory/60 pt-2 border-t border-brand-gold/10">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Direct Artisan Verification & 100% Genuine Heritage Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
