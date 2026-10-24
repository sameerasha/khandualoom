import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, Eye, Compass, CheckCircle2, Feather, Flame, Shield } from 'lucide-react';

interface CraftShowcaseSectionProps {
  onExploreCatalog?: () => void;
}

export const CraftShowcaseSection: React.FC<CraftShowcaseSectionProps> = ({ onExploreCatalog }) => {
  const [activeTab, setActiveTab] = useState<'shuttle' | 'kadwa' | 'zari'>('kadwa');

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

  const tabContent = {
    kadwa: {
      tag: 'Sacred Kadwa Technique',
      title: 'Interlocking Warp & Weft with Zero Loose Floats',
      description:
        'In authentic Kadwa weaving, every single floral booti and paisley motif is woven separately by hand. Master weavers individually engrave each motif using miniature wooden spools, locking the zari thread cleanly into the silk fabric without any raw floating threads on the reverse side.',
      highlight: 'Zero skin irritation • 100% smooth pure silk reverse',
      badge: 'UNESCO Heritage Technique',
    },
    shuttle: {
      tag: 'The Traditional Dhoki',
      title: 'Aged Rosewood Flying Shuttle Darting at High Precision',
      description:
        'Carved from seasoned rosewood with solid brass pointed caps, the traditional Indian flying shuttle carries the pirn spool through more than 6,000 fine silk filaments. As you scroll, observe the 3D shuttle behind darting in synchronous rhythm with the weaver’s pedal movement.',
      highlight: 'Hand-carved rosewood hull with mirror-polished brass tips',
      badge: '180 Weft Passes Per Inch',
    },
    zari: {
      tag: 'Imperial 24K Zari Core',
      title: 'Pure Silver Filaments Electroplated in 24K Yellow Gold',
      description:
        'Vastraloom refuses synthetic polyester or copper metallic yarns. Our zari begins with a core of 98.5% pure silver drawn into microscopic ribbons thinner than human hair, electroplated in liquid 24K gold to ensure lifelong heirloom luster that never tarnishes.',
      highlight: 'Certified 98.5% Silver Core • Real 24K Gold Electroplate',
      badge: 'Hallmark Tested',
    },
  };

  const currentTab = tabContent[activeTab];

  return (
    <section id="craft-section" className="py-24 bg-gradient-to-b from-transparent via-[#160B24]/40 to-transparent text-brand-ivory border-b border-brand-gold/15 relative overflow-hidden">
      {/* Background ambient aura */}
      <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-brand-gold/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-brand-purple/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Interactive Craft Navigation Tabs */}
        <div className="flex items-center justify-center mb-12">
          <div className="p-1.5 rounded-full bg-brand-purple-dark/80 border border-brand-gold/30 backdrop-blur-xl flex flex-wrap gap-2 shadow-2xl">
            <button
              onClick={() => setActiveTab('kadwa')}
              className={`px-5 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2 ${
                activeTab === 'kadwa'
                  ? 'bg-gradient-to-r from-brand-gold to-brand-gold-dark text-brand-purple-dark font-bold shadow-lg'
                  : 'text-brand-ivory/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Feather className="w-3.5 h-3.5" />
              <span>1. Kadwa Weaving</span>
            </button>
            <button
              onClick={() => setActiveTab('shuttle')}
              className={`px-5 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2 ${
                activeTab === 'shuttle'
                  ? 'bg-gradient-to-r from-brand-gold to-brand-gold-dark text-brand-purple-dark font-bold shadow-lg'
                  : 'text-brand-ivory/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>2. The Flying Shuttle</span>
            </button>
            <button
              onClick={() => setActiveTab('zari')}
              className={`px-5 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2 ${
                activeTab === 'zari'
                  ? 'bg-gradient-to-r from-brand-gold to-brand-gold-dark text-brand-purple-dark font-bold shadow-lg'
                  : 'text-brand-ivory/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>3. 24K Pure Zari</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Editorial Narrative & Craftsmanship Details */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-400/40 bg-brand-purple-dark/80 backdrop-blur-md text-amber-300 text-xs font-mono uppercase tracking-widest mb-6">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{currentTab.tag}</span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white leading-tight">
                  {currentTab.title}
                </h2>

                <p className="mt-6 text-sm sm:text-base text-brand-ivory/80 font-sans leading-relaxed font-light">
                  {currentTab.description}
                </p>

                <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-gold/10 border border-brand-gold/30 text-xs text-brand-gold-light font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{currentTab.highlight}</span>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Craft Credentials Grid */}
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-brand-purple-dark/60 border border-brand-gold/20 backdrop-blur-md">
                <span className="font-serif text-2xl sm:text-3xl font-bold text-brand-gold block">6,000+</span>
                <span className="text-xs text-brand-ivory/70 mt-1 block">Warp Silk Filaments</span>
              </div>
              <div className="p-4 rounded-2xl bg-brand-purple-dark/60 border border-brand-gold/20 backdrop-blur-md">
                <span className="font-serif text-2xl sm:text-3xl font-bold text-brand-gold block">90 Days</span>
                <span className="text-xs text-brand-ivory/70 mt-1 block">Per Bridal Masterpiece</span>
              </div>
              <div className="p-4 rounded-2xl bg-brand-purple-dark/60 border border-brand-gold/20 backdrop-blur-md col-span-2 sm:col-span-1">
                <span className="font-serif text-2xl sm:text-3xl font-bold text-brand-gold block">24K Zari</span>
                <span className="text-xs text-brand-ivory/70 mt-1 block">Electroplated Silver Core</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-10 flex flex-wrap items-center gap-5">
              <button
                onClick={scrollToCatalog}
                className="inline-flex items-center gap-2.5 bg-gradient-to-r from-brand-gold via-brand-gold-light to-brand-gold-dark text-brand-purple-dark font-serif font-bold px-8 py-4 rounded-full text-sm hover:brightness-110 shadow-xl shadow-brand-gold/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Explore The Weaves</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#heritage"
                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-brand-gold-light hover:text-white px-5 py-4 transition-colors"
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
              {/* Primary Image: Handloom Craft in Action */}
              <div className="relative rounded-3xl overflow-hidden border border-brand-gold/30 shadow-2xl group">
                <img
                  src="/images/saree_master_front.png"
                  alt="Varanasi Master Handloom Craft"
                  className="w-full h-[420px] object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center gap-2 text-brand-gold text-xs font-mono uppercase tracking-widest mb-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Varanasi Chowk Atelier</span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-white">
                    Authentic Interlocking Kadwa Technique
                  </h3>
                  <p className="text-xs text-brand-ivory/70 mt-1 font-light">
                    Zero raw floats on reverse. Pure luxury drape against the skin.
                  </p>
                </div>
              </div>

              {/* Accent Floating Badge */}
              <div className="hidden sm:flex items-center gap-3.5 absolute -bottom-6 -left-6 p-4 rounded-2xl bg-brand-purple-dark/95 border border-brand-gold/40 shadow-2xl backdrop-blur-xl">
                <div className="w-11 h-11 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold">
                  <Shield className="w-6 h-6 text-brand-gold" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">GI Tag Verified Handloom</p>
                  <p className="text-[11px] text-brand-gold-light">Government of India Registry</p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
