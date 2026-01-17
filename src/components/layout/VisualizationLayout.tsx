import React from 'react';
import { motion } from 'framer-motion';
import MotionScene from '@/components/3d/MotionScene';
import PlaybackControls from '@/components/ui/PlaybackControls';
import StatusIndicator from '@/components/ui/StatusIndicator';
import VisualizationControls from '@/components/ui/VisualizationControls';
import FallAlertOverlay from '@/components/ui/FallAlertOverlay';
import AnalysisControls from '@/components/ui/AnalysisControls';

export const VisualizationLayout: React.FC = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      {/* Main 3D canvas */}
      <div className="absolute inset-0">
        <MotionScene />
      </div>

      {/* Fall alert overlay */}
      <FallAlertOverlay />

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-0 left-0 right-0 z-20 p-6"
      >
        <div className="flex items-center justify-center">
          <div className="glass-panel rounded-xl px-6 py-4 text-center">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              Motion Safety Monitor
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Elderly Activity Recognition System
            </p>
          </div>
        </div>
      </motion.header>

      {/* Live indicator - top right */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="absolute top-6 right-6 z-20"
      >
        <div className="glass-panel rounded-full px-4 py-2 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-motion-safe animate-pulse" />
          <span className="text-xs font-medium text-muted-foreground">
            LIVE ANALYSIS
          </span>
        </div>
      </motion.div>

      {/* Left sidebar - Controls */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-48">
        <VisualizationControls />
      </div>

      {/* Right sidebar - Status */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-48">
        <StatusIndicator />
      </div>

      {/* Bottom controls - centered */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-4">
        <PlaybackControls />
        <AnalysisControls />
      </div>

      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-32 h-32 pointer-events-none">
        <svg viewBox="0 0 100 100" className="w-full h-full opacity-20">
          <path 
            d="M0,0 L100,0 L100,10 L10,10 L10,100 L0,100 Z" 
            fill="url(#cornerGrad)" 
          />
          <defs>
            <linearGradient id="cornerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(185, 80%, 50%)" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="absolute bottom-0 right-0 w-32 h-32 pointer-events-none rotate-180">
        <svg viewBox="0 0 100 100" className="w-full h-full opacity-20">
          <path 
            d="M0,0 L100,0 L100,10 L10,10 L10,100 L0,100 Z" 
            fill="url(#cornerGrad2)" 
          />
          <defs>
            <linearGradient id="cornerGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(185, 80%, 50%)" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Scan line effect */}
      <motion.div
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent pointer-events-none"
        initial={{ top: '0%' }}
        animate={{ top: '100%' }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  );
};

export default VisualizationLayout;
