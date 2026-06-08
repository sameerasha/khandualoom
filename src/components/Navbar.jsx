import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import './Navbar.css';

export default function Navbar({ onSignUpClick, onCartClick }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalItems } = useCart();

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

          <button className="navbar__signup-btn" onClick={onSignUpClick} id="signup-nav-button">
            Sign Up
          </button>

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
          <li>
            <button className="navbar__signup-btn navbar__signup-btn--mobile" onClick={() => { onSignUpClick(); setMenuOpen(false); }}>
              Sign Up
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
