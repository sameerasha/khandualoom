import { useState, useEffect } from 'react';
import './Footer.css';
import { useAuth } from '../context/AuthContext';
import SocialMediaModal from './SocialMediaModal';

export default function Footer({ onSignUpClick, onContactClick, onNavigate }) {
  const { isCustomerLoggedIn } = useAuth();
  const [socialLinks, setSocialLinks] = useState([]);
  const [selectedSocialLink, setSelectedSocialLink] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8080/api/social-media')
      .then(res => res.json())
      .then(data => setSocialLinks(data))
      .catch(err => console.error('Failed to fetch social media links', err));
  }, []);

  const getIcon = (platform) => {
    switch (platform) {
      case 'facebook': return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>;
      case 'instagram': return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>;
      case 'twitter': return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" /></svg>;
      case 'whatsapp': return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>;
      case 'telegram': return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>;
      case 'youtube': return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>;
      default: return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>;
    }
  };
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
              {socialLinks.length > 0 && (
                socialLinks.map(link => (
                  <button 
                    key={link.id} 
                    aria-label={link.platform} 
                    className="footer__social"
                    onClick={() => setSelectedSocialLink(link)}
                  >
                    {getIcon(link.platform)}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer__section">
            <h4 className="footer__section-title">Quick Links</h4>
            <ul className="footer__links">
              <li><a href="#hero">Home</a></li>
              <li><a href="#collections">Collections</a></li>
              {!isCustomerLoggedIn && (
                <>
                  <li><a href="#about">Our Story</a></li>
                  <li><a href="#testimonials">Testimonials</a></li>
                </>
              )}
              <li><a href="#" onClick={(e) => { e.preventDefault(); onContactClick(); }} id="contact">Contact Us</a></li>
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
          <div className="footer__bottom-links" id="policies">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Shipping Policy</a>
          </div>
        </div>
      </div>
      
      {selectedSocialLink && (
        <SocialMediaModal socialLinks={[selectedSocialLink]} onClose={() => setSelectedSocialLink(null)} />
      )}
    </footer>
  );
}
