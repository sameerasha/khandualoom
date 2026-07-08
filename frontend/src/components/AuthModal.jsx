import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './AuthModal.css';

export default function AuthModal({ isOpen, onClose, defaultTab = 'login', onNavigate }) {
  const [activeTab, setActiveTab] = useState(defaultTab); // 'login' or 'signup'
  const { login, socialLogin, signup, loginError, clearError } = useAuth();

  // Form states
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError('');
    clearError();
    setSuccessMsg('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    clearError();

    const result = await login(username, password);
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

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMsg('');

    const result = await signup(username, email, password, phone);
    setIsLoading(false);

    if (result.success) {
      setSuccessMsg('Account created successfully! Switching to Sign In...');
      setTimeout(() => {
        handleTabChange('login');
      }, 2000);
    } else {
      setError(result.error || 'Registration failed. Try a different username or email.');
    }
  };

  // Handle Gmail / Facebook / Instagram SSO redirects
  const handleSSO = (provider) => {
    setIsLoading(true);
    setError('');
    setSuccessMsg(`Redirecting to ${provider} secure authorization portal...`);
    
    // Redirect to Spring Boot OAuth2 authorization endpoint
    const backendUrl = 'http://localhost:8080';
    window.location.href = `${backendUrl}/oauth2/authorization/${provider.toLowerCase()}`;
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose} id="auth-modal">
      <div className="auth-modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={onClose} aria-label="Close modal">×</button>

        <div className="auth-modal-split">
          
          {/* Left Side: Brand Visual Cover Graphic */}
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

          {/* Right Side: Access Portal Forms & Social Sign In */}
          <div className="auth-modal-content">
            
            {/* Tab Headers */}
            <div className="auth-modal-tabs">
              <button
                className={`auth-modal-tab ${activeTab === 'login' ? 'active' : ''}`}
                onClick={() => handleTabChange('login')}
              >
                Sign In
              </button>
              <button
                className={`auth-modal-tab ${activeTab === 'signup' ? 'active' : ''}`}
                onClick={() => handleTabChange('signup')}
              >
                Register
              </button>
            </div>

            {/* Status Messages */}
            {error && <div className="auth-modal-error">{error}</div>}
            {successMsg && <div className="auth-modal-success">{successMsg}</div>}

            {/* Login Form */}
            {activeTab === 'login' && (
              <form className="auth-modal-form" onSubmit={handleLoginSubmit}>
                <div className="auth-modal-group">
                  <label htmlFor="login-username">Username or Email</label>
                  <input
                    id="login-username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="Enter username or email"
                  />
                </div>

                <div className="auth-modal-group">
                  <label htmlFor="login-password">Password</label>
                  <input
                    id="login-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                  />
                </div>

                <button type="submit" className="auth-modal-btn" disabled={isLoading}>
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </button>
              </form>
            )}

            {/* Signup Form */}
            {activeTab === 'signup' && (
              <form className="auth-modal-form" onSubmit={handleSignupSubmit}>
                <div className="auth-modal-group">
                  <label htmlFor="signup-username">Username</label>
                  <input
                    id="signup-username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="Choose username"
                  />
                </div>

                <div className="auth-modal-group">
                  <label htmlFor="signup-email">Email Address</label>
                  <input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="yourname@domain.com"
                  />
                </div>

                <div className="auth-modal-group">
                  <label htmlFor="signup-phone">Phone Number</label>
                  <input
                    id="signup-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                  />
                </div>

                <div className="auth-modal-group">
                  <label htmlFor="signup-password">Password</label>
                  <input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Min 6 characters"
                    minLength="6"
                  />
                </div>

                <button type="submit" className="auth-modal-btn" disabled={isLoading}>
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>
            )}

            {/* Social SSO Integrations Section */}
            <div className="auth-modal-sso">
              <div className="sso-divider">
                <span>Or sign in with</span>
              </div>
              
              <div className="sso-buttons">
                {/* Gmail SSO */}
                <button 
                  className="sso-btn sso-btn--gmail" 
                  onClick={() => handleSSO('google')} 
                  type="button" 
                  title="Sign In with Google"
                  disabled={isLoading}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.79 5.79 0 0 1 8.2 12.725a5.79 5.79 0 0 1 5.79-5.79c2.495 0 4.414 1.058 5.4 1.996l3.232-3.232C20.61 3.904 17.534 2.5 13.99 2.5a9.5 9.5 0 0 0-9.5 9.5a9.5 9.5 0 0 0 9.5 9.5c5.368 0 9.387-3.773 9.387-9.387c0-.606-.065-1.18-.182-1.728H12.24Z"/>
                  </svg>
                  <span>Google</span>
                </button>

                {/* Facebook SSO */}
                <button 
                  className="sso-btn sso-btn--facebook" 
                  onClick={() => handleSSO('facebook')} 
                  type="button" 
                  title="Sign In with Facebook"
                  disabled={isLoading}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669c1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>Facebook</span>
                </button>

                {/* Instagram SSO */}
                <button 
                  className="sso-btn sso-btn--instagram" 
                  onClick={() => handleSSO('instagram')} 
                  type="button" 
                  title="Sign In with Instagram"
                  disabled={isLoading}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                  <span>Instagram</span>
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
