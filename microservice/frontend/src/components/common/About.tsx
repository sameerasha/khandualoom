import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Calendar, Feather } from 'lucide-react';

export const About: React.FC = () => {
  const [activeEra, setActiveEra] = useState<number>(0);

  const milestones = [
    {
      year: 'Ancient Roots',
      title: 'Nuapatna & Sacred Gitagovinda Verses',
      desc: 'The historic roots of Khadua Pata in Nuapatna, traditionally woven with sacred calligraphic verses of Jayadeva’s Gita Govinda offered to Lord Jagannath in Puri.',
    },
    {
      year: 'Bandha Artistry',
      title: 'Tie-Dye Mastery of Western Odisha',
      desc: 'Generations of master weavers across Bargarh and Sambalpur perfected the mathematical tie-dye (Bandha) technique, aligning intricate warp and weft threads before weaving.',
    },
    {
      year: 'Royal Patronage',
      title: 'Extra-Weft Bomkai & Phoda Kumbha',
      desc: 'The royal courts of Subarnapur and Ganjam fostered complex extra-weft jaal patterns and needle-interlocked Phoda Kumbha temple spires cherished across generations.',
    },
    {
      year: 'Modern Era',
      title: 'Khandua Looms Online Heritage Store',
      desc: 'Connecting saree connoisseurs, brides, and collectors worldwide directly with authentic Odisha handloom craftsmanship, honoring timeless cultural identity.',
    },
  ];

  return (
    <section id="heritage-section" className="py-16 sm:py-20 relative overflow-hidden text-brand-ivory">
      {/* Contrast Gradients matching Hero for WCAG AA readability over 3D canvas */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#0F0617]/95 via-[#0F0617]/80 to-[#0F0617]/70 pointer-events-none" />

      {/* Background radial glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-brand-purple/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Visual Column - Authentic Odisha Handloom Composition */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 relative"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Primary Image */}
              <div className="relative rounded-3xl overflow-hidden border border-brand-gold/30 shadow-2xl group">
                <img 
                  src="/images/products/p3/front.jpg" 
                  alt="Authentic Odisha Khadua Silk Weave" 
                  className="w-full h-[480px] object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="text-[11px] tracking-widest uppercase text-brand-gold font-mono block">
                    Nuapatna & Western Odisha Handlooms
                  </span>
                  <p className="font-serif text-lg font-bold text-white mt-1">
                    Authentic Tie-Dye Bandha & Extra-Weft Artistry
                  </p>
                </div>
              </div>

              {/* Accent Floating Badge */}
              <div className="absolute -top-6 -left-6 bg-gradient-to-br from-brand-gold via-brand-gold-light to-brand-gold-dark text-brand-purple-dark p-5 rounded-2xl shadow-2xl border border-yellow-200/50 flex flex-col items-center justify-center text-center">
                <Feather className="w-6 h-6 text-brand-purple-dark stroke-[2.2]" />
                <span className="font-serif font-black text-2xl leading-none mt-1">Odisha</span>
                <span className="text-[9.5px] uppercase font-bold tracking-wider mt-0.5">Heritage Weaves</span>
              </div>
            </div>
          </motion.div>

          {/* Right Text Column - Editorial Narrative & Milestones */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6"
          >
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-brand-gold font-mono mb-4">
              <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
              <span>Our Heritage & Craftsmanship</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-brand-ivory leading-tight">
              A Legacy Woven <br />
              <span className="bg-gradient-to-r from-brand-gold-light via-brand-gold to-brand-gold-dark bg-clip-text text-transparent italic">
                Through Generations
              </span>
            </h2>

            <div className="w-20 h-0.5 bg-gradient-to-r from-brand-gold to-transparent my-6" />

            <p className="text-base sm:text-lg text-brand-ivory/85 font-sans leading-relaxed font-light">
              Khandua Looms celebrates the rich textile heritage of Odisha. Our collection brings together traditional weaving styles, intricate patterns, and timeless designs for women who value craftsmanship and cultural identity.
            </p>

            <p className="mt-4 text-xs sm:text-sm text-brand-ivory/70 font-sans leading-relaxed font-light">
              From the sacred Nuapatna Gitagovinda calligraphic drapes to Sambalpuri double-ikat bandha and ornate Bomkai borders, each weave represents an unbroken line of artistic devotion, geometric precision, and natural fibers.
            </p>

            {/* Interactive Timeline Tabs */}
            <div className="mt-8 pt-6 border-t border-brand-gold/20">
              <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
                {milestones.map((m, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveEra(idx)}
                    className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                      activeEra === idx
                        ? 'bg-brand-gold text-brand-purple-dark font-bold shadow-md'
                        : 'bg-white/5 text-brand-ivory/60 hover:text-brand-gold hover:bg-white/10 border border-brand-gold/15'
                    }`}
                  >
                    <Calendar className="w-3 h-3" />
                    <span>{m.year}</span>
                  </button>
                ))}
              </div>

              {/* Active Milestone Card */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeEra}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="bg-brand-purple-dark/60 border border-brand-gold/25 rounded-2xl p-4 backdrop-blur-md"
                >
                  <h4 className="font-serif font-bold text-base text-brand-gold mb-1">
                    {milestones[activeEra].title}
                  </h4>
                  <p className="text-xs text-brand-ivory/80 leading-relaxed font-light">
                    {milestones[activeEra].desc}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
