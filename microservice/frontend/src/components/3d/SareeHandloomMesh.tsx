import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

interface SareeHandloomMeshProps {
  scrollProgress?: number; // 0.0 (top) to 1.0 (bottom)
  reducedMotion?: boolean;
}

export const SareeHandloomMesh: React.FC<SareeHandloomMeshProps> = ({
  scrollProgress = 0,
  reducedMotion = false,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const primaryDrapeRef = useRef<THREE.Mesh>(null);
  const secondaryPleatRef = useRef<THREE.Mesh>(null);
  const zariBorderOuterRef = useRef<THREE.Mesh>(null);
  const zariBorderInnerRef = useRef<THREE.Mesh>(null);
  const shuttleGroupRef = useRef<THREE.Group>(null);
  const trailingYarnRef = useRef<THREE.LineSegments>(null);
  const warpLinesRef = useRef<THREE.LineSegments>(null);
  const lotusBootisGroupRef = useRef<THREE.Group>(null);
  const horizonWaveRef = useRef<THREE.Mesh>(null);
  const loomFrameRef = useRef<THREE.Group>(null);

  const targetRotation = useRef({ x: 0, y: 0 });

  // =========================================================================
  // 1. PRIMARY FLOWING SAREE PALLU (PARAMETRIC S-CURVE)
  // =========================================================================
  const { primarySareeGeo, zariOuterGeo, zariInnerGeo } = useMemo(() => {
    // S-curve spline modeling a royal draped saree pallu
    const curvePoints = [
      new THREE.Vector3(-2.2, 1.8, -0.7),
      new THREE.Vector3(-1.1, 1.0, 0.4),
      new THREE.Vector3(0.0, 0.25, 0.8),
      new THREE.Vector3(1.2, -0.35, 0.25),
      new THREE.Vector3(2.1, -1.1, -0.5),
      new THREE.Vector3(2.6, -1.9, 0.4),
    ];
    const curve = new THREE.CatmullRomCurve3(curvePoints);

    // Wide ribbon cross-section for silk fabric
    const ribbonShape = new THREE.Shape();
    const ribbonWidth = 1.05;
    const ribbonThickness = 0.022;
    ribbonShape.moveTo(-ribbonWidth / 2, -ribbonThickness / 2);
    ribbonShape.lineTo(ribbonWidth / 2, -ribbonThickness / 2);
    ribbonShape.lineTo(ribbonWidth / 2, ribbonThickness / 2);
    ribbonShape.lineTo(-ribbonWidth / 2, ribbonThickness / 2);
    ribbonShape.closePath();

    const sareeGeo = new THREE.ExtrudeGeometry(ribbonShape, {
      steps: 150,
      bevelEnabled: true,
      bevelSegments: 3,
      bevelSize: 0.008,
      bevelThickness: 0.008,
      extrudePath: curve,
    });

    // Outer 24K Gold Zari Border Piping
    const outerPiping = new THREE.Shape();
    outerPiping.absarc(0, 0, 0.048, 0, Math.PI * 2, false);
    const outerGeo = new THREE.ExtrudeGeometry(outerPiping, {
      steps: 150,
      bevelEnabled: false,
      extrudePath: curve,
    });

    // Inner Concentric Gold Zari Piping
    const innerPiping = new THREE.Shape();
    innerPiping.absarc(0, 0, 0.026, 0, Math.PI * 2, false);
    const innerGeo = new THREE.ExtrudeGeometry(innerPiping, {
      steps: 150,
      bevelEnabled: false,
      extrudePath: curve,
    });

    return {
      primarySareeGeo: sareeGeo,
      zariOuterGeo: outerGeo,
      zariInnerGeo: innerGeo,
    };
  }, []);

  // =========================================================================
  // 2. SECONDARY CASCADING PLEAT RIBBON (PATLI DRAPE)
  // =========================================================================
  const secondaryPleatGeo = useMemo(() => {
    const pleatPoints = [
      new THREE.Vector3(-1.6, 1.2, 0.2),
      new THREE.Vector3(-0.6, 0.4, -0.4),
      new THREE.Vector3(0.5, -0.2, 0.3),
      new THREE.Vector3(1.4, -1.0, 0.7),
      new THREE.Vector3(2.0, -1.8, -0.2),
    ];
    const pleatCurve = new THREE.CatmullRomCurve3(pleatPoints);

    const pleatShape = new THREE.Shape();
    const w = 0.7;
    const t = 0.018;
    pleatShape.moveTo(-w / 2, -t / 2);
    pleatShape.lineTo(w / 2, -t / 2);
    pleatShape.lineTo(w / 2, t / 2);
    pleatShape.lineTo(-w / 2, t / 2);
    pleatShape.closePath();

    return new THREE.ExtrudeGeometry(pleatShape, {
      steps: 120,
      bevelEnabled: true,
      bevelSegments: 2,
      bevelSize: 0.005,
      bevelThickness: 0.005,
      extrudePath: pleatCurve,
    });
  }, []);

  // =========================================================================
  // 3. 3D GOLDEN LOTUS ZARI BOOTI MOTIF GEOMETRY
  // =========================================================================
  const lotusBootiGeo = useMemo(() => {
    // 8-lobed lotus rosette medallion
    const bootiShape = new THREE.Shape();
    const petals = 8;
    const innerRadius = 0.12;
    const outerRadius = 0.24;

    for (let i = 0; i < petals * 2; i++) {
      const angle = (i * Math.PI) / petals;
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) {
        bootiShape.moveTo(x, y);
      } else {
        bootiShape.lineTo(x, y);
      }
    }
    bootiShape.closePath();

    return new THREE.ExtrudeGeometry(bootiShape, {
      depth: 0.035,
      bevelEnabled: true,
      bevelSegments: 2,
      bevelSize: 0.01,
      bevelThickness: 0.01,
    });
  }, []);

  // =========================================================================
  // 4. LOOM WARP GRID FILAMENTS (TANA-BANA)
  // =========================================================================
  const warpGeometry = useMemo(() => {
    const points: number[] = [];
    const count = 36;
    const width = 4.6;
    for (let i = 0; i < count; i++) {
      const x = -width / 2 + (width / (count - 1)) * i;
      points.push(x, 2.8, -0.9 + (i % 2 === 0 ? 0.2 : -0.2));
      points.push(x * 0.94, -2.8, 0.65 + (i % 2 === 0 ? -0.2 : 0.2));
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    return geo;
  }, []);

  // =========================================================================
  // 5. SECONDARY SILK HORIZON WAVE (FOR COMPONENT 4 - CATALOG)
  // =========================================================================
  const horizonWaveGeometry = useMemo(() => {
    const wavePoints = [
      new THREE.Vector3(-5.0, -2.8, -1.2),
      new THREE.Vector3(-2.4, -2.2, -0.3),
      new THREE.Vector3(0.0, -2.5, 0.3),
      new THREE.Vector3(2.6, -2.0, -0.4),
      new THREE.Vector3(5.0, -2.7, -1.1),
    ];
    const waveCurve = new THREE.CatmullRomCurve3(wavePoints);

    const waveShape = new THREE.Shape();
    const w = 1.5;
    const t = 0.02;
    waveShape.moveTo(-w / 2, -t / 2);
    waveShape.lineTo(w / 2, -t / 2);
    waveShape.lineTo(w / 2, t / 2);
    waveShape.lineTo(-w / 2, t / 2);
    waveShape.closePath();

    return new THREE.ExtrudeGeometry(waveShape, {
      steps: 100,
      bevelEnabled: true,
      bevelSegments: 2,
      bevelSize: 0.006,
      bevelThickness: 0.006,
      extrudePath: waveCurve,
    });
  }, []);

  // =========================================================================
  // 6. TRAILING GOLD WEFT YARN LINE
  // =========================================================================
  const trailingYarnGeometry = useMemo(() => {
    const pts = [
      new THREE.Vector3(-2.0, 0, 0),
      new THREE.Vector3(-1.0, 0.12, 0.1),
      new THREE.Vector3(0, 0, 0.22),
      new THREE.Vector3(1.0, -0.12, 0.32),
      new THREE.Vector3(2.0, 0, 0.42),
    ];
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    return geo;
  }, []);

  // Dynamic frame loop animation
  useFrame((state) => {
    if (!groupRef.current) return;

    const time = state.clock.getElapsedTime();
    const p = Math.min(Math.max(scrollProgress, 0), 1.0);

    if (!reducedMotion) {
      // Interactive mouse parallax tracking
      const mouseX = state.pointer.x * 0.45;
      const mouseY = state.pointer.y * 0.35;
      targetRotation.current.x = THREE.MathUtils.lerp(targetRotation.current.x, mouseY, 0.06);
      targetRotation.current.y = THREE.MathUtils.lerp(targetRotation.current.y, mouseX, 0.06);

      // Multi-Component Stage Group Positioning
      let targetX = 1.35;
      let targetY = 0.05;
      let targetZ = 0.0;
      let groupScale = 1.25;

      if (p <= 0.22) {
        // Hero Section: Frontal right prominence
        const t = p / 0.22;
        targetX = 1.35 - t * 0.45 + targetRotation.current.y * 0.5;
        targetY = 0.05 - t * 0.4 - targetRotation.current.x * 0.4;
        targetZ = -t * 0.3;
        groupScale = 1.25;
      } else if (p <= 0.42) {
        // Heritage Features (2nd Component): Center pan & unfurling silk
        const t = (p - 0.22) / 0.2;
        targetX = 0.9 - t * 0.9 + targetRotation.current.y * 0.4;
        targetY = -0.35 - t * 0.5 - targetRotation.current.x * 0.3;
        targetZ = -0.3 - t * 0.4;
        groupScale = 1.25 + t * 0.15;
      } else if (p <= 0.62) {
        // Craft Showcase (3rd Component): Shuttle & warp grid macro
        const t = (p - 0.42) / 0.2;
        targetX = 0.0 + t * 0.95 + targetRotation.current.y * 0.5;
        targetY = -0.85 + t * 0.2 - targetRotation.current.x * 0.4;
        targetZ = -0.7 + t * 0.3;
        groupScale = 1.4 - t * 0.1;
      } else if (p <= 0.82) {
        // Product Catalog (4th Component): Deep background horizon wave
        const t = (p - 0.62) / 0.2;
        targetX = 0.95 - t * 0.95 + targetRotation.current.y * 0.3;
        targetY = -0.65 - t * 0.6 - targetRotation.current.x * 0.2;
        targetZ = -0.4 - t * 0.8;
        groupScale = 1.3 - t * 0.15;
      } else {
        // About & Testimonials (5th Component): Pit-loom sanctuary
        const t = (p - 0.82) / 0.18;
        targetX = 0.0 + t * 0.5 + targetRotation.current.y * 0.4;
        targetY = -1.25 + t * 0.4 - targetRotation.current.x * 0.3;
        targetZ = -1.2 + t * 0.5;
        groupScale = 1.15 + t * 0.1;
      }

      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.08);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.08);
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, 0.08);
      groupRef.current.scale.setScalar(
        THREE.MathUtils.lerp(groupRef.current.scale.x, groupScale, 0.08)
      );

      // Primary Saree Fabric Flow & Liquid Ripple Rotation
      if (primaryDrapeRef.current) {
        primaryDrapeRef.current.rotation.y =
          Math.sin(time * 0.28) * 0.18 + p * Math.PI * 1.8 + targetRotation.current.y;
        primaryDrapeRef.current.rotation.x =
          Math.cos(time * 0.22) * 0.14 + p * 0.95 + targetRotation.current.x;
        primaryDrapeRef.current.rotation.z =
          Math.sin(time * 0.18) * 0.08 - p * 0.6;
      }

      // Synchronize Zari Borders with primary drape
      if (zariBorderOuterRef.current && primaryDrapeRef.current) {
        zariBorderOuterRef.current.rotation.copy(primaryDrapeRef.current.rotation);
      }
      if (zariBorderInnerRef.current && primaryDrapeRef.current) {
        zariBorderInnerRef.current.rotation.copy(primaryDrapeRef.current.rotation);
      }

      // Secondary Cascading Pleat Ribbon in Counter-Motion
      if (secondaryPleatRef.current) {
        secondaryPleatRef.current.rotation.y =
          -Math.sin(time * 0.22) * 0.14 - p * Math.PI * 1.2;
        secondaryPleatRef.current.rotation.x =
          Math.sin(time * 0.28) * 0.12 - p * 0.7;
        secondaryPleatRef.current.rotation.z =
          Math.cos(time * 0.2) * 0.1 + p * 0.4;
      }

      // 4 Floating Lotus Zari Bootis Orbit
      if (lotusBootisGroupRef.current) {
        const bootisVisibility =
          p >= 0.15 && p <= 0.6
            ? Math.sin(((p - 0.15) / (0.6 - 0.15)) * Math.PI)
            : 0.2;
        lotusBootisGroupRef.current.scale.setScalar(
          THREE.MathUtils.lerp(lotusBootisGroupRef.current.scale.x, bootisVisibility * 1.2, 0.08)
        );
        lotusBootisGroupRef.current.rotation.y = time * 0.45 + p * 1.5;
        lotusBootisGroupRef.current.rotation.x = Math.sin(time * 0.3) * 0.2 + p * 0.5;
      }

      // Handloom Flying Shuttle (Dhoki) Weaving Motion
      if (shuttleGroupRef.current) {
        const inCraftSection = p >= 0.35 && p <= 0.65;
        const speed = inCraftSection ? 3.8 : 1.9;
        const amplitude = inCraftSection ? 1.85 : 1.35;

        shuttleGroupRef.current.position.x =
          Math.sin(time * speed) * amplitude + (inCraftSection ? 0.3 : 0.15);
        shuttleGroupRef.current.position.y =
          Math.cos(time * speed) * 0.22 - p * 0.5;
        shuttleGroupRef.current.position.z =
          0.45 + Math.sin(time * speed * 2) * 0.12;
        shuttleGroupRef.current.rotation.z =
          Math.cos(time * speed) * 0.35;
        shuttleGroupRef.current.rotation.y = time * 0.5 + p * 1.2;
      }

      // Trailing Weft Yarn tracking shuttle
      if (trailingYarnRef.current && shuttleGroupRef.current) {
        trailingYarnRef.current.position.copy(shuttleGroupRef.current.position);
        trailingYarnRef.current.rotation.z = shuttleGroupRef.current.rotation.z;
        trailingYarnRef.current.scale.set(
          Math.abs(Math.sin(time * 2.2)) * 1.3 + 0.4,
          1,
          1
        );
      }

      // Ambient Silk Horizon Wave (Component 4)
      if (horizonWaveRef.current) {
        const waveVisibility = p >= 0.5 ? Math.min((p - 0.5) / 0.2, 1.0) : 0;
        horizonWaveRef.current.scale.setScalar(
          THREE.MathUtils.lerp(horizonWaveRef.current.scale.x, waveVisibility * 1.15, 0.08)
        );
        horizonWaveRef.current.rotation.y = Math.sin(time * 0.22) * 0.15 + (p - 0.5) * 0.6;
        horizonWaveRef.current.position.y = -2.4 + Math.sin(time * 0.35) * 0.15;
      }

      // Ancestral Pit Loom Framework (Component 5)
      if (loomFrameRef.current) {
        const frameVisibility = p >= 0.75 ? Math.min((p - 0.75) / 0.15, 1.0) : 0;
        loomFrameRef.current.scale.setScalar(
          THREE.MathUtils.lerp(loomFrameRef.current.scale.x, frameVisibility, 0.08)
        );
        loomFrameRef.current.rotation.y = (p - 0.75) * 0.4;
      }

      // Warp Threads Shimmering Luminescence
      if (warpLinesRef.current) {
        warpLinesRef.current.rotation.y = Math.sin(time * 0.15) * 0.05;
        const lineMat = warpLinesRef.current.material as THREE.LineBasicMaterial;
        if (lineMat) {
          lineMat.opacity = 0.28 + Math.abs(Math.sin(time * 1.6)) * 0.25;
        }
      }
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
        
        {/* ================================================================= */}
        {/* 1. PRIMARY ROYAL MULBERRY PLUM SILK PALLU DRAPE                   */}
        {/* ================================================================= */}
        <mesh ref={primaryDrapeRef} geometry={primarySareeGeo} castShadow receiveShadow>
          <meshPhysicalMaterial
            color="#3B083F" // Imperial Mulberry Wine / Plum Silk
            emissive="#1A0322"
            emissiveIntensity={0.35}
            roughness={0.18}
            metalness={0.62}
            clearcoat={0.98}
            clearcoatRoughness={0.08}
            sheen={1.0}
            sheenRoughness={0.18}
            sheenColor={new THREE.Color('#FFDF9E')} // Golden zari luster on silk graze angles
            reflectivity={0.92}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* 2. OUTER PURE 24K GOLD ZARI BORDER PIPING */}
        <mesh ref={zariBorderOuterRef} geometry={zariOuterGeo} position={[0, 0, 0.045]}>
          <meshStandardMaterial
            color="#FFDF79" // 24K Zari Gold
            roughness={0.12}
            metalness={0.96}
            emissive="#B8860B"
            emissiveIntensity={0.42}
          />
        </mesh>

        {/* 3. INNER CONCENTRIC GOLD ZARI ACCENT */}
        <mesh ref={zariBorderInnerRef} geometry={zariInnerGeo} position={[0, 0, -0.045]}>
          <meshStandardMaterial
            color="#FFE699"
            roughness={0.15}
            metalness={0.92}
            emissive="#996515"
            emissiveIntensity={0.3}
          />
        </mesh>

        {/* ================================================================= */}
        {/* 4. SECONDARY CASCADING PLEAT RIBBON (PATLI DRAPE)                 */}
        {/* ================================================================= */}
        <mesh ref={secondaryPleatRef} geometry={secondaryPleatGeo} position={[0.3, 0.1, -0.2]}>
          <meshPhysicalMaterial
            color="#4A0B42" // Rich Royal Magenta Silk
            emissive="#200325"
            emissiveIntensity={0.3}
            roughness={0.2}
            metalness={0.58}
            clearcoat={0.9}
            sheen={1.0}
            sheenColor={new THREE.Color('#FDE68A')}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* ================================================================= */}
        {/* 5. FOUR FLOATING 3D GOLDEN LOTUS ZARI BOOTI MEDALLIONS            */}
        {/* ================================================================= */}
        <group ref={lotusBootisGroupRef} position={[0, 0, 0]}>
          {/* Booti 1: Top Left */}
          <mesh geometry={lotusBootiGeo} position={[-1.2, 0.8, 0.4]} rotation={[0.2, 0.4, 0]}>
            <meshStandardMaterial
              color="#FFDF79"
              metalness={0.95}
              roughness={0.15}
              emissive="#D4AF37"
              emissiveIntensity={0.4}
            />
          </mesh>
          {/* Booti 2: Center Right */}
          <mesh geometry={lotusBootiGeo} position={[1.4, 0.3, 0.6]} rotation={[-0.3, -0.5, 0.2]}>
            <meshStandardMaterial
              color="#FDE68A"
              metalness={0.95}
              roughness={0.15}
              emissive="#D4AF37"
              emissiveIntensity={0.45}
            />
          </mesh>
          {/* Booti 3: Lower Center */}
          <mesh geometry={lotusBootiGeo} position={[0.2, -1.2, 0.5]} rotation={[0.4, 0.2, -0.3]}>
            <meshStandardMaterial
              color="#FFE699"
              metalness={0.92}
              roughness={0.18}
              emissive="#B8860B"
              emissiveIntensity={0.35}
            />
          </mesh>
          {/* Booti 4: Far Left Ambient */}
          <mesh geometry={lotusBootiGeo} position={[-1.8, -0.6, -0.3]} rotation={[-0.2, 0.6, 0.4]}>
            <meshStandardMaterial
              color="#DFBF7A"
              metalness={0.9}
              roughness={0.2}
              emissive="#996515"
              emissiveIntensity={0.3}
            />
          </mesh>
        </group>

        {/* ================================================================= */}
        {/* 6. TRADITIONAL HANDLOOM FLYING SHUTTLE (DHOKI)                   */}
        {/* ================================================================= */}
        <group ref={shuttleGroupRef} position={[0.2, 0, 0.45]} scale={[0.88, 0.88, 0.88]}>
          {/* Shuttle Body: Aged Rosewood Hull */}
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.09, 0.09, 1.4, 16]} />
            <meshStandardMaterial color="#3E1A0C" roughness={0.38} metalness={0.12} />
          </mesh>

          {/* Brass Front Tip */}
          <mesh position={[0, 0.76, 0]}>
            <coneGeometry args={[0.095, 0.24, 16]} />
            <meshStandardMaterial
              color="#D4AF37"
              metalness={0.95}
              roughness={0.12}
              emissive="#996515"
              emissiveIntensity={0.3}
            />
          </mesh>

          {/* Brass Rear Tip */}
          <mesh position={[0, -0.76, 0]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.095, 0.24, 16]} />
            <meshStandardMaterial
              color="#D4AF37"
              metalness={0.95}
              roughness={0.12}
              emissive="#996515"
              emissiveIntensity={0.3}
            />
          </mesh>

          {/* Inner Pirn Spool with Wound Golden Silk Yarn */}
          <mesh position={[0, 0, 0.03]}>
            <cylinderGeometry args={[0.048, 0.048, 0.52, 16]} />
            <meshStandardMaterial
              color="#FDE68A"
              emissive="#EAB308"
              emissiveIntensity={0.55}
              roughness={0.25}
              metalness={0.75}
            />
          </mesh>

          {/* Trailing Silk Filament Thread */}
          <mesh position={[0.08, 0, 0.05]} rotation={[0, 0, Math.PI / 4]}>
            <cylinderGeometry args={[0.005, 0.005, 0.7, 8]} />
            <meshBasicMaterial color="#FFDF79" />
          </mesh>
        </group>

        {/* Dynamic Trailing Golden Weft Yarn Line */}
        <lineSegments ref={trailingYarnRef} geometry={trailingYarnGeometry}>
          <lineBasicMaterial color="#FDE68A" transparent opacity={0.7} blending={THREE.AdditiveBlending} />
        </lineSegments>

        {/* ================================================================= */}
        {/* 7. THE LOOM WARP GRID (TANA-BANA THREADS)                        */}
        {/* ================================================================= */}
        <lineSegments ref={warpLinesRef} geometry={warpGeometry}>
          <lineBasicMaterial
            color="#C5A059"
            transparent
            opacity={0.4}
            blending={THREE.AdditiveBlending}
          />
        </lineSegments>

        {/* Orbiting Celestial Golden Weave Ring */}
        <mesh rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[2.7, 0.014, 16, 120]} />
          <meshStandardMaterial
            color="#DFBF7A"
            metalness={0.95}
            roughness={0.15}
            emissive="#C5A059"
            emissiveIntensity={0.45}
            transparent
            opacity={0.7}
          />
        </mesh>

        {/* ================================================================= */}
        {/* 8. AMBIENT SILK HORIZON WAVE (4TH COMPONENT - PRODUCT GRID)      */}
        {/* ================================================================= */}
        <mesh ref={horizonWaveRef} geometry={horizonWaveGeometry} scale={[0, 0, 0]} position={[0, -2.4, -0.6]}>
          <meshPhysicalMaterial
            color="#2E083B"
            emissive="#15021D"
            emissiveIntensity={0.28}
            roughness={0.25}
            metalness={0.65}
            clearcoat={0.85}
            sheen={1.0}
            sheenColor={new THREE.Color('#DFBF7A')}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* ================================================================= */}
        {/* 9. ANCESTRAL PIT-LOOM WOODEN FRAME (5TH COMPONENT - ABOUT)       */}
        {/* ================================================================= */}
        <group ref={loomFrameRef} scale={[0, 0, 0]} position={[0, 0, -1.2]}>
          {/* Top Warp Beam (Cloth Roller) */}
          <mesh position={[0, 2.7, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.14, 0.14, 5.0, 24]} />
            <meshStandardMaterial color="#2B1408" roughness={0.45} metalness={0.15} />
          </mesh>
          {/* Bottom Warp Beam */}
          <mesh position={[0, -2.7, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.14, 0.14, 5.0, 24]} />
            <meshStandardMaterial color="#2B1408" roughness={0.45} metalness={0.15} />
          </mesh>
          {/* Left Teak Post */}
          <mesh position={[-2.5, 0, 0]}>
            <boxGeometry args={[0.18, 5.8, 0.18]} />
            <meshStandardMaterial color="#220F05" roughness={0.5} metalness={0.1} />
          </mesh>
          {/* Right Teak Post */}
          <mesh position={[2.5, 0, 0]}>
            <boxGeometry args={[0.18, 5.8, 0.18]} />
            <meshStandardMaterial color="#220F05" roughness={0.5} metalness={0.1} />
          </mesh>
          {/* Brass Brackets */}
          <mesh position={[-2.5, 2.7, 0]}>
            <boxGeometry args={[0.22, 0.22, 0.22]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.92} roughness={0.2} emissive="#996515" emissiveIntensity={0.25} />
          </mesh>
          <mesh position={[2.5, 2.7, 0]}>
            <boxGeometry args={[0.22, 0.22, 0.22]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.92} roughness={0.2} emissive="#996515" emissiveIntensity={0.25} />
          </mesh>
        </group>

      </group>
    </Float>
  );
};
