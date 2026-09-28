export interface Message {
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

export interface Task {
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

export interface Memory {
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

export interface AgentStep {
  id: string;
  title: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'waiting_approval';
  tool?: string;
  input?: any;
  result?: any;
  error?: string;
}

export interface AgentExecutionResult {
  success: boolean;
  userCommand: string;
  language: 'en' | 'ur' | 'roman_ur';
  responseText: string;
  spokenText?: string;
  steps: AgentStep[];
  pendingApproval?: PendingApproval;
  toolResult?: any;
  error?: string;
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

export interface IntegrationStatus {
  whatsapp: {
    connected: boolean;
    mode: string;
    phoneNumberId: string;
    verified: boolean;
    conversationsCount: number;
  };
  tiktok: {
    connected: boolean;
    mode: string;
    username: string;
    displayName: string;
    followerCount: number;
    pendingCommentsCount: number;
  };
  browser: {
    connected: boolean;
    mode: string;
    defaultSearchEngine: string;
  };
  google: {
    connected: boolean;
    accountEmail: string;
  };
}

export interface WorkspaceFile {
  name: string;
  isDirectory: boolean;
  sizeBytes: number;
  modifiedAt: string;
  extension: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  tool: string;
  user: string;
  status: 'success' | 'failed' | 'requires_approval' | 'rejected';
  details: any;
}
