import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Heart, Truck, Sparkles, Clock, Calendar } from 'lucide-react';

export const About: React.FC = () => {
  const [activeEra, setActiveEra] = useState<number>(0);

  const milestones = [
    {
      year: '1984',
      title: 'The Ancestral Pit Loom Founded',
      desc: 'Master weaver Pandit Harishankar established the first pit loom in Varanasi Chowk, committed exclusively to hand-spun pure katan silk and real silver zari.',
    },
    {
      year: '1998',
      title: 'Royal & Bridal Guild Patronage',
      desc: 'Vastraloom expanded across Kanchipuram and Patan, becoming the private silk atelier for royal weddings, ceremonial drapes, and high-society patrons.',
    },
    {
      year: '2012',
      title: 'GI Tag & Silk Mark Certification',
      desc: 'Every masterloom piece was certified under the Silk Mark Organisation of India and Government of India GI Tag Registry with zero synthetic blends allowed.',
    },
    {
      year: '2026',
      title: 'The Global Digital Atelier',
      desc: 'Bringing authentic heritage handlooms directly to connoisseurs across 45 countries, ensuring fair trade livelihoods for over 300 weaver families.',
    },
  ];

  return (
    <section id="heritage" className="py-24 bg-gradient-to-b from-transparent via-[#14081F]/40 to-transparent text-brand-ivory relative overflow-hidden border-b border-brand-gold/15">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-brand-purple/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Visual Column - Editorial Image Composition */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 relative"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Primary Image */}
              <div className="relative rounded-3xl overflow-hidden border border-brand-gold/30 shadow-2xl group">
                <img 
                  src="/images/saree_crimson_red.png" 
                  alt="Kanjeevaram Temple Border Weave" 
                  className="w-full h-[480px] object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="text-[11px] tracking-widest uppercase text-brand-gold font-mono block">Kanchipuram & Varanasi Master Looms</span>
                  <p className="font-serif text-lg font-bold text-white mt-1">Interlocking Warp & Weft Technique</p>
                </div>
              </div>

              {/* Accent Floating Badge */}
              <div className="absolute -top-6 -left-6 bg-gradient-to-br from-brand-gold via-brand-gold-light to-brand-gold-dark text-brand-purple-dark p-5 rounded-2xl shadow-2xl border border-yellow-200/50 flex flex-col items-center justify-center text-center">
                <span className="font-serif font-black text-3xl leading-none">40+</span>
                <span className="text-[10px] uppercase font-bold tracking-wider mt-1">Years of Heritage</span>
              </div>
            </div>
          </motion.div>

          {/* Right Text Column - Editorial Narrative & Milestones */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6"
          >
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-brand-gold font-mono mb-4">
              <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
              <span>Ancestral Craftsmanship & Sacred Loom</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-brand-ivory leading-tight">
              Weaving Dreams, <br />
              <span className="bg-gradient-to-r from-brand-gold-light via-brand-gold to-brand-gold-dark bg-clip-text text-transparent italic">
                Preserving Eternity
              </span>
            </h2>

            <div className="w-20 h-0.5 bg-gradient-to-r from-brand-gold to-transparent my-6" />

            <p className="text-base sm:text-lg text-brand-ivory/80 font-sans leading-relaxed font-light">
              Since 1984, Vastraloom has stood at the vanguard of India&apos;s royal handloom renaissance. 
              We partner directly with over 300 master artisans across Varanasi, Kanchipuram, 
              Chanderi, and Patan — safeguarding centuries-old weaving guilds while honoring fair livelihoods.
            </p>

            {/* Interactive Timeline Tabs */}
            <div className="mt-8 p-4 rounded-2xl bg-brand-purple-dark/50 border border-brand-gold/25 backdrop-blur-md">
              <div className="flex items-center gap-2 border-b border-brand-gold/15 pb-3 overflow-x-auto">
                {milestones.map((m, idx) => (
                  <button
                    key={m.year}
                    onClick={() => setActiveEra(idx)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all shrink-0 flex items-center gap-1.5 ${
                      activeEra === idx
                        ? 'bg-brand-gold text-brand-purple-dark font-bold'
                        : 'text-brand-ivory/60 hover:text-brand-gold'
                    }`}
                  >
                    <Calendar className="w-3 h-3" />
                    <span>{m.year}</span>
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeEra}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="pt-3"
                >
                  <h4 className="font-serif text-sm font-bold text-brand-gold-light">
                    {milestones[activeEra].title}
                  </h4>
                  <p className="text-xs text-brand-ivory/70 mt-1 leading-relaxed font-light">
                    {milestones[activeEra].desc}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Feature Badges */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-brand-purple-dark/40 border border-brand-gold/15 backdrop-blur-sm">
                <div className="p-2 rounded-xl bg-brand-gold/10 text-brand-gold shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-brand-ivory">100% Authentic GI Tagged</h4>
                  <p className="text-xs text-brand-ivory/60 mt-0.5">Government certified Silk Mark purity</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-brand-purple-dark/40 border border-brand-gold/15 backdrop-blur-sm">
                <div className="p-2 rounded-xl bg-brand-gold/10 text-brand-gold shrink-0">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-brand-ivory">Artisan Direct Guild</h4>
                  <p className="text-xs text-brand-ivory/60 mt-0.5">Direct revenue to hereditary weavers</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-brand-purple-dark/40 border border-brand-gold/15 backdrop-blur-sm">
                <div className="p-2 rounded-xl bg-brand-gold/10 text-brand-gold shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-brand-ivory">Heirloom Longevity</h4>
                  <p className="text-xs text-brand-ivory/60 mt-0.5">Pure tested metallic silver & gold zari</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-brand-purple-dark/40 border border-brand-gold/15 backdrop-blur-sm">
                <div className="p-2 rounded-xl bg-brand-gold/10 text-brand-gold shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-brand-ivory">Global Insured Delivery</h4>
                  <p className="text-xs text-brand-ivory/60 mt-0.5">Tamper-evident luxury vault packaging</p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
