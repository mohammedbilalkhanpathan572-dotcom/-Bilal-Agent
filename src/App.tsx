/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar, NavTab } from './components/Sidebar';
import { Header } from './components/Header';
import { ApprovalModal } from './components/ApprovalModal';
import { DashboardPage } from './pages/DashboardPage';
import { ChatPage } from './pages/ChatPage';
import { VoiceAgentPage } from './pages/VoiceAgentPage';
import { TasksPage } from './pages/TasksPage';
import { WhatsAppPage } from './pages/WhatsAppPage';
import { TikTokPage } from './pages/TikTokPage';
import { BrowserPage } from './pages/BrowserPage';
import { FilesPage } from './pages/FilesPage';
import { CodingPage } from './pages/CodingPage';
import { MemoryPage } from './pages/MemoryPage';
import { IntegrationsPage } from './pages/IntegrationsPage';
import { SettingsPage } from './pages/SettingsPage';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';
import { api } from './services/api';
import {
  Message,
  AgentStep,
  AgentExecutionResult,
  PendingApproval,
  UserSettings,
} from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentSteps, setCurrentSteps] = useState<AgentStep[]>([]);
  const [currentCommand, setCurrentCommand] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [latestResult, setLatestResult] = useState<AgentExecutionResult | null>(null);
  const [pendingApproval, setPendingApproval] = useState<PendingApproval | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Spoken voice responses
  const { isSpeaking, isMuted, speak, cancel, toggleMute } = useSpeechSynthesis();

  // Load initial settings and messages
  const loadInitialData = async () => {
    try {
      const [msgs, sets] = await Promise.all([api.getMessages(), api.getSettings()]);
      setMessages(msgs);
      setSettings(sets);
    } catch (e) {
      console.warn('Initial data load notice:', e);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Central command dispatch function
  const handleSendCommand = useCallback(
    async (commandText: string): Promise<AgentExecutionResult | null> => {
      if (!commandText.trim()) return null;

      setCurrentCommand(commandText);
      setIsProcessing(true);

      // Initial visual feedback step
      setCurrentSteps([
        { id: 's0', title: `Understanding command: "${commandText}"`, status: 'running' },
      ]);

      try {
        const result = await api.sendCommand(commandText);

        setCurrentSteps(result.steps || []);
        setLatestResult(result);

        // If action requires security approval, prompt user
        if (result.pendingApproval) {
          setPendingApproval(result.pendingApproval as any);
        } else {
          setPendingApproval(null);
        }

        // Voice spoken feedback
        if (settings?.autoSpeak !== false && !isMuted) {
          const textToSpeak = result.spokenText || result.responseText;
          speak(textToSpeak, settings?.speechRate || 1.0);
        }

        // Refresh conversation history
        const updatedMsgs = await api.getMessages();
        setMessages(updatedMsgs);

        return result;
      } catch (err: any) {
        console.error('Command dispatch error:', err);
        setCurrentSteps([
          { id: 'err', title: 'Execution failed', status: 'failed', error: err.message },
        ]);
        return null;
      } finally {
        setIsProcessing(false);
      }
    },
    [isMuted, settings, speak]
  );

  // Speech Recognition hook
  const {
    isListening,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition((finalTranscript) => {
    if (finalTranscript.trim()) {
      handleSendCommand(finalTranscript.trim());
      resetTranscript();
    }
  });

  const handleToggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      cancel(); // stop current TTS speech before listening
      startListening();
    }
  };

  // Action Approval
  const handleApprove = async (approvalId: string) => {
    try {
      setIsProcessing(true);
      await api.approveAction(approvalId);
      setPendingApproval(null);
      const updatedMsgs = await api.getMessages();
      setMessages(updatedMsgs);
      if (!isMuted) {
        speak('Action authorized and executed successfully.', settings?.speechRate || 1.0);
      }
    } catch (e: any) {
      alert(`Approval error: ${e.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (approvalId: string) => {
    try {
      await api.rejectAction(approvalId);
      setPendingApproval(null);
      const updatedMsgs = await api.getMessages();
      setMessages(updatedMsgs);
    } catch (e: any) {
      console.error(e);
    }
  };

  const handleClearChat = async () => {
    try {
      await api.clearMessages();
      const updatedMsgs = await api.getMessages();
      setMessages(updatedMsgs);
      setLatestResult(null);
      setCurrentSteps([]);
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateSettings = async (newSettings: Partial<UserSettings>) => {
    try {
      await api.updateSettings(newSettings);
      setSettings((prev) => (prev ? { ...prev, ...newSettings } : null));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#080c14] text-slate-100 font-sans">
      {/* Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        pendingApprovalsCount={pendingApproval ? 1 : 0}
        isOpenMobile={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
      />

      {/* Main Body Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onOpenMobileNav={() => setIsMobileNavOpen(true)}
          isMuted={isMuted}
          onToggleMute={toggleMute}
          activeModel={settings?.model || 'gemini-3.8-flash'}
          hasPendingApproval={Boolean(pendingApproval)}
        />

        <main className="flex-1 px-4 md:px-8 py-6 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardPage
              onSendCommand={handleSendCommand}
              isProcessing={isProcessing}
              isListening={isListening}
              isSpeaking={isSpeaking}
              transcript={transcript}
              interimTranscript={interimTranscript}
              onToggleListening={handleToggleListening}
              currentSteps={currentSteps}
              currentCommand={currentCommand}
              latestResult={latestResult}
              onNavigate={setActiveTab}
              userLanguage={settings?.language || 'English'}
            />
          )}

          {activeTab === 'chat' && (
            <ChatPage
              messages={messages}
              onSendMessage={handleSendCommand}
              onClearChat={handleClearChat}
              isProcessing={isProcessing}
              isListening={isListening}
              onToggleListening={handleToggleListening}
              onSpeak={(text) => speak(text, settings?.speechRate || 1.0)}
              pendingApproval={pendingApproval}
              onApproveAction={handleApprove}
              onRejectAction={handleReject}
            />
          )}

          {activeTab === 'voice' && (
            <VoiceAgentPage
              isListening={isListening}
              isProcessing={isProcessing}
              isSpeaking={isSpeaking}
              isMuted={isMuted}
              transcript={transcript}
              interimTranscript={interimTranscript}
              onToggleListening={handleToggleListening}
              onToggleMute={toggleMute}
              latestResult={latestResult}
              onSendCommand={handleSendCommand}
              userLanguage={settings?.language || 'English'}
              onChangeLanguage={(lang) => handleUpdateSettings({ language: lang })}
            />
          )}

          {activeTab === 'tasks' && <TasksPage onTriggerCommand={handleSendCommand} />}
          {activeTab === 'whatsapp' && <WhatsAppPage onTriggerCommand={handleSendCommand} />}
          {activeTab === 'tiktok' && <TikTokPage onTriggerCommand={handleSendCommand} />}
          {activeTab === 'browser' && <BrowserPage onTriggerCommand={handleSendCommand} />}
          {activeTab === 'files' && <FilesPage onTriggerCommand={handleSendCommand} />}
          {activeTab === 'coding' && <CodingPage onTriggerCommand={handleSendCommand} />}
          {activeTab === 'memory' && <MemoryPage onTriggerCommand={handleSendCommand} />}
          {activeTab === 'integrations' && <IntegrationsPage />}
          {activeTab === 'settings' && (
            <SettingsPage
              currentSettings={settings}
              onUpdateSettings={handleUpdateSettings}
            />
          )}
        </main>
      </div>

      {/* Sensitive Action Security Confirmation Modal */}
      <ApprovalModal
        approval={pendingApproval}
        onApprove={handleApprove}
        onReject={handleReject}
        isSubmitting={isProcessing}
      />
    </div>
  );
}
