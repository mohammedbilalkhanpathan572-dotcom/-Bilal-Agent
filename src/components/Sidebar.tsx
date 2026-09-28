import React from 'react';
import {
  LayoutDashboard,
  MessageSquare,
  Mic,
  CalendarCheck,
  MessageCircle,
  Video,
  Compass,
  FolderOpen,
  Code2,
  Brain,
  Layers,
  Settings,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'chat'
  | 'voice'
  | 'tasks'
  | 'whatsapp'
  | 'tiktok'
  | 'browser'
  | 'files'
  | 'coding'
  | 'memory'
  | 'integrations'
  | 'settings';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  pendingApprovalsCount?: number;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  pendingApprovalsCount = 0,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const navItems: { id: NavTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'chat', label: 'Chat Assistant', icon: MessageSquare },
    { id: 'voice', label: 'Voice Agent', icon: Mic },
    { id: 'tasks', label: 'Tasks & Schedule', icon: CalendarCheck },
    { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
    { id: 'tiktok', label: 'TikTok', icon: Video },
    { id: 'browser', label: 'Browser Agent', icon: Compass },
    { id: 'files', label: 'Workspace Files', icon: FolderOpen },
    { id: 'coding', label: 'Coding Studio', icon: Code2 },
    { id: 'memory', label: 'Memory Vault', icon: Brain },
    { id: 'integrations', label: 'Integrations', icon: Layers },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs md:hidden"
        />
      )}

      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 flex flex-col bg-[#080c14] border-r border-slate-800/80 transition-transform duration-300 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 flex items-center justify-between border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-extrabold tracking-tight text-white flex items-center gap-1.5">
                Bilal AI <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">PRO</span>
              </h1>
              <p className="text-[11px] text-slate-400">Autonomous Personal Agent</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin scrollbar-thumb-slate-800">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Control Center
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/15 via-indigo-500/15 to-transparent text-cyan-300 border-l-3 border-cyan-400 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.id === 'dashboard' && pendingApprovalsCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* Security & System Info Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
          <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Allowlisted Tool Gate</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              Strict permission gates active. Sensitive commands require manual approval.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
