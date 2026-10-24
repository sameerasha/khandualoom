import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Compass, MousePointerClick } from 'lucide-react';

interface HeroProps {
  onSignUpClick?: () => void;
  onExploreClick?: () => void;
  scrollProgress?: number;
}

export const Hero: React.FC<HeroProps> = ({ onSignUpClick, onExploreClick, scrollProgress = 0 }) => {
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

  return (
    <section id="hero-top" className="relative min-h-[92vh] flex flex-col justify-center overflow-hidden text-brand-ivory border-b border-brand-gold/15">
      {/* Contrast Gradients for WCAG AA readability over the 3D canvas */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#0F0617]/95 via-[#0F0617]/70 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0F0617] via-[#0F0617]/60 to-transparent pointer-events-none" />

      {/* Spatial Content Overlay */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16 lg:py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-7 xl:col-span-8 text-left">
            {/* Royal Badge */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-brand-gold/40 bg-brand-purple-dark/80 backdrop-blur-md text-brand-gold-light text-xs font-semibold tracking-widest uppercase mb-8 shadow-lg shadow-black/40"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-gold animate-pulse" />
              <span>Imperial Indian Handloom Atelier • Est. 1984</span>
            </motion.div>

            {/* Haute Couture Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-4xl sm:text-6xl xl:text-7xl font-bold tracking-tight text-brand-ivory leading-[1.08]"
            >
              Woven in Royalty, <br />
              <span className="bg-gradient-to-r from-[#F5DEB3] via-[#C5A059] to-[#DFBF7A] bg-clip-text text-transparent italic font-serif">
                Draped in Eternity
              </span>
            </motion.h1>

            {/* Editorial Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 text-base sm:text-lg text-brand-ivory/80 font-sans leading-relaxed max-w-xl font-light"
            >
              Step into an ethereal realm of pure mulberry silk, certified zari, and ancestral artistry. Handcrafted by master weavers across Varanasi, Kanchipuram, and Patan.
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
                className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-brand-gold via-brand-gold-light to-brand-gold-dark text-brand-purple-dark font-serif font-bold px-8 py-4 rounded-full text-base transition-all duration-300 shadow-xl shadow-brand-gold/15 hover:shadow-brand-gold/30 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Explore The Collection</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              {onSignUpClick ? (
                <button
                  onClick={onSignUpClick}
                  className="inline-flex items-center gap-2 border border-brand-gold/35 text-brand-gold-light hover:bg-brand-gold/10 font-sans font-medium px-7 py-4 rounded-full text-base transition-all duration-300 backdrop-blur-sm"
                >
                  <Sparkles className="w-4 h-4 text-brand-gold" />
                  <span>Join Patron Salon</span>
                </button>
              ) : (
                <a
                  href="#heritage"
                  className="inline-flex items-center gap-2 border border-brand-gold/35 text-brand-gold-light hover:bg-brand-gold/10 font-sans font-medium px-7 py-4 rounded-full text-base transition-all duration-300 backdrop-blur-sm"
                >
                  <Compass className="w-4 h-4 text-brand-gold" />
                  <span>The Artisan Story</span>
                </a>
              )}
            </motion.div>

            {/* Micro Trust Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="mt-12 flex items-center gap-8 text-xs text-brand-ivory/60 uppercase tracking-widest font-mono"
            >
              <div>
                <span className="text-brand-gold font-bold text-base block font-serif">100%</span>
                Pure Mulberry Silk
              </div>
              <div className="h-6 w-px bg-brand-gold/20" />
              <div>
                <span className="text-brand-gold font-bold text-base block font-serif">300+</span>
                Master Handloom Weavers
              </div>
              <div className="h-6 w-px bg-brand-gold/20" />
              <div>
                <span className="text-brand-gold font-bold text-base block font-serif">Zero</span>
                Synthetic Blends
              </div>
            </motion.div>
          </div>

          {/* Right Column: Spatial Void Framing the Saree & Shuttle 3D Model */}
          <div className="lg:col-span-5 xl:col-span-4 hidden lg:flex flex-col items-center justify-center pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.4 }}
              className="p-5 rounded-3xl border border-brand-gold/30 bg-brand-purple-dark/60 backdrop-blur-xl shadow-2xl text-center max-w-xs"
            >
              <div className="flex items-center justify-center gap-2 text-[10px] tracking-widest uppercase text-brand-gold-light font-mono">
                <MousePointerClick className="w-3.5 h-3.5 text-brand-gold animate-bounce" />
                <span>24K Golden Dust Matrix</span>
              </div>
              <p className="text-xs text-brand-ivory/80 mt-2 font-serif italic">
                Scroll or move cursor to orchestrate the fluid golden zari streams, celestial vortexes, and floating embers
              </p>
              {scrollProgress > 0 && (
                <div className="mt-3 w-full bg-white/10 rounded-full h-1 overflow-hidden">
                  <div
                    className="bg-brand-gold h-full transition-all duration-150"
                    style={{ width: `${Math.min(scrollProgress * 100, 100)}%` }}
                  />
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
