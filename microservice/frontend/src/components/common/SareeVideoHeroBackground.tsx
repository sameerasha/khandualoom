import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, Volume2, VolumeX, Film, Layers, Sparkles, ChevronRight } from 'lucide-react';
import { HeroSceneCanvas } from '../3d/HeroSceneCanvas';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

interface SareeScene {
  id: string;
  label: string;
  tagline: string;
  src: string;
  poster: string;
}

const SAREE_SCENES: SareeScene[] = [
  {
    id: 'silk-drape',
    label: 'Haute Silk Drape',
    tagline: 'Mulberry silk undulation in royal violet & gold',
    src: '/videos/saree_drape_loop.mp4',
    poster: '/images/hero_banner.png',
  },
  {
    id: 'aureus-gold',
    label: 'Imperial Zari Masterpiece',
    tagline: 'Pure 24k electroplated gold thread embellishment',
    src: '/videos/aureus_gold_saree.mp4',
    poster: '/images/saree_master_front.png',
  },
  {
    id: 'atelier-loom',
    label: 'Artisan Loom Craft',
    tagline: 'Varanasi Chowk wooden shuttle handloom weave',
    src: '/videos/atelier_loom_loop.mp4',
    poster: '/images/hero_banner_loggedin.png',
  },
];

interface SareeVideoHeroBackgroundProps {
  onModeChange?: (mode: 'video' | '3d') => void;
}

