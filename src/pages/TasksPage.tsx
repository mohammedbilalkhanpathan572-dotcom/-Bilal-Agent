import React, { useState, useEffect } from 'react';
import { CalendarCheck, Plus, Clock, Trash2, CheckCircle2, Play, Sparkles, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import { Task } from '../types';

interface TasksPageProps {
  onTriggerCommand: (cmd: string) => void;
}

export const TasksPage: React.FC<TasksPageProps> = ({ onTriggerCommand }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newType, setNewType] = useState<'one_time' | 'recurring'>('one_time');

  const loadTasks = async () => {
    try {
      const data = await api.getTasks();
      setTasks(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newTime.trim()) return;
    try {
      await api.createTask({
        title: newTitle.trim(),
        cronOrTime: newTime.trim(),
        type: newType,
        commandToExecute: newTitle.trim(),
      });
      setNewTitle('');
      setNewTime('');
      setIsModalOpen(false);
      loadTasks();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteTask(id);
      loadTasks();
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleStatus = async (task: Task) => {
    const nextStatus = task.status === 'active' ? 'disabled' : 'active';
    try {
      await api.updateTask(task.id, { status: nextStatus });
      loadTasks();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/10">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Automated Task Scheduler</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Set one-time alarms, natural language reminders, or recurring cron automations.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            New Schedule
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {tasks.map((task) => {
          const isActive = task.status === 'active';
          return (
            <div
              key={task.id}
              className={`p-5 rounded-2xl bg-slate-900/80 border transition flex items-center justify-between flex-wrap gap-4 ${
                isActive ? 'border-slate-800 hover:border-amber-500/30' : 'border-slate-850 opacity-60'
              }`}
            >
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleToggleStatus(task)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition cursor-pointer ${
                    isActive ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-600'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">{task.title}</h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700">
                      {task.type === 'recurring' ? 'Recurring' : 'One-time'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5 font-mono">
                    <span>Scheduled:</span>
                    <span className="text-cyan-400 font-semibold">{task.cronOrTime}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onTriggerCommand(task.commandToExecute || task.title)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-medium flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Play className="w-3 h-3 text-emerald-400" />
                  Run Now
                </button>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for Creating Task */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <form
            onSubmit={handleCreate}
            className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-4"
          >
            <h3 className="font-bold text-base text-white">Create Automated Schedule</h3>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Task Title or Command</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Remind me to record YouTube video"
                required
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Trigger Timing</label>
              <input
                type="text"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                placeholder="e.g. Tomorrow at 10 AM, Every Monday at 9 AM"
                required
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Schedule Type</label>
              <select
                value={newType}
                onChange={(e: any) => setNewType(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              >
                <option value="one_time">One-time Trigger</option>
                <option value="recurring">Recurring Schedule (Weekly / Daily)</option>
              </select>
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
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
              >
                Create Schedule
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
