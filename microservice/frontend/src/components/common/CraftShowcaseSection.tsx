import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Eye, Compass, CheckCircle2 } from 'lucide-react';

interface CraftShowcaseSectionProps {
  onExploreCatalog?: () => void;
}

export const CraftShowcaseSection: React.FC<CraftShowcaseSectionProps> = ({ onExploreCatalog }) => {
  const scrollToCatalog = () => {
    if (onExploreCatalog) {
      onExploreCatalog();
      return;
    }
    const element = document.getElementById('catalog-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-[#0F0617] via-[#160B24] to-[#0F0617] text-brand-ivory border-b border-brand-gold/15 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-brand-purple/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Editorial Narrative & Craftsmanship Details */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-400/40 bg-brand-purple-dark/80 backdrop-blur-md text-amber-300 text-xs font-mono uppercase tracking-widest mb-6">
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              <span>The Flying Shuttle & Kadwa Weave</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white leading-tight">
              Where Ancient Shuttles <br />
              <span className="bg-gradient-to-r from-[#F5DEB3] via-[#C5A059] to-[#DFBF7A] bg-clip-text text-transparent italic font-serif">
                Breathe Life into Pure Gold Zari
              </span>
            </h2>

            <p className="mt-6 text-sm sm:text-base text-brand-ivory/80 font-sans leading-relaxed font-light">
              In traditional pit looms across Varanasi and Kanchipuram, our master weavers guide the wooden flying shuttle (dhoki) through over 6,000 fine warp threads. Unlike modern powerloom replicas that leave loose floating threads on the reverse, every floral motif in an authentic Kadwa weave is individually hand-engraved and locked into the silk.
            </p>

            {/* Craft Credentials Grid */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-brand-purple-dark/50 border border-brand-gold/15">
                <span className="font-serif text-2xl font-bold text-brand-gold block">6,000+</span>
                <span className="text-xs text-brand-ivory/70 mt-1 block">Warp Silk Filaments</span>
              </div>
              <div className="p-4 rounded-xl bg-brand-purple-dark/50 border border-brand-gold/15">
                <span className="font-serif text-2xl font-bold text-brand-gold block">90 Days</span>
                <span className="text-xs text-brand-ivory/70 mt-1 block">Per Bridal Masterpiece</span>
              </div>
              <div className="p-4 rounded-xl bg-brand-purple-dark/50 border border-brand-gold/15 col-span-2 sm:col-span-1">
                <span className="font-serif text-2xl font-bold text-brand-gold block">24K Zari</span>
                <span className="text-xs text-brand-ivory/70 mt-1 block">Electroplated Silver Core</span>
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={scrollToCatalog}
                className="inline-flex items-center gap-2.5 bg-gradient-to-r from-brand-gold to-brand-gold-dark text-brand-purple-dark font-serif font-bold px-7 py-3.5 rounded-full text-sm hover:brightness-110 shadow-xl transition-all"
              >
                <span>Explore The Weaves</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#heritage"
                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-brand-gold-light hover:text-white px-5 py-3.5 transition-colors"
              >
                <Compass className="w-4 h-4 text-brand-gold" />
                <span>Read Full Loom Manifesto</span>
              </a>
            </div>
          </motion.div>

          {/* Right Column: Visual Composition of the Loom */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <div className="relative mx-auto max-w-md">
              {/* Primary Image: Handloom Shuttle in Action */}
              <div className="relative rounded-3xl overflow-hidden border border-brand-gold/30 shadow-2xl group">
                <img
                  src="/images/saree_master_front.png"
                  alt="Varanasi Master Handloom Craft"
                  className="w-full h-[400px] object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center gap-2 text-brand-gold text-xs font-mono uppercase tracking-widest mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Varanasi Chowk Atelier</span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-white">
                    Authentic Interlocking Kadwa Technique
                  </h3>
                  <p className="text-xs text-brand-ivory/70 mt-1">
                    Zero raw floats on reverse. Pure luxury drape against the skin.
                  </p>
                </div>
              </div>

              {/* Accent Floating Badge */}
              <div className="hidden sm:flex items-center gap-3 absolute -bottom-6 -left-6 p-4 rounded-2xl bg-brand-purple-dark/95 border border-brand-gold/40 shadow-2xl backdrop-blur-xl">
                <div className="w-10 h-10 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold">
                  <CheckCircle2 className="w-5 h-5 text-brand-gold" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">GI Tag Verified</p>
                  <p className="text-[11px] text-brand-gold-light">Government of India Registered</p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
