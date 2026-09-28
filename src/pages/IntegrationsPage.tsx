import React, { useState, useEffect } from 'react';
import {
  Layers,
  Sparkles,
  MessageCircle,
  Video,
  Compass,
  FolderOpen,
  Mail,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Key,
} from 'lucide-react';
import { api } from '../services/api';
import { IntegrationStatus } from '../types';

export const IntegrationsPage: React.FC = () => {
  const [integrations, setIntegrations] = useState<IntegrationStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStatus = async () => {
    try {
      setLoading(true);
      const data = await api.getIntegrations();
      setIntegrations(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  const cards = [
    {
      title: 'Google Gemini AI (LLM Core)',
      category: 'AI Model Brain',
      icon: Sparkles,
      iconColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      connected: true,
      mode: 'gemini-3.8-flash',
      desc: 'Orchestrator for intent understanding, multi-step decomposition, tool selection, and Roman Urdu parsing.',
      envKey: 'GEMINI_API_KEY',
    },
    {
      title: 'WhatsApp Business / Cloud API',
      category: 'Communication',
      icon: MessageCircle,
      iconColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      connected: integrations?.whatsapp.connected ?? true,
      mode: integrations?.whatsapp.mode || 'Meta Graph Cloud API / Sandbox',
      desc: 'Enables reading unread conversations, drafting replies, and sending authorized messages upon approval.',
      envKey: 'WHATSAPP_API_KEY, WHATSAPP_PHONE_NUMBER_ID',
    },
    {
      title: 'TikTok Display & Moderation',
      category: 'Social Media',
      icon: Video,
      iconColor: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
      connected: integrations?.tiktok.connected ?? true,
      mode: integrations?.tiktok.mode || 'Official Display API / Creator Sandbox',
      desc: 'Retrieves audience interactions, generates tailored replies, and posts approved comments to your video feed.',
      envKey: 'TIKTOK_CLIENT_ID, TIKTOK_CLIENT_SECRET',
    },
    {
      title: 'Safe Browser Engine (Playwright)',
      category: 'Web Automation',
      icon: Compass,
      iconColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      connected: integrations?.browser.connected ?? true,
      mode: 'Headless Safe Sandbox',
      desc: 'Navigates URLs, extracts web research with citations, and searches Google/Bing while respecting login boundaries.',
      envKey: 'HEADLESS_BROWSER, BROWSER_TIMEOUT_MS',
    },
    {
      title: 'Sandboxed File System',
      category: 'Local Storage',
      icon: FolderOpen,
      iconColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      connected: true,
      mode: 'Local Sandboxed /workspace',
      desc: 'Provides secure read/write capabilities for HTML, Python, JS, and project assets with gated deletion checks.',
      envKey: 'DATABASE_URL',
    },
    {
      title: 'Google Account Bridge',
      category: 'Cloud Services',
      icon: Mail,
      iconColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      connected: integrations?.google.connected ?? true,
      mode: integrations?.google.accountEmail || 'mohammedbilalkhanpathan572@gmail.com',
      desc: 'Verified email identity for automated reports and personal notifications.',
      envKey: 'GOOGLE_OAUTH_CLIENT_ID',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500/10 to-indigo-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/10">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Authorized Integrations Hub</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Securely connected services. Environment variables protect all secrets server-side.
            </p>
          </div>
        </div>

        <button
          onClick={loadStatus}
          className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {cards.map((c, i) => (
          <div
            key={i}
            className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${c.iconColor}`}>
                  <c.icon className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Connected</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                  {c.category}
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">{c.title}</h3>
                <p className="text-xs text-cyan-400/90 font-mono mt-1">{c.mode}</p>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">{c.desc}</p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-mono text-[11px] flex items-center gap-1">
                <Key className="w-3 h-3" />
                {c.envKey}
              </span>
              <span className="text-emerald-400 font-semibold text-[11px]">Ready</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
