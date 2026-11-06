import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useGetAllOrdersQuery, useUpdateOrderStatusMutation } from '@/features/orders/ordersApi';
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from '@/features/products/productsApi';
import { Product } from '@/types';
import { fallbackProducts } from '@/data/fallbackProducts';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { useLoginMutation } from '@/features/auth/authApi';
import { setCredentials } from '@/features/auth/authSlice';
import { Shield, ArrowLeft, Sparkles, Eye, EyeOff, KeyRound } from 'lucide-react';
import { AdminLayout } from './AdminLayout';
import { AdminDashboardView } from './AdminDashboardView';
import { ProductManagerView } from './ProductManagerView';
import { OrderManagerView } from './OrderManagerView';
import { UserManagerView, UserItem } from './UserManagerView';
import { StoreSettingsView, SocialItem } from './StoreSettingsView';
import { AdminManagerView, AdminUserItem } from './AdminManagerView';
import { ArtisanManagerView } from './ArtisanManagerView';
import { ProductEditorModal } from './ProductEditorModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { CategoryManagerView } from './categories/CategoryManagerView';
import { InventoryLedgerView } from './inventory/InventoryLedgerView';
import { HomepageBuilderView } from './homepage/HomepageBuilderView';
import { BannerManagerView } from './banners/BannerManagerView';
import { PromotionsManagerView } from './promotions/PromotionsManagerView';
import { FeatureManagerView } from './FeatureManagerView';
import { AuditLogExplorer } from './governance/AuditLogExplorer';

