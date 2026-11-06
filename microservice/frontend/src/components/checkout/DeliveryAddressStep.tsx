import React, { useState } from 'react';
import { useAppDispatch } from '@/app/hooks';
import { setDeliveryAddress, DeliveryAddress } from '@/features/checkout/checkoutSlice';
import { checkPincodeServiceability } from '@/features/pincode/pincodeService';
import { MapPin, Plus, ShieldCheck } from 'lucide-react';

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
      setErrorMsg('Please fill in all required delivery fields');
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

    const updated = [newAddr, ...savedAddresses];
    setSavedAddresses(updated);
    setSelectedIdx(0);
    dispatch(setDeliveryAddress(newAddr));
    setShowNewForm(false);
    setErrorMsg(null);
  };

  const handleContinueWithSelected = () => {
    const selected = savedAddresses[selectedIdx] || defaultSavedAddresses[0];
    dispatch(setDeliveryAddress(selected));
    onProceed();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-accent" />
          <h2 className="text-base font-bold text-text-primary uppercase tracking-wide">
            Select Delivery Address
          </h2>
        </div>

        {!showNewForm && (
          <button
            type="button"
            onClick={() => setShowNewForm(true)}
            className="text-xs font-bold uppercase tracking-wider text-primary hover:underline flex items-center gap-1 cursor-pointer"
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
                className={`p-5 rounded-lg border transition-all cursor-pointer flex items-start gap-3.5 ${
                  isSelected
                    ? 'bg-teal-500/10 border-teal-600 dark:border-teal-400 shadow-xs'
                    : 'bg-surface border-border hover:border-border-strong'
                }`}
              >
                <input
                  type="radio"
                  name="addressSelection"
                  checked={isSelected}
                  onChange={() => setSelectedIdx(idx)}
                  className="w-4 h-4 accent-teal-600 mt-1 cursor-pointer"
                />

                <div className="flex-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-text-primary text-sm">{addr.fullName}</span>
                    <span className="px-2 py-0.5 rounded bg-background-secondary text-text-secondary text-[10px] uppercase font-bold tracking-wider">
                      {addr.addressType || 'HOME'}
                    </span>
                  </div>

                  <p className="text-text-secondary mt-1.5">{addr.address}</p>
                  <p className="text-text-secondary">
                    {addr.locality}, {addr.city}, {addr.state} -{' '}
                    <strong className="text-text-primary font-mono">{addr.pincode}</strong>
                  </p>
                  <p className="text-text-muted mt-1">Mobile: <span className="font-medium text-text-primary">{addr.phone}</span></p>

                  {isSelected && (
                    <button
                      type="button"
                      onClick={handleContinueWithSelected}
                      className="mt-3.5 px-6 py-2.5 rounded bg-primary hover:bg-primary-hover text-white font-bold text-xs uppercase tracking-wider shadow-xs cursor-pointer transition-colors"
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

      {/* Add New Address Form matching reference Screenshot */}
      {(showNewForm || savedAddresses.length === 0) && (
        <form
          onSubmit={handleSaveNewAddress}
          className="p-6 sm:p-8 rounded-lg bg-surface border border-border shadow-xs space-y-4"
        >
          <div className="flex justify-between items-center mb-1 pb-2 border-b border-border">
            <h3 className="font-bold text-sm text-text-primary uppercase tracking-wider">
              ADD NEW ADDRESS
            </h3>
            {savedAddresses.length > 0 && (
              <button
                type="button"
                onClick={() => setShowNewForm(false)}
                className="text-xs text-text-muted hover:text-text-primary cursor-pointer"
              >
                Cancel
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Pin Code */}
            <div>
              <label className="text-xs font-semibold text-text-secondary block mb-1">
                Pin Code*
              </label>
              <input
                type="text"
                maxLength={6}
                placeholder="6 digits [0-9]"
                value={pincode}
                onChange={(e) => handlePincodeChange(e.target.value)}
                className="w-full bg-input-background border border-input-border rounded px-3 py-2 text-xs text-text-primary font-mono focus:outline-none focus:border-accent transition-colors"
                required
              />
            </div>

            {/* Locality / Town */}
            <div>
              <label className="text-xs font-semibold text-text-secondary block mb-1">
                Locality / Town*
              </label>
              <input
                type="text"
                placeholder="Locality or Area"
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                className="w-full bg-input-background border border-input-border rounded px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-accent transition-colors"
                required
              />
            </div>

            {/* City / District */}
            <div>
              <label className="text-xs font-semibold text-text-secondary block mb-1">
                City / District*
              </label>
              <input
                type="text"
                placeholder="City or District"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-input-background border border-input-border rounded px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-accent transition-colors"
                required
              />
            </div>

            {/* State */}
            <div>
              <label className="text-xs font-semibold text-text-secondary block mb-1">
                State*
              </label>
              <input
                type="text"
                placeholder="State"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full bg-input-background border border-input-border rounded px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-accent transition-colors"
                required
              />
            </div>

            {/* Name */}
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-text-secondary block mb-1">
                Name*
              </label>
              <input
                type="text"
                placeholder="Contact Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-input-background border border-input-border rounded px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-accent transition-colors"
                required
              />
            </div>

            {/* Address */}
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-text-secondary block mb-1">
                Address*
              </label>
              <textarea
                rows={3}
                placeholder="House No, Flat, Street, Area"
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
                className="w-full bg-input-background border border-input-border rounded px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-accent transition-colors resize-none"
                required
              />
            </div>

            {/* Mobile No */}
            <div>
              <label className="text-xs font-semibold text-text-secondary block mb-1">
                Mobile No*
              </label>
              <input
                type="tel"
                maxLength={10}
                placeholder="10-digit mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-input-background border border-input-border rounded px-3 py-2 text-xs text-text-primary font-mono focus:outline-none focus:border-accent transition-colors"
                required
              />
            </div>

            {/* Address Type */}
            <div>
              <label className="text-xs font-semibold text-text-secondary block mb-1">
                Type of Address
              </label>
              <div className="flex gap-2">
                {(['HOME', 'WORK'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setAddressType(t)}
                    className={`flex-1 py-2 rounded text-xs font-semibold uppercase transition-colors cursor-pointer ${
                      addressType === t
                        ? 'bg-primary text-white'
                        : 'bg-background-secondary border border-border text-text-secondary hover:bg-background'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {errorMsg && <p className="text-xs text-rose-500 font-medium">{errorMsg}</p>}

          <div className="pt-2">
            <button
              type="submit"
              className="px-10 py-3 rounded bg-primary hover:bg-primary-hover text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
            >
              SAVE
            </button>
          </div>
        </form>
      )}

      {/* Trust notice */}
      <div className="flex items-center gap-2 text-xs text-text-muted pt-2">
        <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        <span>Your delivery details are protected and encrypted for genuine handloom dispatch.</span>
      </div>
    </div>
  );
};
