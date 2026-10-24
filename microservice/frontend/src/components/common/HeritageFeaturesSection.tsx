import React from 'react';
import { motion } from 'motion/react';
import { Award, HeartHandshake, ShieldCheck, Sparkles, Check, ChevronRight } from 'lucide-react';

export const HeritageFeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <Award className="w-5 h-5 text-brand-gold" />,
      title: 'Silk Mark Certified',
      subtitle: '100% Guaranteed Purity',
      desc: 'Authenticated by the Silk Mark Organisation of India. Zero synthetic adulteration.',
      badge: 'GI Tagged',
      detail: 'Pure natural mulberry filaments',
    },
    {
      icon: <HeartHandshake className="w-5 h-5 text-brand-gold" />,
      title: 'Direct from Artisans',
      subtitle: 'Fair Trade Weavers Guild',
      desc: 'Eliminating intermediaries. 100% fair trade patron value flowing directly to weaver families.',
      badge: 'Zero Middlemen',
      detail: '300+ Ancestral Weaver Families',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-brand-gold" />,
      title: 'Master Inspection',
      subtitle: 'Zero-Defect Standard',
      desc: 'Every warp and weft is scrutinized by senior master craftsmen before dispatch.',
      badge: 'Triple Audit',
      detail: 'Hand-inspected under studio light',
    },
    {
      icon: <Sparkles className="w-5 h-5 text-brand-gold" />,
      title: 'Heirloom Packaging',
      subtitle: 'Velvet Storage Chest',
      desc: 'Delivered in a handcrafted velvet-lined luxury chest engineered to preserve silk for generations.',
      badge: 'Museum Grade',
      detail: 'Lined with pure cotton muslin',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-transparent via-[#150A21]/50 to-transparent text-brand-ivory border-b border-brand-gold/15 relative overflow-hidden">
      {/* Subtle radial ambient lights framing the 3D celestial rings */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-brand-purple/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-gold/30 bg-brand-purple-dark/80 backdrop-blur-md text-brand-gold-light text-xs font-mono uppercase tracking-widest mb-4"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
            <span>The Four Pillars of Imperial Trust</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight"
          >
            Uncompromised Handloom Integrity
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-4 text-xs sm:text-sm text-brand-ivory/80 font-sans leading-relaxed font-light"
          >
            Watch the 3D celestial seals orbit above as you explore the heirloom standards governing every thread woven at our Varanasi and Kanchipuram looms.
          </motion.p>
        </div>

        {/* 4 Trust Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.7, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="relative p-6 rounded-3xl bg-brand-purple-dark/50 border border-brand-gold/25 hover:border-brand-gold/80 backdrop-blur-xl shadow-xl transition-all duration-500 hover:shadow-2xl hover:shadow-brand-gold/20 hover:-translate-y-2 group flex flex-col justify-between"
            >
              {/* Top Accent Pill */}
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center group-hover:scale-110 group-hover:bg-brand-gold/20 transition-all">
                  {item.icon}
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-brand-gold-light bg-brand-gold/10 border border-brand-gold/25 px-2.5 py-1 rounded-full">
                  {item.badge}
                </span>
              </div>

              {/* Title & Subtitle */}
              <div>
                <h4 className="font-serif font-bold text-lg text-white group-hover:text-brand-gold transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs font-mono uppercase tracking-wider text-brand-gold-light mt-0.5">
                  {item.subtitle}
                </p>
                <p className="text-xs text-brand-ivory/70 mt-3 leading-relaxed font-sans font-light">
                  {item.desc}
                </p>
              </div>

              {/* Card Footer Micro-Stat */}
              <div className="mt-5 pt-3 border-t border-brand-gold/15 flex items-center justify-between text-[11px] text-brand-ivory/60">
                <span className="flex items-center gap-1.5 text-brand-gold-light">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  {item.detail}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-brand-gold opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
