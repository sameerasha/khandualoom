import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

interface CinematicSilkSculptureProps {
  scrollProgress?: number;
  reducedMotion?: boolean;
}

export const CinematicSilkSculpture: React.FC<CinematicSilkSculptureProps> = ({
  scrollProgress = 0,
  reducedMotion = false,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const primarySilkRef = useRef<THREE.Mesh>(null);
  const outerZariRef = useRef<THREE.Mesh>(null);
  const innerZariRef = useRef<THREE.Mesh>(null);
  const innerCoreRef = useRef<THREE.Mesh>(null);
  const haloRing1Ref = useRef<THREE.Mesh>(null);
  const haloRing2Ref = useRef<THREE.Mesh>(null);

  const targetRotation = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    if (!groupRef.current) return;

    const time = state.clock.getElapsedTime();
    const p = scrollProgress; // 0 (top) to ~1.2+ (scrolled)

    if (!reducedMotion) {
      // 1. Mouse interactive parallax lerp
      const mouseX = state.pointer.x * 0.45;
      const mouseY = state.pointer.y * 0.35;
      targetRotation.current.x = THREE.MathUtils.lerp(targetRotation.current.x, mouseY, 0.06);
      targetRotation.current.y = THREE.MathUtils.lerp(targetRotation.current.y, mouseX, 0.06);

      // 2. Dynamic group position driven by scroll
      // As p increases, glides towards center and slightly downward
      const targetGroupX = 1.35 - p * 1.4 + targetRotation.current.y * 0.7;
      const targetGroupY = -0.05 - p * 0.8 - targetRotation.current.x * 0.5;
      const targetGroupZ = -p * 0.3;

      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetGroupX, 0.08);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetGroupY, 0.08);
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetGroupZ, 0.08);

      // 3. Primary Silk Drape Rotation:
      // Inverts and rotates dynamically in 3D space with scroll progression
      if (primarySilkRef.current) {
        primarySilkRef.current.rotation.y = time * 0.32 + p * Math.PI * 2.2 + targetRotation.current.y;
        primarySilkRef.current.rotation.x = Math.sin(time * 0.22) * 0.28 + p * 1.35 + targetRotation.current.x;
        primarySilkRef.current.rotation.z = Math.cos(time * 0.18) * 0.16 - p * 0.85;
      }

      // 4. Double Gold Zari Border Trims sync with silk
      if (outerZariRef.current && primarySilkRef.current) {
        outerZariRef.current.rotation.copy(primarySilkRef.current.rotation);
      }
      if (innerZariRef.current && primarySilkRef.current) {
        innerZariRef.current.rotation.copy(primarySilkRef.current.rotation);
      }

      // 5. Inner Radiant Core counter-rotates with pulsating crystal effect
      if (innerCoreRef.current) {
        innerCoreRef.current.rotation.y = -time * 0.5 - p * 1.5;
        innerCoreRef.current.rotation.x = time * 0.35;
        const pulse = 1 + Math.sin(time * 2.8) * 0.09;
        innerCoreRef.current.scale.set(pulse, pulse, pulse);
      }

      // 6. Dual Celestial Halos slow orbital tilt
      if (haloRing1Ref.current) {
        haloRing1Ref.current.rotation.z = time * 0.14 + p * 0.6;
        haloRing1Ref.current.rotation.x = Math.PI / 3 + Math.sin(time * 0.15) * 0.15;
      }
      if (haloRing2Ref.current) {
        haloRing2Ref.current.rotation.z = -time * 0.18 - p * 0.7;
        haloRing2Ref.current.rotation.y = Math.PI / 4 + Math.cos(time * 0.2) * 0.12;
      }
    } else {
      // Reduced motion: gentle static orientation
      groupRef.current.position.set(1.2 - p * 0.8, -p * 0.4, 0);
    }
  });

  return (
    <Float
      speed={reducedMotion ? 0 : 2.0}
      rotationIntensity={reducedMotion ? 0 : 0.3}
      floatIntensity={reducedMotion ? 0 : 0.6}
      floatingRange={[-0.15, 0.15]}
    >
      <group ref={groupRef} position={[1.35, -0.05, 0]} scale={[1.25, 1.25, 1.25]}>
        
        {/* 1. Primary Haute Couture Mulberry Silk Drape */}
        <mesh ref={primarySilkRef} castShadow receiveShadow>
          <torusKnotGeometry args={[1.38, 0.36, 220, 36, 2, 5]} />
          <meshPhysicalMaterial
            color="#3B0B3F" // Imperial Mulberry Plum
            emissive="#1A0220"
            emissiveIntensity={0.35}
            roughness={0.22}
            metalness={0.62}
            clearcoat={0.95}
            clearcoatRoughness={0.1}
            sheen={1.0}
            sheenRoughness={0.2}
            sheenColor={new THREE.Color('#FFDF9E')} // Golden Silk Sheen on graze angles
            reflectivity={0.9}
          />
        </mesh>

        {/* 2. Outer 24K Gold Zari Border Embroidery Trim */}
        <mesh ref={outerZariRef}>
          <torusKnotGeometry args={[1.40, 0.075, 180, 24, 2, 5]} />
          <meshStandardMaterial
            color="#FFDF79" // Certified 24K Zari Gold
            roughness={0.12}
            metalness={0.96}
            emissive="#B8860B"
            emissiveIntensity={0.3}
          />
        </mesh>

        {/* 3. Inner Concentric Gold Zari Trim */}
        <mesh ref={innerZariRef}>
          <torusKnotGeometry args={[1.36, 0.04, 160, 20, 2, 5]} />
          <meshStandardMaterial
            color="#FFE8A3"
            roughness={0.15}
            metalness={0.92}
            emissive="#996515"
            emissiveIntensity={0.2}
          />
        </mesh>

        {/* 4. Inner Radiant Warp Core (Heart of the Loom) */}
        <mesh ref={innerCoreRef}>
          <octahedronGeometry args={[0.65, 1]} />
          <meshStandardMaterial
            color="#F5DEB3"
            emissive="#D4AF37"
            emissiveIntensity={1.1}
            wireframe
            transparent
            opacity={0.88}
          />
        </mesh>

        {/* 5. Interlocking Celestial Zari Halos */}
        <mesh ref={haloRing1Ref} rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[2.35, 0.015, 16, 120]} />
          <meshStandardMaterial
            color="#DFBF7A"
            metalness={0.92}
            roughness={0.18}
            emissive="#C5A059"
            emissiveIntensity={0.45}
            transparent
            opacity={0.7}
          />
        </mesh>

        <mesh ref={haloRing2Ref} rotation={[-Math.PI / 4, Math.PI / 6, 0]}>
          <torusGeometry args={[2.15, 0.012, 16, 100]} />
          <meshStandardMaterial
            color="#FDE68A"
            metalness={0.95}
            roughness={0.15}
            emissive="#B45309"
            emissiveIntensity={0.3}
            transparent
            opacity={0.5}
          />
        </mesh>
      </group>
    </Float>
  );
};
