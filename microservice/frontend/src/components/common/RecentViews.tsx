import React, { useState, useEffect } from 'react';
import { useAppSelector } from '@/app/hooks';
import { Product } from '@/types';
import { ProductCard } from './ProductCard';
import { History, Sparkles } from 'lucide-react';
import axios from 'axios';

interface RecentViewsProps {
  onSelectProduct: (product: Product) => void;
}

export const RecentViews: React.FC<RecentViewsProps> = ({ onSelectProduct }) => {
  const { user } = useAppSelector((state) => state.auth);
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 1. If user is logged in, try loading from backend
    if (user?.id) {
      setLoading(true);
      axios.get<Product[]>(`/api/products/recent?userId=${user.id}`)
        .then((res) => {
          if (Array.isArray(res.data) && res.data.length > 0) {
            setRecentProducts(res.data);
          }
        })
        .catch(() => {
          // Fallback to local storage
          loadLocalRecentViews();
        })
        .finally(() => setLoading(false));
    } else {
      loadLocalRecentViews();
    }
  }, [user]);

  const loadLocalRecentViews = () => {
    try {
      const stored = localStorage.getItem('khadualooms_recent_products') || localStorage.getItem('vastraloom_recent_products');
      if (stored) {
        const parsed: Product[] = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setRecentProducts(parsed);
        }
      }
    } catch {
      // Ignore json parse error
    }
  };

  if (loading || recentProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-12 sm:py-14 bg-[#0A0210] text-brand-ivory border-t border-brand-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-brand-gold/15">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand-gold/10 text-brand-gold">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-brand-ivory">
                Recently Viewed Masterpieces
              </h3>
              <p className="text-xs text-brand-ivory/60 mt-0.5">
                Your personalized curation of inspected weaves
              </p>
            </div>
          </div>
          <span className="text-xs font-mono uppercase tracking-widest text-brand-gold hidden sm:flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> {recentProducts.length} Silks
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 md:gap-6">
          {recentProducts.slice(0, 4).map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
