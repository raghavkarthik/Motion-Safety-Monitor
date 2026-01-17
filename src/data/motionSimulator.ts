import { 
  ActivityType, 
  MotionPrediction, 
  SensorData, 
  TimelineSegment, 
  RiskLevel,
  JointImportance,
  JointRotations,
  MotionBiography,
  BaselineDrift,
  CaregiverAlerts,
  RiskScore,
  AlertType
} from '@/types/motion';

// Simulate realistic elderly motion data
const activitySequence: { activity: ActivityType; duration: number; riskLevel: RiskLevel }[] = [
  { activity: 'standing', duration: 3000, riskLevel: 'safe' },
  { activity: 'walking', duration: 5000, riskLevel: 'safe' },
  { activity: 'walking', duration: 2000, riskLevel: 'caution' },
  { activity: 'standing', duration: 2000, riskLevel: 'safe' },
  { activity: 'sitting', duration: 4000, riskLevel: 'safe' },
  { activity: 'standing', duration: 2000, riskLevel: 'caution' },
  { activity: 'walking', duration: 3000, riskLevel: 'safe' },
  { activity: 'falling', duration: 1500, riskLevel: 'danger' },
  { activity: 'lying', duration: 3000, riskLevel: 'caution' },
  { activity: 'sitting', duration: 2000, riskLevel: 'safe' },
  { activity: 'standing', duration: 2000, riskLevel: 'safe' },
  { activity: 'walking', duration: 4000, riskLevel: 'safe' },
];

const totalDuration = activitySequence.reduce((acc, seg) => acc + seg.duration, 0);

// Generate sensor data based on activity
function generateSensorData(activity: ActivityType, t: number): SensorData {
  const noise = () => (Math.random() - 0.5) * 0.1;
  
  const patterns: Record<ActivityType, () => SensorData> = {
    walking: () => ({
      accelerometer: {
        x: Math.sin(t * 8) * 0.3 + noise(),
        y: Math.abs(Math.sin(t * 8)) * 0.5 + 0.98 + noise(),
        z: Math.cos(t * 8) * 0.2 + noise(),
      },
      gyroscope: {
        x: Math.sin(t * 4) * 15 + noise() * 5,
        y: Math.cos(t * 8) * 10 + noise() * 5,
        z: Math.sin(t * 6) * 8 + noise() * 5,
      },
      timestamp: t,
    }),
    standing: () => ({
      accelerometer: {
        x: noise() * 0.05,
        y: 0.98 + noise() * 0.02,
        z: noise() * 0.05,
      },
      gyroscope: {
        x: noise() * 2,
        y: noise() * 2,
        z: noise() * 2,
      },
      timestamp: t,
    }),
    sitting: () => ({
      accelerometer: {
        x: noise() * 0.03,
        y: 0.85 + noise() * 0.02,
        z: noise() * 0.03,
      },
      gyroscope: {
        x: noise() * 1.5,
        y: noise() * 1.5,
        z: noise() * 1.5,
      },
      timestamp: t,
    }),
    lying: () => ({
      accelerometer: {
        x: 0.95 + noise() * 0.02,
        y: noise() * 0.05,
        z: noise() * 0.05,
      },
      gyroscope: {
        x: noise() * 1,
        y: noise() * 1,
        z: noise() * 1,
      },
      timestamp: t,
    }),
    falling: () => ({
      accelerometer: {
        x: Math.sin(t * 20) * 2 + noise(),
        y: -0.5 + Math.random() * 3,
        z: Math.cos(t * 20) * 1.5 + noise(),
      },
      gyroscope: {
        x: Math.random() * 180 - 90,
        y: Math.random() * 180 - 90,
        z: Math.random() * 180 - 90,
      },
      timestamp: t,
    }),
    idle: () => ({
      accelerometer: { x: 0, y: 0.98, z: 0 },
      gyroscope: { x: 0, y: 0, z: 0 },
      timestamp: t,
    }),
  };

  return patterns[activity]();
}

