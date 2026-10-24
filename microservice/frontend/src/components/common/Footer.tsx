import React from 'react';
import {
  Heart,
  Mail,
  Phone,
  MapPin,
  Instagram,
  Facebook,
  Youtube,
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
  return (
    <footer className="bg-[#090210] relative z-20 text-brand-ivory border-t-2 border-brand-gold/40 shadow-[0_-20px_50px_rgba(0,0,0,0.95)] pt-14 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* VIP Royal Concierge & Patron Community Bar */}
        <div className="mb-12 p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-[#170624] via-[#10031B] to-[#170624] border border-brand-gold/35 shadow-[0_10px_35px_rgba(0,0,0,0.7)] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-brand-gold/15 border border-brand-gold/40 flex items-center justify-center text-brand-gold shrink-0 shadow-inner">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-lg sm:text-xl font-bold text-white tracking-wide">
                Royal Atelier Concierge & Patron Community
              </h4>
              <p className="text-xs text-brand-ivory/70 mt-1 max-w-xl leading-relaxed">
                Experience bespoke royal advisory for heirloom drapes, custom zari commissioning, or join our global salon of saree connoisseurs and weavers.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 shrink-0">
            <button
              onClick={onOpenContact}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-gold via-amber-400 to-brand-gold text-brand-purple-dark text-xs font-bold uppercase tracking-wider shadow-[0_4px_16px_rgba(223,191,122,0.35)] hover:brightness-110 active:scale-95 transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Contact Royal Concierge</span>
            </button>
            <button
              onClick={onOpenSocial}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.05] hover:bg-brand-gold/15 border border-brand-gold/30 hover:border-brand-gold text-brand-gold hover:text-white text-xs font-semibold uppercase tracking-wider transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Community</span>
            </button>
          </div>
        </div>

        {/* 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-brand-gold/20">
          
          {/* Brand Info & Community */}
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
              title="Return to Home"
            >
              <img
                src="/logo.svg"
                alt="Vastraloom Imperial Logo"
                className="w-10 h-10 object-contain drop-shadow-[0_2px_8px_rgba(197,160,89,0.35)] transition-transform duration-300 group-hover:scale-105"
              />
              <span className="font-serif text-xl tracking-wider text-brand-gold font-bold transition-colors group-hover:text-brand-gold-light">
                VASTRALOOM
              </span>
            </div>
            <p className="text-xs text-brand-ivory/80 leading-relaxed font-light">
              Preserving Indian loom heritage with authentic, direct-from-weaver handloom Banarasi, Kanjivaram, and Chanderi sarees. Every drape carries centuries of artistic legacy.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-brand-gold-light font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping" />
              <span>Silk Mark India Certified Authenticity</span>
            </div>

            {/* Social Salon Community Link */}
            <div className="pt-2 space-y-2.5">
              <button
                onClick={onOpenSocial}
                className="inline-flex items-center gap-2 text-xs font-semibold text-brand-gold hover:text-white transition-colors group"
              >
                <Share2 className="w-3.5 h-3.5 text-brand-gold group-hover:rotate-12 transition-transform" />
                <span>Patron Stories & Social Salon</span>
              </button>

              <div className="flex items-center gap-2.5 pt-1">
                <button
                  onClick={onOpenSocial}
                  className="w-8 h-8 rounded-full border border-brand-gold/30 flex items-center justify-center text-brand-gold hover:text-white hover:border-brand-gold hover:bg-brand-gold/20 transition-all"
                  title="Instagram Stories"
                >
                  <Instagram className="w-4 h-4" />
                </button>
                <button
                  onClick={onOpenSocial}
                  className="w-8 h-8 rounded-full border border-brand-gold/30 flex items-center justify-center text-brand-gold hover:text-white hover:border-brand-gold hover:bg-brand-gold/20 transition-all"
                  title="Facebook Community"
                >
                  <Facebook className="w-4 h-4" />
                </button>
                <button
                  onClick={onOpenSocial}
                  className="w-8 h-8 rounded-full border border-brand-gold/30 flex items-center justify-center text-brand-gold hover:text-white hover:border-brand-gold hover:bg-brand-gold/20 transition-all"
                  title="YouTube Loom Documentaries"
                >
                  <Youtube className="w-4 h-4" />
                </button>
                <button
                  onClick={onOpenSocial}
                  className="w-8 h-8 rounded-full border border-brand-gold/30 flex items-center justify-center text-brand-gold hover:text-white hover:border-brand-gold hover:bg-brand-gold/20 transition-all"
                  title="Share Community"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Handcrafted Sarees Categories */}
          <div>
            <h4 className="font-serif font-bold text-sm text-brand-gold mb-4 uppercase tracking-wider">
              Handcrafted Sarees
            </h4>
            <ul className="space-y-2.5 text-xs text-brand-ivory/85">
              <li>
                <button
                  onClick={() => onSelectCategory?.('Banarasi')}
                  className="hover:text-brand-gold transition-colors text-left"
                >
                  Royal Banarasi Silk
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory?.('Kanjivaram')}
                  className="hover:text-brand-gold transition-colors text-left"
                >
                  Kanjivaram Silk Sarees
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory?.('Chanderi')}
                  className="hover:text-brand-gold transition-colors text-left"
                >
                  Chanderi & Tussar Weaves
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory?.('All')}
                  className="hover:text-brand-gold transition-colors text-left"
                >
                  Bridal Trousseau Collection
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory?.('All')}
                  className="hover:text-brand-gold transition-colors text-left"
                >
                  New Loom Arrivals
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care / Sanctuary */}
          <div>
            <h4 className="font-serif font-bold text-sm text-brand-gold mb-4 uppercase tracking-wider">
              Customer Sanctuary
            </h4>
            <ul className="space-y-2.5 text-xs text-brand-ivory/85">
              <li>
                <button
                  onClick={onNavigateHeritage}
                  className="hover:text-brand-gold transition-colors text-left"
                >
                  About Our Looms & Manifesto
                </button>
              </li>
              <li>
                <button
                  onClick={onNavigateHeritage}
                  className="hover:text-brand-gold transition-colors text-left"
                >
                  Silk Care & Preservation
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal?.('returns')}
                  className="hover:text-brand-gold transition-colors text-left"
                >
                  Worldwide Shipping & Returns
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal?.('privacy')}
                  className="hover:text-brand-gold transition-colors text-left"
                >
                  Privacy & Data Protection
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal?.('terms')}
                  className="hover:text-brand-gold transition-colors text-left"
                >
                  Terms & Service Guarantees
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal?.('deletion')}
                  className="hover:text-brand-gold transition-colors text-left text-brand-ivory/50"
                >
                  Data Deletion Notice
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details & Direct Atelier Desk */}
          <div>
            <h4 className="font-serif font-bold text-sm text-brand-gold mb-4 uppercase tracking-wider flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-brand-gold" />
              <span>Contact Concierge</span>
            </h4>
            <ul className="space-y-3 text-xs text-brand-ivory/85">
              <li
                onClick={onOpenContact}
                className="flex items-start gap-2.5 cursor-pointer hover:text-brand-gold transition-colors"
              >
                <MapPin className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                <span>124 Chowk Ghat Road, Varanasi, UP 221001</span>
              </li>
              <li
                onClick={onOpenContact}
                className="flex items-center gap-2.5 cursor-pointer hover:text-brand-gold transition-colors"
              >
                <Phone className="w-4 h-4 text-brand-gold shrink-0" />
                <span>+91 (0542) 240-8899</span>
              </li>
              <li
                onClick={onOpenContact}
                className="flex items-center gap-2.5 cursor-pointer hover:text-brand-gold transition-colors"
              >
                <Mail className="w-4 h-4 text-brand-gold shrink-0" />
                <span>concierge@vastraloom.com</span>
              </li>
            </ul>
            <button
              onClick={onOpenContact}
              className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-purple-dark bg-gradient-to-r from-brand-gold via-amber-400 to-brand-gold px-4 py-2 rounded-xl shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Open Concierge Desk</span>
            </button>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-brand-ivory/50 gap-4">
          <p>© {new Date().getFullYear()} Vastraloom Luxury Handloom Pvt. Ltd. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Handcrafted with <Heart className="w-3.5 h-3.5 text-brand-crimson fill-current inline" /> for Indian Master Artisans
          </p>
        </div>
      </div>
    </footer>
  );
};
