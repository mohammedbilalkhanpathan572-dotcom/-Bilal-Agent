import React from 'react';

interface AudioWaveformProps {
  isActive: boolean;
  color?: string;
  bars?: number;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({
  isActive,
  color = 'bg-cyan-400',
  bars = 16,
}) => {
  return (
    <div className="flex items-center justify-center gap-1.5 h-12 px-4 py-2">
      {Array.from({ length: bars }).map((_, i) => {
        // Vary heights dynamically
        const heights = [
          'h-2', 'h-4', 'h-7', 'h-10', 'h-6', 'h-8', 'h-11', 'h-5',
          'h-9', 'h-12', 'h-6', 'h-8', 'h-10', 'h-5', 'h-3', 'h-2',
        ];
        const hClass = isActive ? heights[i % heights.length] : 'h-1.5';
        const delay = (i * 0.08).toFixed(2);

        return (
          <div
            key={i}
            className={`w-1 rounded-full transition-all duration-300 ${color} ${hClass} ${
              isActive ? 'animate-pulse' : 'opacity-30'
            }`}
            style={{
              animationDelay: `${delay}s`,
              animationDuration: isActive ? '0.7s' : '0s',
            }}
          />
        );
      })}
    </div>
  );
};