interface AdminDashboardProps {
  onBackToStore: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToStore }) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, role } = useAppSelector((state) => state.auth);
  const isAdminUser =
    isAuthenticated &&
    (role === 'ROLE_ADMIN' || role === 'ROLE_SUPER_ADMIN' || role === 'ROLE_ARTISAN');

  const [loginMutation, { isLoading: isLoggingIn }] = useLoginMutation();
  const [adminEmail, setAdminEmail] = useState('superadmin@khandualoom.com');
  const [adminPassword, setAdminPassword] = useState('Admin@123456');
  const [selectedRoleType, setSelectedRoleType] = useState<'super' | 'admin'>('super');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<string>(
    role === 'ROLE_ARTISAN' ? 'artisans' : 'dashboard'
  );

  // Orders API
  const { data: apiOrders = [], refetch: refetchOrders } = useGetAllOrdersQuery();
  const [updateStatusMutation] = useUpdateOrderStatusMutation();

  // Products API
  const { data: apiProducts, refetch: refetchProducts } = useGetProductsQuery();
  const [createProductMutation] = useCreateProductMutation();
  const [updateProductMutation] = useUpdateProductMutation();
  const [deleteProductMutation] = useDeleteProductMutation();

  const products = apiProducts && apiProducts.length > 0 ? apiProducts : fallbackProducts;

  // Modals state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedProductToEdit, setSelectedProductToEdit] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Users, Admins, Socials state
  const [usersList, setUsersList] = useState<UserItem[]>([
    {
      id: 1,
      firstName: 'Ananya',
      lastName: 'Sharma',
      email: 'ananya.saree@gmail.com',
      phone: '+91 98765 43210',
      role: 'ROLE_USER',
      emailVerified: true,
      phoneVerified: true,
      createdDate: '2026-06-15T10:00:00Z',
      address: 'Plot 42, Vasant Vihar, New Delhi - 110057',
    },
    {
      id: 2,
      firstName: 'Vikramaditya',
      lastName: 'Rao',
      email: 'vikram.rao@royalheirloom.in',
      phone: '+91 98111 22334',
      role: 'ROLE_USER',
      emailVerified: true,
      phoneVerified: true,
      createdDate: '2026-07-01T12:30:00Z',
      address: 'Palace Road, Bengaluru, Karnataka - 560001',
    },
    {
      id: 3,
      firstName: 'Pooja',
      lastName: 'Deshmukh',
      email: 'pooja.deshmukh@gmail.com',
      phone: '+91 97654 32190',
      role: 'ROLE_USER',
      emailVerified: true,
      phoneVerified: false,
      createdDate: '2026-08-10T14:20:00Z',
      address: 'Bandra West, Mumbai, Maharashtra - 400050',
    },
    {
      id: 4,
      firstName: 'Meera',
      lastName: 'Patel',
      email: 'meera.patel@ahmedabadsilk.com',
      phone: '+91 99250 88776',
      role: 'ROLE_USER',
      emailVerified: true,
      phoneVerified: true,
      createdDate: '2026-09-05T09:15:00Z',
      address: 'Navrangpura, Ahmedabad, Gujarat - 380009',
    },
  ]);

  const [adminsList, setAdminsList] = useState<AdminUserItem[]>([
    {
      id: 1,
      firstName: 'Imperial',
      lastName: 'Admin',
      email: 'admin@khandualoom.com',
      role: 'ROLE_ADMIN',
      createdDate: '2026-05-01T00:00:00Z',
    },
    {
      id: 2,
      firstName: 'Supreme',
      lastName: 'Curator',
      email: 'superadmin@khandualoom.com',
      role: 'ROLE_SUPER_ADMIN',
      createdDate: '2026-04-15T00:00:00Z',
    },
  ]);

  const [socialsList, setSocialsList] = useState<SocialItem[]>([
    { id: 1, platform: 'instagram', url: 'https://instagram.com/khandualoom' },
    { id: 2, platform: 'whatsapp', url: 'https://wa.me/916742918844' },
    { id: 3, platform: 'facebook', url: 'https://facebook.com/khandualoom' },
    { id: 4, platform: 'youtube', url: 'https://youtube.com/@khandualoom' },
  ]);

  // Load backend data if available
  useEffect(() => {
    if (activeTab === 'users') {
      axios
        .get('/api/admin/users')
        .then((res) => {
          if (Array.isArray(res.data) && res.data.length > 0) setUsersList(res.data);
        })
        .catch(() => {});
    } else if (activeTab === 'admins') {
      axios
        .get('/api/super-admin/admins')
        .then((res) => {
          if (Array.isArray(res.data) && res.data.length > 0) setAdminsList(res.data);
        })
        .catch(() => {});
    } else if (activeTab === 'settings') {
      axios
        .get('/api/social-media')
        .then((res) => {
          if (Array.isArray(res.data) && res.data.length > 0) setSocialsList(res.data);
        })
        .catch(() => {});
    }
  }, [activeTab]);

  // Handlers
  const handleOrderStatusChange = async (orderId: number, status: string) => {
    try {
      await updateStatusMutation({ id: orderId, status }).unwrap();
      refetchOrders();
    } catch (err) {
      console.error('Failed to update order status', err);
    }
  };

  const handleAddNewProduct = () => {
    setSelectedProductToEdit(null);
    setIsEditorOpen(true);
    setActiveTab('products');
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProductToEdit(product);
    setIsEditorOpen(true);
    setActiveTab('products');
  };

  const handleDeleteProductPrompt = (product: Product) => {
    setProductToDelete(product);
  };

  const handleConfirmDeleteProduct = async () => {
    if (!productToDelete) return;
    try {
      await deleteProductMutation(productToDelete.id).unwrap();
      setProductToDelete(null);
      refetchProducts();
    } catch (err) {
      console.error('Failed to delete product', err);
    }
  };

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

  const handleToggleUserRole = async (userId: number, currentRole: string) => {
    const nextRole = currentRole === 'ROLE_ADMIN' ? 'ROLE_USER' : 'ROLE_ADMIN';
    try {
      await axios.put(`/api/admin/users/${userId}/role?role=${nextRole}`);
    } catch (err) {
      // Offline fallback state update
    }
    setUsersList((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: nextRole } : u))
    );
  };

  const handleSaveSocial = async (social: { platform: string; url: string; id?: number }) => {
    try {
      if (social.id) {
        await axios.put(`/api/admin/social-media/${social.id}`, social);
      } else {
        await axios.post('/api/admin/social-media', social);
      }
      const res = await axios.get('/api/social-media');
      if (Array.isArray(res.data) && res.data.length > 0) setSocialsList(res.data);
    } catch (err) {
      if (social.id) {
        setSocialsList((prev) =>
          prev.map((s) => (s.id === social.id ? { ...s, platform: social.platform, url: social.url } : s))
        );
      } else {
        setSocialsList((prev) => [
          ...prev,
          { id: Date.now(), platform: social.platform, url: social.url },
        ]);
      }
    }
  };

  const handleDeleteSocial = async (id: number) => {
    try {
      await axios.delete(`/api/admin/social-media/${id}`);
    } catch (err) {}
    setSocialsList((prev) => prev.filter((s) => s.id !== id));
  };

  const handleCreateAdmin = async (data: { email: string; password?: string; firstName?: string; lastName?: string; role?: string }) => {
    try {
      await axios.post('/api/super-admin/admins', data);
      const res = await axios.get('/api/super-admin/admins');
      if (Array.isArray(res.data)) setAdminsList(res.data);
    } catch (err) {
      setAdminsList((prev) => [
        ...prev,
        {
          id: Date.now(),
          firstName: data.firstName || 'Atelier',
          lastName: data.lastName || 'Admin',
          email: data.email,
          role: data.role || 'ROLE_ADMIN',
          createdDate: new Date().toISOString(),
        },
      ]);
    }
  };

  const handleAdminLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    try {
      const res = await loginMutation({ email: adminEmail.trim(), password: adminPassword }).unwrap();
      if (res.role !== 'ROLE_ADMIN' && res.role !== 'ROLE_SUPER_ADMIN') {
        setAuthError('Access restricted. This account does not possess administrator credentials.');
        return;
      }
      dispatch(setCredentials(res));
    } catch (err: any) {
      setAuthError(err?.data?.message || err?.data || 'Invalid credentials. Please verify administrator email and password.');
    }
  };

  if (!isAdminUser) {
    return (
      <div className="min-h-screen bg-[#07020C] text-brand-ivory flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
        {/* Background Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-gold/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#3B154C]/30 rounded-full blur-[120px] pointer-events-none" />

        {/* Back to Boutique Button */}
        <div className="w-full max-w-md mb-6 flex justify-between items-center z-10">
          <button
            onClick={onBackToStore}
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-brand-gold-light/80 hover:text-brand-gold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Boutique</span>
          </button>
          <span className="text-[10px] font-mono uppercase tracking-widest text-brand-gold/60">
            Vault Protocol v2.4
          </span>
        </div>

        {/* Main Vault Gate Card */}
        <div className="w-full max-w-md bg-gradient-to-b from-[#180A26] via-[#10031B] to-[#0D0216] border border-brand-gold/40 rounded-3xl p-7 sm:p-9 shadow-[0_20px_70px_rgba(0,0,0,0.9)] relative z-10">
          <div className="text-center space-y-2 mb-7">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-gold/15 border border-brand-gold/40 text-brand-gold mb-2 shadow-inner">
              <Shield className="w-7 h-7" />
            </div>
            <h2 className="font-serif text-2xl font-bold tracking-wide text-white">
              Khandua Looms Vault
            </h2>
            <p className="text-xs text-brand-ivory/70 font-sans leading-relaxed">
              Administrative authentication portal for Super Administrators & Store Managers.
            </p>
          </div>

          {/* Role Presets Toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-black/40 rounded-xl border border-brand-gold/20 mb-6">
            <button
              type="button"
              onClick={() => {
                setSelectedRoleType('super');
                setAdminEmail('superadmin@khandualoom.com');
                setAdminPassword('Admin@123456');
                setAuthError(null);
              }}
              className={`py-2 px-3 rounded-lg text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                selectedRoleType === 'super'
                  ? 'bg-gradient-to-r from-brand-gold to-brand-gold-dark text-brand-purple-dark font-bold shadow-md'
                  : 'text-brand-ivory/60 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Super Admin</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedRoleType('admin');
                setAdminEmail('admin@khandualoom.com');
                setAdminPassword('Admin@123456');
                setAuthError(null);
              }}
              className={`py-2 px-3 rounded-lg text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                selectedRoleType === 'admin'
                  ? 'bg-gradient-to-r from-brand-gold to-brand-gold-dark text-brand-purple-dark font-bold shadow-md'
                  : 'text-brand-ivory/60 hover:text-white'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Store Admin</span>
            </button>
          </div>

          {authError && (
            <div className="p-3 mb-5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs text-center font-sans">
              {authError}
            </div>
          )}

          <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-brand-ivory/70 mb-1.5">
                Admin Email ID
              </label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@khandualoom.com"
                className="w-full bg-[#07010E] border border-brand-gold/30 focus:border-brand-gold rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-brand-ivory/70 mb-1.5">
                Vault Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#07010E] border border-brand-gold/30 focus:border-brand-gold rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-brand-ivory/50 hover:text-brand-gold transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-brand-gold via-brand-gold-light to-brand-gold-dark text-brand-purple-dark font-serif font-bold text-sm tracking-wider uppercase transition-all shadow-lg hover:shadow-brand-gold/20 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {isLoggingIn ? 'Authenticating Credentials...' : 'Unlock Admin Atelier'}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-brand-gold/15 text-center">
            <p className="text-[11px] text-brand-ivory/50 font-mono">
              Role credentials verified via Spring Boot 3.3 Auth Microservice JWKS.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout
      currentRoute={activeTab}
      onNavigate={(tab) => setActiveTab(tab)}
      onBackToStore={onBackToStore}
    >
      {activeTab === 'dashboard' && (
        <AdminDashboardView
          products={products}
          orders={apiOrders}
          onNavigate={(tab) => setActiveTab(tab)}
          onAddNewProduct={handleAddNewProduct}
          onEditProduct={handleEditProduct}
          onBackToStore={onBackToStore}
        />
      )}

      {activeTab === 'products' && (
        isEditorOpen ? (
          <ProductEditorModal
            isOpen={true}
            inline={true}
            product={selectedProductToEdit}
            onSave={handleSaveProduct}
            onClose={() => {
              setIsEditorOpen(false);
              setSelectedProductToEdit(null);
            }}
          />
        ) : (
          <ProductManagerView
            products={products}
            onAddNewProduct={handleAddNewProduct}
            onEditProduct={handleEditProduct}
            onDeleteProduct={handleDeleteProductPrompt}
          />
        )
      )}

      {activeTab === 'categories' && <CategoryManagerView />}

      {activeTab === 'inventory' && <InventoryLedgerView />}

      {activeTab === 'homepage' && <HomepageBuilderView />}

      {activeTab === 'banners' && <BannerManagerView />}

      {activeTab === 'promotions' && <PromotionsManagerView />}

      {activeTab === 'features' && <FeatureManagerView />}

      {activeTab === 'artisans' && <ArtisanManagerView />}

      {activeTab === 'orders' && (
        <OrderManagerView orders={apiOrders} onStatusChange={handleOrderStatusChange} />
      )}

      {activeTab === 'users' && (
        <UserManagerView users={usersList} onToggleRole={handleToggleUserRole} />
      )}

      {activeTab === 'admins' && (
        <AdminManagerView admins={adminsList} onCreateAdmin={handleCreateAdmin} />
      )}

      {activeTab === 'audit' && <AuditLogExplorer />}

      {activeTab === 'settings' && (
        <StoreSettingsView
          socials={socialsList}
          onSaveSocial={handleSaveSocial}
          onDeleteSocial={handleDeleteSocial}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!productToDelete}
        title="Confirm Saree Deletion"
        message={`Are you sure you want to delete ${productToDelete?.name || 'this weave'}? This will remove this masterpiece from the storefront catalog.`}
        confirmLabel="Delete Weave"
        onConfirm={handleConfirmDeleteProduct}
        onClose={() => setProductToDelete(null)}
      />
    </AdminLayout>
  );
};
