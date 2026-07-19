import React, { useEffect, useState } from 'react';
import './LegalModal.css';
import { useAuth } from '../context/AuthContext';

export default function LegalModal({ docType, onClose }) {
  const [isClosing, setIsClosing] = useState(false);
  const { isCustomerLoggedIn, logout, getToken } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const renderContent = () => {
    switch (docType) {
      case 'privacy':
        return (
          <div className="legal-content">
            <h2>Privacy Policy</h2>
            <p>Last Updated: {new Date().toLocaleDateString()}</p>
            <h3>1. Information We Collect</h3>
            <p>We collect information to provide better services to our users. This includes your name, email address, phone number, and shipping details when you register or make a purchase.</p>
            <h3>2. How We Use Information</h3>
            <p>Your information is used to fulfill orders, improve our web experience, and communicate with you about our artisanal products.</p>
            <h3>3. Data Protection</h3>
            <p>We use industry-standard security measures to protect your personal data from unauthorized access or disclosure.</p>
          </div>
        );
      case 'terms':
        return (
          <div className="legal-content">
            <h2>Terms of Service</h2>
            <p>Last Updated: {new Date().toLocaleDateString()}</p>
            <h3>1. Acceptance of Terms</h3>
            <p>By accessing Vastra Loom, you agree to these terms. If you disagree with any part, you may not access the service.</p>
            <h3>2. Handloom Authenticity</h3>
            <p>All our products are certified authentic handlooms. Slight variations in weave and color are characteristics of handwoven textiles and are not considered defects.</p>
            <h3>3. User Accounts</h3>
            <p>You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password.</p>
          </div>
        );
      case 'deletion':
        return (
          <div className="legal-content">
            <h2>User Data & Account Deletion</h2>
            <p>We respect your right to privacy and your right to be forgotten.</p>
            <h3>How to Delete Your Data</h3>
            <p>If you no longer wish to use Vastra Loom, you can permanently delete your account. This will completely remove your personal information, order history, and saved addresses from our active databases.</p>
            <h3>What Happens When You Delete</h3>
            <ul>
              <li>Your profile information is permanently erased.</li>
              <li>Your saved addresses and recent views are wiped.</li>
              <li>You will not be able to recover this data.</li>
            </ul>
            
            {isCustomerLoggedIn && (
              <div className="legal-delete-section">
                <hr />
                <h4>How to proceed</h4>
                <p>
                  To delete your account, please go to your <strong>Profile Dashboard</strong>, navigate to the <strong>Security</strong> tab, and click on the "Delete Account..." button at the bottom of the page.
                </p>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`legal-modal-overlay ${isClosing ? 'legal-modal-overlay--closing' : ''}`} onClick={handleClose}>
      <div className="legal-modal" onClick={e => e.stopPropagation()}>
        <button className="legal-modal__close" onClick={handleClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
        {renderContent()}
      </div>
    </div>
  );
}
