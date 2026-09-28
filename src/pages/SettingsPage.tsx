import React, { useState, useEffect } from 'react';
import { Settings, ShieldCheck, Globe, Volume2, Cpu, FileText, Check, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import { UserSettings, AuditLog } from '../types';

interface SettingsPageProps {
  currentSettings: UserSettings | null;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  currentSettings,
  onUpdateSettings,
}) => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [language, setLanguage] = useState<'English' | 'Urdu' | 'Roman Urdu'>(
    currentSettings?.language || 'English'
  );
  const [model, setModel] = useState(currentSettings?.model || 'gemini-3.8-flash');
  const [speechRate, setSpeechRate] = useState(currentSettings?.speechRate || 1.0);
  const [autoSpeak, setAutoSpeak] = useState(currentSettings?.autoSpeak ?? true);
  const [approvalRequired, setApprovalRequired] = useState(
    currentSettings?.approvalRequiredForSensitive ?? true
  );

  const loadLogs = async () => {
    try {
      const data = await api.getAuditLogs();
      setLogs(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const handleSave = async () => {
    onUpdateSettings({
      language,
      model,
      speechRate,
      autoSpeak,
      approvalRequiredForSensitive: approvalRequired,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 text-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/10">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Agent Preferences & Security</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Customize language, voice output, AI models, and audit logs.
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-lg shadow-cyan-500/20"
        >
          {saveSuccess ? <Check className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
          <span>{saveSuccess ? 'Settings Saved' : 'Save Preferences'}</span>
        </button>
      </div>

      {/* Main Settings Form */}
      <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 space-y-6">
        {/* Language Selection */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400" />
            <h3 className="font-bold text-sm text-white">Voice & Command Language</h3>
          </div>
          <p className="text-xs text-slate-400">
            Bilal AI has native understanding for Roman Urdu (e.g. "Chrome kholo aur PUBG sensitivity search karo"), Urdu script, and English.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(['English', 'Roman Urdu', 'Urdu'] as const).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setLanguage(lang)}
                className={`p-3.5 rounded-2xl border text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                  language === lang
                    ? 'bg-cyan-500/15 border-cyan-500 text-cyan-300 shadow-md shadow-cyan-500/10'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span>{lang}</span>
                {language === lang && <Check className="w-3.5 h-3.5 text-cyan-400" />}
              </button>
            ))}
          </div>
        </div>

        {/* AI Model Core */}
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-400" />
            <h3 className="font-bold text-sm text-white">AI Model Engine</h3>
          </div>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-400"
          >
            <option value="gemini-3.8-flash">gemini-3.8-flash (Recommended: Ultra-fast Autonomous Reasoning & Tool Calling)</option>
            <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (Deep Reasoning & STEM Tasks)</option>
            <option value="gemini-flash-latest">gemini-flash-latest (General Fast Flash Model)</option>
          </select>
        </div>

        {/* Speech Output Settings */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-emerald-400" />
            <h3 className="font-bold text-sm text-white">Spoken Audio Responses</h3>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-semibold text-slate-200">Automatically Speak Responses</h4>
              <p className="text-[11px] text-slate-400">Agent speaks out results after completing tools</p>
            </div>
            <input
              type="checkbox"
              checked={autoSpeak}
              onChange={(e) => setAutoSpeak(e.target.checked)}
              className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Speech Speed:</span>
              <span className="font-mono text-cyan-400">{speechRate}x</span>
            </div>
            <input
              type="range"
              min="0.75"
              max="1.5"
              step="0.05"
              value={speechRate}
              onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Security Approval Gate */}
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-sm text-white">Security & Permission Gatekeeper</h3>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20">
            <div>
              <h4 className="text-xs font-bold text-amber-300">Require Confirmation for Sensitive Actions</h4>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Always prompt confirmation card before sending WhatsApp messages, posting to TikTok, or deleting files.
              </p>
            </div>
            <input
              type="checkbox"
              checked={approvalRequired}
              onChange={(e) => setApprovalRequired(e.target.checked)}
              className="w-4 h-4 accent-amber-400 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Security Audit Trail */}
      <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-400" />
            <h3 className="font-bold text-sm text-white">Audit Logs ({logs.length})</h3>
          </div>
          <button
            onClick={loadLogs}
            className="text-slate-400 hover:text-white p-1 cursor-pointer"
            title="Refresh logs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="max-h-60 overflow-y-auto space-y-2 font-mono text-xs">
          {logs.map((log) => (
            <div
              key={log.id}
              className="p-2.5 rounded-xl bg-slate-950 border border-slate-850 flex items-center justify-between gap-3 text-slate-300"
            >
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-500">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
                <span className="font-bold text-cyan-400">{log.action}</span>
                <span className="text-slate-400 font-mono text-[11px]">({log.tool})</span>
              </div>
              <span
                className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                  log.status === 'success'
                    ? 'bg-emerald-500/15 text-emerald-400'
                    : log.status === 'requires_approval'
                    ? 'bg-amber-500/15 text-amber-400'
                    : 'bg-rose-500/15 text-rose-400'
                }`}
              >
                {log.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
