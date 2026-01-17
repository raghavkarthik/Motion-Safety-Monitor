import React, { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment as DreiEnvironment } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { useVisualizationStore } from '@/stores/visualizationStore';
import { getJointRotations, getCurrentActivity } from '@/data/motionSimulator';
import ElderlyAvatar from './ElderlyAvatar';
import SensorVisualization from './SensorVisualization';
import Environment from './Environment';
import TimelineRibbon from './TimelineRibbon';
import DynamicCamera from './DynamicCamera';

const SceneContent: React.FC = () => {
  const {
    currentTime,
    isPlaying,
    playbackSpeed,
    cameraMode,
    environment,
    showSensorLayers,
    showExplainableAI,
    currentPrediction,
    timeline,
    totalDuration,
    setCurrentTime,
    updatePrediction,
    scrubTo,
  } = useVisualizationStore();

  // Animation loop
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentTime(currentTime + 16 * playbackSpeed);
      updatePrediction();
    }, 16);

    return () => clearInterval(interval);
  }, [isPlaying, currentTime, playbackSpeed, setCurrentTime, updatePrediction]);

  const { activity, progress } = getCurrentActivity(currentTime);
  const jointRotations = getJointRotations(activity, currentTime, progress);

  if (!currentPrediction) return null;

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[5, 10, 5]} 
        intensity={1} 
        castShadow 
        shadow-mapSize={[2048, 2048]}
      />
      <pointLight position={[-5, 5, -5]} intensity={0.5} color="#22d3ee" />
      <pointLight position={[5, 3, 5]} intensity={0.3} color="#4ade80" />
      
      {/* Risk-based accent light */}
      {currentPrediction.riskLevel === 'danger' && (
        <pointLight position={[0, 2, 0]} intensity={1} color="#ef4444" />
      )}
      {currentPrediction.riskLevel === 'caution' && (
        <pointLight position={[0, 2, 0]} intensity={0.5} color="#fbbf24" />
      )}

      {/* Dynamic camera */}
      <DynamicCamera 
        mode={cameraMode} 
        activity={activity}
        riskLevel={currentPrediction.riskLevel}
      />

      {/* Environment */}
      <Environment type={environment} />

      {/* Main avatar */}
      <ElderlyAvatar
        jointRotations={jointRotations}
        riskLevel={currentPrediction.riskLevel}
        confidence={currentPrediction.confidence}
        jointImportance={currentPrediction.jointImportance}
        showExplainableAI={showExplainableAI}
        activity={activity}
      />

      {/* Sensor visualization */}
      <SensorVisualization
        sensorData={currentPrediction.sensorData}
        riskLevel={currentPrediction.riskLevel}
        visible={showSensorLayers}
      />

      {/* 3D Timeline */}
      <TimelineRibbon
        segments={timeline}
        currentTime={currentTime}
        totalDuration={totalDuration}
        onScrub={scrubTo}
      />

      {/* Post-processing effects */}
      <EffectComposer>
        <Bloom 
          luminanceThreshold={0.2} 
          luminanceSmoothing={0.9} 
          intensity={0.8}
        />
        <Vignette darkness={0.5} offset={0.3} />
      </EffectComposer>

      {/* Environment map for reflections */}
      <DreiEnvironment preset="night" />
    </>
  );
};

// Loading fallback
const LoadingFallback: React.FC = () => {
  return (
    <mesh>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="#22d3ee" wireframe />
    </mesh>
  );
};

export const MotionScene: React.FC = () => {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [3, 2, 3], fov: 50 }}
        shadows
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: 'high-performance'
        }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#0a0f1a']} />
        <fog attach="fog" args={['#0a0f1a', 5, 15]} />
        
        <Suspense fallback={<LoadingFallback />}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default MotionScene;
