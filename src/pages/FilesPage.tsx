import React, { useState, useEffect } from 'react';
import {
  FolderOpen,
  FileText,
  FileCode,
  Trash2,
  Sparkles,
  Plus,
  RefreshCw,
  Search,
  Eye,
  Languages,
} from 'lucide-react';
import { api } from '../services/api';
import { WorkspaceFile } from '../types';

interface FilesPageProps {
  onTriggerCommand: (cmd: string) => void;
}

export const FilesPage: React.FC<FilesPageProps> = ({ onTriggerCommand }) => {
  const [files, setFiles] = useState<WorkspaceFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<WorkspaceFile | null>(null);
  const [previewContent, setPreviewContent] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileContent, setNewFileContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const loadFiles = async () => {
    try {
      const list = await api.getFiles();
      setFiles(list);
      if (list.length > 0 && !selectedFile) {
        handleSelectFile(list[0]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelectFile = async (f: WorkspaceFile) => {
    setSelectedFile(f);
    try {
      const res = await api.getFileContent(f.name);
      setPreviewContent(res.content);
    } catch (e) {
      setPreviewContent('Unable to preview file content.');
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  const handleCreateFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;
    try {
      await api.saveFile(newFileName.trim(), newFileContent);
      setNewFileName('');
      setNewFileContent('');
      setIsModalOpen(false);
      loadFiles();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteWithPrompt = (fileName: string) => {
    // Triggers orchestrator's safe approval gatekeeper!
    onTriggerCommand(`Delete file ${fileName}`);
  };

  const handleSummarizeUrdu = () => {
    if (!selectedFile) return;
    onTriggerCommand(`Read this file ${selectedFile.name} and explain it in simple Urdu.`);
  };

  const filteredFiles = files.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/10">
            <FolderOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Workspace Files & Document AI
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                Sandboxed /workspace
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Secure local file repository. Deletions strictly gated by permission confirmation dialog.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            New File
          </button>
        </div>
      </div>

      {/* Main Two-column Explorer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[540px]">
        {/* Left: Files List */}
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search files..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <button
              onClick={loadFiles}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 p-2 space-y-1">
            {filteredFiles.map((file) => {
              const isSelected = selectedFile?.name === file.name;
              return (
                <div
                  key={file.name}
                  onClick={() => handleSelectFile(file)}
                  className={`p-3 rounded-2xl transition cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-cyan-500/15 border border-cyan-500/30'
                      : 'hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <FileText className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                    <div className="truncate">
                      <h4 className="text-xs font-bold text-white truncate font-mono">{file.name}</h4>
                      <p className="text-[10px] text-slate-500">{(file.sizeBytes / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteWithPrompt(file.name);
                    }}
                    title="Delete file (Confirmation required)"
                    className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Preview & AI Summarizer */}
        <div className="md:col-span-2 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col overflow-hidden">
          {selectedFile ? (
            <>
              <div className="p-4 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white font-mono">{selectedFile.name}</h3>
                  <span className="text-[10px] text-slate-500">
                    Modified: {new Date(selectedFile.modifiedAt).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSummarizeUrdu}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-cyan-300 font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer border border-cyan-500/20"
                  >
                    <Languages className="w-3.5 h-3.5 text-cyan-400" />
                    Explain in Urdu
                  </button>
                  <button
                    onClick={() => onTriggerCommand(`Summarize the document ${selectedFile.name}`)}
                    className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-cyan-500/20"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    AI Summary
                  </button>
                </div>
              </div>

              <div className="flex-1 p-5 overflow-auto bg-slate-950/40 font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                {previewContent}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
              Select a file to inspect.
            </div>
          )}
        </div>
      </div>

      {/* Create File Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <form
            onSubmit={handleCreateFile}
            className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-4"
          >
            <h3 className="font-bold text-base text-white">Create New Workspace File</h3>

            <div>
              <label className="text-xs text-slate-400 block mb-1">File Name (with extension)</label>
              <input
                type="text"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                placeholder="e.g. notes.txt, script.py, data.json"
                required
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Content</label>
              <textarea
                value={newFileContent}
                onChange={(e) => setNewFileContent(e.target.value)}
                rows={6}
                placeholder="Write file text or code here..."
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
              >
                Save File
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
