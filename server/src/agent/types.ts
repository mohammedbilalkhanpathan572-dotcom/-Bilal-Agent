export type ToolPermissionLevel = 'low_risk' | 'sensitive' | 'high_risk';

export interface ToolSchemaParam {
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  description: string;
  required?: boolean;
  default?: any;
}

export interface ToolDefinition {
  name: string;
  category: 'web' | 'browser' | 'files' | 'coding' | 'communication' | 'social' | 'memory' | 'automation';
  description: string;
  permissionLevel: ToolPermissionLevel;
  inputSchema: {
    type: 'object';
    properties: Record<string, ToolSchemaParam>;
    required?: string[];
  };
  execute: (params: any, context?: any) => Promise<any>;
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

export interface AgentPlan {
  intent: string;
  language: 'en' | 'ur' | 'roman_ur';
  requiresApproval: boolean;
  steps: AgentStep[];
}

export interface AgentExecutionResult {
  success: boolean;
  userCommand: string;
  language: 'en' | 'ur' | 'roman_ur';
  responseText: string;
  spokenText?: string;
  steps: AgentStep[];
  pendingApproval?: {
    id: string;
    tool: string;
    description: string;
    params: any;
    commandText: string;
  };
  toolResult?: any;
  error?: string;
}
