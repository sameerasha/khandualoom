import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

export const PromotionalHeroBanner: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#170524] via-[#2A0845] to-[#170524] border-y border-brand-gold/20 py-10 px-4 sm:px-6 lg:px-8 my-6">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Left: Campaign Headline & Story */}
        <div className="text-center lg:text-left max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/15 border border-brand-gold/30 text-brand-gold text-xs font-semibold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>FESTIVAL OF AUTHENTIC PATAS</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl text-brand-gold font-bold tracking-tight leading-tight">
            RIGHT TO HERITAGE SALE
          </h2>
          <p className="text-xl sm:text-2xl text-brand-gold-light/95 font-serif mt-2">
            Celebrate Odisha. Celebrate Master Handlooms.
          </p>
          <p className="text-sm text-brand-ivory/75 mt-3 max-w-md">
            Directly from master weavers of Nuapatna, Bargarh, and Sonepur. Handwoven with mulberry and tussar silks.
          </p>

          {/* Dual CTAs matching Myntra benchmark */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-6">
            <button
              type="button"
              onClick={() => navigate('/collections/Khandua%20Pata')}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-brand-gold to-brand-gold-light text-brand-purple-dark font-bold text-xs uppercase tracking-widest hover:shadow-[0_0_20px_rgba(197,160,89,0.5)] transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Bridal Pata</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => navigate('/collections/Sambalpuri')}
              className="px-6 py-3 rounded-full border border-brand-gold/50 text-brand-gold font-bold text-xs uppercase tracking-widest hover:bg-brand-gold/10 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Daily Handlooms</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right: Discount Callout & Visual */}
        <div className="relative text-center p-8 rounded-2xl bg-[#1A0A2C]/80 border border-brand-gold/25 backdrop-blur-md shadow-2xl min-w-[280px]">
          <span className="text-xs uppercase tracking-widest text-brand-gold-light/80 block mb-1">
            Heritage Festival Specials
          </span>
          <span className="font-serif text-5xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-gold via-brand-gold-light to-brand-gold">
            20–50%
          </span>
          <span className="text-xl font-serif text-brand-ivory block mt-1">OFF</span>
          <p className="text-xs text-brand-ivory/60 mt-2">Silk Mark & GI Certified Sarees</p>
        </div>
      </div>
    </section>
  );
};
