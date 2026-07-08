import { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import './ProductGrid.css';

export default function ProductCard({ product, index, onNavigate }) {
  const { cartItems, addToCart, setIsCartOpen } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  const isAdded = cartItems.some((item) => item.id === product.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (isAdded) {
      setIsCartOpen(true);
    } else {
      addToCart(product);
    }
  };

  const handleCardClick = () => {
    if (onNavigate) {
      onNavigate(`product/${product.id}`);
    }
  };

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <div
      className={`product-card reveal reveal-delay-${(index % 4) + 1}`}
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
      style={{ cursor: 'pointer' }}
      id={`product-card-${product.id}`}
    >
      {/* Image Container */}
      <div className="product-card__image-wrap">
        <img
          src={product.image}
          alt={product.name}
          className={`product-card__image ${isHovered ? 'product-card__image--zoomed' : ''}`}
          loading="lazy"
        />
        <div className="product-card__image-overlay"></div>

        {/* Badge */}
        <span className={`product-card__badge product-card__badge--${product.badge.toLowerCase().replace(' ', '-')}`}>
          {product.badge}
        </span>

        {/* Discount Badge */}
        <span className="product-card__discount">-{discount}%</span>

        {/* Quick Actions */}
        <div className={`product-card__quick-actions ${isHovered ? 'product-card__quick-actions--visible' : ''}`}>
          <button
            className={`product-card__add-btn ${isAdded ? 'product-card__add-btn--added' : ''}`}
            onClick={handleAddToCart}
            id={`add-to-cart-${product.id}`}
          >
            {isAdded ? (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Go to Cart</span>
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
                </svg>
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="product-card__info">
        <div className="product-card__category">{product.category}</div>
        <h3 className="product-card__name">{product.name}</h3>
        <p className="product-card__description">{product.description}</p>

        {/* Rating */}
        <div className="product-card__rating">
          <div className="product-card__stars">
            {Array.from({ length: 5 }, (_, i) => (
              <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i < Math.floor(product.rating) ? 'var(--color-accent)' : 'none'} stroke="var(--color-accent)" strokeWidth="1.5">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            ))}
          </div>
          <span className="product-card__rating-text">{product.rating} ({product.reviews})</span>
        </div>

        {/* Details */}
        <div className="product-card__details">
          <span className="product-card__detail">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.38 3.46 16 2 12 5.27 8 2 3.62 3.46 2 8l3.27 4L2 16l1.62 4.54L8 22l4-3.27L16 22l4.38-1.46L22 16l-3.27-4L22 8Z" />
            </svg>
            {product.fabric}
          </span>
          <span className="product-card__detail">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
            </svg>
            {product.weave}
          </span>
        </div>

        {/* Price */}
        <div className="product-card__price-row">
          <div className="product-card__price">
            <span className="product-card__price-current">₹{product.price.toLocaleString('en-IN')}</span>
            <span className="product-card__price-original">₹{product.originalPrice.toLocaleString('en-IN')}</span>
          </div>
          <button
            className={`product-card__cart-btn-sm ${isAdded ? 'product-card__cart-btn-sm--added' : ''}`}
            onClick={handleAddToCart}
            aria-label="Add to cart"
          >
            {isAdded ? '✓' : '+'}
          </button>
        </div>
      </div>
    </div>
  );
}
