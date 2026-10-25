import React from 'react';
import {
  Heart,
  Mail,
  Phone,
  MapPin,
  Instagram,
  Facebook,
  Share2,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { LegalDocType } from './LegalModal';

interface FooterProps {
  onOpenLegal?: (doc: LegalDocType) => void;
  onOpenContact?: () => void;
  onOpenSocial?: () => void;
  onNavigateHeritage?: () => void;
  onSelectCategory?: (category: string) => void;
  onNavigateHome?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenLegal,
  onOpenContact,
  onOpenSocial,
  onNavigateHeritage,
  onSelectCategory,
  onNavigateHome,
}) => {
  const handleScrollTo = (elementId: string) => {
    const el = document.getElementById(elementId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else if (onNavigateHome) {
      onNavigateHome();
      setTimeout(() => {
        document.getElementById(elementId)?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    }
  };

  return (
    <footer className="bg-[#090210] relative z-20 text-brand-ivory border-t-2 border-brand-gold/40 shadow-[0_-20px_50px_rgba(0,0,0,0.95)] pt-14 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Concierge & Support Advisory Bar */}
        <div className="mb-12 p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-[#170624] via-[#10031B] to-[#170624] border border-brand-gold/35 shadow-[0_10px_35px_rgba(0,0,0,0.7)] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-brand-gold/15 border border-brand-gold/40 flex items-center justify-center text-brand-gold shrink-0 shadow-inner">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-lg sm:text-xl font-bold text-white tracking-wide">
                Khandua Looms Customer Advisory & Support
              </h4>
              <p className="text-xs text-brand-ivory/70 mt-1 max-w-xl leading-relaxed">
                Connect with our dedicated saree specialists for weave consultations, bridal orders, or care guidance for authentic Odisha handlooms.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 shrink-0">
            <button
              onClick={onOpenContact}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-gold via-amber-400 to-brand-gold text-brand-purple-dark text-xs font-bold uppercase tracking-wider shadow-[0_4px_16px_rgba(223,191,122,0.35)] hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Contact Us</span>
            </button>
            <button
              onClick={onOpenSocial}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.05] hover:bg-brand-gold/15 border border-brand-gold/30 hover:border-brand-gold text-brand-gold hover:text-white text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Community Stories</span>
            </button>
          </div>
        </div>

        {/* 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-brand-gold/20">
          
          {/* Brand Info & Tagline */}
          <div className="space-y-4">
            <div
              className="flex items-center gap-3 cursor-pointer group select-none w-fit"
              onClick={() => {
                if (onNavigateHome) {
                  onNavigateHome();
                } else {
                  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                }
              }}
              title="Khandua Looms • Return to Home"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-gold to-brand-gold-dark p-0.5">
                <div className="w-full h-full rounded-full bg-[#12051E] flex items-center justify-center">
                  <img
                    src="/logo.svg"
                    alt="Khandua Looms Logo"
                    className="w-5 h-5 object-contain"
                  />
                </div>
              </div>
              <span className="font-serif text-xl tracking-wider text-brand-gold font-bold transition-colors group-hover:text-brand-gold-light">
                KHADUA LOOMS
              </span>
            </div>
            <p className="text-xs text-brand-gold-light/90 italic font-serif">
              Woven in Tradition. Wrapped in Elegance.
            </p>
            <p className="text-xs text-brand-ivory/80 leading-relaxed font-light">
              Celebrating authentic Odisha handloom sarees. Our collection brings together traditional Khadua, Sambalpuri Ikat, Bomkai, and tribal village weaves for women who cherish cultural artistry.
            </p>

            {/* Social Links */}
            <div className="pt-2 space-y-2.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-brand-gold/70 block">
                Follow Our Weaves
              </span>
              <div className="flex items-center gap-2.5">
                <button
                  onClick={onOpenSocial}
                  className="w-8 h-8 rounded-full border border-brand-gold/30 flex items-center justify-center text-brand-gold hover:text-white hover:border-brand-gold hover:bg-brand-gold/20 transition-all cursor-pointer"
                  title="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </button>
                <button
                  onClick={onOpenSocial}
                  className="w-8 h-8 rounded-full border border-brand-gold/30 flex items-center justify-center text-brand-gold hover:text-white hover:border-brand-gold hover:bg-brand-gold/20 transition-all cursor-pointer"
                  title="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Shop Sarees & Collections */}
          <div>
            <h4 className="font-serif font-bold text-sm text-brand-gold mb-4 uppercase tracking-wider">
              Shop Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-brand-ivory/85">
              <li>
                <button
                  onClick={() => onSelectCategory?.('Khadua Silk')}
                  className="hover:text-brand-gold transition-colors text-left cursor-pointer"
                >
                  Khadua Silk Sarees
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory?.('Sambalpuri Ikat')}
                  className="hover:text-brand-gold transition-colors text-left cursor-pointer"
                >
                  Sambalpuri Ikat Sarees
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory?.('Bomkai')}
                  className="hover:text-brand-gold transition-colors text-left cursor-pointer"
                >
                  Bomkai Sarees
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory?.('Wedding & Bridal')}
                  className="hover:text-brand-gold transition-colors text-left cursor-pointer"
                >
                  Wedding & Bridal Sarees
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory?.('Festive Collection')}
                  className="hover:text-brand-gold transition-colors text-left cursor-pointer"
                >
                  Festive Collection
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory?.('Traditional Odisha Handlooms')}
                  className="hover:text-brand-gold transition-colors text-left cursor-pointer"
                >
                  Traditional Odisha Handlooms
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care & Policies */}
          <div>
            <h4 className="font-serif font-bold text-sm text-brand-gold mb-4 uppercase tracking-wider">
              Customer Information
            </h4>
            <ul className="space-y-2.5 text-xs text-brand-ivory/85">
              <li>
                <button
                  onClick={onNavigateHeritage ? onNavigateHeritage : () => handleScrollTo('heritage-section')}
                  className="hover:text-brand-gold transition-colors text-left cursor-pointer"
                >
                  About Us & Our Heritage
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScrollTo('why-us-section')}
                  className="hover:text-brand-gold transition-colors text-left cursor-pointer"
                >
                  Why Khandua Looms
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenContact}
                  className="hover:text-brand-gold transition-colors text-left cursor-pointer"
                >
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal?.('returns')}
                  className="hover:text-brand-gold transition-colors text-left cursor-pointer"
                >
                  Shipping & Delivery Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal?.('returns')}
                  className="hover:text-brand-gold transition-colors text-left cursor-pointer"
                >
                  Returns & Refunds Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal?.('privacy')}
                  className="hover:text-brand-gold transition-colors text-left cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal?.('terms')}
                  className="hover:text-brand-gold transition-colors text-left cursor-pointer"
                >
                  Terms and Conditions
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details & Direct Help Desk */}
          <div>
            <h4 className="font-serif font-bold text-sm text-brand-gold mb-4 uppercase tracking-wider flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-brand-gold" />
              <span>Contact Us</span>
            </h4>
            <ul className="space-y-3 text-xs text-brand-ivory/85">
              <li
                onClick={onOpenContact}
                className="flex items-start gap-2.5 cursor-pointer hover:text-brand-gold transition-colors"
              >
                <MapPin className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                <span>Odisha Handloom Retail Pavilion, Janpath, Bhubaneswar, Odisha 751001</span>
              </li>
              <li
                onClick={onOpenContact}
                className="flex items-center gap-2.5 cursor-pointer hover:text-brand-gold transition-colors"
              >
                <Phone className="w-4 h-4 text-brand-gold shrink-0" />
                <span>+91 (0) 674 291 8844</span>
              </li>
              <li
                onClick={onOpenContact}
                className="flex items-center gap-2.5 cursor-pointer hover:text-brand-gold transition-colors"
              >
                <Mail className="w-4 h-4 text-brand-gold shrink-0" />
                <span>support@khandualoom.com</span>
              </li>
            </ul>
            <button
              onClick={onOpenContact}
              className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-purple-dark bg-gradient-to-r from-brand-gold via-amber-400 to-brand-gold px-4 py-2 rounded-xl shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Customer Help Desk</span>
            </button>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-brand-ivory/50 gap-4">
          <p>© 2026 Khandua Looms. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Handcrafted with <Heart className="w-3.5 h-3.5 text-brand-crimson fill-current inline" /> for Authentic Odisha Weaves
          </p>
        </div>
      </div>
    </footer>
  );
};
