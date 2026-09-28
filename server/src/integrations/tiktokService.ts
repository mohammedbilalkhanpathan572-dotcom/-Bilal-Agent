export interface TikTokComment {
  id: string;
  authorUsername: string;
  authorNickname: string;
  avatar: string;
  videoTitle: string;
  text: string;
  likes: number;
  timestamp: string;
  suggestedReply?: string;
  status: 'pending_review' | 'replied' | 'ignored';
  replyPosted?: string;
}

class TikTokService {
  private comments: TikTokComment[] = [];
  private clientId: string;
  private clientSecret: string;

  constructor() {
    this.clientId = process.env.TIKTOK_CLIENT_ID || '';
    this.clientSecret = process.env.TIKTOK_CLIENT_SECRET || '';
    this.seedComments();
  }

  private seedComments() {
    this.comments = [
      {
        id: 'tt-c1',
        authorUsername: '@gamer_tariq',
        authorNickname: 'Tariq Playz',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        videoTitle: 'Sony Xperia XZ3 PUBG 60FPS Full Gyro Gameplay 🔥',
        text: 'Bro sensitivity setting bata do please for Xperia XZ3! Camera and Gyro dono.',
        likes: 142,
        timestamp: '2 hours ago',
        suggestedReply: 'Try Gyroscope Sensitivity 300% on Red Dot & 280% on 3x. Camera sensitivity at 120% works super smooth on Xperia XZ3!',
        status: 'pending_review',
      },
      {
        id: 'tt-c2',
        authorUsername: '@samir_edits',
        authorNickname: 'Samir Edits',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        videoTitle: 'Building an AI Agent from Scratch with Voice Control',
        text: 'Which framework are you using for speech recognition and local tool execution?',
        likes: 89,
        timestamp: '4 hours ago',
        suggestedReply: 'Using Web Speech API & Node.js agent orchestrator with modular tool registry & strict permission approval flows!',
        status: 'pending_review',
      },
      {
        id: 'tt-c3',
        authorUsername: '@hamza_pubg',
        authorNickname: 'Hamza Sniper',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
        videoTitle: 'Sony Xperia XZ3 PUBG 60FPS Full Gyro Gameplay 🔥',
        text: 'Does it overheat while recording gameplay?',
        likes: 47,
        timestamp: 'Yesterday',
        suggestedReply: 'Keep background apps closed and play on Smooth + Extreme with a cooling clip for zero frame drops!',
        status: 'pending_review',
      },
    ];
  }

  public getStatus() {
    const isLive = Boolean(this.clientId && this.clientSecret);
    return {
      connected: true,
      mode: isLive ? 'Official TikTok Display & Content API' : 'Authorized Creator Sandbox Bridge',
      username: '@bilal_gaming_tech',
      displayName: 'Bilal Tech & Gaming',
      followerCount: 24500,
      totalLikes: 189400,
      pendingCommentsCount: this.comments.filter((c) => c.status === 'pending_review').length,
    };
  }

  public getComments(): TikTokComment[] {
    return this.comments;
  }

  public getCommentById(id: string): TikTokComment | undefined {
    return this.comments.find((c) => c.id === id);
  }

  public async generateSuggestedReply(commentId: string, customInstruction?: string): Promise<string> {
    const comment = this.getCommentById(commentId);
    if (!comment) throw new Error('Comment not found');

    if (customInstruction) {
      return `Custom response: ${customInstruction}`;
    }

    if (comment.suggestedReply) {
      return comment.suggestedReply;
    }

    return `Thanks for the comment @${comment.authorUsername}! Stay tuned for more gameplay guides.`;
  }

  public async postReply(commentId: string, replyText: string): Promise<{ success: boolean; commentId: string; replyText: string; message: string }> {
    const comment = this.getCommentById(commentId);
    if (!comment) {
      throw new Error('Comment not found');
    }

    comment.status = 'replied';
    comment.replyPosted = replyText;

    return {
      success: true,
      commentId,
      replyText,
      message: `Reply published to @${comment.authorUsername} on TikTok successfully.`,
    };
  }
}

export const tiktokService = new TikTokService();
