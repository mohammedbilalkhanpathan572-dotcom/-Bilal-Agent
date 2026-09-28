import React from 'react';
import { CheckCircle2, Circle, Loader2, AlertCircle, Clock, ShieldAlert } from 'lucide-react';
import { AgentStep } from '../types';

interface TaskProgressPanelProps {
  currentCommand?: string;
  steps: AgentStep[];
  isProcessing: boolean;
  onClear?: () => void;
}

export const TaskProgressPanel: React.FC<TaskProgressPanelProps> = ({
  currentCommand,
  steps,
  isProcessing,
  onClear,
}) => {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="w-full rounded-2xl bg-slate-900/80 border border-slate-800 p-5 shadow-xl backdrop-blur-md transition-all">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <h3 className="font-semibold text-sm text-slate-200">
            {isProcessing ? 'Agent Executing Task Pipeline...' : 'Task Pipeline Completed'}
          </h3>
        </div>
        {currentCommand && (
          <span className="text-xs font-mono text-cyan-400/90 truncate max-w-xs px-2.5 py-1 rounded bg-slate-800/80">
            "{currentCommand}"
          </span>
        )}
      </div>

      {/* Step List */}
      <div className="space-y-3">
        {steps.map((step, idx) => {
          const isCompleted = step.status === 'completed';
          const isRunning = step.status === 'running' || (isProcessing && idx === steps.length - 1);
          const isWaiting = step.status === 'waiting_approval';
          const isFailed = step.status === 'failed';

          return (
            <div
              key={step.id || idx}
              className={`flex items-start gap-3 p-2.5 rounded-xl transition-all duration-300 ${
                isRunning
                  ? 'bg-cyan-500/10 border border-cyan-500/30'
                  : isWaiting
                  ? 'bg-amber-500/10 border border-amber-500/30'
                  : isCompleted
                  ? 'bg-slate-800/40 text-slate-300'
                  : 'text-slate-500'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : isRunning ? (
                  <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                ) : isWaiting ? (
                  <ShieldAlert className="w-4 h-4 text-amber-400 animate-bounce" />
                ) : isFailed ? (
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-600" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium leading-relaxed">
                    {step.title}
                  </p>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 ml-2">
                    {isWaiting ? 'Requires Approval' : step.status}
                  </span>
                </div>
                {step.error && (
                  <p className="text-xs text-rose-400 mt-1 font-mono">{step.error}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
