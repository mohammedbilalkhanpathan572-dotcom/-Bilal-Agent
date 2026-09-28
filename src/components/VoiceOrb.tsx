import React from 'react';
import { Mic, MicOff, Volume2, Sparkles, Loader2 } from 'lucide-react';
import { AudioWaveform } from './AudioWaveform';

interface VoiceOrbProps {
  isListening: boolean;
  isProcessing: boolean;
  isSpeaking: boolean;
  transcript?: string;
  interimTranscript?: string;
  onToggleListening: () => void;
  language?: string;
}

export const VoiceOrb: React.FC<VoiceOrbProps> = ({
  isListening,
  isProcessing,
  isSpeaking,
  transcript,
  interimTranscript,
  onToggleListening,
  language = 'English',
}) => {
  return (
    <div className="relative flex flex-col items-center justify-center py-8">
      {/* Outer Pulse Rings when Listening */}
      {isListening && (
        <>
          <div className="absolute w-52 h-52 rounded-full bg-cyan-500/10 animate-ping opacity-75" />
          <div className="absolute w-44 h-44 rounded-full bg-indigo-500/20 animate-pulse duration-1000" />
        </>
      )}

      {/* Center glowing Orb button */}
      <button
        onClick={onToggleListening}
        disabled={isProcessing}
        aria-label={isListening ? 'Stop microphone' : 'Start speaking to Bilal AI'}
        className={`relative group z-10 w-32 h-32 rounded-full flex flex-col items-center justify-center transition-all duration-500 shadow-2xl cursor-pointer ${
          isListening
            ? 'bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-500 shadow-rose-500/50 scale-105 ring-4 ring-rose-400/40'
            : isProcessing
            ? 'bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 shadow-purple-500/40 scale-100 ring-2 ring-indigo-400/30'
            : isSpeaking
            ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 shadow-emerald-500/40 scale-105'
            : 'bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 shadow-cyan-500/30 hover:scale-105'
        }`}
      >
        {/* Inner subtle glow */}
        <div className="absolute inset-1 rounded-full bg-black/20 backdrop-blur-xs flex items-center justify-center">
          {isProcessing ? (
            <Loader2 className="w-12 h-12 text-white animate-spin" />
          ) : isListening ? (
            <Mic className="w-12 h-12 text-white animate-pulse" />
          ) : isSpeaking ? (
            <Volume2 className="w-12 h-12 text-white animate-bounce" />
          ) : (
            <div className="flex flex-col items-center">
              <Mic className="w-11 h-11 text-white group-hover:scale-110 transition-transform duration-300" />
            </div>
          )}
        </div>
      </button>

      {/* Voice Status Description */}
      <div className="mt-5 text-center flex flex-col items-center gap-1.5">
        <div className="flex items-center gap-2">
          {isListening ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping"></span>
              Listening for your voice...
            </span>
          ) : isProcessing ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <Sparkles className="w-3.5 h-3.5 animate-spin text-indigo-400" />
              Agent Reasoning & Tool Selection...
            </span>
          ) : isSpeaking ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              Speaking response...
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-800/80 text-slate-300 border border-slate-700/60">
              🎙 Click to speak natural commands ({language})
            </span>
          )}
        </div>

        {/* Live Audio Waveform when active */}
        <AudioWaveform
          isActive={isListening || isSpeaking}
          color={isListening ? 'bg-rose-400' : 'bg-cyan-400'}
        />

        {/* Live transcript preview */}
        {(transcript || interimTranscript) && (
          <div className="max-w-md px-4 py-2 mt-1 rounded-xl bg-slate-900/90 border border-slate-800 text-sm text-slate-200 text-center shadow-lg">
            <span className="text-slate-400 font-mono text-xs block mb-0.5">Live Voice Input:</span>
            "{transcript || interimTranscript}"
          </div>
        )}
      </div>
    </div>
  );
};
