import React, { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TimelineSegment, RiskLevel } from '@/types/motion';

interface TimelineRibbonProps {
  segments: TimelineSegment[];
  currentTime: number;
  totalDuration: number;
  onScrub: (time: number) => void;
}

const getSegmentColor = (riskLevel: RiskLevel): string => {
  const colors = {
    safe: '#4ade80',
    caution: '#fbbf24',
    danger: '#ef4444',
  };
  return colors[riskLevel];
};

export const TimelineRibbon: React.FC<TimelineRibbonProps> = ({
  segments,
  currentTime,
  totalDuration,
}) => {
  const ribbonRef = React.useRef<THREE.Group>(null);

  // Create ribbon geometry from segments
  const ribbonSegments = useMemo(() => {
    const segmentMeshes: { position: number; width: number; color: string }[] = [];
    
    segments.forEach((segment) => {
      const startPos = (segment.startTime / totalDuration) * 6 - 3;
      const width = ((segment.endTime - segment.startTime) / totalDuration) * 6;
      
      segmentMeshes.push({
        position: startPos + width / 2,
        width,
        color: getSegmentColor(segment.riskLevel),
      });
    });
    
    return segmentMeshes;
  }, [segments, totalDuration]);

  // Current position marker
  const markerPosition = useMemo(() => {
    return (currentTime / totalDuration) * 6 - 3;
  }, [currentTime, totalDuration]);

  useFrame(() => {
    if (ribbonRef.current) {
      // Subtle floating animation
      ribbonRef.current.position.y = -0.5 + Math.sin(Date.now() * 0.001) * 0.02;
    }
  });

  return (
    <group ref={ribbonRef} position={[0, -0.5, -2]} rotation={[0.3, 0, 0]}>
      {/* Background ribbon */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[6.2, 0.02, 0.15]} />
        <meshStandardMaterial 
          color="#1e293b" 
          transparent 
          opacity={0.8}
          roughness={0.5}
        />
      </mesh>

      {/* Segment colors */}
      {ribbonSegments.map((seg, i) => (
        <mesh key={i} position={[seg.position, 0.01, 0]}>
          <boxGeometry args={[seg.width - 0.02, 0.025, 0.12]} />
          <meshStandardMaterial 
            color={seg.color}
            emissive={seg.color}
            emissiveIntensity={0.3}
            transparent 
            opacity={0.9}
          />
        </mesh>
      ))}

      {/* Current position marker */}
      <group position={[markerPosition, 0.05, 0]}>
        {/* Vertical line */}
        <mesh>
          <boxGeometry args={[0.02, 0.15, 0.02]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        
        {/* Glow */}
        <mesh>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshBasicMaterial color="#22d3ee" transparent opacity={0.6} />
        </mesh>
        
        {/* Outer glow */}
        <mesh>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color="#22d3ee" transparent opacity={0.2} />
        </mesh>
      </group>

      {/* Timeline ticks */}
      {Array.from({ length: 11 }).map((_, i) => (
        <mesh key={i} position={[-3 + i * 0.6, -0.01, 0.1]}>
          <boxGeometry args={[0.01, 0.01, 0.03]} />
          <meshBasicMaterial color="#64748b" />
        </mesh>
      ))}
    </group>
  );
};

export default TimelineRibbon;
