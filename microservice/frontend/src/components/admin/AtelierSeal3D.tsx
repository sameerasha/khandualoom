import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const GoldKnotMesh: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const speed = hovered ? 0.8 : 0.4;
    meshRef.current.rotation.y += delta * speed;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    meshRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.3) * 0.1;
  });

  return (
    <mesh
      ref={meshRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.08 : 1.0}
    >
      <torusKnotGeometry args={[0.85, 0.24, 120, 24, 2, 3]} />
      <meshStandardMaterial
        color="#DFBF7A"
        roughness={0.18}
        metalness={0.92}
        emissive="#523910"
        emissiveIntensity={0.2}
      />
    </mesh>
  );
};

export const AtelierSeal3D: React.FC<{ size?: number; className?: string }> = ({
  size = 110,
  className = '',
}) => {
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
      <div
        style={{ width: size, height: size }}
        className={`flex items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-gold/20 via-brand-purple to-brand-gold/10 border border-brand-gold/40 shadow-lg ${className}`}
      >
        <span className="font-serif text-brand-gold text-2xl font-bold animate-pulse">VL</span>
      </div>
    );
  }

  return (
    <div
      style={{ width: size, height: size }}
      className={`relative rounded-2xl overflow-hidden border border-brand-gold/30 bg-[#0F071A]/80 shadow-[0_0_25px_rgba(223,191,122,0.15)] backdrop-blur-md cursor-pointer group ${className}`}
      title="Vastra Loom Atelier Imperial Emblem • Interactive 3D"
    >
      <Canvas
        camera={{ position: [0, 0, 3.2], fov: 42 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={1.2} color="#FFF5E0" />
        <directionalLight position={[4, 5, 4]} intensity={2.8} color="#FFDF85" />
        <pointLight position={[-4, -3, -2]} intensity={2.2} color="#C45B8A" />
        <pointLight position={[0, -2, 3]} intensity={1.8} color="#E8A87C" />
        <Suspense fallback={null}>
          <GoldKnotMesh />
        </Suspense>
      </Canvas>
      <div className="absolute bottom-1 inset-x-0 text-center pointer-events-none">
        <span className="text-[8px] font-mono tracking-widest uppercase text-brand-gold/70 group-hover:text-brand-gold transition-colors">
          Imperial Seal
        </span>
      </div>
    </div>
  );
};
