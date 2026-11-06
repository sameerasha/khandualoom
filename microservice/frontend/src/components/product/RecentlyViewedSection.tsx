import React, { useEffect, useState } from 'react';
import { Product } from '@/types';
import { CatalogProductCard } from '@/components/catalog/CatalogProductCard';

interface RecentlyViewedSectionProps {
  currentProductId: number;
  currentProduct: Product;
}

const STORAGE_KEY = 'khandualoom_recently_viewed';

export const RecentlyViewedSection: React.FC<RecentlyViewedSectionProps> = ({
  currentProductId,
  currentProduct,
}) => {
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      let list: Product[] = stored ? JSON.parse(stored) : [];

      // Filter out current product
      const others = list.filter((p) => p.id !== currentProductId);
      setRecentProducts(others.slice(0, 4));

      // Append current product at front and save back
      const updated = [currentProduct, ...list.filter((p) => p.id !== currentProductId)].slice(0, 10);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not read or write recently viewed products:', e);
    }
  }, [currentProductId, currentProduct]);

  if (recentProducts.length === 0) {
    return null;
  }

  return (
    <section className="mt-16 pt-10 border-t border-gray-200">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 tracking-tight">
          Recently Viewed
        </h3>
        <p className="text-xs text-gray-500 mt-0.5">
          Products you recently explored in our store
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {recentProducts.map((p) => (
          <CatalogProductCard key={`recent-${p.id}`} product={p} />
        ))}
      </div>
    </section>
  );
};
