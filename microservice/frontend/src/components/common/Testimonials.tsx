import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ChevronLeft, ChevronRight, Quote, CheckCircle } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  location: string;
  rating: number;
  text: string;
  product: string;
  verified: boolean;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Priya Sharma',
    location: 'Mumbai, Maharashtra',
    rating: 5,
    text: 'The Banarasi silk I received for my wedding reception was breathtaking. The pure gold zari work had a soft, luminous gleam under the chandeliers that synthetic copies simply cannot match. It is an heirloom I will pass down to my daughter.',
    product: 'Royal Banarasi Silk',
    verified: true,
  },
  {
    id: 2,
    name: 'Anita Krishnamurthy',
    location: 'Chennai, Tamil Nadu',
    rating: 5,
    text: 'Growing up in South India, Kanjeevarams are woven into our identity. Vastra Loom’s korvai temple border weave is authentic to the highest standard. The weight of the mulberry silk and contrast pallu is pure perfection.',
    product: 'Kanjeevaram Temple Border',
    verified: true,
  },
  {
    id: 3,
    name: 'Deepika Patel',
    location: 'Ahmedabad, Gujarat',
    rating: 5,
    text: 'Acquiring an authentic double-ikat Patola online felt daunting, but Vastra Loom exceeded every expectation. The geometric symmetry and vegetable dye radiance take months to weave, and the velvet presentation box made it unforgettable.',
    product: 'Patola Heritage Weave',
    verified: true,
  },
  {
    id: 4,
    name: 'Meera Reddy',
    location: 'Hyderabad, Telangana',
    rating: 5,
    text: 'Having collected master handlooms for over twenty years, this atelier has become my premier destination. Direct artisan sourcing with verified Silk Mark credentials makes every purchase a meaningful celebration of our culture.',
    product: 'Chanderi Emerald Dream',
    verified: true,
  },
];

export const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const active = testimonials[currentIndex];

  return (
    <section className="py-24 bg-gradient-to-b from-[#0F0617] via-[#140A1F] to-[#0F0617] text-brand-ivory relative overflow-hidden border-b border-brand-gold/15">
      {/* Background Watermark Quote */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.03] text-brand-gold">
        <Quote className="w-[450px] h-[450px]" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-brand-gold font-mono block mb-3">
            Connoisseur Reviews
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-brand-ivory">
            Cherished by <span className="bg-gradient-to-r from-brand-gold-light via-brand-gold to-brand-gold-dark bg-clip-text text-transparent italic">Patrons</span>
          </h2>
          <div className="w-16 h-0.5 bg-brand-gold mx-auto mt-5 mb-4" />
          <p className="text-sm sm:text-base text-brand-ivory/70 font-light">
            Read intimate stories from brides, connoisseurs, and saree collectors across the globe.
          </p>
        </div>

        {/* Testimonial Card Stage */}
        <div className="relative bg-brand-purple-dark/50 border border-brand-gold/25 rounded-3xl p-8 sm:p-12 lg:p-16 backdrop-blur-xl shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center text-center"
            >
              {/* Star Rating */}
              <div className="flex items-center gap-1.5 text-brand-gold mb-6">
                {[...Array(active.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-brand-gold" />
                ))}
              </div>

              {/* Quote Text */}
              <blockquote className="font-serif text-lg sm:text-2xl text-brand-ivory leading-relaxed font-normal max-w-3xl italic">
                &ldquo;{active.text}&rdquo;
              </blockquote>

              {/* Author & Product Info */}
              <div className="mt-8 pt-8 border-t border-brand-gold/15 w-full max-w-md flex flex-col items-center">
                <div className="flex items-center gap-2">
                  <h4 className="font-serif font-bold text-lg text-brand-ivory">{active.name}</h4>
                  {active.verified && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
                      <CheckCircle className="w-3 h-3" /> Verified Buyer
                    </span>
                  )}
                </div>
                <p className="text-xs text-brand-ivory/60 mt-1">{active.location}</p>
                <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-brand-gold font-mono uppercase tracking-wider">
                  <span>Purchased:</span>
                  <span className="font-bold underline decoration-brand-gold/40">{active.product}</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Carousel Arrows */}
          <div className="flex justify-between items-center mt-10 pt-6 border-t border-brand-gold/10">
            <button
              onClick={handlePrev}
              className="p-3 rounded-full border border-brand-gold/30 text-brand-gold-light hover:bg-brand-gold/10 hover:border-brand-gold transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Pagination Dots */}
            <div className="flex items-center gap-2.5">
              {testimonials.map((t, idx) => (
                <button
                  key={t.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentIndex
                      ? 'w-8 bg-brand-gold'
                      : 'w-2 bg-brand-gold/30 hover:bg-brand-gold/60'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="p-3 rounded-full border border-brand-gold/30 text-brand-gold-light hover:bg-brand-gold/10 hover:border-brand-gold transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
