import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { setDeliveryAddress, DeliveryAddress } from '@/features/checkout/checkoutSlice';
import { checkPincodeServiceability } from '@/features/pincode/pincodeService';
import { MapPin, Plus, Check, ShieldCheck } from 'lucide-react';

interface DeliveryAddressStepProps {
  onProceed: () => void;
}

const defaultSavedAddresses: DeliveryAddress[] = [
  {
    fullName: 'Aarav Mohapatra',
    phone: '9876543210',
    pincode: '751001',
    locality: 'Saheed Nagar',
    address: 'Plot 42, Janpath Road, Opp. Rama Devi University',
    city: 'Bhubaneswar',
    state: 'Odisha',
    addressType: 'HOME',
  },
];

export const DeliveryAddressStep: React.FC<DeliveryAddressStepProps> = ({ onProceed }) => {
  const dispatch = useAppDispatch();
  const currentAddress = useAppSelector((state) => state.checkout.deliveryAddress);

  const [savedAddresses, setSavedAddresses] = useState<DeliveryAddress[]>(defaultSavedAddresses);
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [showNewForm, setShowNewForm] = useState(false);

  // Form State
  const [pincode, setPincode] = useState('');
  const [locality, setLocality] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [fullName, setFullName] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [addressType, setAddressType] = useState<'HOME' | 'WORK' | 'OTHER'>('HOME');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handlePincodeChange = (val: string) => {
    const clean = val.replace(/\D/g, '').slice(0, 6);
    setPincode(clean);
    if (clean.length === 6) {
      const lookup = checkPincodeServiceability(clean);
      if (lookup.serviceable) {
        setCity(lookup.city);
        setState(lookup.state);
        setErrorMsg(null);
      } else {
        setErrorMsg('Please enter a valid serviceable pincode');
      }
    }
  };

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode || !locality || !city || !state || !fullName || !streetAddress || !phone) {
      setErrorMsg('Please fill in all mandatory fields (*)');
      return;
    }

    const newAddr: DeliveryAddress = {
      fullName,
      phone,
      pincode,
      locality,
      address: streetAddress,
      city,
      state,
      addressType,
    };

    setSavedAddresses([...savedAddresses, newAddr]);
    setSelectedIdx(savedAddresses.length);
    dispatch(setDeliveryAddress(newAddr));
    setShowNewForm(false);
    setErrorMsg(null);
  };

  const handleContinueWithSelected = () => {
    const chosen = savedAddresses[selectedIdx] || currentAddress;
    if (chosen) {
      dispatch(setDeliveryAddress(chosen));
      onProceed();
    } else {
      setErrorMsg('Please select or add a delivery address to proceed.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl font-bold text-brand-gold flex items-center gap-2">
          <MapPin className="w-5 h-5 text-brand-gold" />
          <span>Select Delivery Address</span>
        </h2>

        {!showNewForm && (
          <button
            type="button"
            onClick={() => setShowNewForm(true)}
            className="text-xs font-bold uppercase tracking-wider text-brand-gold hover:text-brand-gold-light flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>ADD NEW ADDRESS</span>
          </button>
        )}
      </div>

      {/* Saved Addresses Radio Cards */}
      {!showNewForm && savedAddresses.length > 0 && (
        <div className="space-y-3">
          {savedAddresses.map((addr, idx) => {
            const isSelected = selectedIdx === idx;
            return (
              <div
                key={idx}
                onClick={() => setSelectedIdx(idx)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                  isSelected
                    ? 'bg-[#1D0C30] border-brand-gold shadow-md'
                    : 'bg-[#150724] border-brand-gold/20 hover:border-brand-gold/40'
                }`}
              >
                <input
                  type="radio"
                  name="addressSelection"
                  checked={isSelected}
                  onChange={() => setSelectedIdx(idx)}
                  className="w-4 h-4 accent-brand-gold mt-1 cursor-pointer"
                />

                <div className="flex-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-brand-ivory text-sm">{addr.fullName}</span>
                    <span className="px-2 py-0.5 rounded bg-brand-gold/15 text-brand-gold text-[10px] uppercase font-bold">
                      {addr.addressType || 'HOME'}
                    </span>
                  </div>

                  <p className="text-brand-ivory/80 mt-1">{addr.address}</p>
                  <p className="text-brand-ivory/80">
                    {addr.locality}, {addr.city}, {addr.state} -{' '}
                    <strong className="text-brand-gold font-mono">{addr.pincode}</strong>
                  </p>
                  <p className="text-brand-ivory/60 mt-1">Mobile: {addr.phone}</p>

                  {isSelected && (
                    <button
                      type="button"
                      onClick={handleContinueWithSelected}
                      className="mt-3 px-6 py-2 rounded bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs uppercase tracking-wider shadow cursor-pointer"
                    >
                      DELIVER TO THIS ADDRESS
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add New Address Form matching Screenshot 5 */}
      {showNewForm && (
        <form
          onSubmit={handleSaveNewAddress}
          className="p-6 rounded-2xl bg-[#170928] border border-brand-gold/25 space-y-4"
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-sm text-brand-gold uppercase tracking-wider">
              ADD NEW ADDRESS
            </h3>
            <button
              type="button"
              onClick={() => setShowNewForm(false)}
              className="text-xs text-brand-ivory/50 hover:text-brand-ivory"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-semibold text-brand-gold-light uppercase block mb-1">
                Pin Code*
              </label>
              <input
                type="text"
                maxLength={6}
                placeholder="6 digits [0-9]"
                value={pincode}
                onChange={(e) => handlePincodeChange(e.target.value)}
                className="w-full bg-[#1A0A2C] border border-brand-gold/25 rounded px-3 py-2 text-xs text-brand-ivory font-mono focus:outline-none focus:border-brand-gold"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-brand-gold-light uppercase block mb-1">
                Locality / Town*
              </label>
              <input
                type="text"
                placeholder="e.g. Saheed Nagar / Nuapatna Market"
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                className="w-full bg-[#1A0A2C] border border-brand-gold/25 rounded px-3 py-2 text-xs text-brand-ivory focus:outline-none focus:border-brand-gold"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-brand-gold-light uppercase block mb-1">
                City / District*
              </label>
              <input
                type="text"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-[#1A0A2C] border border-brand-gold/25 rounded px-3 py-2 text-xs text-brand-ivory focus:outline-none focus:border-brand-gold"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-brand-gold-light uppercase block mb-1">
                State*
              </label>
              <input
                type="text"
                placeholder="State"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full bg-[#1A0A2C] border border-brand-gold/25 rounded px-3 py-2 text-xs text-brand-ivory focus:outline-none focus:border-brand-gold"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-[11px] font-semibold text-brand-gold-light uppercase block mb-1">
                Full Name*
              </label>
              <input
                type="text"
                placeholder="Recipient Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-[#1A0A2C] border border-brand-gold/25 rounded px-3 py-2 text-xs text-brand-ivory focus:outline-none focus:border-brand-gold"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-[11px] font-semibold text-brand-gold-light uppercase block mb-1">
                Address (House No, Building, Street, Area)*
              </label>
              <textarea
                rows={2}
                placeholder="Street address details"
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
                className="w-full bg-[#1A0A2C] border border-brand-gold/25 rounded px-3 py-2 text-xs text-brand-ivory focus:outline-none focus:border-brand-gold"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-brand-gold-light uppercase block mb-1">
                Mobile No*
              </label>
              <input
                type="tel"
                maxLength={10}
                placeholder="10-digit mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-[#1A0A2C] border border-brand-gold/25 rounded px-3 py-2 text-xs text-brand-ivory font-mono focus:outline-none focus:border-brand-gold"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-brand-gold-light uppercase block mb-1">
                Address Type
              </label>
              <div className="flex gap-2">
                {(['HOME', 'WORK', 'OTHER'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setAddressType(t)}
                    className={`flex-1 py-2 rounded text-xs font-semibold uppercase ${
                      addressType === t
                        ? 'bg-brand-gold text-brand-purple-dark'
                        : 'bg-[#1A0A2C] border border-brand-gold/20 text-brand-ivory/70'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {errorMsg && <p className="text-xs text-rose-400 font-medium">{errorMsg}</p>}

          <div className="pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              SAVE ADDRESS
            </button>
          </div>
        </form>
      )}

      {/* Trust notice */}
      <div className="flex items-center gap-2 text-xs text-brand-ivory/60 pt-2">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span>Your delivery details are protected and encrypted for genuine artisan shipment.</span>
      </div>
    </div>
  );
};
