import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar({ onSignUpClick, onCartClick, onNavigate }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const { isCustomerLoggedIn, customerInfo, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`} id="navbar">
      <div className="navbar__inner container">
        {/* Logo */}
        <a href="#" className="navbar__logo" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
          <span className="navbar__logo-icon">✦</span>
          <span className="navbar__logo-text">
            <span className="navbar__logo-main">Vastra Loom</span>
            <span className="navbar__logo-sub">Handcrafted Heritage</span>
          </span>
        </a>

        {/* Desktop Navigation */}
        <ul className="navbar__links">
          <li><a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('hero'); }}>Home</a></li>
          <li><a href="#collections" onClick={(e) => { e.preventDefault(); scrollToSection('collections'); }}>Collections</a></li>
          <li><a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>Our Story</a></li>
          <li><a href="#testimonials" onClick={(e) => { e.preventDefault(); scrollToSection('testimonials'); }}>Testimonials</a></li>
          <li><a href="#admin" onClick={(e) => { e.preventDefault(); onNavigate('admin'); }} id="nav-admin-link">Admin</a></li>
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
                Hi, {customerInfo?.username || 'Profile'}
              </button>
              <button className="navbar__logout-btn" onClick={() => { logout(); onNavigate('home'); }} id="logout-nav-button" title="Logout" style={{
                background: 'none',
                border: 'none',
                color: '#ef4444',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '6px'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
                </svg>
              </button>
            </div>
          ) : (
            <button className="navbar__signup-btn" onClick={onSignUpClick} id="signup-nav-button">
              Sign In
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className={`navbar__menu-toggle ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
            id="menu-toggle"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`navbar__mobile-menu ${menuOpen ? 'navbar__mobile-menu--open' : ''}`}>
        <ul>
          <li><a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('hero'); }}>Home</a></li>
          <li><a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('collections'); }}>Collections</a></li>
          <li><a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>Our Story</a></li>
          <li><a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('testimonials'); }}>Testimonials</a></li>
          <li><a href="#" onClick={(e) => { e.preventDefault(); setMenuOpen(false); onNavigate('admin'); }} id="nav-admin-link-mobile">Admin Portal</a></li>
          {isCustomerLoggedIn ? (
            <>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setMenuOpen(false); onNavigate('profile'); }}>My Profile</a></li>
              <li>
                <button className="navbar__signup-btn navbar__signup-btn--mobile" onClick={() => { logout(); setMenuOpen(false); onNavigate('home'); }}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li>
              <button className="navbar__signup-btn navbar__signup-btn--mobile" onClick={() => { onSignUpClick(); setMenuOpen(false); }}>
                Sign In
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
