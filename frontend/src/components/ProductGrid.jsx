import { useState, useEffect } from 'react';
import { useProducts } from '../context/ProductContext';
import ProductCard from './ProductCard';
import './ProductGrid.css';

export default function ProductGrid({ onNavigate }) {
  const { categories, badges, weaves, fabrics } = useProducts();
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeBadge, setActiveBadge] = useState('All');
  const [activeWeave, setActiveWeave] = useState('All');
  const [activeFabric, setActiveFabric] = useState('All');
  const [activeSort, setActiveSort] = useState('id,desc');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [draftFilters, setDraftFilters] = useState({
    category: 'All', badge: 'All', weave: 'All', fabric: 'All', sort: 'id,desc'
  });

  const handleOpenSidebar = () => {
    setDraftFilters({
      category: activeCategory,
      badge: activeBadge,
      weave: activeWeave,
      fabric: activeFabric,
      sort: activeSort
    });
    setIsSidebarOpen(true);
  };

  const handleApplyFilters = () => {
    setActiveCategory(draftFilters.category);
    setActiveBadge(draftFilters.badge);
    setActiveWeave(draftFilters.weave);
    setActiveFabric(draftFilters.fabric);
    setActiveSort(draftFilters.sort);
    setIsSidebarOpen(false);
  };
  
  const handleClearDraftFilters = () => {
    setDraftFilters({
      category: 'All', badge: 'All', weave: 'All', fabric: 'All', sort: 'id,desc'
    });
  };

  const handleClearAllAndFetch = () => {
    setActiveCategory('All');
    setActiveBadge('All');
    setActiveWeave('All');
    setActiveFabric('All');
    setActiveSort('id,desc');
  };

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const fetchProducts = async (currentPage, currentFilters) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage,
        size: 8,
        sort: currentFilters.sort
      });
      if (currentFilters.category !== 'All') params.append('category', currentFilters.category);
      if (currentFilters.badge !== 'All') params.append('badge', currentFilters.badge);
      if (currentFilters.weave !== 'All') params.append('weave', currentFilters.weave);
      if (currentFilters.fabric !== 'All') params.append('fabric', currentFilters.fabric);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/paged?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (currentPage === 0) {
          setFilteredProducts(data.content);
        } else {
          setFilteredProducts(prev => [...prev, ...data.content]);
        }
        setIsLastPage(data.last);
      }
    } catch (e) {
      console.error('Failed to load paged products:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setPage(0);
    fetchProducts(0, { category: activeCategory, badge: activeBadge, weave: activeWeave, fabric: activeFabric, sort: activeSort });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory, activeBadge, activeWeave, activeFabric, activeSort]);

  useEffect(() => {
    const handleApplyFilter = (e) => {
      const { type, value } = e.detail;
      if (type === 'badge') {
        setActiveCategory('All');
        setActiveWeave('All');
        setActiveFabric('All');
        setActiveSort('id,desc');
        setActiveBadge(value);
      }
      if (type === 'category') {
        setActiveBadge('All');
        setActiveWeave('All');
        setActiveFabric('All');
        setActiveSort('id,desc');
        setActiveCategory(value);
      }
    };
    
    // Legacy support for selectCategory from previous version
    const handleCategorySelect = (e) => {
      setActiveCategory(e.detail);
    };

    window.addEventListener('applyFilter', handleApplyFilter);
    window.addEventListener('selectCategory', handleCategorySelect);
    
    return () => {
      window.removeEventListener('applyFilter', handleApplyFilter);
      window.removeEventListener('selectCategory', handleCategorySelect);
    };
  }, []);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProducts(nextPage, { category: activeCategory, badge: activeBadge, weave: activeWeave, fabric: activeFabric, sort: activeSort });
  };

  return (
    <section className="products-section" id="collections">
      <div className="container">
        {/* Header */}
        <div className="products-section__header">
          <span className="products-section__label">Our Collections</span>
          <h2 className="section-title">
            Curated <span className="gold-text">Masterpieces</span>
          </h2>
          <p className="section-subtitle">
            Each saree is a canvas of tradition — handwoven by artisans who have inherited centuries of craftsmanship
          </p>
          <hr className="divider" style={{ margin: '1rem auto 0' }} />
        </div>

        {/* Desktop Category Filter & Mobile Filter Toggle */}
        <div className="products-section__filters-header">
          <button className="products-section__filter-toggle-btn" onClick={handleOpenSidebar}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line>
              <line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line>
              <line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line>
              <line x1="17" y1="16" x2="23" y2="16"></line>
            </svg>
            Filters
          </button>
          
          <div className="products-section__filters">
            {badges.map((b) => (
              <button
                key={b}
                className={`products-section__filter-btn ${activeBadge === b ? 'products-section__filter-btn--active' : ''}`}
                onClick={() => {
                  setActiveCategory('All');
                  setActiveWeave('All');
                  setActiveFabric('All');
                  setActiveSort('id,desc');
                  setActiveBadge(b);
                }}
                id={`filter-${b.toLowerCase().replace(' ', '-')}`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Filter Sidebar */}
        <div className={`filter-sidebar-overlay ${isSidebarOpen ? 'filter-sidebar-overlay--open' : ''}`} onClick={() => setIsSidebarOpen(false)}></div>
        <div className={`filter-sidebar ${isSidebarOpen ? 'filter-sidebar--open' : ''}`}>
          <div className="filter-sidebar__header">
            <h3>Filters</h3>
            <button className="filter-sidebar__close" onClick={() => setIsSidebarOpen(false)}>✕</button>
          </div>
          <div className="filter-sidebar__top-actions" style={{ padding: '0 var(--space-lg)', display: 'flex', justifyContent: 'flex-end' }}>
            <button className="filter-sidebar__clear-btn" onClick={handleClearDraftFilters}>Clear All</button>
          </div>
          <div className="filter-sidebar__content">
            {/* Sort */}
            <div className="filter-group">
              <h4>Sort By</h4>
              <select value={draftFilters.sort} onChange={(e) => setDraftFilters({...draftFilters, sort: e.target.value})} className="filter-select">
                <option value="id,desc">Newest Arrivals</option>
                <option value="price,asc">Price: Low to High</option>
                <option value="price,desc">Price: High to Low</option>
                <option value="rating,desc">Top Rated</option>
              </select>
            </div>
            
            {/* Badges */}
            <div className="filter-group">
              <h4>Collection</h4>
              <div className="filter-chips">
                {badges.map(b => (
                  <button key={b} className={`filter-chip ${draftFilters.badge === b ? 'active' : ''}`} onClick={() => setDraftFilters({...draftFilters, badge: b})}>
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="filter-group">
              <h4>Category</h4>
              <div className="filter-chips">
                {categories.map(c => (
                  <button key={c} className={`filter-chip ${draftFilters.category === c ? 'active' : ''}`} onClick={() => setDraftFilters({...draftFilters, category: c})}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Weaves */}
            <div className="filter-group">
              <h4>Weave</h4>
              <div className="filter-chips">
                {weaves.map(w => (
                  <button key={w} className={`filter-chip ${draftFilters.weave === w ? 'active' : ''}`} onClick={() => setDraftFilters({...draftFilters, weave: w})}>
                    {w}
                  </button>
                ))}
              </div>
            </div>

            {/* Fabrics */}
            <div className="filter-group">
              <h4>Fabric</h4>
              <div className="filter-chips">
                {fabrics.map(f => (
                  <button key={f} className={`filter-chip ${draftFilters.fabric === f ? 'active' : ''}`} onClick={() => setDraftFilters({...draftFilters, fabric: f})}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="filter-sidebar__footer">
            <button className="filter-sidebar__apply" onClick={handleApplyFilters}>Apply Filters</button>
          </div>
        </div>

        {/* Product Grid or Empty State */}
        {!isLoading && filteredProducts.length === 0 ? (
          <div className="products-section__empty">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <h3>No masterpieces found</h3>
            <p>We couldn't find any sarees matching your selected filters.</p>
            <button className="products-section__clear-filters-btn" onClick={handleClearAllAndFetch}>
              Clear Filters & Browse More
            </button>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product, index) => (
              <ProductCard key={`${product.id}-${index}`} product={product} index={index} onNavigate={onNavigate} />
            ))}
          </div>
        )}

        {/* Load More Button */}
        {!isLastPage && (
          <div className="load-more-container">
            <button className="load-more-btn" onClick={loadMore} disabled={isLoading}>
              {isLoading ? (
                <>
                  <svg className="spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Weaving...
                </>
              ) : (
                'Load More Masterpieces'
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
