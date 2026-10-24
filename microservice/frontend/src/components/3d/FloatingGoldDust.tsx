import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FloatingGoldDustProps {
  count?: number;
}

export const FloatingGoldDust: React.FC<FloatingGoldDustProps> = ({ count = 120 }) => {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate random positions and slight scale offsets
  const [positions, scales] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sca = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 12; // X
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;  // Y
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6;  // Z
      sca[i] = Math.random() * 0.5 + 0.5;
    }
    return [pos, sca];
  }, [count]);

  // Gentle floating motion
  useFrame((state) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.03;
    pointsRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.02) * 0.05;
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
        size={0.045}
        color="#DFBF7A"
        transparent
        opacity={0.65}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};
