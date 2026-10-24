import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

interface SilkRibbonMeshProps {
  reducedMotion?: boolean;
}

export const SilkRibbonMesh: React.FC<SilkRibbonMeshProps> = ({ reducedMotion = false }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const targetRotation = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    if (!meshRef.current) return;

    if (!reducedMotion) {
      const time = state.clock.getElapsedTime();

      // Mouse interactive tilt (lerp towards mouse coordinates)
      const mouseX = state.pointer.x * 0.4;
      const mouseY = state.pointer.y * 0.3;
      targetRotation.current.x = THREE.MathUtils.lerp(targetRotation.current.x, mouseY, 0.05);
      targetRotation.current.y = THREE.MathUtils.lerp(targetRotation.current.y, mouseX, 0.05);

      // Continuous stately silk undulating rotation
      meshRef.current.rotation.y = time * 0.22 + targetRotation.current.y;
      meshRef.current.rotation.x = Math.sin(time * 0.18) * 0.2 + targetRotation.current.x;
      meshRef.current.rotation.z = Math.cos(time * 0.15) * 0.12;
    }
  });

  return (
    <Float
      speed={reducedMotion ? 0 : 1.8}
      rotationIntensity={reducedMotion ? 0 : 0.4}
      floatIntensity={reducedMotion ? 0 : 0.6}
      floatingRange={[-0.15, 0.15]}
    >
      <mesh
        ref={meshRef}
        position={[1.5, 0.1, 0]}
        scale={[1.15, 1.15, 1.15]}
        castShadow
        receiveShadow
      >
        {/* TorusKnot represents the continuous drape and flow of pure mulberry silk */}
        <torusKnotGeometry args={[1.25, 0.32, 160, 32, 2, 3]} />
        <meshStandardMaterial
          color="#DFBF7A"
          roughness={0.28}
          metalness={0.78}
          emissive="#300833"
          emissiveIntensity={0.22}
        />
      </mesh>
    </Float>
  );
};
