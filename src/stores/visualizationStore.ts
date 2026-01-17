import { create } from 'zustand';
import { 
  VisualizationState, 
  CameraMode, 
  EnvironmentType, 
  MotionPrediction,
  TimelineSegment,
  AnalysisMode,
  MotionBiography,
  BaselineDrift,
  CaregiverAlerts,
  RiskScore
} from '@/types/motion';
import { 
  generateTimeline, 
  getPredictionAtTime, 
  TOTAL_DURATION,
  generateMotionBiography,
  generateBaselineDrift,
  generateCaregiverAlerts,
  generateRiskScore
} from '@/data/motionSimulator';

interface VisualizationStore extends VisualizationState {
  // Actions
  setPlaying: (isPlaying: boolean) => void;
  togglePlaying: () => void;
  setCurrentTime: (time: number) => void;
  setPlaybackSpeed: (speed: number) => void;
  setCameraMode: (mode: CameraMode) => void;
  setEnvironment: (env: EnvironmentType) => void;
  toggleSensorLayers: () => void;
  toggleExplainableAI: () => void;
  updatePrediction: () => void;
  scrubTo: (time: number) => void;
  setAnalysisMode: (mode: AnalysisMode) => void;
  updateAnalysisData: () => void;
  totalDuration: number;
}

export const useVisualizationStore = create<VisualizationStore>((set, get) => ({
  // Initial state
  isPlaying: true,
  currentTime: 0,
  playbackSpeed: 1,
  cameraMode: 'orbit',
  environment: 'home',
  showSensorLayers: true,
  showExplainableAI: true,
  currentPrediction: getPredictionAtTime(0),
  timeline: generateTimeline(),
  analysisMode: null,
  motionBiography: null,
  baselineDrift: null,
  caregiverAlerts: null,
  riskScore: null,
  totalDuration: TOTAL_DURATION,

  // Actions
  setPlaying: (isPlaying) => set({ isPlaying }),
  
  togglePlaying: () => set((state) => ({ isPlaying: !state.isPlaying })),
  
  setCurrentTime: (time) => set({ currentTime: time % TOTAL_DURATION }),
  
  setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),
  
  setCameraMode: (mode) => set({ cameraMode: mode }),
  
  setEnvironment: (env) => set({ environment: env }),
  
  toggleSensorLayers: () => set((state) => ({ showSensorLayers: !state.showSensorLayers })),
  
  toggleExplainableAI: () => set((state) => ({ showExplainableAI: !state.showExplainableAI })),
  
  updatePrediction: () => {
    const { currentTime } = get();
    set({ currentPrediction: getPredictionAtTime(currentTime) });
  },
  
  scrubTo: (time) => {
    set({ 
      currentTime: time,
      currentPrediction: getPredictionAtTime(time)
    });
  },

  setAnalysisMode: (mode) => {
    set({ analysisMode: mode });
    get().updateAnalysisData();
  },

  updateAnalysisData: () => {
    const { analysisMode, timeline } = get();
    
    if (analysisMode === 'motion-biography') {
      const biography = generateMotionBiography(timeline);
      set({ motionBiography: biography });
    } else if (analysisMode === 'baseline-drift') {
      const drift = generateBaselineDrift(timeline);
      set({ baselineDrift: drift });
    } else if (analysisMode === 'caregiver-alerts') {
      const alerts = generateCaregiverAlerts(timeline);
      set({ caregiverAlerts: alerts });
    } else if (analysisMode === 'risk-score') {
      const score = generateRiskScore(timeline);
      set({ riskScore: score });
    }
  },
}));
