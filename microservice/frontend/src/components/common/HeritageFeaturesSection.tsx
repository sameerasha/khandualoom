import React from 'react';
import { motion } from 'motion/react';
import { Award, HeartHandshake, ShieldCheck, Sparkles } from 'lucide-react';

export const HeritageFeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <Award className="w-5 h-5 text-brand-gold" />,
      title: 'Silk Mark Certified',
      subtitle: '100% Guaranteed Purity',
      desc: 'Authenticated by the Silk Mark Organisation of India. Zero synthetic adulteration.',
    },
    {
      icon: <HeartHandshake className="w-5 h-5 text-brand-gold" />,
      title: 'Direct from Artisans',
      subtitle: 'Fair Trade Weavers Guild',
      desc: 'Eliminating intermediaries. 100% fair trade patron value flowing directly to weaver families.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-brand-gold" />,
      title: 'Master Inspection',
      subtitle: 'Zero-Defect Standard',
      desc: 'Every warp and weft is scrutinized by senior master craftsmen before dispatch.',
    },
    {
      icon: <Sparkles className="w-5 h-5 text-brand-gold" />,
      title: 'Heirloom Packaging',
      subtitle: 'Velvet Storage Chest',
      desc: 'Delivered in a handcrafted velvet-lined luxury chest engineered to preserve silk for generations.',
    },
  ];

  return (
    <section className="py-12 bg-gradient-to-b from-[#0F0617] via-[#150A21] to-[#0F0617] text-brand-ivory border-b border-brand-gold/15 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="p-5 rounded-2xl bg-brand-purple-dark/60 border border-brand-gold/20 hover:border-brand-gold/60 backdrop-blur-md shadow-lg transition-all duration-300 hover:shadow-brand-gold/10 hover:-translate-y-1 group"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center mb-3.5 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h4 className="font-serif font-bold text-base text-white group-hover:text-brand-gold transition-colors">
                {item.title}
              </h4>
              <p className="text-xs font-mono uppercase tracking-wider text-brand-gold-light mt-0.5">
                {item.subtitle}
              </p>
              <p className="text-xs text-brand-ivory/70 mt-2 leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
