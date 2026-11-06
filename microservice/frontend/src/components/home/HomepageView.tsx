import React, { Fragment } from 'react';
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
import { useAppSelector } from '@/app/hooks';

export const HomepageView: React.FC = () => {
  const navigate = useNavigate();
  const features = useAppSelector((state) => state.features.features);
  const sections = useAppSelector((state) => state.homepageConfig.sections);

  const { data: fetchedProducts } = useGetProductsQuery({});
  const allProducts = fetchedProducts && fetchedProducts.length > 0 ? fetchedProducts : fallbackProducts;

  const handleSelectProduct = (product: Product) => {
    navigate(`/products/${product.id}`);
  };

  const activeSections = [...sections]
    .filter((s) => s.enabled)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="relative">
      {/* Floating Side Discount Tab */}
      {features.coupons && <StickyDiscountTab />}

      {/* Hero Section */}
      <Hero
        scrollProgress={0}
        onExploreClick={() => navigate('/catalog')}
        onSignUpClick={() => {}}
      />

      {/* Trust & Bank Instant Discount Strip */}
      {features.bankDiscounts && <TrustAndOfferStrip />}

      {/* Dynamically Ordered & Toggled Homepage Sections */}
      {activeSections.map((section) => {
        switch (section.type) {
          case 'hero':
            return <PromotionalHeroBanner key={section.id} />;
          case 'categories':
            return <ShopByCollection key={section.id} />;
          case 'highlights':
            return (
              <NewArrivalsSection
                key={section.id}
                products={allProducts}
                onSelectProduct={handleSelectProduct}
              />
            );
          case 'coupons':
            return features.coupons ? <CouponsCorner key={section.id} /> : null;
          case 'artisan':
            return (
              <Fragment key={section.id}>
                <HeritageFeaturesSection />
                <About />
                <CraftShowcaseSection onExploreCatalog={() => navigate('/catalog')} />
              </Fragment>
            );
          case 'testimonials':
            return <Testimonials key={section.id} />;
          case 'newsletter':
            return <NewsletterSection key={section.id} />;
          default:
            return null;
        }
      })}

      {/* Recently Viewed Sarees */}
      {features.recentViews && <RecentViews onSelectProduct={handleSelectProduct} />}
    </div>
  );
};
