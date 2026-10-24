import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface CinematicCameraRigProps {
  scrollProgress: number; // 0.0 (top) to 1.0 (bottom)
  reducedMotion?: boolean;
}

export const CinematicCameraRig: React.FC<CinematicCameraRigProps> = ({
  scrollProgress,
  reducedMotion = false,
}) => {
  const { camera } = useThree();
  const currentProgress = useRef(scrollProgress);
  const lookTarget = useRef(new THREE.Vector3(0.6, 0, 0));

  useFrame((state, delta) => {
    if (reducedMotion) {
      camera.position.set(0.6, 0.1, 5.4);
      camera.lookAt(0.6, 0, 0);
      return;
    }

    // Smooth scroll interpolation proxy
    const factor = 1 - Math.exp(-4.5 * delta);
    currentProgress.current = THREE.MathUtils.lerp(
      currentProgress.current,
      scrollProgress,
      factor
    );

    const p = Math.min(Math.max(currentProgress.current, 0), 1.0);

    // Multi-Component Cinematic Camera Coordinates:
    // 0.00 - 0.22 (Hero): Right-sided frontal view framing the saree drape
    // 0.22 - 0.42 (Heritage Features): Center panoramic view looking over the 4 celestial trust rings
    // 0.42 - 0.62 (Craft Showcase): Dynamic macro zoom tracking the flying shuttle
    // 0.62 - 0.82 (Product Catalog): Broad pulled-back view framing the saree collection with the horizon wave
    // 0.82 - 1.00 (About & Testimonials): Reverent upward tilt at the ancestral pit loom frame
    let targetX = 0.8;
    let targetY = 0.1;
    let targetZ = 5.4;
    let targetLookX = 0.6;
    let targetLookY = 0.0;
    let targetLookZ = 0.0;

    if (p <= 0.22) {
      const t = p / 0.22;
      targetX = 0.8 - t * 0.8;
      targetY = 0.1 - t * 1.1;
      targetZ = 5.4 - t * 0.4;
      targetLookX = 0.6 - t * 0.6;
      targetLookY = -t * 0.6;
    } else if (p <= 0.42) {
      const t = (p - 0.22) / 0.2;
      targetX = 0.0 + t * 1.6;
      targetY = -1.0 + t * 0.6;
      targetZ = 5.0 - t * 0.9;
      targetLookX = 0.0 + t * 0.7;
      targetLookY = -0.6 + t * 0.4;
    } else if (p <= 0.62) {
      const t = (p - 0.42) / 0.2;
      targetX = 1.6 - t * 1.6;
      targetY = -0.4 - t * 1.6;
      targetZ = 4.1 + t * 2.8;
      targetLookX = 0.7 - t * 0.7;
      targetLookY = -0.2 - t * 1.2;
    } else if (p <= 0.82) {
      const t = (p - 0.62) / 0.2;
      targetX = 0.0 + t * 0.9;
      targetY = -2.0 + t * 0.6;
      targetZ = 6.9 - t * 1.6;
      targetLookX = 0.0 + t * 0.3;
      targetLookY = -1.4 + t * 0.6;
    } else {
      const t = (p - 0.82) / 0.18;
      targetX = 0.9 + t * 0.2;
      targetY = -1.4 + t * 0.3;
      targetZ = 5.3 + t * 0.4;
      targetLookX = 0.3 + t * 0.1;
      targetLookY = -0.8 + t * 0.3;
    }

    // Add velvety interactive cursor parallax
    targetX -= state.pointer.x * 0.15;
    targetY += state.pointer.y * 0.10;

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.05);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.05);

    lookTarget.current.x = THREE.MathUtils.lerp(lookTarget.current.x, targetLookX, 0.05);
    lookTarget.current.y = THREE.MathUtils.lerp(lookTarget.current.y, targetLookY, 0.05);
    lookTarget.current.z = THREE.MathUtils.lerp(lookTarget.current.z, targetLookZ, 0.05);

    camera.lookAt(lookTarget.current);
  });

  return null;
};
