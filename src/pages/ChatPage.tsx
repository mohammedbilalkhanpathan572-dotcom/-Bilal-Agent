import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Mic,
  MicOff,
  Trash2,
  Volume2,
  Sparkles,
  User,
  ExternalLink,
  Code,
  ShieldAlert,
  Loader2,
} from 'lucide-react';
import { Message, AgentExecutionResult, PendingApproval } from '../types';
import { CodeSandboxPreview } from '../components/CodeSandboxPreview';

interface ChatPageProps {
  messages: Message[];
  onSendMessage: (text: string) => Promise<AgentExecutionResult | null>;
  onClearChat: () => void;
  isProcessing: boolean;
  isListening: boolean;
  onToggleListening: () => void;
  onSpeak: (text: string) => void;
  pendingApproval: PendingApproval | null;
  onApproveAction: (id: string) => void;
  onRejectAction: (id: string) => void;
}

export const ChatPage: React.FC<ChatPageProps> = ({
  messages,
  onSendMessage,
  onClearChat,
  isProcessing,
  isListening,
  onToggleListening,
  onSpeak,
  pendingApproval,
  onApproveAction,
  onRejectAction,
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isProcessing) return;
    const msg = inputText.trim();
    setInputText('');
    await onSendMessage(msg);
  };

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-140px)] flex flex-col rounded-3xl bg-slate-900/60 border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-md">
      {/* Chat Header */}
      <div className="px-6 py-3.5 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-md shadow-cyan-500/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">Bilal AI Assistant</h3>
            <p className="text-[11px] text-slate-400 font-mono">Autonomous Execution Engine</p>
          </div>
        </div>

        <button
          onClick={onClearChat}
          title="Clear Conversation History"
          className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs flex items-center gap-1.5 transition cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5 text-rose-400" />
          <span>Clear Chat</span>
        </button>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const isSystem = msg.sender === 'system';

          if (isSystem) {
            return (
              <div key={msg.id} className="text-center my-2">
                <span className="text-xs px-3 py-1 rounded-full bg-slate-800/80 text-slate-400 font-mono">
                  {msg.text}
                </span>
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className={`flex gap-3.5 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-md shadow-cyan-500/20 mt-1">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              )}

              <div
                className={`max-w-2xl rounded-2xl p-4.5 space-y-3 ${
                  isUser
                    ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white rounded-br-xs shadow-lg shadow-cyan-500/15'
                    : 'bg-slate-950/90 border border-slate-800 text-slate-200 rounded-bl-xs shadow-xl'
                }`}
              >
                {/* Message Header */}
                <div className="flex items-center justify-between gap-4 text-[11px] opacity-75 pb-1 border-b border-white/10">
                  <span className="font-semibold">{isUser ? 'Bilal' : 'Bilal AI Agent'}</span>
                  <div className="flex items-center gap-2">
                    {!isUser && (
                      <button
                        onClick={() => onSpeak(msg.text)}
                        title="Listen to this response"
                        className="hover:text-cyan-300 transition cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <span className="font-mono text-[10px]">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                {/* Message Text Content */}
                <div className="text-sm leading-relaxed whitespace-pre-wrap">
                  {msg.text}
                </div>

                {/* Embedded Tool Call Card if available */}
                {msg.toolCall && (
                  <div className="mt-3 p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-cyan-400 uppercase font-semibold">
                        Tool Executed: {msg.toolCall.tool}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                          msg.toolCall.status === 'completed'
                            ? 'bg-emerald-500/15 text-emerald-400'
                            : msg.toolCall.status === 'waiting_approval'
                            ? 'bg-amber-500/15 text-amber-400'
                            : 'bg-rose-500/15 text-rose-400'
                        }`}
                      >
                        {msg.toolCall.status}
                      </span>
                    </div>

                    {/* If result includes generated code */}
                    {msg.toolCall.result?.code && (
                      <div className="mt-2">
                        <CodeSandboxPreview
                          code={msg.toolCall.result.code}
                          language={msg.toolCall.result.language || 'html'}
                          title="Interactive Code Preview"
                        />
                      </div>
                    )}

                    {/* Citations / Web Results */}
                    {msg.toolCall.result?.results && Array.isArray(msg.toolCall.result.results) && (
                      <div className="space-y-1.5 mt-2">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase block">
                          Verified References:
                        </span>
                        {msg.toolCall.result.results.map((r: any, i: number) => (
                          <div key={i} className="p-2 rounded bg-slate-950 border border-slate-850 text-slate-300">
                            <a
                              href={r.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-cyan-400 font-semibold hover:underline flex items-center gap-1"
                            >
                              {r.title}
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                            <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{r.snippet}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Inline Confirmation Card for sensitive actions awaiting approval */}
                {msg.approvalId && pendingApproval && pendingApproval.id === msg.approvalId && (
                  <div className="mt-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-3">
                    <div className="flex items-center gap-2 text-amber-400 font-bold">
                      <ShieldAlert className="w-4 h-4" />
                      <span>Approval Required for Execution</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      {pendingApproval.description}
                    </p>
                    <div className="flex items-center gap-2 justify-end pt-1">
                      <button
                        onClick={() => onRejectAction(pendingApproval.id)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => onApproveAction(pendingApproval.id)}
                        className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition shadow-md shadow-emerald-500/20 cursor-pointer"
                      >
                        Authorize & Send
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4 text-slate-300" />
                </div>
              )}
            </div>
          );
        })}

        {isProcessing && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 text-slate-300 flex items-center gap-2 text-xs">
              <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
              <span>Bilal AI is reasoning and executing tools...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSubmit} className="p-4 bg-slate-950 border-t border-slate-800 flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleListening}
          className={`p-3 rounded-2xl transition cursor-pointer ${
            isListening
              ? 'bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-500/40'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40'
          }`}
          title={isListening ? 'Stop microphone' : 'Speak command with voice'}
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder='Type a command in English, Urdu, or Roman Urdu (e.g. "Ahmed ko message draft karo")...'
          disabled={isProcessing}
          className="flex-1 px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/30"
        />

        <button
          type="submit"
          disabled={!inputText.trim() || isProcessing}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-40 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>
    </div>
  );
};
