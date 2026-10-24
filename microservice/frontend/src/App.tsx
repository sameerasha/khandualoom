import React, { useState, useEffect } from 'react';
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
import { CinematicLoomCanvas } from '@/components/3d/CinematicLoomCanvas';
import { ScrollChapterIndicator } from '@/components/common/ScrollChapterIndicator';
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
  const [globalScrollProgress, setGlobalScrollProgress] = useState(0);

  // Track global scroll progression across all sections (0.0 to 1.0)
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? Math.min(Math.max(scrollY / maxScroll, 0), 1) : 0;
      setGlobalScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentView]);

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
      <div className="min-h-screen bg-[#0F0617] text-brand-ivory flex flex-col selection:bg-brand-gold selection:text-brand-purple-dark relative">
        
        {/* Persistent 3D Master Loom Canvas Across All Storefront Sections */}
        {currentView === 'store' && (
          <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden transition-opacity duration-700">
            <CinematicLoomCanvas scrollProgress={globalScrollProgress} />
          </div>
        )}

        {/* Primary Navigation (shown in store, contact, & product views) */}
        {(currentView === 'store' || currentView === 'contact' || currentView === 'product') && (
          <Navbar
            onOpenAuth={() => setAuthModalOpen(true)}
            onNavigateAdmin={() => setCurrentView('admin')}
            onOpenProfile={() => setCurrentView('profile')}
            onOpenContact={() => setCurrentView('contact')}
            onOpenSocial={() => setSocialModalOpen(true)}
          />
        )}

        {/* Floating Luxury Chapter Indicator on Desktop */}
        {currentView === 'store' && (
          <ScrollChapterIndicator scrollProgress={globalScrollProgress} />
        )}

        {/* Main Content Area */}
        <main className="flex-1 relative z-10">
          {currentView === 'store' && (
            <>
              {/* Section 1: 3D Saree & Flying Shuttle Hero Section */}
              <Hero
                scrollProgress={globalScrollProgress}
                onExploreClick={() => {
                  document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                onSignUpClick={() => setAuthModalOpen(true)}
              />

              {/* Section 2: Royal Atelier Trust Pillars & 3D Celestial Rings */}
              <HeritageFeaturesSection />

              {/* Section 3: Flying Shuttle & Kadwa Weaving Story with Active Trailing Yarn */}
              <CraftShowcaseSection
                onExploreCatalog={() => {
                  document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
              />

              {/* Section 4: Master Saree Catalog Grid framed by 3D Silk Horizon Wave */}
              <ProductGrid onSelectProduct={handleSelectProduct} />

              {/* Section 5: Atelier History & Sacred Loom Manifesto framed by Pit Loom Architecture */}
              <About />

              {/* Section 6: Connoisseur Testimonials */}
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
