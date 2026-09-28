import { ToolDefinition } from '../agent/types';
import { tiktokService } from '../integrations/tiktokService';

export const tiktokListCommentsTool: ToolDefinition = {
  name: 'tiktok_list_comments',
  category: 'social',
  description: 'List recent comments on your TikTok gaming and tech videos, analyze user sentiment, and view pending interactions.',
  permissionLevel: 'low_risk',
  inputSchema: {
    type: 'object',
    properties: {
      filter: { type: 'string', description: 'pending, all, or video title keyword', default: 'all' },
    },
  },
  execute: async () => {
    const comments = tiktokService.getComments();
    return {
      totalComments: comments.length,
      pendingCount: comments.filter((c) => c.status === 'pending_review').length,
      comments: comments.map((c) => ({
        id: c.id,
        author: c.authorUsername,
        videoTitle: c.videoTitle,
        commentText: c.text,
        likes: c.likes,
        suggestedReply: c.suggestedReply,
        status: c.status,
      })),
      summary: `Found ${comments.length} TikTok comments across your videos. ${comments.filter((c) => c.status === 'pending_review').length} awaiting reply approval.`,
    };
  },
};

export const tiktokReplySuggestTool: ToolDefinition = {
  name: 'tiktok_suggest_reply',
  category: 'social',
  description: 'Generate an AI suggested reply or funny response to a specific TikTok comment.',
  permissionLevel: 'low_risk',
  inputSchema: {
    type: 'object',
    properties: {
      commentId: { type: 'string', description: 'TikTok comment ID', default: 'tt-c1' },
      style: { type: 'string', description: 'helpful, funny, or brief', default: 'helpful' },
    },
  },
  execute: async (params: { commentId?: string; style?: string }) => {
    const comment = tiktokService.getCommentById(params.commentId || 'tt-c1') || tiktokService.getComments()[0];
    let reply = comment.suggestedReply || 'Thanks for following!';

    if (params.style === 'funny') {
      reply = `Bro with this gyro sensitivity your phone will turn 360 before the enemy even reloads! 😂 Try 300% on Red Dot.`;
    }

    return {
      commentId: comment.id,
      author: comment.authorUsername,
      originalComment: comment.text,
      suggestedReply: reply,
      summary: `Suggested reply for @${comment.authorUsername}: "${reply}"`,
    };
  },
};

export const tiktokPostReplyTool: ToolDefinition = {
  name: 'tiktok_post_reply',
  category: 'social',
  description: 'Post a reply to a TikTok comment. (Sensitive: Requires user approval before publishing to live TikTok account).',
  permissionLevel: 'sensitive',
  inputSchema: {
    type: 'object',
    properties: {
      commentId: { type: 'string', description: 'TikTok comment ID', required: true },
      replyText: { type: 'string', description: 'The approved text to post', required: true },
    },
    required: ['commentId', 'replyText'],
  },
  execute: async (params: { commentId: string; replyText: string }) => {
    const result = await tiktokService.postReply(params.commentId, params.replyText);
    return {
      status: 'posted',
      commentId: result.commentId,
      replyPublished: result.replyText,
      message: result.message,
      summary: `Published reply on TikTok to comment ${params.commentId}: "${params.replyText}".`,
    };
  },
};
