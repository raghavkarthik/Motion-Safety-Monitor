import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVisualizationStore } from '@/stores/visualizationStore';
import { getCurrentActivity } from '@/data/motionSimulator';

export const FallAlertOverlay: React.FC = () => {
  const { currentPrediction, currentTime } = useVisualizationStore();
  
  if (!currentPrediction) return null;

  const { activity } = getCurrentActivity(currentTime);
  const isFalling = activity === 'falling' || currentPrediction.riskLevel === 'danger';

  return (
    <AnimatePresence>
      {isFalling && (
        <>
          {/* Edge glow effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-40"
            style={{
              boxShadow: 'inset 0 0 150px 50px rgba(239, 68, 68, 0.3)',
            }}
          />
          
          {/* Pulsing rings */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              initial={{ scale: 0.5, opacity: 1 }}
              animate={{ 
                scale: 2.5, 
                opacity: 0,
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.5,
                ease: 'easeOut',
              }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
                         w-32 h-32 rounded-full border-4 border-motion-danger 
                         pointer-events-none z-30"
            />
          ))}

          {/* Heartbeat line */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-32 left-1/2 -translate-x-1/2 w-64 h-16 z-50"
          >
            <svg 
              viewBox="0 0 200 50" 
              className="w-full h-full"
              style={{ filter: 'drop-shadow(0 0 10px rgba(239, 68, 68, 0.8))' }}
            >
              <motion.path
                d="M0,25 L40,25 L50,10 L60,40 L70,5 L80,45 L90,25 L200,25"
                stroke="hsl(0 84.2% 60.2%)"
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
            </svg>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FallAlertOverlay;
