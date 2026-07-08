import React, { useEffect, useState } from 'react';
import './SocialMediaModal.css';

export default function SocialMediaModal({ socialLinks, onClose }) {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Disable scrolling when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300); // match animation duration
  };

  const renderIcon = (platform) => {
    switch (platform) {
      case 'facebook':
        return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>;
      case 'instagram':
        return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>;
      case 'twitter':
        return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>;
      case 'whatsapp':
        return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>;
      case 'telegram':
        return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>;
      case 'youtube':
        return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>;
      default:
        return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>;
    }
  };

  const getHref = (link) => {
    if (link.platform === 'whatsapp') {
      const cleaned = link.url.replace(/[^0-9]/g, '');
      if (cleaned.length >= 10) {
        return `https://wa.me/${cleaned}`;
      }
    }
    if (!link.url.startsWith('http')) {
      return `https://${link.url}`;
    }
    return link.url;
  };

  return (
    <div className={`social-modal-overlay ${isClosing ? 'social-modal-overlay--closing' : ''}`} onClick={handleClose}>
      <div className="social-modal" onClick={e => e.stopPropagation()}>
        <button className="social-modal__close" onClick={handleClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
        <h2 className="social-modal__title">Connect with Us</h2>
        <p className="social-modal__subtitle">Follow our official channels for updates and support.</p>
        
        <div className="social-modal__links">
          {socialLinks.map(link => (
            <div key={link.id} className="social-modal__card">
              <div className="social-modal__card-header">
                <div className={`social-modal__icon social-modal__icon--${link.platform}`}>
                  {renderIcon(link.platform)}
                </div>
                <h3 className="social-modal__platform-name">{link.platform}</h3>
              </div>
              {link.announcement && (
                <p className="social-modal__announcement">"{link.announcement}"</p>
              )}
              <a 
                href={getHref(link)} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-modal__btn"
              >
                {link.platform === 'whatsapp' || link.platform === 'telegram' ? 'Chat Now' : 'Visit Account'}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
