import React, { useState, useEffect } from 'react';
import {
  Code2,
  Play,
  Sparkles,
  FileCode,
  FolderOpen,
  Check,
  Copy,
  Bug,
  HelpCircle,
  RefreshCw,
  Eye,
  FilePlus,
  Terminal,
} from 'lucide-react';
import { CodeSandboxPreview } from '../components/CodeSandboxPreview';
import { api } from '../services/api';
import { WorkspaceFile } from '../types';

interface CodingPageProps {
  onTriggerCommand: (cmd: string) => void;
}

export const CodingPage: React.FC<CodingPageProps> = ({ onTriggerCommand }) => {
  const [files, setFiles] = useState<WorkspaceFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<string>('index.html');
  const [fileContent, setFileContent] = useState<string>('');
  const [promptInput, setPromptInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const loadWorkspaceFiles = async () => {
    try {
      const list = await api.getFiles();
      setFiles(list);
      if (list.length > 0 && !list.some((f) => f.name === selectedFile)) {
        setSelectedFile(list[0].name);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadContent = async (fileName: string) => {
    try {
      setLoading(true);
      const res = await api.getFileContent(fileName);
      setFileContent(res.content || '');
      setSelectedFile(fileName);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkspaceFiles();
  }, []);

  useEffect(() => {
    if (selectedFile) {
      loadContent(selectedFile);
    }
  }, [selectedFile]);

  const handleSave = async () => {
    if (!selectedFile) return;
    try {
      await api.saveFile(selectedFile, fileContent);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
      loadWorkspaceFiles();
    } catch (e) {
      console.error(e);
    }
  };

  const handleGenerateGamingWebsite = () => {
    onTriggerCommand('Create a modern responsive gaming website in HTML and Tailwind CSS with PUBG sensitivity presets');
  };

  const handleFixCode = () => {
    onTriggerCommand(`Analyze and fix any bugs in ${selectedFile}`);
  };

  const handleExplainCode = () => {
    onTriggerCommand(`Explain what the code in ${selectedFile} does step by step`);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/10">
            <Code2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Autonomous Coding Studio
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                HTML • React • Python • SQL
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Generate entire websites, test in the live browser preview sandbox, and inspect sandboxed workspace files.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleGenerateGamingWebsite}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Build Gaming Website
          </button>
          <button
            onClick={handleFixCode}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Bug className="w-3.5 h-3.5 text-rose-400" />
            Detect & Fix Bugs
          </button>
          <button
            onClick={handleExplainCode}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
            Explain Code
          </button>
        </div>
      </div>

      {/* Editor & Explorer Split View */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left: Sandboxed File Tree */}
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <FolderOpen className="w-4 h-4 text-cyan-400" />
              Workspace Tree
            </span>
            <button
              onClick={loadWorkspaceFiles}
              className="text-slate-500 hover:text-slate-300 p-1 cursor-pointer"
              title="Refresh tree"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1">
            {files.map((file) => {
              const isSelected = selectedFile === file.name;
              return (
                <button
                  key={file.name}
                  onClick={() => setSelectedFile(file.name)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono transition text-left cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileCode className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                    <span className="truncate">{file.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-600">
                    {(file.sizeBytes / 1024).toFixed(1)}k
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Code Sandbox Preview (Live Preview + Source Code Editor) */}
        <div className="md:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Editing:</span>
              <span className="text-xs font-mono font-bold text-white bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                workspace/{selectedFile}
              </span>
            </div>

            <button
              onClick={handleSave}
              className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              {savedSuccess ? <Check className="w-3.5 h-3.5" /> : <Code2 className="w-3.5 h-3.5" />}
              {savedSuccess ? 'Saved to Workspace' : 'Save Changes'}
            </button>
          </div>

          {/* Interactive Component */}
          <CodeSandboxPreview
            code={fileContent}
            language={selectedFile.endsWith('.html') ? 'html' : selectedFile.endsWith('.py') ? 'python' : 'javascript'}
            title={`workspace/${selectedFile}`}
          />
        </div>
      </div>
    </div>
  );
};