// Generate joint importance for explainable AI
function generateJointImportance(activity: ActivityType): JointImportance {
  const base = () => Math.random() * 0.3;
  
  const patterns: Record<ActivityType, () => JointImportance> = {
    walking: () => ({
      hip: 0.9 + base() * 0.1,
      leftKnee: 0.85 + base() * 0.15,
      rightKnee: 0.85 + base() * 0.15,
      leftAnkle: 0.7 + base() * 0.2,
      rightAnkle: 0.7 + base() * 0.2,
      spine: 0.5 + base() * 0.2,
      neck: 0.3 + base() * 0.2,
      leftShoulder: 0.4 + base() * 0.2,
      rightShoulder: 0.4 + base() * 0.2,
      leftElbow: 0.3 + base() * 0.2,
      rightElbow: 0.3 + base() * 0.2,
    }),
    standing: () => ({
      hip: 0.7 + base() * 0.2,
      leftKnee: 0.5 + base() * 0.2,
      rightKnee: 0.5 + base() * 0.2,
      leftAnkle: 0.6 + base() * 0.2,
      rightAnkle: 0.6 + base() * 0.2,
      spine: 0.8 + base() * 0.15,
      neck: 0.4 + base() * 0.2,
      leftShoulder: 0.3 + base() * 0.2,
      rightShoulder: 0.3 + base() * 0.2,
      leftElbow: 0.2 + base() * 0.2,
      rightElbow: 0.2 + base() * 0.2,
    }),
    sitting: () => ({
      hip: 0.95 + base() * 0.05,
      leftKnee: 0.8 + base() * 0.15,
      rightKnee: 0.8 + base() * 0.15,
      leftAnkle: 0.3 + base() * 0.2,
      rightAnkle: 0.3 + base() * 0.2,
      spine: 0.7 + base() * 0.2,
      neck: 0.5 + base() * 0.2,
      leftShoulder: 0.4 + base() * 0.2,
      rightShoulder: 0.4 + base() * 0.2,
      leftElbow: 0.3 + base() * 0.2,
      rightElbow: 0.3 + base() * 0.2,
    }),
    lying: () => ({
      hip: 0.6 + base() * 0.2,
      leftKnee: 0.4 + base() * 0.2,
      rightKnee: 0.4 + base() * 0.2,
      leftAnkle: 0.3 + base() * 0.2,
      rightAnkle: 0.3 + base() * 0.2,
      spine: 0.9 + base() * 0.1,
      neck: 0.7 + base() * 0.2,
      leftShoulder: 0.5 + base() * 0.2,
      rightShoulder: 0.5 + base() * 0.2,
      leftElbow: 0.4 + base() * 0.2,
      rightElbow: 0.4 + base() * 0.2,
    }),
    falling: () => ({
      hip: 0.95 + base() * 0.05,
      leftKnee: 0.9 + base() * 0.1,
      rightKnee: 0.9 + base() * 0.1,
      leftAnkle: 0.85 + base() * 0.15,
      rightAnkle: 0.85 + base() * 0.15,
      spine: 0.98,
      neck: 0.8 + base() * 0.15,
      leftShoulder: 0.7 + base() * 0.2,
      rightShoulder: 0.7 + base() * 0.2,
      leftElbow: 0.6 + base() * 0.2,
      rightElbow: 0.6 + base() * 0.2,
    }),
    idle: () => ({
      hip: 0.3 + base() * 0.2,
      leftKnee: 0.2 + base() * 0.2,
      rightKnee: 0.2 + base() * 0.2,
      leftAnkle: 0.2 + base() * 0.2,
      rightAnkle: 0.2 + base() * 0.2,
      spine: 0.4 + base() * 0.2,
      neck: 0.3 + base() * 0.2,
      leftShoulder: 0.2 + base() * 0.2,
      rightShoulder: 0.2 + base() * 0.2,
      leftElbow: 0.1 + base() * 0.2,
      rightElbow: 0.1 + base() * 0.2,
    }),
  };

  return patterns[activity]();
}

// Get current activity at a given time
export function getCurrentActivity(time: number): { activity: ActivityType; riskLevel: RiskLevel; progress: number } {
  let elapsed = 0;
  const normalizedTime = time % totalDuration;
  
  for (const segment of activitySequence) {
    if (normalizedTime < elapsed + segment.duration) {
      const progress = (normalizedTime - elapsed) / segment.duration;
      return { activity: segment.activity, riskLevel: segment.riskLevel, progress };
    }
    elapsed += segment.duration;
  }
  
  return { activity: 'idle', riskLevel: 'safe', progress: 0 };
}

