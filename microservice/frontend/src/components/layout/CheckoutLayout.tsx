import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { ShieldCheck, Lock } from 'lucide-react';
import { ThemeSwitcher } from '@/theme/ThemeSwitcher';
import { useTheme } from '@/theme/useTheme';

export const CheckoutLayout: React.FC = () => {
  const location = useLocation();
  const { isDark } = useTheme();

  // Determine current active step based on path or default to delivery
  const isPayment = location.pathname.includes('/payment');
  const isSuccess = location.pathname.includes('/success');

  return (
    <div
      className={`min-h-screen flex flex-col font-sans selection:bg-teal-500 selection:text-white relative transition-colors ${
        isDark ? 'bg-[#0F0617] text-brand-ivory' : 'bg-[#FDFDFD] text-gray-800'
      }`}
    >
      {/* Myntra-Style Stepper Header */}
      <header
        role="banner"
        className={`sticky top-0 z-40 shadow-xs border-b transition-colors ${
          isDark ? 'bg-[#12051E] border-brand-gold/25' : 'bg-white border-gray-200'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <span
              className={`font-serif text-2xl font-black tracking-wider transition-colors ${
                isDark
                  ? 'text-brand-gold group-hover:text-brand-gold-light'
                  : 'text-rose-900 group-hover:text-rose-700'
              }`}
            >
              KHANDUA LOOMS
            </span>
          </Link>

          {/* Stepper matching reference screenshot */}
          {!isSuccess && (
            <div className="hidden md:flex items-center gap-3 text-xs tracking-widest font-semibold uppercase">
              <Link
                to="/cart"
                className={`transition-colors ${
                  isDark ? 'text-gray-400 hover:text-brand-gold' : 'text-gray-400 hover:text-gray-700'
                }`}
              >
                BAG
              </Link>
              <span className={isDark ? 'text-gray-600' : 'text-gray-300'}>----------</span>
              <span
                className={`transition-colors pb-1 ${
                  !isPayment
                    ? isDark
                      ? 'text-teal-400 font-bold border-b-2 border-teal-400'
                      : 'text-teal-600 font-bold border-b-2 border-teal-600'
                    : 'text-gray-400'
                }`}
              >
                DELIVERY
              </span>
              <span className={isDark ? 'text-gray-600' : 'text-gray-300'}>----------</span>
              <span
                className={`transition-colors pb-1 ${
                  isPayment
                    ? isDark
                      ? 'text-teal-400 font-bold border-b-2 border-teal-400'
                      : 'text-teal-600 font-bold border-b-2 border-teal-600'
                    : 'text-gray-400'
                }`}
              >
                PAYMENT
              </span>
            </div>
          )}

          {/* Right Header: Security Guarantee Badge & Theme Switcher */}
          <div className="flex items-center gap-4">
            <div
              className={`flex items-center gap-1.5 font-bold text-xs tracking-wider uppercase ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              <Lock className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>100% SECURE</span>
            </div>

            <ThemeSwitcher />
          </div>
        </div>
      </header>

      {/* Main Checkout View Area */}
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <Outlet />
      </main>

      {/* Trust Footer matching reference screenshot */}
      <footer
        role="contentinfo"
        className={`border-t py-6 text-xs mt-auto transition-colors ${
          isDark
            ? 'border-brand-gold/20 bg-[#12051E] text-gray-400'
            : 'border-gray-200 bg-white text-gray-600'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Payment & Security Logos */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <div
              className={`flex items-center gap-1 text-[11px] font-semibold border px-2 py-1 rounded ${
                isDark
                  ? 'border-brand-gold/30 bg-[#1C0D2E] text-gray-300'
                  : 'border-gray-200 bg-gray-50 text-gray-500'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>256-bit SSL</span>
            </div>
            <span
              className={`font-bold text-xs tracking-tighter px-2 py-1 border rounded ${
                isDark
                  ? 'border-brand-gold/30 bg-[#1C0D2E] text-sky-400'
                  : 'border-gray-200 bg-white text-blue-800'
              }`}
            >
              VISA
            </span>
            <span
              className={`font-bold text-xs px-2 py-1 border rounded ${
                isDark
                  ? 'border-brand-gold/30 bg-[#1C0D2E] text-rose-400'
                  : 'border-gray-200 bg-white text-red-600'
              }`}
            >
              Mastercard
            </span>
            <span
              className={`font-bold text-xs px-2 py-1 border rounded ${
                isDark
                  ? 'border-brand-gold/30 bg-[#1C0D2E] text-sky-300'
                  : 'border-gray-200 bg-white text-sky-700'
              }`}
            >
              AMEX
            </span>
            <span
              className={`font-semibold text-xs px-2 py-1 border rounded ${
                isDark
                  ? 'border-brand-gold/30 bg-[#1C0D2E] text-gray-300'
                  : 'border-gray-200 bg-white text-gray-700'
              }`}
            >
              Diners Club
            </span>
            <span
              className={`font-medium text-xs px-2 py-1 border rounded ${
                isDark
                  ? 'border-brand-gold/30 bg-[#1C0D2E] text-gray-300'
                  : 'border-gray-200 bg-white text-gray-700'
              }`}
            >
              Net Banking
            </span>
            <span
              className={`font-medium text-xs px-2 py-1 border rounded ${
                isDark
                  ? 'border-emerald-800/40 bg-emerald-950/20 text-emerald-300'
                  : 'border-emerald-200 bg-emerald-50 text-emerald-700'
              }`}
            >
              UPI & Cash on Delivery
            </span>
          </div>

          <div
            className={`flex items-center gap-2 text-xs font-semibold ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            <span>Need Help?</span>
            <Link
              to="/contact"
              className={`hover:underline font-bold ${
                isDark ? 'text-brand-gold' : 'text-teal-700'
              }`}
            >
              Contact Us
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
