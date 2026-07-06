import './Footer.css';

export default function Footer({ onSignUpClick, onNavigate }) {
  return (
    <footer className="footer" id="footer">
      <div className="footer__top-border"></div>
      <div className="container">
        <div className="footer__grid">
          {/* Brand */}
          <div className="footer__brand">
            <div className="footer__logo">
              <span className="footer__logo-icon">✦</span>
              <div>
                <span className="footer__logo-main">Vastra Loom</span>
                <span className="footer__logo-sub">Handcrafted Heritage</span>
              </div>
            </div>
            <p className="footer__description">
              Preserving India's rich handloom heritage by connecting master artisans 
              with discerning connoisseurs worldwide.
            </p>
            <div className="footer__socials">
              <a href="#" aria-label="Instagram" className="footer__social">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
              </a>
              <a href="#" aria-label="Facebook" className="footer__social">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>
              </a>
              <a href="#" aria-label="Twitter" className="footer__social">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" /></svg>
              </a>
              <a href="#" aria-label="Pinterest" className="footer__social">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.236 2.636 7.855 6.356 9.312-.088-.791-.167-2.005.035-2.868.182-.78 1.172-4.97 1.172-4.97s-.299-.598-.299-1.482c0-1.388.806-2.425 1.808-2.425.853 0 1.265.64 1.265 1.408 0 .858-.546 2.14-.828 3.33-.236.995.5 1.807 1.48 1.807 1.778 0 3.144-1.874 3.144-4.58 0-2.393-1.72-4.068-4.177-4.068-2.845 0-4.515 2.135-4.515 4.34 0 .859.331 1.781.745 2.282a.3.3 0 01.069.288l-.278 1.133c-.044.183-.145.222-.335.134-1.249-.581-2.03-2.407-2.03-3.874 0-3.154 2.292-6.052 6.608-6.052 3.469 0 6.165 2.473 6.165 5.776 0 3.447-2.173 6.22-5.19 6.22-1.013 0-1.965-.527-2.291-1.148l-.623 2.378c-.226.869-.835 1.958-1.244 2.621.937.29 1.931.446 2.962.446 5.523 0 10-4.477 10-10S17.523 2 12 2z" /></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer__section">
            <h4 className="footer__section-title">Quick Links</h4>
            <ul className="footer__links">
              <li><a href="#hero">Home</a></li>
              <li><a href="#collections">Collections</a></li>
              <li><a href="#about">Our Story</a></li>
              <li><a href="#testimonials">Testimonials</a></li>
              <li><a href="#admin" onClick={(e) => { e.preventDefault(); onNavigate('admin'); }} id="footer-admin-link">Admin Portal</a></li>
            </ul>
          </div>

          {/* Collections */}
          <div className="footer__section">
            <h4 className="footer__section-title">Collections</h4>
            <ul className="footer__links">
              <li><a href="#collections">Banarasi Silk</a></li>
              <li><a href="#collections">Kanjeevaram</a></li>
              <li><a href="#collections">Chanderi</a></li>
              <li><a href="#collections">Patola</a></li>
              <li><a href="#collections">Tussar Silk</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="footer__section">
            <h4 className="footer__section-title">Stay Connected</h4>
            <p className="footer__newsletter-text">
              Join our newsletter for exclusive previews, artisan stories, and special offers.
            </p>
            <button className="footer__newsletter-btn" onClick={onSignUpClick} id="footer-signup">
              <span>Sign Up Now</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Bottom */}
        <div className="footer__bottom">
          <p className="footer__copyright">
            © 2026 Vastra Loom. All rights reserved. Handcrafted with ❤ in India.
          </p>
          <div className="footer__bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Shipping Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
