import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

const SilkMesh: React.FC<{ color?: string }> = ({ color = '#8A1538' }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const prefersReduced = usePrefersReducedMotion();

  useFrame((state) => {
    if (!meshRef.current || prefersReduced) return;
    const time = state.clock.getElapsedTime();
    const geom = meshRef.current.geometry as THREE.PlaneGeometry;
    const pos = geom.attributes.position;

    for (let i = 0; i < pos.count; i++) {
      const u = pos.getX(i);
      const v = pos.getY(i);
      const z = Math.sin(u * 1.5 + time * 1.2) * 0.18 + Math.cos(v * 1.8 + time * 0.9) * 0.12;
      pos.setZ(i, z);
    }
    geom.computeVertexNormals();
    pos.needsUpdate = true;
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 4, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[3.2, 3.2, 32, 32]} />
      <meshPhysicalMaterial
        color={color}
        roughness={0.25}
        metalness={0.15}
        clearcoat={0.6}
        clearcoatRoughness={0.1}
        sheen={1.0}
        sheenColor={new THREE.Color('#D4AF37')}
        sheenRoughness={0.3}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

export const SilkSheenCanvas: React.FC<{ color?: string }> = ({ color = '#8A1538' }) => {
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setHasWebGL(false);
    } catch {
      setHasWebGL(false);
    }
  }, []);

  if (!hasWebGL) {
    return (
      <div className="w-full h-full min-h-[300px] rounded-xl bg-gradient-to-br from-[#8A1538] via-[#5C0A28] to-[#12051E] flex items-center justify-center border border-brand-gold/30">
        <p className="text-brand-gold text-xs font-serif uppercase tracking-widest text-center px-4">
          Pure Handloom Silk Drape & Anisotropic Sheen
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[360px] rounded-xl overflow-hidden bg-gradient-to-b from-[#180829] to-[#0D0418] border border-brand-gold/25 relative shadow-2xl">
      <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded bg-black/60 backdrop-blur-md border border-brand-gold/30 text-[10px] uppercase font-bold text-brand-gold tracking-widest">
        3D SILK TEXTURE & ANISOTROPIC SHEEN
      </div>

      <Canvas
        camera={{ position: [0, 0, 3.2], fov: 45 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 5, 4]} intensity={1.5} color="#FFF8E7" />
        <pointLight position={[-3, -2, 2]} intensity={1.2} color="#D4AF37" />
        <SilkMesh color={color} />
      </Canvas>
    </div>
  );
};
