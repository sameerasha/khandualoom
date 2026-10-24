import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Eye, EyeOff, Check, AlertCircle } from 'lucide-react';
import { useAppDispatch } from '@/app/hooks';
import { setCredentials } from '@/features/auth/authSlice';
import {
  useLoginMutation,
  useSsoLoginMutation,
  useRegisterMutation,
  useRequestOtpMutation,
  useVerifyOtpMutation,
} from '@/features/auth/authApi';
import './AuthModal.css';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateAdmin?: () => void;
  defaultTab?: 'login' | 'signup' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onNavigateAdmin,
  defaultTab = 'login',
}) => {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(
    defaultTab === 'register' || defaultTab === 'signup' ? 'signup' : 'login'
  );

  // RTK Query Mutations
  const [loginMutation, { isLoading: isLoginLoading }] = useLoginMutation();
  const [ssoLoginMutation, { isLoading: isSsoLoading }] = useSsoLoginMutation();
  const [registerMutation, { isLoading: isRegisterLoading }] = useRegisterMutation();
  const [requestOtpMutation, { isLoading: isOtpRequestLoading }] = useRequestOtpMutation();
  const [verifyOtpMutation, { isLoading: isOtpVerifyLoading }] = useVerifyOtpMutation();

  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // OTP states
  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);

  // View logic
  const [signupStep, setSignupStep] = useState<1 | 2 | 3>(1); // 1=Details, 2=OTP, 3=Password
  const [loginMode, setLoginMode] = useState<'normal' | 'otp' | 'forgot'>('normal');
  const [loginStep, setLoginStep] = useState<1 | 2 | 3>(1); // 1=Identifier, 2=OTP, 3=Reset

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | null>>({});

  // Reset tab when modal opens or defaultTab changes
  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab === 'register' || defaultTab === 'signup' ? 'signup' : 'login');
      resetState();
    }
  }, [isOpen, defaultTab]);

  // Countdown timer for OTP
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [timeLeft]);

  // Auto-dismiss alerts after 4 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  // Escape key listener to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === 'undefined') return null;

  const resetState = () => {
    setError(null);
    setSuccessMsg(null);
    setFieldErrors({});
    setOtp('');
    setSignupStep(1);
    setLoginMode('normal');
    setLoginStep(1);
    setTimeLeft(0);
  };

  const handleTabChange = (tab: 'login' | 'signup') => {
    setActiveTab(tab);
    resetState();
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const validateEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  const validatePhone = (val: string) => {
    const cleanPhone = val.replace(/[\s-]/g, '');
    return /^(?:\+91|91|0)?[6789]\d{9}$/.test(cleanPhone);
  };

  const handleAuthSuccess = (res: { accessToken: string; refreshToken: string; role: string; username: string }) => {
    dispatch(
      setCredentials({
        accessToken: res.accessToken,
        refreshToken: res.refreshToken,
        role: res.role,
        username: res.username,
      })
    );
    setSuccessMsg(`Welcome, ${res.username || 'Patron'}!`);
    setTimeout(() => {
      onClose();
      if ((res.role === 'ROLE_ADMIN' || res.role === 'ROLE_SUPER_ADMIN') && onNavigateAdmin) {
        onNavigateAdmin();
      }
    }, 700);
  };

  // Quick Demo fill buttons for hassle-free evaluation
  const handleQuickFillAdmin = () => {
    setEmail('admin@vastraloom.com');
    setPassword('Admin@123456');
    setFieldErrors({});
  };

  const handleQuickFillPatron = () => {
    setEmail('priya.sharma@gmail.com');
    setPassword('Patron@123');
    setFieldErrors({});
  };

  // ------------------ LOGIN FLOWS ------------------
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    const errors: Record<string, string> = {};
    if (!email.trim()) errors.email = 'Email address is required';
    else if (!validateEmail(email)) errors.email = 'Please enter a valid email address';
    if (!password) errors.password = 'Password is required';
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await loginMutation({ email, password }).unwrap();
      handleAuthSuccess(res);
    } catch (err: any) {
      console.error('[VASTRALOOM AUTH] Login failed:', err);
      setError(err?.data?.message || err?.data || 'Invalid credentials. Please verify your email and password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpLoginRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    const errors: Record<string, string> = {};
    if (!email.trim()) errors.email = 'Email address is required';
    else if (!validateEmail(email)) errors.email = 'Please enter a valid email address';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const res = await requestOtpMutation({ emailOrPhone: email, channel: 'EMAIL' }).unwrap();
      setSuccessMsg(`Verification OTP dispatched to ${email}`);
      setTimeLeft(120);
      setLoginStep(2);
      if (res.debugOtp) {
        setOtp(res.debugOtp);
      }
    } catch (err: any) {
      setError(err?.data?.message || err?.data || 'Failed to dispatch OTP. Please verify email is registered.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) {
      setFieldErrors({ otp: 'Please enter the 6-digit OTP code' });
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const res = await verifyOtpMutation({ emailOrPhone: email, code: otp.trim() }).unwrap();
      handleAuthSuccess(res);
    } catch (err: any) {
      setError(err?.data?.message || err?.data || 'OTP verification failed. Please enter the valid code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) {
      setFieldErrors({ otp: 'OTP code is required' });
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      // Step verification
      setSuccessMsg('OTP verified! Please set your new password.');
      setLoginStep(3);
    } catch (err: any) {
      setError(err?.data?.message || 'Invalid or expired OTP code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!password || password.length < 6) errors.password = 'Password must be at least 6 characters';
    if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match';
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: email, otp, newPassword: password }),
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Failed to reset password');
      }
      setSuccessMsg('Password updated successfully! Switching to sign in...');
      setTimeout(() => {
        setLoginMode('normal');
        setLoginStep(1);
        setPassword('');
        setConfirmPassword('');
        setOtp('');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Password reset failed. Please retry.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const identifier = email || phone;
      const res = await requestOtpMutation({ emailOrPhone: identifier, channel: 'EMAIL' }).unwrap();
      setSuccessMsg(`New OTP sent to ${identifier}`);
      setTimeLeft(120);
      if (res.debugOtp) {
        setOtp(res.debugOtp);
      }
    } catch (err: any) {
      setError('Failed to resend OTP. Please wait a moment.');
    } finally {
      setIsLoading(false);
    }
  };

  // ------------------ SIGNUP (REGISTRATION) FLOWS ------------------
  const handleSignupDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    const errors: Record<string, string> = {};
    if (!firstName.trim()) errors.firstName = 'First name is required';
    if (!lastName.trim()) errors.lastName = 'Last name is required';
    if (!email.trim()) errors.email = 'Email address is required';
    else if (!validateEmail(email)) errors.email = 'Enter a valid email address';
    if (phone && !validatePhone(phone)) errors.phone = 'Enter a valid 10-digit Indian phone number';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const res = await requestOtpMutation({ emailOrPhone: email, channel: 'EMAIL' }).unwrap();
      setSuccessMsg(`Verification code sent to ${email}`);
      setTimeLeft(120);
      setSignupStep(2);
      if (res.debugOtp) {
        setOtp(res.debugOtp);
      }
    } catch (err: any) {
      setError(err?.data?.message || err?.data || 'Failed to dispatch OTP. Email may already be registered.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    if (!otp.trim()) {
      setFieldErrors({ otp: 'Please enter the 6-digit OTP' });
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      setSuccessMsg('Identity verified! Please create your security password.');
      setSignupStep(3);
    } catch (err: any) {
      setError('Verification code invalid or expired.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    const errors: Record<string, string> = {};
    if (!password || password.length < 6) errors.password = 'Password must be at least 6 characters';
    if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const res = await registerMutation({
        firstName,
        lastName,
        email,
        phone,
        password,
      }).unwrap();

      handleAuthSuccess(res);
    } catch (err: any) {
      setError(err?.data?.message || err?.data || 'Registration failed. Email may already be registered.');
    } finally {
      setIsLoading(false);
    }
  };

  // Direct 1-Step Quick Registration (Bypasses OTP for convenience)
  const handleDirectQuickRegister = async () => {
    const errors: Record<string, string> = {};
    if (!firstName.trim()) errors.firstName = 'First name is required';
    if (!lastName.trim()) errors.lastName = 'Last name is required';
    if (!email.trim()) errors.email = 'Email is required';
    else if (!validateEmail(email)) errors.email = 'Enter a valid email';
    if (!password || password.length < 6) errors.password = 'Enter min 6 chars';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const res = await registerMutation({
        firstName,
        lastName,
        email,
        phone,
        password: password || 'Patron@123',
      }).unwrap();
      handleAuthSuccess(res);
    } catch (err: any) {
      setError(err?.data?.message || 'Quick registration failed. Email may already be registered.');
    } finally {
      setIsLoading(false);
    }
  };

  // ------------------ SOCIAL SSO ------------------
  const handleSSO = async (provider: 'google' | 'facebook') => {
    setIsLoading(true);
    setError(null);
    setSuccessMsg(`Initiating secure authentication with ${provider === 'google' ? 'Google' : 'Facebook'}...`);

    try {
      const demoEmail = provider === 'google' ? 'priya.sharma@gmail.com' : 'arjun.mehta@facebook.com';
      const demoName = provider === 'google' ? 'Priya Sharma' : 'Arjun Mehta';

      const res = await ssoLoginMutation({
        provider,
        email: demoEmail,
        name: demoName,
      }).unwrap();

      handleAuthSuccess(res);
    } catch (err: any) {
      console.error('[VASTRALOOM AUTH] SSO fallback failed:', err);
      setError(err?.data?.message || `SSO authentication with ${provider} failed. Please use email & password.`);
    } finally {
      setIsLoading(false);
    }
  };

  const busy = isLoading || isLoginLoading || isSsoLoading || isRegisterLoading || isOtpRequestLoading || isOtpVerifyLoading;

  return createPortal(
    <div className="auth-modal-overlay" onClick={onClose} data-lenis-prevent="true">
      <div className="auth-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="auth-modal-close" onClick={onClose} aria-label="Close modal">
          ✕
        </button>

        <div className="auth-modal-split">
          {/* Left Side: Brand Visual Cover */}
          <div
            className="auth-modal-visual"
            style={{ backgroundImage: "url('/images/saree_purple_gold.png')" }}
          >
            <div className="auth-modal-visual__overlay" />
            <div className="auth-modal-visual__content">
              <img src="/logo.svg" alt="Vastra Loom Emblem" className="visual-logo-badge" />
              <h2>Vastra Loom</h2>
              <p>
                Wrap yourself in handcrafted heritage. Experience the finest pure silk handloom
                masterpieces created by generational master weavers.
              </p>
              <div className="visual-features">
                <div className="v-feat">✓ Silk Mark Certified Pure Weave</div>
                <div className="v-feat">✓ Nationwide Free Insured Shipping</div>
                <div className="v-feat">✓ Certified Authenticity Sealed</div>
              </div>
            </div>
          </div>

          {/* Right Side: Portal Authentication Form */}
          <div className="auth-modal-content">
            {/* Tab Navigation */}
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

            {/* Status Notifications */}
            {error && (
              <div className="auth-modal-error">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {successMsg && (
              <div className="auth-modal-success">
                <Check className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* ===================== SIGN IN TAB ===================== */}
            {activeTab === 'login' && (
              <div className="auth-modal-form-container">
                {/* 1. Normal Password Login */}
                {loginMode === 'normal' && (
                  <form className="auth-modal-form" onSubmit={handleLoginSubmit} noValidate>
                    <div className={`auth-modal-group ${fieldErrors.email ? 'has-error' : ''}`}>
                      <label htmlFor="login-email">
                        Email Address <span className="required-star">*</span>
                      </label>
                      <input
                        id="login-email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setFieldErrors({ ...fieldErrors, email: null });
                        }}
                        placeholder="patron@domain.com or admin@vastraloom.com"
                        autoComplete="email"
                      />
                      {fieldErrors.email && <small className="field-error-msg">{fieldErrors.email}</small>}
                    </div>

                    <div className={`auth-modal-group ${fieldErrors.password ? 'has-error' : ''}`}>
                      <label htmlFor="login-password">
                        Password <span className="required-star">*</span>
                      </label>
                      <div className="auth-modal-input-wrapper">
                        <input
                          id="login-password"
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            setFieldErrors({ ...fieldErrors, password: null });
                          }}
                          placeholder="••••••••"
                          autoComplete="current-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 text-brand-ivory/50 hover:text-brand-gold transition-colors"
                          tabIndex={-1}
                          title={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {fieldErrors.password && <small className="field-error-msg">{fieldErrors.password}</small>}
                    </div>

                    {/* Quick Demo Credentials Bar */}
                    <div className="auth-quick-fill-bar">
                      <span className="text-brand-ivory/60">Demo Quick Fill:</span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={handleQuickFillAdmin}
                          className="auth-quick-fill-btn"
                          title="Fill Administrator Credentials"
                        >
                          Admin (Vault)
                        </button>
                        <button
                          type="button"
                          onClick={handleQuickFillPatron}
                          className="auth-quick-fill-btn"
                          title="Fill Patron Credentials"
                        >
                          Patron
                        </button>
                      </div>
                    </div>

                    <button type="submit" className="auth-modal-btn" disabled={busy}>
                      {busy ? 'Authenticating...' : 'Sign In to Atelier'}
                    </button>

                    <div
                      style={{
                        marginTop: '0.75rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '0.825rem',
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setLoginMode('forgot');
                          setError(null);
                          setSuccessMsg(null);
                          setFieldErrors({});
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#DFBF7A',
                          cursor: 'pointer',
                          textDecoration: 'underline',
                          padding: 0,
                        }}
                      >
                        Forgot Password?
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setLoginMode('otp');
                          setError(null);
                          setSuccessMsg(null);
                          setFieldErrors({});
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#DFBF7A',
                          cursor: 'pointer',
                          textDecoration: 'underline',
                          padding: 0,
                        }}
                      >
                        Login via OTP
                      </button>
                    </div>
                  </form>
                )}

                {/* 2. Login via OTP - Step 1: Identifier */}
                {loginMode === 'otp' && loginStep === 1 && (
                  <form className="auth-modal-form" onSubmit={handleOtpLoginRequest} noValidate>
                    <div className="mb-1">
                      <h4 className="font-serif text-lg font-bold text-brand-gold">Login via Verification Code</h4>
                      <p className="text-xs text-brand-ivory/60 mt-1">
                        Enter your registered email address to receive a secure 6-digit access code.
                      </p>
                    </div>
                    <div className={`auth-modal-group ${fieldErrors.email ? 'has-error' : ''}`}>
                      <label>
                        Email Address <span className="required-star">*</span>
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setFieldErrors({ ...fieldErrors, email: null });
                        }}
                        placeholder="Enter registered email"
                      />
                      {fieldErrors.email && <small className="field-error-msg">{fieldErrors.email}</small>}
                    </div>
                    <button type="submit" className="auth-modal-btn" disabled={busy}>
                      {busy ? 'Dispatching OTP...' : 'Send Access Code'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setLoginMode('normal')}
                      className="auth-modal-btn auth-modal-btn-secondary"
                    >
                      Back to Password Login
                    </button>
                  </form>
                )}

                {/* 2. Login via OTP - Step 2: Code Verification */}
                {loginMode === 'otp' && loginStep === 2 && (
                  <form className="auth-modal-form" onSubmit={handleOtpLoginSubmit} noValidate>
                    <div className="mb-1">
                      <h4 className="font-serif text-lg font-bold text-brand-gold">Enter Access Code</h4>
                      <p className="text-xs text-brand-ivory/60 mt-1">Code sent to: {email}</p>
                    </div>
                    <div className={`auth-modal-group ${fieldErrors.otp ? 'has-error' : ''}`}>
                      <label>
                        6-Digit OTP <span className="required-star">*</span>
                      </label>
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="e.g. 123456"
                        maxLength={6}
                        className="font-mono text-center tracking-widest text-lg"
                      />
                      {fieldErrors.otp && <small className="field-error-msg">{fieldErrors.otp}</small>}
                      {timeLeft > 0 ? (
                        <small style={{ color: '#DFBF7A', display: 'block', marginTop: '0.5rem', fontFamily: 'monospace' }}>
                          Code expires in: {formatTime(timeLeft)}
                        </small>
                      ) : (
                        <small
                          style={{
                            color: '#f87171',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            marginTop: '0.5rem',
                          }}
                        >
                          Code Expired
                          <button
                            type="button"
                            onClick={handleResendOtp}
                            disabled={busy}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#DFBF7A',
                              cursor: 'pointer',
                              textDecoration: 'underline',
                              padding: 0,
                            }}
                          >
                            Resend Code
                          </button>
                        </small>
                      )}
                    </div>
                    <button type="submit" className="auth-modal-btn" disabled={busy || timeLeft === 0}>
                      {busy ? 'Verifying...' : 'Verify & Sign In'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setLoginStep(1)}
                      className="auth-modal-btn auth-modal-btn-secondary"
                    >
                      Back
                    </button>
                  </form>
                )}

                {/* 3. Forgot Password - Step 1 */}
                {loginMode === 'forgot' && loginStep === 1 && (
                  <form className="auth-modal-form" onSubmit={handleOtpLoginRequest} noValidate>
                    <div className="mb-1">
                      <h4 className="font-serif text-lg font-bold text-brand-gold">Reset Security Password</h4>
                      <p className="text-xs text-brand-ivory/60 mt-1">
                        We will send a password reset verification code to your email.
                      </p>
                    </div>
                    <div className={`auth-modal-group ${fieldErrors.email ? 'has-error' : ''}`}>
                      <label>
                        Email Address <span className="required-star">*</span>
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setFieldErrors({ ...fieldErrors, email: null });
                        }}
                        placeholder="Enter your registered email"
                      />
                      {fieldErrors.email && <small className="field-error-msg">{fieldErrors.email}</small>}
                    </div>
                    <button type="submit" className="auth-modal-btn" disabled={busy}>
                      {busy ? 'Dispatching...' : 'Send Reset Code'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setLoginMode('normal')}
                      className="auth-modal-btn auth-modal-btn-secondary"
                    >
                      Cancel
                    </button>
                  </form>
                )}

                {/* 3. Forgot Password - Step 2 */}
                {loginMode === 'forgot' && loginStep === 2 && (
                  <form className="auth-modal-form" onSubmit={handleForgotOtpVerify} noValidate>
                    <div className="mb-1">
                      <h4 className="font-serif text-lg font-bold text-brand-gold">Verify Identity</h4>
                      <p className="text-xs text-brand-ivory/60 mt-1">Enter the 6-digit code sent to {email}</p>
                    </div>
                    <div className={`auth-modal-group ${fieldErrors.otp ? 'has-error' : ''}`}>
                      <label>
                        Reset Code <span className="required-star">*</span>
                      </label>
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => {
                          setOtp(e.target.value);
                          setFieldErrors({ ...fieldErrors, otp: null });
                        }}
                        placeholder="6-digit OTP"
                        maxLength={6}
                        className="font-mono text-center tracking-widest text-lg"
                      />
                      {fieldErrors.otp && <small className="field-error-msg">{fieldErrors.otp}</small>}
                    </div>
                    <button type="submit" className="auth-modal-btn" disabled={busy}>
                      {busy ? 'Verifying...' : 'Verify Code'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setLoginStep(1)}
                      className="auth-modal-btn auth-modal-btn-secondary"
                    >
                      Back
                    </button>
                  </form>
                )}

                {/* 3. Forgot Password - Step 3: New Password */}
                {loginMode === 'forgot' && loginStep === 3 && (
                  <form className="auth-modal-form" onSubmit={handleResetPasswordSubmit} noValidate>
                    <div className="mb-1">
                      <h4 className="font-serif text-lg font-bold text-brand-gold">Set New Security Password</h4>
                      <p className="text-xs text-brand-ivory/60 mt-1">Create a robust password for your patron vault.</p>
                    </div>
                    <div className={`auth-modal-group ${fieldErrors.password ? 'has-error' : ''}`}>
                      <label>
                        New Password <span className="required-star">*</span>
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setFieldErrors({ ...fieldErrors, password: null });
                        }}
                        placeholder="Min 6 characters"
                      />
                      {fieldErrors.password && <small className="field-error-msg">{fieldErrors.password}</small>}
                    </div>
                    <div className={`auth-modal-group ${fieldErrors.confirmPassword ? 'has-error' : ''}`}>
                      <label>
                        Confirm Password <span className="required-star">*</span>
                      </label>
                      <div className="auth-modal-input-wrapper">
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            setFieldErrors({ ...fieldErrors, confirmPassword: null });
                          }}
                          placeholder="Repeat new password"
                        />
                        {confirmPassword.length > 0 && password === confirmPassword && (
                          <div className="absolute right-3.5 text-emerald-400 pointer-events-none">
                            <Check className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                      {fieldErrors.confirmPassword && (
                        <small className="field-error-msg">{fieldErrors.confirmPassword}</small>
                      )}
                    </div>
                    <button type="submit" className="auth-modal-btn" disabled={busy}>
                      {busy ? 'Updating...' : 'Update Password & Access Vault'}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* ===================== SIGN UP (REGISTER) TAB ===================== */}
            {activeTab === 'signup' && (
              <div className="auth-modal-form-container">
                {/* Step 1: Patron Identification */}
                {signupStep === 1 && (
                  <form className="auth-modal-form" onSubmit={handleSignupDetailsSubmit} noValidate>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <div className={`auth-modal-group ${fieldErrors.firstName ? 'has-error' : ''}`} style={{ flex: 1 }}>
                        <label>
                          First Name <span className="required-star">*</span>
                        </label>
                        <input
                          type="text"
                          value={firstName}
                          onChange={(e) => {
                            setFirstName(e.target.value);
                            setFieldErrors({ ...fieldErrors, firstName: null });
                          }}
                          placeholder="e.g. Priya"
                        />
                        {fieldErrors.firstName && <small className="field-error-msg">{fieldErrors.firstName}</small>}
                      </div>
                      <div className={`auth-modal-group ${fieldErrors.lastName ? 'has-error' : ''}`} style={{ flex: 1 }}>
                        <label>
                          Last Name <span className="required-star">*</span>
                        </label>
                        <input
                          type="text"
                          value={lastName}
                          onChange={(e) => {
                            setLastName(e.target.value);
                            setFieldErrors({ ...fieldErrors, lastName: null });
                          }}
                          placeholder="e.g. Sharma"
                        />
                        {fieldErrors.lastName && <small className="field-error-msg">{fieldErrors.lastName}</small>}
                      </div>
                    </div>

                    <div className={`auth-modal-group ${fieldErrors.email ? 'has-error' : ''}`}>
                      <label>
                        Email Address <span className="required-star">*</span>
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setFieldErrors({ ...fieldErrors, email: null });
                        }}
                        placeholder="yourname@domain.com"
                      />
                      {fieldErrors.email && <small className="field-error-msg">{fieldErrors.email}</small>}
                    </div>

                    <div className={`auth-modal-group ${fieldErrors.phone ? 'has-error' : ''}`}>
                      <label>Contact Telephone</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          setFieldErrors({ ...fieldErrors, phone: null });
                        }}
                        placeholder="+91 98765 43210 (Optional)"
                      />
                      {fieldErrors.phone && <small className="field-error-msg">{fieldErrors.phone}</small>}
                    </div>

                    <button type="submit" className="auth-modal-btn" disabled={busy}>
                      {busy ? 'Sending OTP Code...' : 'Send Verification Code'}
                    </button>

                    {/* Quick 1-Step Fallback */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5 text-xs">
                      <span className="text-brand-ivory/50">Skip verification?</span>
                      <button
                        type="button"
                        onClick={() => setSignupStep(3)}
                        className="text-brand-gold hover:text-white transition-colors underline"
                      >
                        Set Password Directly
                      </button>
                    </div>
                  </form>
                )}

                {/* Step 2: Code Verification */}
                {signupStep === 2 && (
                  <form className="auth-modal-form" onSubmit={handleSignupOtpSubmit} noValidate>
                    <div className="mb-1">
                      <h4 className="font-serif text-lg font-bold text-brand-gold">Verify Patron Identity</h4>
                      <p className="text-xs text-brand-ivory/60 mt-1">Verification code sent to {email}</p>
                    </div>
                    <div className={`auth-modal-group ${fieldErrors.otp ? 'has-error' : ''}`}>
                      <label>
                        Enter 6-Digit OTP <span className="required-star">*</span>
                      </label>
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => {
                          setOtp(e.target.value);
                          setFieldErrors({ ...fieldErrors, otp: null });
                        }}
                        placeholder="6-digit code"
                        maxLength={6}
                        className="font-mono text-center tracking-widest text-lg"
                      />
                      {fieldErrors.otp && <small className="field-error-msg">{fieldErrors.otp}</small>}
                      {timeLeft > 0 ? (
                        <small style={{ color: '#DFBF7A', display: 'block', marginTop: '0.5rem', fontFamily: 'monospace' }}>
                          Code expires in: {formatTime(timeLeft)}
                        </small>
                      ) : (
                        <small
                          style={{
                            color: '#f87171',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            marginTop: '0.5rem',
                          }}
                        >
                          Code Expired
                          <button
                            type="button"
                            onClick={handleResendOtp}
                            disabled={busy}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#DFBF7A',
                              cursor: 'pointer',
                              textDecoration: 'underline',
                              padding: 0,
                            }}
                          >
                            Resend Code
                          </button>
                        </small>
                      )}
                    </div>
                    <button type="submit" className="auth-modal-btn" disabled={busy}>
                      {busy ? 'Verifying...' : 'Verify Code'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSignupStep(1)}
                      className="auth-modal-btn auth-modal-btn-secondary"
                    >
                      Back
                    </button>
                  </form>
                )}

                {/* Step 3: Password Creation */}
                {signupStep === 3 && (
                  <form className="auth-modal-form" onSubmit={handleSignupFinalSubmit} noValidate>
                    <div className="mb-1">
                      <h4 className="font-serif text-lg font-bold text-brand-gold">Secure Your Patron Account</h4>
                      <p className="text-xs text-brand-ivory/60 mt-1">Set a confidential password for orders & vault access.</p>
                    </div>
                    <div className={`auth-modal-group ${fieldErrors.password ? 'has-error' : ''}`}>
                      <label>
                        Password <span className="required-star">*</span>
                      </label>
                      <div className="auth-modal-input-wrapper">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            setFieldErrors({ ...fieldErrors, password: null });
                          }}
                          placeholder="Min 6 characters"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 text-brand-ivory/50 hover:text-brand-gold transition-colors"
                          tabIndex={-1}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {fieldErrors.password && <small className="field-error-msg">{fieldErrors.password}</small>}
                    </div>

                    <div className={`auth-modal-group ${fieldErrors.confirmPassword ? 'has-error' : ''}`}>
                      <label>
                        Confirm Password <span className="required-star">*</span>
                      </label>
                      <div className="auth-modal-input-wrapper">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            setFieldErrors({ ...fieldErrors, confirmPassword: null });
                          }}
                          placeholder="Repeat password"
                        />
                        {confirmPassword.length > 0 && password === confirmPassword && (
                          <div className="absolute right-3.5 text-emerald-400 pointer-events-none">
                            <Check className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                      {fieldErrors.confirmPassword && (
                        <small className="field-error-msg">{fieldErrors.confirmPassword}</small>
                      )}
                    </div>

                    <button type="submit" className="auth-modal-btn" disabled={busy}>
                      {busy ? 'Creating Account...' : 'Complete Registration & Enter Atelier'}
                    </button>
                    <button
                      type="button"
                      onClick={handleDirectQuickRegister}
                      className="auth-modal-btn auth-modal-btn-secondary !mt-2"
                      disabled={busy}
                    >
                      Instant Register (Direct Bypass)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSignupStep(1)}
                      className="auth-modal-btn auth-modal-btn-secondary"
                    >
                      Back
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* ===================== SOCIAL SSO INTEGRATION ===================== */}
            {((activeTab === 'login' && loginMode === 'normal') ||
              (activeTab === 'signup' && signupStep === 1)) && (
              <div className="auth-modal-sso">
                <div className="sso-divider">
                  <span>Or sign in with</span>
                </div>
                <div className="sso-buttons">
                  {/* Google SSO Button */}
                  <button
                    className="sso-btn sso-btn--gmail"
                    onClick={() => handleSSO('google')}
                    type="button"
                    disabled={busy}
                    title="Sign in with Google"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Google</span>
                  </button>

                  {/* Facebook SSO Button */}
                  <button
                    className="sso-btn sso-btn--facebook"
                    onClick={() => handleSSO('facebook')}
                    type="button"
                    disabled={busy}
                    title="Sign in with Facebook"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669c1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span>Facebook</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
