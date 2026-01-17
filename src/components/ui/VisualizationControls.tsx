import React from 'react';
import { motion } from 'framer-motion';
import { 
  Eye, 
  EyeOff, 
  Brain, 
  Waves, 
  Camera, 
  Home, 
  Bath,
  Mountain,
  TreePine
} from 'lucide-react';
import { useVisualizationStore } from '@/stores/visualizationStore';
import { CameraMode, EnvironmentType } from '@/types/motion';
import { cn } from '@/lib/utils';

const cameraIcons: Record<CameraMode, React.ReactNode> = {
  orbit: <Camera className="w-4 h-4" />,
  follow: <Eye className="w-4 h-4" />,
  'top-down': <Mountain className="w-4 h-4" />,
  'first-person': <Brain className="w-4 h-4" />,
};

const environmentIcons: Record<EnvironmentType, React.ReactNode> = {
  home: <Home className="w-4 h-4" />,
  bathroom: <Bath className="w-4 h-4" />,
  stairs: <Mountain className="w-4 h-4" />,
  outdoor: <TreePine className="w-4 h-4" />,
};

export const VisualizationControls: React.FC = () => {
  const {
    showSensorLayers,
    showExplainableAI,
    cameraMode,
    environment,
    toggleSensorLayers,
    toggleExplainableAI,
    setCameraMode,
    setEnvironment,
  } = useVisualizationStore();

  const cameraModes: CameraMode[] = ['orbit', 'follow', 'top-down', 'first-person'];
  const environments: EnvironmentType[] = ['home', 'bathroom', 'stairs', 'outdoor'];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex flex-col gap-3"
    >
      {/* Toggle controls */}
      <div className="glass-panel rounded-xl p-4">
        <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-3">
          Layers
        </span>
        
        <div className="flex flex-col gap-2">
          <button
            onClick={toggleSensorLayers}
            className={cn(
              "flex items-center gap-3 p-2 rounded-lg transition-all",
              showSensorLayers 
                ? "bg-primary/20 text-primary" 
                : "text-muted-foreground hover:bg-secondary/50"
            )}
          >
            <Waves className="w-4 h-4" />
            <span className="text-sm">Sensors</span>
            {showSensorLayers ? (
              <Eye className="w-3 h-3 ml-auto" />
            ) : (
              <EyeOff className="w-3 h-3 ml-auto" />
            )}
          </button>
          
          <button
            onClick={toggleExplainableAI}
            className={cn(
              "flex items-center gap-3 p-2 rounded-lg transition-all",
              showExplainableAI 
                ? "bg-primary/20 text-primary" 
                : "text-muted-foreground hover:bg-secondary/50"
            )}
          >
            <Brain className="w-4 h-4" />
            <span className="text-sm">XAI</span>
            {showExplainableAI ? (
              <Eye className="w-3 h-3 ml-auto" />
            ) : (
              <EyeOff className="w-3 h-3 ml-auto" />
            )}
          </button>
        </div>
      </div>

      {/* Camera modes */}
      <div className="glass-panel rounded-xl p-4">
        <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-3">
          Camera
        </span>
        
        <div className="grid grid-cols-2 gap-2">
          {cameraModes.map((mode) => (
            <button
              key={mode}
              onClick={() => setCameraMode(mode)}
              className={cn(
                "flex items-center gap-2 p-2 rounded-lg text-xs transition-all",
                cameraMode === mode
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              )}
            >
              {cameraIcons[mode]}
              <span className="capitalize">{mode.replace('-', ' ')}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Environment selection */}
      <div className="glass-panel rounded-xl p-4">
        <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-3">
          Environment
        </span>
        
        <div className="grid grid-cols-2 gap-2">
          {environments.map((env) => (
            <button
              key={env}
              onClick={() => setEnvironment(env)}
              className={cn(
                "flex items-center gap-2 p-2 rounded-lg text-xs transition-all",
                environment === env
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              )}
            >
              {environmentIcons[env]}
              <span className="capitalize">{env}</span>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default VisualizationControls;
