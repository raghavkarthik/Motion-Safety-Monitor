import React from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward,
  FastForward
} from 'lucide-react';
import { useVisualizationStore } from '@/stores/visualizationStore';
import { cn } from '@/lib/utils';

export const PlaybackControls: React.FC = () => {
  const {
    isPlaying,
    playbackSpeed,
    currentTime,
    totalDuration,
    togglePlaying,
    setPlaybackSpeed,
    scrubTo,
  } = useVisualizationStore();

  const formatTime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (currentTime / totalDuration) * 100;

  const handleSkipBack = () => {
    scrubTo(Math.max(0, currentTime - 5000));
  };

  const handleSkipForward = () => {
    scrubTo(Math.min(totalDuration, currentTime + 5000));
  };

  const speeds = [0.25, 0.5, 1, 2];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel rounded-2xl p-4 flex flex-col gap-4"
    >
      {/* Timeline scrubber */}
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs text-muted-foreground w-12">
          {formatTime(currentTime)}
        </span>
        
        <div 
          className="flex-1 h-2 bg-secondary/50 rounded-full cursor-pointer relative overflow-hidden"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percentage = x / rect.width;
            scrubTo(percentage * totalDuration);
          }}
        >
          {/* Progress bar */}
          <motion.div 
            className="absolute left-0 top-0 h-full rounded-full gradient-primary"
            style={{ width: `${progress}%` }}
          />
          
          {/* Scrubber handle */}
          <motion.div 
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary shadow-glow"
            style={{ left: `calc(${progress}% - 8px)` }}
          />
        </div>
        
        <span className="font-mono text-xs text-muted-foreground w-12 text-right">
          {formatTime(totalDuration)}
        </span>
      </div>

      {/* Controls row */}
      <div className="flex items-center justify-between">
        {/* Playback buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSkipBack}
            className="control-btn"
          >
            <SkipBack className="w-4 h-4 text-foreground" />
          </button>
          
          <button
            onClick={togglePlaying}
            className={cn(
              "control-btn w-12 h-12",
              isPlaying && "glow-primary"
            )}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 text-primary" />
            ) : (
              <Play className="w-5 h-5 text-primary ml-0.5" />
            )}
          </button>
          
          <button
            onClick={handleSkipForward}
            className="control-btn"
          >
            <SkipForward className="w-4 h-4 text-foreground" />
          </button>
        </div>

        {/* Speed controls */}
        <div className="flex items-center gap-1">
          <FastForward className="w-4 h-4 text-muted-foreground mr-2" />
          {speeds.map((speed) => (
            <button
              key={speed}
              onClick={() => setPlaybackSpeed(speed)}
              className={cn(
                "px-2 py-1 rounded-md text-xs font-mono transition-all",
                playbackSpeed === speed
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default PlaybackControls;
