import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import './Hero.css';

export default function Hero({ onSignUpClick }) {
  const heroRef = useRef(null);
  const { isCustomerLoggedIn } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;
      const scrollY = window.scrollY;
      const parallaxElements = heroRef.current.querySelectorAll('.hero__parallax');
      parallaxElements.forEach((el) => {
        const speed = parseFloat(el.dataset.speed) || 0.3;
        el.style.transform = `translateY(${scrollY * speed}px)`;
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToCollections = () => {
    document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero" id="hero" ref={heroRef}>
      {/* Background */}
      <div className="hero__bg">
        <div className="hero__bg-image hero__parallax" data-speed="0.2">
          <img src={isCustomerLoggedIn ? "/images/hero_banner_loggedin.png" : "/images/hero_banner.png"} alt="Handloom Weaving" />
        </div>
        <div className="hero__bg-overlay"></div>
        <div className="hero__bg-grain"></div>
      </div>

      {/* Floating Decorative Elements */}
      <div className="hero__decor">
        <div className="hero__decor-circle hero__decor-circle--1"></div>
        <div className="hero__decor-circle hero__decor-circle--2"></div>
        <div className="hero__decor-line hero__decor-line--1"></div>
        <div className="hero__decor-line hero__decor-line--2"></div>
      </div>

      {/* Content */}
      <div className="hero__content container">
        <div className="hero__badge animate-fade-in-down">
          <span className="hero__badge-dot"></span>
          Handcrafted with Love since 1947
        </div>

        <h1 className="hero__title animate-fade-in-up">
          <span className="hero__title-line">Where Every Thread</span>
          <span className="hero__title-line hero__title-line--accent">
            <span className="gold-text">Tells a Story</span>
          </span>
        </h1>

        <p className="hero__subtitle animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          Discover the timeless elegance of India's finest handloom sarees — 
          each piece a masterwork of tradition, artistry, and heritage woven by master artisans.
        </p>

        <div className="hero__actions animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <button className="hero__cta hero__cta--primary" onClick={scrollToCollections} id="explore-collections-btn">
            <span>Explore Collections</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
          {!isCustomerLoggedIn && (
            <button className="hero__cta hero__cta--secondary" onClick={onSignUpClick} id="join-now-btn">
              <span className="hero__cta-text--desktop">Join the Tradition</span>
              <span className="hero__cta-text--mobile">Sign In</span>
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="hero__stats animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <div className="hero__stat">
            <span className="hero__stat-number">75+</span>
            <span className="hero__stat-label">Years of Heritage</span>
          </div>
          <div className="hero__stat-divider"></div>
          <div className="hero__stat">
            <span className="hero__stat-number">500+</span>
            <span className="hero__stat-label">Master Artisans</span>
          </div>
          <div className="hero__stat-divider"></div>
          <div className="hero__stat">
            <span className="hero__stat-number">10K+</span>
            <span className="hero__stat-label">Happy Customers</span>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="hero__scroll" onClick={scrollToCollections}>
        <div className="hero__scroll-line"></div>
        <span className="hero__scroll-text">Scroll to Discover</span>
      </div>
    </section>
  );
}