// Generate motion prediction at a given time
export function getPredictionAtTime(time: number): MotionPrediction {
  const { activity, riskLevel } = getCurrentActivity(time);
  const t = time / 1000;
  
  return {
    activity,
    confidence: activity === 'falling' ? 0.95 : 0.75 + Math.random() * 0.2,
    riskLevel,
    timestamp: time,
    sensorData: generateSensorData(activity, t),
    jointImportance: generateJointImportance(activity),
  };
}

// Generate timeline segments
export function generateTimeline(): TimelineSegment[] {
  let elapsed = 0;
  
  return activitySequence.map((seg) => {
    const segment: TimelineSegment = {
      startTime: elapsed,
      endTime: elapsed + seg.duration,
      activity: seg.activity,
      riskLevel: seg.riskLevel,
      predictions: [],
    };
    elapsed += seg.duration;
    return segment;
  });
}

// Get joint rotations for avatar animation
export function getJointRotations(activity: ActivityType, time: number, progress: number): JointRotations {
  const t = time / 1000;
  const walkCycle = Math.sin(t * 6);
  const walkCycleOffset = Math.sin(t * 6 + Math.PI);
  
  const baseRotation = { x: 0, y: 0, z: 0 };
  
  const animations: Record<ActivityType, () => JointRotations> = {
    walking: () => ({
      hipRotation: { x: 0, y: Math.sin(t * 3) * 0.1, z: walkCycle * 0.05 },
      spineRotation: { x: 0.15, y: walkCycle * 0.05, z: 0 },
      neckRotation: { x: 0.1, y: 0, z: 0 },
      leftShoulderRotation: { x: walkCycleOffset * 0.3, y: 0, z: 0 },
      rightShoulderRotation: { x: walkCycle * 0.3, y: 0, z: 0 },
      leftElbowRotation: { x: -0.3 - walkCycleOffset * 0.2, y: 0, z: 0 },
      rightElbowRotation: { x: -0.3 - walkCycle * 0.2, y: 0, z: 0 },
      leftHipRotation: { x: walkCycle * 0.4, y: 0, z: 0 },
      rightHipRotation: { x: walkCycleOffset * 0.4, y: 0, z: 0 },
      leftKneeRotation: { x: Math.max(0, -walkCycle) * 0.8, y: 0, z: 0 },
      rightKneeRotation: { x: Math.max(0, -walkCycleOffset) * 0.8, y: 0, z: 0 },
      leftAnkleRotation: { x: walkCycle * 0.2, y: 0, z: 0 },
      rightAnkleRotation: { x: walkCycleOffset * 0.2, y: 0, z: 0 },
    }),
    standing: () => ({
      hipRotation: { x: 0, y: Math.sin(t * 0.5) * 0.02, z: 0 },
      spineRotation: { x: 0.1, y: 0, z: 0 },
      neckRotation: { x: 0.05, y: Math.sin(t * 0.3) * 0.05, z: 0 },
      leftShoulderRotation: { x: 0, y: 0, z: 0.05 },
      rightShoulderRotation: { x: 0, y: 0, z: -0.05 },
      leftElbowRotation: { x: -0.1, y: 0, z: 0 },
      rightElbowRotation: { x: -0.1, y: 0, z: 0 },
      leftHipRotation: baseRotation,
      rightHipRotation: baseRotation,
      leftKneeRotation: { x: 0.05, y: 0, z: 0 },
      rightKneeRotation: { x: 0.05, y: 0, z: 0 },
      leftAnkleRotation: baseRotation,
      rightAnkleRotation: baseRotation,
    }),
    sitting: () => ({
      hipRotation: { x: 0.8, y: 0, z: 0 },
      spineRotation: { x: -0.2, y: 0, z: 0 },
      neckRotation: { x: -0.1, y: Math.sin(t * 0.2) * 0.1, z: 0 },
      leftShoulderRotation: { x: -0.2, y: 0, z: 0.1 },
      rightShoulderRotation: { x: -0.2, y: 0, z: -0.1 },
      leftElbowRotation: { x: -1.2, y: 0, z: 0 },
      rightElbowRotation: { x: -1.2, y: 0, z: 0 },
      leftHipRotation: { x: -1.5, y: 0.1, z: 0 },
      rightHipRotation: { x: -1.5, y: -0.1, z: 0 },
      leftKneeRotation: { x: 1.5, y: 0, z: 0 },
      rightKneeRotation: { x: 1.5, y: 0, z: 0 },
      leftAnkleRotation: { x: 0.2, y: 0, z: 0 },
      rightAnkleRotation: { x: 0.2, y: 0, z: 0 },
    }),
    lying: () => ({
      hipRotation: { x: 1.57, y: 0, z: 0 },
      spineRotation: { x: 0, y: 0, z: 0 },
      neckRotation: { x: 0, y: Math.sin(t * 0.1) * 0.05, z: 0 },
      leftShoulderRotation: { x: 0, y: 0, z: 0.8 },
      rightShoulderRotation: { x: 0, y: 0, z: -0.8 },
      leftElbowRotation: { x: -0.3, y: 0, z: 0 },
      rightElbowRotation: { x: -0.3, y: 0, z: 0 },
      leftHipRotation: { x: 0, y: 0, z: 0 },
      rightHipRotation: { x: 0, y: 0, z: 0 },
      leftKneeRotation: { x: 0.1, y: 0, z: 0 },
      rightKneeRotation: { x: 0.1, y: 0, z: 0 },
      leftAnkleRotation: baseRotation,
      rightAnkleRotation: baseRotation,
    }),
    falling: () => {
      const fallProgress = Math.min(progress * 2, 1);
      const chaos = Math.sin(t * 20) * (1 - fallProgress);
      return {
        hipRotation: { x: fallProgress * 1.2 + chaos * 0.3, y: chaos * 0.5, z: fallProgress * 0.5 },
        spineRotation: { x: fallProgress * 0.8 + chaos * 0.2, y: chaos * 0.3, z: fallProgress * 0.3 },
        neckRotation: { x: fallProgress * 0.4, y: chaos * 0.2, z: chaos * 0.3 },
        leftShoulderRotation: { x: fallProgress * 1.5 + chaos * 0.5, y: 0, z: 0.8 },
        rightShoulderRotation: { x: fallProgress * 1.2 + chaos * 0.5, y: 0, z: -0.8 },
        leftElbowRotation: { x: -1 + chaos * 0.3, y: 0, z: 0 },
        rightElbowRotation: { x: -0.8 + chaos * 0.3, y: 0, z: 0 },
        leftHipRotation: { x: fallProgress * 0.5 + chaos * 0.2, y: 0.2, z: 0 },
        rightHipRotation: { x: fallProgress * 0.3 + chaos * 0.2, y: -0.2, z: 0 },
        leftKneeRotation: { x: fallProgress * 1.2 + chaos * 0.3, y: 0, z: 0 },
        rightKneeRotation: { x: fallProgress * 0.8 + chaos * 0.3, y: 0, z: 0 },
        leftAnkleRotation: { x: chaos * 0.5, y: 0, z: 0 },
        rightAnkleRotation: { x: chaos * 0.5, y: 0, z: 0 },
      };
    },
    idle: () => ({
      hipRotation: baseRotation,
      spineRotation: { x: 0.1, y: 0, z: 0 },
      neckRotation: baseRotation,
      leftShoulderRotation: { x: 0, y: 0, z: 0.05 },
      rightShoulderRotation: { x: 0, y: 0, z: -0.05 },
      leftElbowRotation: { x: -0.1, y: 0, z: 0 },
      rightElbowRotation: { x: -0.1, y: 0, z: 0 },
      leftHipRotation: baseRotation,
      rightHipRotation: baseRotation,
      leftKneeRotation: baseRotation,
      rightKneeRotation: baseRotation,
      leftAnkleRotation: baseRotation,
      rightAnkleRotation: baseRotation,
    }),
  };

  return animations[activity]();
}

