import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Compass } from 'lucide-react';

interface HeroProps {
  onSignUpClick?: () => void;
  onExploreClick?: () => void;
  scrollProgress?: number;
}

export const Hero: React.FC<HeroProps> = ({ onSignUpClick: _onSignUpClick, onExploreClick }) => {
  const scrollToCatalog = () => {
    if (onExploreClick) {
      onExploreClick();
      return;
    }
    const catalogElement = document.getElementById('catalog-section');
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToHeritage = () => {
    const heritageElement = document.getElementById('heritage-section');
    if (heritageElement) {
      heritageElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero-top" className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden text-brand-ivory">
      {/* Contrast Gradients for WCAG AA readability over the 3D canvas */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#0F0617]/95 via-[#0F0617]/75 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0F0617]/85 to-transparent pointer-events-none" />

      {/* Spatial Content Overlay */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16 lg:py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-7 xl:col-span-8 text-left">
            {/* Brand Heritage Badge */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-brand-gold/40 bg-brand-purple-dark/80 backdrop-blur-md text-brand-gold-light text-xs font-semibold tracking-widest uppercase mb-8 shadow-lg shadow-black/40"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-gold animate-pulse" />
              <span>Khandua Looms • Premium Odisha Handlooms</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-4xl sm:text-6xl xl:text-7xl font-bold tracking-tight text-brand-ivory leading-[1.08]"
            >
              Timeless Odisha Weaves, <br />
              <span className="bg-gradient-to-r from-[#F5DEB3] via-[#C5A059] to-[#DFBF7A] bg-clip-text text-transparent italic font-serif">
                Made to Be Cherished
              </span>
            </motion.h1>

            {/* Supporting Text */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 text-base sm:text-lg text-brand-ivory/80 font-sans leading-relaxed max-w-xl font-light"
            >
              Discover the beauty of Odisha's handloom traditions through exquisite sarees inspired by generations of artistry, culture, and craftsmanship.
            </motion.p>

            {/* Call to Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="mt-10 flex flex-wrap items-center gap-4 sm:gap-5"
            >
              <button
                onClick={scrollToCatalog}
                className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-brand-gold via-brand-gold-light to-brand-gold-dark text-brand-purple-dark font-serif font-bold px-8 py-4 rounded-full text-base transition-all duration-300 shadow-xl shadow-brand-gold/15 hover:shadow-brand-gold/30 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <span>Shop Sarees</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={scrollToHeritage}
                className="inline-flex items-center gap-2 border border-brand-gold/35 text-brand-gold-light hover:bg-brand-gold/10 font-sans font-medium px-7 py-4 rounded-full text-base transition-all duration-300 backdrop-blur-sm cursor-pointer"
              >
                <Compass className="w-4 h-4 text-brand-gold" />
                <span>Explore Our Heritage</span>
              </button>
            </motion.div>

            {/* Micro Trust Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="mt-12 flex items-center gap-6 sm:gap-8 text-xs text-brand-ivory/60 uppercase tracking-widest font-mono"
            >
              <div>
                <span className="text-brand-gold font-bold text-base block font-serif">6</span>
                Weave Collections
              </div>
              <div className="h-6 w-px bg-brand-gold/20" />
              <div>
                <span className="text-brand-gold font-bold text-base block font-serif">100%</span>
                Odisha Handloom
              </div>
              <div className="h-6 w-px bg-brand-gold/20" />
              <div>
                <span className="text-brand-gold font-bold text-base block font-serif">Free</span>
                Insured Shipping
              </div>
            </motion.div>
          </div>

          {/* Right Column: Spatial Void Framing the 3D Master Loom Canvas */}
          <div className="lg:col-span-5 xl:col-span-4 hidden lg:block pointer-events-none" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
};
