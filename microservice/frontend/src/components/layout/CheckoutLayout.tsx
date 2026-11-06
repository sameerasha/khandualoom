import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { ShieldCheck, Lock, HelpCircle } from 'lucide-react';

export const CheckoutLayout: React.FC = () => {
  const location = useLocation();

  // Determine current active step based on path or default to delivery
  const isPayment = location.pathname.includes('/payment');
  const isSuccess = location.pathname.includes('/success');

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-gray-800 flex flex-col font-sans selection:bg-teal-500 selection:text-white relative">
      {/* Myntra-Style Stepper Header */}
      <header role="banner" className="border-b border-gray-200 bg-white sticky top-0 z-40 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="font-serif text-2xl font-black tracking-wider text-rose-900 group-hover:text-rose-700 transition-colors">
              KHANDUA LOOMS
            </span>
          </Link>

          {/* Stepper matching reference screenshot */}
          {!isSuccess && (
            <div className="hidden md:flex items-center gap-3 text-xs tracking-widest font-semibold uppercase">
              <Link to="/cart" className="text-gray-400 hover:text-gray-700 transition-colors">
                BAG
              </Link>
              <span className="text-gray-300">----------</span>
              <span
                className={`transition-colors pb-1 ${
                  !isPayment
                    ? 'text-teal-600 font-bold border-b-2 border-teal-600'
                    : 'text-gray-400'
                }`}
              >
                DELIVERY
              </span>
              <span className="text-gray-300">----------</span>
              <span
                className={`transition-colors pb-1 ${
                  isPayment
                    ? 'text-teal-600 font-bold border-b-2 border-teal-600'
                    : 'text-gray-400'
                }`}
              >
                PAYMENT
              </span>
            </div>
          )}

          {/* Security Guarantee Badge */}
          <div className="flex items-center gap-1.5 text-gray-600 font-bold text-xs tracking-wider uppercase">
            <Lock className="w-4 h-4 text-teal-600" />
            <span>100% SECURE</span>
          </div>
        </div>
      </header>

      {/* Main Checkout View Area */}
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <Outlet />
      </main>

      {/* Trust Footer matching reference screenshot */}
      <footer role="contentinfo" className="border-t border-gray-200 py-6 bg-white text-xs text-gray-600 mt-auto">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Payment & Security Logos */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-gray-500 border border-gray-200 px-2 py-1 rounded bg-gray-50">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>256-bit SSL</span>
            </div>
            <span className="font-bold text-blue-800 text-xs tracking-tighter px-2 py-1 border border-gray-200 rounded bg-white">
              VISA
            </span>
            <span className="font-bold text-red-600 text-xs px-2 py-1 border border-gray-200 rounded bg-white">
              Mastercard
            </span>
            <span className="font-bold text-sky-700 text-xs px-2 py-1 border border-gray-200 rounded bg-white">
              AMEX
            </span>
            <span className="font-semibold text-gray-700 text-xs px-2 py-1 border border-gray-200 rounded bg-white">
              Diners Club
            </span>
            <span className="font-medium text-gray-700 text-xs px-2 py-1 border border-gray-200 rounded bg-white">
              Net Banking
            </span>
            <span className="font-medium text-emerald-700 text-xs px-2 py-1 border border-emerald-200 rounded bg-emerald-50">
              Cash on Delivery
            </span>
            <span className="font-bold text-teal-700 text-xs px-2 py-1 border border-teal-200 rounded bg-white">
              RuPay
            </span>
          </div>

          {/* Need help contact */}
          <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium hover:text-gray-900 transition-colors">
            <HelpCircle className="w-4 h-4 text-gray-400" />
            <span>Need help ? <a href="mailto:support@khandualoom.com" className="font-semibold text-teal-700 hover:underline">Contact Us</a></span>
          </div>
        </div>
      </footer>
    </div>
  );
};
