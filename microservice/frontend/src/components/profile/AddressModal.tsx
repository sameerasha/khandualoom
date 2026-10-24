import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MapPin, Home, Building, Compass, X, Check, Loader2, Sparkles, ChevronDown } from 'lucide-react';
import { Address } from '@/types';

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (address: Address) => Promise<void>;
  initialAddress?: Address | null;
  loading?: boolean;
}

export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu and Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
];

export const AddressModal: React.FC<AddressModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialAddress,
  loading = false,
}) => {
  const [addressType, setAddressType] = useState<'HOME' | 'OFFICE' | 'OTHER'>('HOME');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [pincode, setPincode] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Uttar Pradesh');
  const [country, setCountry] = useState('India');
  const [isPrimary, setIsPrimary] = useState(false);

  const [isPincodeLoading, setIsPincodeLoading] = useState(false);
  const [pincodeAutoFilled, setPincodeAutoFilled] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialAddress) {
      setAddressType((initialAddress.addressType as any) || 'HOME');
      setFullName(initialAddress.fullName || '');
      setPhone(initialAddress.phone || '');
      setStreetAddress(initialAddress.streetAddress || '');
      setLandmark(initialAddress.landmark || '');
      setPincode(initialAddress.pincode || '');
      setCity(initialAddress.city || '');
      setState(initialAddress.state || 'Uttar Pradesh');
      setCountry(initialAddress.country || 'India');
      setIsPrimary(Boolean(initialAddress.isPrimary));
      setFormErrors({});
      setPincodeAutoFilled(false);
    } else {
      setAddressType('HOME');
      setFullName('');
      setPhone('');
      setStreetAddress('');
      setLandmark('');
      setPincode('');
      setCity('');
      setState('Uttar Pradesh');
      setCountry('India');
      setIsPrimary(false);
      setFormErrors({});
      setPincodeAutoFilled(false);
    }
  }, [initialAddress, isOpen]);

  // Pincode Auto-detection debounced
  useEffect(() => {
    if (!initialAddress && pincode && pincode.length === 6) {
      const fetchPostalInfo = async () => {
        setIsPincodeLoading(true);
        try {
          const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
          const data = await res.json();
          if (data && data[0] && data[0].Status === 'Success') {
            const office = data[0].PostOffice[0];
            if (office.District) setCity(office.District);
            if (office.State) {
              const matched = INDIAN_STATES.find(
                (s) => s.toLowerCase() === office.State.toLowerCase()
              );
              setState(matched || office.State);
            }
            setPincodeAutoFilled(true);
            setFormErrors((prev) => {
              const next = { ...prev };
              delete next.pincode;
              return next;
            });
          }
        } catch (err) {
          console.warn('Postal API unavailable, fallback to manual selection', err);
        } finally {
          setIsPincodeLoading(false);
        }
      };

      const timer = setTimeout(fetchPostalInfo, 400);
      return () => clearTimeout(timer);
    } else {
      setPincodeAutoFilled(false);
    }
  }, [pincode, initialAddress]);

  if (!isOpen || typeof document === 'undefined') return null;

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!fullName.trim()) errors.fullName = "Recipient's full name is required";
    if (!phone.trim()) errors.phone = 'Delivery contact phone is required';
    else if (!/^(?:\+91|91|0)?[6-9]\d{9}$/.test(phone.replace(/[\s-]/g, ''))) {
      errors.phone = 'Please enter a valid 10-digit mobile number';
    }
    if (!streetAddress.trim()) errors.streetAddress = 'Street address / premises is required';
    if (!pincode.trim() || pincode.length !== 6) errors.pincode = 'Enter a valid 6-digit PIN code';
    if (!city.trim()) errors.city = 'City / District is required';
    if (!state.trim()) errors.state = 'State is required';
    if (!country.trim()) errors.country = 'Country is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    await onSave({
      id: initialAddress?.id,
      addressType,
      fullName: fullName.trim(),
      phone: phone.trim(),
      streetAddress: streetAddress.trim(),
      landmark: landmark.trim(),
      pincode: pincode.trim(),
      city: city.trim(),
      state: state.trim(),
      country: country.trim(),
      isPrimary,
    });
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
      data-lenis-prevent="true"
    >
      <div
        className="relative w-full max-w-2xl bg-gradient-to-b from-[#1C0B2E] via-[#120520] to-[#0A0212] border border-brand-gold/40 rounded-3xl p-6 sm:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.9),0_0_40px_rgba(223,191,122,0.15)] z-10 text-brand-ivory my-auto max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-5 border-b border-brand-gold/20">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-brand-gold/15 border border-brand-gold/30 flex items-center justify-center text-brand-gold shadow-sm">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-brand-gold flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-brand-gold" />
                PATRON VAULT RESIDENCE PROTOCOL
              </span>
              <h3 className="font-serif text-2xl font-bold text-white tracking-tight">
                {initialAddress ? 'Edit Delivery Residence' : 'Add New Delivery Residence'}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-brand-ivory/60 hover:text-white flex items-center justify-center transition-all hover:rotate-90"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-5 pt-5 text-sm" noValidate>
          {/* Address Tag Selector */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-brand-gold/90 mb-2">
              Residence Classification
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { type: 'HOME', label: 'Home Vault', icon: <Home className="w-4 h-4" /> },
                { type: 'OFFICE', label: 'Corporate Suite', icon: <Building className="w-4 h-4" /> },
                { type: 'OTHER', label: 'Other Atelier', icon: <Compass className="w-4 h-4" /> },
              ].map(({ type, label, icon }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setAddressType(type as any)}
                  className={`py-2.5 px-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-medium transition-all ${
                    addressType === type
                      ? 'bg-gradient-to-r from-brand-gold/25 via-brand-gold/15 to-transparent border-brand-gold text-brand-gold shadow-md font-bold'
                      : 'bg-white/[0.02] border-white/10 text-brand-ivory/70 hover:border-brand-gold/30 hover:text-white'
                  }`}
                >
                  {icon}
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Row 1: Name and Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-brand-ivory/75 mb-1.5">
                Recipient Full Name <span className="text-brand-gold">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (formErrors.fullName) setFormErrors({ ...formErrors, fullName: '' });
                }}
                placeholder="e.g. Maharani Gayatri Devi"
                className={`w-full bg-[#0E0518] border rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none transition-all ${
                  formErrors.fullName
                    ? 'border-amber-400 bg-amber-500/5 shadow-[0_0_10px_rgba(245,158,11,0.25)]'
                    : 'border-brand-gold/25 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/30'
                }`}
              />
              {formErrors.fullName && (
                <p className="text-[11px] text-amber-400 mt-1 font-mono">{formErrors.fullName}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-brand-ivory/75 mb-1.5">
                Delivery Contact Phone <span className="text-brand-gold">*</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (formErrors.phone) setFormErrors({ ...formErrors, phone: '' });
                }}
                placeholder="10-digit mobile (e.g. 9876543210)"
                maxLength={14}
                className={`w-full bg-[#0E0518] border rounded-xl px-4 py-2.5 text-sm font-mono text-white placeholder-white/25 focus:outline-none transition-all ${
                  formErrors.phone
                    ? 'border-amber-400 bg-amber-500/5 shadow-[0_0_10px_rgba(245,158,11,0.25)]'
                    : 'border-brand-gold/25 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/30'
                }`}
              />
              {formErrors.phone && (
                <p className="text-[11px] text-amber-400 mt-1 font-mono">{formErrors.phone}</p>
              )}
            </div>
          </div>

          {/* Row 2: Street Address */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-brand-ivory/75 mb-1.5">
              Street Address / Palace / Apartment Suite <span className="text-brand-gold">*</span>
            </label>
            <input
              type="text"
              value={streetAddress}
              onChange={(e) => {
                setStreetAddress(e.target.value);
                if (formErrors.streetAddress) setFormErrors({ ...formErrors, streetAddress: '' });
              }}
              placeholder="e.g. Villa 14, Royal Silk Enclave, Kashi Ghat Road"
              className={`w-full bg-[#0E0518] border rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none transition-all ${
                formErrors.streetAddress
                  ? 'border-amber-400 bg-amber-500/5 shadow-[0_0_10px_rgba(245,158,11,0.25)]'
                  : 'border-brand-gold/25 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/30'
              }`}
            />
            {formErrors.streetAddress && (
              <p className="text-[11px] text-amber-400 mt-1 font-mono">{formErrors.streetAddress}</p>
            )}
          </div>

          {/* Row 3: Landmark */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-brand-ivory/75 mb-1.5">
              Prominent Landmark <span className="text-brand-ivory/40 text-[10px]">(Optional)</span>
            </label>
            <input
              type="text"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              placeholder="e.g. Opposite Ancient Handloom Guild, Gate #2"
              className="w-full bg-[#0E0518] border border-brand-gold/25 focus:border-brand-gold rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none transition-all"
            />
          </div>

          {/* Row 4: Pincode, City, State */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-brand-ivory/75">
                  PIN Code <span className="text-brand-gold">*</span>
                </label>
                {isPincodeLoading && (
                  <span className="text-[10px] font-mono text-brand-gold flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" /> Looking up...
                  </span>
                )}
                {pincodeAutoFilled && (
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Auto-filled
                  </span>
                )}
              </div>
              <input
                type="text"
                value={pincode}
                onChange={(e) => {
                  const cleaned = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setPincode(cleaned);
                  if (formErrors.pincode) setFormErrors({ ...formErrors, pincode: '' });
                }}
                placeholder="6 digits"
                maxLength={6}
                className={`w-full bg-[#0E0518] border rounded-xl px-4 py-2.5 text-sm font-mono text-white placeholder-white/25 focus:outline-none transition-all ${
                  formErrors.pincode
                    ? 'border-amber-400 bg-amber-500/5 shadow-[0_0_10px_rgba(245,158,11,0.25)]'
                    : 'border-brand-gold/25 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/30'
                }`}
              />
              {formErrors.pincode && (
                <p className="text-[11px] text-amber-400 mt-1 font-mono">{formErrors.pincode}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-brand-ivory/75 mb-1.5">
                City / District <span className="text-brand-gold">*</span>
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  if (formErrors.city) setFormErrors({ ...formErrors, city: '' });
                }}
                placeholder="e.g. Varanasi"
                className={`w-full bg-[#0E0518] border rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none transition-all ${
                  formErrors.city
                    ? 'border-amber-400 bg-amber-500/5 shadow-[0_0_10px_rgba(245,158,11,0.25)]'
                    : 'border-brand-gold/25 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/30'
                }`}
              />
              {formErrors.city && (
                <p className="text-[11px] text-amber-400 mt-1 font-mono">{formErrors.city}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-brand-ivory/75 mb-1.5">
                State <span className="text-brand-gold">*</span>
              </label>
              <div className="relative">
                <select
                  value={state}
                  onChange={(e) => {
                    setState(e.target.value);
                    if (formErrors.state) setFormErrors({ ...formErrors, state: '' });
                  }}
                  className="w-full appearance-none bg-[#0E0518] border border-brand-gold/25 hover:border-brand-gold/50 focus:border-brand-gold rounded-xl px-4 py-2.5 pr-10 text-sm text-white focus:outline-none transition-all cursor-pointer shadow-inner"
                >
                  {INDIAN_STATES.map((st) => (
                    <option key={st} value={st} className="bg-[#140726] text-white">
                      {st}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-brand-gold absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-80" />
              </div>
            </div>
          </div>

          {/* Row 5: Country & Primary Checkbox */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="flex-1 sm:max-w-xs">
              <label className="block text-xs font-mono uppercase tracking-wider text-brand-ivory/70 mb-1">
                Country
              </label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-[#0E0518] border border-brand-gold/25 rounded-xl px-4 py-2 text-xs text-brand-ivory/80 focus:outline-none"
              />
            </div>

            <label className="flex items-center gap-3 cursor-pointer select-none self-start sm:self-center pt-2 sm:pt-0">
              <input
                type="checkbox"
                checked={isPrimary}
                onChange={(e) => setIsPrimary(e.target.checked)}
                className="w-4 h-4 rounded border-brand-gold/40 text-brand-gold focus:ring-brand-gold/40 cursor-pointer accent-[#DFBF7A]"
              />
              <span className="text-xs text-brand-ivory font-medium">
                Set as Primary Shipping Destination
              </span>
            </label>
          </div>

          {/* Actions Bar */}
          <div className="pt-4 border-t border-brand-gold/20 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2.5 rounded-xl border border-white/15 text-xs font-mono uppercase tracking-wider text-brand-ivory hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-brand-gold via-brand-gold-light to-brand-gold text-brand-purple-dark font-serif font-bold text-sm shadow-xl shadow-brand-gold/25 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{initialAddress ? 'Update Residence' : 'Save Residence'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};
