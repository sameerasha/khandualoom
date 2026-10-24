import React from 'react';
import { motion } from 'motion/react';
import { Award, Sparkles, ShieldCheck, HeartHandshake } from 'lucide-react';

export const Hero: React.FC = () => {
  const scrollToCatalog = () => {
    const catalogElement = document.getElementById('catalog-section');
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-purple-dark via-brand-purple to-brand-purple-dark text-brand-ivory py-20 lg:py-28 border-b border-brand-gold/20">
      {/* Background Decorative Rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-gold/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-brand-crimson/10 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-gold/40 bg-brand-purple-dark/80 text-brand-gold-light text-xs font-semibold tracking-wider uppercase mb-6 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
            <span>Timeless Indian Heritage Since 1984</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-brand-ivory leading-tight"
          >
            Woven in Royalty, <br />
            <span className="bg-gradient-to-r from-brand-gold-light via-brand-gold to-brand-gold-dark bg-clip-text text-transparent">
              Draped in Elegance
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 text-base sm:text-lg text-brand-ivory/80 font-sans leading-relaxed max-w-2xl mx-auto"
          >
            Explore our curated sanctuary of authentic handwoven Banarasi, Kanjivaram, and Chanderi sarees — each piece meticulously woven with pure mulberry silk and certified zari.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-10 flex flex-wrap justify-center gap-4"
          >
            <button
              onClick={scrollToCatalog}
              className="bg-gradient-to-r from-brand-gold to-brand-gold-dark text-brand-purple-dark font-serif font-bold px-8 py-3.5 rounded-full text-base hover:brightness-110 transition-all shadow-xl hover:shadow-brand-gold/20 transform hover:-translate-y-0.5"
            >
              Explore Collection
            </button>
            <a
              href="#heritage"
              className="border border-brand-gold/40 text-brand-gold-light hover:bg-brand-gold/10 font-sans font-medium px-8 py-3.5 rounded-full text-base transition-all"
            >
              The Artisan Story
            </a>
          </motion.div>
        </div>

        {/* Feature Highlights Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-12 border-t border-brand-gold/15"
        >
          <div className="flex flex-col items-center text-center p-4 rounded-xl bg-brand-purple/40 border border-brand-gold/10 backdrop-blur-sm">
            <Award className="w-8 h-8 text-brand-gold mb-2" />
            <h4 className="font-serif font-bold text-sm text-brand-ivory">Silk Mark Certified</h4>
            <p className="text-xs text-brand-ivory/60 mt-1">100% Guaranteed Purity</p>
          </div>

          <div className="flex flex-col items-center text-center p-4 rounded-xl bg-brand-purple/40 border border-brand-gold/10 backdrop-blur-sm">
            <HeartHandshake className="w-8 h-8 text-brand-gold mb-2" />
            <h4 className="font-serif font-bold text-sm text-brand-ivory">Master Weavers</h4>
            <p className="text-xs text-brand-ivory/60 mt-1">Ethically Direct from Artisans</p>
          </div>

          <div className="flex flex-col items-center text-center p-4 rounded-xl bg-brand-purple/40 border border-brand-gold/10 backdrop-blur-sm">
            <ShieldCheck className="w-8 h-8 text-brand-gold mb-2" />
            <h4 className="font-serif font-bold text-sm text-brand-ivory">Inspected Quality</h4>
            <p className="text-xs text-brand-ivory/60 mt-1">Zero-Defect Guarantee</p>
          </div>

          <div className="flex flex-col items-center text-center p-4 rounded-xl bg-brand-purple/40 border border-brand-gold/10 backdrop-blur-sm">
            <Sparkles className="w-8 h-8 text-brand-gold mb-2" />
            <h4 className="font-serif font-bold text-sm text-brand-ivory">Worldwide Shipping</h4>
            <p className="text-xs text-brand-ivory/60 mt-1">Express Insured Delivery</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
