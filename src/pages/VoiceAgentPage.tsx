import React from 'react';
import { Mic, MicOff, Volume2, VolumeX, Sparkles, Activity, Globe, Compass, Radio } from 'lucide-react';
import { AudioWaveform } from '../components/AudioWaveform';
import { AgentExecutionResult } from '../types';

interface VoiceAgentPageProps {
  isListening: boolean;
  isProcessing: boolean;
  isSpeaking: boolean;
  isMuted: boolean;
  transcript: string;
  interimTranscript: string;
  onToggleListening: () => void;
  onToggleMute: () => void;
  latestResult: AgentExecutionResult | null;
  onSendCommand: (cmd: string) => Promise<AgentExecutionResult | null>;
  userLanguage: string;
  onChangeLanguage: (lang: any) => void;
}

export const VoiceAgentPage: React.FC<VoiceAgentPageProps> = ({
  isListening,
  isProcessing,
  isSpeaking,
  isMuted,
  transcript,
  interimTranscript,
  onToggleListening,
  onToggleMute,
  latestResult,
  onSendCommand,
  userLanguage,
  onChangeLanguage,
}) => {
  const quickVoiceTriggers = [
    'Open Chrome and search PUBG sensitivity for Sony Xperia XZ3.',
    'Ahmed ko WhatsApp par draft reply likho ke kal meeting 10 baje hai.',
    'Check my latest TikTok comments and suggest a funny reply.',
    'Remind me tomorrow at 8 AM to upload gaming gameplay.',
    'Create an HTML website for my gaming clan.',
    'Find all project files in my workspace.',
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Central Futuristic Cockpit */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#0f172a] via-[#090d16] to-[#040711] border border-cyan-500/20 p-8 shadow-2xl flex flex-col items-center text-center">
        {/* Ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Badges */}
        <div className="flex items-center gap-3 mb-6 flex-wrap justify-center">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            Live Voice Terminal
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            <span>Mode: {userLanguage}</span>
          </div>

          <button
            onClick={onToggleMute}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white transition cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
            <span>{isMuted ? 'Muted' : 'Spoken Voice Active'}</span>
          </button>
        </div>

        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Natural Voice Command Suite
        </h2>
        <p className="text-sm text-slate-400 max-w-lg mt-1">
          Speak fluidly in Urdu, Roman Urdu, or English. Bilal AI handles speech recognition, intent resolution, tool execution, and voice playback.
        </p>

        {/* Massive Animated Visualizer & Mic Button */}
        <div className="my-10 relative flex flex-col items-center justify-center">
          {isListening && (
            <div className="absolute w-72 h-72 rounded-full bg-cyan-500/15 animate-ping opacity-60" />
          )}

          <button
            onClick={onToggleListening}
            className={`relative z-10 w-40 h-40 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all duration-500 cursor-pointer ${
              isListening
                ? 'bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-500 scale-110 ring-8 ring-rose-500/25 shadow-rose-500/50'
                : isProcessing
                ? 'bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 ring-4 ring-indigo-500/30 animate-pulse'
                : isSpeaking
                ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 ring-4 ring-emerald-500/30'
                : 'bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 hover:scale-105 shadow-cyan-500/30'
            }`}
          >
            <div className="w-36 h-36 rounded-full bg-slate-950/40 backdrop-blur-xs flex flex-col items-center justify-center">
              {isListening ? (
                <Mic className="w-16 h-16 text-white animate-pulse" />
              ) : isSpeaking ? (
                <Volume2 className="w-16 h-16 text-white animate-bounce" />
              ) : (
                <Mic className="w-16 h-16 text-white" />
              )}
            </div>
          </button>

          {/* Sound wave bars */}
          <div className="mt-6 w-full max-w-sm">
            <AudioWaveform
              isActive={isListening || isSpeaking}
              color={isListening ? 'bg-rose-400' : isSpeaking ? 'bg-emerald-400' : 'bg-cyan-400'}
              bars={24}
            />
          </div>
        </div>

        {/* Real-time Voice Transcription Output */}
        <div className="w-full max-w-xl p-4 rounded-2xl bg-slate-950/90 border border-slate-800 text-left min-h-[90px] flex flex-col justify-center">
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono mb-1">
            <span>LIVE TRANSCRIPT</span>
            <span className={isListening ? 'text-rose-400 animate-pulse font-bold' : 'text-slate-500'}>
              {isListening ? '● REC' : 'READY'}
            </span>
          </div>
          <p className="text-sm font-medium text-slate-200">
            {transcript || interimTranscript || (
              <span className="text-slate-500 italic">
                Press the microphone orb above and speak any natural command...
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Spoken Response Result */}
      {latestResult && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
              <Volume2 className="w-4 h-4" />
              <span>AGENT SPOKEN RESPONSE:</span>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Tool: <span className="text-slate-200">{latestResult.steps?.[latestResult.steps.length - 1]?.tool || 'Orchestrator'}</span>
            </span>
          </div>
          <p className="text-sm text-slate-200 leading-relaxed">
            {latestResult.spokenText || latestResult.responseText}
          </p>
        </div>
      )}

      {/* Suggested Voice Commands Trigger Pills */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          Test Voice Commands Instantly
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {quickVoiceTriggers.map((trig, idx) => (
            <button
              key={idx}
              onClick={() => onSendCommand(trig)}
              disabled={isProcessing}
              className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-850 text-left transition flex items-center justify-between group cursor-pointer"
            >
              <span className="text-xs text-slate-300 font-medium group-hover:text-cyan-300 transition">
                "{trig}"
              </span>
              <Mic className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 shrink-0 ml-2" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
