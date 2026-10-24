import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Package,
  ShoppingBag,
  Users,
  ArrowLeft,
  Plus,
  Trash2,
  Edit,
  Search,
  Shield,
  Eye,
} from 'lucide-react';
import { useAppSelector } from '@/app/hooks';
import { useGetAllOrdersQuery, useUpdateOrderStatusMutation } from '@/features/orders/ordersApi';
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from '@/features/products/productsApi';
import { Product, Order } from '@/types';
import { fallbackProducts } from '@/data/fallbackProducts';
import { ProductEditorModal } from './ProductEditorModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import axios from 'axios';

interface AdminDashboardProps {
  onBackToStore: () => void;
}

interface UserDirectoryItem {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  createdDate?: string;
}

interface AdminItem {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdDate?: string;
}

interface SocialMediaItem {
  id: number;
  platform: string;
  url: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToStore }) => {
  const { role } = useAppSelector((state) => state.auth);
  const isSuperAdmin = role === 'ROLE_SUPER_ADMIN';

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'users' | 'admins' | 'settings'>('overview');

  // Orders API
  const { data: apiOrders = [], refetch: refetchOrders } = useGetAllOrdersQuery();
  const [updateStatusMutation] = useUpdateOrderStatusMutation();

  // Products API
  const { data: apiProducts, refetch: refetchProducts } = useGetProductsQuery();
  const [createProductMutation] = useCreateProductMutation();
  const [updateProductMutation] = useUpdateProductMutation();
  const [deleteProductMutation] = useDeleteProductMutation();

  const products = apiProducts && apiProducts.length > 0 ? apiProducts : fallbackProducts;

  // Search & Filter States
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('ALL');
  const [userSearch, setUserSearch] = useState('');

  // Modals
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedProductToEdit, setSelectedProductToEdit] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);

  // Users & Admins
  const [usersList, setUsersList] = useState<UserDirectoryItem[]>([]);
  const [adminsList, setAdminsList] = useState<AdminItem[]>([]);
  const [socialsList, setSocialsList] = useState<SocialMediaItem[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('Admin@123456');
  const [newSocial, setNewSocial] = useState({ platform: 'instagram', url: '' });

  // Fetch users & admins
  useEffect(() => {
    if (activeTab === 'users') {
      axios.get('/api/admin/users')
        .then((res) => {
          if (Array.isArray(res.data)) setUsersList(res.data);
        })
        .catch((err) => console.error('Failed to fetch users', err));
    } else if (activeTab === 'admins') {
      axios.get('/api/super-admin/admins')
        .then((res) => {
          if (Array.isArray(res.data)) setAdminsList(res.data);
        })
        .catch((err) => console.error('Failed to fetch admins', err));
    } else if (activeTab === 'settings') {
      axios.get('/api/social-media')
        .then((res) => {
          if (Array.isArray(res.data)) setSocialsList(res.data);
        })
        .catch((err) => console.error('Failed to fetch socials', err));
    }
  }, [activeTab]);

  // Handle Order status
  const handleOrderStatusChange = async (orderId: number, status: string) => {
    try {
      await updateStatusMutation({ id: orderId, status }).unwrap();
      refetchOrders();
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  // Handle Save product
  const handleSaveProduct = async (productData: Partial<Product>) => {
    try {
      if (selectedProductToEdit) {
        await updateProductMutation({ id: selectedProductToEdit.id, data: productData }).unwrap();
      } else {
        await createProductMutation(productData).unwrap();
      }
      setIsEditorOpen(false);
      setSelectedProductToEdit(null);
      refetchProducts();
    } catch (err) {
      console.error('Failed to save product', err);
    }
  };

  // Handle Delete product
  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await deleteProductMutation(productToDelete.id).unwrap();
      setProductToDelete(null);
      refetchProducts();
    } catch (err) {
      console.error('Failed to delete product', err);
    }
  };

  // Role toggle
  const handleRoleToggle = async (userId: number, currentRole: string) => {
    const nextRole = currentRole === 'ROLE_ADMIN' ? 'ROLE_USER' : 'ROLE_ADMIN';
    try {
      await axios.put(`/api/admin/users/${userId}/role?role=${nextRole}`);
      setUsersList((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: nextRole } : u))
      );
    } catch (err) {
      console.error('Failed to update role', err);
    }
  };

  // Create admin
  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail.trim()) return;
    try {
      await axios.post('/api/super-admin/admins', {
        email: newAdminEmail.trim(),
        password: newAdminPassword,
      });
      setNewAdminEmail('');
      const res = await axios.get('/api/super-admin/admins');
      if (Array.isArray(res.data)) setAdminsList(res.data);
    } catch (err) {
      console.error('Failed to create admin', err);
    }
  };

  // Add social link
  const handleAddSocial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSocial.url.trim()) return;
    try {
      await axios.post('/api/admin/social-media', newSocial);
      setNewSocial({ platform: 'instagram', url: '' });
      const res = await axios.get('/api/social-media');
      if (Array.isArray(res.data)) setSocialsList(res.data);
    } catch (err) {
      console.error('Failed to save social link', err);
    }
  };

  // Metrics
  const totalRevenue = apiOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 1428500);
  const totalOrdersCount = apiOrders.length > 0 ? apiOrders.length : 52;

  // Filtered Orders
  const filteredOrders = apiOrders.filter((o) => {
    const matchesSearch =
      o.id.toString().includes(orderSearch) ||
      (o.customerEmail && o.customerEmail.toLowerCase().includes(orderSearch.toLowerCase()));
    const matchesStatus = orderStatusFilter === 'ALL' || o.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.color.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCategory = productCategoryFilter === 'ALL' || p.category === productCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Filtered Users
  const filteredUsers = usersList.filter((u) => {
    const q = userSearch.toLowerCase();
    const fullName = `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase();
    return fullName.includes(q) || u.email.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-[#0E0616] text-brand-ivory py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-brand-gold/20">
          <div>
            <button
              onClick={onBackToStore}
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-brand-gold-light hover:text-white transition-colors mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Storefront Salon
            </button>
            <div className="flex items-center gap-3">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-ivory">
                Vastra Loom Atelier Command
              </h1>
              <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full border border-brand-gold/40 bg-brand-gold/10 text-brand-gold font-bold">
                {isSuperAdmin ? 'SUPER ADMIN' : 'ATELIER ADMIN'}
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all ${
                activeTab === 'overview'
                  ? 'bg-brand-gold text-brand-purple-dark font-bold shadow-lg shadow-brand-gold/20'
                  : 'bg-brand-purple-dark/60 text-brand-ivory/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all ${
                activeTab === 'orders'
                  ? 'bg-brand-gold text-brand-purple-dark font-bold shadow-lg shadow-brand-gold/20'
                  : 'bg-brand-purple-dark/60 text-brand-ivory/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              Orders ({apiOrders.length})
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all ${
                activeTab === 'products'
                  ? 'bg-brand-gold text-brand-purple-dark font-bold shadow-lg shadow-brand-gold/20'
                  : 'bg-brand-purple-dark/60 text-brand-ivory/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              Catalog ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all ${
                activeTab === 'users'
                  ? 'bg-brand-gold text-brand-purple-dark font-bold shadow-lg shadow-brand-gold/20'
                  : 'bg-brand-purple-dark/60 text-brand-ivory/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              Patrons
            </button>
            {isSuperAdmin && (
              <button
                onClick={() => setActiveTab('admins')}
                className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all ${
                  activeTab === 'admins'
                    ? 'bg-brand-gold text-brand-purple-dark font-bold shadow-lg shadow-brand-gold/20'
                    : 'bg-brand-purple-dark/60 text-brand-ivory/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                Admins
              </button>
            )}
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all ${
                activeTab === 'settings'
                  ? 'bg-brand-gold text-brand-purple-dark font-bold shadow-lg shadow-brand-gold/20'
                  : 'bg-brand-purple-dark/60 text-brand-ivory/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              Settings
            </button>
          </div>
        </div>

        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-2xl bg-brand-purple-dark/60 border border-brand-gold/20 backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-brand-ivory/60">Total Gross Merchandise</span>
                  <div className="p-2.5 rounded-xl bg-brand-gold/10 text-brand-gold">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>
                <p className="mt-4 font-serif text-3xl font-bold text-white">
                  ₹{totalRevenue.toLocaleString('en-IN')}
                </p>
                <span className="mt-2 text-xs text-emerald-400 font-mono block">
                  ↑ 18.4% from previous month
                </span>
              </div>

              <div className="p-6 rounded-2xl bg-brand-purple-dark/60 border border-brand-gold/20 backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-brand-ivory/60">Executed Orders</span>
                  <div className="p-2.5 rounded-xl bg-brand-gold/10 text-brand-gold">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                </div>
                <p className="mt-4 font-serif text-3xl font-bold text-white">
                  {totalOrdersCount}
                </p>
                <span className="mt-2 text-xs text-brand-gold font-mono block">
                  Across 14 global corridors
                </span>
              </div>

              <div className="p-6 rounded-2xl bg-brand-purple-dark/60 border border-brand-gold/20 backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-brand-ivory/60">Active Catalog Items</span>
                  <div className="p-2.5 rounded-xl bg-brand-gold/10 text-brand-gold">
                    <Package className="w-5 h-5" />
                  </div>
                </div>
                <p className="mt-4 font-serif text-3xl font-bold text-white">
                  {products.length}
                </p>
                <span className="mt-2 text-xs text-brand-ivory/60 font-mono block">
                  100% Silk Mark Certified
                </span>
              </div>

              <div className="p-6 rounded-2xl bg-brand-purple-dark/60 border border-brand-gold/20 backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-brand-ivory/60">Registered Patrons</span>
                  <div className="p-2.5 rounded-xl bg-brand-gold/10 text-brand-gold">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <p className="mt-4 font-serif text-3xl font-bold text-white">
                  1,280+
                </p>
                <span className="mt-2 text-xs text-emerald-400 font-mono block">
                  Active Connoisseur Guild
                </span>
              </div>
            </div>

            {/* Quick Actions & Recent Orders preview */}
            <div className="p-8 rounded-3xl bg-brand-purple-dark/40 border border-brand-gold/20">
              <h3 className="font-serif text-xl font-bold text-brand-ivory mb-6">
                Recent Bridal & Trousseau Dispatches
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-xs font-mono uppercase tracking-wider text-brand-gold border-b border-brand-gold/20">
                    <tr>
                      <th className="pb-3">Order ID</th>
                      <th className="pb-3">Patron</th>
                      <th className="pb-3">Items</th>
                      <th className="pb-3">Amount</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-gold/10 font-light">
                    {apiOrders.slice(0, 5).map((o) => (
                      <tr key={o.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3.5 font-mono text-brand-gold">#{o.id}</td>
                        <td className="py-3.5">{o.customerEmail || 'Guest Patron'}</td>
                        <td className="py-3.5">{o.items?.length || 1} Silks</td>
                        <td className="py-3.5 font-serif font-bold text-white">
                          ₹{(o.totalAmount || 0).toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5">
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider font-semibold ${
                            o.status === 'DELIVERED'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                              : o.status === 'SHIPPED'
                              ? 'bg-blue-950 text-blue-400 border border-blue-500/30'
                              : o.status === 'CONFIRMED'
                              ? 'bg-amber-950 text-amber-400 border border-amber-500/30'
                              : 'bg-purple-950 text-purple-300 border border-purple-500/30'
                          }`}>
                            {o.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 2. ORDERS MANAGEMENT TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-4 rounded-2xl bg-brand-purple-dark/60 border border-brand-gold/20">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-brand-gold absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by Order # or email..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full bg-[#1A0C28] border border-brand-gold/30 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
                {['ALL', 'PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors ${
                      orderStatusFilter === st
                        ? 'bg-brand-gold text-brand-purple-dark font-bold'
                        : 'bg-white/5 text-brand-ivory/70 hover:bg-white/10'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Table */}
            <div className="rounded-3xl bg-brand-purple-dark/50 border border-brand-gold/20 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#12071E] text-xs font-mono uppercase tracking-wider text-brand-gold border-b border-brand-gold/20">
                    <tr>
                      <th className="py-4 px-6">Order ID</th>
                      <th className="py-4 px-6">Customer</th>
                      <th className="py-4 px-6">Date</th>
                      <th className="py-4 px-6">Total Amount</th>
                      <th className="py-4 px-6">Current Status</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-gold/10 font-light">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-brand-ivory/60 font-mono text-xs">
                          No matching orders found in the atelier register.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((o) => (
                        <tr key={o.id} className="hover:bg-white/5 transition-colors">
                          <td className="py-4 px-6 font-mono text-brand-gold font-bold">#{o.id}</td>
                          <td className="py-4 px-6">
                            <div>
                              <p className="font-medium text-white">{o.customerEmail || 'Private Client'}</p>
                              <p className="text-xs text-brand-ivory/60">{o.customerPhone || 'Direct Loom'}</p>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-xs text-brand-ivory/70">
                            {o.createdDate ? new Date(o.createdDate).toLocaleDateString() : 'Recent'}
                          </td>
                          <td className="py-4 px-6 font-serif font-bold text-white">
                            ₹{(o.totalAmount || 0).toLocaleString('en-IN')}
                          </td>
                          <td className="py-4 px-6">
                            <select
                              value={o.status}
                              onChange={(e) => handleOrderStatusChange(o.id, e.target.value)}
                              className="bg-[#1D0F2E] border border-brand-gold/40 text-brand-gold-light text-xs font-mono rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-brand-gold"
                            >
                              <option value="PENDING">PENDING</option>
                              <option value="CONFIRMED">CONFIRMED</option>
                              <option value="SHIPPED">SHIPPED</option>
                              <option value="DELIVERED">DELIVERED</option>
                              <option value="CANCELLED">CANCELLED</option>
                            </select>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <button
                              onClick={() => setSelectedOrderDetails(o)}
                              className="p-2 rounded-lg bg-brand-gold/15 hover:bg-brand-gold/25 text-brand-gold transition-colors inline-flex items-center gap-1.5 text-xs font-mono"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Inspect</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 3. PRODUCTS MANAGEMENT TAB */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-4 rounded-2xl bg-brand-purple-dark/60 border border-brand-gold/20">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-brand-gold absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search sarees by title or color..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full bg-[#1A0C28] border border-brand-gold/30 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-brand-gold"
                  />
                </div>

                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="bg-[#1A0C28] border border-brand-gold/30 rounded-xl px-3 py-2.5 text-xs text-brand-gold font-mono focus:outline-none"
                >
                  <option value="ALL">All Weaves</option>
                  <option value="Banarasi">Banarasi</option>
                  <option value="Kanjeevaram">Kanjeevaram</option>
                  <option value="Chanderi">Chanderi</option>
                  <option value="Tussar">Tussar</option>
                  <option value="Patola">Patola</option>
                  <option value="Paithani">Paithani</option>
                  <option value="Mysore">Mysore</option>
                </select>
              </div>

              <button
                onClick={() => {
                  setSelectedProductToEdit(null);
                  setIsEditorOpen(true);
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-gold to-brand-gold-dark text-brand-purple-dark font-serif font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:brightness-110 shadow-lg shadow-brand-gold/20"
              >
                <Plus className="w-4 h-4" />
                <span>Add Heirloom Saree</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="rounded-3xl bg-brand-purple-dark/50 border border-brand-gold/20 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#12071E] text-xs font-mono uppercase tracking-wider text-brand-gold border-b border-brand-gold/20">
                    <tr>
                      <th className="py-4 px-6">Saree</th>
                      <th className="py-4 px-6">Category</th>
                      <th className="py-4 px-6">Price</th>
                      <th className="py-4 px-6">Badge</th>
                      <th className="py-4 px-6">Fabric / Weave</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-gold/10 font-light">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3.5">
                            <div className="w-12 h-12 rounded-xl overflow-hidden border border-brand-gold/20 shrink-0 bg-black">
                              <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <p className="font-serif font-bold text-white text-base">{p.name}</p>
                              <p className="text-xs text-brand-ivory/60">{p.color}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 font-mono text-xs text-brand-gold-light">{p.category}</td>
                        <td className="py-4 px-6 font-serif font-bold text-white">
                          ₹{p.price.toLocaleString('en-IN')}
                        </td>
                        <td className="py-4 px-6">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-brand-gold/15 text-brand-gold border border-brand-gold/30">
                            {p.badge || 'Curated'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-xs text-brand-ivory/70">
                          {p.fabric} • {p.weave}
                        </td>
                        <td className="py-4 px-6 text-right space-x-2">
                          <button
                            onClick={() => {
                              setSelectedProductToEdit(p);
                              setIsEditorOpen(true);
                            }}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-brand-gold-light transition-colors inline-flex items-center"
                            title="Edit Saree"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setProductToDelete(p)}
                            className="p-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-500/20 transition-colors inline-flex items-center"
                            title="Retire Saree"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 4. PATRONS DIRECTORY TAB */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-brand-purple-dark/60 border border-brand-gold/20">
              <div className="relative w-80">
                <Search className="w-4 h-4 text-brand-gold absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search patrons by name or email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full bg-[#1A0C28] border border-brand-gold/30 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-brand-gold"
                />
              </div>
              <span className="text-xs font-mono uppercase tracking-wider text-brand-gold">
                Total Registered: {usersList.length}
              </span>
            </div>

            <div className="rounded-3xl bg-brand-purple-dark/50 border border-brand-gold/20 overflow-hidden shadow-2xl">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#12071E] text-xs font-mono uppercase tracking-wider text-brand-gold border-b border-brand-gold/20">
                  <tr>
                    <th className="py-4 px-6">Patron Name</th>
                    <th className="py-4 px-6">Email Address</th>
                    <th className="py-4 px-6">Phone</th>
                    <th className="py-4 px-6">Verification</th>
                    <th className="py-4 px-6">Role</th>
                    <th className="py-4 px-6 text-right">Promote / Demote</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-gold/10 font-light">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-brand-ivory/60 font-mono text-xs">
                        No patrons matching search criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-4 px-6 font-serif font-bold text-white">
                          {u.firstName} {u.lastName}
                        </td>
                        <td className="py-4 px-6 text-brand-ivory/80">{u.email}</td>
                        <td className="py-4 px-6 font-mono text-xs text-brand-ivory/70">{u.phone || '—'}</td>
                        <td className="py-4 px-6">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                            u.emailVerified
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-950 text-amber-400 border border-amber-500/30'
                          }`}>
                            {u.emailVerified ? 'VERIFIED' : 'PENDING'}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`font-mono text-xs font-bold ${
                            u.role === 'ROLE_ADMIN' ? 'text-amber-400' : 'text-brand-ivory/70'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => handleRoleToggle(u.id, u.role)}
                            className="px-3 py-1 rounded-lg border border-brand-gold/30 text-xs font-mono text-brand-gold hover:bg-brand-gold/10 transition-colors"
                          >
                            {u.role === 'ROLE_ADMIN' ? 'Demote to User' : 'Grant Admin'}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 5. SUPER ADMIN DIRECTORY TAB */}
        {activeTab === 'admins' && isSuperAdmin && (
          <div className="space-y-6">
            {/* Create Admin Form */}
            <form onSubmit={handleCreateAdmin} className="p-6 rounded-2xl bg-brand-purple-dark/60 border border-brand-gold/20 flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1">
                <label className="block text-xs font-mono uppercase tracking-wider text-brand-gold mb-2">
                  Admin Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="admin@vastraloom.com"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  className="w-full bg-[#1A0C28] border border-brand-gold/30 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div className="w-full sm:w-64">
                <label className="block text-xs font-mono uppercase tracking-wider text-brand-gold mb-2">
                  Temporary Key
                </label>
                <input
                  type="text"
                  required
                  value={newAdminPassword}
                  onChange={(e) => setNewAdminPassword(e.target.value)}
                  className="w-full bg-[#1A0C28] border border-brand-gold/30 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-gold font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-brand-gold text-brand-purple-dark font-serif font-bold text-xs uppercase tracking-wider hover:brightness-110 flex items-center justify-center gap-2"
              >
                <Shield className="w-4 h-4" />
                <span>Authorize Admin</span>
              </button>
            </form>

            {/* Admins Table */}
            <div className="rounded-3xl bg-brand-purple-dark/50 border border-brand-gold/20 overflow-hidden shadow-2xl">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#12071E] text-xs font-mono uppercase tracking-wider text-brand-gold border-b border-brand-gold/20">
                  <tr>
                    <th className="py-4 px-6">Admin Name</th>
                    <th className="py-4 px-6">Email Address</th>
                    <th className="py-4 px-6">Role Authority</th>
                    <th className="py-4 px-6">Registered</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-gold/10 font-light">
                  {adminsList.map((a) => (
                    <tr key={a.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-6 font-serif font-bold text-white">
                        {a.firstName || 'Authorized'} {a.lastName || 'Staff'}
                      </td>
                      <td className="py-4 px-6 text-brand-ivory/80">{a.email}</td>
                      <td className="py-4 px-6">
                        <span className="font-mono text-xs font-bold text-brand-gold bg-brand-gold/10 border border-brand-gold/30 px-2 py-0.5 rounded-full">
                          {a.role}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-xs text-brand-ivory/60 font-mono">
                        {a.createdDate ? new Date(a.createdDate).toLocaleDateString() : 'Active'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 6. SETTINGS & SOCIAL MEDIA TAB */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            {/* Add Social Platform */}
            <form onSubmit={handleAddSocial} className="p-6 rounded-2xl bg-brand-purple-dark/60 border border-brand-gold/20 flex flex-col sm:flex-row gap-4 items-end">
              <div className="w-full sm:w-48">
                <label className="block text-xs font-mono uppercase tracking-wider text-brand-gold mb-2">
                  Social Platform
                </label>
                <select
                  value={newSocial.platform}
                  onChange={(e) => setNewSocial({ ...newSocial, platform: e.target.value })}
                  className="w-full bg-[#1A0C28] border border-brand-gold/30 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                >
                  <option value="instagram">Instagram</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="facebook">Facebook</option>
                  <option value="youtube">YouTube</option>
                </select>
              </div>

              <div className="flex-1">
                <label className="block text-xs font-mono uppercase tracking-wider text-brand-gold mb-2">
                  Community Link URL
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://instagram.com/vastraloom"
                  value={newSocial.url}
                  onChange={(e) => setNewSocial({ ...newSocial, url: e.target.value })}
                  className="w-full bg-[#1A0C28] border border-brand-gold/30 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-brand-gold text-brand-purple-dark font-serif font-bold text-xs uppercase tracking-wider hover:brightness-110 flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Save Social Channel</span>
              </button>
            </form>

            {/* Social Channels List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {socialsList.map((s) => (
                <div key={s.id} className="p-4 rounded-xl bg-brand-purple-dark/40 border border-brand-gold/20 flex items-center justify-between">
                  <div>
                    <h4 className="font-serif font-bold text-sm text-white capitalize">{s.platform}</h4>
                    <a href={s.url} target="_blank" rel="noreferrer" className="text-xs text-brand-gold hover:underline font-mono">
                      {s.url}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Editor Modal */}
      <ProductEditorModal
        isOpen={isEditorOpen}
        product={selectedProductToEdit}
        onSave={handleSaveProduct}
        onClose={() => {
          setIsEditorOpen(false);
          setSelectedProductToEdit(null);
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(productToDelete)}
        title="Retire Handloom Saree"
        message={`Are you sure you want to permanently retire "${productToDelete?.name}" from the active Vastraloom collection?`}
        confirmLabel="Retire Saree"
        onConfirm={handleConfirmDelete}
        onClose={() => setProductToDelete(null)}
      />

      {/* Order Details Drawer / Modal */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-[#160B24] border border-brand-gold/30 rounded-3xl p-6 sm:p-8 shadow-2xl text-brand-ivory">
            <div className="flex items-center justify-between pb-4 border-b border-brand-gold/20">
              <h3 className="font-serif text-xl font-bold text-brand-gold">
                Order #{selectedOrderDetails.id} Details
              </h3>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="text-brand-ivory/60 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 space-y-4 text-sm font-light">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs font-mono uppercase text-brand-gold block">Customer Email</span>
                  <p className="text-white font-medium">{selectedOrderDetails.customerEmail}</p>
                </div>
                <div>
                  <span className="text-xs font-mono uppercase text-brand-gold block">Order Status</span>
                  <span className="font-mono text-xs font-bold text-amber-400">{selectedOrderDetails.status}</span>
                </div>
              </div>

              {selectedOrderDetails.shippingAddress && (
                <div className="pt-2">
                  <span className="text-xs font-mono uppercase text-brand-gold block">Shipping Destination</span>
                  <p className="text-white">
                    {typeof selectedOrderDetails.shippingAddress === 'string'
                      ? selectedOrderDetails.shippingAddress
                      : JSON.stringify(selectedOrderDetails.shippingAddress)}
                    {selectedOrderDetails.city ? `, ${selectedOrderDetails.city}` : ''}
                    {selectedOrderDetails.state ? `, ${selectedOrderDetails.state}` : ''}
                    {selectedOrderDetails.pincode ? ` - ${selectedOrderDetails.pincode}` : ''}
                  </p>
                </div>
              )}

              <div className="pt-4 border-t border-brand-gold/15">
                <span className="text-xs font-mono uppercase text-brand-gold block mb-2">Purchased Items ({selectedOrderDetails.items?.length || 0})</span>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedOrderDetails.items?.map((it, idx) => (
                    <div key={idx} className="flex justify-between p-2 rounded-lg bg-white/5 text-xs">
                      <span className="text-white">{it.productName || `Product #${it.productId}`} × {it.quantity}</span>
                      <span className="font-mono text-brand-gold">₹{(it.price * it.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-brand-gold/15 flex justify-between items-center">
                <span className="font-serif font-bold text-lg text-white">Total Amount</span>
                <span className="font-serif font-black text-2xl text-brand-gold">
                  ₹{selectedOrderDetails.totalAmount?.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