export const TOTAL_DURATION = totalDuration;

// Analysis functions for 3D visualization

export function generateMotionBiography(timeline: TimelineSegment[]): MotionBiography {
  // Calculate weekly trends (simplified - using total duration as "week")
  const totalWalkTime = timeline
    .filter(seg => seg.activity === 'walking')
    .reduce((acc, seg) => acc + (seg.endTime - seg.startTime), 0);
  
  const nearFallCount = timeline
    .filter(seg => seg.activity === 'falling' || seg.riskLevel === 'caution')
    .length;
  
  const inactivityTime = timeline
    .filter(seg => seg.activity === 'sitting' || seg.activity === 'lying')
    .reduce((acc, seg) => acc + (seg.endTime - seg.startTime), 0);

  // Simulate weekly changes (in a real app, this would compare to previous weeks)
  const weeklyTrends = {
    walk_change: -15, // -15% change
    near_fall_change: 10, // +10% change  
    inactivity_change: 20, // +20% change
  };

  const narratives: string[] = [];
  
  if (weeklyTrends.walk_change <= -20) {
    narratives.push("Walking duration reduced significantly this week.");
  }
  if (weeklyTrends.near_fall_change >= 20) {
    narratives.push("Near-fall frequency has increased over recent days.");
  }
  if (weeklyTrends.inactivity_change >= 25) {
    narratives.push("Prolonged inactivity observed. Mobility may be declining.");
  }
  if (narratives.length === 0) {
    narratives.push("Mobility stable. No immediate intervention required.");
  }

  return { narratives, weeklyTrends };
}

