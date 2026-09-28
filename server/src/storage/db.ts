import fs from 'fs';
import path from 'path';

export interface MessageItem {
  id: string;
  sender: 'user' | 'agent' | 'system';
  text: string;
  timestamp: string;
  toolCall?: {
    tool: string;
    input: any;
    status: 'running' | 'completed' | 'failed' | 'waiting_approval';
    result?: any;
    error?: string;
  };
  approvalId?: string;
  language?: 'en' | 'ur' | 'roman_ur';
}

export interface TaskItem {
  id: string;
  title: string;
  description?: string;
  cronOrTime: string;
  type: 'one_time' | 'recurring';
  status: 'pending' | 'completed' | 'active' | 'disabled';
  createdAt: string;
  scheduledFor: string;
  commandToExecute?: string;
}

export interface MemoryItem {
  id: string;
  category: 'preferences' | 'projects' | 'frequently_used' | 'tool_settings' | 'contacts';
  key: string;
  value: string;
  confidence: number;
  updatedAt: string;
}

export interface PendingApproval {
  id: string;
  tool: string;
  description: string;
  riskLevel: 'sensitive' | 'high_risk';
  params: any;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  commandText: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  action: string;
  tool: string;
  user: string;
  status: 'success' | 'failed' | 'requires_approval' | 'rejected';
  details: any;
}

export interface UserSettings {
  language: 'English' | 'Urdu' | 'Roman Urdu';
  model: string;
  voiceGender: 'male' | 'female';
  speechRate: number;
  autoSpeak: boolean;
  approvalRequiredForSensitive: boolean;
  theme: 'dark' | 'midnight';
}

export interface DatabaseSchema {
  messages: MessageItem[];
  tasks: TaskItem[];
  memories: MemoryItem[];
  pendingApprovals: PendingApproval[];
  auditLogs: AuditLogItem[];
  settings: UserSettings;
  integrations: {
    whatsapp: {
      connected: boolean;
      phoneNumberId: string;
      businessName: string;
      verified: boolean;
      contacts: { id: string; name: string; phone: string; unreadCount: number }[];
    };
    tiktok: {
      connected: boolean;
      username: string;
      displayName: string;
      avatar: string;
      followerCount: number;
    };
    browser: {
      connected: boolean;
      mode: 'playwright' | 'safe_http';
      defaultSearchEngine: string;
    };
    google: {
      connected: boolean;
      accountEmail: string;
    };
  };
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const WORKSPACE_DIR = path.resolve(process.cwd(), 'workspace');
const DB_FILE = path.join(DATA_DIR, 'bilal_agent.json');

const DEFAULT_SETTINGS: UserSettings = {
  language: 'English',
  model: process.env.AI_MODEL || 'gemini-3.8-flash',
  voiceGender: 'male',
  speechRate: 1.0,
  autoSpeak: true,
  approvalRequiredForSensitive: true,
  theme: 'dark',
};

const DEFAULT_DB: DatabaseSchema = {
  messages: [
    {
      id: 'welcome-1',
      sender: 'agent',
      text: "Assalamu Alaikum! I am Bilal AI, your personal autonomous assistant. How can I help you today? You can speak to me in English, Urdu, or Roman Urdu (e.g. 'Chrome kholo aur latest PUBG update search karo').",
      timestamp: new Date().toISOString(),
    },
  ],
  tasks: [
    {
      id: 'task-1',
      title: 'YouTube Video Upload Reminder',
      description: 'Upload latest tech tutorial to YouTube channel',
      cronOrTime: 'Every Monday at 9:00 AM',
      type: 'recurring',
      status: 'active',
      createdAt: new Date().toISOString(),
      scheduledFor: '2026-10-05T09:00:00Z',
      commandToExecute: 'Remind me to upload my YouTube video',
    },
    {
      id: 'task-2',
      title: 'Summarize Daily WhatsApp Pending Messages',
      description: 'Review priority messages from team & Ahmed',
      cronOrTime: 'Daily at 8:00 PM',
      type: 'recurring',
      status: 'active',
      createdAt: new Date().toISOString(),
      scheduledFor: '2026-09-28T20:00:00Z',
      commandToExecute: 'Summarize unread WhatsApp messages',
    },
  ],
  memories: [
    {
      id: 'mem-1',
      category: 'preferences',
      key: 'preferred_device',
      value: 'Sony Xperia XZ3 (PUBG Mobile setup)',
      confidence: 1.0,
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'mem-2',
      category: 'contacts',
      key: 'contact_ahmed',
      value: 'Ahmed Khan (+92 300 1234567) - Project Collaborator',
      confidence: 0.95,
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'mem-3',
      category: 'projects',
      key: 'active_project',
      value: 'Gaming Portfolio & HTML Interactive Web App',
      confidence: 0.9,
      updatedAt: new Date().toISOString(),
    },
  ],
  pendingApprovals: [],
  auditLogs: [
    {
      id: 'audit-init',
      timestamp: new Date().toISOString(),
      action: 'SYSTEM_BOOT',
      tool: 'orchestrator',
      user: 'Bilal',
      status: 'success',
      details: { message: 'Bilal AI Agent Core Engine initialized.' },
    },
  ],
  settings: DEFAULT_SETTINGS,
  integrations: {
    whatsapp: {
      connected: true,
      phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '104829381920',
      businessName: "Bilal's Workspace",
      verified: true,
      contacts: [
        { id: 'c1', name: 'Ahmed', phone: '+92 300 1234567', unreadCount: 2 },
        { id: 'c2', name: 'Ali', phone: '+92 301 9876543', unreadCount: 0 },
        { id: 'c3', name: 'Gaming Squad Group', phone: '+92 302 5550199', unreadCount: 5 },
      ],
    },
    tiktok: {
      connected: true,
      username: '@bilal_gaming_tech',
      displayName: 'Bilal Tech & Gaming',
      avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=120&auto=format&fit=crop&q=80',
      followerCount: 24500,
    },
    browser: {
      connected: true,
      mode: 'playwright',
      defaultSearchEngine: 'Google',
    },
    google: {
      connected: true,
      accountEmail: 'mohammedbilalkhanpathan572@gmail.com',
    },
  },
};

class LocalDatabase {
  private data: DatabaseSchema;

