import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface GoldenDustVortexProps {
  scrollProgress?: number; // 0.0 (top) to 1.0 (bottom)
  reducedMotion?: boolean;
}

// Generate an ultra-soft radial circular glow texture dynamically in memory
function createGlowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.18, 'rgba(255, 235, 160, 0.95)');
    gradient.addColorStop(0.4, 'rgba(230, 185, 70, 0.55)');
    gradient.addColorStop(0.7, 'rgba(190, 130, 25, 0.15)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export const GoldenDustVortex: React.FC<GoldenDustVortexProps> = ({
  scrollProgress = 0,
  reducedMotion = false,
}) => {
  const streamPointsRef = useRef<THREE.Points>(null);
  const ambientPointsRef = useRef<THREE.Points>(null);
  const celestialHaloRef = useRef<THREE.Points>(null);

  // Global window mouse tracking (ensures cursor movement is detected anywhere on the screen)
  const targetMouse = useRef({ x: 0, y: 0 });
  const smoothedMouse = useRef({ x: 0, y: 0, vx: 0, vy: 0, prevX: 0, prevY: 0 });

  const prevScrollRef = useRef(scrollProgress);
  const scrollVelocity = useRef(0);
  const smoothedProgress = useRef(scrollProgress);

  // Continuous fluid stream phase accumulator (advances steadily; never jumps with mouse speed!)
  const streamPhaseRef = useRef(0);

  // Reusable radial glow texture for soft circular particles
  const glowTexture = useMemo(() => createGlowTexture(), []);

  // Listen to window-level pointer movements to react everywhere
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      // Map screen pixel coordinates to normalized 3D space (-1 to +1)
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      targetMouse.current.x = nx;
      targetMouse.current.y = ny;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, []);

  // =========================================================================
  // 1. TIER 1: THE BUTTERY GOLDEN ZARI SILK STREAM (2,200 PARTICLES)
  // Pure soft glowing gold particles flowing along a fluid parametric river
  // =========================================================================
  const streamCount = 2200;
  const { streamPositions, streamTValues, streamOffsets, streamOriginalColors } = useMemo(() => {
    const pos = new Float32Array(streamCount * 3);
    const tVals = new Float32Array(streamCount);
    const offsets = new Float32Array(streamCount * 3);
    const cols = new Float32Array(streamCount * 3);

    for (let i = 0; i < streamCount; i++) {
      const t = i / streamCount;
      tVals[i] = t;

      // Smooth radial Gaussian-like dispersion around the streamline core
      const radius = Math.pow(Math.random(), 1.6) * 0.85;
      const angle = Math.random() * Math.PI * 2;
      offsets[i * 3 + 0] = Math.cos(angle) * radius;
      offsets[i * 3 + 1] = Math.sin(angle) * radius;
      offsets[i * 3 + 2] = (Math.random() - 0.5) * radius * 1.5;

      // Color variation from incandescent white-gold to pure 24K yellow gold
      const palette = Math.random();
      if (palette > 0.6) {
        cols[i * 3 + 0] = 1.0;
        cols[i * 3 + 1] = 0.95;
        cols[i * 3 + 2] = 0.75; // Champagne Gold
      } else if (palette > 0.2) {
        cols[i * 3 + 0] = 0.98;
        cols[i * 3 + 1] = 0.78;
        cols[i * 3 + 2] = 0.28; // Pure 24K Zari
      } else {
        cols[i * 3 + 0] = 0.95;
        cols[i * 3 + 1] = 0.62;
        cols[i * 3 + 2] = 0.18; // Warm Amber Gold
      }
    }
    return {
      streamPositions: pos,
      streamTValues: tVals,
      streamOffsets: offsets,
      streamOriginalColors: cols,
    };
  }, []);

  // =========================================================================
  // 2. TIER 2: AMBIENT CELESTIAL STARDUST (2,600 PARTICLES)
  // Volumetric field of glistening gold glitter specks that react to cursor
  // =========================================================================
  const ambientCount = 2600;
  const { ambientPositions, ambientOriginalPositions, ambientColors } = useMemo(() => {
    const pos = new Float32Array(ambientCount * 3);
    const origPos = new Float32Array(ambientCount * 3);
    const cols = new Float32Array(ambientCount * 3);

    for (let i = 0; i < ambientCount; i++) {
      const x = (Math.random() - 0.5) * 22;
      const y = (Math.random() - 0.5) * 18;
      const z = (Math.random() - 0.5) * 12;

      pos[i * 3 + 0] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      origPos[i * 3 + 0] = x;
      origPos[i * 3 + 1] = y;
      origPos[i * 3 + 2] = z;

      const goldShade = Math.random();
      if (goldShade > 0.65) {
        cols[i * 3 + 0] = 1.0;
        cols[i * 3 + 1] = 0.92;
        cols[i * 3 + 2] = 0.68;
      } else if (goldShade > 0.25) {
        cols[i * 3 + 0] = 0.98;
        cols[i * 3 + 1] = 0.76;
        cols[i * 3 + 2] = 0.25;
      } else {
        cols[i * 3 + 0] = 0.95;
        cols[i * 3 + 1] = 0.58;
        cols[i * 3 + 2] = 0.16;
      }
    }
    return {
      ambientPositions: pos,
      ambientOriginalPositions: origPos,
      ambientColors: cols,
    };
  }, []);

  // =========================================================================
  // 3. TIER 3: BUTTERY LIQUID GOLD SPIRAL NEBULA (750 PARTICLES)
  // Replaces the 3 rigid concentric rings with a continuous, buttery fluid vortex
  // =========================================================================
  const nebulaCount = 750;
  const { nebulaPositions, nebulaRadii, nebulaBaseAngles, nebulaSpeeds, nebulaColors } = useMemo(() => {
    const pos = new Float32Array(nebulaCount * 3);
    const radii = new Float32Array(nebulaCount);
    const baseAngles = new Float32Array(nebulaCount);
    const speeds = new Float32Array(nebulaCount);
    const cols = new Float32Array(nebulaCount * 3);

    for (let i = 0; i < nebulaCount; i++) {
      // Continuous smooth spiral distribution (no discrete concentric tracks!)
      const progress = i / nebulaCount;
      const r = 0.8 + Math.sqrt(progress) * 3.4 + (Math.random() - 0.5) * 0.45;
      const theta = progress * Math.PI * 10 + (Math.random() - 0.5) * 0.35;
      const z = Math.sin(theta * 2) * 0.35 + (Math.random() - 0.5) * 0.4;

      radii[i] = r;
      baseAngles[i] = theta;
      // Differential fluid velocity: inner particles orbit faster than outer particles
      speeds[i] = 0.55 / Math.sqrt(Math.max(r, 0.8)) + 0.08;

      pos[i * 3 + 0] = Math.cos(theta) * r;
      pos[i * 3 + 1] = Math.sin(theta) * r * 0.65;
      pos[i * 3 + 2] = z;

      // Color gradient from bright molten champagne core to warm 24K zari rim
      const heat = Math.max(0, 1.0 - r / 4.2);
      cols[i * 3 + 0] = 1.0;
      cols[i * 3 + 1] = 0.75 + heat * 0.22;
      cols[i * 3 + 2] = 0.25 + heat * 0.55;
    }
    return {
      nebulaPositions: pos,
      nebulaRadii: radii,
      nebulaBaseAngles: baseAngles,
      nebulaSpeeds: speeds,
      nebulaColors: cols,
    };
  }, []);

  // =========================================================================
  // FRAME LOOP: BUTTERY MOUSE INTERACTION & CONTINUOUS SPIRAL CHOREOGRAPHY
  // =========================================================================
  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // 1. Ultra-smooth velvety mouse tracking (luxurious dampening, no sharp acceleration)
    const target3DX = targetMouse.current.x * 4.8; // Scale to 3D world space
    const target3DY = targetMouse.current.y * 3.2;

    const mx = smoothedMouse.current;
    mx.x = THREE.MathUtils.lerp(mx.x, target3DX, 0.04);
    mx.y = THREE.MathUtils.lerp(mx.y, target3DY, 0.04);

    // 2. Scroll progression and velocity
    const scrollDelta = scrollProgress - prevScrollRef.current;
    prevScrollRef.current = scrollProgress;
    scrollVelocity.current = THREE.MathUtils.lerp(
      scrollVelocity.current,
      scrollDelta / Math.max(delta, 0.001),
      0.1
    );
    smoothedProgress.current = THREE.MathUtils.lerp(
      smoothedProgress.current,
      scrollProgress,
      0.08
    );

    const p = smoothedProgress.current;

    // Advance stream phase continuously and steadily without speed jumps
    const dt = Math.min(delta, 0.05);
    streamPhaseRef.current += dt * (reducedMotion ? 0.025 : 0.045);
    const streamPhase = streamPhaseRef.current;

    // -----------------------------------------------------------------------
    // A. Animate Tier 1: Buttery Golden Zari Silk Stream with Gentle Swirl
    // -----------------------------------------------------------------------
    if (streamPointsRef.current) {
      const geo = streamPointsRef.current.geometry;
      const posAttr = geo.attributes.position as THREE.BufferAttribute;
      const positions = posAttr.array as Float32Array;

      for (let i = 0; i < streamCount; i++) {
        let t = (streamTValues[i] + streamPhase + p * 0.45) % 1.0;
        if (t < 0) t += 1.0;

        const offX = streamOffsets[i * 3 + 0];
        const offY = streamOffsets[i * 3 + 1];
        const offZ = streamOffsets[i * 3 + 2];

        let cx = 0;
        let cy = 0;
        let cz = 0;

        if (p <= 0.25) {
          // Hero: Sweeping golden S-curve on the right
          const angle = t * Math.PI * 2.2;
          cx = 1.6 + Math.sin(angle) * 1.45 + Math.cos(angle * 2) * 0.38;
          cy = (0.5 - t) * 6.8 + Math.sin(angle + time * 0.8) * 0.42;
          cz = Math.cos(angle) * 1.55 + Math.sin(angle * 3) * 0.32;
        } else if (p <= 0.5) {
          // Heritage: Unfurling wide golden spiral stream
          const factor = (p - 0.25) / 0.25;
          const heroAngle = t * Math.PI * 2.2;
          const haloAngle = t * Math.PI * 2;
          const haloR = 3.3 + Math.sin(t * Math.PI * 6 + time) * 0.35;

          const hx = Math.cos(haloAngle) * haloR;
          const hy = Math.sin(haloAngle) * haloR * 0.62 - 0.5;
          const hz = Math.sin(haloAngle * 2) * 0.85;

          const sx = 1.6 + Math.sin(heroAngle) * 1.45;
          const sy = (0.5 - t) * 6.8;
          const sz = Math.cos(heroAngle) * 1.55;

          cx = THREE.MathUtils.lerp(sx, hx, factor);
          cy = THREE.MathUtils.lerp(sy, hy, factor);
          cz = THREE.MathUtils.lerp(sz, hz, factor);
        } else if (p <= 0.75) {
          // Craft: Horizontal weaving filaments
          const factor = (p - 0.5) / 0.25;
          const weaveX = (t - 0.5) * 8.5;
          const weaveY = Math.sin(t * Math.PI * 8 + time * 2) * 0.5 - 0.3;
          const weaveZ = Math.cos(t * Math.PI * 4) * 0.65;

          const haloAngle = t * Math.PI * 2;
          const hx = Math.cos(haloAngle) * 3.3;
          const hy = Math.sin(haloAngle) * 2.0 - 0.5;
          const hz = Math.sin(haloAngle * 2) * 0.85;

          cx = THREE.MathUtils.lerp(hx, weaveX, factor);
          cy = THREE.MathUtils.lerp(hy, weaveY, factor);
          cz = THREE.MathUtils.lerp(hz, weaveZ, factor);
        } else {
          // Catalog & About: Ascending golden double-helix
          const factor = (p - 0.75) / 0.25;
          const helixAngle = t * Math.PI * 4 + time * 0.6;
          const helixR = 2.5 - t * 0.8;
          const helixX = Math.cos(helixAngle) * helixR;
          const helixY = (t - 0.5) * 7.2;
          const helixZ = Math.sin(helixAngle) * helixR;

          const weaveX = (t - 0.5) * 8.5;
          const weaveY = -0.3;
          const weaveZ = 0;

          cx = THREE.MathUtils.lerp(weaveX, helixX, factor);
          cy = THREE.MathUtils.lerp(weaveY, helixY, factor);
          cz = THREE.MathUtils.lerp(weaveZ, helixZ, factor);
        }

        // ===================================================================
        // BUTTERY MOUSE INTERACTION (GENTLE DEFLECTION & SILK SWIRL)
        // ===================================================================
        const dx = cx - mx.x;
        const dy = cy - mx.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Gentle interactive radius around cursor
        const interactionRadius = 2.4;
        let pushX = 0;
        let pushY = 0;
        let pushZ = 0;

        if (dist < interactionRadius && dist > 0.001) {
          // Soft cubic falloff
          const normDist = dist / interactionRadius;
          const strength = (1 - normDist) * (1 - normDist) * 0.42;

          // Outward radial push
          const nx = dx / dist;
          const ny = dy / dist;
          // Perpendicular vortex swirl (gives that liquid fluid swirl feeling)
          const swirlX = -ny;
          const swirlY = nx;

          pushX = (nx * 0.7 + swirlX * 0.3) * strength;
          pushY = (ny * 0.7 + swirlY * 0.3) * strength;
          pushZ = Math.sin(dist * 2) * strength * 0.4;
        }

        positions[i * 3 + 0] = cx + offX + pushX;
        positions[i * 3 + 1] = cy + offY + pushY;
        positions[i * 3 + 2] = cz + offZ + pushZ;
      }

      posAttr.needsUpdate = true;
    }

    // -----------------------------------------------------------------------
    // B. Animate Tier 2: Ambient Celestial Stardust reacting to Cursor
    // -----------------------------------------------------------------------
    if (ambientPointsRef.current) {
      const geo = ambientPointsRef.current.geometry;
      const posAttr = geo.attributes.position as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;

      // Global rotation influenced by time and scroll
      ambientPointsRef.current.rotation.y = time * 0.03 + p * 0.85;
      ambientPointsRef.current.rotation.x = Math.sin(time * 0.02) * 0.06;
      ambientPointsRef.current.position.y = -p * 1.5;

      // Gentle mouse displacement wave on ambient dust
      for (let i = 0; i < 400; i++) {
        const ox = ambientOriginalPositions[i * 3 + 0];
        const oy = ambientOriginalPositions[i * 3 + 1];

        const dx = ox - mx.x;
        const dy = oy - mx.y;
        const d = Math.sqrt(dx * dx + dy * dy);

        if (d < 2.2 && d > 0.01) {
          const push = Math.pow(1 - d / 2.2, 2) * 0.3;
          posArray[i * 3 + 0] = THREE.MathUtils.lerp(posArray[i * 3 + 0], ox + (dx / d) * push, 0.04);
          posArray[i * 3 + 1] = THREE.MathUtils.lerp(posArray[i * 3 + 1], oy + (dy / d) * push, 0.04);
        } else {
          posArray[i * 3 + 0] = THREE.MathUtils.lerp(posArray[i * 3 + 0], ox, 0.02);
          posArray[i * 3 + 1] = THREE.MathUtils.lerp(posArray[i * 3 + 1], oy, 0.02);
        }
      }
      posAttr.needsUpdate = true;
    }

    // -----------------------------------------------------------------------
    // C. Animate Tier 3: Buttery Liquid Gold Spiral Nebula (Differential Fluid Motion)
    // -----------------------------------------------------------------------
    if (celestialHaloRef.current) {
      const geo = celestialHaloRef.current.geometry;
      const posAttr = geo.attributes.position as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;

      // Smooth visibility envelope on scroll: prominent during Heritage Features (p = 0.15 to 0.55)
      const nebulaVis =
        p >= 0.15 && p <= 0.55
          ? Math.sin(((p - 0.15) / (0.55 - 0.15)) * Math.PI)
          : 0.18;

      celestialHaloRef.current.scale.setScalar(
        THREE.MathUtils.lerp(celestialHaloRef.current.scale.x, nebulaVis * 1.25, 0.08)
      );

      // Differential fluid rotation: each particle rotates at its own fluid speed
      for (let i = 0; i < nebulaCount; i++) {
        const r = nebulaRadii[i];
        const currentTheta = nebulaBaseAngles[i] + time * nebulaSpeeds[i] + p * 2.2;

        let px = Math.cos(currentTheta) * r;
        let py = Math.sin(currentTheta) * (r * 0.65);
        let pz = Math.sin(currentTheta * 2) * 0.35;

        // Buttery gentle mouse reaction on nebula particles
        const dx = px - mx.x;
        const dy = py - mx.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 2.2 && d > 0.01) {
          const force = Math.pow(1 - d / 2.2, 2) * 0.32;
          px += (dx / d) * force;
          py += (dy / d) * force;
        }

        posArray[i * 3 + 0] = px;
        posArray[i * 3 + 1] = py;
        posArray[i * 3 + 2] = pz;
      }
      posAttr.needsUpdate = true;

      // Subtle tilt & buttery soft parallax
      celestialHaloRef.current.rotation.x = Math.PI / 5 + Math.sin(time * 0.2) * 0.12;
      celestialHaloRef.current.rotation.z = Math.sin(time * 0.25) * 0.1;
      celestialHaloRef.current.position.x = THREE.MathUtils.lerp(celestialHaloRef.current.position.x, mx.x * 0.04, 0.03);
      celestialHaloRef.current.position.y = THREE.MathUtils.lerp(celestialHaloRef.current.position.y, mx.y * 0.04, 0.03);
    }
  });

  return (
    <group>
      {/* ================================================================= */}
      {/* 1. TIER 1: BUTTERY GOLDEN ZARI SILK STREAM (2,200 PARTICLES)       */}
      {/* ================================================================= */}
      <points ref={streamPointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[streamPositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[streamOriginalColors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.16}
          map={glowTexture}
          vertexColors
          transparent
          opacity={0.92}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>

      {/* ================================================================= */}
      {/* 2. TIER 2: AMBIENT CELESTIAL GOLDEN STARDUST (2,600 PARTICLES)    */}
      {/* ================================================================= */}
      <points ref={ambientPointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[ambientPositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[ambientColors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.07}
          map={glowTexture}
          vertexColors
          transparent
          opacity={0.82}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>

      {/* ================================================================= */}
      {/* 3. TIER 3: BUTTERY LIQUID GOLD SPIRAL NEBULA (750 PARTICLES)      */}
      {/* Continuous fluid spiral vortex with differential fluid rotation    */}
      {/* ================================================================= */}
      <points ref={celestialHaloRef} scale={[0.1, 0.1, 0.1]}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[nebulaPositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[nebulaColors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.13}
          map={glowTexture}
          vertexColors
          transparent
          opacity={0.88}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
    </group>
  );
};
