import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Heart, Truck, Sparkles, Clock } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <section id="heritage" className="py-24 bg-gradient-to-b from-[#0F0617] via-[#160B24] to-[#0F0617] text-brand-ivory relative overflow-hidden border-b border-brand-gold/15">
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
              <div className="relative rounded-2xl overflow-hidden border border-brand-gold/30 shadow-2xl group">
                <img 
                  src="/images/saree_crimson_red.png" 
                  alt="Kanjeevaram Temple Border Weave" 
                  className="w-full h-[460px] object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="text-[11px] tracking-widest uppercase text-brand-gold font-mono block">Kanchipuram Master Loom</span>
                  <p className="font-serif text-lg font-bold text-white mt-1">Interlocking Warp & Weft Technique</p>
                </div>
              </div>

              {/* Accent Floating Image */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="hidden sm:block absolute -bottom-10 -right-6 w-48 h-56 rounded-xl overflow-hidden border-2 border-brand-gold/40 shadow-2xl bg-black"
              >
                <img 
                  src="/images/saree_emerald_green.png" 
                  alt="Pure Silk Zari Detailing" 
                  className="w-full h-full object-cover object-center hover:scale-110 transition-transform duration-500"
                />
              </motion.div>

              {/* Experience Badge */}
              <div className="absolute -top-6 -left-6 bg-gradient-to-br from-brand-gold via-brand-gold-light to-brand-gold-dark text-brand-purple-dark p-5 rounded-2xl shadow-2xl border border-yellow-200/50 flex flex-col items-center justify-center text-center">
                <span className="font-serif font-black text-3xl leading-none">75+</span>
                <span className="text-[10px] uppercase font-bold tracking-wider mt-1">Years of Legacy</span>
              </div>
            </div>
          </motion.div>

          {/* Right Text Column - Editorial Narrative */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6"
          >
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-brand-gold font-mono mb-4">
              <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
              <span>Ancestral Craftsmanship</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-brand-ivory leading-tight">
              Weaving Dreams, <br />
              <span className="bg-gradient-to-r from-brand-gold-light via-brand-gold to-brand-gold-dark bg-clip-text text-transparent italic">
                Preserving Heritage
              </span>
            </h2>

            <div className="w-20 h-0.5 bg-gradient-to-r from-brand-gold to-transparent my-6" />

            <p className="text-base sm:text-lg text-brand-ivory/80 font-sans leading-relaxed font-light">
              Since 1947, Vastra Loom has stood at the vanguard of India&apos;s royal handloom renaissance. 
              We partner directly with over 500 master artisans across Varanasi, Kanchipuram, 
              Chanderi, and Patan — safeguarding centuries-old weaving guilds while honoring fair livelihoods.
            </p>

            <p className="mt-4 text-sm sm:text-base text-brand-ivory/70 font-sans leading-relaxed font-light">
              Each saree in our collection is an intimate labor of devotion, requiring anywhere from 15 days 
              to 8 months of precise manual craftsmanship. We champion timeless slow luxury — where every warp thread, 
              intricate paisley motif, and zari border narrates a living history.
            </p>

            {/* Feature Badges */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3.5 p-4 rounded-xl bg-brand-purple-dark/40 border border-brand-gold/15 backdrop-blur-sm">
                <div className="p-2 rounded-lg bg-brand-gold/10 text-brand-gold shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-brand-ivory">100% Authentic GI Tagged</h4>
                  <p className="text-xs text-brand-ivory/60 mt-0.5">Government certified Silk Mark purity</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-xl bg-brand-purple-dark/40 border border-brand-gold/15 backdrop-blur-sm">
                <div className="p-2 rounded-lg bg-brand-gold/10 text-brand-gold shrink-0">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-brand-ivory">Artisan Direct Guild</h4>
                  <p className="text-xs text-brand-ivory/60 mt-0.5">Direct revenue to hereditary weavers</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-xl bg-brand-purple-dark/40 border border-brand-gold/15 backdrop-blur-sm">
                <div className="p-2 rounded-lg bg-brand-gold/10 text-brand-gold shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-brand-ivory">Heirloom Longevity</h4>
                  <p className="text-xs text-brand-ivory/60 mt-0.5">Pure tested metallic silver & gold zari</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-xl bg-brand-purple-dark/40 border border-brand-gold/15 backdrop-blur-sm">
                <div className="p-2 rounded-lg bg-brand-gold/10 text-brand-gold shrink-0">
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
