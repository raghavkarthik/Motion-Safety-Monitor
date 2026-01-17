import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SensorData, RiskLevel } from '@/types/motion';

interface SensorVisualizationProps {
  sensorData: SensorData;
  riskLevel: RiskLevel;
  visible: boolean;
}

// Accelerometer visualization - vibration amplitude
const AccelerometerViz: React.FC<{ 
  data: { x: number; y: number; z: number }; 
  position: [number, number, number];
  riskLevel: RiskLevel;
}> = ({ data, position, riskLevel }) => {
  const groupRef = useRef<THREE.Group>(null);
  const linesRef = useRef<THREE.Line[]>([]);

  const color = useMemo(() => {
    const colors = { safe: '#4ade80', caution: '#fbbf24', danger: '#ef4444' };
    return colors[riskLevel];
  }, [riskLevel]);

  useFrame(() => {
    if (groupRef.current) {
      // Subtle oscillation based on sensor data
      groupRef.current.position.x = position[0] + data.x * 0.1;
      groupRef.current.position.y = position[1] + (data.y - 0.98) * 0.2;
      groupRef.current.position.z = position[2] + data.z * 0.1;
    }
  });

  const magnitude = Math.sqrt(data.x ** 2 + data.y ** 2 + data.z ** 2);

  return (
    <group ref={groupRef} position={position}>
      {/* Central node */}
      <mesh>
        <octahedronGeometry args={[0.03, 0]} />
        <meshBasicMaterial color={color} transparent opacity={0.8} />
      </mesh>

      {/* X axis */}
      <mesh position={[data.x * 0.15, 0, 0]}>
        <boxGeometry args={[Math.abs(data.x) * 0.3, 0.01, 0.01]} />
        <meshBasicMaterial color="#ef4444" transparent opacity={0.6} />
      </mesh>

      {/* Y axis */}
      <mesh position={[0, (data.y - 0.5) * 0.15, 0]}>
        <boxGeometry args={[0.01, Math.abs(data.y) * 0.3, 0.01]} />
        <meshBasicMaterial color="#22c55e" transparent opacity={0.6} />
      </mesh>

      {/* Z axis */}
      <mesh position={[0, 0, data.z * 0.15]}>
        <boxGeometry args={[0.01, 0.01, Math.abs(data.z) * 0.3]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.6} />
      </mesh>

      {/* Magnitude glow */}
      <mesh>
        <sphereGeometry args={[0.05 + magnitude * 0.02, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.2} />
      </mesh>
    </group>
  );
};

// Gyroscope visualization - rotation halos
const GyroscopeViz: React.FC<{ 
  data: { x: number; y: number; z: number }; 
  position: [number, number, number];
  riskLevel: RiskLevel;
}> = ({ data, position, riskLevel }) => {
  const xRingRef = useRef<THREE.Mesh>(null);
  const yRingRef = useRef<THREE.Mesh>(null);
  const zRingRef = useRef<THREE.Mesh>(null);

  const color = useMemo(() => {
    const colors = { safe: '#4ade80', caution: '#fbbf24', danger: '#ef4444' };
    return colors[riskLevel];
  }, [riskLevel]);

  useFrame(() => {
    if (xRingRef.current) {
      xRingRef.current.rotation.x += (data.x * 0.001);
    }
    if (yRingRef.current) {
      yRingRef.current.rotation.y += (data.y * 0.001);
    }
    if (zRingRef.current) {
      zRingRef.current.rotation.z += (data.z * 0.001);
    }
  });

  const intensity = Math.sqrt(data.x ** 2 + data.y ** 2 + data.z ** 2) / 100;

  return (
    <group position={position}>
      {/* X rotation ring */}
      <mesh ref={xRingRef} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.08, 0.005, 8, 32]} />
        <meshBasicMaterial color="#ef4444" transparent opacity={0.4 + Math.abs(data.x) * 0.005} />
      </mesh>

      {/* Y rotation ring */}
      <mesh ref={yRingRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.1, 0.005, 8, 32]} />
        <meshBasicMaterial color="#22c55e" transparent opacity={0.4 + Math.abs(data.y) * 0.005} />
      </mesh>

      {/* Z rotation ring */}
      <mesh ref={zRingRef}>
        <torusGeometry args={[0.12, 0.005, 8, 32]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.4 + Math.abs(data.z) * 0.005} />
      </mesh>

      {/* Intensity glow */}
      <mesh>
        <sphereGeometry args={[0.14, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={intensity * 0.15} />
      </mesh>
    </group>
  );
};

export const SensorVisualization: React.FC<SensorVisualizationProps> = ({
  sensorData,
  riskLevel,
  visible,
}) => {
  if (!visible) return null;

  return (
    <group>
      {/* Accelerometer at hip level */}
      <AccelerometerViz 
        data={sensorData.accelerometer} 
        position={[-0.5, 0.3, 0]} 
        riskLevel={riskLevel}
      />
      
      {/* Gyroscope at chest level */}
      <GyroscopeViz 
        data={sensorData.gyroscope} 
        position={[0.5, 0.5, 0]} 
        riskLevel={riskLevel}
      />

      {/* Floating labels (as 3D text would be complex, using simple indicators) */}
      <group position={[-0.5, 0.5, 0]}>
        <mesh>
          <planeGeometry args={[0.15, 0.04]} />
          <meshBasicMaterial color="#1e293b" transparent opacity={0.8} />
        </mesh>
      </group>
      
      <group position={[0.5, 0.7, 0]}>
        <mesh>
          <planeGeometry args={[0.12, 0.04]} />
          <meshBasicMaterial color="#1e293b" transparent opacity={0.8} />
        </mesh>
      </group>
    </group>
  );
};

export default SensorVisualization;
