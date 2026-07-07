import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './AdminLogin.css';

export default function AdminLogin({ onNavigate }) {
  const { login, loginError, clearError } = useAuth();
  
  // Fields
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    clearError();

    const result = await login(username, password);
    setIsLoading(false);
    
    if (result && result.success && result.role === 'ROLE_ADMIN') {
      onNavigate('admin/dashboard');
    } else if (result && result.success) {
      onNavigate('');
    } else {
      setError(loginError || 'Authentication failed. Please verify credentials.');
    }
  };

  return (
    <div className="admin-login">
      <div className="admin-login__bg">
        <div className="admin-login__bg-orb admin-login__bg-orb--1"></div>
        <div className="admin-login__bg-orb admin-login__bg-orb--2"></div>
        <div className="admin-login__bg-orb admin-login__bg-orb--3"></div>
        <div className="admin-login__grid-lines"></div>
      </div>

      <div className="admin-login__card animate-scale-in">
        <div className="admin-login__card-glow"></div>

        <div className="admin-login__split">
          {/* Left Panel: Cover visual of Saree catalog */}
          <div className="admin-login__visual" style={{ backgroundImage: "url('/images/saree_navy_blue.png')" }}>
            <div className="admin-login__visual-overlay"></div>
            <div className="admin-login__visual-content">
              <span className="admin-login__visual-logo">✦</span>
              <h2>Vastra Loom</h2>
              <p>Manager Portal</p>
              <span className="admin-login__visual-tag">Artisanal Saree Collections</span>
            </div>
          </div>

          {/* Right Panel: Clean login form */}
          <div className="admin-login__form-panel">
            <div className="admin-login__header">
              <div className="admin-login__logo">
                <span className="admin-login__logo-icon">✦</span>
                <span className="admin-login__logo-text">Vastra Loom</span>
              </div>
              <h1 className="admin-login__title">Admin Sign In</h1>
              <p className="admin-login__subtitle">Enter manager credentials to access catalog tools</p>
            </div>

            {/* Error alerts */}
            {(error || loginError) && (
              <div className="admin-login__error animate-fade-in">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{error || loginError}</span>
              </div>
            )}

            <form className="admin-login__form" onSubmit={handleSubmit} id="admin-login-form">
              <div className="admin-login__field">
                <label className="admin-login__label" htmlFor="admin-username">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                  </svg>
                  Username
                </label>
                <input
                  type="text"
                  id="admin-username"
                  className="admin-login__input"
                  placeholder="Enter admin username"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setError(''); }}
                  required
                />
              </div>

              <div className="admin-login__field">
                <label className="admin-login__label" htmlFor="admin-password">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                  Password
                </label>
                <div className="admin-login__password-wrap">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="admin-password"
                    className="admin-login__input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    required
                  />
                  <button
                    type="button"
                    className="admin-login__toggle-pw"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className={`admin-login__submit ${isLoading ? 'admin-login__submit--loading' : ''}`}
                disabled={isLoading || !username || !password}
                id="admin-login-submit"
              >
                {isLoading ? (
                  <div className="admin-login__spinner"></div>
                ) : (
                  <>
                    <span>Sign In</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            <button className="admin-login__back" onClick={() => onNavigate('')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back to Store
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
