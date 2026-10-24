import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { GoldenDustVortex } from './GoldenDustVortex';
import { CinematicCameraRig } from './CinematicCameraRig';
import { WebGLFallback } from './WebGLFallback';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

interface CinematicLoomCanvasProps {
  scrollProgress: number; // 0.0 (top) to 1.0 (bottom)
  className?: string;
}

const SceneLighting: React.FC<{ scrollProgress: number }> = ({ scrollProgress }) => {
  const p = Math.min(Math.max(scrollProgress, 0), 1.0);
  return (
    <>
      {/* 1. Ambient Warm Champagne Light */}
      <ambientLight color="#FFF8E7" intensity={0.95 + (p > 0.7 ? 0.35 : 0)} />

      {/* 2. Key Gold Studio Directional Light */}
      <directionalLight
        position={[6, 8, 5]}
        intensity={3.2}
        color="#FDE68A"
      />

      {/* 3. Fill Light: Royal Violet & Wine Accent */}
      <pointLight
        position={[-6, -4, -2]}
        intensity={3.0}
        color={p > 0.6 ? '#7C3AED' : '#A855F7'}
      />

      {/* 4. High-Intensity 24K Zari Rim Glow */}
      <pointLight
        position={[2, -2, 3]}
        intensity={2.8 + p * 1.5}
        color="#F59E0B"
      />

      {/* 5. Overhead Soft Glow */}
      <pointLight
        position={[0, 6, 2.5]}
        intensity={1.4}
        color="#DFBF7A"
      />
    </>
  );
};

export const CinematicLoomCanvas: React.FC<CinematicLoomCanvasProps> = ({
  scrollProgress,
  className = '',
}) => {
  const [hasWebGL, setHasWebGL] = useState(true);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGL(false);
      }
    } catch {
      setHasWebGL(false);
    }
  }, []);

  if (!hasWebGL) {
    return <WebGLFallback />;
  }

  return (
    <div className={`relative w-full h-full ${className}`}>
      <Suspense fallback={<WebGLFallback />}>
        <Canvas
          dpr={[1, 1.75]} // Strictly clamped to guarantee 60 FPS on all screens
          gl={{
            powerPreference: 'high-performance',
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.3,
            outputColorSpace: THREE.SRGBColorSpace,
            alpha: true,
          }}
          camera={{
            position: [0.8, 0.1, 5.5],
            fov: 42,
            near: 0.1,
            far: 100,
          }}
          onCreated={({ scene }) => {
            // Atmospheric fog seamlessly dissolves 3D boundaries into the dark luxury backdrop
            scene.fog = new THREE.FogExp2('#08020E', 0.026);
          }}
        >
          {/* Dynamic 3D Camera Rig responsive to scroll progression across all sections */}
          <CinematicCameraRig
            scrollProgress={scrollProgress}
            reducedMotion={reducedMotion}
          />

          {/* Art-Directed Studio Illumination */}
          <SceneLighting scrollProgress={scrollProgress} />

          {/* Pure 3D Golden Dust Matrix with Multi-Tier Scroll Choreography */}
          <GoldenDustVortex
            scrollProgress={scrollProgress}
            reducedMotion={reducedMotion}
          />
        </Canvas>
      </Suspense>
    </div>
  );
};
