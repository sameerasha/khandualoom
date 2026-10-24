import React, { useState } from 'react';
import { Navbar } from '@/components/common/Navbar';
import { Hero } from '@/components/common/Hero';
import { HeritageFeaturesSection } from '@/components/common/HeritageFeaturesSection';
import { CraftShowcaseSection } from '@/components/common/CraftShowcaseSection';
import { ProductGrid } from '@/components/common/ProductGrid';
import { About } from '@/components/common/About';
import { Testimonials } from '@/components/common/Testimonials';
import { RecentViews } from '@/components/common/RecentViews';
import { CartSidebar } from '@/components/common/CartSidebar';
import { Footer } from '@/components/common/Footer';
import { AuthModal } from '@/components/auth/AuthModal';
import { ProductDetails } from '@/components/product/ProductDetails';
import { Checkout } from '@/components/checkout/Checkout';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { ProfileDashboard } from '@/components/profile/ProfileDashboard';
import { ContactPage } from '@/components/common/ContactPage';
import { LegalModal, LegalDocType } from '@/components/common/LegalModal';
import { SocialMediaModal } from '@/components/common/SocialMediaModal';
import { OAuth2RedirectHandler } from '@/components/auth/OAuth2RedirectHandler';
import { SmoothScrollProvider } from '@/components/common/SmoothScrollProvider';
import { Product } from '@/types';
import { useAppDispatch } from '@/app/hooks';
import { setSelectedCategory } from '@/features/products/productsSlice';

export type AppView = 'store' | 'checkout' | 'admin' | 'profile' | 'contact' | 'product';

export const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const [currentView, setCurrentView] = useState<AppView>('store');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [socialModalOpen, setSocialModalOpen] = useState(false);
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalInitialTab, setLegalInitialTab] = useState<LegalDocType>('privacy');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Social OAuth2 redirect handler intercept
  if (window.location.pathname.startsWith('/oauth2/redirect')) {
    return <OAuth2RedirectHandler />;
  }

  const handleOpenLegal = (doc: LegalDocType) => {
    setLegalInitialTab(doc);
    setLegalModalOpen(true);
  };

  const handleSelectCategoryFromFooter = (category: string) => {
    dispatch(setSelectedCategory(category));
    setCurrentView('store');
    window.scrollTo({ top: 750, behavior: 'smooth' });
  };

  const handleNavigateHeritage = () => {
    if (currentView !== 'store') {
      setCurrentView('store');
      setTimeout(() => {
        document.getElementById('heritage')?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      document.getElementById('heritage')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <SmoothScrollProvider>
      <div className="min-h-screen bg-[#0F0617] text-brand-ivory flex flex-col selection:bg-brand-gold selection:text-brand-purple-dark">
        {/* Primary Navigation (shown in store, contact, & product views) */}
        {(currentView === 'store' || currentView === 'contact' || currentView === 'product') && (
          <Navbar
            onOpenAuth={() => setAuthModalOpen(true)}
            onNavigateAdmin={() => setCurrentView('admin')}
            onOpenProfile={() => setCurrentView('profile')}
            onOpenContact={() => setCurrentView('contact')}
            onOpenSocial={() => setSocialModalOpen(true)}
            onNavigateHeritage={handleNavigateHeritage}
          />
        )}

        {/* Main Content Area */}
        <main className="flex-1">
          {currentView === 'store' && (
            <>
              {/* 3D Saree & Flying Shuttle Hero Section */}
              <Hero
                onExploreClick={() => {
                  document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                onSignUpClick={() => setAuthModalOpen(true)}
              />

              {/* Bottom Component 1: Royal Atelier Trust Pillars */}
              <HeritageFeaturesSection />

              {/* Bottom Component 2: Flying Shuttle & Kadwa Weaving Story */}
              <CraftShowcaseSection
                onExploreCatalog={() => {
                  document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
              />

              {/* Master Saree Catalog Grid */}
              <ProductGrid onSelectProduct={handleSelectProduct} />

              {/* Atelier History & Manifesto */}
              <About />

              {/* Connoisseur Testimonials */}
              <Testimonials />

              {/* Recently Viewed Sarees */}
              <RecentViews onSelectProduct={handleSelectProduct} />
            </>
          )}

          {currentView === 'product' && selectedProduct && (
            <ProductDetails
              product={selectedProduct}
              onClose={() => {
                setCurrentView('store');
                window.scrollTo({ top: 650, behavior: 'smooth' });
              }}
              onSelectProduct={handleSelectProduct}
              onProceedToCheckout={() => {
                setCurrentView('checkout');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {currentView === 'contact' && (
            <ContactPage onBackToStore={() => setCurrentView('store')} />
          )}

          {currentView === 'checkout' && (
            <Checkout
              onBack={() => setCurrentView('store')}
              onOrderSuccess={(_orderId) => {
                setCurrentView('profile');
              }}
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
          onNavigateAdmin={() => setCurrentView('admin')}
        />

        <SocialMediaModal
          isOpen={socialModalOpen}
          onClose={() => setSocialModalOpen(false)}
        />

        <LegalModal
          isOpen={legalModalOpen}
          initialDoc={legalInitialTab}
          onClose={() => setLegalModalOpen(false)}
        />

        {/* Footer (shown in store, contact, checkout, & product views) */}
        {(currentView === 'store' || currentView === 'contact' || currentView === 'checkout' || currentView === 'product') && (
          <Footer
            onOpenLegal={handleOpenLegal}
            onOpenContact={() => setCurrentView('contact')}
            onOpenSocial={() => setSocialModalOpen(true)}
            onNavigateHeritage={handleNavigateHeritage}
            onSelectCategory={handleSelectCategoryFromFooter}
          />
        )}
      </div>
    </SmoothScrollProvider>
  );
};

export default App;
