import React from 'react';
import { ShieldAlert, Check, X, AlertTriangle, Send, Trash2, Share2 } from 'lucide-react';
import { PendingApproval } from '../types';

interface ApprovalModalProps {
  approval: PendingApproval | null;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  isSubmitting?: boolean;
}

export const ApprovalModal: React.FC<ApprovalModalProps> = ({
  approval,
  onApprove,
  onReject,
  isSubmitting = false,
}) => {
  if (!approval) return null;

  const isWhatsApp = approval.tool === 'whatsapp_send';
  const isTikTok = approval.tool === 'tiktok_post_reply';
  const isDelete = approval.tool === 'file_delete';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-amber-500/40 p-6 shadow-2xl shadow-amber-500/10">
        {/* Header Badge */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            {isWhatsApp ? (
              <Send className="w-5 h-5" />
            ) : isTikTok ? (
              <Share2 className="w-5 h-5" />
            ) : isDelete ? (
              <Trash2 className="w-5 h-5 text-rose-400" />
            ) : (
              <ShieldAlert className="w-5 h-5" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-100">
                Security Authorization Required
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                Sensitive Action
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Bilal AI paused this command pending your explicit verification.
            </p>
          </div>
        </div>

        {/* Content Box */}
        <div className="my-5 p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-sm">
          {isWhatsApp && (
            <div className="space-y-2">
              <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                WhatsApp Outbound Message
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
                <span>Recipient:</span>
                <span className="text-slate-200 font-semibold">{approval.params?.recipient || 'Contact'}</span>
              </div>
              <div className="mt-2">
                <span className="text-xs text-slate-400 block mb-1">Message content:</span>
                <p className="p-3 rounded-lg bg-slate-900 text-slate-200 border border-slate-800 font-mono text-xs whitespace-pre-wrap">
                  {approval.params?.message || approval.description}
                </p>
              </div>
            </div>
          )}

          {isTikTok && (
            <div className="space-y-2">
              <div className="text-xs font-semibold text-pink-400 uppercase tracking-wider">
                TikTok Comment Public Reply
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
                <span>Comment ID:</span>
                <span className="text-slate-200 font-mono text-xs">{approval.params?.commentId}</span>
              </div>
              <div className="mt-2">
                <span className="text-xs text-slate-400 block mb-1">Public Reply Content:</span>
                <p className="p-3 rounded-lg bg-slate-900 text-slate-200 border border-slate-800 font-mono text-xs whitespace-pre-wrap">
                  {approval.params?.replyText}
                </p>
              </div>
            </div>
          )}

          {isDelete && (
            <div className="space-y-2">
              <div className="text-xs font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                Permanent File Deletion
              </div>
              <p className="text-xs text-slate-300">
                Are you sure you want to permanently delete{' '}
                <span className="text-rose-400 font-bold font-mono">
                  "{approval.params?.fileName}"
                </span>{' '}
                from your workspace? This action cannot be reversed.
              </p>
            </div>
          )}

          {!isWhatsApp && !isTikTok && !isDelete && (
            <p className="text-slate-300 whitespace-pre-wrap">{approval.description}</p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            onClick={() => onReject(approval.id)}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition flex items-center gap-1.5 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            Cancel
          </button>
          <button
            onClick={() => onApprove(approval.id)}
            disabled={isSubmitting}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-lg cursor-pointer ${
              isDelete
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-emerald-500/25'
            }`}
          >
            <Check className="w-4 h-4 stroke-[3]" />
            {isDelete ? 'Confirm Delete' : isWhatsApp ? 'Authorize & Send' : isTikTok ? 'Approve & Post' : 'Confirm Action'}
          </button>
        </div>
      </div>
    </div>
  );
};
