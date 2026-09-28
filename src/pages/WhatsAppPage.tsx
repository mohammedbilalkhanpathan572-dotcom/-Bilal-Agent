import React, { useState, useEffect } from 'react';
import {
  MessageCircle,
  Send,
  Sparkles,
  CheckCircle2,
  Clock,
  Phone,
  ShieldCheck,
  RefreshCw,
  Search,
  User,
  ArrowRight,
} from 'lucide-react';
import { api } from '../services/api';

interface WhatsAppPageProps {
  onTriggerCommand: (cmd: string) => void;
}

export const WhatsAppPage: React.FC<WhatsAppPageProps> = ({ onTriggerCommand }) => {
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConv, setSelectedConv] = useState<any | null>(null);
  const [draftMessage, setDraftMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await api.getWhatsAppConversations();
      setConversations(data);
      if (data.length > 0 && !selectedConv) {
        setSelectedConv(data[0]);
      } else if (selectedConv) {
        const updated = data.find((c: any) => c.id === selectedConv.id);
        if (updated) setSelectedConv(updated);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleGenerateReply = (intent: string) => {
    if (!selectedConv) return;
    onTriggerCommand(`Ahmed ko WhatsApp message draft karo ke ${intent}`);
  };

  const handleSendDraft = () => {
    if (!draftMessage.trim() || !selectedConv) return;
    onTriggerCommand(`Send this WhatsApp message to ${selectedConv.contactName}: "${draftMessage}"`);
    setDraftMessage('');
  };

  const filteredConversations = conversations.filter(
    (c) =>
      c.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.contactPhone.includes(searchQuery)
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Top Banner & Integration Status */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/10">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">WhatsApp Integration Layer</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Connected & Verified
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Official Meta Graph Cloud API / Authorized Sandbox Bridge. Requires explicit approval before sending.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
            title="Refresh Chats"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => onTriggerCommand('Show me unread WhatsApp messages')}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Summarize Unread with AI
          </button>
        </div>
      </div>

      {/* Main Two-column Chat Workspace */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[580px]">
        {/* Left: Contact List */}
        <div className="rounded-3xl bg-slate-900/70 border border-slate-800 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-800">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search authorized contacts..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 p-2 space-y-1">
            {filteredConversations.map((conv) => {
              const isSelected = selectedConv?.id === conv.id;
              const lastMsg = conv.messages[conv.messages.length - 1];
              return (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConv(conv)}
                  className={`p-3 rounded-2xl transition cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-500/10 border border-emerald-500/30'
                      : 'hover:bg-slate-850 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={conv.avatar}
                        alt={conv.contactName}
                        className="w-10 h-10 rounded-full object-cover border border-slate-700"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                          {conv.contactName}
                          {conv.unreadCount > 0 && (
                            <span className="w-2 h-2 rounded-full bg-emerald-400" />
                          )}
                        </h4>
                        <p className="text-[11px] text-slate-400">{conv.contactPhone}</p>
                      </div>
                    </div>
                    {conv.unreadCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-slate-950">
                        {conv.unreadCount} new
                      </span>
                    )}
                  </div>
                  {lastMsg && (
                    <p className="text-[11px] text-slate-400 truncate mt-2 font-mono">
                      {lastMsg.text}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Active Conversation & AI Draft Assistant */}
        <div className="md:col-span-2 rounded-3xl bg-slate-900/70 border border-slate-800 flex flex-col overflow-hidden">
          {selectedConv ? (
            <>
              {/* Conversation Header */}
              <div className="p-4 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedConv.avatar}
                    alt={selectedConv.contactName}
                    className="w-9 h-9 rounded-full object-cover border border-slate-700"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      {selectedConv.contactName}
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        Authorized
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-400">{selectedConv.contactPhone}</p>
                  </div>
                </div>

                <button
                  onClick={() => onTriggerCommand(`Summarize my conversation with ${selectedConv.contactName}`)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-cyan-300 font-semibold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  Summarize Chat
                </button>
              </div>

              {/* Message List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-950/40">
                {selectedConv.messages.map((m: any) => (
                  <div
                    key={m.id}
                    className={`flex flex-col ${m.isIncoming ? 'items-start' : 'items-end'}`}
                  >
                    <div
                      className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                        m.isIncoming
                          ? 'bg-slate-800 text-slate-100 rounded-bl-xs'
                          : 'bg-emerald-600 text-white rounded-br-xs shadow-md shadow-emerald-500/10'
                      }`}
                    >
                      <p>{m.text}</p>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono mt-1 px-1">
                      {m.timestamp}
                    </span>
                  </div>
                ))}
              </div>

              {/* AI Quick Response Suggestions */}
              <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2 overflow-x-auto">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 shrink-0">
                  AI Quick Replies:
                </span>
                <button
                  onClick={() => setDraftMessage("Assalamu Alaikum! I'm coming in 10 minutes.")}
                  className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500 text-[11px] text-slate-300 whitespace-nowrap cursor-pointer transition"
                >
                  "Coming in 10 minutes"
                </button>
                <button
                  onClick={() => setDraftMessage("Walaikum Assalam! Yes, free for gaming stream tonight.")}
                  className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500 text-[11px] text-slate-300 whitespace-nowrap cursor-pointer transition"
                >
                  "Free for stream tonight"
                </button>
                <button
                  onClick={() => setDraftMessage("Shared the PUBG sensitivity preset in your inbox.")}
                  className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500 text-[11px] text-slate-300 whitespace-nowrap cursor-pointer transition"
                >
                  "Share PUBG sensitivity"
                </button>
              </div>

              {/* Draft Box & Action Trigger */}
              <div className="p-3.5 bg-slate-950 border-t border-slate-800/80 flex items-center gap-2">
                <input
                  type="text"
                  value={draftMessage}
                  onChange={(e) => setDraftMessage(e.target.value)}
                  placeholder={`Draft message to ${selectedConv.contactName}... (Confirmation required)`}
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                />
                <button
                  onClick={handleSendDraft}
                  disabled={!draftMessage.trim()}
                  className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
              Select a conversation to view messages.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
