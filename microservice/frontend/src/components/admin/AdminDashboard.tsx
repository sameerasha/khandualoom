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
import { AdminLayout } from './AdminLayout';
import { AdminDashboardView } from './AdminDashboardView';
import { ProductManagerView } from './ProductManagerView';
import { OrderManagerView } from './OrderManagerView';
import { UserManagerView, UserItem } from './UserManagerView';
import { StoreSettingsView, SocialItem } from './StoreSettingsView';
import { AdminManagerView, AdminUserItem } from './AdminManagerView';
import { ProductEditorModal } from './ProductEditorModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';

interface AdminDashboardProps {
  onBackToStore: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToStore }) => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');

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
      email: 'admin@vastraloom.com',
      role: 'ROLE_ADMIN',
      createdDate: '2026-05-01T00:00:00Z',
    },
    {
      id: 2,
      firstName: 'Supreme',
      lastName: 'Curator',
      email: 'superadmin@vastraloom.com',
      role: 'ROLE_SUPER_ADMIN',
      createdDate: '2026-04-15T00:00:00Z',
    },
  ]);

  const [socialsList, setSocialsList] = useState<SocialItem[]>([
    { id: 1, platform: 'instagram', url: 'https://instagram.com/vastraloom' },
    { id: 2, platform: 'whatsapp', url: 'https://wa.me/919876543210' },
    { id: 3, platform: 'facebook', url: 'https://facebook.com/vastraloom' },
    { id: 4, platform: 'youtube', url: 'https://youtube.com/@vastraloom' },
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
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProductToEdit(product);
    setIsEditorOpen(true);
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

  const handleCreateAdmin = async (data: { email: string; password?: string; firstName?: string; lastName?: string }) => {
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
          role: 'ROLE_ADMIN',
          createdDate: new Date().toISOString(),
        },
      ]);
    }
  };

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
        <ProductManagerView
          products={products}
          onAddNewProduct={handleAddNewProduct}
          onEditProduct={handleEditProduct}
          onDeleteProduct={handleDeleteProductPrompt}
        />
      )}

      {activeTab === 'orders' && (
        <OrderManagerView orders={apiOrders} onStatusChange={handleOrderStatusChange} />
      )}

      {activeTab === 'users' && (
        <UserManagerView users={usersList} onToggleRole={handleToggleUserRole} />
      )}

      {activeTab === 'settings' && (
        <StoreSettingsView
          socials={socialsList}
          onSaveSocial={handleSaveSocial}
          onDeleteSocial={handleDeleteSocial}
        />
      )}

      {activeTab === 'admins' && (
        <AdminManagerView admins={adminsList} onCreateAdmin={handleCreateAdmin} />
      )}

      {/* Product Editor Modal */}
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
