import { useState } from 'react';
import './SignUpModal.css';

export default function SignUpModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Enter a valid email';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Min 6 characters';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          setFormData({ name: '', email: '', password: '' });
          onClose();
        }, 2500);
      }, 1500);
    }
  };

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} id="signup-modal">
      <div className="modal animate-scale-in" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="modal__close" onClick={onClose} aria-label="Close" id="modal-close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Decorative */}
        <div className="modal__decor">
          <div className="modal__decor-pattern"></div>
        </div>

        {isSuccess ? (
          <div className="modal__success">
            <div className="modal__success-icon">✦</div>
            <h3 className="modal__success-title">Welcome to the Family!</h3>
            <p className="modal__success-text">You're now part of an exclusive community of connoisseurs.</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="modal__header">
              <span className="modal__icon">✦</span>
              <h2 className="modal__title">Join <span className="gold-text">Vastra Loom</span></h2>
              <p className="modal__subtitle">Become part of our heritage. Get early access to exclusive collections and artisan stories.</p>
            </div>

            {/* Form */}
            <form className="modal__form" onSubmit={handleSubmit} id="signup-form">
              <div className={`modal__field ${errors.name ? 'modal__field--error' : ''}`}>
                <label className="modal__label" htmlFor="signup-name">Full Name</label>
                <div className="modal__input-wrap">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
                  </svg>
                  <input
                    type="text"
                    id="signup-name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange('name')}
                  />
                </div>
                {errors.name && <span className="modal__error">{errors.name}</span>}
              </div>

              <div className={`modal__field ${errors.email ? 'modal__field--error' : ''}`}>
                <label className="modal__label" htmlFor="signup-email">Email Address</label>
                <div className="modal__input-wrap">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <input
                    type="email"
                    id="signup-email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange('email')}
                  />
                </div>
                {errors.email && <span className="modal__error">{errors.email}</span>}
              </div>

              <div className={`modal__field ${errors.password ? 'modal__field--error' : ''}`}>
                <label className="modal__label" htmlFor="signup-password">Password</label>
                <div className="modal__input-wrap">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                  <input
                    type="password"
                    id="signup-password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange('password')}
                  />
                </div>
                {errors.password && <span className="modal__error">{errors.password}</span>}
              </div>

              <button
                type="submit"
                className={`modal__submit ${isSubmitting ? 'modal__submit--loading' : ''}`}
                disabled={isSubmitting}
                id="signup-submit"
              >
                {isSubmitting ? (
                  <div className="modal__spinner"></div>
                ) : (
                  <>
                    <span>Create Account</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>

              <p className="modal__footer-text">
                By signing up, you agree to our <a href="#">Terms</a> & <a href="#">Privacy Policy</a>
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
