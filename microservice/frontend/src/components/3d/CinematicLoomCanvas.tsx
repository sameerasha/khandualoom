import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { SareeHandloomMesh } from './SareeHandloomMesh';
import { CinematicCameraRig } from './CinematicCameraRig';
import { CinematicGoldDust } from './CinematicGoldDust';
import { WebGLFallback } from './WebGLFallback';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

interface CinematicLoomCanvasProps {
  scrollProgress: number;
  className?: string;
}

const SceneLighting: React.FC<{ scrollProgress: number }> = ({ scrollProgress }) => {
  return (
    <>
      {/* 1. Ambient Warm Champagne Light */}
      <ambientLight color="#FFF8E7" intensity={0.85} />

      {/* 2. Key Gold Studio Directional Light */}
      <directionalLight
        position={[6, 7, 5]}
        intensity={2.8}
        color="#FDE68A"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      {/* 3. Fill Light: Royal Amethyst / Wine Glow on Shadowed Folds */}
      <pointLight
        position={[-6, -4, -2]}
        intensity={3.2}
        color="#A855F7"
      />

      {/* 4. High-Contrast Zari Rim Light defining the Silk Silhouette */}
      <pointLight
        position={[2, -3, 3]}
        intensity={2.4 + scrollProgress * 1.2}
        color="#F59E0B"
      />

      {/* 5. Overhead Soft Light */}
      <pointLight
        position={[0, 5, 2]}
        intensity={1.2}
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
          dpr={[1, 1.75]} // Strictly clamped to prevent GPU degradation on high-density screens
          gl={{
            powerPreference: 'high-performance',
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.15,
            outputColorSpace: THREE.SRGBColorSpace,
            alpha: true,
          }}
          camera={{
            position: [0.6, 0.1, 5.4],
            fov: 42,
            near: 0.1,
            far: 100,
          }}
          onCreated={({ scene }) => {
            // Atmospheric fog dissolves 3D boundaries into the dark luxury backdrop
            scene.fog = new THREE.FogExp2('#0F0617', 0.038);
          }}
        >
          {/* Dynamic 3D Camera Rig responsive to window scroll */}
          <CinematicCameraRig
            scrollProgress={scrollProgress}
            reducedMotion={reducedMotion}
          />

          {/* Three-Point Art-Directed Lighting */}
          <SceneLighting scrollProgress={scrollProgress} />

          {/* Master 3D Saree Pallu & Flying Handloom Shuttle */}
          <SareeHandloomMesh
            scrollProgress={scrollProgress}
            reducedMotion={reducedMotion}
          />

          {/* Drifting Golden Zari Stardust */}
          {!reducedMotion && (
            <CinematicGoldDust
              count={160}
              scrollProgress={scrollProgress}
            />
          )}
        </Canvas>
      </Suspense>
    </div>
  );
};
