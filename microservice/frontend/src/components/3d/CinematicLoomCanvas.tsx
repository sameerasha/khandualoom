import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { SareeHandloomMesh } from './SareeHandloomMesh';
import { CinematicCameraRig } from './CinematicCameraRig';
import { CinematicGoldDust } from './CinematicGoldDust';
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
      <ambientLight color="#FFF8E7" intensity={0.9 + (p > 0.7 ? 0.35 : 0)} />

      {/* 2. Key Gold Studio Directional Light with Specular Glaze */}
      <directionalLight
        position={[6, 8, 5]}
        intensity={3.2}
        color="#FDE68A"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      {/* 3. Fill Light: Royal Magenta & Wine Glow softening shadow folds */}
      <pointLight
        position={[-6, -4, -2]}
        intensity={3.4}
        color={p > 0.6 ? '#9333EA' : '#C026D3'}
      />

      {/* 4. High-Contrast 24K Zari Rim Light defining the Silk Silhouette */}
      <pointLight
        position={[2, -3, 3]}
        intensity={2.6 + p * 1.8}
        color="#F59E0B"
      />

      {/* 5. Overhead Soft Luminescence */}
      <pointLight
        position={[0, 6, 2.5]}
        intensity={1.4}
        color="#DFBF7A"
      />

      {/* 6. Subtle Lower Caustic Rim Light */}
      <pointLight
        position={[1, -5, 1]}
        intensity={1.2}
        color="#EAB308"
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
          dpr={[1, 1.75]} // Strictly clamped to prevent GPU degradation on high-density displays
          gl={{
            powerPreference: 'high-performance',
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.25,
            outputColorSpace: THREE.SRGBColorSpace,
            alpha: true,
          }}
          camera={{
            position: [0.8, 0.1, 5.4],
            fov: 42,
            near: 0.1,
            far: 100,
          }}
          onCreated={({ scene }) => {
            // Atmospheric fog dissolves 3D boundaries into the dark luxury backdrop
            scene.fog = new THREE.FogExp2('#0C0414', 0.032);
          }}
        >
          {/* Dynamic 3D Camera Rig responsive to window scroll across all sections */}
          <CinematicCameraRig
            scrollProgress={scrollProgress}
            reducedMotion={reducedMotion}
          />

          {/* Multi-Point Art-Directed Studio Lighting */}
          <SceneLighting scrollProgress={scrollProgress} />

          {/* Master 3D Saree, Flying Handloom Shuttle & Multi-Stage Geometry */}
          <SareeHandloomMesh
            scrollProgress={scrollProgress}
            reducedMotion={reducedMotion}
          />

          {/* Dual-Layer Drifting Golden Zari Stardust & Bokeh Embers */}
          {!reducedMotion && (
            <CinematicGoldDust
              count={180}
              scrollProgress={scrollProgress}
            />
          )}
        </Canvas>
      </Suspense>
    </div>
  );
};
