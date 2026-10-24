import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface CinematicCameraRigProps {
  scrollProgress: number;
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

    // Smooth scroll interpolation (smooth dampening proxy)
    const factor = 1 - Math.exp(-4.8 * delta);
    currentProgress.current = THREE.MathUtils.lerp(
      currentProgress.current,
      scrollProgress,
      factor
    );

    const p = currentProgress.current;

    // 1. Calculate Cinematic Camera Coordinates
    // At p = 0 (Hero): [0.8, 0.1, 5.4] (Front perspective framing right side sculpture)
    // At p = 0.5 (Mid scroll): [2.8, -1.0, 3.8] (Dramatic macro crane orbit close to zari weave)
    // At p = 1.0 (End scroll): [-0.4, -2.0, 5.8] (Undercut angle looking up at radiant loom core)
    // At p > 1.2: [0, -2.8, 6.8] (Pull back into cosmic ambient overview)
    const targetX = 0.8 + Math.sin(p * Math.PI) * 2.2 - (p > 0.8 ? (p - 0.8) * 1.8 : 0) - state.pointer.x * 0.35;
    const targetY = 0.1 - p * 1.8 + Math.sin(p * 2.2) * 0.35 + state.pointer.y * 0.25;
    const targetZ = 5.4 - Math.sin(p * Math.PI * 0.85) * 1.5 + p * 0.7;

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.08);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.08);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.08);

    // 2. Smoothly steer lookAt focus point
    const targetLookX = 0.8 - p * 0.9;
    const targetLookY = -p * 0.95;
    const targetLookZ = 0;

    lookTarget.current.x = THREE.MathUtils.lerp(lookTarget.current.x, targetLookX, 0.08);
    lookTarget.current.y = THREE.MathUtils.lerp(lookTarget.current.y, targetLookY, 0.08);
    lookTarget.current.z = THREE.MathUtils.lerp(lookTarget.current.z, targetLookZ, 0.08);

    camera.lookAt(lookTarget.current);
  });

  return null;
};
