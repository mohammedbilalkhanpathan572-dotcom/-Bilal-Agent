import { ToolDefinition } from '../agent/types';
import { db, MemoryItem } from '../storage/db';

export const memorySaveTool: ToolDefinition = {
  name: 'memory_save',
  category: 'memory',
  description: 'Store a user preference, frequent command alias, contact detail, or project note in long-term memory.',
  permissionLevel: 'low_risk',
  inputSchema: {
    type: 'object',
    properties: {
      category: {
        type: 'string',
        description: 'preferences, projects, frequently_used, tool_settings, or contacts',
        default: 'preferences',
      },
      key: { type: 'string', description: 'Label or key for this memory', required: true },
      value: { type: 'string', description: 'The information or preference to remember', required: true },
    },
    required: ['key', 'value'],
  },
  execute: async (params: { category?: any; key: string; value: string }) => {
    // Validate we don't store passwords or private secrets
    const valLower = params.value.toLowerCase();
    if (valLower.includes('password') || valLower.includes('api_key') || valLower.includes('secret_key')) {
      throw new Error('Security policy: Passwords and sensitive authentication tokens cannot be stored in memory.');
    }

    const memories = db.getDb().memories;
    const existingIdx = memories.findIndex((m) => m.key.toLowerCase() === params.key.toLowerCase());

    if (existingIdx !== -1) {
      memories[existingIdx].value = params.value;
      memories[existingIdx].updatedAt = new Date().toISOString();
      db.persist();
      return {
        action: 'updated',
        key: params.key,
        value: params.value,
        summary: `Updated memory: ${params.key} -> "${params.value}".`,
      };
    }

    const newItem: MemoryItem = {
      id: 'mem-' + Date.now(),
      category: params.category || 'preferences',
      key: params.key,
      value: params.value,
      confidence: 1.0,
      updatedAt: new Date().toISOString(),
    };

    memories.push(newItem);
    db.persist();

    return {
      action: 'saved',
      key: newItem.key,
      category: newItem.category,
      value: newItem.value,
      summary: `Remembered: "${newItem.key}" is "${newItem.value}".`,
    };
  },
};

export const memorySearchTool: ToolDefinition = {
  name: 'memory_search',
  category: 'memory',
  description: 'Search long-term memory for previously remembered preferences, device configurations, or contacts.',
  permissionLevel: 'low_risk',
  inputSchema: {
    type: 'object',
    properties: {
      query: { type: 'string', description: 'Keyword to search in memory', required: true },
    },
    required: ['query'],
  },
  execute: async (params: { query: string }) => {
    const q = params.query.toLowerCase().trim();
    const memories = db.getDb().memories;
    const matched = memories.filter((m) => m.key.toLowerCase().includes(q) || m.value.toLowerCase().includes(q) || m.category.toLowerCase().includes(q));

    return {
      query: params.query,
      count: matched.length,
      memories: matched,
      summary: matched.length > 0 ? `Found ${matched.length} saved memory items matching "${params.query}".` : `No stored memory found for "${params.query}".`,
    };
  },
};
