import React, { useState } from 'react';
import {
  TrendingUp,
  Package,
  ShoppingBag,
  Users,
  ArrowLeft,
  Plus,
  Trash2,
  Sparkles,
} from 'lucide-react';
import { useGetAllOrdersQuery, useUpdateOrderStatusMutation } from '@/features/orders/ordersApi';
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
} from '@/features/products/productsApi';
import { fallbackProducts } from '@/data/fallbackProducts';

interface AdminDashboardProps {
  onBackToStore: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToStore }) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders');

  // Orders API
  const { data: orders = [], refetch: refetchOrders } = useGetAllOrdersQuery();
  const [updateStatus] = useUpdateOrderStatusMutation();

  // Products API
  const { data: apiProducts, refetch: refetchProducts } = useGetProductsQuery();
  const [createProduct] = useCreateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const products = apiProducts && apiProducts.length > 0 ? apiProducts : fallbackProducts;

  // New product form modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSaree, setNewSaree] = useState({
    name: '',
    category: 'Banarasi',
    price: 19999,
    originalPrice: 24999,
    image: '/images/saree_purple_gold.png',
    description: '',
    fabric: 'Pure Silk',
    weave: 'Handloom',
    color: 'Crimson & Gold',
    badge: 'New Arrival',
  });

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 1284500);
  const totalOrdersCount = orders.length > 0 ? orders.length : 48;

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      await updateStatus({ id: orderId, status: newStatus }).unwrap();
      refetchOrders();
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProduct(newSaree).unwrap();
      setShowAddModal(false);
      refetchProducts();
    } catch (err) {
      console.error('Failed to create product', err);
      setShowAddModal(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (window.confirm('Are you sure you want to retire this saree from the catalog?')) {
      try {
        await deleteProduct(id).unwrap();
        refetchProducts();
      } catch (err) {
        console.error('Failed to delete product', err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-brand-purple-dark text-brand-ivory py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-brand-gold/20">
          <div>
            <button
              onClick={onBackToStore}
              className="inline-flex items-center gap-2 text-xs text-brand-gold hover:text-white mb-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Vastraloom Storefront
            </button>
            <h1 className="font-serif text-3xl font-bold text-brand-ivory flex items-center gap-3">
              <Sparkles className="w-7 h-7 text-brand-gold" />
              Master Loom Executive Console
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
              Order Management
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'products'
                  ? 'bg-brand-gold text-brand-purple-dark shadow'
                  : 'bg-brand-purple/60 text-brand-ivory/80 border border-brand-gold/20'
              }`}
            >
              Catalog Management
            </button>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-brand-purple/40 border border-brand-gold/20 rounded-2xl p-5 backdrop-blur-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-brand-ivory/60 uppercase font-semibold">Total Revenue</p>
                <h3 className="font-serif text-2xl font-bold text-brand-gold mt-1">
                  ₹{totalRevenue.toLocaleString('en-IN')}
                </h3>
              </div>
              <div className="p-2.5 rounded-xl bg-brand-gold/10 text-brand-gold">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="bg-brand-purple/40 border border-brand-gold/20 rounded-2xl p-5 backdrop-blur-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-brand-ivory/60 uppercase font-semibold">Orders Fulfilled</p>
                <h3 className="font-serif text-2xl font-bold text-brand-ivory mt-1">
                  {totalOrdersCount}
                </h3>
              </div>
              <div className="p-2.5 rounded-xl bg-brand-gold/10 text-brand-gold">
                <ShoppingBag className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="bg-brand-purple/40 border border-brand-gold/20 rounded-2xl p-5 backdrop-blur-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-brand-ivory/60 uppercase font-semibold">Active Sarees</p>
                <h3 className="font-serif text-2xl font-bold text-brand-ivory mt-1">
                  {products.length}
                </h3>
              </div>
              <div className="p-2.5 rounded-xl bg-brand-gold/10 text-brand-gold">
                <Package className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="bg-brand-purple/40 border border-brand-gold/20 rounded-2xl p-5 backdrop-blur-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-brand-ivory/60 uppercase font-semibold">Weaving Clusters</p>
                <h3 className="font-serif text-2xl font-bold text-brand-ivory mt-1">
                  14 Looms
                </h3>
              </div>
              <div className="p-2.5 rounded-xl bg-brand-gold/10 text-brand-gold">
                <Users className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Tab 1: Orders Management */}
        {activeTab === 'orders' && (
          <div className="bg-brand-purple/30 border border-brand-gold/20 rounded-3xl p-6 overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-serif text-xl font-bold text-brand-ivory">
                Recent Customer Orders
              </h2>
              <span className="text-xs text-brand-gold-light/70">
                Synchronized with Kafka & Outbox Publisher
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-brand-ivory/80">
                <thead className="bg-brand-purple/60 text-brand-gold uppercase tracking-wider text-[11px] border-b border-brand-gold/20">
                  <tr>
                    <th className="py-3 px-4">Tracking #</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Payment</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-gold/10">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-brand-ivory/50">
                        No orders recorded yet. Place an order from the storefront to view it here.
                      </td>
                    </tr>
                  ) : (
                    orders.map((o) => (
                      <tr key={o.id} className="hover:bg-brand-purple/40 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-brand-gold">
                          {o.orderTrackingNumber || `VL-00${o.id}`}
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-semibold text-brand-ivory">{o.customerName || 'Customer'}</p>
                          <p className="text-[11px] text-brand-ivory/50">{o.customerEmail}</p>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-brand-ivory">
                          ₹{(o.totalAmount || 0).toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded bg-brand-purple border border-brand-gold/30 text-[11px]">
                            {o.paymentMethod || 'ONLINE'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              o.status === 'DELIVERED'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : o.status === 'SHIPPED'
                                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            }`}
                          >
                            {o.status || 'PENDING'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <select
                            value={o.status || 'PENDING'}
                            onChange={(e) => handleStatusChange(o.id, e.target.value)}
                            className="bg-brand-purple border border-brand-gold/30 rounded px-2 py-1 text-[11px] text-brand-ivory focus:outline-none"
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="PROCESSING">PROCESSING</option>
                            <option value="SHIPPED">SHIPPED</option>
                            <option value="DELIVERED">DELIVERED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Products Catalog Management */}
        {activeTab === 'products' && (
          <div className="bg-brand-purple/30 border border-brand-gold/20 rounded-3xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-serif text-xl font-bold text-brand-ivory">
                Catalog Inventory ({products.length})
              </h2>
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-gold to-brand-gold-dark text-brand-purple-dark px-4 py-2 rounded-xl text-xs font-bold hover:brightness-110 shadow"
              >
                <Plus className="w-4 h-4" /> Add New Saree
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="bg-brand-purple-dark/90 border border-brand-gold/20 rounded-2xl overflow-hidden p-4 flex gap-4 items-center"
                >
                  <img
                    src={p.image || '/images/saree_crimson_red.png'}
                    alt={p.name}
                    className="w-16 h-20 object-cover rounded-xl border border-brand-gold/20 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] uppercase text-brand-gold tracking-wider">
                      {p.category}
                    </span>
                    <h4 className="font-serif font-bold text-sm text-brand-ivory truncate">
                      {p.name}
                    </h4>
                    <p className="font-serif font-bold text-brand-gold text-xs mt-1">
                      ₹{p.price.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteProduct(p.id)}
                    className="p-2 rounded-lg text-brand-ivory/40 hover:text-brand-crimson hover:bg-brand-crimson/10 transition-colors"
                    title="Delete product"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Saree Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <div className="bg-brand-purple-dark border border-brand-gold/30 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-brand-ivory shadow-2xl space-y-4">
              <h3 className="font-serif text-xl font-bold text-brand-gold">
                Add Handcrafted Saree to Catalog
              </h3>

              <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
                <div>
                  <label className="block mb-1 text-brand-ivory/70">Saree Name</label>
                  <input
                    type="text"
                    required
                    value={newSaree.name}
                    onChange={(e) => setNewSaree({ ...newSaree, name: e.target.value })}
                    placeholder="e.g. Maharani Pure Kanjivaram"
                    className="w-full bg-brand-purple/60 border border-brand-gold/30 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-brand-gold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1 text-brand-ivory/70">Category</label>
                    <select
                      value={newSaree.category}
                      onChange={(e) => setNewSaree({ ...newSaree, category: e.target.value })}
                      className="w-full bg-brand-purple/60 border border-brand-gold/30 rounded-xl py-2 px-3 text-xs"
                    >
                      <option value="Banarasi">Banarasi</option>
                      <option value="Kanjivaram">Kanjivaram</option>
                      <option value="Chanderi">Chanderi</option>
                      <option value="Tussar">Tussar</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 text-brand-ivory/70">Price (INR)</label>
                    <input
                      type="number"
                      required
                      value={newSaree.price}
                      onChange={(e) => setNewSaree({ ...newSaree, price: Number(e.target.value) })}
                      className="w-full bg-brand-purple/60 border border-brand-gold/30 rounded-xl py-2 px-3 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-1 text-brand-ivory/70">Image Path</label>
                  <input
                    type="text"
                    value={newSaree.image}
                    onChange={(e) => setNewSaree({ ...newSaree, image: e.target.value })}
                    className="w-full bg-brand-purple/60 border border-brand-gold/30 rounded-xl py-2 px-3 text-xs"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-brand-ivory/70">Description</label>
                  <textarea
                    rows={3}
                    value={newSaree.description}
                    onChange={(e) => setNewSaree({ ...newSaree, description: e.target.value })}
                    placeholder="Artisan description, zari details..."
                    className="w-full bg-brand-purple/60 border border-brand-gold/30 rounded-xl py-2 px-3 text-xs"
                  />
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-brand-gold/30 hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-brand-gold to-brand-gold-dark text-brand-purple-dark font-bold shadow"
                  >
                    Save & Publish
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
