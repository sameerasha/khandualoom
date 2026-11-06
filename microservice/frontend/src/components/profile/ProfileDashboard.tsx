import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  User as UserIcon,
  ShoppingBag,
  MapPin,
  ArrowLeft,
  Plus,
  Home,
  Building,
  Compass,
  Edit3,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  Lock,
  Phone,
  Mail,
  Sparkles,
  AlertCircle,
  X,
  Loader2,
  Check,
  Sun,
  Moon,
} from 'lucide-react';
import { useTheme } from '@/theme/useTheme';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { setUserProfile } from '@/features/auth/authSlice';
import { useGetMyOrdersQuery } from '@/features/orders/ordersApi';
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from '@/features/auth/authApi';
import { Address, User } from '@/types';
import { AddressModal } from './AddressModal';

interface ProfileDashboardProps {
  onBackToStore: () => void;
}

export const ProfileDashboard: React.FC<ProfileDashboardProps> = ({
  onBackToStore,
}) => {
  const dispatch = useAppDispatch();
  const { theme, setTheme } = useTheme();
  const { user: authUser } = useAppSelector((state) => state.auth);

  // RTK Query hooks
  const { data: profileData, isLoading: isProfileLoading, refetch: refetchProfile } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();
  const { data: myOrders = [], isLoading: isOrdersLoading } = useGetMyOrdersQuery();

  // Active user data
  const currentUser: User = profileData || authUser || {
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    role: 'ROLE_USER',
    emailVerified: false,
    phoneVerified: false,
    addresses: [],
  };

  // Keep Redux updated when profile query returns
  useEffect(() => {
    if (profileData) {
      dispatch(setUserProfile(profileData));
    }
  }, [profileData, dispatch]);

  // Tab State
  const [activeTab, setActiveTab] = useState<'addresses' | 'orders' | 'profile' | 'security'>('addresses');

  // Address Modal State
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addressToDelete, setAddressToDelete] = useState<Address | null>(null);
  const [isDeletingAddress, setIsDeletingAddress] = useState(false);

  // Profile Form State
  const [firstName, setFirstName] = useState(currentUser.firstName || '');
  const [lastName, setLastName] = useState(currentUser.lastName || '');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [isSavingPersonalInfo, setIsSavingPersonalInfo] = useState(false);

  // Security Form State
  const [previousPassword, setPreviousPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSavingSecurity, setIsSavingSecurity] = useState(false);
  const [securityError, setSecurityError] = useState('');

  // Toast Notification State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  useEffect(() => {
    if (currentUser) {
      setFirstName(currentUser.firstName || '');
      setLastName(currentUser.lastName || '');
      setPhone(currentUser.phone || '');
    }
  }, [currentUser.firstName, currentUser.lastName, currentUser.phone]);

  // Addresses array from current user
  const addresses: Address[] = currentUser.addresses || [];

  // ==========================================
  // ADDRESS MANAGEMENT HANDLERS
  // ==========================================

  const handleOpenAddModal = () => {
    setEditingAddress(null);
    setIsAddressModalOpen(true);
  };

  const handleOpenEditModal = (addr: Address) => {
    setEditingAddress(addr);
    setIsAddressModalOpen(true);
  };

  const handleSaveAddress = async (savedAddr: Address) => {
    try {
      let updatedAddresses: Address[] = [];

      if (editingAddress) {
        // Edit existing address
        updatedAddresses = addresses.map((addr) => {
          const isMatch = (editingAddress.id && addr.id === editingAddress.id) ||
            (addr.streetAddress === editingAddress.streetAddress && addr.pincode === editingAddress.pincode);

          if (isMatch) {
            return { ...savedAddr, id: addr.id };
          }
          // If the edited address became primary, reset others
          return savedAddr.isPrimary ? { ...addr, isPrimary: false } : addr;
        });
      } else {
        // Add new address
        const newAddressWithId: Address = {
          ...savedAddr,
          id: Date.now(), // Temporary ID until backend assigns DB ID
        };

        if (savedAddr.isPrimary || addresses.length === 0) {
          // If newly marked primary or first address, mark all existing as non-primary
          updatedAddresses = addresses.map((addr) => ({ ...addr, isPrimary: false }));
          updatedAddresses.push({ ...newAddressWithId, isPrimary: true });
        } else {
          updatedAddresses = [...addresses, newAddressWithId];
        }
      }

      // Ensure at least one primary exists
      const hasPrimary = updatedAddresses.some((a) => a.isPrimary);
      if (!hasPrimary && updatedAddresses.length > 0) {
        updatedAddresses[0].isPrimary = true;
      }

      const res = await updateProfile({
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        phone: currentUser.phone,
        addresses: updatedAddresses,
      }).unwrap();

      dispatch(setUserProfile(res));
      setIsAddressModalOpen(false);
      setEditingAddress(null);
      showToast(editingAddress ? 'Residence protocol updated successfully!' : 'New delivery residence added to your vault!');
      refetchProfile();
    } catch (err: any) {
      console.error('Failed to save address', err);
      showToast(err?.data?.message || err?.data?.error || 'Failed to update delivery address.', 'error');
    }
  };

  const handleSetPrimaryAddress = async (targetAddr: Address) => {
    try {
      const updatedAddresses = addresses.map((addr) => {
        const isTarget = (targetAddr.id && addr.id === targetAddr.id) ||
          (addr.streetAddress === targetAddr.streetAddress && addr.pincode === targetAddr.pincode);
        return {
          ...addr,
          isPrimary: Boolean(isTarget),
        };
      });

      const res = await updateProfile({
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        phone: currentUser.phone,
        addresses: updatedAddresses,
      }).unwrap();

      dispatch(setUserProfile(res));
      showToast(`"${targetAddr.fullName}" marked as Primary Shipping Residence.`);
      refetchProfile();
    } catch (err: any) {
      console.error('Failed to set primary address', err);
      showToast('Could not update default residence.', 'error');
    }
  };

  const handleDeleteAddressConfirm = async () => {
    if (!addressToDelete) return;

    setIsDeletingAddress(true);
    try {
      let updatedAddresses = addresses.filter((addr) => {
        if (addressToDelete.id && addr.id) {
          return addr.id !== addressToDelete.id;
        }
        return !(addr.streetAddress === addressToDelete.streetAddress && addr.pincode === addressToDelete.pincode);
      });

      // If deleted was primary, normalize first remaining to primary
      const hasPrimary = updatedAddresses.some((a) => a.isPrimary);
      if (!hasPrimary && updatedAddresses.length > 0) {
        updatedAddresses[0] = { ...updatedAddresses[0], isPrimary: true };
      }

      const res = await updateProfile({
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        phone: currentUser.phone,
        addresses: updatedAddresses,
      }).unwrap();

      dispatch(setUserProfile(res));
      showToast('Residence removed from your address book.');
      setAddressToDelete(null);
      refetchProfile();
    } catch (err: any) {
      console.error('Failed to delete address', err);
      showToast('Failed to remove residence.', 'error');
    } finally {
      setIsDeletingAddress(false);
    }
  };

  // ==========================================
  // PERSONAL INFO HANDLER
  // ==========================================

  const handleSavePersonalInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim()) {
      showToast('First name is required.', 'error');
      return;
    }

    setIsSavingPersonalInfo(true);
    try {
      const res = await updateProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        addresses,
      }).unwrap();

      dispatch(setUserProfile(res));
      showToast('Atelier profile details preserved successfully!');
      refetchProfile();
    } catch (err: any) {
      console.error('Failed to update personal info', err);
      showToast(err?.data?.message || err?.data?.error || 'Failed to update personal details.', 'error');
    } finally {
      setIsSavingPersonalInfo(false);
    }
  };

  // ==========================================
  // SECURITY HANDLER
  // ==========================================

  const handleSaveSecurity = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityError('');

    if (!previousPassword) {
      setSecurityError('Current master password is required.');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setSecurityError('New password must contain at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setSecurityError('New password confirmation does not match.');
      return;
    }

    setIsSavingSecurity(true);
    try {
      await updateProfile({
        previousPassword,
        newPassword,
        addresses,
      }).unwrap();

      setPreviousPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showToast('Security vault credentials updated successfully!');
    } catch (err: any) {
      console.error('Failed to update password', err);
      const errMsg = err?.data?.error || err?.data?.message || 'Authentication verification failed. Check previous password.';
      setSecurityError(errMsg);
      showToast(errMsg, 'error');
    } finally {
      setIsSavingSecurity(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-text-primary py-10 px-4 sm:px-6 lg:px-8 selection:bg-brand-gold/30 selection:text-white transition-colors">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[10000] flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-[#1E0B2B] to-[#12041D] border border-brand-gold/50 shadow-[0_10px_35px_rgba(0,0,0,0.8),0_0_20px_rgba(223,191,122,0.2)] text-sm animate-in slide-in-from-bottom duration-300">
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <span className="font-medium text-brand-ivory">{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="ml-2 text-brand-ivory/50 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top Header Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-brand-gold/20">
          <div>
            <button
              onClick={onBackToStore}
              className="group inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-brand-gold hover:text-white mb-2.5 transition-all"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Return to Masterpiece Gallery
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-brand-gold/15 border border-brand-gold/30 flex items-center justify-center text-brand-gold shadow-sm">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-serif text-3xl font-bold text-white tracking-tight">
                  Patron Atelier & Vault
                </h1>
                <p className="text-xs text-brand-ivory/60 mt-0.5">
                  Manage personal authentication, shipping residences, and bespoke acquisitions
                </p>
              </div>
            </div>
          </div>

          {/* Luxury Tab Navigation */}
          <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-white/[0.03] border border-brand-gold/20 backdrop-blur-sm self-start sm:self-center">
            <button
              onClick={() => setActiveTab('addresses')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'addresses'
                  ? 'bg-gradient-to-r from-brand-gold via-amber-400 to-brand-gold text-brand-purple-dark shadow-[0_2px_12px_rgba(223,191,122,0.35)] font-bold'
                  : 'text-brand-ivory/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Address Book ({addresses.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'orders'
                  ? 'bg-gradient-to-r from-brand-gold via-amber-400 to-brand-gold text-brand-purple-dark shadow-[0_2px_12px_rgba(223,191,122,0.35)] font-bold'
                  : 'text-brand-ivory/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Orders ({myOrders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'profile'
                  ? 'bg-gradient-to-r from-brand-gold via-amber-400 to-brand-gold text-brand-purple-dark shadow-[0_2px_12px_rgba(223,191,122,0.35)] font-bold'
                  : 'text-brand-ivory/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Personal Info</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'security'
                  ? 'bg-gradient-to-r from-brand-gold via-amber-400 to-brand-gold text-brand-purple-dark shadow-[0_2px_12px_rgba(223,191,122,0.35)] font-bold'
                  : 'text-brand-ivory/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Security Vault</span>
            </button>
          </div>
        </div>

        {/* Patron VIP Header Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1C0A2E]/90 via-[#130420]/80 to-[#0A0214]/90 border border-brand-gold/30 p-6 sm:p-7 shadow-[0_15px_45px_rgba(0,0,0,0.6)] backdrop-blur-md">
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-gold/30 via-brand-gold/15 to-transparent border-2 border-brand-gold/50 flex items-center justify-center text-brand-gold text-2xl font-serif font-bold shadow-inner">
              {currentUser?.firstName ? currentUser.firstName[0].toUpperCase() : 'V'}
            </div>
            <div className="text-center sm:text-left space-y-1.5 flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <h2 className="font-serif text-2xl font-bold text-white tracking-tight">
                  {currentUser?.firstName} {currentUser?.lastName}
                </h2>
                <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                  <span className="px-3 py-0.5 rounded-full bg-brand-gold/15 text-brand-gold text-[10px] font-mono uppercase tracking-wider font-bold border border-brand-gold/30">
                    {currentUser?.role || 'ROLE_USER'}
                  </span>
                  <span className="px-3 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-mono uppercase tracking-wider font-bold border border-emerald-500/30 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Verified Silk Collector
                  </span>
                </div>
              </div>
              <p className="text-xs font-mono text-brand-ivory/60 flex items-center justify-center sm:justify-start gap-2">
                <Mail className="w-3.5 h-3.5 text-brand-gold/70" />
                {currentUser?.email}
              </p>
              {currentUser?.phone && (
                <p className="text-xs font-mono text-brand-ivory/60 flex items-center justify-center sm:justify-start gap-2">
                  <Phone className="w-3.5 h-3.5 text-brand-gold/70" />
                  {currentUser?.phone}
                </p>
              )}
            </div>

            <div className="flex sm:flex-col gap-3 shrink-0">
              <div className="px-4 py-2.5 rounded-2xl bg-white/[0.03] border border-brand-gold/20 text-center">
                <div className="text-xs font-mono uppercase text-brand-gold/70">Vault Addresses</div>
                <div className="font-serif text-xl font-bold text-white">{addresses.length}</div>
              </div>
              <div className="px-4 py-2.5 rounded-2xl bg-white/[0.03] border border-brand-gold/20 text-center">
                <div className="text-xs font-mono uppercase text-brand-gold/70">Orders Acquired</div>
                <div className="font-serif text-xl font-bold text-white">{myOrders.length}</div>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* TAB 1: SHIPPING ADDRESS BOOK (PRIMARY FOCUS OF USER)     */}
        {/* ======================================================== */}
        {activeTab === 'addresses' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#170624] to-[#10031B] border border-brand-gold/25 rounded-2xl p-5 shadow-lg">
              <div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-brand-gold" />
                  <h3 className="font-serif text-xl font-bold text-white tracking-wide">
                    Shipping Residences & Vault Locations
                  </h3>
                </div>
                <p className="text-xs text-brand-ivory/60 mt-1">
                  Deliveries are executed via insured white-glove logistics. Exactly one residence operates as your default primary destination.
                </p>
              </div>

              <button
                onClick={handleOpenAddModal}
                className="group inline-flex items-center justify-center gap-2.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-gold via-amber-400 to-brand-gold text-brand-purple-dark text-xs font-bold uppercase tracking-wider shadow-[0_4px_16px_rgba(223,191,122,0.35)] hover:shadow-[0_6px_24px_rgba(223,191,122,0.5)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 shrink-0"
              >
                <Plus className="w-4 h-4 transition-transform group-hover:rotate-90 duration-300" />
                <span>Add Delivery Address</span>
              </button>
            </div>

            {/* Address Cards Grid */}
            {isProfileLoading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white/[0.02] border border-brand-gold/15 rounded-3xl space-y-3">
                <Loader2 className="w-8 h-8 text-brand-gold animate-spin" />
                <p className="text-xs font-mono text-brand-gold/80 tracking-wider">Loading vault residences...</p>
              </div>
            ) : addresses.length === 0 ? (
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#170624]/60 to-[#0A0212]/80 border border-brand-gold/20 p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center text-brand-gold mx-auto shadow-inner">
                  <MapPin className="w-8 h-8" />
                </div>
                <div className="max-w-md mx-auto space-y-1.5">
                  <h4 className="font-serif text-lg font-bold text-white">No Shipping Residences Saved</h4>
                  <p className="text-xs text-brand-ivory/60 leading-relaxed">
                    You haven't designated a delivery residence in your vault yet. Register your address now to guarantee seamless, temperature-regulated heirloom dispatch.
                  </p>
                </div>
                <button
                  onClick={handleOpenAddModal}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-gold text-brand-purple-dark text-xs font-bold uppercase tracking-wider shadow-md hover:brightness-110 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Add First Residence
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[...addresses]
                  .sort((a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 0 : 1))
                  .map((addr, idx) => {
                    const isPrim = Boolean(addr.isPrimary);
                    const tag = (addr.addressType || 'HOME').toUpperCase();

                    return (
                      <div
                        key={addr.id || idx}
                        className={`group relative rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between ${
                          isPrim
                            ? 'bg-gradient-to-b from-[#1F0B30] via-[#150422] to-[#0D0216] border-2 border-brand-gold shadow-[0_12px_36px_rgba(223,191,122,0.18)]'
                            : 'bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-brand-gold/20 hover:border-brand-gold/50 shadow-md hover:shadow-xl'
                        }`}
                      >
                        {/* Top Badges */}
                        <div className="flex items-center justify-between gap-2 pb-4 mb-4 border-b border-white/10">
                          <div className="flex items-center gap-2">
                            {tag === 'HOME' && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono uppercase tracking-wider font-bold">
                                <Home className="w-3 h-3" />
                                Home Vault
                              </span>
                            )}
                            {tag === 'OFFICE' && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-400 text-[10px] font-mono uppercase tracking-wider font-bold">
                                <Building className="w-3 h-3" />
                                Corporate Suite
                              </span>
                            )}
                            {tag !== 'HOME' && tag !== 'OFFICE' && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-[10px] font-mono uppercase tracking-wider font-bold">
                                <Compass className="w-3 h-3" />
                                {tag}
                              </span>
                            )}
                          </div>

                          {isPrim ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand-gold text-brand-purple-dark text-[10px] font-mono uppercase tracking-wider font-black shadow-sm">
                              <CheckCircle2 className="w-3 h-3" />
                              Primary
                            </span>
                          ) : (
                            <button
                              onClick={() => handleSetPrimaryAddress(addr)}
                              disabled={isUpdatingProfile}
                              className="text-[10px] font-mono uppercase tracking-wider text-brand-gold/70 hover:text-brand-gold hover:underline transition-colors disabled:opacity-50"
                            >
                              Set as Default
                            </button>
                          )}
                        </div>

                        {/* Card Content */}
                        <div className="space-y-2.5 flex-1">
                          <h4 className="font-serif text-lg font-bold text-white tracking-wide flex items-center gap-2">
                            {addr.fullName}
                          </h4>

                          <p className="text-xs text-brand-ivory/80 leading-relaxed font-sans">
                            {addr.streetAddress}
                          </p>

                          {addr.landmark && (
                            <p className="text-[11px] text-brand-gold-light/75 flex items-center gap-1.5 italic">
                              <span className="not-italic font-mono text-[9px] uppercase tracking-wider text-brand-gold/90 font-bold bg-brand-gold/10 px-1.5 py-0.5 rounded border border-brand-gold/20">
                                Landmark
                              </span>
                              {addr.landmark}
                            </p>
                          )}

                          <div className="pt-1 text-xs text-brand-ivory/70 font-mono">
                            {addr.city}, {addr.state} — <span className="font-bold text-brand-gold">{addr.pincode}</span>
                          </div>

                          <div className="text-[11px] text-brand-ivory/50 font-mono">
                            {addr.country || 'India'}
                          </div>

                          <div className="pt-2 flex items-center gap-2 text-xs font-mono text-brand-gold/90">
                            <Phone className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                            <span>{addr.phone}</span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between gap-2 pt-5 mt-5 border-t border-white/10">
                          <button
                            onClick={() => handleOpenEditModal(addr)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-brand-gold/15 border border-white/10 hover:border-brand-gold/40 text-brand-ivory/80 hover:text-brand-gold text-xs font-medium transition-all"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>

                          <button
                            onClick={() => setAddressToDelete(addr)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 hover:border-rose-500/40 text-rose-300 text-xs font-medium transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: ORDER HISTORY & REAL-TIME TRACKING                */}
        {/* ======================================================== */}
        {activeTab === 'orders' && (
          <div className="bg-gradient-to-b from-[#170624]/70 to-[#0A0212]/80 border border-brand-gold/25 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-brand-gold/20">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-6 h-6 text-brand-gold" />
                <div>
                  <h3 className="font-serif text-xl font-bold text-white">
                    Acquisition & Dispatch Archives
                  </h3>
                  <p className="text-xs text-brand-ivory/60">
                    Real-time verification of certified handloom shipments
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono text-brand-gold">
                {myOrders.length} Recorded Orders
              </span>
            </div>

            {isOrdersLoading ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-3">
                <Loader2 className="w-7 h-7 text-brand-gold animate-spin" />
                <p className="text-xs font-mono text-brand-gold/70">Retrieving master ledger...</p>
              </div>
            ) : myOrders.length === 0 ? (
              <div className="text-center py-14 space-y-3">
                <ShoppingBag className="w-12 h-12 text-brand-gold/40 mx-auto" />
                <h4 className="font-serif text-lg text-white">No Acquisitions On Record</h4>
                <p className="text-xs text-brand-ivory/60 max-w-sm mx-auto">
                  Explore our certified pure Banarasi silk, Kanjivaram, and Chanderi sarees to commission your initial heirloom piece.
                </p>
                <button
                  onClick={onBackToStore}
                  className="mt-4 px-6 py-2.5 rounded-xl bg-brand-gold text-brand-purple-dark text-xs font-bold uppercase tracking-wider shadow-md hover:brightness-110 transition-all"
                >
                  Explore Storefront Catalog
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {myOrders.map((o) => (
                  <div
                    key={o.id}
                    className="p-5 rounded-2xl bg-white/[0.02] border border-brand-gold/20 hover:border-brand-gold/40 transition-all flex flex-col sm:flex-row justify-between gap-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-brand-gold text-sm tracking-wider">
                          {o.orderTrackingNumber || `VL-00${o.id}`}
                        </span>
                        <span
                          className={`px-3 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold ${
                            o.status === 'DELIVERED'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {o.status || 'PENDING'}
                        </span>
                      </div>
                      <p className="text-xs text-brand-ivory/70">
                        {o.orderItems?.length || 1} Item(s) • Total Valuation: ₹{(o.totalAmount || 0).toLocaleString('en-IN')}
                      </p>
                      {o.shippingAddress && (
                        <p className="text-[11px] text-brand-ivory/50 font-mono">
                          Destination: {o.city ? `${o.city}, ${o.state || ''}` : o.shippingAddress}
                        </p>
                      )}
                    </div>

                    <div className="text-left sm:text-right self-start sm:self-center space-y-1">
                      <span className="text-[11px] text-brand-gold-light/80 block font-mono">
                        Payment Mode: {o.paymentMethod || 'Online Gateway'}
                      </span>
                      <span className="text-[10px] text-brand-ivory/40 block font-mono">
                        Vault Recorded: #{o.id}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: PERSONAL PROFILE DETAILS                          */}
        {/* ======================================================== */}
        {activeTab === 'profile' && (
          <div className="bg-gradient-to-b from-[#170624]/70 to-[#0A0212]/80 border border-brand-gold/25 rounded-3xl p-6 sm:p-8 space-y-6 max-w-2xl">
            <div className="pb-4 border-b border-brand-gold/20 flex items-center gap-3">
              <UserIcon className="w-6 h-6 text-brand-gold" />
              <div>
                <h3 className="font-serif text-xl font-bold text-white">Personal Identity & Credentials</h3>
                <p className="text-xs text-brand-ivory/60">Authenticated patron profile records</p>
              </div>
            </div>

            <form onSubmit={handleSavePersonalInfo} className="space-y-5 text-xs">
              {/* Email Address (Immutable) */}
              <div>
                <label className="block text-brand-ivory/70 font-mono uppercase tracking-wider text-[11px] mb-1.5 flex items-center justify-between">
                  <span>Registered Patron Email</span>
                  {currentUser.emailVerified ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1 lowercase">
                      <Check className="w-3 h-3" /> verified
                    </span>
                  ) : (
                    <span className="text-amber-400 font-bold lowercase">unverified</span>
                  )}
                </label>
                <input
                  type="email"
                  value={currentUser.email || ''}
                  disabled
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 px-4 text-xs font-mono text-brand-ivory/50 cursor-not-allowed"
                />
              </div>

              {/* Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-brand-ivory/80 font-mono uppercase tracking-wider text-[11px] mb-1.5">
                    First Name <span className="text-brand-gold">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter first name"
                    className="w-full bg-white/[0.04] border border-white/15 focus:border-brand-gold rounded-xl py-3 px-4 text-xs text-brand-ivory placeholder-white/20 transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-brand-ivory/80 font-mono uppercase tracking-wider text-[11px] mb-1.5">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter family name"
                    className="w-full bg-white/[0.04] border border-white/15 focus:border-brand-gold rounded-xl py-3 px-4 text-xs text-brand-ivory placeholder-white/20 transition-all outline-none"
                  />
                </div>
              </div>

              {/* Mobile Phone */}
              <div>
                <label className="block text-brand-ivory/80 font-mono uppercase tracking-wider text-[11px] mb-1.5 flex items-center justify-between">
                  <span>Primary Contact Phone</span>
                  {currentUser.phoneVerified && (
                    <span className="text-emerald-400 font-bold flex items-center gap-1 lowercase">
                      <Check className="w-3 h-3" /> verified
                    </span>
                  )}
                </label>
                <input
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="10-digit mobile number"
                  className="w-full bg-white/[0.04] border border-white/15 focus:border-brand-gold rounded-xl py-3 px-4 text-xs font-mono text-brand-ivory placeholder-white/20 transition-all outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSavingPersonalInfo}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-gold via-amber-400 to-brand-gold text-brand-purple-dark text-xs font-bold uppercase tracking-wider shadow-md hover:brightness-110 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isSavingPersonalInfo ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Preserving Identity...</span>
                    </>
                  ) : (
                    <span>Save Profile Details</span>
                  )}
                </button>
              </div>
            </form>

            {/* Website Appearance / Theme Preference Selector */}
            <div className="pt-6 border-t border-brand-gold/20">
              <div className="flex items-center gap-2 mb-1">
                <Sun className="w-4 h-4 text-amber-500" />
                <h4 className="font-serif text-sm font-bold text-white">Website Appearance & Theme</h4>
              </div>
              <p className="text-xs text-brand-ivory/60 mb-4">
                Choose between clean modern light theme and luxury handloom dark theme
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                    theme === 'light'
                      ? 'border-amber-400 bg-amber-500/15 shadow-md'
                      : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.06]'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                    <Sun className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-xs text-white">Light Theme (Default)</p>
                    <p className="text-[11px] text-brand-ivory/60 mt-0.5">Crisp, bright white fashion catalog</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                    theme === 'dark'
                      ? 'border-brand-gold bg-brand-gold/15 shadow-md'
                      : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.06]'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-brand-gold/20 flex items-center justify-center text-brand-gold shrink-0">
                    <Moon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-xs text-white">Dark Theme</p>
                    <p className="text-[11px] text-brand-ivory/60 mt-0.5">Luxury charcoal & gold handloom palette</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: SECURITY & CREDENTIALS VAULT                      */}
        {/* ======================================================== */}
        {activeTab === 'security' && (
          <div className="bg-gradient-to-b from-[#170624]/70 to-[#0A0212]/80 border border-brand-gold/25 rounded-3xl p-6 sm:p-8 space-y-6 max-w-2xl">
            <div className="pb-4 border-b border-brand-gold/20 flex items-center gap-3">
              <Lock className="w-6 h-6 text-brand-gold" />
              <div>
                <h3 className="font-serif text-xl font-bold text-white">Security Vault & Access Keys</h3>
                <p className="text-xs text-brand-ivory/60">Update master authentication credentials</p>
              </div>
            </div>

            {securityError && (
              <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{securityError}</span>
              </div>
            )}

            <form onSubmit={handleSaveSecurity} className="space-y-5 text-xs">
              <div>
                <label className="block text-brand-ivory/80 font-mono uppercase tracking-wider text-[11px] mb-1.5">
                  Current Master Password <span className="text-brand-gold">*</span>
                </label>
                <input
                  type="password"
                  required
                  value={previousPassword}
                  onChange={(e) => setPreviousPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-white/[0.04] border border-white/15 focus:border-brand-gold rounded-xl py-3 px-4 text-xs font-mono text-brand-ivory placeholder-white/20 transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-brand-ivory/80 font-mono uppercase tracking-wider text-[11px] mb-1.5">
                  New Vault Password (Min 6 Characters) <span className="text-brand-gold">*</span>
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-white/[0.04] border border-white/15 focus:border-brand-gold rounded-xl py-3 px-4 text-xs font-mono text-brand-ivory placeholder-white/20 transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-brand-ivory/80 font-mono uppercase tracking-wider text-[11px] mb-1.5">
                  Confirm New Password <span className="text-brand-gold">*</span>
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-white/[0.04] border border-white/15 focus:border-brand-gold rounded-xl py-3 px-4 text-xs font-mono text-brand-ivory placeholder-white/20 transition-all outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSavingSecurity}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-gold via-amber-400 to-brand-gold text-brand-purple-dark text-xs font-bold uppercase tracking-wider shadow-md hover:brightness-110 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isSavingSecurity ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Updating Vault Keys...</span>
                    </>
                  ) : (
                    <span>Rotate Master Password</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* ADDRESS MODAL (PORTALED)                                 */}
      {/* ======================================================== */}
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => {
          setIsAddressModalOpen(false);
          setEditingAddress(null);
        }}
        onSave={handleSaveAddress}
        initialAddress={editingAddress}
        loading={isUpdatingProfile}
      />

      {/* ======================================================== */}
      {/* DELETE CONFIRMATION MODAL (PORTALED)                     */}
      {/* ======================================================== */}
      {addressToDelete && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          onClick={() => setAddressToDelete(null)}
          data-lenis-prevent="true"
        >
          <div
            className="w-full max-w-md bg-gradient-to-b from-[#1C0B2B] via-[#12041D] to-[#0A0210] border border-brand-gold/40 rounded-3xl p-6 sm:p-7 shadow-2xl text-brand-ivory space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-rose-400">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-bold text-white">
                Remove Residence?
              </h3>
            </div>

            <p className="text-xs text-brand-ivory/70 leading-relaxed">
              Are you certain you wish to revoke delivery protocols for{' '}
              <strong className="text-brand-gold font-serif">{addressToDelete.fullName}</strong> at{' '}
              <span className="text-white font-mono">{addressToDelete.streetAddress}, {addressToDelete.city}</span>?
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setAddressToDelete(null)}
                className="px-4 py-2 rounded-xl border border-white/10 text-xs font-mono uppercase tracking-wider text-brand-ivory/70 hover:text-white hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAddressConfirm}
                disabled={isDeletingAddress}
                className="px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-mono uppercase tracking-wider font-bold shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isDeletingAddress ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Revoking...</span>
                  </>
                ) : (
                  <span>Confirm Revocation</span>
                )}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
