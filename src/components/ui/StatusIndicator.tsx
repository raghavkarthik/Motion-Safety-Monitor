import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVisualizationStore } from '@/stores/visualizationStore';
import { getCurrentActivity } from '@/data/motionSimulator';
import { cn } from '@/lib/utils';
import { 
  Activity, 
  AlertTriangle, 
  ShieldCheck, 
  Gauge,
  BookOpen,
  TrendingUp,
  AlertTriangle as AlertIcon,
  Shield
} from 'lucide-react';

const activityIcons: Record<string, React.ReactNode> = {
  walking: '🚶',
  standing: '🧍',
  sitting: '🪑',
  lying: '🛏️',
  falling: '⚠️',
  idle: '⏸️',
};

export const StatusIndicator: React.FC = () => {
  const { 
    currentPrediction, 
    currentTime,
    analysisMode,
    motionBiography,
    baselineDrift,
    caregiverAlerts,
    riskScore
  } = useVisualizationStore();
  
  if (!currentPrediction) return null;

  const { activity } = getCurrentActivity(currentTime);
  const { riskLevel, confidence } = currentPrediction;

  const activityIcons: Record<string, React.ReactNode> = {
    walking: '🚶',
    standing: '🧍',
    sitting: '🪑',
    lying: '🛏️',
    falling: '⚠️',
    idle: '⏸️',
  };

  const riskColors = {
    safe: 'text-motion-safe',
    caution: 'text-motion-caution',
    danger: 'text-motion-danger',
  };

  const riskBgColors = {
    safe: 'bg-motion-safe/10 border-motion-safe/30',
    caution: 'bg-motion-caution/10 border-motion-caution/30',
    danger: 'bg-motion-danger/10 border-motion-danger/30',
  };

  const riskGlowClasses = {
    safe: 'glow-safe',
    caution: 'glow-caution',
    danger: 'glow-danger',
  };

  // If analysis mode is active, show analysis data instead of regular status
  if (analysisMode) {
    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col gap-3"
      >
        {/* Analysis Header */}
        <div className="glass-panel rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            {analysisMode === 'motion-biography' && <BookOpen className="w-4 h-4 text-primary" />}
            {analysisMode === 'baseline-drift' && <TrendingUp className="w-4 h-4 text-primary" />}
            {analysisMode === 'caregiver-alerts' && <AlertIcon className="w-4 h-4 text-primary" />}
            {analysisMode === 'risk-score' && <Shield className="w-4 h-4 text-primary" />}
            <span className="text-xs text-muted-foreground uppercase tracking-wider">
              {analysisMode.replace('-', ' ')}
            </span>
          </div>
          
          {/* Show current activity near analysis */}
          <div className="border-t border-secondary/50 pt-3">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground uppercase tracking-wider">
                Current Activity
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{activityIcons[activity]}</span>
              <span className="text-sm font-medium capitalize text-foreground">
                {activity}
              </span>
            </div>
          </div>
        </div>

        {/* Analysis Content */}
        {analysisMode === 'motion-biography' && motionBiography && (
          <div className="glass-panel rounded-xl p-4 max-h-60 overflow-y-auto">
            <div className="space-y-2">
              {motionBiography.narratives.map((narrative, index) => (
                <div key={index} className="text-sm text-foreground p-2 rounded bg-secondary/30">
                  {narrative}
                </div>
              ))}
            </div>
          </div>
        )}

        {analysisMode === 'baseline-drift' && baselineDrift && (
          <div className="glass-panel rounded-xl p-4 max-h-60 overflow-y-auto">
            <div className="space-y-3">
              <div className="text-center">
                <div className={`text-lg font-bold ${baselineDrift.drift_level === 'stable' ? 'text-green-500' : baselineDrift.drift_level === 'minor drift' ? 'text-yellow-500' : 'text-red-500'}`}>
                  {baselineDrift.drift_level}
                </div>
                <div className="text-xs text-muted-foreground">Score: {baselineDrift.drift_score}/3</div>
              </div>
              {baselineDrift.alerts.map((alert, index) => (
                <div key={index} className="flex items-start gap-2 text-sm text-foreground p-2 rounded bg-secondary/30">
                  <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span>{alert}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {analysisMode === 'caregiver-alerts' && caregiverAlerts && (
          <div className="glass-panel rounded-xl p-4 max-h-60 overflow-y-auto">
            <div className="space-y-2">
              {caregiverAlerts.alerts.length === 0 ? (
                <div className="text-sm text-muted-foreground p-2 rounded bg-secondary/30">
                  No active alerts
                </div>
              ) : (
                caregiverAlerts.alerts.map((alert, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-2 rounded border ${
                      alert.severity === 'high' ? 'bg-red-500/10 border-red-500/30 text-red-400' :
                      alert.severity === 'medium' ? 'bg-orange-500/10 border-orange-500/30 text-orange-400' :
                      'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
                    }`}
                  >
                    <div className="text-xs font-medium uppercase">
                      {alert.type.replace('-', ' ')}
                    </div>
                    <div className="text-sm mt-1">{alert.message}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {Math.floor(alert.timestamp / 1000)}s ago
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        )}

        {analysisMode === 'risk-score' && riskScore && (
          <div className="glass-panel rounded-xl p-4">
            <div className="text-center mb-4">
              <div className={`text-3xl font-bold ${riskScore.overall < 30 ? 'text-green-500' : riskScore.overall < 60 ? 'text-yellow-500' : riskScore.overall < 80 ? 'text-orange-500' : 'text-red-500'}`}>
                {riskScore.overall}
              </div>
              <div className="text-xs text-muted-foreground">Risk Score</div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Fall Risk:</span>
                <span className="text-red-500">{riskScore.components.fall_risk}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Mobility:</span>
                <span className="text-orange-500">{riskScore.components.mobility_decline}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Inactivity:</span>
                <span className="text-blue-500">{riskScore.components.inactivity_risk}</span>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    );
  }

  // Default status display when no analysis mode is active
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex flex-col gap-3"
    >
      {/* Activity indicator */}
      <div className="glass-panel rounded-xl p-4">
        <div className="flex items-center gap-3 mb-3">
          <Activity className="w-4 h-4 text-primary" />
          <span className="text-xs text-muted-foreground uppercase tracking-wider">
            Activity
          </span>
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activity}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex items-center gap-3"
          >
            <span className="text-3xl">{activityIcons[activity]}</span>
            <span className="text-lg font-medium capitalize text-foreground">
              {activity}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Risk level */}
      <motion.div 
        className={cn(
          "glass-panel rounded-xl p-4 border transition-all duration-300",
          riskBgColors[riskLevel],
          riskLevel === 'danger' && 'animate-pulse'
        )}
        animate={riskLevel === 'danger' ? { scale: [1, 1.02, 1] } : {}}
        transition={{ duration: 0.5, repeat: riskLevel === 'danger' ? Infinity : 0 }}
      >
        <div className="flex items-center gap-3 mb-3">
          {riskLevel === 'safe' ? (
            <ShieldCheck className="w-4 h-4 text-motion-safe" />
          ) : (
            <AlertTriangle className={cn("w-4 h-4", riskColors[riskLevel])} />
          )}
          <span className="text-xs text-muted-foreground uppercase tracking-wider">
            Risk Level
          </span>
        </div>
        
        <div className={cn(
          "text-2xl font-bold uppercase tracking-wide",
          riskColors[riskLevel],
          riskLevel === 'danger' && 'text-glow-danger'
        )}>
          {riskLevel}
        </div>
      </motion.div>

      {/* Confidence meter */}
      <div className="glass-panel rounded-xl p-4">
        <div className="flex items-center gap-3 mb-3">
          <Gauge className="w-4 h-4 text-primary" />
          <span className="text-xs text-muted-foreground uppercase tracking-wider">
            Confidence
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 bg-secondary/50 rounded-full overflow-hidden">
            <motion.div
              className="h-full gradient-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${confidence * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <span className="font-mono text-sm text-foreground">
            {Math.round(confidence * 100)}%
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default StatusIndicator;
