import React from 'react';
import { motion } from 'motion/react';

export const WebGLFallback: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Luxurious ambient silk gradient mesh */}
      <div 
        className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_50%_40%,rgba(197,160,89,0.25)_0%,rgba(74,14,78,0.35)_45%,transparent_75%)]"
      />

      {/* Floating subtle gold aura circles */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.2, 0.35, 0.2],
          rotate: [0, 90, 180, 270, 360],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute -top-24 right-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-brand-gold/15 to-transparent blur-3xl"
      />

      <motion.div
        animate={{
          scale: [1.1, 0.95, 1.1],
          opacity: [0.15, 0.3, 0.15],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute bottom-10 left-1/4 w-[420px] h-[420px] rounded-full bg-gradient-to-bl from-brand-purple-light/25 to-brand-gold/10 blur-2xl"
      />

      {/* Heritage Indian Jacquard lattice watermark pattern */}
      <div 
        className="absolute inset-0 opacity-[0.035] bg-repeat pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#C5A059 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />
    </div>
  );
};