export function generateBaselineDrift(timeline: TimelineSegment[]): BaselineDrift {
  // Calculate current activity metrics
  const current = {
    walk: timeline.filter(seg => seg.activity === 'walking').length,
    transitions: timeline.filter(seg => 
      seg.activity === 'standing' || seg.activity === 'walking'
    ).length,
    static: timeline.filter(seg => 
      seg.activity === 'sitting' || seg.activity === 'lying'
    ).length,
  };

  // Baseline (simplified - in real app, this would be historical average)
  const baseline = {
    walk: current.walk * 1.2, // Baseline is 20% higher
    transitions: current.transitions * 0.9, // Baseline is 10% lower
    static: current.static * 0.8, // Baseline is 20% lower
  };

  let drift_score = 0;
  const alerts: string[] = [];

  // Walking decline
  if (current.walk < baseline.walk * 0.8) {
    drift_score += 1;
    alerts.push("Walking activity has declined compared to baseline.");
  }
  
  // Transition increase
  if (current.transitions > baseline.transitions * 1.2) {
    drift_score += 1;
    alerts.push("Increase in unstable transitions detected.");
  }
  
  // Inactivity increase
  if (current.static > baseline.static * 1.25) {
    drift_score += 1;
    alerts.push("Prolonged inactivity compared to baseline.");
  }

  const drift_level = drift_score === 0 ? "stable" : 
                     drift_score === 1 ? "minor drift" : 
                     drift_score === 2 ? "moderate drift" : "significant drift";

  if (alerts.length === 0) {
    alerts.push("No significant mobility drift detected.");
  }

  return { drift_score, drift_level, alerts, current, baseline };
}

export function generateCaregiverAlerts(timeline: TimelineSegment[]): CaregiverAlerts {
  const alerts = timeline
    .filter(seg => seg.activity === 'falling' || seg.riskLevel === 'danger')
    .map((seg, index) => ({
      type: 'fall' as AlertType,
      message: `Fall detected at ${Math.floor(seg.startTime / 1000)}s`,
      timestamp: seg.startTime,
      severity: 'high' as const,
    }));

  // Add some simulated alerts
  alerts.push({
    type: 'assistance-needed',
    message: "Assistance may be needed for daily activities",
    timestamp: 5000,
    severity: 'medium',
  });

  return { alerts };
}

export function generateRiskScore(timeline: TimelineSegment[]): RiskScore {
  const fallRisk = timeline.filter(seg => seg.activity === 'falling').length * 20;
  const mobilityDecline = timeline.filter(seg => seg.activity === 'idle').length * 10;
  const inactivityRisk = timeline.filter(seg => 
    seg.activity === 'sitting' || seg.activity === 'lying'
  ).length * 5;

  const overall = Math.min(100, fallRisk + mobilityDecline + inactivityRisk);

  return {
    overall,
    components: {
      fall_risk: fallRisk,
      mobility_decline: mobilityDecline,
      inactivity_risk: inactivityRisk,
    }
  };
}
