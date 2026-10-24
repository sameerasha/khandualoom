import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { SilkRibbonMesh } from './SilkRibbonMesh';
import { FloatingGoldDust } from './FloatingGoldDust';
import { WebGLFallback } from './WebGLFallback';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

interface HeroSceneCanvasProps {
  className?: string;
}

// Internal scene setup with lighting and cameras
const SceneContent: React.FC<{ reducedMotion: boolean }> = ({ reducedMotion }) => {
  return (
    <>
      {/* Three-Point Art-Directed Luxury Lighting Rig */}
      {/* 1. Ambient warm champagne fill */}
      <ambientLight color="#FFF8E7" intensity={0.8} />

      {/* 2. Key golden studio light highlighting silk sheen */}
      <directionalLight
        position={[5, 6, 4]}
        intensity={2.2}
        color="#FDE68A"
        castShadow
      />

      {/* 3. Rim light reflecting royal amethyst tones */}
      <pointLight
        position={[-6, -4, -3]}
        intensity={2.5}
        color="#C084FC"
      />

      {/* 4. Subtle accent warm point light */}
      <pointLight
        position={[2, 3, 2]}
        intensity={1.2}
        color="#F59E0B"
      />

      {/* Primary 3D Centerpiece */}
      <SilkRibbonMesh reducedMotion={reducedMotion} />

      {/* Ambient floating zari dust particles */}
      {!reducedMotion && <FloatingGoldDust count={90} />}
    </>
  );
};

export const HeroSceneCanvas: React.FC<HeroSceneCanvasProps> = ({ className = '' }) => {
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
    <div className={`relative w-full h-full pointer-events-auto ${className}`}>
      {/* Underlay glow fallback */}
      <WebGLFallback />

      <Canvas
        className="w-full h-full"
        dpr={[1, 1.75]}
        camera={{
          position: [0, 0, 5],
          fov: 42,
          near: 0.1,
          far: 25,
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        <Suspense fallback={null}>
          <SceneContent reducedMotion={reducedMotion} />
        </Suspense>
      </Canvas>
    </div>
  );
};
