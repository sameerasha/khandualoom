import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ChevronLeft, ChevronRight, Quote, MessageCircle } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  location: string;
  rating: number;
  text: string;
  product: string;
  isDemo: boolean;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Sasmita Mohapatra',
    location: 'Bhubaneswar, Odisha',
    rating: 5,
    text: 'The Nuapatna Khadua Silk saree has remarkable drape quality. The sacred calligraphic verses and subtle gold zari feel authentic and respectful of our traditional handloom heritage. A treasured addition to my festive wardrobe.',
    product: 'Traditional Khadua Silk Saree',
    isDemo: true,
  },
  {
    id: 2,
    name: 'Priyanka Sen',
    location: 'Kolkata, West Bengal',
    rating: 5,
    text: 'The Sambalpuri Bandha tie-dye alignment is flawless. The conch and chakra motifs are sharp, and the pure mulberry silk has a rich natural luster without being stiff or synthetic.',
    product: 'Sambalpuri Ikat Handloom Saree',
    isDemo: true,
  },
  {
    id: 3,
    name: 'Ananya Rao',
    location: 'Bengaluru, Karnataka',
    rating: 5,
    text: 'Ordering an authentic Bomkai saree online made me cautious, but the detailed weave photographs and prompt pan-India delivery exceeded all expectations. The jhabba pallu craftsmanship is stunning.',
    product: 'Traditional Bomkai Silk Saree',
    isDemo: true,
  },
  {
    id: 4,
    name: 'Rupali Patnaik',
    location: 'New Delhi',
    rating: 5,
    text: 'The Phoda Kumbha temple borders on this bridal silk saree are extraordinarily detailed. The unstitched blouse piece matched the body tone perfectly, and the presentation box is heirloom grade.',
    product: 'Wedding Heritage Silk Saree',
    isDemo: true,
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
    <section className="py-16 sm:py-20 relative overflow-hidden text-brand-ivory">
      {/* Contrast Gradients matching Hero for WCAG AA readability over 3D canvas */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0F0617]/95 via-[#0F0617]/80 to-[#0F0617]/95 pointer-events-none" />

      {/* Background Watermark Quote */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.03] text-brand-gold">
        <Quote className="w-[450px] h-[450px]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-brand-gold/30 bg-brand-gold/10 text-brand-gold text-xs font-mono uppercase tracking-widest mb-3">
            <MessageCircle className="w-3.5 h-3.5 text-brand-gold" />
            <span>Demonstration Feedback • Preview</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-brand-ivory">
            Customer <span className="bg-gradient-to-r from-brand-gold-light via-brand-gold to-brand-gold-dark bg-clip-text text-transparent italic">Appraisals</span>
          </h2>
          <div className="w-16 h-0.5 bg-brand-gold mx-auto mt-4 mb-3" />
          <p className="text-xs sm:text-sm text-brand-ivory/70 font-light">
            Illustrative customer experiences highlighting the drape, weave details, and artistry of Khandua Looms sarees.
          </p>
        </div>

        {/* Testimonial Card Stage */}
        <div className="relative bg-gradient-to-b from-[#180828] to-[#0D0216] border border-brand-gold/30 rounded-3xl p-7 sm:p-10 lg:p-12 backdrop-blur-xl shadow-2xl">
          <Quote className="w-10 h-10 text-brand-gold/25 mb-4" />

          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* Rating */}
              <div className="flex items-center gap-1.5 text-amber-400">
                {[...Array(active.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
                <span className="ml-2 text-xs font-mono text-brand-gold-light/80">5.0 / 5.0</span>
              </div>

              {/* Review Text */}
              <p className="font-serif text-lg sm:text-xl lg:text-2xl text-white font-medium leading-relaxed italic">
                "{active.text}"
              </p>

              {/* Author & Product */}
              <div className="pt-4 border-t border-brand-gold/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-serif font-bold text-base text-brand-gold">
                    {active.name}
                  </h4>
                  <p className="text-xs text-brand-ivory/60 font-sans mt-0.5">
                    {active.location}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-brand-gold-light/90 bg-white/5 border border-brand-gold/25 px-3 py-1 rounded-full">
                    Saree: {active.product}
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-8 pt-4 border-t border-brand-gold/15">
            <div className="flex gap-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    currentIndex === idx ? 'bg-brand-gold w-6' : 'bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Go to review ${idx + 1}`}
                />
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={handlePrev}
                className="w-9 h-9 rounded-full border border-brand-gold/30 hover:border-brand-gold flex items-center justify-center text-brand-gold hover:text-white hover:bg-brand-gold/20 transition-all cursor-pointer"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="w-9 h-9 rounded-full border border-brand-gold/30 hover:border-brand-gold flex items-center justify-center text-brand-gold hover:text-white hover:bg-brand-gold/20 transition-all cursor-pointer"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
