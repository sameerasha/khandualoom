import React from 'react';

interface ScrollChapterIndicatorProps {
  scrollProgress: number; // 0.0 to 1.0
}

export const ScrollChapterIndicator: React.FC<ScrollChapterIndicatorProps> = ({ scrollProgress }) => {
  const chapters = [
    { id: 'hero-top', label: '01 ATELIER', targetY: 0, range: [0, 0.22] },
    { id: 'trust-section', label: '02 TRUST', targetY: 800, range: [0.22, 0.42] },
    { id: 'craft-section', label: '03 KADWA', targetY: 1550, range: [0.42, 0.62] },
    { id: 'catalog-section', label: '04 CATALOG', targetY: 2300, range: [0.62, 0.82] },
    { id: 'heritage', label: '05 HERITAGE', targetY: 3400, range: [0.82, 1.0] },
  ];

  const scrollToChapter = (id: string, targetY: number) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-end gap-5 pointer-events-auto">
      {/* Chapter Track Line */}
      <div className="relative flex flex-col items-end gap-6 pr-2 py-4">
        {chapters.map((ch, idx) => {
          const isActive = scrollProgress >= ch.range[0] && scrollProgress <= ch.range[1];
          return (
            <button
              key={idx}
              onClick={() => scrollToChapter(ch.id, ch.targetY)}
              className="group flex items-center gap-3 transition-all duration-300 focus:outline-none"
              title={ch.label}
            >
              {/* Text Label on Hover or Active */}
              <span
                className={`text-[10px] font-mono tracking-widest uppercase transition-all duration-300 ${
                  isActive
                    ? 'text-brand-gold opacity-100 font-bold translate-x-0'
                    : 'text-brand-ivory/40 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0'
                }`}
              >
                {ch.label}
              </span>

              {/* Indicator Dot / Gold Bar */}
              <div
                className={`transition-all duration-500 rounded-full ${
                  isActive
                    ? 'w-7 h-1.5 bg-gradient-to-r from-brand-gold-light to-brand-gold shadow-lg shadow-brand-gold/50'
                    : 'w-1.5 h-1.5 bg-brand-gold/30 group-hover:bg-brand-gold/70 group-hover:scale-125'
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};
