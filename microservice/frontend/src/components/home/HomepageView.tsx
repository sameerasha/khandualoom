import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Hero } from '@/components/common/Hero';
import { ShopByCollection } from '@/components/common/ShopByCollection';
import { NewArrivalsSection } from '@/components/common/NewArrivalsSection';
import { HeritageFeaturesSection } from '@/components/common/HeritageFeaturesSection';
import { About } from '@/components/common/About';
import { CraftShowcaseSection } from '@/components/common/CraftShowcaseSection';
import { Testimonials } from '@/components/common/Testimonials';
import { NewsletterSection } from '@/components/common/NewsletterSection';
import { RecentViews } from '@/components/common/RecentViews';
import { PromotionalHeroBanner } from './PromotionalHeroBanner';
import { TrustAndOfferStrip } from './TrustAndOfferStrip';
import { CouponsCorner } from './CouponsCorner';
import { StickyDiscountTab } from './StickyDiscountTab';
import { useGetProductsQuery } from '@/features/products/productsApi';
import { fallbackProducts } from '@/data/fallbackProducts';
import { Product } from '@/types';

export const HomepageView: React.FC = () => {
  const navigate = useNavigate();
  const { data: fetchedProducts } = useGetProductsQuery({});
  const allProducts = fetchedProducts && fetchedProducts.length > 0 ? fetchedProducts : fallbackProducts;

  const handleSelectProduct = (product: Product) => {
    navigate(`/products/${product.id}`);
  };

  return (
    <div className="relative">
      {/* Floating Side Discount Tab */}
      <StickyDiscountTab />

      {/* Hero Section */}
      <Hero
        scrollProgress={0}
        onExploreClick={() => navigate('/catalog')}
        onSignUpClick={() => {}}
      />

      {/* Trust & Bank Instant Discount Strip */}
      <TrustAndOfferStrip />

      {/* Promotional Campaign Hero Banner */}
      <PromotionalHeroBanner />

      {/* Shop By Collection */}
      <ShopByCollection />

      {/* New Arrivals */}
      <NewArrivalsSection
        products={allProducts}
        onSelectProduct={handleSelectProduct}
      />

      {/* Coupons Corner */}
      <CouponsCorner />

      {/* Why Choose Khandua Looms */}
      <HeritageFeaturesSection />

      {/* Heritage Story */}
      <About />

      {/* Craft Showcase */}
      <CraftShowcaseSection onExploreCatalog={() => navigate('/catalog')} />

      {/* Customer Testimonials */}
      <Testimonials />

      {/* Newsletter */}
      <NewsletterSection />

      {/* Recently Viewed */}
      <RecentViews onSelectProduct={handleSelectProduct} />
    </div>
  );
};
