import React, { useState, useEffect } from 'react';
import { Brain, Plus, Search, Trash2, Sparkles, ShieldCheck, Tag } from 'lucide-react';
import { api } from '../services/api';
import { Memory } from '../types';

interface MemoryPageProps {
  onTriggerCommand: (cmd: string) => void;
}

export const MemoryPage: React.FC<MemoryPageProps> = ({ onTriggerCommand }) => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newCategory, setNewCategory] = useState<Memory['category']>('preferences');

  const loadMemories = async () => {
    try {
      const data = await api.getMemories(search);
      setMemories(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadMemories();
  }, [search]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim() || !newValue.trim()) return;
    try {
      await api.createMemory({
        key: newKey.trim(),
        value: newValue.trim(),
        category: newCategory,
      });
      setNewKey('');
      setNewValue('');
      setIsModalOpen(false);
      loadMemories();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteMemory(id);
      loadMemories();
    } catch (e) {
      console.error(e);
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to clear all stored long-term memory?')) {
      try {
        await api.clearAllMemories();
        loadMemories();
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shadow-lg shadow-purple-500/10">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">Long-term Memory Vault</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
                Persistent & Audited
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Approved preferences, project aliases, and device settings. Passwords & API keys strictly blocked.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleClearAll}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 text-xs font-semibold transition cursor-pointer"
          >
            Clear All
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-500/20 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Memory
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search stored memory by key, preference, or category..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
        />
      </div>

      {/* Memory Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {memories.map((mem) => (
          <div
            key={mem.id}
            className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/30 transition space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  {mem.category}
                </span>
                <button
                  onClick={() => handleDelete(mem.id)}
                  className="text-slate-500 hover:text-rose-400 p-1 transition cursor-pointer"
                  title="Delete memory"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <h4 className="text-sm font-bold text-white mt-2 font-mono">{mem.key}</h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed bg-slate-950 p-2.5 rounded-xl border border-slate-850">
                {mem.value}
              </p>
            </div>

            <div className="text-[10px] text-slate-500 flex items-center justify-between border-t border-slate-800/80 pt-2 font-mono">
              <span>Confidence: {(mem.confidence * 100).toFixed(0)}%</span>
              <span>Updated: {new Date(mem.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <form
            onSubmit={handleCreate}
            className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-4"
          >
            <h3 className="font-bold text-base text-white">Save New Memory</h3>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Category</label>
              <select
                value={newCategory}
                onChange={(e: any) => setNewCategory(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
              >
                <option value="preferences">Preferences</option>
                <option value="projects">Projects</option>
                <option value="contacts">Contacts / Aliases</option>
                <option value="frequently_used">Frequently Used Commands</option>
                <option value="tool_settings">Tool Settings</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Key Label</label>
              <input
                type="text"
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                placeholder="e.g. pubg_device_model"
                required
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Information / Value</label>
              <textarea
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                rows={3}
                placeholder="e.g. Sony Xperia XZ3 with 60 FPS Smooth display and 300% Gyroscope"
                required
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
              >
                Save Memory
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
