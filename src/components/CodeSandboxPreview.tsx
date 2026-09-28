import React, { useState } from 'react';
import { Code, Eye, Copy, Check, ExternalLink, RefreshCw } from 'lucide-react';

interface CodeSandboxPreviewProps {
  code: string;
  language?: string;
  title?: string;
}

export const CodeSandboxPreview: React.FC<CodeSandboxPreviewProps> = ({
  code,
  language = 'html',
  title = 'Live Code Sandbox',
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [copied, setCopied] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isHtml = language.toLowerCase() === 'html' || code.includes('<!DOCTYPE') || code.includes('<html');

  return (
    <div className="w-full rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl">
      {/* Sandbox Header */}
      <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-xs font-semibold text-slate-300 font-mono flex items-center gap-1.5">
            {title}
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-400">
              {language}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Tab Switcher */}
          {isHtml && (
            <div className="flex items-center p-0.5 rounded-lg bg-slate-850 bg-slate-800/80 border border-slate-700/50 text-xs">
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1 rounded-md transition font-medium flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'preview'
                    ? 'bg-cyan-500 text-slate-950 font-semibold shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                Live Preview
              </button>
              <button
                onClick={() => setActiveTab('code')}
                className={`px-3 py-1 rounded-md transition font-medium flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'code'
                    ? 'bg-cyan-500 text-slate-950 font-semibold shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                Source Code
              </button>
            </div>
          )}

          {isHtml && activeTab === 'preview' && (
            <button
              onClick={() => setRefreshKey((k) => k + 1)}
              title="Refresh Preview"
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={copyCode}
            className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Content Body */}
      {activeTab === 'preview' && isHtml ? (
        <div className="relative w-full h-[460px] bg-slate-950">
          <iframe
            key={refreshKey}
            srcDoc={code}
            title="Generated Project Live Sandbox"
            className="w-full h-full border-none"
            sandbox="allow-scripts allow-same-origin allow-modals"
          />
        </div>
      ) : (
        <div className="relative p-4 max-h-[460px] overflow-auto bg-slate-950/90 font-mono text-xs text-slate-300 leading-relaxed">
          <pre className="whitespace-pre-wrap">{code}</pre>
        </div>
      )}
    </div>
  );
};
