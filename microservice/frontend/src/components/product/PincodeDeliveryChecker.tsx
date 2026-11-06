import React, { useState } from 'react';
import { Truck, CheckCircle2, AlertCircle, RefreshCw, ShieldCheck } from 'lucide-react';
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

  const getEstimatedDateString = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <div className="py-5 border-y border-gray-200">
      <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-gray-800">
        <Truck className="w-4 h-4 text-teal-600" />
        <span>Delivery Options</span>
      </div>

      <form onSubmit={handleCheck} className="flex gap-2 max-w-sm mt-2">
        <input
          type="text"
          maxLength={6}
          placeholder="Enter 6-digit Pincode"
          value={pincode}
          onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
          className="flex-1 bg-white border border-gray-300 rounded px-3 py-2 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-teal-600 font-mono transition-colors"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-teal-600 text-white font-bold text-xs uppercase tracking-wider rounded hover:bg-teal-700 transition-colors cursor-pointer"
        >
          Check
        </button>
      </form>

      {touched && result && (
        <div className="mt-3 text-xs">
          {result.serviceable ? (
            <div className="space-y-1.5 text-gray-700">
              <div className="flex items-center gap-2 text-teal-700 font-bold">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-teal-600" />
                <span>
                  Delivery by {getEstimatedDateString(result.estimatedDays)} to {result.city}, {result.state}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600 ml-6">
                <Truck className="w-3.5 h-3.5 text-gray-400" />
                <span>Free delivery on this order</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600 ml-6">
                <RefreshCw className="w-3.5 h-3.5 text-gray-400" />
                <span>14 Days Easy Returns & Exchanges</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600 ml-6">
                <ShieldCheck className="w-3.5 h-3.5 text-gray-400" />
                <span>100% Genuine Handloom Certified</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-rose-600 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Please enter a valid 6-digit Indian pincode.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
