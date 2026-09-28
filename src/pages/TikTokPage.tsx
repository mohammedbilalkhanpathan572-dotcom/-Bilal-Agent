import React, { useState, useEffect } from 'react';
import {
  Video,
  Heart,
  MessageSquare,
  Sparkles,
  Check,
  Send,
  RefreshCw,
  Edit2,
  ShieldCheck,
  Smile,
  AlertCircle,
} from 'lucide-react';
import { api } from '../services/api';

interface TikTokPageProps {
  onTriggerCommand: (cmd: string) => void;
}

export const TikTokPage: React.FC<TikTokPageProps> = ({ onTriggerCommand }) => {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedText, setEditedText] = useState('');

  const loadComments = async () => {
    try {
      setLoading(true);
      const data = await api.getTikTokComments();
      setComments(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, []);

  const handleEditClick = (comment: any) => {
    setEditingId(comment.id);
    setEditedText(comment.suggestedReply || '');
  };

  const handleSaveEdit = (commentId: string) => {
    setComments((prev) =>
      prev.map((c) => (c.id === commentId ? { ...c, suggestedReply: editedText } : c))
    );
    setEditingId(null);
  };

  const handleApproveAndPost = (comment: any) => {
    const textToPost = comment.suggestedReply || 'Thanks for following!';
    onTriggerCommand(`Reply approve for TikTok comment ${comment.id}: "${textToPost}"`);
  };

  const handleGenerateFunnyReply = (commentId: string) => {
    onTriggerCommand(`Generate a funny reply for TikTok comment ${commentId}`);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Account Status Card */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center shadow-lg shadow-pink-500/10">
            <Video className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">TikTok Creator Integration</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-pink-500/20 text-pink-400 border border-pink-500/30">
                @bilal_gaming_tech
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              24.5K Followers • 189.4K Likes • Official Display API & Safe Moderation Sandbox
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadComments}
            className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
            title="Refresh Comments"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => onTriggerCommand('Check my latest TikTok comments')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-pink-500/20 transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Analyze Comments with AI
          </button>
        </div>
      </div>

      {/* Comment Moderation Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-pink-400" />
            Recent Audience Comments ({comments.length})
          </h3>
          <span className="text-xs text-slate-400">
            AI generates suggested replies • Approval required before posting
          </span>
        </div>

        <div className="space-y-4">
          {comments.map((comment) => {
            const isEditing = editingId === comment.id;
            const isReplied = comment.status === 'replied';

            return (
              <div
                key={comment.id}
                className={`p-5 rounded-2xl bg-slate-900/80 border transition-all ${
                  isReplied
                    ? 'border-emerald-500/30 bg-emerald-950/10'
                    : 'border-slate-800 hover:border-pink-500/30'
                }`}
              >
                {/* Comment Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={comment.avatar}
                      alt={comment.authorNickname}
                      className="w-10 h-10 rounded-full object-cover border border-slate-700"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">{comment.authorNickname}</h4>
                        <span className="text-xs text-slate-500 font-mono">{comment.authorUsername}</span>
                      </div>
                      <p className="text-[11px] text-cyan-400/90 font-mono mt-0.5">
                        Video: {comment.videoTitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="flex items-center gap-1 text-pink-400 font-semibold">
                      <Heart className="w-3.5 h-3.5 fill-pink-400/20" />
                      {comment.likes}
                    </span>
                    <span className="text-slate-600">•</span>
                    <span>{comment.timestamp}</span>
                  </div>
                </div>

                {/* Comment Body */}
                <div className="my-3 p-3.5 rounded-xl bg-slate-950 border border-slate-850 text-sm text-slate-200">
                  "{comment.text}"
                </div>

                {/* Suggested Reply Box */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-indigo-500/20 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-indigo-400 flex items-center gap-1.5 uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                      AI Suggested Response:
                    </span>

                    {!isReplied && !isEditing && (
                      <button
                        onClick={() => handleGenerateFunnyReply(comment.id)}
                        className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                      >
                        <Smile className="w-3 h-3" />
                        Make it Funny
                      </button>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="space-y-2">
                      <textarea
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                        rows={2}
                        className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-pink-500"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1 rounded-md text-xs text-slate-400 hover:text-white"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveEdit(comment.id)}
                          className="px-3 py-1 rounded-md text-xs font-bold bg-pink-500 text-white"
                        >
                          Save Edit
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-300 leading-relaxed font-mono">
                      "{comment.suggestedReply || 'No reply generated yet.'}"
                    </p>
                  )}

                  {isReplied && (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold pt-1">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Published to TikTok: "{comment.replyPosted}"</span>
                    </div>
                  )}

                  {/* Actions Workflow: [Edit] [Approve] [Post] */}
                  {!isReplied && (
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                      <button
                        onClick={() => handleEditClick(comment)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <Edit2 className="w-3 h-3" />
                        Edit
                      </button>

                      <button
                        onClick={() => handleApproveAndPost(comment)}
                        className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-pink-500/25 transition cursor-pointer"
                      >
                        <Send className="w-3 h-3" />
                        Approve & Post Reply
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
