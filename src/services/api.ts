import {
  AgentExecutionResult,
  Message,
  Task,
  Memory,
  IntegrationStatus,
  WorkspaceFile,
  UserSettings,
  AuditLog,
} from '../types';

export const api = {
  // Agent command execution
  async sendCommand(command: string): Promise<AgentExecutionResult> {
    const res = await fetch('/api/agent/command', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ command }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Command failed' }));
      throw new Error(err.error || 'Server error');
    }
    return res.json();
  },

  // Action approval / rejection
  async approveAction(approvalId: string): Promise<any> {
    const res = await fetch('/api/agent/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approvalId }),
    });
    return res.json();
  },

  async rejectAction(approvalId: string): Promise<any> {
    const res = await fetch('/api/agent/reject', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approvalId }),
    });
    return res.json();
  },

  // Agent status
  async getStatus(): Promise<any> {
    const res = await fetch('/api/agent/status');
    return res.json();
  },

  // Chat
  async getMessages(): Promise<Message[]> {
    const res = await fetch('/api/chat/messages');
    const data = await res.json();
    return data.messages || [];
  },

  async clearMessages(): Promise<void> {
    await fetch('/api/chat/messages', { method: 'DELETE' });
  },

  // Tasks
  async getTasks(): Promise<Task[]> {
    const res = await fetch('/api/tasks');
    const data = await res.json();
    return data.tasks || [];
  },

  async createTask(task: Partial<Task>): Promise<Task> {
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    const data = await res.json();
    return data.task;
  },

  async updateTask(id: string, updates: Partial<Task>): Promise<void> {
    await fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
  },

  async deleteTask(id: string): Promise<void> {
    await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
  },

  // Memory
  async getMemories(search?: string): Promise<Memory[]> {
    const url = search ? `/api/memories?search=${encodeURIComponent(search)}` : '/api/memories';
    const res = await fetch(url);
    const data = await res.json();
    return data.memories || [];
  },

  async createMemory(memory: Partial<Memory>): Promise<Memory> {
    const res = await fetch('/api/memories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(memory),
    });
    const data = await res.json();
    return data.memory;
  },

  async deleteMemory(id: string): Promise<void> {
    await fetch(`/api/memories/${id}`, { method: 'DELETE' });
  },

  async clearAllMemories(): Promise<void> {
    await fetch('/api/memories', { method: 'DELETE' });
  },

  // Integrations
  async getIntegrations(): Promise<IntegrationStatus> {
    const res = await fetch('/api/integrations');
    return res.json();
  },

  async getWhatsAppConversations(): Promise<any[]> {
    const res = await fetch('/api/integrations/whatsapp/conversations');
    const data = await res.json();
    return data.conversations || [];
  },

  async getTikTokComments(): Promise<any[]> {
    const res = await fetch('/api/integrations/tiktok/comments');
    const data = await res.json();
    return data.comments || [];
  },

  // Files
  async getFiles(): Promise<WorkspaceFile[]> {
    const res = await fetch('/api/files');
    const data = await res.json();
    return data.files || [];
  },

  async getFileContent(filename: string): Promise<{ name: string; content: string }> {
    const res = await fetch(`/api/files/content/${encodeURIComponent(filename)}`);
    return res.json();
  },

  async saveFile(fileName: string, content: string): Promise<void> {
    await fetch('/api/files', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileName, content }),
    });
  },

  // Audit Logs
  async getAuditLogs(): Promise<AuditLog[]> {
    const res = await fetch('/api/audit-logs');
    const data = await res.json();
    return data.logs || [];
  },

  // Settings
  async getSettings(): Promise<UserSettings> {
    const res = await fetch('/api/settings');
    const data = await res.json();
    return data.settings;
  },

  async updateSettings(settings: Partial<UserSettings>): Promise<void> {
    await fetch('/api/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
  },
};
