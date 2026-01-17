// Activity types recognized by the ML model
export type ActivityType = 'walking' | 'standing' | 'sitting' | 'lying' | 'falling' | 'idle';

// Risk levels for safety monitoring
export type RiskLevel = 'safe' | 'caution' | 'danger';

// Analysis modes for 3D visualization
export type AnalysisMode = 'motion-biography' | 'baseline-drift' | 'caregiver-alerts' | 'risk-score' | null;

// Sensor data structure
export interface SensorData {
  accelerometer: { x: number; y: number; z: number };
  gyroscope: { x: number; y: number; z: number };
  timestamp: number;
}

// Motion prediction from ML model
export interface MotionPrediction {
  activity: ActivityType;
  confidence: number;
  riskLevel: RiskLevel;
  timestamp: number;
  sensorData: SensorData;
  jointImportance: JointImportance;
}

// Joint importance for explainable AI visualization
export interface JointImportance {
  hip: number;
  leftKnee: number;
  rightKnee: number;
  leftAnkle: number;
  rightAnkle: number;
  spine: number;
  neck: number;
  leftShoulder: number;
  rightShoulder: number;
  leftElbow: number;
  rightElbow: number;
}

// Timeline segment for activity history
export interface TimelineSegment {
  startTime: number;
  endTime: number;
  activity: ActivityType;
  riskLevel: RiskLevel;
  predictions: MotionPrediction[];
}

// Environment types
export type EnvironmentType = 'home' | 'bathroom' | 'stairs' | 'outdoor';

// Camera modes
export type CameraMode = 'orbit' | 'follow' | 'top-down' | 'first-person';

// Application state
export interface VisualizationState {
  isPlaying: boolean;
  currentTime: number;
  playbackSpeed: number;
  cameraMode: CameraMode;
  environment: EnvironmentType;
  showSensorLayers: boolean;
  showExplainableAI: boolean;
  currentPrediction: MotionPrediction | null;
  timeline: TimelineSegment[];
  analysisMode: AnalysisMode;
  motionBiography: MotionBiography | null;
  baselineDrift: BaselineDrift | null;
  caregiverAlerts: CaregiverAlerts | null;
  riskScore: RiskScore | null;
}

// Joint rotation data for avatar animation
export interface JointRotations {
  hipRotation: { x: number; y: number; z: number };
  spineRotation: { x: number; y: number; z: number };
  neckRotation: { x: number; y: number; z: number };
  leftShoulderRotation: { x: number; y: number; z: number };
  rightShoulderRotation: { x: number; y: number; z: number };
  leftElbowRotation: { x: number; y: number; z: number };
  rightElbowRotation: { x: number; y: number; z: number };
  leftHipRotation: { x: number; y: number; z: number };
  rightHipRotation: { x: number; y: number; z: number };
  leftKneeRotation: { x: number; y: number; z: number };
  rightKneeRotation: { x: number; y: number; z: number };
  leftAnkleRotation: { x: number; y: number; z: number };
  rightAnkleRotation: { x: number; y: number; z: number };
}

// Motion biography data
export interface MotionBiography {
  narratives: string[];
  weeklyTrends: {
    walk_change: number;
    near_fall_change: number;
    inactivity_change: number;
  };
}

// Baseline drift data
export interface BaselineDrift {
  drift_score: number;
  drift_level: string;
  alerts: string[];
  current: {
    walk: number;
    transitions: number;
    static: number;
  };
  baseline: {
    walk: number;
    transitions: number;
    static: number;
  };
}

// Caregiver alert types
export type AlertType = 'fall' | 'assistance-needed' | 'medication' | 'bathroom' | 'meal';

// Caregiver alerts data
export interface CaregiverAlerts {
  alerts: {
    type: AlertType;
    message: string;
    timestamp: number;
    severity: 'low' | 'medium' | 'high';
  }[];
}

// Risk score data
export interface RiskScore {
  overall: number;
  components: {
    fall_risk: number;
    mobility_decline: number;
    inactivity_risk: number;
  };
}
