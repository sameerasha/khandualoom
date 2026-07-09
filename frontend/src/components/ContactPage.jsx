import React, { useEffect, useState } from 'react';
import './ContactPage.css';

export default function ContactPage() {
  const [socialLinks, setSocialLinks] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch(`${import.meta.env.VITE_API_URL}/api/social-media`)
      .then(res => res.json())
      .then(data => setSocialLinks(data))
      .catch(err => console.error('Failed to fetch social media links', err));
  }, []);

  return (
    <div className="contact-page">
      <div className="contact-page__hero">
        <div className="container">
          <h1 className="contact-page__title">Get in Touch</h1>
          <p className="contact-page__subtitle">
            We would love to hear from you. Reach out for bespoke orders, support, or general inquiries about our handloom heritage.
          </p>
        </div>
      </div>

      <div className="container contact-page__content">
        <div className="contact-page__grid">
          
          {/* Left Column: Contact Info Cards */}
          <div className="contact-page__info">
            <div className="contact-card">
              <div className="contact-card__icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <div className="contact-card__details">
                <h3>Headquarters</h3>
                <p>Vastra Loom Boutique<br/>Plot No. 42, Silk Weavers District<br/>Kanchipuram, Tamil Nadu 631501, India</p>
              </div>
            </div>

            <div className="contact-card">
              <div className="contact-card__icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <div className="contact-card__details">
                <h3>Direct Contact</h3>
                <p>Mon - Sat, 9:00 AM to 7:00 PM (IST)<br/><strong>+91 98765 43210</strong></p>
              </div>
            </div>

            <div className="contact-card">
              <div className="contact-card__icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <div className="contact-card__details">
                <h3>Email Support</h3>
                <p>General: <strong>care@vastraloom.com</strong><br/>Business: <strong>partner@vastraloom.com</strong></p>
              </div>
            </div>

            {socialLinks.length > 0 && (
              <div className="contact-card">
                <div className="contact-card__icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </div>
                <div className="contact-card__details">
                  <h3>Connect with Us</h3>
                  <div className="contact-page__socials">
                    {socialLinks.map(link => {
                      let href = link.url;
                      if (link.platform === 'whatsapp') {
                        const cleaned = link.url.replace(/[^0-9]/g, '');
                        if (cleaned.length >= 10) href = `https://wa.me/${cleaned}`;
                      } else if (!link.url.startsWith('http')) {
                        href = `https://${link.url}`;
                      }
                      return (
                        <a key={link.id} href={href} target="_blank" rel="noopener noreferrer" className="contact-page__social-link">
                          {link.platform}
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Contact Form */}
          <div className="contact-page__form-container">
            <h2 className="contact-page__form-title">Send us a Message</h2>
            <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input type="text" id="name" placeholder="E.g., Ananya Sharma" />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" placeholder="ananya@example.com" />
              </div>
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <select id="subject">
                  <option value="general">General Inquiry</option>
                  <option value="order">Order Status</option>
                  <option value="bespoke">Bespoke Design Request</option>
                  <option value="partnership">Partnership</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="message">Your Message</label>
                <textarea id="message" rows="5" placeholder="How can we assist you today?"></textarea>
              </div>
              <button type="submit" className="contact-form__submit">
                <span>Send Message</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </form>
          </div>
          
        </div>
      </div>
    </div>
  );
}
