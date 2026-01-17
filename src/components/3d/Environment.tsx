import React, { useMemo } from 'react';
import { EnvironmentType } from '@/types/motion';
import * as THREE from 'three';

interface EnvironmentProps {
  type: EnvironmentType;
}

const GridFloor: React.FC<{ color: string }> = ({ color }) => {
  return (
    <group>
      {/* Main floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.85, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial 
          color="#0f172a" 
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>
      
      {/* Grid lines */}
      <gridHelper 
        args={[20, 40, color, color]} 
        position={[0, -0.84, 0]}
      />
      
      {/* Center circle indicator */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.83, 0]}>
        <ringGeometry args={[1.5, 1.55, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} />
      </mesh>
      
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.83, 0]}>
        <ringGeometry args={[0.5, 0.55, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.5} />
      </mesh>
    </group>
  );
};

const HomeEnvironment: React.FC = () => {
  return (
    <group>
      <GridFloor color="#22d3ee" />
      
      {/* Furniture hints */}
      {/* Sofa outline */}
      <mesh position={[-2, -0.4, 0]}>
        <boxGeometry args={[1.5, 0.5, 0.6]} />
        <meshStandardMaterial color="#1e293b" transparent opacity={0.3} wireframe />
      </mesh>
      
      {/* Table outline */}
      <mesh position={[2, -0.5, 0]}>
        <boxGeometry args={[0.8, 0.7, 0.8]} />
        <meshStandardMaterial color="#1e293b" transparent opacity={0.3} wireframe />
      </mesh>
    </group>
  );
};

const BathroomEnvironment: React.FC = () => {
  return (
    <group>
      <GridFloor color="#60a5fa" />
      
      {/* Bathtub outline */}
      <mesh position={[-2, -0.3, 0]}>
        <boxGeometry args={[1.8, 0.6, 0.8]} />
        <meshStandardMaterial color="#334155" transparent opacity={0.4} wireframe />
      </mesh>
      
      {/* Sink area */}
      <mesh position={[2, -0.2, 0]}>
        <boxGeometry args={[0.6, 0.8, 0.5]} />
        <meshStandardMaterial color="#334155" transparent opacity={0.4} wireframe />
      </mesh>
      
      {/* Wet floor indicator */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.82, 0]}>
        <circleGeometry args={[0.8, 32]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.15} />
      </mesh>
    </group>
  );
};

const StairsEnvironment: React.FC = () => {
  const steps = useMemo(() => {
    const stepsArray = [];
    for (let i = 0; i < 8; i++) {
      stepsArray.push(
        <mesh key={i} position={[-2 + i * 0.5, -0.85 + i * 0.15, 0]}>
          <boxGeometry args={[0.45, 0.02, 1]} />
          <meshStandardMaterial 
            color="#475569" 
            transparent 
            opacity={0.6} 
          />
        </mesh>
      );
    }
    return stepsArray;
  }, []);

  return (
    <group>
      <GridFloor color="#fbbf24" />
      {steps}
      
      {/* Handrail */}
      <mesh position={[0, -0.2, 0.6]} rotation={[0, 0, -0.3]}>
        <cylinderGeometry args={[0.02, 0.02, 4]} />
        <meshStandardMaterial color="#94a3b8" transparent opacity={0.5} />
      </mesh>
    </group>
  );
};

const OutdoorEnvironment: React.FC = () => {
  return (
    <group>
      <GridFloor color="#4ade80" />
      
      {/* Pavement texture suggestion */}
      {[-3, -1.5, 0, 1.5, 3].map((x, i) => (
        <mesh 
          key={i} 
          rotation={[-Math.PI / 2, 0, 0]} 
          position={[x, -0.84, 0]}
        >
          <planeGeometry args={[1.4, 8]} />
          <meshStandardMaterial 
            color="#374151" 
            transparent 
            opacity={0.3} 
          />
        </mesh>
      ))}
      
      {/* Curb indicator */}
      <mesh position={[4, -0.75, 0]}>
        <boxGeometry args={[0.2, 0.15, 8]} />
        <meshStandardMaterial color="#6b7280" transparent opacity={0.5} />
      </mesh>
    </group>
  );
};

export const Environment: React.FC<EnvironmentProps> = ({ type }) => {
  const environments: Record<EnvironmentType, React.ReactNode> = {
    home: <HomeEnvironment />,
    bathroom: <BathroomEnvironment />,
    stairs: <StairsEnvironment />,
    outdoor: <OutdoorEnvironment />,
  };

  return (
    <group>
      {/* Ambient particles */}
      {Array.from({ length: 50 }).map((_, i) => (
        <mesh 
          key={i}
          position={[
            (Math.random() - 0.5) * 10,
            Math.random() * 3,
            (Math.random() - 0.5) * 10
          ]}
        >
          <sphereGeometry args={[0.01, 8, 8]} />
          <meshBasicMaterial color="#22d3ee" transparent opacity={0.3} />
        </mesh>
      ))}
      
      {environments[type]}
    </group>
  );
};

export default Environment;
