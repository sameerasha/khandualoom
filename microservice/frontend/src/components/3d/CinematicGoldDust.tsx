import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CinematicGoldDustProps {
  count?: number;
  scrollProgress?: number;
}

export const CinematicGoldDust: React.FC<CinematicGoldDustProps> = ({
  count = 140,
  scrollProgress = 0,
}) => {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, scales] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sca = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 14; // X
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10; // Y
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;  // Z
      sca[i] = Math.random() * 0.8 + 0.4;
    }
    return [pos, sca];
  }, [count]);

  // Gentle swirling stardust motion influenced by scroll
  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.getElapsedTime();
    const p = scrollProgress;

    // Continuous celestial rotation + vertical drift on scroll
    pointsRef.current.rotation.y = time * 0.04 + p * 0.5;
    pointsRef.current.rotation.x = Math.sin(time * 0.03) * 0.05 + p * 0.2;
    pointsRef.current.position.y = p * 1.2;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-scale"
          args={[scales, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.065}
        color="#FDE68A"
        transparent
        opacity={0.75}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
};
