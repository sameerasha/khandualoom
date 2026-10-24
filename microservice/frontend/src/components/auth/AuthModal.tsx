import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Lock, Mail, Phone, KeyRound, Sparkles, AlertCircle, Shield, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAppDispatch } from '@/app/hooks';
import { setCredentials } from '@/features/auth/authSlice';
import {
  useLoginMutation,
  useRegisterMutation,
  useRequestOtpMutation,
  useVerifyOtpMutation,
} from '@/features/auth/authApi';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateAdmin?: () => void;
  defaultTab?: 'login' | 'register' | 'otp' | 'admin';
}

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const registerSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onNavigateAdmin,
  defaultTab = 'login',
}) => {
  const dispatch = useAppDispatch();
  const [tab, setTab] = useState<'login' | 'register' | 'otp' | 'admin'>(defaultTab);
  const [authError, setAuthError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // OTP state
  const [otpIdentifier, setOtpIdentifier] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [debugOtp, setDebugOtp] = useState<string | null>(null);

  // Admin form state
  const [adminEmail, setAdminEmail] = useState('admin@vastraloom.com');
  const [adminPassword, setAdminPassword] = useState('Admin@123');

  // RTK Query Mutations
  const [loginMutation, { isLoading: isLoginLoading }] = useLoginMutation();
  const [registerMutation, { isLoading: isRegisterLoading }] = useRegisterMutation();
  const [requestOtpMutation, { isLoading: isOtpRequestLoading }] = useRequestOtpMutation();
  const [verifyOtpMutation, { isLoading: isOtpVerifyLoading }] = useVerifyOtpMutation();

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  if (!isOpen) return null;

  const handleLoginSubmit = async (data: LoginFormData) => {
    setAuthError(null);
    try {
      const res = await loginMutation(data).unwrap();
      dispatch(
        setCredentials({
          accessToken: res.accessToken,
          refreshToken: res.refreshToken,
          role: res.role,
          username: res.username,
        })
      );
      onClose();
      if ((res.role === 'ROLE_ADMIN' || res.role === 'ROLE_SUPER_ADMIN') && onNavigateAdmin) {
        onNavigateAdmin();
      }
    } catch (err: any) {
      setAuthError(err?.data?.message || 'Invalid email or password. Please try again.');
    }
  };

  const handleAdminLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    try {
      const res = await loginMutation({ email: adminEmail, password: adminPassword }).unwrap();
      dispatch(
        setCredentials({
          accessToken: res.accessToken,
          refreshToken: res.refreshToken,
          role: res.role,
          username: res.username,
        })
      );
      onClose();
      if (onNavigateAdmin) {
        onNavigateAdmin();
      }
    } catch (err: any) {
      setAuthError(err?.data?.message || 'Admin authentication failed. Please verify administrator credentials.');
    }
  };

  const handleRegisterSubmit = async (data: RegisterFormData) => {
    setAuthError(null);
    try {
      const res = await registerMutation(data).unwrap();
      dispatch(
        setCredentials({
          accessToken: res.accessToken,
          refreshToken: res.refreshToken,
          role: res.role,
          username: res.username,
        })
      );
      setSuccessMsg('Patron account created successfully! Welcome to Vastraloom.');
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: any) {
      setAuthError(err?.data?.message || 'Registration failed. Email may already be registered.');
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setDebugOtp(null);
    try {
      const res = await requestOtpMutation({ emailOrPhone: otpIdentifier, channel: 'EMAIL' }).unwrap();
      setOtpSent(true);
      if (res.debugOtp) {
        setDebugOtp(res.debugOtp);
      }
    } catch (err: any) {
      setAuthError(err?.data?.message || 'Failed to dispatch verification code. Please retry.');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    try {
      const res = await verifyOtpMutation({ emailOrPhone: otpIdentifier, code: otpCode }).unwrap();
      dispatch(
        setCredentials({
          accessToken: res.accessToken,
          refreshToken: res.refreshToken,
          role: res.role,
          username: res.username,
        })
      );
      onClose();
    } catch (err: any) {
      setAuthError(err?.data?.message || 'Incorrect OTP code. Please enter the valid code.');
    }
  };

  const handleSSO = (provider: 'google' | 'facebook') => {
    setAuthError(null);
    setSuccessMsg(`Redirecting to ${provider === 'google' ? 'Google' : 'Facebook'} Secure SSO...`);
    // Redirect through Spring Security OAuth2 authorization endpoint
    window.location.href = `/oauth2/authorization/${provider}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-[#140A1F] border border-brand-gold/30 rounded-3xl p-6 sm:p-8 shadow-2xl text-brand-ivory my-8 overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-brand-gold/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-purple/30 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-brand-ivory/60 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-tr from-brand-purple to-brand-gold/30 border border-brand-gold/40 flex items-center justify-center mb-3 shadow-lg">
            {tab === 'admin' ? (
              <Shield className="w-6 h-6 text-brand-gold animate-pulse" />
            ) : (
              <Sparkles className="w-6 h-6 text-brand-gold" />
            )}
          </div>
          <h3 className="font-serif text-2xl font-bold text-white tracking-wide">
            {tab === 'admin'
              ? 'Atelier Admin Portal'
              : tab === 'register'
              ? 'Join The Patron Salon'
              : 'Sign In to Vastraloom'}
          </h3>
          <p className="text-xs text-brand-ivory/60 mt-1 font-sans">
            {tab === 'admin'
              ? 'Restricted Access for Master Curators & Super Admins'
              : 'Authentic pure silk handloom sarees crafted by master weavers'}
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-brand-gold/20 mb-6 text-xs font-medium">
          <button
            onClick={() => { setTab('login'); setAuthError(null); }}
            className={`flex-1 py-2.5 text-center transition-all ${
              tab === 'login'
                ? 'border-b-2 border-brand-gold text-brand-gold font-bold'
                : 'text-brand-ivory/60 hover:text-brand-ivory'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setTab('register'); setAuthError(null); }}
            className={`flex-1 py-2.5 text-center transition-all ${
              tab === 'register'
                ? 'border-b-2 border-brand-gold text-brand-gold font-bold'
                : 'text-brand-ivory/60 hover:text-brand-ivory'
            }`}
          >
            Register
          </button>
          <button
            onClick={() => { setTab('otp'); setAuthError(null); }}
            className={`flex-1 py-2.5 text-center transition-all ${
              tab === 'otp'
                ? 'border-b-2 border-brand-gold text-brand-gold font-bold'
                : 'text-brand-ivory/60 hover:text-brand-ivory'
            }`}
          >
            OTP Login
          </button>
          <button
            onClick={() => { setTab('admin'); setAuthError(null); }}
            className={`flex-1 py-2.5 text-center transition-all flex items-center justify-center gap-1 ${
              tab === 'admin'
                ? 'border-b-2 border-amber-400 text-amber-400 font-bold'
                : 'text-amber-400/60 hover:text-amber-400'
            }`}
          >
            <Shield className="w-3 h-3" />
            <span>Admin</span>
          </button>
        </div>

        {/* Feedback Alerts */}
        {authError && (
          <div className="mb-4 p-3 rounded-xl bg-brand-crimson/20 border border-brand-crimson/40 text-brand-crimson text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{authError}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Tab 1: Password Login */}
        {tab === 'login' && (
          <form onSubmit={loginForm.handleSubmit(handleLoginSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-brand-ivory/80 mb-1.5">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  {...loginForm.register('email')}
                  placeholder="patron@example.com"
                  className="w-full bg-brand-purple/50 border border-brand-gold/30 rounded-xl py-2.5 pl-10 pr-4 text-sm text-brand-ivory focus:outline-none focus:border-brand-gold"
                />
                <Mail className="w-4 h-4 text-brand-gold absolute left-3.5 top-3" />
              </div>
              {loginForm.formState.errors.email && (
                <p className="text-[11px] text-brand-crimson mt-1">{loginForm.formState.errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-brand-ivory/80 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type="password"
                  {...loginForm.register('password')}
                  placeholder="••••••••"
                  className="w-full bg-brand-purple/50 border border-brand-gold/30 rounded-xl py-2.5 pl-10 pr-4 text-sm text-brand-ivory focus:outline-none focus:border-brand-gold"
                />
                <Lock className="w-4 h-4 text-brand-gold absolute left-3.5 top-3" />
              </div>
              {loginForm.formState.errors.password && (
                <p className="text-[11px] text-brand-crimson mt-1">{loginForm.formState.errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoginLoading}
              className="w-full mt-2 bg-gradient-to-r from-brand-gold via-brand-gold-light to-brand-gold-dark text-brand-purple-dark font-serif font-bold py-3 rounded-xl hover:brightness-110 shadow-lg text-sm transition-all"
            >
              {isLoginLoading ? 'Authenticating...' : 'Sign In as Patron'}
            </button>
          </form>
        )}

        {/* Tab 2: Register */}
        {tab === 'register' && (
          <form onSubmit={registerForm.handleSubmit(handleRegisterSubmit)} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-brand-ivory/80 mb-1">First Name</label>
                <input
                  type="text"
                  {...registerForm.register('firstName')}
                  placeholder="Aditi"
                  className="w-full bg-brand-purple/50 border border-brand-gold/30 rounded-xl py-2 px-3 text-sm text-brand-ivory focus:outline-none focus:border-brand-gold"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-brand-ivory/80 mb-1">Last Name</label>
                <input
                  type="text"
                  {...registerForm.register('lastName')}
                  placeholder="Sharma"
                  className="w-full bg-brand-purple/50 border border-brand-gold/30 rounded-xl py-2 px-3 text-sm text-brand-ivory focus:outline-none focus:border-brand-gold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-brand-ivory/80 mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  {...registerForm.register('email')}
                  placeholder="aditi@example.com"
                  className="w-full bg-brand-purple/50 border border-brand-gold/30 rounded-xl py-2 pl-9 pr-3 text-sm text-brand-ivory focus:outline-none focus:border-brand-gold"
                />
                <Mail className="w-3.5 h-3.5 text-brand-gold absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-brand-ivory/80 mb-1">Phone (Optional)</label>
              <div className="relative">
                <input
                  type="tel"
                  {...registerForm.register('phone')}
                  placeholder="+91 98765 43210"
                  className="w-full bg-brand-purple/50 border border-brand-gold/30 rounded-xl py-2 pl-9 pr-3 text-sm text-brand-ivory focus:outline-none focus:border-brand-gold"
                />
                <Phone className="w-3.5 h-3.5 text-brand-gold absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-brand-ivory/80 mb-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  {...registerForm.register('password')}
                  placeholder="••••••••"
                  className="w-full bg-brand-purple/50 border border-brand-gold/30 rounded-xl py-2 pl-9 pr-3 text-sm text-brand-ivory focus:outline-none focus:border-brand-gold"
                />
                <Lock className="w-3.5 h-3.5 text-brand-gold absolute left-3 top-2.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isRegisterLoading}
              className="w-full mt-2 bg-gradient-to-r from-brand-gold to-brand-gold-dark text-brand-purple-dark font-serif font-bold py-3 rounded-xl hover:brightness-110 shadow-lg text-sm"
            >
              {isRegisterLoading ? 'Creating Account...' : 'Complete Registration'}
            </button>
          </form>
        )}

        {/* Tab 3: OTP Login */}
        {tab === 'otp' && (
          <div className="space-y-4">
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-brand-ivory/80 mb-1">
                    Enter Email or Mobile
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={otpIdentifier}
                      onChange={(e) => setOtpIdentifier(e.target.value)}
                      placeholder="you@domain.com or 9876543210"
                      className="w-full bg-brand-purple/50 border border-brand-gold/30 rounded-xl py-2.5 pl-10 pr-4 text-sm text-brand-ivory focus:outline-none focus:border-brand-gold"
                      required
                    />
                    <KeyRound className="w-4 h-4 text-brand-gold absolute left-3 top-3" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isOtpRequestLoading}
                  className="w-full bg-gradient-to-r from-brand-gold to-brand-gold-dark text-brand-purple-dark font-serif font-bold py-3 rounded-xl hover:brightness-110 shadow-lg text-sm"
                >
                  {isOtpRequestLoading ? 'Sending Code...' : 'Send Verification Code'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-brand-ivory/80 mb-1">
                    6-Digit Security Code sent to {otpIdentifier}
                  </label>
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="123456"
                    maxLength={6}
                    className="w-full text-center tracking-widest font-mono text-xl bg-brand-purple/50 border border-brand-gold/30 rounded-xl py-2.5 px-4 text-brand-gold focus:outline-none focus:border-brand-gold"
                    required
                  />
                  {debugOtp && (
                    <p className="text-[11px] text-brand-gold-light mt-1 text-center">
                      (Development OTP: <span className="font-bold underline">{debugOtp}</span>)
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => { setOtpSent(false); setOtpCode(''); }}
                    className="flex-1 border border-brand-gold/30 py-2.5 rounded-xl text-xs text-brand-ivory/70 hover:bg-white/5"
                  >
                    Change Number
                  </button>
                  <button
                    type="submit"
                    disabled={isOtpVerifyLoading}
                    className="flex-1 bg-gradient-to-r from-brand-gold to-brand-gold-dark text-brand-purple-dark font-bold py-2.5 rounded-xl text-xs hover:brightness-110 shadow"
                  >
                    {isOtpVerifyLoading ? 'Verifying...' : 'Verify & Sign In'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Tab 4: Admin Portal Login */}
        {tab === 'admin' && (
          <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs">
              <p className="font-semibold flex items-center gap-1.5 mb-1">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                Vastraloom Atelier Management System
              </p>
              <p className="text-[11px] text-amber-200/80">
                Authorized administrators have full control over catalog inventory, client orders, and patron directories.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-amber-300 mb-1">Admin Email</label>
              <div className="relative">
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@vastraloom.com"
                  className="w-full bg-brand-purple/60 border border-amber-500/40 rounded-xl py-2.5 pl-10 pr-4 text-sm text-brand-ivory focus:outline-none focus:border-amber-400"
                  required
                />
                <Shield className="w-4 h-4 text-amber-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-amber-300 mb-1">Admin Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-brand-purple/60 border border-amber-500/40 rounded-xl py-2.5 pl-10 pr-4 text-sm text-brand-ivory focus:outline-none focus:border-amber-400"
                  required
                />
                <Lock className="w-4 h-4 text-amber-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-[11px] text-brand-ivory/60">
                Demo: <span className="text-amber-300 font-mono">admin@vastraloom.com</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  setAdminEmail('admin@vastraloom.com');
                  setAdminPassword('Admin@123');
                }}
                className="text-[11px] text-amber-400 hover:underline cursor-pointer"
              >
                Quick-Fill Demo Credentials
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoginLoading}
              className="w-full mt-2 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-brand-purple-dark font-serif font-bold py-3 rounded-xl hover:brightness-110 shadow-lg text-sm transition-all flex items-center justify-center gap-2"
            >
              <span>Authenticate as Administrator</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* SSO Social Logins Section (shown on login & register) */}
        {(tab === 'login' || tab === 'register') && (
          <div className="mt-6 pt-5 border-t border-brand-gold/15">
            <div className="relative text-center mb-4">
              <span className="bg-[#140A1F] px-3 text-[11px] text-brand-ivory/50 font-sans uppercase tracking-widest relative z-10">
                Or Continue With
              </span>
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-brand-gold/15" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleSSO('google')}
                className="flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-brand-gold/30 hover:border-brand-gold bg-brand-purple/40 hover:bg-brand-purple/70 text-xs font-medium text-brand-ivory transition-all shadow-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5c1.56 0 2.97.55 4.09 1.45l3.07-3.07C17.3 1.63 14.83 1 12 1 7.48 1 3.65 3.58 1.76 7.35l3.66 2.84C6.3 7.39 8.92 5 12 5z"/>
                  <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.68 2.85c2.15-1.99 3.74-4.91 3.74-8.67z"/>
                  <path fill="#FBBC05" d="M5.42 14.81c-.24-.71-.38-1.47-.38-2.26s.14-1.55.38-2.26L1.76 7.35C.64 9.58 0 12.06 0 14.69c0 2.63.64 5.11 1.76 7.34l3.66-2.84z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.68-2.85c-1.07.72-2.45 1.16-4.25 1.16-3.08 0-5.7-2.39-6.58-5.19L1.76 17.05C3.65 20.82 7.48 24 12 24z"/>
                </svg>
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={() => handleSSO('facebook')}
                className="flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-brand-gold/30 hover:border-brand-gold bg-brand-purple/40 hover:bg-brand-purple/70 text-xs font-medium text-brand-ivory transition-all shadow-sm"
              >
                <svg className="w-4 h-4 text-[#1877F2] fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669c1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Facebook</span>
              </button>
            </div>
          </div>
        )}

        {/* Quick Admin Portal Access link at bottom if not in admin tab */}
        {tab !== 'admin' && (
          <div className="mt-4 pt-3 text-center border-t border-brand-gold/10">
            <button
              onClick={() => { setTab('admin'); setAuthError(null); }}
              className="text-xs text-amber-400/80 hover:text-amber-400 inline-flex items-center gap-1.5 transition-colors"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Are you a curator? Access Atelier Admin Portal</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
