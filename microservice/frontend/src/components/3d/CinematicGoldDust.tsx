import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CinematicGoldDustProps {
  count?: number;
  scrollProgress?: number;
}

export const CinematicGoldDust: React.FC<CinematicGoldDustProps> = ({
  count = 160,
  scrollProgress = 0,
}) => {
  const pointsRef = useRef<THREE.Points>(null);
  const embersRef = useRef<THREE.Points>(null);

  // 1. Fine Golden Stardust
  const [positions, scales] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sca = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
      sca[i] = Math.random() * 0.9 + 0.3;
    }
    return [pos, sca];
  }, [count]);

  // 2. Larger Floating Bokeh Embers
  const emberCount = 36;
  const emberPositions = useMemo(() => {
    const pos = new Float32Array(emberCount * 3);
    for (let i = 0; i < emberCount; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6 + 1.5; // Closer to camera for cinematic bokeh
    }
    return pos;
  }, []);

  // Frame loop: gentle atmospheric swirling & pulsation
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const p = scrollProgress;

    if (pointsRef.current) {
      pointsRef.current.rotation.y = time * 0.035 + p * 0.45;
      pointsRef.current.rotation.x = Math.sin(time * 0.025) * 0.06 + p * 0.2;
      pointsRef.current.position.y = -p * 0.8;
    }

    if (embersRef.current) {
      embersRef.current.rotation.y = -time * 0.02 + p * 0.3;
      embersRef.current.position.y = Math.sin(time * 0.4) * 0.15 - p * 1.2;
      const mat = embersRef.current.material as THREE.PointsMaterial;
      if (mat) {
        // Soft pulsing glow
        mat.opacity = 0.55 + Math.sin(time * 1.8) * 0.2;
      }
    }
  });

  return (
    <group>
      {/* 1. Fine Golden Stardust Grains */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-scale" args={[scales, 1]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.065}
          color="#FDE68A"
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
          depthWrite={false}
        />
      </points>

      {/* 2. Soft Floating Bokeh Golden Embers */}
      <points ref={embersRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[emberPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.18}
          color="#FFD700"
          transparent
          opacity={0.65}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
    </group>
  );
};