  constructor() {
    this.ensureDirectories();
    this.data = this.load();
    this.seedWorkspace();
  }

  private ensureDirectories() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(WORKSPACE_DIR)) {
      fs.mkdirSync(WORKSPACE_DIR, { recursive: true });
    }
  }

  private seedWorkspace() {
    const readmeFile = path.join(WORKSPACE_DIR, 'README.txt');
    if (!fs.existsSync(readmeFile)) {
      fs.writeFileSync(
        readmeFile,
        'Welcome to Bilal AI Sandboxed Workspace.\nYour generated files, reports, and code scripts are safely kept here.\n',
        'utf-8'
      );
    }
    const sampleWebsite = path.join(WORKSPACE_DIR, 'index.html');
    if (!fs.existsSync(sampleWebsite)) {
      fs.writeFileSync(
        sampleWebsite,
        `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Bilal AI Generated Web Project</title>
  <style>
    body { font-family: system-ui; background: #0f172a; color: #f8fafc; padding: 2rem; }
    h1 { color: #38bdf8; }
  </style>
</head>
<body>
  <h1>Gaming & Tech Hub</h1>
  <p>Created by Bilal AI Assistant. Ready for deployment.</p>
</body>
</html>`,
        'utf-8'
      );
    }
  }

  private load(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        return {
          ...DEFAULT_DB,
          ...parsed,
          settings: { ...DEFAULT_SETTINGS, ...(parsed.settings || {}) },
          integrations: { ...DEFAULT_DB.integrations, ...(parsed.integrations || {}) },
        };
      }
    } catch (err) {
      console.error('Error loading DB file, fallback to default:', err);
    }
    this.save(DEFAULT_DB);
    return DEFAULT_DB;
  }

  private save(data: DatabaseSchema) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving DB file:', err);
    }
  }

  public getDb(): DatabaseSchema {
    return this.data;
  }

  public persist() {
    this.save(this.data);
  }

  public getWorkspacePath(): string {
    return WORKSPACE_DIR;
  }

  // Helper mutations
  public addMessage(msg: Omit<MessageItem, 'id' | 'timestamp'>): MessageItem {
    const item: MessageItem = {
      ...msg,
      id: 'msg-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      timestamp: new Date().toISOString(),
    };
    this.data.messages.push(item);
    this.persist();
    return item;
  }

  public updateMessage(id: string, updates: Partial<MessageItem>) {
    const idx = this.data.messages.findIndex((m) => m.id === id);
    if (idx !== -1) {
      this.data.messages[idx] = { ...this.data.messages[idx], ...updates };
      this.persist();
    }
  }

  public clearMessages() {
    this.data.messages = [
      {
        id: 'welcome-reset',
        sender: 'agent',
        text: 'Conversation cleared. How can I assist you now, Bilal?',
        timestamp: new Date().toISOString(),
      },
    ];
    this.persist();
  }

  public addAuditLog(action: string, tool: string, status: AuditLogItem['status'], details: any) {
    const item: AuditLogItem = {
      id: 'audit-' + Date.now(),
      timestamp: new Date().toISOString(),
      action,
      tool,
      user: 'Bilal',
      status,
      details,
    };
    this.data.auditLogs.unshift(item);
    if (this.data.auditLogs.length > 200) {
      this.data.auditLogs.pop();
    }
    this.persist();
  }

  public createPendingApproval(tool: string, description: string, params: any, commandText: string): PendingApproval {
    const approval: PendingApproval = {
      id: 'appr-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      tool,
      description,
      riskLevel: 'sensitive',
      params,
      status: 'pending',
      createdAt: new Date().toISOString(),
      commandText,
    };
    this.data.pendingApprovals.push(approval);
    this.addAuditLog('APPROVAL_REQUESTED', tool, 'requires_approval', { approvalId: approval.id, description });
    this.persist();
    return approval;
  }

  public resolveApproval(id: string, decision: 'approved' | 'rejected'): PendingApproval | null {
    const idx = this.data.pendingApprovals.findIndex((a) => a.id === id);
    if (idx === -1) return null;
    this.data.pendingApprovals[idx].status = decision;
    const approval = this.data.pendingApprovals[idx];
    this.addAuditLog(`APPROVAL_${decision.toUpperCase()}`, approval.tool, decision === 'approved' ? 'success' : 'rejected', {
      approvalId: id,
    });
    this.persist();
    return approval;
  }
}

export const db = new LocalDatabase();
