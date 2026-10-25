import React from 'react';
import { motion } from 'motion/react';
import { Layers, FileText, ShieldCheck, Headphones, Truck, Sparkles } from 'lucide-react';

export const HeritageFeaturesSection: React.FC = () => {
  const benefits = [
    {
      icon: <Layers className="w-5 h-5 text-brand-gold" />,
      title: 'Thoughtfully Curated Collections',
      subtitle: 'Authentic Odisha Weaves',
      desc: 'Each saree is hand-selected across authentic Khadua, Sambalpuri, Bomkai, and regional handloom traditions, reflecting true regional artistry.',
    },
    {
      icon: <FileText className="w-5 h-5 text-brand-gold" />,
      title: 'Detailed Product Information',
      subtitle: 'Transparent Specifications',
      desc: 'Comprehensive weave descriptions, fabric breakdowns, dimensions, and multi-angle photography so you make informed, confident choices.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-brand-gold" />,
      title: 'Secure Checkout',
      subtitle: 'Encrypted Payments',
      desc: 'Bank-grade encrypted payments supporting UPI, cards, and net banking with protected customer data and order tracking.',
    },
    {
      icon: <Headphones className="w-5 h-5 text-brand-gold" />,
      title: 'Reliable Customer Support',
      subtitle: 'Dedicated Assistance',
      desc: 'Our customer support team is available via email and phone to answer saree queries, drape styling advice, and order assistance.',
    },
    {
      icon: <Truck className="w-5 h-5 text-brand-gold" />,
      title: 'Transparent Shipping & Returns',
      subtitle: 'Pan-India Delivery',
      desc: 'Complimentary insured shipping across India with prompt dispatch within 24-48 hours and an easy 7-day return and exchange policy.',
    },
  ];

  return (
    <section id="why-us-section" className="py-16 sm:py-20 text-brand-ivory relative overflow-hidden">
      {/* Seamless Contrast Gradient matching Hero for WCAG AA readability */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0F0617]/95 via-[#0F0617]/80 to-[#0F0617]/95 pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#0F0617]/90 via-transparent to-[#0F0617]/90 pointer-events-none" />

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
            <span>The Khandua Looms Promise</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight"
          >
            Why Choose Khandua Looms?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-4 text-xs sm:text-sm text-brand-ivory/80 font-sans leading-relaxed font-light"
          >
            We combine authentic Odisha textile heritage with a seamless, trustworthy digital shopping experience.
          </motion.p>
        </div>

        {/* 5 Benefits Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {benefits.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="relative p-6 rounded-3xl bg-brand-purple-dark/85 border border-brand-gold/30 hover:border-brand-gold/80 backdrop-blur-xl shadow-xl transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between"
            >
              <div>
                <div className="w-11 h-11 rounded-2xl bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center mb-4 group-hover:scale-105 group-hover:bg-brand-gold/20 transition-all">
                  {item.icon}
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-brand-gold/80 block mb-1">
                  {item.subtitle}
                </span>
                <h3 className="font-serif font-bold text-base text-white group-hover:text-brand-gold transition-colors leading-snug">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-xs text-brand-ivory/70 font-sans leading-relaxed font-light">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
