import React from 'react';
import { Menu, Volume2, VolumeX, Shield, Cpu, Sparkles } from 'lucide-react';

interface HeaderProps {
  onOpenMobileNav: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  activeModel?: string;
  hasPendingApproval?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileNav,
  isMuted,
  onToggleMute,
  activeModel = 'gemini-3.8-flash',
  hasPendingApproval = false,
}) => {
  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning, Bilal';
    if (hour < 18) return 'Good afternoon, Bilal';
    return 'Good evening, Bilal';
  };

  return (
    <header className="sticky top-0 z-30 w-full px-6 py-4 bg-[#090d16]/80 backdrop-blur-md border-b border-slate-800/80 flex items-center justify-between">
      {/* Left side: Hamburger (mobile) + Greeting */}
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenMobileNav}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 md:hidden cursor-pointer"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
              {getGreeting()}
            </h2>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Personal Edition
            </span>
          </div>
          <p className="text-xs text-slate-400">What can I do for you today?</p>
        </div>
      </div>

      {/* Right side: AI Status Card + Voice toggle + Model */}
      <div className="flex items-center gap-3">
        {/* Model Badge */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-mono text-[11px] text-slate-400">Brain:</span>
          <span className="font-semibold text-white font-mono text-xs">{activeModel}</span>
        </div>

        {/* AI Agent Online Indicator */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold shadow-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="hidden sm:inline font-mono">AI Agent Online</span>
        </div>

        {/* Voice Spoken Response Toggle */}
        <button
          onClick={onToggleMute}
          title={isMuted ? 'Voice Responses Muted (Click to Unmute)' : 'Voice Responses Active (Click to Mute)'}
          className={`p-2.5 rounded-xl border transition cursor-pointer ${
            isMuted
              ? 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
              : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-sm shadow-cyan-500/10'
          }`}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
