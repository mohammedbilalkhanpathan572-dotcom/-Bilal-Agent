import { ToolDefinition } from '../agent/types';
import { db, TaskItem } from '../storage/db';

export const schedulerReminderTool: ToolDefinition = {
  name: 'scheduler_reminder',
  category: 'automation',
  description: 'Create a new reminder, automated task, or recurring cron schedule (e.g. tomorrow at 10 AM, every Monday at 9 AM).',
  permissionLevel: 'low_risk',
  inputSchema: {
    type: 'object',
    properties: {
      title: { type: 'string', description: 'Title or intent of the reminder', required: true },
      timeOrCron: { type: 'string', description: 'When to trigger (e.g. tomorrow at 10 AM, Monday 9am, every evening)', required: true },
      type: { type: 'string', description: 'one_time or recurring', default: 'one_time' },
      commandToExecute: { type: 'string', description: 'Optional automated voice/agent command to run when triggered', default: '' },
    },
    required: ['title', 'timeOrCron'],
  },
  execute: async (params: { title: string; timeOrCron: string; type?: 'one_time' | 'recurring'; commandToExecute?: string }) => {
    const isRecurring = params.type === 'recurring' || params.timeOrCron.toLowerCase().includes('every') || params.timeOrCron.toLowerCase().includes('daily');
    const newTask: TaskItem = {
      id: 'task-' + Date.now(),
      title: params.title,
      description: `Scheduled trigger for: ${params.timeOrCron}`,
      cronOrTime: params.timeOrCron,
      type: isRecurring ? 'recurring' : 'one_time',
      status: 'active',
      createdAt: new Date().toISOString(),
      scheduledFor: params.timeOrCron,
      commandToExecute: params.commandToExecute || params.title,
    };

    db.getDb().tasks.push(newTask);
    db.persist();

    return {
      taskId: newTask.id,
      title: newTask.title,
      scheduledFor: newTask.cronOrTime,
      type: newTask.type,
      status: newTask.status,
      summary: `Scheduled: "${newTask.title}" for ${newTask.cronOrTime}. I will remind you and run the task at that time.`,
    };
  },
};
