import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// 1. Procedural Flowing Golden Silk Ribbon Mesh
const GoldenSilkRibbon: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  // Generate parametric undulating ribbon geometry
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(16, 8, 48, 24);
    return geo;
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime * 0.45;
    const pos = geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const u = pos.getX(i);
      const v = pos.getY(i);
      // Gentle compound harmonic waves simulating draped royal silk
      const waveZ =
        Math.sin(u * 0.45 + time) * 0.75 +
        Math.cos(v * 0.6 + time * 0.8) * 0.45 +
        Math.sin((u + v) * 0.35 + time * 0.5) * 0.3;
      pos.setZ(i, waveZ);
    }
    pos.needsUpdate = true;
    geometry.computeVertexNormals();

    // Subtle gentle float & rotation
    meshRef.current.rotation.z = Math.sin(time * 0.2) * 0.08;
    meshRef.current.position.y = Math.cos(time * 0.3) * 0.2 - 0.5;
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      position={[2, 0, -3]}
      rotation={[-0.35, 0.25, 0.1]}
    >
      <meshStandardMaterial
        color="#2D124D"
        emissive="#1A0730"
        emissiveIntensity={0.6}
        roughness={0.45}
        metalness={0.65}
        side={THREE.DoubleSide}
        wireframe={false}
      />
    </mesh>
  );
};

// 2. Swirling Golden Zari Motes
const GoldenZariDust: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 450;

  const [positions, phases, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const ph = new Float32Array(count);
    const sp = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const radius = 2.5 + Math.random() * 8.0;
      pos[i * 3] = Math.cos(theta) * radius;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8.0;
      pos[i * 3 + 2] = Math.sin(theta) * radius - 2.0;

      ph[i] = Math.random() * Math.PI * 2;
      sp[i] = 0.1 + Math.random() * 0.25;
    }
    return [pos, ph, sp];
  }, [count]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const time = state.clock.elapsedTime;
    const posAttr = pointsRef.current.geometry.attributes.position;
    const posArr = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      // Gentle orbital drift
      const idx = i * 3;
      posArr[idx + 1] += Math.sin(time * speeds[i] + phases[i]) * delta * 0.35;
      posArr[idx] += Math.cos(time * speeds[i] * 0.5 + phases[i]) * delta * 0.25;
    }
    posAttr.needsUpdate = true;
    pointsRef.current.rotation.y += delta * 0.035;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.065}
        color="#DFBF7A"
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

export const AdminBackground3D: React.FC = () => {
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

  if (!hasWebGL) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-35 transition-opacity duration-1000">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}
      >
        <ambientLight intensity={0.8} color="#FFF8E7" />
        <directionalLight position={[6, 8, 4]} intensity={2.5} color="#DFBF7A" />
        <pointLight position={[-6, -4, -2]} intensity={2.0} color="#7C3AED" />
        <pointLight position={[3, -2, 2]} intensity={1.5} color="#C5A059" />

        <GoldenSilkRibbon />
        <GoldenZariDust />
      </Canvas>

      {/* Edge Softening Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D17] via-transparent to-[#0B0D17]/80 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#131628] via-transparent to-[#0B0D17] pointer-events-none" />
    </div>
  );
};
