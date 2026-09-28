import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { agentOrchestrator } from '../agent/orchestrator';
import { db } from '../storage/db';
import { toolRegistry } from '../tools/registry';
import { whatsappService } from '../integrations/whatsappService';
import { tiktokService } from '../integrations/tiktokService';

const router = express.Router();

// 1. Central Agent Command Dispatcher
router.post('/agent/command', async (req: Request, res: Response) => {
  try {
    const { command } = req.body;
    if (!command || typeof command !== 'string') {
      res.status(400).json({ error: 'Command text is required.' });
      return;
    }

    // Save user message to DB
    db.addMessage({
      sender: 'user',
      text: command,
    });

    const result = await agentOrchestrator.executeCommand(command);
    res.json(result);
  } catch (err: any) {
    console.error('Agent command execution error:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// 2. Action Approval Endpoint
router.post('/agent/approve', async (req: Request, res: Response) => {
  try {
    const { approvalId } = req.body;
    if (!approvalId) {
      res.status(400).json({ error: 'approvalId is required.' });
      return;
    }

    const result = await agentOrchestrator.executeApprovedAction(approvalId);
    res.json({ success: true, result });
  } catch (err: any) {
    console.error('Approval execution error:', err);
    res.status(500).json({ error: err.message });
  }
});

// 3. Action Rejection Endpoint
router.post('/agent/reject', (req: Request, res: Response) => {
  try {
    const { approvalId } = req.body;
    if (!approvalId) {
      res.status(400).json({ error: 'approvalId is required.' });
      return;
    }

    const approval = db.resolveApproval(approvalId, 'rejected');
    if (!approval) {
      res.status(404).json({ error: 'Approval not found' });
      return;
    }

    db.addMessage({
      sender: 'system',
      text: `Action cancelled by user: ${approval.tool}`,
    });

    res.json({ success: true, message: 'Action rejected successfully.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Agent Status & Capabilities
router.get('/agent/status', (_req: Request, res: Response) => {
  const settings = db.getDb().settings;
  const tools = toolRegistry.getAllTools();
  res.json({
    name: 'Bilal AI Agent',
    status: 'online',
    version: '1.0.0',
    model: settings.model,
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'),
    toolsCount: tools.length,
    tools: tools.map((t) => ({
      name: t.name,
      category: t.category,
      description: t.description,
      permissionLevel: t.permissionLevel,
    })),
    pendingApprovalsCount: db.getDb().pendingApprovals.filter((a) => a.status === 'pending').length,
  });
});

// 5. Chat History
router.get('/chat/messages', (_req: Request, res: Response) => {
  res.json({ messages: db.getDb().messages });
});

router.delete('/chat/messages', (_req: Request, res: Response) => {
  db.clearMessages();
  res.json({ success: true, message: 'Chat history cleared' });
});

// 6. Tasks / Scheduler
router.get('/tasks', (_req: Request, res: Response) => {
  res.json({ tasks: db.getDb().tasks });
});

router.post('/tasks', (req: Request, res: Response) => {
  const { title, cronOrTime, type, commandToExecute } = req.body;
  if (!title) {
    res.status(400).json({ error: 'Title is required' });
    return;
  }
  const task = {
    id: 'task-' + Date.now(),
    title,
    cronOrTime: cronOrTime || 'Tomorrow at 10:00 AM',
    type: type || 'one_time',
    status: 'active' as const,
    createdAt: new Date().toISOString(),
    scheduledFor: cronOrTime || 'Tomorrow at 10:00 AM',
    commandToExecute: commandToExecute || title,
  };
  db.getDb().tasks.push(task);
  db.persist();
  res.json({ success: true, task });
});

router.patch('/tasks/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const task = db.getDb().tasks.find((t) => t.id === id);
  if (!task) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }
  Object.assign(task, req.body);
  db.persist();
  res.json({ success: true, task });
});

router.delete('/tasks/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  db.getDb().tasks = db.getDb().tasks.filter((t) => t.id !== id);
  db.persist();
  res.json({ success: true });
});

// 7. Memory Management
router.get('/memories', (req: Request, res: Response) => {
  const { search } = req.query;
  let list = db.getDb().memories;
  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    list = list.filter((m) => m.key.toLowerCase().includes(q) || m.value.toLowerCase().includes(q));
  }
  res.json({ memories: list });
});

router.post('/memories', (req: Request, res: Response) => {
  const { category, key, value } = req.body;
  if (!key || !value) {
    res.status(400).json({ error: 'Key and Value are required' });
    return;
  }
  const memory = {
    id: 'mem-' + Date.now(),
    category: category || 'preferences',
    key,
    value,
    confidence: 1.0,
    updatedAt: new Date().toISOString(),
  };
  db.getDb().memories.push(memory);
  db.persist();
  res.json({ success: true, memory });
});

router.delete('/memories/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  db.getDb().memories = db.getDb().memories.filter((m) => m.id !== id);
  db.persist();
  res.json({ success: true });
});

router.delete('/memories', (_req: Request, res: Response) => {
  db.getDb().memories = [];
  db.persist();
  res.json({ success: true, message: 'All memories cleared' });
});

// 8. Integrations Status & Management
router.get('/integrations', (_req: Request, res: Response) => {
  res.json({
    whatsapp: whatsappService.getStatus(),
    tiktok: tiktokService.getStatus(),
    browser: db.getDb().integrations.browser,
    google: db.getDb().integrations.google,
  });
});

router.get('/integrations/whatsapp/conversations', (_req: Request, res: Response) => {
  res.json({ conversations: whatsappService.getConversations() });
});

router.get('/integrations/tiktok/comments', (_req: Request, res: Response) => {
  res.json({ comments: tiktokService.getComments() });
});

// 9. Sandboxed Files & Code Preview
router.get('/files', (_req: Request, res: Response) => {
  const workspace = db.getWorkspacePath();
  const entries = fs.readdirSync(workspace, { withFileTypes: true });
  const files = entries.map((entry) => {
    const fullPath = path.join(workspace, entry.name);
    const stat = fs.statSync(fullPath);
    return {
      name: entry.name,
      isDirectory: entry.isDirectory(),
      sizeBytes: stat.size,
      modifiedAt: stat.mtime.toISOString(),
      extension: path.extname(entry.name),
    };
  });
  res.json({ files });
});

router.get('/files/content/:filename', (req: Request, res: Response) => {
  const workspace = db.getWorkspacePath();
  const safeName = path.basename(req.params.filename);
  const filePath = path.join(workspace, safeName);
  if (!fs.existsSync(filePath)) {
    res.status(404).json({ error: 'File not found' });
    return;
  }
  const content = fs.readFileSync(filePath, 'utf-8');
  res.json({ name: safeName, content });
});

router.get('/files/preview/:filename', (req: Request, res: Response) => {
  const workspace = db.getWorkspacePath();
  const safeName = path.basename(req.params.filename);
  const filePath = path.join(workspace, safeName);
  if (!fs.existsSync(filePath)) {
    res.status(404).send('File not found in workspace.');
    return;
  }
  res.sendFile(filePath);
});

router.post('/files', (req: Request, res: Response) => {
  const { fileName, content } = req.body;
  if (!fileName || content === undefined) {
    res.status(400).json({ error: 'fileName and content required' });
    return;
  }
  const workspace = db.getWorkspacePath();
  const safeName = path.basename(fileName);
  fs.writeFileSync(path.join(workspace, safeName), content, 'utf-8');
  res.json({ success: true, fileName: safeName });
});

// 10. Audit Logs
router.get('/audit-logs', (_req: Request, res: Response) => {
  res.json({ logs: db.getDb().auditLogs });
});

// 11. User Settings
router.get('/settings', (_req: Request, res: Response) => {
  res.json({ settings: db.getDb().settings });
});

router.patch('/settings', (req: Request, res: Response) => {
  const current = db.getDb().settings;
  Object.assign(current, req.body);
  db.persist();
  res.json({ success: true, settings: current });
});

export default router;