export const SareeVideoHeroBackground: React.FC<SareeVideoHeroBackgroundProps> = ({ onModeChange }) => {
  const reducedMotion = usePrefersReducedMotion();
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(!reducedMotion);
  const [isMuted, setIsMuted] = useState(true);
  const [viewMode, setViewMode] = useState<'video' | '3d'>('video');
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentScene = SAREE_SCENES[currentSceneIdx];

  // Sync play/pause with state
  useEffect(() => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.play().catch(() => {
        // Autoplay policy prevented playback, keep muted
        setIsPlaying(false);
      });
    } else {
      videoRef.current.pause();
    }
  }, [isPlaying, currentSceneIdx]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const handleSceneChange = (index: number) => {
    setCurrentSceneIdx(index);
    setVideoLoaded(false);
    setVideoError(false);
    setIsPlaying(true);
  };

  const handleToggleMode = () => {
    const nextMode = viewMode === 'video' ? '3d' : 'video';
    setViewMode(nextMode);
    onModeChange?.(nextMode);
  };

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-[#0A0410]">
      {viewMode === '3d' ? (
        /* 3D WebGL Canvas Layer */
        <div className="absolute inset-0 z-0">
          <HeroSceneCanvas />
        </div>
      ) : (
        /* Saree Animation Video Layer */
        <div className="absolute inset-0 z-0">
          {/* Saree Video Element */}
          <video
            ref={videoRef}
            key={currentScene.src}
            autoPlay={!reducedMotion}
            loop
            muted={isMuted}
            playsInline
            poster={currentScene.poster}
            onLoadedData={() => setVideoLoaded(true)}
            onError={() => setVideoError(true)}
            className={`w-full h-full object-cover object-center transition-opacity duration-1000 ${
              videoLoaded ? 'opacity-90 scale-105' : 'opacity-40 scale-100'
            }`}
            style={{
              filter: 'brightness(0.85) contrast(1.1) saturate(1.15)',
            }}
          >
            <source src={currentScene.src} type="video/mp4" />
          </video>

          {/* Graceful Fallback / Ambient Ken-Burns Image if video fails */}
          {videoError && (
            <div
              className="absolute inset-0 bg-cover bg-center animate-pulse"
              style={{ backgroundImage: `url(${currentScene.poster})` }}
            />
          )}

          {/* Golden Silk Sheen & Shimmer Gradients */}
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-purple-dark/85 via-transparent to-brand-gold/15 mix-blend-color-dodge pointer-events-none" />

          {/* Royal Saree Jacquard Mesh Watermark */}
          <div
            className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle at 25px 25px, #D4AF37 2%, transparent 0%), radial-gradient(circle at 75px 75px, #D4AF37 2%, transparent 0%)`,
              backgroundSize: '100px 100px',
            }}
          />

          {/* Floating Golden Dust Particles (Ambient CSS Animation) */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(14)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: `${(i * 7.5) % 100}%`,
                  y: `${(i * 13) % 100}%`,
                  opacity: 0.2 + (i % 5) * 0.15,
                  scale: 0.6 + (i % 3) * 0.4,
                }}
                animate={{
                  y: ['-10%', '110%'],
                  x: [`${(i * 7.5) % 100}%`, `${((i * 7.5) % 100) + ((i % 2 === 0 ? 1 : -1) * 8)}%`],
                  opacity: [0.2, 0.7, 0.2],
                }}
                transition={{
                  duration: 12 + (i % 6) * 3,
                  repeat: Infinity,
                  ease: 'linear',
                  delay: i * 0.8,
                }}
                className="absolute w-1.5 h-1.5 rounded-full bg-gradient-to-r from-brand-gold to-amber-200 blur-[0.5px] shadow-[0_0_8px_#D4AF37]"
              />
            ))}
          </div>
        </div>
      )}

      {/* Atmospheric Vignette & Contrast Gradients for WCAG AA Readability */}
      <div className="absolute inset-0 z-1 bg-gradient-to-r from-[#0F0617]/95 via-[#0F0617]/75 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#0F0617] via-[#0F0617]/80 to-transparent pointer-events-none" />

      {/* Interactive Luxury Ambient Controls Bar (Bottom-Right) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-6 right-6 z-20 flex flex-wrap items-center gap-2 sm:gap-3 bg-brand-purple-dark/80 backdrop-blur-xl border border-brand-gold/30 px-3.5 py-2 rounded-2xl shadow-2xl text-xs text-brand-ivory"
      >
        {/* Play/Pause Button */}
        {viewMode === 'video' && (
          <button
            onClick={togglePlay}
            className="p-1.5 rounded-lg text-brand-gold hover:text-white hover:bg-brand-gold/20 transition-colors"
            title={isPlaying ? 'Pause Saree Video' : 'Play Saree Video'}
            aria-label="Toggle Saree Video Playback"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
          </button>
        )}

        {/* Audio Mute/Unmute */}
        {viewMode === 'video' && (
          <button
            onClick={toggleMute}
            className="p-1.5 rounded-lg text-brand-gold hover:text-white hover:bg-brand-gold/20 transition-colors"
            title={isMuted ? 'Unmute Ambient Sound' : 'Mute Ambient Sound'}
            aria-label="Toggle Video Sound"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        )}

        {/* Scene Selector Pills */}
        {viewMode === 'video' && (
          <div className="hidden md:flex items-center gap-1.5 pl-1 pr-2 border-l border-brand-gold/20">
            {SAREE_SCENES.map((scene, idx) => (
              <button
                key={scene.id}
                onClick={() => handleSceneChange(idx)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-sans transition-all flex items-center gap-1 ${
                  currentSceneIdx === idx
                    ? 'bg-gradient-to-r from-brand-gold to-brand-gold-dark text-brand-purple-dark font-bold shadow'
                    : 'text-brand-ivory/70 hover:text-brand-gold hover:bg-white/5'
                }`}
              >
                <span>{scene.label}</span>
                {currentSceneIdx === idx && <Sparkles className="w-3 h-3 text-brand-purple-dark" />}
              </button>
            ))}
          </div>
        )}

        {/* Mode Toggle: Saree Video vs 3D Loom */}
        <button
          onClick={handleToggleMode}
          className="ml-1 pl-2.5 border-l border-brand-gold/20 flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-brand-gold-light hover:text-white transition-colors"
          title="Toggle between Saree Video and 3D WebGL Canvas"
        >
          {viewMode === 'video' ? (
            <>
              <Layers className="w-3.5 h-3.5 text-brand-gold" />
              <span className="hidden sm:inline">3D Loom Drape</span>
              <ChevronRight className="w-3 h-3 opacity-60" />
            </>
          ) : (
            <>
              <Film className="w-3.5 h-3.5 text-brand-gold" />
              <span className="hidden sm:inline">Saree Video</span>
              <ChevronRight className="w-3 h-3 opacity-60" />
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
};
