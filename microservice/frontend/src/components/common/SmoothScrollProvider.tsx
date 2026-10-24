import React, { useEffect, ReactNode } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

interface SmoothScrollProviderProps {
  children: ReactNode;
  enabled?: boolean;
}

export const scrollToTopImmediate = () => {
  if (typeof window !== 'undefined') {
    if ((window as any).__lenis) {
      try {
        (window as any).__lenis.scrollTo(0, { immediate: true });
      } catch {}
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }
};

export const SmoothScrollProvider: React.FC<SmoothScrollProviderProps> = ({
  children,
  enabled = true,
}) => {
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion || !enabled) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
    });

    (window as any).__lenis = lenis;

    let animationFrameId: number;

    const raf = (time: number) => {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    };

    animationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
      delete (window as any).__lenis;
    };
  }, [reducedMotion, enabled]);

  return <>{children}</>;
};
