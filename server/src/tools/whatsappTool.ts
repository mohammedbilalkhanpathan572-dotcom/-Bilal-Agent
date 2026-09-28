import { ToolDefinition } from '../agent/types';
import { whatsappService } from '../integrations/whatsappService';

export const whatsappListUnreadTool: ToolDefinition = {
  name: 'whatsapp_list_unread',
  category: 'communication',
  description: 'Fetch and summarize unread WhatsApp messages or conversations with contacts like Ahmed, Ali, etc.',
  permissionLevel: 'low_risk',
  inputSchema: {
    type: 'object',
    properties: {
      contact: { type: 'string', description: 'Optional contact name filter (e.g. Ahmed, Ali)', default: '' },
    },
  },
  execute: async (params: { contact?: string }) => {
    if (params.contact) {
      const conv = whatsappService.getConversationByContact(params.contact);
      if (!conv) {
        return {
          found: false,
          message: `No WhatsApp conversation found matching "${params.contact}".`,
        };
      }
      return {
        contact: conv.contactName,
        phone: conv.contactPhone,
        unreadCount: conv.unreadCount,
        latestMessages: conv.messages,
        summary: `You have ${conv.unreadCount} unread message(s) from ${conv.contactName}. Latest: "${conv.messages[conv.messages.length - 1]?.text}"`,
      };
    }

    const conversations = whatsappService.getConversations();
    const unread = conversations.filter((c) => c.unreadCount > 0);

    return {
      totalConversations: conversations.length,
      unreadConversations: unread.map((u) => ({
        contact: u.contactName,
        phone: u.contactPhone,
        unreadCount: u.unreadCount,
        latestMessage: u.messages[u.messages.length - 1]?.text,
      })),
      summary: unread.length > 0 
        ? `You have ${unread.reduce((acc, c) => acc + c.unreadCount, 0)} unread WhatsApp messages from: ${unread.map((c) => `${c.contactName} (${c.unreadCount})`).join(', ')}.`
        : 'All WhatsApp chats are currently caught up with zero unread messages.',
    };
  },
};

export const whatsappDraftTool: ToolDefinition = {
  name: 'whatsapp_draft',
  category: 'communication',
  description: 'Draft a reply to a contact on WhatsApp without sending it immediately. Allows review and editing.',
  permissionLevel: 'low_risk',
  inputSchema: {
    type: 'object',
    properties: {
      recipient: { type: 'string', description: 'Contact name or phone number (e.g. Ahmed)', required: true },
      messageOrIntent: { type: 'string', description: 'The message text or intention to express', required: true },
    },
    required: ['recipient', 'messageOrIntent'],
  },
  execute: async (params: { recipient: string; messageOrIntent: string }) => {
    const draftResult = await whatsappService.draftReply(params.recipient, params.messageOrIntent);
    return {
      status: 'draft_created',
      recipient: draftResult.recipient,
      phone: draftResult.phone,
      draftText: draftResult.draft,
      context: draftResult.suggestedContext,
      summary: `Draft prepared for ${draftResult.recipient}: "${draftResult.draft}". Ready for your confirmation before sending.`,
    };
  },
};

export const whatsappSendTool: ToolDefinition = {
  name: 'whatsapp_send',
  category: 'communication',
  description: 'Send a message to a WhatsApp contact. (Sensitive: Requires explicit user approval before execution).',
  permissionLevel: 'sensitive',
  inputSchema: {
    type: 'object',
    properties: {
      recipient: { type: 'string', description: 'Contact name or phone number', required: true },
      message: { type: 'string', description: 'The exact text message to deliver', required: true },
    },
    required: ['recipient', 'message'],
  },
  execute: async (params: { recipient: string; message: string }) => {
    const result = await whatsappService.sendMessage(params.recipient, params.message);
    return {
      status: 'delivered',
      recipient: params.recipient,
      messageSent: params.message,
      messageId: result.messageId,
      details: result.details,
      summary: `WhatsApp message delivered successfully to ${params.recipient}: "${params.message}".`,
    };
  },
};
