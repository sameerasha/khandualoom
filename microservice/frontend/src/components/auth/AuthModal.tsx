import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Lock, Mail, User as UserIcon, Phone, KeyRound, Sparkles, AlertCircle } from 'lucide-react';
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

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const [tab, setTab] = useState<'login' | 'register' | 'otp'>('login');
  const [authError, setAuthError] = useState<string | null>(null);

  // OTP state
  const [otpIdentifier, setOtpIdentifier] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [debugOtp, setDebugOtp] = useState<string | null>(null);

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
    } catch (err: any) {
      setAuthError(err?.data?.message || 'Invalid email or password');
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
      onClose();
    } catch (err: any) {
      setAuthError(err?.data?.message || 'Registration failed. Email may already exist.');
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpIdentifier.trim()) return;
    setAuthError(null);
    try {
      const res = await requestOtpMutation({
        emailOrPhone: otpIdentifier.trim(),
        channel: 'EMAIL',
      }).unwrap();
      setOtpSent(true);
      if (res.debugOtp) {
        setDebugOtp(res.debugOtp);
      }
    } catch (err: any) {
      setAuthError(err?.data?.message || 'Failed to send OTP. Please try again.');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim()) return;
    setAuthError(null);
    try {
      const res = await verifyOtpMutation({
        emailOrPhone: otpIdentifier.trim(),
        code: otpCode.trim(),
      }).unwrap();
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
      setAuthError(err?.data?.message || 'Invalid or expired OTP');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-brand-purple-dark border border-brand-gold/30 rounded-3xl p-8 text-brand-ivory shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-brand-gold hover:text-white p-1 rounded-full hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full border border-brand-gold/40 flex items-center justify-center mx-auto mb-3 bg-brand-purple">
            <Sparkles className="w-6 h-6 text-brand-gold" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-brand-gold">
            Vastraloom Atelier
          </h3>
          <p className="text-xs text-brand-ivory/60 mt-1">
            Access your curated handloom collection & orders
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-brand-gold/20 mb-6 text-xs font-semibold">
          <button
            onClick={() => { setTab('login'); setAuthError(null); }}
            className={`flex-1 py-2 text-center border-b-2 transition-colors ${
              tab === 'login'
                ? 'border-brand-gold text-brand-gold font-bold'
                : 'border-transparent text-brand-ivory/60 hover:text-brand-ivory'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setTab('register'); setAuthError(null); }}
            className={`flex-1 py-2 text-center border-b-2 transition-colors ${
              tab === 'register'
                ? 'border-brand-gold text-brand-gold font-bold'
                : 'border-transparent text-brand-ivory/60 hover:text-brand-ivory'
            }`}
          >
            Create Account
          </button>
          <button
            onClick={() => { setTab('otp'); setAuthError(null); }}
            className={`flex-1 py-2 text-center border-b-2 transition-colors ${
              tab === 'otp'
                ? 'border-brand-gold text-brand-gold font-bold'
                : 'border-transparent text-brand-ivory/60 hover:text-brand-ivory'
            }`}
          >
            Instant OTP
          </button>
        </div>

        {/* Error Alert */}
        {authError && (
          <div className="mb-4 p-3 rounded-xl bg-brand-crimson/20 border border-brand-crimson/40 text-brand-crimson text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{authError}</span>
          </div>
        )}

        {/* Tab 1: Email + Password Login */}
        {tab === 'login' && (
          <form onSubmit={loginForm.handleSubmit(handleLoginSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-brand-ivory/80 mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  {...loginForm.register('email')}
                  placeholder="name@example.com"
                  className="w-full bg-brand-purple/60 border border-brand-gold/30 rounded-xl py-2.5 pl-10 pr-4 text-sm text-brand-ivory placeholder-brand-ivory/40 focus:outline-none focus:border-brand-gold"
                />
                <Mail className="w-4 h-4 text-brand-gold absolute left-3 top-3" />
              </div>
              {loginForm.formState.errors.email && (
                <p className="text-[11px] text-brand-crimson mt-1">
                  {loginForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-brand-ivory/80 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  {...loginForm.register('password')}
                  placeholder="••••••••"
                  className="w-full bg-brand-purple/60 border border-brand-gold/30 rounded-xl py-2.5 pl-10 pr-4 text-sm text-brand-ivory placeholder-brand-ivory/40 focus:outline-none focus:border-brand-gold"
                />
                <Lock className="w-4 h-4 text-brand-gold absolute left-3 top-3" />
              </div>
              {loginForm.formState.errors.password && (
                <p className="text-[11px] text-brand-crimson mt-1">
                  {loginForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoginLoading}
              className="w-full mt-2 bg-gradient-to-r from-brand-gold to-brand-gold-dark text-brand-purple-dark font-serif font-bold py-3 rounded-xl hover:brightness-110 shadow-lg text-sm flex items-center justify-center"
            >
              {isLoginLoading ? 'Authenticating...' : 'Sign In to Vastraloom'}
            </button>
          </form>
        )}

        {/* Tab 2: Register Account */}
        {tab === 'register' && (
          <form onSubmit={registerForm.handleSubmit(handleRegisterSubmit)} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-brand-ivory/80 mb-1">First Name</label>
                <div className="relative">
                  <input
                    type="text"
                    {...registerForm.register('firstName')}
                    placeholder="Aditi"
                    className="w-full bg-brand-purple/60 border border-brand-gold/30 rounded-xl py-2 pl-9 pr-3 text-sm text-brand-ivory focus:outline-none focus:border-brand-gold"
                  />
                  <UserIcon className="w-3.5 h-3.5 text-brand-gold absolute left-3 top-2.5" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-brand-ivory/80 mb-1">Last Name</label>
                <input
                  type="text"
                  {...registerForm.register('lastName')}
                  placeholder="Sharma"
                  className="w-full bg-brand-purple/60 border border-brand-gold/30 rounded-xl py-2 px-3 text-sm text-brand-ivory focus:outline-none focus:border-brand-gold"
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
                  className="w-full bg-brand-purple/60 border border-brand-gold/30 rounded-xl py-2 pl-9 pr-3 text-sm text-brand-ivory focus:outline-none focus:border-brand-gold"
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
                  className="w-full bg-brand-purple/60 border border-brand-gold/30 rounded-xl py-2 pl-9 pr-3 text-sm text-brand-ivory focus:outline-none focus:border-brand-gold"
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
                  className="w-full bg-brand-purple/60 border border-brand-gold/30 rounded-xl py-2 pl-9 pr-3 text-sm text-brand-ivory focus:outline-none focus:border-brand-gold"
                />
                <Lock className="w-3.5 h-3.5 text-brand-gold absolute left-3 top-2.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isRegisterLoading}
              className="w-full mt-3 bg-gradient-to-r from-brand-gold to-brand-gold-dark text-brand-purple-dark font-serif font-bold py-3 rounded-xl hover:brightness-110 shadow-lg text-sm"
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
                      className="w-full bg-brand-purple/60 border border-brand-gold/30 rounded-xl py-2.5 pl-10 pr-4 text-sm text-brand-ivory focus:outline-none focus:border-brand-gold"
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
                  {isOtpRequestLoading ? 'Sending...' : 'Send Verification Code'}
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
                    className="w-full text-center tracking-widest font-mono text-xl bg-brand-purple/60 border border-brand-gold/30 rounded-xl py-2.5 px-4 text-brand-gold focus:outline-none focus:border-brand-gold"
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
      </div>
    </div>
  );
};
