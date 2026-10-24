import React, { useState } from 'react';
import {
  User as UserIcon,
  ShoppingBag,
  MapPin,
  ArrowLeft,
  Plus,
} from 'lucide-react';
import { useAppSelector } from '@/app/hooks';
import { useGetMyOrdersQuery } from '@/features/orders/ordersApi';
import { useGetAddressesQuery, useAddAddressMutation } from '@/features/auth/authApi';

interface ProfileDashboardProps {
  onBackToStore: () => void;
}

export const ProfileDashboard: React.FC<ProfileDashboardProps> = ({
  onBackToStore,
}) => {
  const { user } = useAppSelector((state) => state.auth);
  const { data: myOrders = [], isLoading: isOrdersLoading } = useGetMyOrdersQuery();
  const { data: addresses = [] } = useGetAddressesQuery();
  const [addAddress] = useAddAddressMutation();

  const [activeTab, setActiveTab] = useState<'orders' | 'addresses'>('orders');
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: user ? `${user.firstName} ${user.lastName || ''}`.trim() : '',
    streetAddress: '',
    city: 'Varanasi',
    state: 'Uttar Pradesh',
    pincode: '221001',
    country: 'India',
    phone: user?.phone || '9876543210',
    addressType: 'HOME' as const,
    isPrimary: true,
  });

  const handleCreateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addAddress(newAddress).unwrap();
      setShowAddAddressModal(false);
    } catch (err) {
      console.error('Failed to add address', err);
      setShowAddAddressModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-purple-dark text-brand-ivory py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-brand-gold/20">
          <div>
            <button
              onClick={onBackToStore}
              className="inline-flex items-center gap-2 text-xs text-brand-gold hover:text-white mb-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Catalog
            </button>
            <h1 className="font-serif text-3xl font-bold text-brand-ivory flex items-center gap-3">
              <UserIcon className="w-7 h-7 text-brand-gold" />
              My Atelier Profile
            </h1>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'orders'
                  ? 'bg-brand-gold text-brand-purple-dark shadow'
                  : 'bg-brand-purple/60 text-brand-ivory/80 border border-brand-gold/20'
              }`}
            >
              My Orders ({myOrders.length})
            </button>
            <button
              onClick={() => setActiveTab('addresses')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'addresses'
                  ? 'bg-brand-gold text-brand-purple-dark shadow'
                  : 'bg-brand-purple/60 text-brand-ivory/80 border border-brand-gold/20'
              }`}
            >
              Saved Addresses
            </button>
          </div>
        </div>

        {/* User Card */}
        <div className="bg-brand-purple/40 border border-brand-gold/20 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-brand-gold/20 border-2 border-brand-gold flex items-center justify-center text-brand-gold text-2xl font-serif font-bold">
            {user?.firstName ? user.firstName[0].toUpperCase() : 'U'}
          </div>
          <div className="text-center sm:text-left space-y-1">
            <h2 className="font-serif text-xl font-bold text-brand-ivory">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-xs text-brand-ivory/60">{user?.email}</p>
            <div className="pt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
              <span className="px-2.5 py-0.5 rounded-full bg-brand-gold/20 text-brand-gold text-[10px] font-bold border border-brand-gold/30">
                {user?.role || 'CUSTOMER'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                Verified Silk Collector
              </span>
            </div>
          </div>
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-brand-purple/30 border border-brand-gold/20 rounded-3xl p-6">
            <h3 className="font-serif text-lg font-bold text-brand-gold mb-6">
              Purchase History & Real-Time Tracking
            </h3>

            {isOrdersLoading ? (
              <p className="text-xs text-brand-ivory/60 py-8 text-center">Loading your orders...</p>
            ) : myOrders.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <ShoppingBag className="w-10 h-10 text-brand-gold/40 mx-auto" />
                <p className="font-serif text-base text-brand-ivory">No orders placed yet</p>
                <p className="text-xs text-brand-ivory/60">
                  Explore our luxury handloom sarees to make your first heirloom acquisition.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {myOrders.map((o) => (
                  <div
                    key={o.id}
                    className="p-5 rounded-2xl bg-brand-purple-dark/80 border border-brand-gold/20 flex flex-col sm:flex-row justify-between gap-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-brand-gold text-sm">
                          {o.orderTrackingNumber || `VL-00${o.id}`}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            o.status === 'DELIVERED'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-amber-500/20 text-amber-400'
                          }`}
                        >
                          {o.status || 'PENDING'}
                        </span>
                      </div>
                      <p className="text-xs text-brand-ivory/60">
                        {o.orderItems?.length || 1} Item(s) • Total: ₹{(o.totalAmount || 0).toLocaleString('en-IN')}
                      </p>
                    </div>

                    <div className="text-right self-start sm:self-center">
                      <span className="text-[11px] text-brand-gold-light/70 block">
                        Payment: {o.paymentMethod || 'Online'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Addresses Tab */}
        {activeTab === 'addresses' && (
          <div className="bg-brand-purple/30 border border-brand-gold/20 rounded-3xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-serif text-lg font-bold text-brand-gold">
                Saved Delivery Addresses
              </h3>
              <button
                onClick={() => setShowAddAddressModal(true)}
                className="inline-flex items-center gap-2 bg-brand-gold text-brand-purple-dark px-4 py-2 rounded-xl text-xs font-bold"
              >
                <Plus className="w-4 h-4" /> Add Address
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-brand-purple-dark/80 border border-brand-gold/30">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-brand-gold">HOME (PRIMARY)</span>
                  <MapPin className="w-4 h-4 text-brand-gold" />
                </div>
                <p className="font-serif font-bold text-sm">{user?.firstName || 'User'} {user?.lastName || ''}</p>
                <p className="text-xs text-brand-ivory/70 mt-1">123 Heritage Lane, Handloom Enclave</p>
                <p className="text-xs text-brand-ivory/70">Varanasi, Uttar Pradesh - 221001</p>
                <p className="text-xs text-brand-gold-light/60 mt-2">Mobile: {user?.phone || '+91 99999 88888'}</p>
              </div>

              {addresses.map((addr, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-brand-purple-dark/80 border border-brand-gold/20">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-brand-gold">{addr.addressType}</span>
                    <MapPin className="w-4 h-4 text-brand-gold" />
                  </div>
                  <p className="font-serif font-bold text-sm">{addr.fullName}</p>
                  <p className="text-xs text-brand-ivory/70 mt-1">{addr.streetAddress}</p>
                  <p className="text-xs text-brand-ivory/70">{addr.city}, {addr.state} - {addr.pincode}</p>
                  <p className="text-xs text-brand-gold-light/60 mt-2">Mobile: {addr.phone}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Address Modal */}
        {showAddAddressModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <div className="bg-brand-purple-dark border border-brand-gold/30 rounded-3xl p-6 sm:p-8 max-w-md w-full text-brand-ivory shadow-2xl space-y-4">
              <h3 className="font-serif text-xl font-bold text-brand-gold">
                Add New Delivery Address
              </h3>
              <form onSubmit={handleCreateAddress} className="space-y-3 text-xs">
                <div>
                  <label className="block mb-1 text-brand-ivory/70">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newAddress.fullName}
                    onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                    className="w-full bg-brand-purple/60 border border-brand-gold/30 rounded-xl py-2 px-3 text-xs"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-brand-ivory/70">Street Address</label>
                  <input
                    type="text"
                    required
                    value={newAddress.streetAddress}
                    onChange={(e) => setNewAddress({ ...newAddress, streetAddress: e.target.value })}
                    className="w-full bg-brand-purple/60 border border-brand-gold/30 rounded-xl py-2 px-3 text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1 text-brand-ivory/70">City</label>
                    <input
                      type="text"
                      required
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      className="w-full bg-brand-purple/60 border border-brand-gold/30 rounded-xl py-2 px-3 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-brand-ivory/70">Pincode</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={newAddress.pincode}
                      onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                      className="w-full bg-brand-purple/60 border border-brand-gold/30 rounded-xl py-2 px-3 text-xs"
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddAddressModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-brand-gold/30 hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-brand-gold text-brand-purple-dark font-bold shadow"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
