import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './AuthModal.css';

export default function AuthModal({ isOpen, onClose, defaultTab = 'login', onNavigate }) {
  const [activeTab, setActiveTab] = useState(defaultTab); // 'login' or 'signup'
  const { login, socialLogin, signup, loginError, clearError, sendOtp, verifyOtpStep, loginWithOtp, resetPassword } = useAuth();

  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  
  // OTP states
  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);

  // View logic
  const [signupStep, setSignupStep] = useState(1); // 1=Details, 2=OTP, 3=Password
  const [loginMode, setLoginMode] = useState('normal'); // 'normal', 'otp', 'forgot'
  const [loginStep, setLoginStep] = useState(1); // 1=Identifier, 2=OTP/Reset

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  // Countdown timer
  useEffect(() => {
    let timer;
    if (timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!isOpen) return null;

  const resetState = () => {
    setError('');
    clearError();
    setSuccessMsg('');
    setFieldErrors({});
    setOtp('');
    setSignupStep(1);
    setLoginMode('normal');
    setLoginStep(1);
    setTimeLeft(0);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    resetState();
  };

  const validateEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  const validatePhone = (val) => /^(?:\+91|91|0)?[6789]\d{9}$/.test(val);

  // ------------------ LOGIN FLOW ------------------
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    let errors = {};
    if (!email.trim()) errors.email = "Email is required";
    else if (!validateEmail(email)) errors.email = "Enter a valid email";
    if (!password) errors.password = "Password is required";
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsLoading(true);
    setError('');
    clearError();

    const result = await login(email, password);
    setIsLoading(false);

    if (result.success) {
      if (result.role === 'ROLE_ADMIN') {
        onNavigate('admin/dashboard');
      } else {
        onClose();
        onNavigate('');
      }
    } else {
      setError(loginError || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleOtpLoginRequest = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    let errors = {};
    const identifier = email || phone;
    if (!identifier) errors.identifier = "Please enter an email or phone number";
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    
    setIsLoading(true);
    setError('');
    const result = await sendOtp(identifier);
    setIsLoading(false);
    if (result.success) {
      setSuccessMsg(`OTP sent to ${identifier}`);
      setTimeLeft(result.ttlSeconds || 120);
      setLoginStep(2);
    } else {
      setError(result.error || 'Failed to send OTP.');
    }
  };

  const handleOtpLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    const result = await loginWithOtp(email || phone, otp);
    setIsLoading(false);
    if (result.success) {
      if (result.role === 'ROLE_ADMIN') {
        onNavigate('admin/dashboard');
      } else {
        onClose();
        onNavigate('');
      }
    } else {
      setError(result.error || 'OTP Login failed.');
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    const result = await resetPassword(email || phone, otp, password);
    setIsLoading(false);
    if (result.success) {
      setSuccessMsg('Password reset successfully! You can now log in.');
      setTimeout(() => {
        setLoginMode('normal');
        setLoginStep(1);
        setPassword('');
        setOtp('');
        setSuccessMsg('');
      }, 2000);
    } else {
      setError(result.error || 'Password reset failed.');
    }
  };

  // ------------------ SIGNUP FLOW ------------------
  const handleSignupDetailsSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    let errors = {};
    if (!firstName.trim()) errors.firstName = "First name is required";
    if (!lastName.trim()) errors.lastName = "Last name is required";
    if (!email.trim()) errors.email = "Email is required";
    else if (!validateEmail(email)) errors.email = "Enter a valid email";
    if (phone && !validatePhone(phone)) errors.phone = "Enter a valid Indian phone number";
    
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsLoading(true);
    setError('');
    const identifier = email || phone;
    const result = await sendOtp(identifier);
    setIsLoading(false);
    if (result.success) {
      setSuccessMsg(`OTP sent to ${identifier}`);
      setTimeLeft(result.ttlSeconds || 120);
      setSignupStep(2);
    } else {
      setError(result.error || 'Failed to send OTP.');
    }
  };

  const handleSignupOtpSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    if (!otp.trim()) {
      setFieldErrors({ otp: "OTP is required" });
      return;
    }
    setIsLoading(true);
    setError('');
    const result = await verifyOtpStep(email || phone, otp);
    setIsLoading(false);
    if (result.success) {
      setSuccessMsg('OTP Verified! Please set your password.');
      setSignupStep(3);
    } else {
      setError(result.error || 'Invalid OTP.');
    }
  };

  const handleSignupFinalSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    if (!password || password.length < 6) {
      setFieldErrors({ password: "Password must be at least 6 characters" });
      return;
    }
    setIsLoading(true);
    setError('');
    const result = await signup(firstName, lastName, email, password, phone, otp);
    setIsLoading(false);

    if (result.success) {
      setSuccessMsg('Account created successfully! Switching to Sign In...');
      setTimeout(() => {
        handleTabChange('login');
      }, 2000);
    } else {
      setError(result.error || 'Registration failed.');
    }
  };

  // ------------------ SSO ------------------
  const handleSSO = (provider) => {
    setIsLoading(true);
    setError('');
    setSuccessMsg(`Redirecting to ${provider}...`);
    window.location.href = `${import.meta.env.VITE_API_URL}/oauth2/authorization/${provider.toLowerCase()}`;
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose} id="auth-modal">
      <div className="auth-modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={onClose} aria-label="Close modal">×</button>

        <div className="auth-modal-split">
          {/* Left Side: Brand Visual */}
          <div className="auth-modal-visual" style={{ backgroundImage: "url('/images/saree_purple_gold.png')" }}>
            <div className="auth-modal-visual__overlay"></div>
            <div className="auth-modal-visual__content">
              <span className="visual-logo-badge">✦</span>
              <h2>Vastra Loom</h2>
              <p>Wrap yourself in handcrafted heritage. Experience the finest pure silk handloom masterpieces created by master weavers.</p>
              <div className="visual-features">
                <div className="v-feat">✓ Silk Mark Certified</div>
                <div className="v-feat">✓ Nationwide Free Insured Shipping</div>
              </div>
            </div>
          </div>

          {/* Right Side: Portal */}
          <div className="auth-modal-content">
            <div className="auth-modal-tabs">
              <button className={`auth-modal-tab ${activeTab === 'login' ? 'active' : ''}`} onClick={() => handleTabChange('login')}>Sign In</button>
              <button className={`auth-modal-tab ${activeTab === 'signup' ? 'active' : ''}`} onClick={() => handleTabChange('signup')}>Register</button>
            </div>

            {error && <div className="auth-modal-error">{error}</div>}
            {successMsg && <div className="auth-modal-success">{successMsg}</div>}

            {/* LOGIN TAB */}
            {activeTab === 'login' && (
              <div className="auth-modal-form-container">
                {loginMode === 'normal' && (
                  <form className="auth-modal-form" onSubmit={handleLoginSubmit} noValidate>
                    <div className={`auth-modal-group ${fieldErrors.email ? 'has-error' : ''}`}>
                      <label htmlFor="login-email">Email Address <span className="required-star">*</span></label>
                      <input id="login-email" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setFieldErrors({...fieldErrors, email: null}); }} placeholder="Enter email address" />
                      {fieldErrors.email && <small className="field-error-msg">{fieldErrors.email}</small>}
                    </div>
                    <div className={`auth-modal-group ${fieldErrors.password ? 'has-error' : ''}`}>
                      <label htmlFor="login-password">Password <span className="required-star">*</span></label>
                      <input id="login-password" type="password" value={password} onChange={(e) => { setPassword(e.target.value); setFieldErrors({...fieldErrors, password: null}); }} placeholder="••••••••" />
                      {fieldErrors.password && <small className="field-error-msg">{fieldErrors.password}</small>}
                    </div>
                    <button type="submit" className="auth-modal-btn" disabled={isLoading}>{isLoading ? 'Signing In...' : 'Sign In'}</button>
                    
                    <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <button type="button" onClick={() => { setLoginMode('forgot'); setError(''); setSuccessMsg(''); setFieldErrors({}); }} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', textDecoration: 'underline' }}>Forgot Password?</button>
                      <button type="button" onClick={() => { setLoginMode('otp'); setError(''); setSuccessMsg(''); setFieldErrors({}); }} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', textDecoration: 'underline' }}>Login with OTP</button>
                    </div>
                  </form>
                )}

                {loginMode === 'otp' && loginStep === 1 && (
                  <form className="auth-modal-form" onSubmit={handleOtpLoginRequest} noValidate>
                    <h4>Login via OTP</h4>
                    <div className={`auth-modal-group ${fieldErrors.identifier ? 'has-error' : ''}`}>
                      <label>Email or Phone Number <span className="required-star">*</span></label>
                      <input type="text" value={email || phone} onChange={(e) => { setEmail(e.target.value); setPhone(e.target.value); setFieldErrors({...fieldErrors, identifier: null}); }} placeholder="Enter email or phone" />
                      {fieldErrors.identifier && <small className="field-error-msg">{fieldErrors.identifier}</small>}
                    </div>
                    <button type="submit" className="auth-modal-btn" disabled={isLoading}>{isLoading ? 'Sending...' : 'Send OTP'}</button>
                    <button type="button" onClick={() => setLoginMode('normal')} className="auth-modal-btn auth-modal-btn-secondary" style={{ marginTop: '1rem', background: 'transparent', color: 'var(--primary-color)', border: '1px solid var(--primary-color)' }}>Back to Password Login</button>
                  </form>
                )}

                {loginMode === 'otp' && loginStep === 2 && (
                  <form className="auth-modal-form" onSubmit={handleOtpLoginSubmit} noValidate>
                    <h4>Enter Login OTP</h4>
                    <div className={`auth-modal-group ${fieldErrors.otp ? 'has-error' : ''}`}>
                      <label>OTP <span className="required-star">*</span></label>
                      <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="6-digit OTP" />
                      {fieldErrors.otp && <small className="field-error-msg">{fieldErrors.otp}</small>}
                      {timeLeft > 0 ? (
                        <small style={{ color: 'var(--primary-color)', display: 'block', marginTop: '0.5rem' }}>Time remaining: {formatTime(timeLeft)}</small>
                      ) : (
                        <small style={{ color: 'red', display: 'block', marginTop: '0.5rem' }}>OTP Expired</small>
                      )}
                    </div>
                    <button type="submit" className="auth-modal-btn" disabled={isLoading || timeLeft === 0}>{isLoading ? 'Verifying...' : 'Verify & Sign In'}</button>
                  </form>
                )}

                {loginMode === 'forgot' && loginStep === 1 && (
                  <form className="auth-modal-form" onSubmit={handleOtpLoginRequest} noValidate>
                    <h4>Reset Password</h4>
                    <div className={`auth-modal-group ${fieldErrors.identifier ? 'has-error' : ''}`}>
                      <label>Email or Phone Number <span className="required-star">*</span></label>
                      <input type="text" value={email || phone} onChange={(e) => { setEmail(e.target.value); setPhone(e.target.value); setFieldErrors({...fieldErrors, identifier: null}); }} placeholder="Enter email or phone" />
                      {fieldErrors.identifier && <small className="field-error-msg">{fieldErrors.identifier}</small>}
                    </div>
                    <button type="submit" className="auth-modal-btn" disabled={isLoading}>{isLoading ? 'Sending...' : 'Send OTP'}</button>
                    <button type="button" onClick={() => setLoginMode('normal')} className="auth-modal-btn auth-modal-btn-secondary" style={{ marginTop: '1rem', background: 'transparent', color: 'var(--primary-color)', border: '1px solid var(--primary-color)' }}>Cancel</button>
                  </form>
                )}

                {loginMode === 'forgot' && loginStep === 2 && (
                  <form className="auth-modal-form" onSubmit={handleResetPasswordSubmit} noValidate>
                    <h4>Set New Password</h4>
                    <div className={`auth-modal-group ${fieldErrors.otp ? 'has-error' : ''}`}>
                      <label>OTP <span className="required-star">*</span></label>
                      <input type="text" value={otp} onChange={(e) => { setOtp(e.target.value); setFieldErrors({...fieldErrors, otp: null}); }} placeholder="6-digit OTP" />
                      {fieldErrors.otp && <small className="field-error-msg">{fieldErrors.otp}</small>}
                      {timeLeft > 0 ? (
                        <small style={{ color: 'var(--primary-color)', display: 'block', marginTop: '0.5rem' }}>Time remaining: {formatTime(timeLeft)}</small>
                      ) : (
                        <small style={{ color: 'red', display: 'block', marginTop: '0.5rem' }}>OTP Expired</small>
                      )}
                    </div>
                    <div className={`auth-modal-group ${fieldErrors.password ? 'has-error' : ''}`}>
                      <label>New Password <span className="required-star">*</span></label>
                      <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); setFieldErrors({...fieldErrors, password: null}); }} placeholder="Min 6 characters" />
                      {fieldErrors.password && <small className="field-error-msg">{fieldErrors.password}</small>}
                    </div>
                    <button type="submit" className="auth-modal-btn" disabled={isLoading || timeLeft === 0}>{isLoading ? 'Resetting...' : 'Reset Password'}</button>
                  </form>
                )}
              </div>
            )}

            {/* SIGNUP TAB */}
            {activeTab === 'signup' && (
              <div className="auth-modal-form-container">
                {signupStep === 1 && (
                  <form className="auth-modal-form" onSubmit={handleSignupDetailsSubmit} noValidate>
                    <div className="auth-modal-group-row" style={{ display: 'flex', gap: '1rem' }}>
                      <div className={`auth-modal-group ${fieldErrors.firstName ? 'has-error' : ''}`} style={{ flex: 1 }}>
                        <label>First Name <span className="required-star">*</span></label>
                        <input type="text" value={firstName} onChange={(e) => { setFirstName(e.target.value); setFieldErrors({...fieldErrors, firstName: null}); }} placeholder="First Name" />
                        {fieldErrors.firstName && <small className="field-error-msg">{fieldErrors.firstName}</small>}
                      </div>
                      <div className={`auth-modal-group ${fieldErrors.lastName ? 'has-error' : ''}`} style={{ flex: 1 }}>
                        <label>Last Name <span className="required-star">*</span></label>
                        <input type="text" value={lastName} onChange={(e) => { setLastName(e.target.value); setFieldErrors({...fieldErrors, lastName: null}); }} placeholder="Last Name" />
                        {fieldErrors.lastName && <small className="field-error-msg">{fieldErrors.lastName}</small>}
                      </div>
                    </div>
                    <div className={`auth-modal-group ${fieldErrors.email ? 'has-error' : ''}`}>
                      <label>Email Address <span className="required-star">*</span></label>
                      <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setFieldErrors({...fieldErrors, email: null}); }} placeholder="yourname@domain.com" />
                      {fieldErrors.email && <small className="field-error-msg">{fieldErrors.email}</small>}
                    </div>
                    <div className={`auth-modal-group ${fieldErrors.phone ? 'has-error' : ''}`}>
                      <label>Phone Number</label>
                      <input type="tel" value={phone} onChange={(e) => { setPhone(e.target.value); setFieldErrors({...fieldErrors, phone: null}); }} placeholder="e.g. +91 98765 43210" />
                      {fieldErrors.phone && <small className="field-error-msg">{fieldErrors.phone}</small>}
                    </div>
                    <button type="submit" className="auth-modal-btn" disabled={isLoading}>{isLoading ? 'Sending OTP...' : 'Send Verification OTP'}</button>
                  </form>
                )}

                {signupStep === 2 && (
                  <form className="auth-modal-form" onSubmit={handleSignupOtpSubmit} noValidate>
                    <h4>Verify Identity</h4>
                    <div className={`auth-modal-group ${fieldErrors.otp ? 'has-error' : ''}`}>
                      <label>Enter OTP sent to {email || phone} <span className="required-star">*</span></label>
                      <input type="text" value={otp} onChange={(e) => { setOtp(e.target.value); setFieldErrors({...fieldErrors, otp: null}); }} placeholder="6-digit OTP" />
                      {fieldErrors.otp && <small className="field-error-msg">{fieldErrors.otp}</small>}
                      {timeLeft > 0 ? (
                        <small style={{ color: 'var(--primary-color)', display: 'block', marginTop: '0.5rem' }}>Time remaining: {formatTime(timeLeft)}</small>
                      ) : (
                        <small style={{ color: 'red', display: 'block', marginTop: '0.5rem' }}>OTP Expired</small>
                      )}
                    </div>
                    <button type="submit" className="auth-modal-btn" disabled={isLoading || timeLeft === 0}>{isLoading ? 'Verifying...' : 'Verify OTP'}</button>
                    <button type="button" onClick={() => setSignupStep(1)} className="auth-modal-btn auth-modal-btn-secondary" style={{ marginTop: '1rem', background: 'transparent', color: 'var(--primary-color)', border: '1px solid var(--primary-color)' }}>Back</button>
                  </form>
                )}

                {signupStep === 3 && (
                  <form className="auth-modal-form" onSubmit={handleSignupFinalSubmit} noValidate>
                    <h4>Set Your Password</h4>
                    <div className={`auth-modal-group ${fieldErrors.password ? 'has-error' : ''}`}>
                      <label>Password <span className="required-star">*</span></label>
                      <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); setFieldErrors({...fieldErrors, password: null}); }} placeholder="Min 6 characters" />
                      {fieldErrors.password && <small className="field-error-msg">{fieldErrors.password}</small>}
                    </div>
                    <button type="submit" className="auth-modal-btn" disabled={isLoading}>{isLoading ? 'Creating...' : 'Create Account'}</button>
                  </form>
                )}
              </div>
            )}

            {/* Social SSO Integrations Section */}
            {(activeTab === 'login' && loginMode === 'normal') || (activeTab === 'signup' && signupStep === 1) ? (
              <div className="auth-modal-sso">
                <div className="sso-divider"><span>Or sign in with</span></div>
                <div className="sso-buttons">
                  <button className="sso-btn sso-btn--gmail" onClick={() => handleSSO('google')} type="button" disabled={isLoading}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.79 5.79 0 0 1 8.2 12.725a5.79 5.79 0 0 1 5.79-5.79c2.495 0 4.414 1.058 5.4 1.996l3.232-3.232C20.61 3.904 17.534 2.5 13.99 2.5a9.5 9.5 0 0 0-9.5 9.5a9.5 9.5 0 0 0 9.5 9.5c5.368 0 9.387-3.773 9.387-9.387c0-.606-.065-1.18-.182-1.728H12.24Z"/>
                    </svg>
                    <span>Google</span>
                  </button>
                  <button className="sso-btn sso-btn--facebook" onClick={() => handleSSO('facebook')} type="button" disabled={isLoading}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669c1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span>Facebook</span>
                  </button>
                  <button className="sso-btn sso-btn--instagram" onClick={() => handleSSO('instagram')} type="button" disabled={isLoading}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                    <span>Instagram</span>
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
