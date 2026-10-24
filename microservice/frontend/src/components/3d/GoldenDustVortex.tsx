import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface GoldenDustVortexProps {
  scrollProgress?: number; // 0.0 (top) to 1.0 (bottom)
  reducedMotion?: boolean;
}

// Generate a soft radial circular glow texture dynamically in memory
function createGlowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(255, 230, 140, 0.85)');
    gradient.addColorStop(0.5, 'rgba(212, 175, 55, 0.4)');
    gradient.addColorStop(0.8, 'rgba(180, 120, 20, 0.12)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
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
  const bokehEmbersRef = useRef<THREE.Points>(null);
  const celestialRingsRef = useRef<THREE.Points>(null);

  const prevScrollRef = useRef(scrollProgress);
  const scrollVelocity = useRef(0);
  const smoothedProgress = useRef(scrollProgress);

  // Reusable radial glow texture for soft circular particles
  const glowTexture = useMemo(() => createGlowTexture(), []);

  // =========================================================================
  // 1. TIER 1: THE GOLDEN ZARI SILK STREAM (1,400 PARTICLES)
  // Arranged along a fluid, twisting parametric river of molten gold dust
  // =========================================================================
  const streamCount = 1400;
  const { streamPositions, streamTValues, streamOffsets, streamOriginalColors } = useMemo(() => {
    const pos = new Float32Array(streamCount * 3);
    const tVals = new Float32Array(streamCount);
    const offsets = new Float32Array(streamCount * 3);
    const cols = new Float32Array(streamCount * 3);

    for (let i = 0; i < streamCount; i++) {
      const t = i / streamCount;
      tVals[i] = t;

      // Random dispersion around the streamline core
      const radius = Math.pow(Math.random(), 1.5) * 0.65;
      const angle = Math.random() * Math.PI * 2;
      offsets[i * 3 + 0] = Math.cos(angle) * radius;
      offsets[i * 3 + 1] = Math.sin(angle) * radius;
      offsets[i * 3 + 2] = (Math.random() - 0.5) * radius * 1.2;

      // Color variation from pure 24K gold to incandescent champagne
      const r = 0.98 + Math.random() * 0.02;
      const g = 0.78 + Math.random() * 0.18;
      const b = 0.35 + Math.random() * 0.35;
      cols[i * 3 + 0] = r;
      cols[i * 3 + 1] = g;
      cols[i * 3 + 2] = b;
    }
    return {
      streamPositions: pos,
      streamTValues: tVals,
      streamOffsets: offsets,
      streamOriginalColors: cols,
    };
  }, []);

  // =========================================================================
  // 2. TIER 2: AMBIENT CELESTIAL STARDUST (2,000 PARTICLES)
  // Volumetric field of glistening gold specks that drift and twinkle
  // =========================================================================
  const ambientCount = 2000;
  const { ambientPositions, ambientColors } = useMemo(() => {
    const pos = new Float32Array(ambientCount * 3);
    const cols = new Float32Array(ambientCount * 3);

    for (let i = 0; i < ambientCount; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 18;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12;

      const goldShade = Math.random();
      if (goldShade > 0.6) {
        // Bright Champagne Gold
        cols[i * 3 + 0] = 1.0;
        cols[i * 3 + 1] = 0.92;
        cols[i * 3 + 2] = 0.65;
      } else if (goldShade > 0.25) {
        // Deep 24K Imperial Gold
        cols[i * 3 + 0] = 0.98;
        cols[i * 3 + 1] = 0.75;
        cols[i * 3 + 2] = 0.25;
      } else {
        // Warm Amber Zari
        cols[i * 3 + 0] = 0.95;
        cols[i * 3 + 1] = 0.6;
        cols[i * 3 + 2] = 0.2;
      }
    }
    return {
      ambientPositions: pos,
      ambientColors: cols,
    };
  }, []);

  // =========================================================================
  // 3. TIER 3: SOFT FLOATING GOLDEN BOKEH EMBERS (70 PARTICLES)
  // Large glowing light orbs drifting slowly near the camera lens
  // =========================================================================
  const bokehCount = 70;
  const { bokehPositions, bokehVelocities } = useMemo(() => {
    const pos = new Float32Array(bokehCount * 3);
    const vels = new Float32Array(bokehCount * 3);

    for (let i = 0; i < bokehCount; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6 + 1.2; // Foreground for depth-of-field

      vels[i * 3 + 0] = (Math.random() - 0.5) * 0.15;
      vels[i * 3 + 1] = Math.random() * 0.2 + 0.1; // Gentle upward drift
      vels[i * 3 + 2] = (Math.random() - 0.5) * 0.1;
    }
    return { bokehPositions: pos, bokehVelocities: vels };
  }, []);

  // =========================================================================
  // 4. TIER 4: CELESTIAL ZARI ORBIT RINGS (400 PARTICLES)
  // Form concentric glowing golden halos during Heritage Features
  // =========================================================================
  const ringCount = 400;
  const ringPositions = useMemo(() => {
    const pos = new Float32Array(ringCount * 3);
    for (let i = 0; i < ringCount; i++) {
      const ringIdx = i % 3;
      const radius = 2.0 + ringIdx * 0.8 + (Math.random() - 0.5) * 0.25;
      const angle = (i / ringCount) * Math.PI * 6;
      pos[i * 3 + 0] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = Math.sin(angle) * radius * 0.6;
      pos[i * 3 + 2] = Math.sin(angle * 2) * 0.4;
    }
    return pos;
  }, []);

  // =========================================================================
  // FRAME ANIMATION: SCROLL VELOCITY, STREAM MORPHING & PARALLAX
  // =========================================================================
  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // 1. Calculate dynamic scroll velocity and smoothed progress
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
    const v = scrollVelocity.current * 0.05; // Scroll impulse factor

    // Mouse pointer interactive deflection
    const pointerX = state.pointer.x * 0.6;
    const pointerY = state.pointer.y * 0.4;

    // -----------------------------------------------------------------------
    // A. Animate Tier 1: The Golden Zari Silk Stream
    // -----------------------------------------------------------------------
    if (streamPointsRef.current) {
      const geo = streamPointsRef.current.geometry;
      const posAttr = geo.attributes.position as THREE.BufferAttribute;
      const positions = posAttr.array as Float32Array;

      // Base stream flow speed + velocity burst on scroll
      const flowRate = (reducedMotion ? 0.03 : 0.09) + Math.abs(v) * 0.4;

      for (let i = 0; i < streamCount; i++) {
        // Advance parametric t coordinate
        let t = (streamTValues[i] + time * flowRate + p * 0.6) % 1.0;
        if (t < 0) t += 1.0;

        const offX = streamOffsets[i * 3 + 0];
        const offY = streamOffsets[i * 3 + 1];
        const offZ = streamOffsets[i * 3 + 2];

        // Multi-stage spline calculation influenced by scroll:
        // Hero: Sweeping S-curve on the right
        // Heritage: Widening orbital circle
        // Craft: Horizontal warp filaments
        // Catalog: Undulating wide horizon wave
        // About: Ascending double-helix vortex
        let cx = 0;
        let cy = 0;
        let cz = 0;

        if (p <= 0.25) {
          // Hero Section: Majestic golden S-curve draping down the right side
          const angle = t * Math.PI * 2.2;
          cx = 1.6 + Math.sin(angle) * 1.4 + Math.cos(angle * 2) * 0.4;
          cy = (0.5 - t) * 6.5 + Math.sin(angle + time * 0.8) * 0.4;
          cz = Math.cos(angle) * 1.5 + Math.sin(angle * 3) * 0.3;
        } else if (p <= 0.5) {
          // Heritage Features (2nd Component): Unfurling into an expanded golden halo
          const factor = (p - 0.25) / 0.25;
          const heroAngle = t * Math.PI * 2.2;
          const haloAngle = t * Math.PI * 2;
          const haloR = 3.2 + Math.sin(t * Math.PI * 6 + time) * 0.35;

          const hx = Math.cos(haloAngle) * haloR;
          const hy = Math.sin(haloAngle) * haloR * 0.6 - 0.5;
          const hz = Math.sin(haloAngle * 2) * 0.8;

          const sx = 1.6 + Math.sin(heroAngle) * 1.4;
          const sy = (0.5 - t) * 6.5;
          const sz = Math.cos(heroAngle) * 1.5;

          cx = THREE.MathUtils.lerp(sx, hx, factor);
          cy = THREE.MathUtils.lerp(sy, hy, factor);
          cz = THREE.MathUtils.lerp(sz, hz, factor);
        } else if (p <= 0.75) {
          // Craft Showcase (3rd Component): Linear horizontal weaving warp filaments
          const factor = (p - 0.5) / 0.25;
          const weaveX = (t - 0.5) * 8.0;
          const weaveY = Math.sin(t * Math.PI * 8 + time * 2) * 0.45 - 0.3;
          const weaveZ = Math.cos(t * Math.PI * 4) * 0.6;

          const haloAngle = t * Math.PI * 2;
          const hx = Math.cos(haloAngle) * 3.2;
          const hy = Math.sin(haloAngle) * 1.9 - 0.5;
          const hz = Math.sin(haloAngle * 2) * 0.8;

          cx = THREE.MathUtils.lerp(hx, weaveX, factor);
          cy = THREE.MathUtils.lerp(hy, weaveY, factor);
          cz = THREE.MathUtils.lerp(hz, weaveZ, factor);
        } else {
          // Product Catalog & About (4th & 5th Components): Ascending golden helix
          const factor = (p - 0.75) / 0.25;
          const helixAngle = t * Math.PI * 4 + time * 0.6;
          const helixR = 2.4 - t * 0.8;
          const helixX = Math.cos(helixAngle) * helixR;
          const helixY = (t - 0.5) * 7.0;
          const helixZ = Math.sin(helixAngle) * helixR;

          const weaveX = (t - 0.5) * 8.0;
          const weaveY = -0.3;
          const weaveZ = 0;

          cx = THREE.MathUtils.lerp(weaveX, helixX, factor);
          cy = THREE.MathUtils.lerp(weaveY, helixY, factor);
          cz = THREE.MathUtils.lerp(weaveZ, helixZ, factor);
        }

        // Apply interactive pointer deflection to the stream
        const dx = cx - pointerX;
        const dy = cy - pointerY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const deflection = Math.max(0, 1.2 - dist) * 0.35;

        positions[i * 3 + 0] = cx + offX + (dx / (dist + 0.01)) * deflection;
        positions[i * 3 + 1] = cy + offY + (dy / (dist + 0.01)) * deflection;
        positions[i * 3 + 2] = cz + offZ;
      }

      posAttr.needsUpdate = true;
    }

    // -----------------------------------------------------------------------
    // B. Animate Tier 2: Ambient Celestial Stardust
    // -----------------------------------------------------------------------
    if (ambientPointsRef.current) {
      // Rotation influenced by continuous time and scroll inertia
      ambientPointsRef.current.rotation.y = time * 0.03 + p * 0.8 + v * 0.1;
      ambientPointsRef.current.rotation.x = Math.sin(time * 0.02) * 0.08 + p * 0.35;
      ambientPointsRef.current.position.y = -p * 1.5;

      const mat = ambientPointsRef.current.material as THREE.PointsMaterial;
      if (mat) {
        // Glistening intensity pulse
        mat.opacity = 0.7 + Math.sin(time * 1.5) * 0.15;
      }
    }

    // -----------------------------------------------------------------------
    // C. Animate Tier 3: Soft Floating Golden Bokeh Embers
    // -----------------------------------------------------------------------
    if (bokehEmbersRef.current) {
      const geo = bokehEmbersRef.current.geometry;
      const posAttr = geo.attributes.position as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;

      for (let i = 0; i < bokehCount; i++) {
        // Upward gentle buoyant drift
        posArray[i * 3 + 1] += bokehVelocities[i * 3 + 1] * delta;
        // Sway in X and Z
        posArray[i * 3 + 0] += Math.sin(time * 0.8 + i) * 0.003;
        posArray[i * 3 + 2] += Math.cos(time * 0.6 + i) * 0.002;

        // Wrap around when rising past top
        if (posArray[i * 3 + 1] > 6.0) {
          posArray[i * 3 + 1] = -6.0;
        }
      }
      posAttr.needsUpdate = true;

      // React to scroll movement with subtle tilt
      bokehEmbersRef.current.rotation.y = time * 0.02 + p * 0.4;
      bokehEmbersRef.current.position.x = pointerX * 0.2;
    }

    // -----------------------------------------------------------------------
    // D. Animate Tier 4: Celestial Zari Orbit Rings
    // -----------------------------------------------------------------------
    if (celestialRingsRef.current) {
      // Prominent during Heritage Features (p = 0.2 to 0.45)
      const ringVis =
        p >= 0.15 && p <= 0.5
          ? Math.sin(((p - 0.15) / (0.5 - 0.15)) * Math.PI)
          : 0.15;

      celestialRingsRef.current.scale.setScalar(
        THREE.MathUtils.lerp(celestialRingsRef.current.scale.x, ringVis * 1.25, 0.08)
      );
      celestialRingsRef.current.rotation.z = time * 0.3 + p * 2.0;
      celestialRingsRef.current.rotation.x = Math.PI / 4 + Math.sin(time * 0.25) * 0.15;
    }
  });

  return (
    <group>
      {/* ================================================================= */}
      {/* 1. TIER 1: THE FLOWING GOLDEN ZARI SILK STREAM                    */}
      {/* ================================================================= */}
      <points ref={streamPointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[streamPositions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[streamOriginalColors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.14}
          map={glowTexture}
          vertexColors
          transparent
          opacity={0.88}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>

      {/* ================================================================= */}
      {/* 2. TIER 2: AMBIENT CELESTIAL GOLDEN STARDUST                      */}
      {/* ================================================================= */}
      <points ref={ambientPointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[ambientPositions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[ambientColors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.065}
          map={glowTexture}
          vertexColors
          transparent
          opacity={0.75}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>

      {/* ================================================================= */}
      {/* 3. TIER 3: LARGE FLOATING GOLDEN BOKEH EMBERS                     */}
      {/* ================================================================= */}
      <points ref={bokehEmbersRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[bokehPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.42}
          map={glowTexture}
          color="#FFDF79"
          transparent
          opacity={0.65}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>

      {/* ================================================================= */}
      {/* 4. TIER 4: CELESTIAL ZARI ORBIT RINGS                             */}
      {/* ================================================================= */}
      <points ref={celestialRingsRef} scale={[0.1, 0.1, 0.1]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[ringPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.11}
          map={glowTexture}
          color="#FDE68A"
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
    </group>
  );
};
