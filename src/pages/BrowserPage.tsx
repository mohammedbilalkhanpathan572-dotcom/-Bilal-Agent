import React, { useState } from 'react';
import { Compass, Globe, Search, ExternalLink, ShieldCheck, ArrowRight, Play, Check } from 'lucide-react';

interface BrowserPageProps {
  onTriggerCommand: (cmd: string) => void;
}

export const BrowserPage: React.FC<BrowserPageProps> = ({ onTriggerCommand }) => {
  const [targetUrl, setTargetUrl] = useState('https://www.google.com');

  const handleOpenUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUrl.trim()) return;
    onTriggerCommand(`Open ${targetUrl} in browser`);
  };

  const quickNavLinks = [
    { label: 'Google Search', url: 'https://www.google.com' },
    { label: 'YouTube Gaming', url: 'https://www.youtube.com' },
    { label: 'PUBG Mobile Esports', url: 'https://esports.pubgmobile.com' },
    { label: 'Sony Mobile Support', url: 'https://www.sony.com/electronics/support' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shadow-lg shadow-indigo-500/10">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">Browser Automation Hub</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                Playwright Driver
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Safe headless web navigation, page summarization, and query research.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
          <ShieldCheck className="w-4 h-4" />
          <span>Safe Sandboxed Sessions</span>
        </div>
      </div>

      {/* URL Navigator Bar */}
      <form onSubmit={handleOpenUrl} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg flex items-center gap-3">
        <div className="flex items-center gap-2 text-slate-400 pl-2">
          <Globe className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono">URL:</span>
        </div>

        <input
          type="text"
          value={targetUrl}
          onChange={(e) => setTargetUrl(e.target.value)}
          placeholder="https://www.google.com"
          className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-400"
        />

        <button
          type="submit"
          className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
        >
          <Play className="w-3.5 h-3.5" />
          Navigate & Read
        </button>
      </form>

      {/* Quick Launch Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {quickNavLinks.map((link, i) => (
          <button
            key={i}
            onClick={() => onTriggerCommand(`Open ${link.url} in browser`)}
            className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 text-left transition flex flex-col justify-between group cursor-pointer"
          >
            <div>
              <span className="text-xs font-bold text-white group-hover:text-cyan-300 block mb-1">
                {link.label}
              </span>
              <span className="text-[11px] font-mono text-slate-500 truncate block">
                {link.url}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-end text-slate-500 group-hover:text-cyan-400">
              <ExternalLink className="w-3.5 h-3.5" />
            </div>
          </button>
        ))}
      </div>

      {/* Browser Viewport Simulation Window */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl">
        <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/70" />
            <div className="w-3 h-3 rounded-full bg-amber-500/70" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
            <span className="text-xs font-mono text-slate-400 ml-2">Chrome (Playwright Automated Session)</span>
          </div>

          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Active Connection
          </span>
        </div>

        <div className="p-8 text-center space-y-4 min-h-[300px] flex flex-col items-center justify-center bg-slate-950/60">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400">
            <Compass className="w-8 h-8 animate-spin duration-3000" />
          </div>
          <div className="max-w-md">
            <h4 className="font-bold text-base text-white">Browser Ready for Dispatch</h4>
            <p className="text-xs text-slate-400 mt-1">
              Speak or type commands like <span className="text-cyan-300 font-mono">"Open Chrome and search PUBG sensitivity"</span> to navigate, extract structured text, and analyze web data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
