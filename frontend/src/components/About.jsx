import { useEffect, useRef } from 'react';
import './About.css';

export default function About() {
  const sectionRef = useRef(null);

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

  return (
    <section className="about" id="about" ref={sectionRef}>
      <div className="about__bg-accent"></div>
      <div className="container">
        <div className="about__grid">
          {/* Left - Image Collage */}
          <div className="about__visual reveal">
            <div className="about__image-main">
              <img src="/images/saree_crimson_red.png" alt="Handloom Artisan" />
              <div className="about__image-border"></div>
            </div>
            <div className="about__image-accent">
              <img src="/images/saree_emerald_green.png" alt="Silk Weaving" />
            </div>
            <div className="about__exp-badge">
              <span className="about__exp-number">75+</span>
              <span className="about__exp-text">Years of Heritage</span>
            </div>
          </div>

          {/* Right - Content */}
          <div className="about__content">
            <span className="about__label reveal">Our Legacy</span>
            <h2 className="section-title reveal reveal-delay-1">
              Weaving Dreams,<br />
              <span className="gold-text">Preserving Heritage</span>
            </h2>
            <hr className="divider reveal reveal-delay-2" />
            <p className="about__text reveal reveal-delay-2">
              Since 1947, Vastra Loom has been at the heart of India's handloom revival. 
              We work directly with over 500 master artisans across Varanasi, Kanchipuram, 
              Chanderi, and Patan — ensuring fair wages and preserving ancient weaving techniques 
              that are centuries old.
            </p>
            <p className="about__text reveal reveal-delay-3">
              Each saree in our collection is a labour of love, taking anywhere from 15 days 
              to 8 months to complete. We believe in slow fashion — where every thread, every 
              motif, every color tells a story of tradition, patience, and artistry.
            </p>

            {/* Features */}
            <div className="about__features reveal reveal-delay-4">
              <div className="about__feature">
                <div className="about__feature-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <div>
                  <h4 className="about__feature-title">100% Authentic</h4>
                  <p className="about__feature-text">GI tagged & certified handloom</p>
                </div>
              </div>

              <div className="about__feature">
                <div className="about__feature-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                  </svg>
                </div>
                <div>
                  <h4 className="about__feature-title">Artisan Direct</h4>
                  <p className="about__feature-text">Fair trade, empowering weavers</p>
                </div>
              </div>

              <div className="about__feature">
                <div className="about__feature-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                    <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                </div>
                <div>
                  <h4 className="about__feature-title">Free Shipping</h4>
                  <p className="about__feature-text">On orders above ₹5,000</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
