import React, { useState } from 'react';
import { Navbar } from '@/components/common/Navbar';
import { Hero } from '@/components/common/Hero';
import { ProductGrid } from '@/components/common/ProductGrid';
import { CartSidebar } from '@/components/common/CartSidebar';
import { Footer } from '@/components/common/Footer';
import { AuthModal } from '@/components/auth/AuthModal';
import { ProductDetails } from '@/components/product/ProductDetails';
import { Checkout } from '@/components/checkout/Checkout';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { ProfileDashboard } from '@/components/profile/ProfileDashboard';
import { Product } from '@/types';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'store' | 'checkout' | 'admin' | 'profile'>('store');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <div className="min-h-screen bg-brand-purple-dark text-brand-ivory flex flex-col selection:bg-brand-gold selection:text-brand-purple-dark">
      {/* Primary Navigation (shown in store view) */}
      {currentView === 'store' && (
        <Navbar
          onOpenAuth={() => setAuthModalOpen(true)}
          onNavigateAdmin={() => setCurrentView('admin')}
          onOpenProfile={() => setCurrentView('profile')}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'store' && (
          <>
            <Hero />
            <ProductGrid onSelectProduct={(p) => setSelectedProduct(p)} />
          </>
        )}

        {currentView === 'checkout' && (
          <Checkout
            onBack={() => setCurrentView('store')}
            onOrderSuccess={(_orderId) => {}}
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboard onBackToStore={() => setCurrentView('store')} />
        )}

        {currentView === 'profile' && (
          <ProfileDashboard onBackToStore={() => setCurrentView('store')} />
        )}
      </main>

      {/* Global Modals & Drawers */}
      <CartSidebar onProceedToCheckout={() => setCurrentView('checkout')} />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      {selectedProduct && (
        <ProductDetails
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onProceedToCheckout={() => {
            setSelectedProduct(null);
            setCurrentView('checkout');
          }}
        />
      )}

      {/* Footer (shown in store & checkout views) */}
      {(currentView === 'store' || currentView === 'checkout') && <Footer />}
    </div>
  );
};

export default App;
