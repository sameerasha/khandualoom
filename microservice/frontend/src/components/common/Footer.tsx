import React from 'react';
import { Sparkles, Heart, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
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
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif font-bold text-sm text-brand-gold mb-4 uppercase tracking-wider">
              Handcrafted Sarees
            </h4>
            <ul className="space-y-2 text-xs text-brand-ivory/70">
              <li><a href="#catalog-section" className="hover:text-brand-gold">Royal Banarasi Silk</a></li>
              <li><a href="#catalog-section" className="hover:text-brand-gold">Kanjivaram Silk Sarees</a></li>
              <li><a href="#catalog-section" className="hover:text-brand-gold">Chanderi & Tussar Weaves</a></li>
              <li><a href="#catalog-section" className="hover:text-brand-gold">Bridal Trousseau Collection</a></li>
              <li><a href="#catalog-section" className="hover:text-brand-gold">New Loom Arrivals</a></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="font-serif font-bold text-sm text-brand-gold mb-4 uppercase tracking-wider">
              Customer Sanctuary
            </h4>
            <ul className="space-y-2 text-xs text-brand-ivory/70">
              <li><a href="#heritage" className="hover:text-brand-gold">About Our Looms</a></li>
              <li><a href="#care" className="hover:text-brand-gold">Silk Care Instructions</a></li>
              <li><a href="#shipping" className="hover:text-brand-gold">Worldwide Shipping & Customs</a></li>
              <li><a href="#returns" className="hover:text-brand-gold">Authenticity & Returns Policy</a></li>
              <li><a href="#privacy" className="hover:text-brand-gold">Privacy & Security</a></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-serif font-bold text-sm text-brand-gold mb-4 uppercase tracking-wider">
              Heritage Atelier
            </h4>
            <ul className="space-y-3 text-xs text-brand-ivory/70">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                <span>124 Chowk Ghat Road, Varanasi, Uttar Pradesh 221001</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-gold shrink-0" />
                <span>+91 (0542) 240-8899</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-gold shrink-0" />
                <span>concierge@vastraloom.com</span>
              </li>
            </ul>
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
