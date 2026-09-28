import fs from 'fs';
import path from 'path';
import { ToolDefinition } from '../agent/types';
import { db } from '../storage/db';

export const fileListTool: ToolDefinition = {
  name: 'file_list',
  category: 'files',
  description: 'List all files and directories in the sandboxed workspace or find project files.',
  permissionLevel: 'low_risk',
  inputSchema: {
    type: 'object',
    properties: {
      subfolder: { type: 'string', description: 'Optional subfolder path within workspace', default: '' },
    },
  },
  execute: async (params: { subfolder?: string }) => {
    const workspace = db.getWorkspacePath();
    const targetDir = params.subfolder ? path.join(workspace, params.subfolder) : workspace;

    if (!fs.existsSync(targetDir)) {
      return { files: [], message: `Folder ${params.subfolder} does not exist.` };
    }

    const entries = fs.readdirSync(targetDir, { withFileTypes: true });
    const files = entries.map((entry) => {
      const fullPath = path.join(targetDir, entry.name);
      const stat = fs.statSync(fullPath);
      return {
        name: entry.name,
        isDirectory: entry.isDirectory(),
        sizeBytes: stat.size,
        modifiedAt: stat.mtime.toISOString(),
        extension: path.extname(entry.name),
      };
    });

    return {
      folder: params.subfolder || 'root workspace',
      count: files.length,
      files,
    };
  },
};

export const fileReadTool: ToolDefinition = {
  name: 'file_read',
  category: 'files',
  description: 'Read the contents of a text, HTML, JS, CSS, Python, JSON, or markdown file from the workspace.',
  permissionLevel: 'low_risk',
  inputSchema: {
    type: 'object',
    properties: {
      fileName: { type: 'string', description: 'Name of the file to read (e.g. index.html, notes.txt)', required: true },
    },
    required: ['fileName'],
  },
  execute: async (params: { fileName: string }) => {
    const workspace = db.getWorkspacePath();
    const filePath = path.join(workspace, path.basename(params.fileName));

    if (!fs.existsSync(filePath)) {
      throw new Error(`File "${params.fileName}" not found in workspace.`);
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    return {
      fileName: params.fileName,
      sizeBytes: Buffer.byteLength(content, 'utf-8'),
      content,
    };
  },
};

export const fileWriteTool: ToolDefinition = {
  name: 'file_write',
  category: 'files',
  description: 'Create or update a text/code file in the workspace.',
  permissionLevel: 'low_risk',
  inputSchema: {
    type: 'object',
    properties: {
      fileName: { type: 'string', description: 'File name including extension (e.g. website.html, script.py)', required: true },
      content: { type: 'string', description: 'File content to write', required: true },
    },
    required: ['fileName', 'content'],
  },
  execute: async (params: { fileName: string; content: string }) => {
    const workspace = db.getWorkspacePath();
    const safeName = path.basename(params.fileName);
    const filePath = path.join(workspace, safeName);

    fs.writeFileSync(filePath, params.content, 'utf-8');
    return {
      success: true,
      fileName: safeName,
      bytesWritten: Buffer.byteLength(params.content, 'utf-8'),
      path: `workspace/${safeName}`,
      message: `File "${safeName}" created and saved successfully in workspace.`,
    };
  },
};

export const fileDeleteTool: ToolDefinition = {
  name: 'file_delete',
  category: 'files',
  description: 'Delete a file from the workspace. (Sensitive: Requires user confirmation).',
  permissionLevel: 'sensitive',
  inputSchema: {
    type: 'object',
    properties: {
      fileName: { type: 'string', description: 'The exact file name to delete', required: true },
    },
    required: ['fileName'],
  },
  execute: async (params: { fileName: string }) => {
    const workspace = db.getWorkspacePath();
    const safeName = path.basename(params.fileName);
    const filePath = path.join(workspace, safeName);

    if (!fs.existsSync(filePath)) {
      throw new Error(`File "${safeName}" does not exist.`);
    }

    fs.unlinkSync(filePath);
    return {
      success: true,
      fileName: safeName,
      message: `File "${safeName}" has been safely deleted from the workspace.`,
    };
  },
};
