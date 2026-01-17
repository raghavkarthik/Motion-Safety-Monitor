import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ActivityType, RiskLevel, JointImportance, JointRotations } from '@/types/motion';

interface ElderlyAvatarProps {
  jointRotations: JointRotations;
  riskLevel: RiskLevel;
  confidence: number;
  jointImportance: JointImportance;
  showExplainableAI: boolean;
  activity: ActivityType;
}

// Bone dimensions for elderly avatar (slightly hunched proportions)
const BONE_CONFIG = {
  torsoHeight: 0.5,
  hipWidth: 0.35,
  shoulderWidth: 0.45,
  upperArmLength: 0.28,
  lowerArmLength: 0.25,
  upperLegLength: 0.4,
  lowerLegLength: 0.38,
  neckLength: 0.12,
  headRadius: 0.12,
};

// Joint component with glow effect based on importance
const Joint: React.FC<{
  position: [number, number, number];
  importance: number;
  riskLevel: RiskLevel;
  showExplainableAI: boolean;
}> = ({ position, importance, riskLevel, showExplainableAI }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  const color = useMemo(() => {
    if (!showExplainableAI) return '#4ade80';
    const colors = {
      safe: '#4ade80',
      caution: '#fbbf24',
      danger: '#ef4444',
    };
    return colors[riskLevel];
  }, [riskLevel, showExplainableAI]);

  useFrame(() => {
    if (glowRef.current && showExplainableAI) {
      const scale = 1 + importance * 0.5 + Math.sin(Date.now() * 0.003) * 0.1 * importance;
      glowRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.025, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
      </mesh>
      {showExplainableAI && importance > 0.5 && (
        <mesh ref={glowRef}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshBasicMaterial color={color} transparent opacity={importance * 0.4} />
        </mesh>
      )}
    </group>
  );
};

// Bone/limb segment
const Bone: React.FC<{
  start: [number, number, number];
  end: [number, number, number];
  thickness?: number;
  riskLevel: RiskLevel;
}> = ({ start, end, thickness = 0.03, riskLevel }) => {
  const direction = useMemo(() => {
    const dir = new THREE.Vector3(
      end[0] - start[0],
      end[1] - start[1],
      end[2] - start[2]
    );
    return dir;
  }, [start, end]);

  const length = direction.length();
  const midpoint: [number, number, number] = [
    (start[0] + end[0]) / 2,
    (start[1] + end[1]) / 2,
    (start[2] + end[2]) / 2,
  ];

  const quaternion = useMemo(() => {
    const dir = direction.clone().normalize();
    const up = new THREE.Vector3(0, 1, 0);
    const quat = new THREE.Quaternion();
    quat.setFromUnitVectors(up, dir);
    return quat;
  }, [direction]);

  const color = useMemo(() => {
    const colors = {
      safe: '#94a3b8',
      caution: '#fcd34d',
      danger: '#f87171',
    };
    return colors[riskLevel];
  }, [riskLevel]);

  return (
    <mesh position={midpoint} quaternion={quaternion}>
      <capsuleGeometry args={[thickness, length - thickness * 2, 8, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={riskLevel === 'danger' ? color : '#000000'}
        emissiveIntensity={riskLevel === 'danger' ? 0.3 : 0}
        roughness={0.6}
        metalness={0.2}
      />
    </mesh>
  );
};

// Body part meshes
const Torso: React.FC<{ riskLevel: RiskLevel }> = ({ riskLevel }) => {
  const color = riskLevel === 'danger' ? '#f87171' : riskLevel === 'caution' ? '#fcd34d' : '#94a3b8';
  
  return (
    <group>
      {/* Main torso */}
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[0.35, 0.5, 0.2]} />
        <meshStandardMaterial 
          color={color} 
          emissive={riskLevel === 'danger' ? color : '#000000'}
          emissiveIntensity={riskLevel === 'danger' ? 0.2 : 0}
          roughness={0.7} 
        />
      </mesh>
      {/* Slight hunch for elderly posture */}
      <mesh position={[0, 0.45, 0.02]} rotation={[0.15, 0, 0]}>
        <boxGeometry args={[0.32, 0.15, 0.18]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
    </group>
  );
};

const Head: React.FC<{ riskLevel: RiskLevel }> = ({ riskLevel }) => {
  const color = riskLevel === 'danger' ? '#fca5a5' : '#e2e8f0';
  
  return (
    <group position={[0, 0.15, 0]}>
      {/* Head */}
      <mesh>
        <sphereGeometry args={[0.1, 32, 32]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      {/* Hair (white/grey for elderly) */}
      <mesh position={[0, 0.05, 0]}>
        <sphereGeometry args={[0.095, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#d1d5db" roughness={0.9} />
      </mesh>
    </group>
  );
};

export const ElderlyAvatar: React.FC<ElderlyAvatarProps> = ({
  jointRotations,
  riskLevel,
  confidence,
  jointImportance,
  showExplainableAI,
  activity,
}) => {
  const groupRef = useRef<THREE.Group>(null);

  // Calculate vertical offset based on activity
  const verticalOffset = useMemo(() => {
    switch (activity) {
      case 'sitting': return -0.4;
      case 'lying': return -0.8;
      case 'falling': return -0.3;
      default: return 0;
    }
  }, [activity]);

  // Confidence affects overall glow intensity
  const glowIntensity = confidence * 0.3;

  return (
    <group ref={groupRef} position={[0, verticalOffset, 0]}>
      {/* Confidence glow aura */}
      {riskLevel === 'safe' && (
        <mesh position={[0, 0.5, 0]}>
          <sphereGeometry args={[0.8, 32, 32]} />
          <meshBasicMaterial 
            color="#4ade80" 
            transparent 
            opacity={glowIntensity * 0.1} 
            side={THREE.BackSide}
          />
        </mesh>
      )}

      {/* Danger ripple effect */}
      {riskLevel === 'danger' && (
        <group position={[0, 0.5, 0]}>
          {[0, 1, 2].map((i) => (
            <mesh key={i} scale={1 + i * 0.3}>
              <ringGeometry args={[0.4, 0.45, 32]} />
              <meshBasicMaterial 
                color="#ef4444" 
                transparent 
                opacity={0.3 - i * 0.1} 
                side={THREE.DoubleSide}
              />
            </mesh>
          ))}
        </group>
      )}

      {/* Pelvis/Hip group */}
      <group rotation={[jointRotations.hipRotation.x, jointRotations.hipRotation.y, jointRotations.hipRotation.z]}>
        {/* Hip joint */}
        <Joint 
          position={[0, 0, 0]} 
          importance={jointImportance.hip} 
          riskLevel={riskLevel}
          showExplainableAI={showExplainableAI}
        />

        {/* Torso */}
        <group rotation={[jointRotations.spineRotation.x, jointRotations.spineRotation.y, jointRotations.spineRotation.z]}>
          <Torso riskLevel={riskLevel} />
          
          {/* Spine joint */}
          <Joint 
            position={[0, 0.25, 0]} 
            importance={jointImportance.spine} 
            riskLevel={riskLevel}
            showExplainableAI={showExplainableAI}
          />

          {/* Neck and head */}
          <group position={[0, 0.55, 0]} rotation={[jointRotations.neckRotation.x, jointRotations.neckRotation.y, jointRotations.neckRotation.z]}>
            <Joint 
              position={[0, 0, 0]} 
              importance={jointImportance.neck} 
              riskLevel={riskLevel}
              showExplainableAI={showExplainableAI}
            />
            <Bone start={[0, 0, 0]} end={[0, 0.1, 0]} thickness={0.04} riskLevel={riskLevel} />
            <Head riskLevel={riskLevel} />
          </group>

          {/* Left Arm */}
          <group position={[-0.2, 0.45, 0]} rotation={[jointRotations.leftShoulderRotation.x, jointRotations.leftShoulderRotation.y, jointRotations.leftShoulderRotation.z]}>
            <Joint 
              position={[0, 0, 0]} 
              importance={jointImportance.leftShoulder} 
              riskLevel={riskLevel}
              showExplainableAI={showExplainableAI}
            />
            <Bone start={[0, 0, 0]} end={[0, -0.28, 0]} riskLevel={riskLevel} />
            
            {/* Left Elbow and forearm */}
            <group position={[0, -0.28, 0]} rotation={[jointRotations.leftElbowRotation.x, jointRotations.leftElbowRotation.y, jointRotations.leftElbowRotation.z]}>
              <Joint 
                position={[0, 0, 0]} 
                importance={jointImportance.leftElbow} 
                riskLevel={riskLevel}
                showExplainableAI={showExplainableAI}
              />
              <Bone start={[0, 0, 0]} end={[0, -0.25, 0]} thickness={0.025} riskLevel={riskLevel} />
              {/* Hand */}
              <mesh position={[0, -0.27, 0]}>
                <sphereGeometry args={[0.035, 16, 16]} />
                <meshStandardMaterial color="#e2e8f0" roughness={0.8} />
              </mesh>
            </group>
          </group>

          {/* Right Arm */}
          <group position={[0.2, 0.45, 0]} rotation={[jointRotations.rightShoulderRotation.x, jointRotations.rightShoulderRotation.y, jointRotations.rightShoulderRotation.z]}>
            <Joint 
              position={[0, 0, 0]} 
              importance={jointImportance.rightShoulder} 
              riskLevel={riskLevel}
              showExplainableAI={showExplainableAI}
            />
            <Bone start={[0, 0, 0]} end={[0, -0.28, 0]} riskLevel={riskLevel} />
            
            {/* Right Elbow and forearm */}
            <group position={[0, -0.28, 0]} rotation={[jointRotations.rightElbowRotation.x, jointRotations.rightElbowRotation.y, jointRotations.rightElbowRotation.z]}>
              <Joint 
                position={[0, 0, 0]} 
                importance={jointImportance.rightElbow} 
                riskLevel={riskLevel}
                showExplainableAI={showExplainableAI}
              />
              <Bone start={[0, 0, 0]} end={[0, -0.25, 0]} thickness={0.025} riskLevel={riskLevel} />
              {/* Hand */}
              <mesh position={[0, -0.27, 0]}>
                <sphereGeometry args={[0.035, 16, 16]} />
                <meshStandardMaterial color="#e2e8f0" roughness={0.8} />
              </mesh>
            </group>
          </group>
        </group>

        {/* Left Leg */}
        <group position={[-0.1, -0.05, 0]} rotation={[jointRotations.leftHipRotation.x, jointRotations.leftHipRotation.y, jointRotations.leftHipRotation.z]}>
          <Joint 
            position={[0, 0, 0]} 
            importance={jointImportance.hip} 
            riskLevel={riskLevel}
            showExplainableAI={showExplainableAI}
          />
          <Bone start={[0, 0, 0]} end={[0, -0.4, 0]} thickness={0.045} riskLevel={riskLevel} />
          
          {/* Left Knee and lower leg */}
          <group position={[0, -0.4, 0]} rotation={[jointRotations.leftKneeRotation.x, jointRotations.leftKneeRotation.y, jointRotations.leftKneeRotation.z]}>
            <Joint 
              position={[0, 0, 0]} 
              importance={jointImportance.leftKnee} 
              riskLevel={riskLevel}
              showExplainableAI={showExplainableAI}
            />
            <Bone start={[0, 0, 0]} end={[0, -0.38, 0]} thickness={0.035} riskLevel={riskLevel} />
            
            {/* Left Ankle and foot */}
            <group position={[0, -0.38, 0]} rotation={[jointRotations.leftAnkleRotation.x, jointRotations.leftAnkleRotation.y, jointRotations.leftAnkleRotation.z]}>
              <Joint 
                position={[0, 0, 0]} 
                importance={jointImportance.leftAnkle} 
                riskLevel={riskLevel}
                showExplainableAI={showExplainableAI}
              />
              {/* Foot */}
              <mesh position={[0, -0.02, 0.04]}>
                <boxGeometry args={[0.08, 0.04, 0.15]} />
                <meshStandardMaterial color="#475569" roughness={0.8} />
              </mesh>
            </group>
          </group>
        </group>

        {/* Right Leg */}
        <group position={[0.1, -0.05, 0]} rotation={[jointRotations.rightHipRotation.x, jointRotations.rightHipRotation.y, jointRotations.rightHipRotation.z]}>
          <Joint 
            position={[0, 0, 0]} 
            importance={jointImportance.hip} 
            riskLevel={riskLevel}
            showExplainableAI={showExplainableAI}
          />
          <Bone start={[0, 0, 0]} end={[0, -0.4, 0]} thickness={0.045} riskLevel={riskLevel} />
          
          {/* Right Knee and lower leg */}
          <group position={[0, -0.4, 0]} rotation={[jointRotations.rightKneeRotation.x, jointRotations.rightKneeRotation.y, jointRotations.rightKneeRotation.z]}>
            <Joint 
              position={[0, 0, 0]} 
              importance={jointImportance.rightKnee} 
              riskLevel={riskLevel}
              showExplainableAI={showExplainableAI}
            />
            <Bone start={[0, 0, 0]} end={[0, -0.38, 0]} thickness={0.035} riskLevel={riskLevel} />
            
            {/* Right Ankle and foot */}
            <group position={[0, -0.38, 0]} rotation={[jointRotations.rightAnkleRotation.x, jointRotations.rightAnkleRotation.y, jointRotations.rightAnkleRotation.z]}>
              <Joint 
                position={[0, 0, 0]} 
                importance={jointImportance.rightAnkle} 
                riskLevel={riskLevel}
                showExplainableAI={showExplainableAI}
              />
              {/* Foot */}
              <mesh position={[0, -0.02, 0.04]}>
                <boxGeometry args={[0.08, 0.04, 0.15]} />
                <meshStandardMaterial color="#475569" roughness={0.8} />
              </mesh>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
};

export default ElderlyAvatar;
