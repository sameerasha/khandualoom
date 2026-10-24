import React, { useRef, useState, useEffect, Suspense, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// 3D Master Loom Shuttle & Golden Zari Spindle
const MasterLoomShuttleMesh: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const yarnRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Orbiting Sparkle Motes around the Spindle
  const sparkleCount = 28;
  const sparklePositions = useMemo(() => {
    const pos = new Float32Array(sparkleCount * 3);
    for (let i = 0; i < sparkleCount; i++) {
      const angle = (i / sparkleCount) * Math.PI * 2;
      const r = 0.9 + Math.random() * 0.4;
      pos[i * 3] = Math.cos(angle) * r;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 1.6;
      pos[i * 3 + 2] = Math.sin(angle) * r;
    }
    return pos;
  }, [sparkleCount]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;
    const targetSpeed = hovered ? 1.6 : 0.65;

    // Smooth continuous axial tumble
    groupRef.current.rotation.y += delta * targetSpeed;
    groupRef.current.rotation.x = Math.sin(time * 0.8) * 0.25;
    groupRef.current.rotation.z = Math.cos(time * 0.6) * 0.15;

    // Fast rotation of yarn core inside the shuttle
    if (yarnRef.current) {
      yarnRef.current.rotation.y += delta * 2.5;
    }
  });

  return (
    <group
      ref={groupRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.12 : 1.0}
    >
      {/* 1. Central Golden Zari Yarn Bobbin */}
      <mesh ref={yarnRef} position={[0, 0, 0]}>
        <cylinderGeometry args={[0.32, 0.32, 1.25, 32]} />
        <meshStandardMaterial
          color="#DFBF7A"
          roughness={0.28}
          metalness={0.88}
          emissive="#7A5814"
          emissiveIntensity={0.35}
        />
      </mesh>

      {/* 2. Concentric Zari Rings wound around yarn */}
      {[-0.4, -0.2, 0, 0.2, 0.4].map((offsetY, idx) => (
        <mesh key={idx} position={[0, offsetY, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.33, 0.04, 16, 32]} />
          <meshStandardMaterial
            color="#FFEA9F"
            metalness={0.95}
            roughness={0.12}
            emissive="#A37E28"
            emissiveIntensity={0.4}
          />
        </mesh>
      ))}

      {/* 3. Aerodynamic Handloom Shuttle Outer Cradle (Upper Tip) */}
      <mesh position={[0, 0.95, 0]}>
        <coneGeometry args={[0.42, 0.8, 32]} />
        <meshStandardMaterial
          color="#C5A059"
          roughness={0.2}
          metalness={0.92}
        />
      </mesh>

      {/* 4. Aerodynamic Handloom Shuttle Outer Cradle (Lower Tip) */}
      <mesh position={[0, -0.95, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.42, 0.8, 32]} />
        <meshStandardMaterial
          color="#C5A059"
          roughness={0.2}
          metalness={0.92}
        />
      </mesh>

      {/* 5. Outer Slender Protective Arcs */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[1.05, 0.045, 16, 48, Math.PI * 1.2]} />
        <meshStandardMaterial
          color="#E8A87C"
          metalness={0.95}
          roughness={0.15}
        />
      </mesh>
      <mesh rotation={[0, Math.PI / 2, Math.PI / 2]}>
        <torusGeometry args={[1.05, 0.045, 16, 48, Math.PI * 1.2]} />
        <meshStandardMaterial
          color="#E8A87C"
          metalness={0.95}
          roughness={0.15}
        />
      </mesh>

      {/* 6. Orbiting Sparkle Dust Particles */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[sparklePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.065}
          color="#FFF2A3"
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
};

export const AtelierSeal3D: React.FC<{ size?: number; className?: string }> = ({
  size = 130,
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
        className={`flex flex-col items-center justify-center rounded-3xl bg-gradient-to-tr from-brand-gold/20 via-brand-purple to-brand-gold/10 border border-brand-gold/40 shadow-xl ${className}`}
      >
        <span className="font-serif text-brand-gold text-2xl font-bold animate-pulse">VL</span>
        <span className="text-[9px] font-mono tracking-widest text-brand-gold/80 mt-1 uppercase">Shuttle</span>
      </div>
    );
  }

  return (
    <div
      style={{ width: size, height: size }}
      className={`relative rounded-3xl overflow-hidden border border-brand-gold/40 bg-gradient-to-b from-[#1E0D36]/90 to-[#0A0414]/95 shadow-[0_0_35px_rgba(223,191,122,0.22)] backdrop-blur-xl cursor-pointer group transition-all duration-300 hover:border-brand-gold ${className}`}
      title="Master Loom Gold Spindle & Zari Shuttle • Interactive 3D"
    >
      {/* Subtle Top Specular Shine */}
      <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

      <Canvas
        camera={{ position: [0, 0, 3.4], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={1.1} color="#FFF8E7" />
        <directionalLight position={[4, 5, 4]} intensity={3.0} color="#FFDF85" />
        <pointLight position={[-4, -3, -2]} intensity={2.5} color="#C45B8A" />
        <pointLight position={[0, -2, 3]} intensity={2.0} color="#DFBF7A" />
        <Suspense fallback={null}>
          <MasterLoomShuttleMesh />
        </Suspense>
      </Canvas>

      <div className="absolute bottom-1.5 inset-x-0 text-center pointer-events-none">
        <span className="text-[8px] font-mono tracking-widest uppercase text-brand-gold/80 group-hover:text-brand-gold transition-colors">
          Gold Loom Shuttle
        </span>
      </div>
    </div>
  );
};
