import { useState, useEffect, useRef } from 'react';
import './Testimonials.css';

const testimonials = [
  {
    id: 1,
    name: 'Priya Sharma',
    location: 'Mumbai',
    rating: 5,
    text: 'The Banarasi silk I ordered was absolutely breathtaking. The zari work is so intricate, you can feel the centuries of craftsmanship in every thread. My wedding saree became the centerpiece of the celebration.',
    product: 'Royal Banarasi Silk',
    avatar: '👩🏽',
  },
  {
    id: 2,
    name: 'Anita Krishnamurthy',
    location: 'Chennai',
    rating: 5,
    text: 'As someone from Kanchipuram, I know my Kanjeevarams. Vastra Loom\'s collection rivals the best. The temple border saree I purchased has the most authentic weave I\'ve seen from an online store.',
    product: 'Kanjeevaram Temple Border',
    avatar: '👩🏽‍💼',
  },
  {
    id: 3,
    name: 'Deepika Patel',
    location: 'Ahmedabad',
    rating: 5,
    text: 'The Patola saree is an absolute treasure. My mother-in-law couldn\'t believe it was ordered online. The double ikat patterns are flawless, and the packaging was so luxurious — felt like unwrapping a gift.',
    product: 'Patola Heritage Weave',
    avatar: '👩🏻',
  },
  {
    id: 4,
    name: 'Meera Reddy',
    location: 'Hyderabad',
    rating: 5,
    text: 'I\'ve been collecting handloom sarees for 20 years, and Vastra Loom has quickly become my go-to. The quality is unmatched, and knowing my purchase supports artisan families makes it even more special.',
    product: 'Chanderi Emerald Dream',
    avatar: '👩🏽‍🦱',
  },
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.reveal').forEach((el) => el.classList.add('visible'));
          }
        });
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const goTo = (index) => {
    setActiveIndex(index);
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
  };

  return (
    <section className="testimonials" id="testimonials" ref={sectionRef}>
      <div className="testimonials__bg-pattern"></div>
      <div className="container">
        <div className="testimonials__header reveal">
          <span className="testimonials__label">Testimonials</span>
          <h2 className="section-title">
            Loved by <span className="gold-text">Connoisseurs</span>
          </h2>
          <p className="section-subtitle">Hear from women who have made Vastra Loom sarees part of their most cherished moments</p>
          <hr className="divider" style={{ margin: '1rem auto 0' }} />
        </div>

        <div className="testimonials__carousel reveal reveal-delay-2">
          {/* Large Quote */}
          <div className="testimonials__quote-icon">❝</div>

          {/* Active Testimonial */}
          <div className="testimonials__content">
            {testimonials.map((t, i) => (
              <div
                key={t.id}
                className={`testimonial-card ${i === activeIndex ? 'testimonial-card--active' : ''}`}
              >
                <p className="testimonial-card__text">{t.text}</p>
                <div className="testimonial-card__author">
                  <span className="testimonial-card__avatar">{t.avatar}</span>
                  <div>
                    <h4 className="testimonial-card__name">{t.name}</h4>
                    <p className="testimonial-card__meta">{t.location} • {t.product}</p>
                  </div>
                  <div className="testimonial-card__stars">
                    {Array.from({ length: t.rating }, (_, i) => (
                      <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#d4a853" stroke="#d4a853" strokeWidth="1">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dots */}
          <div className="testimonials__dots">
            {testimonials.map((_, i) => (
              <button
                key={i}
                className={`testimonials__dot ${i === activeIndex ? 'testimonials__dot--active' : ''}`}
                onClick={() => goTo(i)}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
