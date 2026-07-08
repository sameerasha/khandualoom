import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import './Navbar.css';

export default function Navbar({ onSignUpClick, onCartClick, onContactClick, onNavigate, currentRoute }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileCollectionsOpen, setMobileCollectionsOpen] = useState(false);
  const { totalItems } = useCart();
  const { isCustomerLoggedIn, customerInfo, logout } = useAuth();
  const { categories, badges } = useProducts();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const currentHash = window.location.hash;
    const isOnHome = currentHash === '' || currentHash === '#/' || currentHash === '#';

    if (!isOnHome) {
      onNavigate('');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 250);
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setMenuOpen(false);
  };

  const handleBadgeSelect = (e, badge) => {
    e.preventDefault();
    const currentHash = window.location.hash;
    const isOnHome = currentHash === '' || currentHash === '#/' || currentHash === '#';
    
    const triggerEvent = () => {
      window.dispatchEvent(new CustomEvent('applyFilter', { detail: { type: 'badge', value: badge } }));
      const el = document.getElementById('collections');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    if (!isOnHome) {
      onNavigate('');
      setTimeout(triggerEvent, 250);
    } else {
      triggerEvent();
    }
    setMenuOpen(false);
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`} id="navbar">
      <div className="navbar__inner container">
        {/* Logo redirecting to storefront home */}
        <a href="#" className="navbar__logo" onClick={(e) => { e.preventDefault(); onNavigate(''); }}>
          <span className="navbar__logo-icon">✦</span>
          <span className="navbar__logo-text">
            <span className="navbar__logo-main">Vastra Loom</span>
            <span className="navbar__logo-sub">Handcrafted Heritage</span>
          </span>
        </a>

        {/* Desktop Navigation with custom quick links when logged in */}
        <ul className="navbar__links">
          {isCustomerLoggedIn ? (
            <>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onNavigate(''); }}>Home</a></li>
              <li className="navbar__dropdown">
                <a href="#collections" onClick={(e) => { e.preventDefault(); scrollToSection('collections'); }}>
                  Collections <span className="dropdown-arrow">▼</span>
                </a>
                <ul className="navbar__dropdown-menu">
                  {badges?.map((badge) => (
                    <li key={badge}>
                      <a href={`#collections?badge=${badge}`} onClick={(e) => handleBadgeSelect(e, badge)}>
                        {badge}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
              <li><a href="#profile" onClick={(e) => { e.preventDefault(); onNavigate('profile'); }}>My Profile</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onContactClick(); }}>Contact</a></li>
            </>
          ) : (
            <>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onNavigate(''); }}>Home</a></li>
              <li className="navbar__dropdown">
                <a href="#collections" onClick={(e) => { e.preventDefault(); scrollToSection('collections'); }}>
                  Collections <span className="dropdown-arrow">▼</span>
                </a>
                <ul className="navbar__dropdown-menu">
                  {badges?.map((badge) => (
                    <li key={badge}>
                      <a href={`#collections?badge=${badge}`} onClick={(e) => handleBadgeSelect(e, badge)}>
                        {badge}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
              <li><a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>Our Story</a></li>
              <li><a href="#testimonials" onClick={(e) => { e.preventDefault(); scrollToSection('testimonials'); }}>Testimonials</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onContactClick(); }}>Contact</a></li>
              <li><a href="#admin" onClick={(e) => { e.preventDefault(); onNavigate('admin'); }} id="nav-admin-link">Admin</a></li>
            </>
          )}
        </ul>

        {/* Actions */}
        <div className="navbar__actions">
          <button className="navbar__cart-btn" onClick={onCartClick} id="cart-button" aria-label="Open Cart">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
            </svg>
            {totalItems > 0 && <span className="navbar__cart-badge">{totalItems}</span>}
          </button>

          {isCustomerLoggedIn ? (
            <div className="navbar__user-menu" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button className="navbar__profile-btn" onClick={() => onNavigate('profile')} id="profile-nav-button" style={{
                background: 'none',
                border: '1px solid rgba(195, 162, 126, 0.3)',
                color: '#c3a27e',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}>
                Hi, {customerInfo?.firstName || 'Profile'}
              </button>
              <button className="navbar__logout-btn" onClick={() => { logout(); onNavigate(''); }} id="logout-nav-button" title="Logout" style={{
                background: 'none',
                border: 'none',
                color: '#ef4444',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px',
                transition: 'color 0.2s ease'
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
              </button>
            </div>
          ) : (
            <button className="navbar__signup-btn" onClick={() => onSignUpClick()} id="signin-nav-button">
              Sign In
            </button>
          )}

          {/* Toggle Mobile Menu */}
          <button className="navbar__toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle Navigation">
            <span className={`navbar__toggle-bar ${menuOpen ? 'navbar__toggle-bar--open' : ''}`}></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu with conditional links */}
      <div className={`navbar__mobile-menu ${menuOpen ? 'navbar__mobile-menu--open' : ''}`}>
        <ul>
          {isCustomerLoggedIn ? (
            <>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setMenuOpen(false); onNavigate(''); }}>Home</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setMenuOpen(false); scrollToSection('collections'); }}>Collections</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setMenuOpen(false); onNavigate('profile'); }}>My Profile</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setMenuOpen(false); onContactClick(); }}>Contact Us</a></li>
              <li><a href="#policies" onClick={(e) => { e.preventDefault(); setMenuOpen(false); scrollToSection('policies'); }}>Policies</a></li>
              <li>
                <button className="navbar__signup-btn navbar__signup-btn--mobile" onClick={() => { logout(); setMenuOpen(false); onNavigate(''); }}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setMenuOpen(false); onNavigate(''); }}>Home</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setMenuOpen(false); scrollToSection('collections'); }}>Collections</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setMenuOpen(false); scrollToSection('about'); }}>Our Story</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setMenuOpen(false); scrollToSection('testimonials'); }}>Testimonials</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setMenuOpen(false); onContactClick(); }}>Contact Us</a></li>
              <li><a href="#policies" onClick={(e) => { e.preventDefault(); setMenuOpen(false); scrollToSection('policies'); }}>Policies</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setMenuOpen(false); onNavigate('admin'); }} id="nav-admin-link-mobile">Admin Portal</a></li>
              <li>
                <button className="navbar__signup-btn navbar__signup-btn--mobile" onClick={() => { onSignUpClick(); setMenuOpen(false); }}>
                  Sign In
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
