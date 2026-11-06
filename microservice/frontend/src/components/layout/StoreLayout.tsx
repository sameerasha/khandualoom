import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { CartSidebar } from '@/components/common/CartSidebar';
import { WishlistDrawer } from '@/components/common/WishlistDrawer';
import { AuthModal } from '@/components/auth/AuthModal';
import { LegalModal, LegalDocType } from '@/components/common/LegalModal';
import { SocialMediaModal } from '@/components/common/SocialMediaModal';
import { CinematicLoomCanvas } from '@/components/3d/CinematicLoomCanvas';
import { Product } from '@/types';
import { useTheme } from '@/theme/useTheme';

export const StoreLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark } = useTheme();
  const isLandingPage = location.pathname === '/';

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [socialModalOpen, setSocialModalOpen] = useState(false);
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalInitialTab, setLegalInitialTab] = useState<LegalDocType>('privacy');
  const [globalScrollProgress, setGlobalScrollProgress] = useState(0);

  useEffect(() => {
    if (!isLandingPage) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? Math.min(Math.max(scrollY / maxScroll, 0), 1) : 0;
      setGlobalScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLandingPage]);

  const handleOpenLegal = (doc: LegalDocType) => {
    setLegalInitialTab(doc);
    setLegalModalOpen(true);
  };

  const handleSelectProduct = (product: Product) => {
    navigate(`/products/${product.id}`);
  };

  return (
    <div
      className={`min-h-screen flex flex-col selection:bg-brand-gold selection:text-white relative transition-colors duration-300 ${
        isLandingPage
          ? isDark
            ? 'bg-[#0F0617] text-brand-ivory'
            : 'bg-[#FFFFFF] text-slate-900'
          : 'bg-background text-text-primary'
      }`}
    >
      {/* 3D Master Loom Canvas — strictly scoped to the Landing Page */}
      {isLandingPage && (
        <div
          className={`fixed inset-0 z-0 pointer-events-none overflow-hidden transition-opacity duration-700 ${
            isDark ? 'opacity-100' : 'opacity-70'
          }`}
        >
          <CinematicLoomCanvas scrollProgress={globalScrollProgress} />
        </div>
      )}

      {/* Header & Main Navigation */}
      <div className="relative z-30">
        <Navbar
          onOpenAuth={() => setAuthModalOpen(true)}
          onNavigateAdmin={() => navigate('/admin')}
          onOpenProfile={() => navigate('/account')}
          onNavigateHome={() => navigate('/')}
        />
      </div>

      {/* Main Routed Content Area with Solid Clean Background on Internal Pages */}
      <main className={`flex-1 relative z-10 ${!isLandingPage ? 'bg-background' : ''}`}>
        <Outlet />
      </main>

      {/* Global Modals & Drawers */}
      <CartSidebar onProceedToCheckout={() => navigate('/checkout')} />
      <WishlistDrawer onSelectProduct={handleSelectProduct} />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onNavigateAdmin={() => navigate('/admin')}
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

      {/* Primary Footer */}
      <div className="relative z-20">
        <Footer
          onOpenLegal={handleOpenLegal}
          onOpenContact={() => navigate('/contact')}
          onOpenSocial={() => setSocialModalOpen(true)}
          onNavigateHeritage={() => {
            navigate('/');
            setTimeout(() => {
              document.getElementById('heritage-section')?.scrollIntoView({ behavior: 'smooth' });
            }, 150);
          }}
          onSelectCategory={(category) => navigate(`/collections/${encodeURIComponent(category)}`)}
          onNavigateHome={() => navigate('/')}
        />
      </div>
    </div>
  );
};
