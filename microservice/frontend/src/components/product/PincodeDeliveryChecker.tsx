import React, { useState } from 'react';
import { Truck, CheckCircle2, AlertCircle } from 'lucide-react';
import { checkPincodeServiceability, PincodeResult } from '@/features/pincode/pincodeService';

export const PincodeDeliveryChecker: React.FC = () => {
  const [pincode, setPincode] = useState('');
  const [result, setResult] = useState<PincodeResult | null>(null);
  const [touched, setTouched] = useState(false);

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    setResult(checkPincodeServiceability(pincode));
  };

  return (
    <div className="py-5 border-y border-brand-gold/15">
      <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-brand-gold-light">
        <Truck className="w-4 h-4 text-brand-gold" />
        <span>DELIVERY OPTIONS & SERVICEABILITY</span>
      </div>

      <form onSubmit={handleCheck} className="flex gap-2 max-w-sm mt-2">
        <input
          type="text"
          maxLength={6}
          placeholder="Enter 6-digit Pincode"
          value={pincode}
          onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
          className="flex-1 bg-[#1A0A2C] border border-brand-gold/25 rounded-md px-3 py-2 text-xs text-brand-ivory placeholder-brand-ivory/40 focus:outline-none focus:border-brand-gold font-mono"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-brand-gold text-brand-purple-dark font-bold text-xs uppercase tracking-wider rounded-md hover:bg-brand-gold-light transition-colors cursor-pointer"
        >
          Check
        </button>
      </form>

      {touched && result && (
        <div className="mt-3 text-xs">
          {result.serviceable ? (
            <div className="space-y-1.5 text-brand-ivory/80">
              <div className="flex items-center gap-2 text-emerald-400 font-medium">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>
                  Delivery to {result.city}, {result.state} in approx. {result.estimatedDays} business days
                </span>
              </div>
              <p className="text-[11px] text-brand-ivory/60 ml-6">
                • FREE Insured Handloom Transit on this order
              </p>
              <p className="text-[11px] text-brand-ivory/60 ml-6">
                • Cash on Delivery (COD) {result.codAvailable ? 'Available' : 'Unavailable'}
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-rose-400 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Please enter a valid 6-digit Indian postal pincode.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
