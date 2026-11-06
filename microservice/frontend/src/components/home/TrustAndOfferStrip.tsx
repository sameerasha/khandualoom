import React from 'react';
import { Award, ShieldCheck, RefreshCw, Lock, Sparkles } from 'lucide-react';

export const TrustAndOfferStrip: React.FC = () => {
  return (
    <section className="bg-[#140622] border-y border-brand-gold/15 py-4">
      {/* 4 Pillars of Authenticity */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
          <div className="flex items-center justify-center gap-3 p-2">
            <Award className="w-5 h-5 text-brand-gold shrink-0" />
            <div className="text-left">
              <p className="text-xs font-bold uppercase tracking-wider text-brand-gold-light">
                100% HANDLOOM CERTIFIED
              </p>
              <p className="text-[11px] text-brand-ivory/60">Silk Mark & Craftmark verified</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 p-2">
            <ShieldCheck className="w-5 h-5 text-brand-gold shrink-0" />
            <div className="text-left">
              <p className="text-xs font-bold uppercase tracking-wider text-brand-gold-light">
                GI TAG AUTHENTICATED
              </p>
              <p className="text-[11px] text-brand-ivory/60">Direct from Odisha Weavers</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 p-2">
            <RefreshCw className="w-5 h-5 text-brand-gold shrink-0" />
            <div className="text-left">
              <p className="text-xs font-bold uppercase tracking-wider text-brand-gold-light">
                EASY 7-DAY RETURNS
              </p>
              <p className="text-[11px] text-brand-ivory/60">No questions asked exchange</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 p-2">
            <Lock className="w-5 h-5 text-brand-gold shrink-0" />
            <div className="text-left">
              <p className="text-xs font-bold uppercase tracking-wider text-brand-gold-light">
                100% SECURE PAYMENTS
              </p>
              <p className="text-[11px] text-brand-ivory/60">Razorpay, UPI & Net Banking</p>
            </div>
          </div>
        </div>

        {/* Bank & Payment Discount Ticker */}
        <div className="mt-4 pt-3 border-t border-brand-gold/10 flex items-center justify-center gap-2 overflow-x-auto text-xs text-brand-ivory/80 whitespace-nowrap">
          <Sparkles className="w-4 h-4 text-brand-gold animate-pulse shrink-0" />
          <span className="font-semibold text-brand-gold">BANK OFFERS:</span>
          <span className="bg-brand-purple-dark/80 px-2.5 py-1 rounded border border-brand-gold/20 text-brand-gold-light">
            10% Instant Discount on HDFC Bank Cards
          </span>
          <span className="text-brand-gold/30">•</span>
          <span className="bg-brand-purple-dark/80 px-2.5 py-1 rounded border border-brand-gold/20 text-brand-gold-light">
            10% Instant Discount on Kotak Cards
          </span>
          <span className="text-brand-gold/30">•</span>
          <span className="bg-brand-purple-dark/80 px-2.5 py-1 rounded border border-brand-gold/20 text-brand-gold-light">
            10% Instant Discount on ICICI Credit Cards
          </span>
          <span className="text-brand-gold/30">•</span>
          <span className="bg-brand-purple-dark/80 px-2.5 py-1 rounded border border-brand-gold/20 text-brand-gold-light">
            Flat ₹100 Cashback on Paytm UPI
          </span>
        </div>
      </div>
    </section>
  );
};
