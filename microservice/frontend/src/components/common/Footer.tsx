import React from 'react';
import { Sparkles, Heart, Mail, Phone, MapPin, Instagram, Facebook, Youtube, Share2 } from 'lucide-react';
import { LegalDocType } from './LegalModal';

interface FooterProps {
  onOpenLegal?: (doc: LegalDocType) => void;
  onOpenContact?: () => void;
  onOpenSocial?: () => void;
  onNavigateHeritage?: () => void;
  onSelectCategory?: (category: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenLegal,
  onOpenContact,
  onOpenSocial,
  onNavigateHeritage,
  onSelectCategory,
}) => {
  return (
    <footer className="bg-brand-purple-dark text-brand-ivory border-t border-brand-gold/20 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-brand-gold/15">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-gold" />
              <span className="font-serif text-xl tracking-wider text-brand-gold font-bold">
                VASTRALOOM
              </span>
            </div>
            <p className="text-xs text-brand-ivory/70 leading-relaxed">
              Preserving Indian loom heritage with authentic, direct-from-weaver handloom Banarasi, Kanjivaram, and Chanderi sarees. Every drape carries centuries of artistic legacy.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-brand-gold-light">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping" />
              <span>Silk Mark India Certified Authenticity</span>
            </div>

            {/* Social Salon Quick Icons */}
            <div className="flex items-center gap-3 pt-3">
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
                title="Share & Connect"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif font-bold text-sm text-brand-gold mb-4 uppercase tracking-wider">
              Handcrafted Sarees
            </h4>
            <ul className="space-y-2 text-xs text-brand-ivory/70">
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
            <ul className="space-y-2 text-xs text-brand-ivory/70">
              <li>
                <button
                  onClick={onNavigateHeritage}
                  className="hover:text-brand-gold transition-colors text-left"
                >
                  About Our Looms
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

          {/* Contact Details */}
          <div>
            <h4 className="font-serif font-bold text-sm text-brand-gold mb-4 uppercase tracking-wider">
              Heritage Atelier
            </h4>
            <ul className="space-y-3 text-xs text-brand-ivory/70">
              <li
                onClick={onOpenContact}
                className="flex items-start gap-2.5 cursor-pointer hover:text-brand-gold transition-colors"
              >
                <MapPin className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                <span>124 Chowk Ghat Road, Varanasi, Uttar Pradesh 221001</span>
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
              className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-brand-gold hover:text-brand-gold-light border border-brand-gold/40 px-3.5 py-1.5 rounded-full hover:bg-brand-gold/10 transition-colors"
            >
              Consult Royal Concierge
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
