import { ToolDefinition } from '../agent/types';
import { webSearchTool } from './searchTool';
import { browserOpenTool } from './browserTool';
import { fileListTool, fileReadTool, fileWriteTool, fileDeleteTool } from './fileTool';
import { codeGeneratorTool } from './codingTool';
import { whatsappListUnreadTool, whatsappDraftTool, whatsappSendTool } from './whatsappTool';
import { tiktokListCommentsTool, tiktokReplySuggestTool, tiktokPostReplyTool } from './tiktokTool';
import { schedulerReminderTool } from './schedulerTool';
import { memorySaveTool, memorySearchTool } from './memoryTool';
import { documentAiTool } from './documentTool';

class ToolRegistry {
  private tools: Map<string, ToolDefinition> = new Map();

  constructor() {
    this.register(webSearchTool);
    this.register(browserOpenTool);
    this.register(fileListTool);
    this.register(fileReadTool);
    this.register(fileWriteTool);
    this.register(fileDeleteTool);
    this.register(codeGeneratorTool);
    this.register(whatsappListUnreadTool);
    this.register(whatsappDraftTool);
    this.register(whatsappSendTool);
    this.register(tiktokListCommentsTool);
    this.register(tiktokReplySuggestTool);
    this.register(tiktokPostReplyTool);
    this.register(schedulerReminderTool);
    this.register(memorySaveTool);
    this.register(memorySearchTool);
    this.register(documentAiTool);
  }

  public register(tool: ToolDefinition) {
    this.tools.set(tool.name, tool);
  }

  public getTool(name: string): ToolDefinition | undefined {
    return this.tools.get(name);
  }

  public getAllTools(): ToolDefinition[] {
    return Array.from(this.tools.values());
  }

  public isAllowlisted(name: string): boolean {
    return this.tools.has(name);
  }

  public isSensitive(name: string): boolean {
    const tool = this.tools.get(name);
    return tool ? tool.permissionLevel === 'sensitive' || tool.permissionLevel === 'high_risk' : false;
  }
}

export const toolRegistry = new ToolRegistry();
