import React, { useMemo, useRef } from 'react';
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
    gradient.addColorStop(0.15, 'rgba(255, 235, 160, 0.95)');
    gradient.addColorStop(0.35, 'rgba(230, 185, 70, 0.6)');
    gradient.addColorStop(0.65, 'rgba(190, 130, 25, 0.18)');
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
  const bokehEmbersRef = useRef<THREE.Points>(null);
  const celestialRingsRef = useRef<THREE.Points>(null);
  const coreSplineLinesRef = useRef<THREE.LineSegments>(null);

  const prevScrollRef = useRef(scrollProgress);
  const scrollVelocity = useRef(0);
  const smoothedProgress = useRef(scrollProgress);
  const mouseImpact = useRef({ x: 0, y: 0, velocity: 0 });

  // Reusable radial glow texture for soft circular particles
  const glowTexture = useMemo(() => createGlowTexture(), []);

  // =========================================================================
  // 1. TIER 1: THE FLOWING GOLDEN ZARI SILK STREAM (1,600 PARTICLES)
  // Arranged along a fluid, twisting parametric river of molten gold dust
  // =========================================================================
  const streamCount = 1600;
  const { streamPositions, streamTValues, streamOffsets, streamOriginalColors } = useMemo(() => {
    const pos = new Float32Array(streamCount * 3);
    const tVals = new Float32Array(streamCount);
    const offsets = new Float32Array(streamCount * 3);
    const cols = new Float32Array(streamCount * 3);

    for (let i = 0; i < streamCount; i++) {
      const t = i / streamCount;
      tVals[i] = t;

      // Natural Gaussian-like dispersion around the streamline core
      const radius = Math.pow(Math.random(), 1.6) * 0.75;
      const angle = Math.random() * Math.PI * 2;
      offsets[i * 3 + 0] = Math.cos(angle) * radius;
      offsets[i * 3 + 1] = Math.sin(angle) * radius;
      offsets[i * 3 + 2] = (Math.random() - 0.5) * radius * 1.4;

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
  // 2. TIER 2: LUMINOUS GOLDEN SILK CORE FILAMENTS (SPLINE THREADS)
  // Thin luminous filaments tracing through the stream center like spun zari
  // =========================================================================
  const coreSplineCount = 80;
  const coreSplineGeometry = useMemo(() => {
    const pts: number[] = [];
    for (let i = 0; i < coreSplineCount - 1; i++) {
      pts.push(0, 0, 0);
      pts.push(0, 0, 0);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    return geo;
  }, []);

  // =========================================================================
  // 3. TIER 3: AMBIENT CELESTIAL STARDUST (2,400 PARTICLES)
  // Wide volumetric field of glistening gold glitter specks
  // =========================================================================
  const ambientCount = 2400;
  const { ambientPositions, ambientColors } = useMemo(() => {
    const pos = new Float32Array(ambientCount * 3);
    const cols = new Float32Array(ambientCount * 3);

    for (let i = 0; i < ambientCount; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 18;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12;

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
      ambientColors: cols,
    };
  }, []);

  // =========================================================================
  // 4. TIER 4: SOFT FLOATING GOLDEN BOKEH EMBERS (85 PARTICLES)
  // Large glowing light orbs drifting slowly near the camera lens
  // =========================================================================
  const bokehCount = 85;
  const { bokehPositions, bokehVelocities } = useMemo(() => {
    const pos = new Float32Array(bokehCount * 3);
    const vels = new Float32Array(bokehCount * 3);

    for (let i = 0; i < bokehCount; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 13;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6 + 1.4; // Closer to camera for true bokeh

      vels[i * 3 + 0] = (Math.random() - 0.5) * 0.16;
      vels[i * 3 + 1] = Math.random() * 0.22 + 0.12; // Gentle upward drift
      vels[i * 3 + 2] = (Math.random() - 0.5) * 0.12;
    }
    return { bokehPositions: pos, bokehVelocities: vels };
  }, []);

  // =========================================================================
  // 5. TIER 5: CELESTIAL ZARI ORBIT RINGS (450 PARTICLES)
  // Concentric glowing golden particle halos during Heritage Features
  // =========================================================================
  const ringCount = 450;
  const ringPositions = useMemo(() => {
    const pos = new Float32Array(ringCount * 3);
    for (let i = 0; i < ringCount; i++) {
      const ringIdx = i % 3;
      const radius = 2.1 + ringIdx * 0.85 + (Math.random() - 0.5) * 0.25;
      const angle = (i / ringCount) * Math.PI * 6;
      pos[i * 3 + 0] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = Math.sin(angle) * radius * 0.62;
      pos[i * 3 + 2] = Math.sin(angle * 2) * 0.45;
    }
    return pos;
  }, []);

  // =========================================================================
  // FRAME ANIMATION: SCROLL VELOCITY, INERTIA, SPUN YARN & PARALLAX
  // =========================================================================
  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // 1. Calculate scroll impulse & velocity
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

    // Mouse pointer interactive tracking with velocity
    const pointerX = state.pointer.x * 0.65;
    const pointerY = state.pointer.y * 0.45;
    mouseImpact.current.x = THREE.MathUtils.lerp(mouseImpact.current.x, pointerX, 0.08);
    mouseImpact.current.y = THREE.MathUtils.lerp(mouseImpact.current.y, pointerY, 0.08);

    // -----------------------------------------------------------------------
    // A. Animate Tier 1: The Golden Zari Silk Stream & Core Filaments
    // -----------------------------------------------------------------------
    const splinePoints: THREE.Vector3[] = [];

    if (streamPointsRef.current) {
      const geo = streamPointsRef.current.geometry;
      const posAttr = geo.attributes.position as THREE.BufferAttribute;
      const positions = posAttr.array as Float32Array;

      // Base stream flow speed + velocity burst on scroll
      const flowRate = (reducedMotion ? 0.03 : 0.09) + Math.abs(v) * 0.45;

      for (let i = 0; i < streamCount; i++) {
        let t = (streamTValues[i] + time * flowRate + p * 0.65) % 1.0;
        if (t < 0) t += 1.0;

        const offX = streamOffsets[i * 3 + 0];
        const offY = streamOffsets[i * 3 + 1];
        const offZ = streamOffsets[i * 3 + 2];

        let cx = 0;
        let cy = 0;
        let cz = 0;

        if (p <= 0.25) {
          // Hero Section: Majestic S-curve waterfall cascading down the right flank
          const angle = t * Math.PI * 2.2;
          cx = 1.6 + Math.sin(angle) * 1.45 + Math.cos(angle * 2) * 0.38;
          cy = (0.5 - t) * 6.8 + Math.sin(angle + time * 0.8) * 0.42;
          cz = Math.cos(angle) * 1.55 + Math.sin(angle * 3) * 0.32;
        } else if (p <= 0.5) {
          // Heritage Features (2nd Component): Unfurling into an expanded golden halo
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
          // Craft Showcase (3rd Component): Linear horizontal weaving warp filaments
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
          // Product Catalog & About (4th & 5th Components): Ascending golden double-helix
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

        // Interactive mouse pointer magnetic repulsion / deflection
        const dx = cx - mouseImpact.current.x;
        const dy = cy - mouseImpact.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const deflection = Math.max(0, 1.3 - dist) * 0.4;

        positions[i * 3 + 0] = cx + offX + (dx / (dist + 0.01)) * deflection;
        positions[i * 3 + 1] = cy + offY + (dy / (dist + 0.01)) * deflection;
        positions[i * 3 + 2] = cz + offZ;

        // Collect spine points for the core spline line segments
        if (i % Math.floor(streamCount / coreSplineCount) === 0 && splinePoints.length < coreSplineCount) {
          splinePoints.push(new THREE.Vector3(cx, cy, cz));
        }
      }

      posAttr.needsUpdate = true;
    }

    // Update Core Spline Line Segments
    if (coreSplineLinesRef.current && splinePoints.length > 1) {
      const posAttr = coreSplineLinesRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const arr = posAttr.array as Float32Array;
      let idx = 0;
      for (let i = 0; i < splinePoints.length - 1; i++) {
        arr[idx++] = splinePoints[i].x;
        arr[idx++] = splinePoints[i].y;
        arr[idx++] = splinePoints[i].z;
        arr[idx++] = splinePoints[i + 1].x;
        arr[idx++] = splinePoints[i + 1].y;
        arr[idx++] = splinePoints[i + 1].z;
      }
      posAttr.needsUpdate = true;
    }

    // -----------------------------------------------------------------------
    // B. Animate Tier 3: Ambient Celestial Stardust
    // -----------------------------------------------------------------------
    if (ambientPointsRef.current) {
      ambientPointsRef.current.rotation.y = time * 0.035 + p * 0.85 + v * 0.12;
      ambientPointsRef.current.rotation.x = Math.sin(time * 0.02) * 0.08 + p * 0.35;
      ambientPointsRef.current.position.y = -p * 1.6;

      const mat = ambientPointsRef.current.material as THREE.PointsMaterial;
      if (mat) {
        mat.opacity = 0.78 + Math.sin(time * 1.6) * 0.14;
      }
    }

    // -----------------------------------------------------------------------
    // C. Animate Tier 4: Soft Floating Golden Bokeh Embers
    // -----------------------------------------------------------------------
    if (bokehEmbersRef.current) {
      const geo = bokehEmbersRef.current.geometry;
      const posAttr = geo.attributes.position as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;

      for (let i = 0; i < bokehCount; i++) {
        posArray[i * 3 + 1] += bokehVelocities[i * 3 + 1] * delta;
        posArray[i * 3 + 0] += Math.sin(time * 0.75 + i) * 0.0035;
        posArray[i * 3 + 2] += Math.cos(time * 0.55 + i) * 0.0025;

        // Wrap around when rising past upper boundary
        if (posArray[i * 3 + 1] > 6.5) {
          posArray[i * 3 + 1] = -6.5;
        }
      }
      posAttr.needsUpdate = true;

      bokehEmbersRef.current.rotation.y = time * 0.025 + p * 0.45;
      bokehEmbersRef.current.position.x = mouseImpact.current.x * 0.22;
    }

    // -----------------------------------------------------------------------
    // D. Animate Tier 5: Celestial Zari Orbit Rings
    // -----------------------------------------------------------------------
    if (celestialRingsRef.current) {
      const ringVis =
        p >= 0.15 && p <= 0.52
          ? Math.sin(((p - 0.15) / (0.52 - 0.15)) * Math.PI)
          : 0.16;

      celestialRingsRef.current.scale.setScalar(
        THREE.MathUtils.lerp(celestialRingsRef.current.scale.x, ringVis * 1.28, 0.08)
      );
      celestialRingsRef.current.rotation.z = time * 0.32 + p * 2.2;
      celestialRingsRef.current.rotation.x = Math.PI / 4 + Math.sin(time * 0.28) * 0.16;
    }
  });

  return (
    <group>
      {/* ================================================================= */}
      {/* 1. TIER 1: THE FLOWING GOLDEN ZARI SILK STREAM                    */}
      {/* ================================================================= */}
      <points ref={streamPointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[streamPositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[streamOriginalColors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.15}
          map={glowTexture}
          vertexColors
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>

      {/* ================================================================= */}
      {/* 2. TIER 2: LUMINOUS GOLDEN SILK CORE FILAMENTS (SPLINE THREADS)   */}
      {/* ================================================================= */}
      <lineSegments ref={coreSplineLinesRef} geometry={coreSplineGeometry}>
        <lineBasicMaterial
          color="#FFDF79"
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          linewidth={1}
        />
      </lineSegments>

      {/* ================================================================= */}
      {/* 3. TIER 3: AMBIENT CELESTIAL GOLDEN STARDUST                      */}
      {/* ================================================================= */}
      <points ref={ambientPointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[ambientPositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[ambientColors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.065}
          map={glowTexture}
          vertexColors
          transparent
          opacity={0.78}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>

      {/* ================================================================= */}
      {/* 4. TIER 4: LARGE FLOATING GOLDEN BOKEH EMBERS                     */}
      {/* ================================================================= */}
      <points ref={bokehEmbersRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[bokehPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.45}
          map={glowTexture}
          color="#FFDF79"
          transparent
          opacity={0.68}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>

      {/* ================================================================= */}
      {/* 5. TIER 5: CELESTIAL ZARI ORBIT RINGS                             */}
      {/* ================================================================= */}
      <points ref={celestialRingsRef} scale={[0.1, 0.1, 0.1]}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[ringPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.12}
          map={glowTexture}
          color="#FDE68A"
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
