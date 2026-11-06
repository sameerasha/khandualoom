import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

export const CheckoutLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0F0617] text-brand-ivory flex flex-col selection:bg-brand-gold selection:text-brand-purple-dark relative">
      {/* Minimal Stepper Header */}
      <header role="banner" className="border-b border-brand-gold/15 bg-[#170B24]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <span className="font-serif text-2xl font-bold tracking-wider text-brand-gold">
              KHANDUA LOOMS
            </span>
          </Link>

          {/* Stepper Label */}
          <div className="hidden md:flex items-center gap-4 text-xs font-medium tracking-widest uppercase">
            <span className="text-brand-ivory/60">BAG</span>
            <span className="text-brand-gold/40">────────</span>
            <span className="text-brand-gold font-bold">DELIVERY</span>
            <span className="text-brand-gold/40">────────</span>
            <span className="text-brand-ivory/60">PAYMENT</span>
          </div>

          {/* Security Guarantee Badge */}
          <div className="flex items-center gap-2 text-emerald-400 font-medium text-xs sm:text-sm tracking-wide">
            <ShieldCheck className="w-5 h-5" />
            <span>100% SECURE CHECKOUT</span>
          </div>
        </div>
      </header>

      {/* Main Checkout View Area */}
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>

      {/* Minimal Trust Footer */}
      <footer role="contentinfo" className="border-t border-brand-gold/15 py-6 bg-[#13071F] text-xs text-brand-ivory/60">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Khandua Looms. Authenticated Heritage Handlooms of Odisha.</p>
          <div className="flex items-center gap-6">
            <span>256-bit SSL Encryption</span>
            <span>Verified Artisan Direct</span>
            <span>Easy 7-Day Returns</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
