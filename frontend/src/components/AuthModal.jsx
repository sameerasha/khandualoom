import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './AuthModal.css';

export default function AuthModal({ isOpen, onClose, defaultTab = 'login', onNavigate }) {
  const [activeTab, setActiveTab] = useState(defaultTab); // 'login' or 'signup'
  const { login, signup, loginError, clearError } = useAuth();

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
        // Customer login success
        onClose();
        onNavigate('home');
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

  return (
    <div className="auth-modal-overlay" onClick={onClose} id="auth-modal">
      <div className="auth-modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={onClose} aria-label="Close modal">×</button>

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
      </div>
    </div>
  );
}
