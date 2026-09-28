import React, { useState } from 'react';
import {
  Send,
  Sparkles,
  Flame,
  MessageCircle,
  Video,
  Code2,
  Calendar,
  FolderOpen,
  ArrowRight,
  Globe,
  Radio,
  ExternalLink,
} from 'lucide-react';
import { VoiceOrb } from '../components/VoiceOrb';
import { TaskProgressPanel } from '../components/TaskProgressPanel';
import { CodeSandboxPreview } from '../components/CodeSandboxPreview';
import { AgentExecutionResult, AgentStep } from '../types';

interface DashboardPageProps {
  onSendCommand: (command: string) => Promise<AgentExecutionResult | null>;
  isProcessing: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  transcript: string;
  interimTranscript: string;
  onToggleListening: () => void;
  currentSteps: AgentStep[];
  currentCommand: string;
  latestResult: AgentExecutionResult | null;
  onNavigate: (tab: any) => void;
  userLanguage?: string;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onSendCommand,
  isProcessing,
  isListening,
  isSpeaking,
  transcript,
  interimTranscript,
  onToggleListening,
  currentSteps,
  currentCommand,
  latestResult,
  onNavigate,
  userLanguage = 'English',
}) => {
  const [inputText, setInputText] = useState('');

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isProcessing) return;
    const cmd = inputText.trim();
    setInputText('');
    await onSendCommand(cmd);
  };

  const handlePillClick = async (pillText: string) => {
    if (isProcessing) return;
    await onSendCommand(pillText);
  };

  const samplePrompts = [
    {
      title: 'Open Chrome & Search PUBG Sensitivity',
      cmd: 'Open Chrome and search PUBG sensitivity for Sony Xperia XZ3.',
      tag: 'Browser & Research',
      color: 'from-cyan-500/20 to-blue-500/10 text-cyan-300 border-cyan-500/30',
    },
    {
      title: 'Draft WhatsApp Reply to Ahmed',
      cmd: 'Ahmed ko message draft karo ke main 10 minutes mein aaunga.',
      tag: 'WhatsApp / Roman Urdu',
      color: 'from-emerald-500/20 to-teal-500/10 text-emerald-300 border-emerald-500/30',
    },
    {
      title: 'Generate Gaming Website in HTML',
      cmd: 'Create a modern responsive gaming website in HTML and Tailwind CSS.',
      tag: 'Coding Studio',
      color: 'from-purple-500/20 to-indigo-500/10 text-purple-300 border-purple-500/30',
    },
    {
      title: 'Check Latest TikTok Comments',
      cmd: 'Check my latest TikTok comments and suggest replies.',
      tag: 'Social Media',
      color: 'from-pink-500/20 to-rose-500/10 text-pink-300 border-pink-500/30',
    },
    {
      title: 'Set Task Reminder for Tomorrow',
      cmd: 'Remind me tomorrow at 10 AM to review the project code.',
      tag: 'Scheduler',
      color: 'from-amber-500/20 to-orange-500/10 text-amber-300 border-amber-500/30',
    },
    {
      title: 'Roman Urdu: Chrome Kholo',
      cmd: 'Chrome kholo aur YouTube par gaming stream search karo.',
      tag: 'Roman Urdu Voice',
      color: 'from-blue-500/20 to-indigo-500/10 text-blue-300 border-blue-500/30',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Hero Voice Command Area */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#111827] via-[#0d131f] to-[#090d16] border border-slate-800 p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-cyan-500/15 via-indigo-500/15 to-purple-500/15 text-cyan-300 border border-cyan-500/30 mb-2">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            Autonomous Natural Language Voice Core
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mt-2">
            Speak to <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">Bilal AI Agent</span>
          </h1>

          <p className="text-sm text-slate-400 mt-2">
            Command your browser, WhatsApp, TikTok, coding projects, and tasks using natural voice in English, Urdu, or Roman Urdu.
          </p>

          {/* Central Interactive Voice Orb */}
          <VoiceOrb
            isListening={isListening}
            isProcessing={isProcessing}
            isSpeaking={isSpeaking}
            transcript={transcript}
            interimTranscript={interimTranscript}
            onToggleListening={onToggleListening}
            language={userLanguage}
          />

          {/* Fallback Text Input Form */}
          <form onSubmit={handleFormSubmit} className="w-full max-w-xl mt-2 relative">
            <div className="relative flex items-center">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder='Type a command... (e.g. "Open Chrome and search PUBG sensitivity")'
                disabled={isProcessing}
                className="w-full pl-5 pr-28 py-3.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 shadow-xl transition"
              />

              <div className="absolute right-2 flex items-center gap-1.5">
                <button
                  type="submit"
                  disabled={!inputText.trim() || isProcessing}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-40 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Execute</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Live Task Progress Panel (When active or steps available) */}
      {currentSteps && currentSteps.length > 0 && (
        <TaskProgressPanel
          currentCommand={currentCommand}
          steps={currentSteps}
          isProcessing={isProcessing}
        />
      )}

      {/* Latest Execution Result Card */}
      {latestResult && (
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h3 className="font-bold text-sm text-white">Agent Result</h3>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                {latestResult.language}
              </span>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Status: <span className="text-emerald-400 font-bold">Success</span>
            </span>
          </div>

          <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
            {latestResult.responseText}
          </div>

          {/* If the result is code or has a preview */}
          {latestResult.toolResult?.code && (
            <div className="mt-4">
              <CodeSandboxPreview
                code={latestResult.toolResult.code}
                language={latestResult.toolResult.language || 'html'}
                title="Generated Output"
              />
            </div>
          )}

          {/* If search result has citations */}
          {latestResult.toolResult?.results && Array.isArray(latestResult.toolResult.results) && (
            <div className="mt-4 space-y-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Source Citations & Verified References:
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {latestResult.toolResult.results.map((res: any, idx: number) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-cyan-400 hover:underline flex items-center gap-1 mb-1"
                    >
                      {res.title}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <p className="text-slate-400 line-clamp-3">{res.snippet}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Suggested Quick Commands Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Quick Voice & Text Commands
            </h2>
          </div>
          <span className="text-xs text-slate-400">Click any pill to test instant execution</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {samplePrompts.map((item, i) => (
            <button
              key={i}
              onClick={() => handlePillClick(item.cmd)}
              disabled={isProcessing}
              className={`p-4 rounded-2xl bg-gradient-to-br ${item.color} border hover:scale-[1.02] active:scale-[0.98] transition-all text-left group flex flex-col justify-between cursor-pointer`}
            >
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider opacity-80 block mb-1">
                  {item.tag}
                </span>
                <p className="text-sm font-bold text-white group-hover:text-cyan-200 transition">
                  {item.title}
                </p>
                <p className="text-xs text-slate-400 mt-1.5 italic font-mono">
                  "{item.cmd}"
                </p>
              </div>
              <div className="mt-3 flex items-center justify-end text-xs opacity-60 group-hover:opacity-100 transition">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Core Integrations & Workspaces Quick Hub */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4">
        <div
          onClick={() => onNavigate('whatsapp')}
          className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-900 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <MessageCircle className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-semibold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10">
              Active
            </span>
          </div>
          <h4 className="font-bold text-sm text-white group-hover:text-emerald-300">WhatsApp Hub</h4>
          <p className="text-xs text-slate-400 mt-1">2 unread messages from Ahmed & squad</p>
        </div>

        <div
          onClick={() => onNavigate('tiktok')}
          className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-pink-500/40 hover:bg-slate-900 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center">
              <Video className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-semibold text-pink-400 px-2 py-0.5 rounded bg-pink-500/10">
              3 Pending
            </span>
          </div>
          <h4 className="font-bold text-sm text-white group-hover:text-pink-300">TikTok Comments</h4>
          <p className="text-xs text-slate-400 mt-1">AI suggested replies for review</p>
        </div>

        <div
          onClick={() => onNavigate('coding')}
          className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-900 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Code2 className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-semibold text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10">
              HTML/JS
            </span>
          </div>
          <h4 className="font-bold text-sm text-white group-hover:text-cyan-300">Coding Studio</h4>
          <p className="text-xs text-slate-400 mt-1">Live web preview & code generator</p>
        </div>

        <div
          onClick={() => onNavigate('tasks')}
          className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 hover:bg-slate-900 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-semibold text-amber-400 px-2 py-0.5 rounded bg-amber-500/10">
              2 Scheduled
            </span>
          </div>
          <h4 className="font-bold text-sm text-white group-hover:text-amber-300">Task Automation</h4>
          <p className="text-xs text-slate-400 mt-1">YouTube upload & daily summaries</p>
        </div>
      </div>
    </div>
  );
};
