import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './ContactPage.css';

export default function ContactPage() {
  const { customerInfo } = useAuth();
  const [socialLinks, setSocialLinks] = useState([]);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('general');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (customerInfo) {
      if (!name) setName(customerInfo.firstName + (customerInfo.lastName ? ' ' + customerInfo.lastName : ''));
      if (!email) setEmail(customerInfo.email || '');
      if (!phone) setPhone(customerInfo.phone || '');
    }
  }, [customerInfo]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch(`${import.meta.env.VITE_API_URL}/api/social-media`)
      .then(res => res.json())
      .then(data => setSocialLinks(data))
      .catch(err => console.error('Failed to fetch social media links', err));
  }, []);

  const showStatusWithTimeout = (type, msg) => {
    setStatus({ type, msg });
    setTimeout(() => {
      setStatus({ type: '', msg: '' });
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form Validation
    const errors = {};
    if (!name.trim()) {
      errors.name = 'Full name is required.';
    } else if (name.trim().length < 2) {
      errors.name = 'Please enter a valid full name.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!emailRegex.test(email)) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!message.trim()) {
      errors.message = 'Message is required.';
    } else if (message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters long.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showStatusWithTimeout('error', 'Please correct the highlighted errors.');
      return;
    }
    
    setFormErrors({});
    setIsSubmitting(true);
    setStatus({ type: '', msg: '' });
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, subject, message })
      });
      
      if (response.ok) {
        showStatusWithTimeout('success', 'Thank you! Your message has been sent successfully.');
        setName(customerInfo ? customerInfo.firstName + (customerInfo.lastName ? ' ' + customerInfo.lastName : '') : '');
        setEmail(customerInfo ? customerInfo.email || '' : '');
        setPhone(customerInfo ? customerInfo.phone || '' : '');
        setSubject('general');
        setMessage('');
      } else {
        showStatusWithTimeout('error', 'Failed to send message. Please try again later.');
      }
    } catch (err) {
      showStatusWithTimeout('error', 'Network error. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
            
            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input type="text" id="name" value={name} onChange={e => { setName(e.target.value); setFormErrors(prev => ({...prev, name: ''})); }} placeholder="E.g., Ananya Sharma" required className={formErrors.name ? 'input-error' : ''} />
                {formErrors.name && <span className="field-error-message">{formErrors.name}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input type="email" id="email" value={email} onChange={e => { setEmail(e.target.value); setFormErrors(prev => ({...prev, email: ''})); }} placeholder="ananya@example.com" required className={formErrors.email ? 'input-error' : ''} />
                {formErrors.email && <span className="field-error-message">{formErrors.email}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number (Optional)</label>
                <input type="tel" id="phone" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210" />
              </div>
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <select id="subject" value={subject} onChange={e => setSubject(e.target.value)}>
                  <option value="general">General Inquiry</option>
                  <option value="order">Order Status</option>
                  <option value="bespoke">Bespoke Design Request</option>
                  <option value="partnership">Partnership</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="message">Your Message *</label>
                <textarea id="message" value={message} onChange={e => { setMessage(e.target.value); setFormErrors(prev => ({...prev, message: ''})); }} rows="5" placeholder="How can we assist you today?" required className={formErrors.message ? 'input-error' : ''}></textarea>
                {formErrors.message && <span className="field-error-message">{formErrors.message}</span>}
              </div>
              
              {status.msg && (
                <div className={`contact-status-message ${status.type}`}>
                  {status.msg}
                </div>
              )}

              <button type="submit" className="contact-form__submit" disabled={isSubmitting}>
                <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
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
