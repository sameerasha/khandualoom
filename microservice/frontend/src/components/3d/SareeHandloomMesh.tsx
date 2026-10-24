import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

interface SareeHandloomMeshProps {
  scrollProgress?: number;
  reducedMotion?: boolean;
}

export const SareeHandloomMesh: React.FC<SareeHandloomMeshProps> = ({
  scrollProgress = 0,
  reducedMotion = false,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const shuttleGroupRef = useRef<THREE.Group>(null);
  const sareeDrapeRef = useRef<THREE.Mesh>(null);
  const zariBorderRef = useRef<THREE.Mesh>(null);
  const zariBorderInnerRef = useRef<THREE.Mesh>(null);
  const warpLinesRef = useRef<THREE.LineSegments>(null);

  const targetRotation = useRef({ x: 0, y: 0 });

  // 1. Generate the sweeping Saree Pallu 3D Curve
  const { sareeGeometry, zariGeometry, zariInnerGeometry } = useMemo(() => {
    // S-curve parametric spline representing a lavishly draped saree pallu
    const curvePoints = [
      new THREE.Vector3(-1.8, 1.4, -0.6),
      new THREE.Vector3(-0.9, 0.8, 0.4),
      new THREE.Vector3(0.0, 0.2, 0.7),
      new THREE.Vector3(1.1, -0.3, 0.2),
      new THREE.Vector3(1.8, -0.9, -0.5),
      new THREE.Vector3(2.3, -1.6, 0.3),
    ];
    const curve = new THREE.CatmullRomCurve3(curvePoints);

    // Wide ribbon cross-section for the saree fabric
    const ribbonShape = new THREE.Shape();
    const ribbonWidth = 0.95;
    const ribbonThickness = 0.025;
    ribbonShape.moveTo(-ribbonWidth / 2, -ribbonThickness / 2);
    ribbonShape.lineTo(ribbonWidth / 2, -ribbonThickness / 2);
    ribbonShape.lineTo(ribbonWidth / 2, ribbonThickness / 2);
    ribbonShape.lineTo(-ribbonWidth / 2, ribbonThickness / 2);
    ribbonShape.closePath();

    const extrudeSettings = {
      steps: 120,
      bevelEnabled: true,
      bevelSegments: 3,
      bevelSize: 0.008,
      bevelThickness: 0.008,
      extrudePath: curve,
    };

    const sareeGeo = new THREE.ExtrudeGeometry(ribbonShape, extrudeSettings);

    // Outer pure gold zari border piping
    const zariShape = new THREE.Shape();
    zariShape.absarc(0, 0, 0.045, 0, Math.PI * 2, false);
    const zariGeo = new THREE.ExtrudeGeometry(zariShape, {
      steps: 120,
      bevelEnabled: false,
      extrudePath: curve,
    });

    // Secondary concentric border
    const zariInnerShape = new THREE.Shape();
    zariInnerShape.absarc(0, 0, 0.025, 0, Math.PI * 2, false);
    const zariInnerGeo = new THREE.ExtrudeGeometry(zariInnerShape, {
      steps: 120,
      bevelEnabled: false,
      extrudePath: curve,
    });

    return {
      sareeGeometry: sareeGeo,
      zariGeometry: zariGeo,
      zariInnerGeometry: zariInnerGeo,
    };
  }, []);

  // 2. Generate Loom Warp Grid Threads (Tana Lines)
  const warpGeometry = useMemo(() => {
    const points: number[] = [];
    const count = 28;
    const width = 3.6;
    for (let i = 0; i < count; i++) {
      const x = -width / 2 + (width / (count - 1)) * i;
      // Thread starting point (top beam)
      points.push(x, 2.2, -0.8 + (i % 2 === 0 ? 0.15 : -0.15));
      // Thread ending point (bottom cloth beam)
      points.push(x * 0.95, -2.2, 0.5 + (i % 2 === 0 ? -0.15 : 0.15));
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    return geo;
  }, []);

  // Frame animation: interactive cursor tracking and scroll choreography
  useFrame((state) => {
    if (!groupRef.current) return;

    const time = state.clock.getElapsedTime();
    const p = scrollProgress; // 0 to 1.5+

    if (!reducedMotion) {
      // Mouse interactive parallax lerp
      const mouseX = state.pointer.x * 0.45;
      const mouseY = state.pointer.y * 0.35;
      targetRotation.current.x = THREE.MathUtils.lerp(targetRotation.current.x, mouseY, 0.06);
      targetRotation.current.y = THREE.MathUtils.lerp(targetRotation.current.y, mouseX, 0.06);

      // 1. Dynamic group placement responding to scroll
      const targetGroupX = 1.35 - p * 1.5 + targetRotation.current.y * 0.6;
      const targetGroupY = 0.05 - p * 0.85 - targetRotation.current.x * 0.5;
      const targetGroupZ = -p * 0.35;

      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetGroupX, 0.08);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetGroupY, 0.08);
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetGroupZ, 0.08);

      // 2. Saree Drape Rotation: undulating flow + scroll rotation shift
      if (sareeDrapeRef.current) {
        sareeDrapeRef.current.rotation.y = Math.sin(time * 0.25) * 0.15 + p * Math.PI * 1.4 + targetRotation.current.y;
        sareeDrapeRef.current.rotation.x = Math.cos(time * 0.2) * 0.12 + p * 0.75 + targetRotation.current.x;
        sareeDrapeRef.current.rotation.z = Math.sin(time * 0.18) * 0.08 - p * 0.5;
      }
      if (zariBorderRef.current && sareeDrapeRef.current) {
        zariBorderRef.current.rotation.copy(sareeDrapeRef.current.rotation);
      }
      if (zariBorderInnerRef.current && sareeDrapeRef.current) {
        zariBorderInnerRef.current.rotation.copy(sareeDrapeRef.current.rotation);
      }

      // 3. Handloom Shuttle (Dhoki) gliding motion through warp shed
      if (shuttleGroupRef.current) {
        // Glides back and forth horizontally like an authentic weaver's shuttle
        shuttleGroupRef.current.position.x = Math.sin(time * 1.6) * 1.4 + 0.2;
        shuttleGroupRef.current.position.y = Math.cos(time * 1.6) * 0.18 - p * 0.4;
        shuttleGroupRef.current.position.z = 0.4 + Math.sin(time * 3.2) * 0.1;
        shuttleGroupRef.current.rotation.z = Math.cos(time * 1.6) * 0.25;
        shuttleGroupRef.current.rotation.y = time * 0.4 + p * 0.8;
      }

      // 4. Warp threads subtle shimmering vibration
      if (warpLinesRef.current) {
        warpLinesRef.current.rotation.y = Math.sin(time * 0.15) * 0.04;
      }
    } else {
      groupRef.current.position.set(1.2 - p * 0.7, -p * 0.4, 0);
    }
  });

  return (
    <Float
      speed={reducedMotion ? 0 : 1.8}
      rotationIntensity={reducedMotion ? 0 : 0.25}
      floatIntensity={reducedMotion ? 0 : 0.45}
      floatingRange={[-0.12, 0.12]}
    >
      <group ref={groupRef} position={[1.35, 0.05, 0]} scale={[1.25, 1.25, 1.25]}>
        
        {/* ==================================================== */}
        {/* 1. THE FLOWING SAREE PALLU & PLEAT DRAPE             */}
        {/* ==================================================== */}
        <mesh ref={sareeDrapeRef} geometry={sareeGeometry} castShadow receiveShadow>
          <meshPhysicalMaterial
            color="#3B0B3F" // Imperial Mulberry Plum Silk
            emissive="#1A0220"
            emissiveIntensity={0.32}
            roughness={0.22}
            metalness={0.58}
            clearcoat={0.95}
            clearcoatRoughness={0.12}
            sheen={1.0}
            sheenRoughness={0.22}
            sheenColor={new THREE.Color('#FFDF9E')} // Golden zari luster on silk graze angles
            reflectivity={0.88}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* 2. OUTER PURE 24K GOLD ZARI BORDER PIPING */}
        <mesh
          ref={zariBorderRef}
          geometry={zariGeometry}
          position={[0, 0, 0.04]}
        >
          <meshStandardMaterial
            color="#FFDF79" // 24K Zari Gold
            roughness={0.12}
            metalness={0.95}
            emissive="#B8860B"
            emissiveIntensity={0.35}
          />
        </mesh>

        {/* 3. INNER CONCENTRIC GOLD ZARI ACCENT */}
        <mesh
          ref={zariBorderInnerRef}
          geometry={zariInnerGeometry}
          position={[0, 0, -0.04]}
        >
          <meshStandardMaterial
            color="#FFE699"
            roughness={0.15}
            metalness={0.92}
            emissive="#996515"
            emissiveIntensity={0.25}
          />
        </mesh>

        {/* ==================================================== */}
        {/* 4. THE TRADITIONAL HANDLOOM FLYING SHUTTLE (DHOKI)   */}
        {/* ==================================================== */}
        <group ref={shuttleGroupRef} position={[0.2, 0, 0.4]} scale={[0.85, 0.85, 0.85]}>
          
          {/* Shuttle Body: Carved Teakwood / Rosewood Hull */}
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.09, 0.09, 1.3, 16]} />
            <meshStandardMaterial
              color="#3E1A0C" // Aged Rosewood Handloom Shuttle
              roughness={0.38}
              metalness={0.12}
            />
          </mesh>

          {/* Brass Front Tip (Pointed nose to separate warp threads) */}
          <mesh position={[0, 0.72, 0]}>
            <coneGeometry args={[0.095, 0.22, 16]} />
            <meshStandardMaterial
              color="#D4AF37" // Polished Loom Brass
              metalness={0.94}
              roughness={0.15}
              emissive="#996515"
              emissiveIntensity={0.2}
            />
          </mesh>

          {/* Brass Rear Tip */}
          <mesh position={[0, -0.72, 0]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.095, 0.22, 16]} />
            <meshStandardMaterial
              color="#D4AF37"
              metalness={0.94}
              roughness={0.15}
              emissive="#996515"
              emissiveIntensity={0.2}
            />
          </mesh>

          {/* Inner Hollow Cavity with Pure Gold Silk Bobbin (Pirn) */}
          <mesh position={[0, 0, 0.02]}>
            <boxGeometry args={[0.07, 0.55, 0.06]} />
            <meshStandardMaterial
              color="#220D05"
              roughness={0.6}
            />
          </mesh>

          {/* Wound Gold Silk Yarn on the Pirn Spool */}
          <mesh position={[0, 0, 0.03]}>
            <cylinderGeometry args={[0.045, 0.045, 0.48, 16]} />
            <meshStandardMaterial
              color="#FDE68A" // Raw Golden Zari Filament
              emissive="#EAB308"
              emissiveIntensity={0.4}
              roughness={0.3}
              metalness={0.7}
            />
          </mesh>

          {/* Trailing Silk Filament Thread */}
          <mesh position={[0.08, 0, 0.05]} rotation={[0, 0, Math.PI / 4]}>
            <cylinderGeometry args={[0.005, 0.005, 0.6, 8]} />
            <meshBasicMaterial color="#FFDF79" />
          </mesh>
        </group>

        {/* ==================================================== */}
        {/* 5. THE LOOM WARP GRID (TANA-BANA THREADS)            */}
        {/* ==================================================== */}
        <lineSegments ref={warpLinesRef} geometry={warpGeometry}>
          <lineBasicMaterial
            color="#C5A059"
            transparent
            opacity={0.35}
            blending={THREE.AdditiveBlending}
          />
        </lineSegments>

        {/* Orbiting Celestial Golden Weave Ring */}
        <mesh rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[2.5, 0.012, 16, 120]} />
          <meshStandardMaterial
            color="#DFBF7A"
            metalness={0.92}
            roughness={0.18}
            emissive="#C5A059"
            emissiveIntensity={0.4}
            transparent
            opacity={0.65}
          />
        </mesh>
      </group>
    </Float>
  );
};
