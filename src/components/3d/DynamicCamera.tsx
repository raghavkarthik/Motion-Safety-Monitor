import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { CameraMode, ActivityType } from '@/types/motion';

interface DynamicCameraProps {
  mode: CameraMode;
  activity: ActivityType;
  riskLevel: string;
}

export const DynamicCamera: React.FC<DynamicCameraProps> = ({
  mode,
  activity,
  riskLevel,
}) => {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  const targetPosition = useRef(new THREE.Vector3(3, 2, 3));
  const shakeIntensity = useRef(0);

  // Handle camera shake for falls
  useEffect(() => {
    if (activity === 'falling' && riskLevel === 'danger') {
      shakeIntensity.current = 0.1;
    } else {
      shakeIntensity.current = Math.max(0, shakeIntensity.current - 0.005);
    }
  }, [activity, riskLevel]);

  // Set target position based on mode
  useEffect(() => {
    switch (mode) {
      case 'orbit':
        targetPosition.current.set(3, 2, 3);
        break;
      case 'follow':
        targetPosition.current.set(0, 1.5, 3);
        break;
      case 'top-down':
        targetPosition.current.set(0, 5, 0.1);
        break;
      case 'first-person':
        targetPosition.current.set(0, 0.7, 0.2);
        break;
    }
  }, [mode]);

  useFrame(() => {
    // Smooth camera movement
    camera.position.lerp(targetPosition.current, 0.02);

    // Apply shake effect
    if (shakeIntensity.current > 0.01) {
      camera.position.x += (Math.random() - 0.5) * shakeIntensity.current;
      camera.position.y += (Math.random() - 0.5) * shakeIntensity.current;
      camera.position.z += (Math.random() - 0.5) * shakeIntensity.current;
      shakeIntensity.current *= 0.95;
    }

    // Update controls target
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0.5, 0);
      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={mode === 'orbit'}
      enableZoom={true}
      enableRotate={mode === 'orbit'}
      minDistance={1}
      maxDistance={10}
      minPolarAngle={0.1}
      maxPolarAngle={Math.PI / 2}
    />
  );
};

export default DynamicCamera;
