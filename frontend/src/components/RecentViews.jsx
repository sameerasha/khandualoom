import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ProductCard from './ProductCard';
import './RecentViews.css';

export default function RecentViews({ onNavigate }) {
  const { isCustomerLoggedIn, customerInfo } = useAuth();
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(5);

  useEffect(() => {
    if (!isCustomerLoggedIn || !customerInfo?.id) {
      setLoading(false);
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/products/recent?userId=${customerInfo.id}`)
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Failed to load recent products');
      })
      .then(data => {
        setRecentProducts(data || []);
      })
      .catch(err => console.error('Failed to load recent views:', err))
      .finally(() => setLoading(false));
  }, [isCustomerLoggedIn, customerInfo]);

  if (loading || recentProducts.length === 0) {
    return null;
  }

  return (
    <section className="recent-views-section">
      <div className="container">
        <h2 className="recent-views-title">Recently Viewed Masterpieces</h2>
        <div className="products-grid">
          {recentProducts.slice(0, displayCount).map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} onNavigate={onNavigate} />
          ))}
        </div>
        
        {displayCount < recentProducts.length && (
          <div className="recent-views-load-more">
            <button 
              className="recent-views-btn" 
              onClick={() => setDisplayCount(prev => prev + 5)}
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
