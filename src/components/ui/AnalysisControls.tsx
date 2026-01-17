import React from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  TrendingUp,
  AlertTriangle,
  Shield
} from 'lucide-react';
import { useVisualizationStore } from '@/stores/visualizationStore';
import { AnalysisMode } from '@/types/motion';
import { cn } from '@/lib/utils';

const analysisIcons: Record<NonNullable<AnalysisMode>, React.ReactNode> = {
  'motion-biography': <BookOpen className="w-4 h-4" />,
  'baseline-drift': <TrendingUp className="w-4 h-4" />,
  'caregiver-alerts': <AlertTriangle className="w-4 h-4" />,
  'risk-score': <Shield className="w-4 h-4" />,
};

export const AnalysisControls: React.FC = () => {
  const { analysisMode, setAnalysisMode } = useVisualizationStore();

  const analysisModes: AnalysisMode[] = ['motion-biography', 'baseline-drift', 'caregiver-alerts', 'risk-score'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel rounded-xl p-4"
    >
      <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-3">
        Analysis
      </span>

      <div className="grid grid-cols-2 gap-2">
        {analysisModes.map((mode) => (
          <button
            key={mode}
            onClick={() => setAnalysisMode(analysisMode === mode ? null : mode)}
            className={cn(
              "flex items-center gap-2 p-2 rounded-lg text-xs transition-all",
              analysisMode === mode
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
            )}
          >
            {analysisIcons[mode!]}
            <span className="capitalize">{mode!.replace('-', ' ')}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default AnalysisControls;