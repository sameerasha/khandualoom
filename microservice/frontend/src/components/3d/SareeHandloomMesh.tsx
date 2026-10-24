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
  const shuttleGroupRef = useRef<THREE.Group>(null);
  const sareeDrapeRef = useRef<THREE.Mesh>(null);
  const zariBorderRef = useRef<THREE.Mesh>(null);
  const zariBorderInnerRef = useRef<THREE.Mesh>(null);
  const warpLinesRef = useRef<THREE.LineSegments>(null);
  const trustRingsGroupRef = useRef<THREE.Group>(null);
  const horizonWaveRef = useRef<THREE.Mesh>(null);
  const loomFrameRef = useRef<THREE.Group>(null);
  const trailingYarnRef = useRef<THREE.LineSegments>(null);

  const targetRotation = useRef({ x: 0, y: 0 });

  // =========================================================================
  // 1. GENERATE THE SWEEPING SAREE PALLU 3D CURVE
  // =========================================================================
  const { sareeGeometry, zariGeometry, zariInnerGeometry } = useMemo(() => {
    const curvePoints = [
      new THREE.Vector3(-1.8, 1.4, -0.6),
      new THREE.Vector3(-0.9, 0.8, 0.4),
      new THREE.Vector3(0.0, 0.2, 0.7),
      new THREE.Vector3(1.1, -0.3, 0.2),
      new THREE.Vector3(1.8, -0.9, -0.5),
      new THREE.Vector3(2.3, -1.6, 0.3),
    ];
    const curve = new THREE.CatmullRomCurve3(curvePoints);

    const ribbonShape = new THREE.Shape();
    const ribbonWidth = 0.95;
    const ribbonThickness = 0.025;
    ribbonShape.moveTo(-ribbonWidth / 2, -ribbonThickness / 2);
    ribbonShape.lineTo(ribbonWidth / 2, -ribbonThickness / 2);
    ribbonShape.lineTo(ribbonWidth / 2, ribbonThickness / 2);
    ribbonShape.lineTo(-ribbonWidth / 2, ribbonThickness / 2);
    ribbonShape.closePath();

    const extrudeSettings = {
      steps: 140,
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
      steps: 140,
      bevelEnabled: false,
      extrudePath: curve,
    });

    // Secondary concentric border
    const zariInnerShape = new THREE.Shape();
    zariInnerShape.absarc(0, 0, 0.025, 0, Math.PI * 2, false);
    const zariInnerGeo = new THREE.ExtrudeGeometry(zariInnerShape, {
      steps: 140,
      bevelEnabled: false,
      extrudePath: curve,
    });

    return {
      sareeGeometry: sareeGeo,
      zariGeometry: zariGeo,
      zariInnerGeometry: zariInnerGeo,
    };
  }, []);

  // =========================================================================
  // 2. GENERATE LOOM WARP GRID THREADS (TANA LINES)
  // =========================================================================
  const warpGeometry = useMemo(() => {
    const points: number[] = [];
    const count = 32;
    const width = 4.2;
    for (let i = 0; i < count; i++) {
      const x = -width / 2 + (width / (count - 1)) * i;
      points.push(x, 2.6, -0.9 + (i % 2 === 0 ? 0.18 : -0.18));
      points.push(x * 0.95, -2.6, 0.6 + (i % 2 === 0 ? -0.18 : 0.18));
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    return geo;
  }, []);

  // =========================================================================
  // 3. GENERATE THE SECONDARY SILK HORIZON WAVE (FOR COMPONENT 4 - CATALOG)
  // =========================================================================
  const horizonWaveGeometry = useMemo(() => {
    const wavePoints = [
      new THREE.Vector3(-4.5, -2.8, -1.2),
      new THREE.Vector3(-2.2, -2.2, -0.4),
      new THREE.Vector3(0.0, -2.5, 0.2),
      new THREE.Vector3(2.4, -2.0, -0.3),
      new THREE.Vector3(4.5, -2.7, -1.0),
    ];
    const waveCurve = new THREE.CatmullRomCurve3(wavePoints);

    const waveShape = new THREE.Shape();
    const w = 1.4;
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
      bevelSize: 0.005,
      bevelThickness: 0.005,
      extrudePath: waveCurve,
    });
  }, []);

  // =========================================================================
  // 4. GENERATE DYNAMIC TRAILING GOLD YARN FOR FLYING SHUTTLE
  // =========================================================================
  const trailingYarnGeometry = useMemo(() => {
    const pts = [
      new THREE.Vector3(-1.8, 0, 0),
      new THREE.Vector3(-0.9, 0.1, 0.1),
      new THREE.Vector3(0, 0, 0.2),
      new THREE.Vector3(0.9, -0.1, 0.3),
      new THREE.Vector3(1.8, 0, 0.4),
    ];
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    return geo;
  }, []);

  // Frame animation: interactive cursor tracking and continuous scroll choreography
  useFrame((state) => {
    if (!groupRef.current) return;

    const time = state.clock.getElapsedTime();
    const p = Math.min(Math.max(scrollProgress, 0), 1.0); // Normalized 0 to 1

    if (!reducedMotion) {
      // Interactive mouse parallax tracking
      const mouseX = state.pointer.x * 0.4;
      const mouseY = state.pointer.y * 0.3;
      targetRotation.current.x = THREE.MathUtils.lerp(targetRotation.current.x, mouseY, 0.06);
      targetRotation.current.y = THREE.MathUtils.lerp(targetRotation.current.y, mouseX, 0.06);

      // =====================================================================
      // STAGE-BASED MULTI-COMPONENT COORDINATES:
      // Hero (0.0 - 0.22): Top right majestic view
      // Heritage Features (0.22 - 0.42): Center panoramic silk expansion
      // Craft Showcase (0.42 - 0.62): Shuttle weaving macro view
      // Product Catalog (0.62 - 0.82): Pull back into silk horizon wave
      // About / Heritage (0.82 - 1.0): Pit-loom architecture & reverent ascent
      // =====================================================================
      let targetX = 1.35;
      let targetY = 0.05;
      let targetZ = 0.0;
      let groupScale = 1.25;

      if (p <= 0.22) {
        // Hero Section
        const t = p / 0.22;
        targetX = 1.35 - t * 0.5 + targetRotation.current.y * 0.5;
        targetY = 0.05 - t * 0.4 - targetRotation.current.x * 0.4;
        targetZ = -t * 0.3;
        groupScale = 1.25;
      } else if (p <= 0.42) {
        // Heritage Features Section (2nd Component) - Center Pan & Unfurling Silk
        const t = (p - 0.22) / 0.2;
        targetX = 0.85 - t * 0.85 + targetRotation.current.y * 0.4;
        targetY = -0.35 - t * 0.5 - targetRotation.current.x * 0.3;
        targetZ = -0.3 - t * 0.4;
        groupScale = 1.25 + t * 0.15;
      } else if (p <= 0.62) {
        // Craft Showcase Section (3rd Component) - Shuttle & Loom Macro Focus
        const t = (p - 0.42) / 0.2;
        targetX = 0.0 + t * 0.9 + targetRotation.current.y * 0.5;
        targetY = -0.85 + t * 0.2 - targetRotation.current.x * 0.4;
        targetZ = -0.7 + t * 0.3;
        groupScale = 1.4 - t * 0.1;
      } else if (p <= 0.82) {
        // Product Catalog (4th Component) - Deep Background Horizon
        const t = (p - 0.62) / 0.2;
        targetX = 0.9 - t * 0.9 + targetRotation.current.y * 0.3;
        targetY = -0.65 - t * 0.6 - targetRotation.current.x * 0.2;
        targetZ = -0.4 - t * 0.8;
        groupScale = 1.3 - t * 0.15;
      } else {
        // About & Testimonials (5th Component) - Pit Loom Sanctuary
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

      // =====================================================================
      // 1. Saree Drape Rotation: undulating flow + scroll rotation shift
      // =====================================================================
      if (sareeDrapeRef.current) {
        sareeDrapeRef.current.rotation.y =
          Math.sin(time * 0.25) * 0.15 + p * Math.PI * 1.8 + targetRotation.current.y;
        sareeDrapeRef.current.rotation.x =
          Math.cos(time * 0.2) * 0.12 + p * 0.95 + targetRotation.current.x;
        sareeDrapeRef.current.rotation.z =
          Math.sin(time * 0.18) * 0.08 - p * 0.6;
      }
      if (zariBorderRef.current && sareeDrapeRef.current) {
        zariBorderRef.current.rotation.copy(sareeDrapeRef.current.rotation);
      }
      if (zariBorderInnerRef.current && sareeDrapeRef.current) {
        zariBorderInnerRef.current.rotation.copy(sareeDrapeRef.current.rotation);
      }

      // =====================================================================
      // 2. Active Handloom Flying Shuttle (Dhoki) & Weaving Speed
      // =====================================================================
      if (shuttleGroupRef.current) {
        // Speed up shuttle motion significantly in Craft Showcase (p: 0.35 - 0.65)
        const inCraftSection = p >= 0.35 && p <= 0.65;
        const shuttleSpeed = inCraftSection ? 3.6 : 1.8;
        const shuttleAmplitude = inCraftSection ? 1.8 : 1.35;

        shuttleGroupRef.current.position.x =
          Math.sin(time * shuttleSpeed) * shuttleAmplitude + (inCraftSection ? 0.3 : 0.15);
        shuttleGroupRef.current.position.y =
          Math.cos(time * shuttleSpeed) * 0.22 - p * 0.5;
        shuttleGroupRef.current.position.z =
          0.45 + Math.sin(time * shuttleSpeed * 2) * 0.12;
        shuttleGroupRef.current.rotation.z =
          Math.cos(time * shuttleSpeed) * 0.35;
        shuttleGroupRef.current.rotation.y = time * 0.5 + p * 1.2;
      }

      // =====================================================================
      // 3. Dynamic Trailing Gold Weft Yarn
      // =====================================================================
      if (trailingYarnRef.current && shuttleGroupRef.current) {
        trailingYarnRef.current.position.copy(shuttleGroupRef.current.position);
        trailingYarnRef.current.rotation.z = shuttleGroupRef.current.rotation.z;
        trailingYarnRef.current.scale.set(
          Math.abs(Math.sin(time * 2)) * 1.2 + 0.4,
          1,
          1
        );
      }

      // =====================================================================
      // 4. The 4 Celestial Golden Trust Rings (Component 2 - Heritage Features)
      // =====================================================================
      if (trustRingsGroupRef.current) {
        // Active and prominent during Heritage Features (p: 0.18 - 0.45)
        const ringVisibility =
          p >= 0.12 && p <= 0.52
            ? Math.sin(((p - 0.12) / (0.52 - 0.12)) * Math.PI)
            : 0.15;
        trustRingsGroupRef.current.scale.setScalar(
          THREE.MathUtils.lerp(trustRingsGroupRef.current.scale.x, ringVisibility * 1.25, 0.08)
        );
        trustRingsGroupRef.current.rotation.y = time * 0.4 + p * 2.0;
        trustRingsGroupRef.current.rotation.x = Math.sin(time * 0.3) * 0.2 + p * 0.5;
      }

      // =====================================================================
      // 5. Ambient Silk Horizon Wave (Component 4 - Product Grid)
      // =====================================================================
      if (horizonWaveRef.current) {
        const waveVisibility =
          p >= 0.5
            ? Math.min((p - 0.5) / 0.2, 1.0)
            : 0;
        horizonWaveRef.current.scale.setScalar(
          THREE.MathUtils.lerp(horizonWaveRef.current.scale.x, waveVisibility * 1.15, 0.08)
        );
        horizonWaveRef.current.rotation.y = Math.sin(time * 0.2) * 0.15 + (p - 0.5) * 0.6;
        horizonWaveRef.current.position.y = -2.4 + Math.sin(time * 0.35) * 0.15;
      }

      // =====================================================================
      // 6. Ancestral Pit Loom Framework (Component 5 - About Section)
      // =====================================================================
      if (loomFrameRef.current) {
        const frameVisibility =
          p >= 0.75
            ? Math.min((p - 0.75) / 0.15, 1.0)
            : 0;
        loomFrameRef.current.scale.setScalar(
          THREE.MathUtils.lerp(loomFrameRef.current.scale.x, frameVisibility, 0.08)
        );
        loomFrameRef.current.rotation.y = (p - 0.75) * 0.4;
      }

      // =====================================================================
      // 7. Warp Threads Shimmering Luminescence
      // =====================================================================
      if (warpLinesRef.current) {
        warpLinesRef.current.rotation.y = Math.sin(time * 0.15) * 0.05;
        // Pulse opacity when shuttle passes through
        const lineMat = warpLinesRef.current.material as THREE.LineBasicMaterial;
        if (lineMat) {
          lineMat.opacity = 0.25 + Math.abs(Math.sin(time * 1.5)) * 0.25;
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
        {/* 1. THE FLOWING SAREE PALLU & PLEAT DRAPE                          */}
        {/* ================================================================= */}
        <mesh ref={sareeDrapeRef} geometry={sareeGeometry} castShadow receiveShadow>
          <meshPhysicalMaterial
            color="#3B0B3F" // Imperial Mulberry Plum Silk
            emissive="#1A0220"
            emissiveIntensity={0.35}
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
        <mesh ref={zariBorderRef} geometry={zariGeometry} position={[0, 0, 0.04]}>
          <meshStandardMaterial
            color="#FFDF79" // 24K Zari Gold
            roughness={0.12}
            metalness={0.95}
            emissive="#B8860B"
            emissiveIntensity={0.4}
          />
        </mesh>

        {/* 3. INNER CONCENTRIC GOLD ZARI ACCENT */}
        <mesh ref={zariBorderInnerRef} geometry={zariInnerGeometry} position={[0, 0, -0.04]}>
          <meshStandardMaterial
            color="#FFE699"
            roughness={0.15}
            metalness={0.92}
            emissive="#996515"
            emissiveIntensity={0.28}
          />
        </mesh>

        {/* ================================================================= */}
        {/* 4. THE 4 GOLDEN CELESTIAL AURA RINGS (2ND COMPONENT - TRUST PILLARS) */}
        {/* ================================================================= */}
        <group ref={trustRingsGroupRef} position={[0, -0.2, 0]} scale={[0.1, 0.1, 0.1]}>
          {/* Ring 1: Silk Mark India Seal Orbit */}
          <mesh rotation={[Math.PI / 4, 0, 0]}>
            <torusGeometry args={[1.8, 0.015, 16, 100]} />
            <meshStandardMaterial
              color="#FDE68A"
              metalness={0.95}
              roughness={0.15}
              emissive="#D97706"
              emissiveIntensity={0.5}
            />
          </mesh>
          {/* Glowing Silk Mark Jewel Node */}
          <mesh position={[1.8, 0, 0]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshStandardMaterial color="#FFFFFF" emissive="#FDE68A" emissiveIntensity={1.2} />
          </mesh>

          {/* Ring 2: Direct Weavers Guild Orbit */}
          <mesh rotation={[-Math.PI / 3, Math.PI / 6, 0]}>
            <torusGeometry args={[2.2, 0.012, 16, 100]} />
            <meshStandardMaterial
              color="#DFBF7A"
              metalness={0.9}
              roughness={0.2}
              emissive="#B45309"
              emissiveIntensity={0.4}
            />
          </mesh>
          <mesh position={[-2.2, 0, 0]}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshStandardMaterial color="#FFFFFF" emissive="#F59E0B" emissiveIntensity={1.0} />
          </mesh>

          {/* Ring 3: Zero-Defect Master Inspection Orbit */}
          <mesh rotation={[0, Math.PI / 3, Math.PI / 4]}>
            <torusGeometry args={[2.6, 0.01, 16, 100]} />
            <meshStandardMaterial
              color="#F59E0B"
              metalness={0.92}
              roughness={0.18}
              emissive="#78350F"
              emissiveIntensity={0.35}
            />
          </mesh>
          <mesh position={[0, 2.6, 0]}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshStandardMaterial color="#FFFFFF" emissive="#10B981" emissiveIntensity={0.9} />
          </mesh>

          {/* Ring 4: Imperial Velvet Storage Chest Orbit */}
          <mesh rotation={[Math.PI / 6, -Math.PI / 4, 0]}>
            <torusGeometry args={[3.0, 0.008, 16, 100]} />
            <meshStandardMaterial
              color="#C5A059"
              metalness={0.9}
              roughness={0.25}
              emissive="#92400E"
              emissiveIntensity={0.3}
            />
          </mesh>
        </group>

        {/* ================================================================= */}
        {/* 5. THE TRADITIONAL HANDLOOM FLYING SHUTTLE (DHOKI)               */}
        {/* ================================================================= */}
        <group ref={shuttleGroupRef} position={[0.2, 0, 0.4]} scale={[0.85, 0.85, 0.85]}>
          {/* Shuttle Body: Carved Teakwood / Rosewood Hull */}
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.09, 0.09, 1.35, 16]} />
            <meshStandardMaterial
              color="#3E1A0C" // Aged Rosewood Handloom Shuttle
              roughness={0.38}
              metalness={0.12}
            />
          </mesh>

          {/* Brass Front Tip (Pointed nose to separate warp threads) */}
          <mesh position={[0, 0.74, 0]}>
            <coneGeometry args={[0.095, 0.24, 16]} />
            <meshStandardMaterial
              color="#D4AF37" // Polished Loom Brass
              metalness={0.94}
              roughness={0.15}
              emissive="#996515"
              emissiveIntensity={0.3}
            />
          </mesh>

          {/* Brass Rear Tip */}
          <mesh position={[0, -0.74, 0]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.095, 0.24, 16]} />
            <meshStandardMaterial
              color="#D4AF37"
              metalness={0.94}
              roughness={0.15}
              emissive="#996515"
              emissiveIntensity={0.3}
            />
          </mesh>

          {/* Inner Hollow Cavity with Pure Gold Silk Bobbin (Pirn) */}
          <mesh position={[0, 0, 0.02]}>
            <boxGeometry args={[0.07, 0.58, 0.06]} />
            <meshStandardMaterial color="#220D05" roughness={0.6} />
          </mesh>

          {/* Wound Gold Silk Yarn on the Pirn Spool */}
          <mesh position={[0, 0, 0.03]}>
            <cylinderGeometry args={[0.045, 0.045, 0.5, 16]} />
            <meshStandardMaterial
              color="#FDE68A" // Raw Golden Zari Filament
              emissive="#EAB308"
              emissiveIntensity={0.5}
              roughness={0.28}
              metalness={0.7}
            />
          </mesh>

          {/* Trailing Silk Filament Thread */}
          <mesh position={[0.08, 0, 0.05]} rotation={[0, 0, Math.PI / 4]}>
            <cylinderGeometry args={[0.005, 0.005, 0.65, 8]} />
            <meshBasicMaterial color="#FFDF79" />
          </mesh>
        </group>

        {/* Dynamic Trailing Golden Weft Yarn Line */}
        <lineSegments ref={trailingYarnRef} geometry={trailingYarnGeometry}>
          <lineBasicMaterial color="#FDE68A" transparent opacity={0.65} blending={THREE.AdditiveBlending} />
        </lineSegments>

        {/* ================================================================= */}
        {/* 6. THE LOOM WARP GRID (TANA-BANA THREADS)                        */}
        {/* ================================================================= */}
        <lineSegments ref={warpLinesRef} geometry={warpGeometry}>
          <lineBasicMaterial
            color="#C5A059"
            transparent
            opacity={0.38}
            blending={THREE.AdditiveBlending}
          />
        </lineSegments>

        {/* ================================================================= */}
        {/* 7. AMBIENT SILK HORIZON WAVE (4TH COMPONENT - PRODUCT GRID)      */}
        {/* ================================================================= */}
        <mesh ref={horizonWaveRef} geometry={horizonWaveGeometry} scale={[0, 0, 0]} position={[0, -2.4, -0.6]}>
          <meshPhysicalMaterial
            color="#2E083B"
            emissive="#15021D"
            emissiveIntensity={0.25}
            roughness={0.28}
            metalness={0.65}
            clearcoat={0.8}
            sheen={1.0}
            sheenColor={new THREE.Color('#DFBF7A')}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* ================================================================= */}
        {/* 8. ANCESTRAL PIT-LOOM WOODEN FRAME (5TH COMPONENT - ABOUT)       */}
        {/* ================================================================= */}
        <group ref={loomFrameRef} scale={[0, 0, 0]} position={[0, 0, -1.2]}>
          {/* Top Warp Beam (Cloth Roller) */}
          <mesh position={[0, 2.7, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.14, 0.14, 4.8, 24]} />
            <meshStandardMaterial color="#2B1408" roughness={0.45} metalness={0.15} />
          </mesh>
          {/* Bottom Warp Beam */}
          <mesh position={[0, -2.7, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.14, 0.14, 4.8, 24]} />
            <meshStandardMaterial color="#2B1408" roughness={0.45} metalness={0.15} />
          </mesh>
          {/* Left Teak Post */}
          <mesh position={[-2.4, 0, 0]}>
            <boxGeometry args={[0.18, 5.6, 0.18]} />
            <meshStandardMaterial color="#220F05" roughness={0.5} metalness={0.1} />
          </mesh>
          {/* Right Teak Post */}
          <mesh position={[2.4, 0, 0]}>
            <boxGeometry args={[0.18, 5.6, 0.18]} />
            <meshStandardMaterial color="#220F05" roughness={0.5} metalness={0.1} />
          </mesh>
          {/* Brass Brackets on Top Corners */}
          <mesh position={[-2.4, 2.7, 0]}>
            <boxGeometry args={[0.22, 0.22, 0.22]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.92} roughness={0.2} emissive="#996515" emissiveIntensity={0.25} />
          </mesh>
          <mesh position={[2.4, 2.7, 0]}>
            <boxGeometry args={[0.22, 0.22, 0.22]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.92} roughness={0.2} emissive="#996515" emissiveIntensity={0.25} />
          </mesh>
        </group>

      </group>
    </Float>
  );
};
