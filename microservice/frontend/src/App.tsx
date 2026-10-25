import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/common/Navbar';
import { Hero } from '@/components/common/Hero';
import { ShopByCollection } from '@/components/common/ShopByCollection';
import { NewArrivalsSection } from '@/components/common/NewArrivalsSection';
import { ProductGrid } from '@/components/common/ProductGrid';
import { HeritageFeaturesSection } from '@/components/common/HeritageFeaturesSection';
import { About } from '@/components/common/About';
import { CraftShowcaseSection } from '@/components/common/CraftShowcaseSection';
import { Testimonials } from '@/components/common/Testimonials';
import { NewsletterSection } from '@/components/common/NewsletterSection';
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
import { SmoothScrollProvider, scrollToTopImmediate } from '@/components/common/SmoothScrollProvider';
import { CinematicLoomCanvas } from '@/components/3d/CinematicLoomCanvas';
import { Product } from '@/types';
import { useAppDispatch } from '@/app/hooks';
import { setSelectedCategory } from '@/features/products/productsSlice';
import { useGetProductsQuery } from '@/features/products/productsApi';
import { fallbackProducts } from '@/data/fallbackProducts';

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

  // Fetch product catalog for New Arrivals and overall views
  const { data: fetchedProducts } = useGetProductsQuery({});
  const allProducts = fetchedProducts && fetchedProducts.length > 0 ? fetchedProducts : fallbackProducts;

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
    const catalogElement = document.getElementById('catalog-section');
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavigateHeritage = () => {
    if (currentView !== 'store') {
      setCurrentView('store');
      setTimeout(() => {
        document.getElementById('heritage-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      document.getElementById('heritage-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('product');
    scrollToTopImmediate();
  };

  const handleNavigateHome = () => {
    setCurrentView('store');
    setSelectedProduct(null);
    scrollToTopImmediate();
  };

  return (
    <SmoothScrollProvider enabled={currentView !== 'admin'}>
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
            onNavigateHome={handleNavigateHome}
          />
        )}

        {/* Main Content Area */}
        <main className="flex-1 relative z-10">
          {currentView === 'store' && (
            <>
              {/* Section 1: Hero */}
              <Hero
                scrollProgress={globalScrollProgress}
                onExploreClick={() => {
                  document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                onSignUpClick={() => setAuthModalOpen(true)}
              />

              {/* Section 2: Shop by Collection */}
              <ShopByCollection />

              {/* Section 3: New Arrivals */}
              <NewArrivalsSection
                products={allProducts}
                onSelectProduct={handleSelectProduct}
              />

              {/* Section 4: Bestselling Sarees & Filterable Catalog */}
              <ProductGrid onSelectProduct={handleSelectProduct} />

              {/* Section 5: Why Choose Khandua Looms? */}
              <HeritageFeaturesSection />

              {/* Section 6: Our Heritage: A Legacy Woven Through Generations */}
              <About />

              {/* Section 7: Odisha Weaving Story & Active Trailing Yarn */}
              <CraftShowcaseSection
                onExploreCatalog={() => {
                  document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
              />

              {/* Section 8: Customer Appraisals & Testimonials */}
              <Testimonials />

              {/* Section 9: Stay Connected with Our Weaves Newsletter */}
              <NewsletterSection />

              {/* Section 10: Recently Viewed Sarees */}
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
            onNavigateHome={handleNavigateHome}
          />
        )}
      </div>
    </SmoothScrollProvider>
  );
};

export default App;
