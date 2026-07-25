import { useState, useEffect, useRef } from 'react';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import ProductCard from './ProductCard';
import './ProductDetails.css';

export default function ProductDetails({ productId, onNavigate, onCheckout }) {
  const { products } = useProducts();
  const { cartItems, addToCart, setIsCartOpen } = useCart();
  const { isCustomerLoggedIn, customerInfo } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [images, setImages] = useState([]);
  const [activeImage, setActiveImage] = useState('');

  const [zoomStyle, setZoomStyle] = useState({
    transformOrigin: 'center center',
    transform: 'scale(1)'
  });
  const [mobileZoomed, setMobileZoomed] = useState(false);
  const lastTap = useRef(0);

  // Discover More State
  const [discoverProductsPool, setDiscoverProductsPool] = useState([]);
  const [discoverDisplayCount, setDiscoverDisplayCount] = useState(9);
  const [loadingDiscover, setLoadingDiscover] = useState(false);

  const fetchDiscoverProducts = (currentProdId = productId) => {
    setLoadingDiscover(true);
    fetch(`${import.meta.env.VITE_API_URL}/api/products/paged?page=0&size=21`)
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Failed to load paged products');
      })
      .then(data => {
        if (data && data.content) {
          const filtered = data.content.filter(p => p.id !== currentProdId).slice(0, 20);
          setDiscoverProductsPool(filtered);
          setDiscoverDisplayCount(9);
        }
      })
      .catch(err => console.error('Failed to load discover products', err))
      .finally(() => setLoadingDiscover(false));
  };

  useEffect(() => {
    // Reset state when product ID changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setLoading(true);
    setProduct(null);
    setRelatedProducts([]);

    // Try finding locally first
    const localProduct = products.find((p) => p.id === productId);
    if (localProduct) {
      setProduct(localProduct);
      setLoading(false);
    } else {
      // Fallback API call
      fetch(`${import.meta.env.VITE_API_URL}/api/products/${productId}`)
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error('Product not found');
        })
        .then((data) => {
          setProduct(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Failed to load product:', err);
          setLoading(false);
        });
    }

    // Fetch related products
    fetch(`${import.meta.env.VITE_API_URL}/api/products/${productId}/related`)
      .then((res) => {
        if (res.ok) return res.json();
        return [];
      })
      .then((data) => {
        setRelatedProducts(data);
      })
      .catch((err) => {
        console.error('Failed to fetch related products:', err);
      });

    // Reset and fetch Discover More products
    setDiscoverDisplayCount(9);
    fetchDiscoverProducts(productId);
  }, [productId, products]);



  // Track product view if customer is logged in
  useEffect(() => {
    if (!productId || !isCustomerLoggedIn || !customerInfo?.id) return;
    
    fetch(`${import.meta.env.VITE_API_URL}/api/products/${productId}/view?userId=${customerInfo.id}`, {
      method: 'POST',
    }).catch(err => console.error('Failed to track view', err));

  }, [productId, isCustomerLoggedIn, customerInfo]);



  const handleLoadMoreDiscover = () => {
    setDiscoverDisplayCount(prev => Math.min(prev + 9, 27));
  };

  const displayedDiscoverProducts = discoverProductsPool.slice(0, discoverDisplayCount);
  const hasMoreDiscover = discoverDisplayCount < discoverProductsPool.length;

  // Set up specific gallery images or generate fallback views
  useEffect(() => {
    if (product) {
      let gallery = [];
      if (product.images && product.images.length > 0) {
        // Deduplicate and ensure main image is always first
        gallery = Array.from(new Set([
          product.image,
          ...product.images
        ])).filter((img) => img && img.trim() !== '');
      } else {
        // Fallback generator
        const otherImages = [
          '/images/saree_purple_gold.png',
          '/images/saree_crimson_red.png',
          '/images/saree_emerald_green.png',
          '/images/saree_navy_blue.png',
          '/images/saree_saffron_orange.png',
          '/images/saree_blush_pink.png',
        ].filter((img) => img !== product.image);

        gallery = [
          product.image,
          otherImages[0] || '/images/saree_purple_gold.png',
          otherImages[1] || '/images/saree_crimson_red.png',
          otherImages[2] || '/images/saree_emerald_green.png',
        ];
      }
      setImages(gallery);
      setActiveImage(product.image);
    }
  }, [product]);

  const longPressTimer = useRef(null);

  const startLongPress = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
    longPressTimer.current = setTimeout(() => {
      setIsLightboxOpen(true);
      longPressTimer.current = null;
    }, 500);
  };

  const cancelLongPress = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  // Desktop Hover
  const handleMouseMove = (e) => {
    if (mobileZoomed) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${Math.max(0, Math.min(100, x))}% ${Math.max(0, Math.min(100, y))}%`,
      transform: 'scale(2.5)'
    });
  };

  const handleMouseLeave = () => {
    cancelLongPress();
    if (mobileZoomed) return;
    setZoomStyle({
      transformOrigin: 'center center',
      transform: 'scale(1)'
    });
  };

  // Mobile Double Tap & Pan
  const handleTouchStart = (e) => {
    startLongPress();

    const now = Date.now();
    if (now - lastTap.current < 300) {
      // Double tap detected!
      cancelLongPress();
      
      // Compute safe values synchronously to avoid React synthetic event pooling / async crashes
      const touch = e.touches[0];
      const rect = e.currentTarget.getBoundingClientRect();
      
      setMobileZoomed(prev => {
        const nextZoomed = !prev;
        if (!nextZoomed) {
          setZoomStyle({ transformOrigin: 'center center', transform: 'scale(1)' });
        } else {
          if (touch && rect) {
            const x = ((touch.clientX - rect.left) / rect.width) * 100;
            const y = ((touch.clientY - rect.top) / rect.height) * 100;
            setZoomStyle({
              transformOrigin: `${Math.max(0, Math.min(100, x))}% ${Math.max(0, Math.min(100, y))}%`,
              transform: 'scale(2.5)'
            });
          }
        }
        return nextZoomed;
      });
      lastTap.current = 0;
    } else {
      lastTap.current = now;
    }
  };

  const handleTouchMove = (e) => {
    cancelLongPress(); // Cancel long press if they start dragging

    if (!mobileZoomed) return;
    const touch = e.touches[0];
    if (touch) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((touch.clientX - rect.left) / rect.width) * 100;
      const y = ((touch.clientY - rect.top) / rect.height) * 100;
      setZoomStyle({
        transformOrigin: `${Math.max(0, Math.min(100, x))}% ${Math.max(0, Math.min(100, y))}%`,
        transform: 'scale(2.5)'
      });
    }
  };



  const isAdded = product ? cartItems.some(item => item.id === product.id) : false;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (product) {
      if (isAdded) {
        setIsCartOpen(true);
      } else {
        addToCart(product);
      }
    }
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (product) {
      if (!isAdded) {
        addToCart(product);
      }
      
      // Trigger the standard app checkout flow
      if (onCheckout) {
        onCheckout();
      } else {
        // Fallback if prop not provided
        if (!isCustomerLoggedIn) {
          sessionStorage.setItem('redirectAfterAuth', 'checkout');
          setIsCartOpen(true); // Open cart as fallback
        } else {
          onNavigate('checkout');
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="product-details-loading">
        <div className="spinner"></div>
        <p>Loading masterpiece details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-details-error">
        <h2>Weave Not Found</h2>
        <p>The saree collection item you are looking for does not exist or has been archived.</p>
        <button onClick={() => onNavigate('')} className="back-home-btn">Return to Catalog</button>
      </div>
    );
  }

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <div className="product-details-page">
      <div className="container">
        {/* Breadcrumb Navigation */}
        <div className="product-details-breadcrumb">
          <span onClick={() => onNavigate('')} className="breadcrumb-link">Home</span>
          <span className="breadcrumb-separator">/</span>
          <span onClick={() => onNavigate('')} className="breadcrumb-link">Collections</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{product.name}</span>
        </div>

        <button onClick={() => onNavigate('')} className="product-details-back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Collections
        </button>

        {/* Details Grid */}
        <div className="product-details-grid">
          
          {/* Left Column: Image Gallery */}
          <div className="product-gallery">
            <div className="product-gallery__thumbnails">
              {images.map((img, i) => (
                <div 
                  key={i} 
                  className={`product-gallery__thumb ${activeImage === img ? 'active' : ''}`}
                  onMouseEnter={() => setActiveImage(img)}
                  onClick={() => setActiveImage(img)}
                >
                  <img src={img} alt={`View angle ${i + 1}`} />
                </div>
              ))}
            </div>
            
            <div 
              className="product-gallery__main-wrap"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onMouseDown={startLongPress}
              onMouseUp={cancelLongPress}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={cancelLongPress}
              onTouchCancel={cancelLongPress}
              style={{ touchAction: mobileZoomed ? 'none' : 'auto' }}
            >
              <img 
                src={activeImage} 
                alt={product.name} 
                className="product-gallery__main-image"
                style={zoomStyle}
                draggable="false"
              />
              <span className="zoom-hint">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  <line x1="11" y1="8" x2="11" y2="14"></line>
                  <line x1="8" y1="11" x2="14" y2="11"></line>
                </svg>
                {mobileZoomed ? 'Double-tap to Zoom Out' : 'Hover / Double-tap to Zoom'}
              </span>
            </div>
          </div>

          {/* Right Column: Specifications & Checkout info */}
          <div className="product-info-panel">
            <div className="product-info-panel__category">{product.category} Collection</div>
            <h1 className="product-info-panel__name">{product.name}</h1>
            
            {/* Reviews / Stars */}
            <div className="product-info-panel__rating">
              <div className="stars">
                {Array.from({ length: 5 }, (_, i) => (
                  <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={i < Math.floor(product.rating) ? 'var(--color-accent)' : 'none'} stroke="var(--color-accent)" strokeWidth="1.5">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <span className="rating-val">{product.rating}</span>
              <span className="separator">|</span>
              <span className="reviews-count">{product.reviews} Verified Reviews</span>
            </div>

            {/* Prices & Badges */}
            <div className="product-info-panel__price-row">
              <div className="price-box">
                <span className="price-current">₹{product.price.toLocaleString('en-IN')}</span>
                <span className="price-original">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                <span className="discount-badge">-{discount}% Off</span>
              </div>
              <span className={`badge badge--${product.badge.toLowerCase().replace(' ', '-')}`}>
                {product.badge}
              </span>
            </div>

            {/* Description */}
            <p className="product-info-panel__desc">{product.description}</p>

            {/* Actions */}
            <div className="product-info-panel__actions">
              <button 
                onClick={handleAddToCart} 
                className={`add-to-cart-btn ${isAdded ? 'added' : ''}`}
              >
                {isAdded ? (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Go to Cart
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="9" cy="21" r="1"></circle>
                      <circle cx="20" cy="21" r="1"></circle>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    Add to Cart
                  </>
                )}
              </button>
              <button 
                onClick={handleBuyNow}
                className="buy-now-btn"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                </svg>
                Buy Now
              </button>
            </div>

            {/* Saree Details Table */}
            <div className="product-specs">
              <h3>Specification Details</h3>
              <table className="specs-table">
                <tbody>
                  <tr>
                    <td>Fabric Material</td>
                    <td>{product.fabric}</td>
                  </tr>
                  <tr>
                    <td>Weaving Technique</td>
                    <td>{product.weave}</td>
                  </tr>
                  <tr>
                    <td>Color Shade</td>
                    <td>{product.color}</td>
                  </tr>
                  <tr>
                    <td>Standard Length</td>
                    <td>5.5 Meters + 0.8 Meter unstitched blouse piece</td>
                  </tr>
                  <tr>
                    <td>Care Instructions</td>
                    <td>Dry Clean Only (recommended for fine silk)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Free Shipping & Policies */}
            <div className="shipping-highlights">
              <div className="highlight-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="3" width="15" height="13"></rect>
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                  <circle cx="5.5" cy="18.5" r="2.5"></circle>
                  <circle cx="18.5" cy="18.5" r="2.5"></circle>
                </svg>
                <span>Free Insured Shipping across India</span>
              </div>
              <div className="highlight-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <span>100% Authentic Handloom Mark Certified</span>
              </div>
              <div className="highlight-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 4 23 10 17 10"></polyline>
                  <path d="M23 10a10 10 0 1 1-3.79-5.79L23 10z"></path>
                </svg>
                <span>7-Day Hassle Free Returns & Exchanges</span>
              </div>
            </div>

          </div>
        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="product-details__related">
            <h2 className="related-title">Related Masterpieces</h2>
            <div className="products-grid">
              {relatedProducts.map((p, i) => (
                <ProductCard key={`related-${p.id}-${i}`} product={p} index={i} onNavigate={onNavigate} />
              ))}
            </div>
          </div>
        )}

        {/* Discover More Feed */}
        {displayedDiscoverProducts && displayedDiscoverProducts.length > 0 && (
          <div className="product-details__discover" style={{ marginTop: '60px', paddingBottom: '40px' }}>
            <h2 className="related-title">Discover More</h2>
            <div className="products-grid">
              {displayedDiscoverProducts.map((p, i) => (
                <ProductCard key={`discover-${p.id}-${i}`} product={p} index={i} onNavigate={onNavigate} />
              ))}
            </div>
            {hasMoreDiscover && (
              <div className="load-more-container" style={{ textAlign: 'center', marginTop: '40px' }}>
                <button 
                  className="btn-load-more" 
                  onClick={handleLoadMoreDiscover}
                  disabled={loadingDiscover}
                  style={{ 
                    padding: '12px 32px', 
                    background: 'transparent', 
                    border: '1px solid #c3a27e', 
                    color: '#c3a27e', 
                    borderRadius: '8px', 
                    cursor: loadingDiscover ? 'not-allowed' : 'pointer', 
                    fontWeight: '600',
                    fontSize: '15px',
                    transition: 'all 0.3s ease',
                    opacity: loadingDiscover ? 0.6 : 1
                  }}
                  onMouseEnter={(e) => {
                    if(!loadingDiscover) {
                      e.currentTarget.style.background = '#c3a27e';
                      e.currentTarget.style.color = '#06070a';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if(!loadingDiscover) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#c3a27e';
                    }
                  }}
                >
                  {loadingDiscover ? 'Loading Masterpieces...' : 'Load More Options'}
                </button>
              </div>
            )}
          </div>
        )}

      </div>
      
      {/* Fullscreen Image Lightbox */}
      {isLightboxOpen && (
        <div className="product-lightbox" onClick={() => setIsLightboxOpen(false)}>
          <button className="product-lightbox__close" onClick={() => setIsLightboxOpen(false)}>&times;</button>
          <div 
            className="product-lightbox__image-container"
            onClick={(e) => e.stopPropagation()}
          >
            <TransformWrapper
              initialScale={1}
              minScale={1}
              maxScale={4}
              doubleClick={{ mode: "toggle" }}
              wheel={{ step: 0.1 }}
            >
              <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }}>
                <img 
                  src={activeImage} 
                  alt={product.name} 
                  className="product-lightbox__image" 
                  draggable="false"
                />
              </TransformComponent>
            </TransformWrapper>
          </div>
        </div>
      )}
    </div>
  );
}
