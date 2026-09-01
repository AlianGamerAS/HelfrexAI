import React, { useState, useEffect } from 'react';
import { TitleBar } from './components/TitleBar';
import { Sidebar } from './components/Sidebar';
import { ChatSessionsDrawer } from './components/ChatSessionsDrawer';
import { ChatView } from './components/ChatView';
import { PreviewView } from './components/PreviewView';
import { CodeStudioView } from './components/CodeStudioView';
import { FilesContextView } from './components/FilesContextView';
import { ModelStoreView } from './components/ModelStoreView';
import { ModelManagerView } from './components/ModelManagerView';
import { SettingsModal } from './components/SettingsModal';

import {
  ActiveTab,
  AIModel,
  AttachmentItem,
  ChatSession,
  HardwareConfig,
  Language,
  SystemPrompt
} from './types';
import { INITIAL_MODELS } from './data/modelsData';
import { generateAIResponse } from './utils/aiGenerator';
import { TRANSLATIONS } from './utils/translations';

export default function App() {
  // Global App States
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [lang, setLang] = useState<Language>('tr');
  const [activeTab, setActiveTab] = useState<ActiveTab>('chat');

  // Models State (Strict 9 models per category + custom API models)
  const [models, setModels] = useState<AIModel[]>(() => {
    const saved = localStorage.getItem('helfrex_models_v3');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as AIModel[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          const customModels = parsed.filter(m => m.isCustomApi);
          const initialMerged = INITIAL_MODELS.map(initM => {
            const found = parsed.find(p => p.id === initM.id);
            if (found) {
              return {
                ...initM,
                isDownloaded: found.isDownloaded,
                downloadProgress: found.downloadProgress,
                name: found.name || initM.name
              };
            }
            return initM;
          });
          return [...initialMerged, ...customModels];
        }
      } catch (e) {}
    }
    // Clean old caches and initialize fresh 36 models catalog (9 per category)
    try {
      localStorage.removeItem('helfrex_models');
      localStorage.removeItem('helfrex_models_v2');
      localStorage.setItem('helfrex_models_v3', JSON.stringify(INITIAL_MODELS));
    } catch (e) {}
    return INITIAL_MODELS;
  });

  // Hardware Configuration (Resource limits allocated by the user for AI)
  const [hardware, setHardware] = useState<HardwareConfig>(() => {
    const saved = localStorage.getItem('helfrex_hardware');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed) {
          return {
            ...parsed,
            ramAllocatedGB: typeof parsed.ramAllocatedGB === 'number' ? Math.min(64, parsed.ramAllocatedGB) : 24
          };
        }
      } catch (e) {}
    }
    return {
      ramGB: 32,
      gpuType: 'dedicated',
      dedicatedGpuName: 'rtx-4070',
      integratedCpuName: 'intel-ultra-7-155h',
      vramAllocatedGB: 12,
      ramAllocatedGB: 24,
      confirmed: true
    };
  });

  // Persistent System Prompts (Memory)
  const [systemPrompts, setSystemPrompts] = useState<SystemPrompt[]>(() => {
    const saved = localStorage.getItem('helfrex_prompts');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'sys-1',
        title: 'Kıdemli Kod Mimarı',
        prompt: 'Tüm kodlama isteklerinde temiz, eksiksiz, üretim kalitesinde ve modern mimari kalıplar kullan.',
        active: true
      },
      {
        id: 'sys-2',
        title: 'Minecraft Bedrock Uyum Kuralı',
        prompt: 'Minecraft mod isteklerinde manifest.json, behavior pack ve script yapılandırmasını eksiksiz oluştur.',
        active: true
      }
    ];
  });

  // Active Chat Sessions State
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem('helfrex_sessions');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'session-default-1',
        title: TRANSLATIONS.tr.chat.untitledChat,
        createdAt: Date.now(),
        messages: [],
        selectedModelId: 'qwen-coder-7b-q4',
        attachedFiles: []
      }
    ];
  });

  const [activeSessionId, setActiveSessionId] = useState<string>(sessions[0]?.id || 'session-default-1');
  const [isGenerating, setIsGenerating] = useState(false);

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('helfrex_models_v3', JSON.stringify(models));
  }, [models]);

  useEffect(() => {
    localStorage.setItem('helfrex_hardware', JSON.stringify(hardware));
  }, [hardware]);

  useEffect(() => {
    localStorage.setItem('helfrex_prompts', JSON.stringify(systemPrompts));
  }, [systemPrompts]);

  useEffect(() => {
    localStorage.setItem('helfrex_sessions', JSON.stringify(sessions));
  }, [sessions]);

  // Handle HTML dark mode class
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Model Download Simulation Loop
  useEffect(() => {
    const interval = setInterval(() => {
      setModels(prev => {
        let hasChanges = false;
        const updated = prev.map(m => {
          if (m.isDownloading && !m.isPaused) {
            hasChanges = true;
            const newProgress = Math.min(100, (m.downloadProgress || 0) + 12);
            const isDone = newProgress >= 100;
            return {
              ...m,
              downloadProgress: newProgress,
              isDownloaded: isDone ? true : m.isDownloaded,
              isDownloading: isDone ? false : true,
              downloadSpeed: isDone ? undefined : `${(45 + Math.random() * 20).toFixed(1)} MB/s`
            };
          }
          return m;
        });
        return hasChanges ? updated : prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Active Session & Model
  const currentSession = sessions.find(s => s.id === activeSessionId) || sessions[0];
  const activeModel = models.find(m => m.id === currentSession.selectedModelId) || models.find(m => m.isDownloaded) || models[0];

  const downloadingCount = models.filter(m => m.isDownloading).length;

  // Session Handlers
  const handleCreateSession = () => {
    const defaultTitle = TRANSLATIONS[lang]?.chat?.untitledChat || 'Untitled Chat';
    const newSession: ChatSession = {
      id: `session-${Date.now()}`,
      title: defaultTitle,
      createdAt: Date.now(),
      messages: [],
      selectedModelId: activeModel.id,
      attachedFiles: []
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setActiveTab('chat');
  };

  const handleRenameSession = (id: string, newTitle: string) => {
    setSessions(prev =>
      prev.map(s => (s.id === id ? { ...s, title: newTitle } : s))
    );
  };

  // Delete session handler (even when 1 session exists, resets to a fresh session and keeps chat open)
  const handleDeleteSession = (id: string) => {
    const defaultTitle = TRANSLATIONS[lang]?.chat?.untitledChat || 'Untitled Chat';
    if (sessions.length <= 1) {
      const freshSession: ChatSession = {
        id: `session-${Date.now()}`,
        title: defaultTitle,
        createdAt: Date.now(),
        messages: [],
        selectedModelId: activeModel.id,
        attachedFiles: []
      };
      setSessions([freshSession]);
      setActiveSessionId(freshSession.id);
      return;
    }

    const remaining = sessions.filter(s => s.id !== id);
    setSessions(remaining);
    if (activeSessionId === id) {
      setActiveSessionId(remaining[0].id);
    }
  };

  const handleSelectModel = (modelId: string) => {
    setSessions(prev =>
      prev.map(s => (s.id === activeSessionId ? { ...s, selectedModelId: modelId } : s))
    );
  };

  // Chat Send Message
  const handleSendMessage = (text: string, singleAttachments: AttachmentItem[]) => {
    const userMsg = {
      id: `msg-${Date.now()}`,
      sender: 'user' as const,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text,
      attachments: singleAttachments
    };

    // Auto-rename session if it's currently untitled
    const untitledTitles = [
      'İsimsiz Sohbet',
      'Untitled Chat',
      'Безымянный чат',
      'Имя чата',
      TRANSLATIONS.tr.chat.untitledChat,
      TRANSLATIONS.en.chat.untitledChat,
      TRANSLATIONS.ru.chat.untitledChat
    ];
    const isUntitled = untitledTitles.includes(currentSession.title);
    const updatedTitle = isUntitled && text.trim() ? text.slice(0, 24) + (text.length > 24 ? '...' : '') : currentSession.title;

    setSessions(prev =>
      prev.map(s =>
        s.id === activeSessionId
          ? { ...s, title: updatedTitle, messages: [...s.messages, userMsg] }
          : s
      )
    );

    setIsGenerating(true);

    // Simulate realistic generation stream
    setTimeout(() => {
      const result = generateAIResponse(
        text,
        activeModel,
        systemPrompts,
        currentSession.attachedFiles.filter(f => f.enabled),
        singleAttachments
      );

      setSessions(prev =>
        prev.map(s => {
          if (s.id !== activeSessionId) return s;
          return {
            ...s,
            messages: [...s.messages, result.message],
            currentFiles: result.files || s.currentFiles,
            activePreviewType: result.previewType || s.activePreviewType
          };
        })
      );

      setIsGenerating(false);
    }, 1200);
  };

  const handleStopGeneration = () => {
    setIsGenerating(false);
  };

  // Download management
  const handleStartDownload = (modelId: string) => {
    setModels(prev =>
      prev.map(m => (m.id === modelId ? { ...m, isDownloading: true, isPaused: false, downloadProgress: 15 } : m))
    );
    setActiveTab('model_manager');
  };

  const handlePauseDownload = (modelId: string) => {
    setModels(prev =>
      prev.map(m => (m.id === modelId ? { ...m, isPaused: true } : m))
    );
  };

  const handleResumeDownload = (modelId: string) => {
    setModels(prev =>
      prev.map(m => (m.id === modelId ? { ...m, isPaused: false } : m))
    );
  };

  const handleCancelDownload = (modelId: string) => {
    setModels(prev =>
      prev.map(m => (m.id === modelId ? { ...m, isDownloading: false, isPaused: false, downloadProgress: 0 } : m))
    );
  };

  const handleDeleteModel = (modelId: string) => {
    setModels(prev =>
      prev.map(m =>
        m.id === modelId
          ? { ...m, isDownloaded: false, isDownloading: false, isCustomApi: false, downloadProgress: 0 }
          : m
      ).filter(m => !(m.isCustomApi && m.id === modelId))
    );
  };

  const handleRenameModel = (modelId: string, newName: string) => {
    setModels(prev =>
      prev.map(m => (m.id === modelId ? { ...m, name: newName } : m))
    );
  };

  const handleAddCustomApiModel = (apiModelData: Partial<AIModel>) => {
    const newModel: AIModel = {
      id: `api-model-${Date.now()}`,
      name: apiModelData.name || 'Custom API AI',
      originalName: apiModelData.name || 'Custom API AI',
      // @ts-ignore
      classes: apiModelData.classes || ['Chat AI'],
      size: 'Cloud API',
      vramReq: 0,
      ramReq: 1,
      quantization: 'REST / vLLM',
      author: 'API Endpoint',
      downloads: 'Custom',
      repoUrl: apiModelData.apiUrl || 'https://api.openai.com/v1',
      description: apiModelData.description || {
        tr: 'Özel API modeli',
        en: 'Custom API model',
        ru: 'Пользовательская модель API'
      },
      isDownloaded: true,
      downloadProgress: 100,
      isCustomApi: true,
      apiUrl: apiModelData.apiUrl,
      apiKey: apiModelData.apiKey,
      tags: ['API', 'Custom']
    };

    setModels(prev => [newModel, ...prev]);
  };

  // Files and context handlers
  const handleAddSessionFiles = (newFiles: AttachmentItem[]) => {
    setSessions(prev =>
      prev.map(s =>
        s.id === activeSessionId
          ? { ...s, attachedFiles: [...s.attachedFiles, ...newFiles] }
          : s
      )
    );
  };

  const handleRemoveSessionFile = (fileId: string) => {
    setSessions(prev =>
      prev.map(s =>
        s.id === activeSessionId
          ? { ...s, attachedFiles: s.attachedFiles.filter(f => f.id !== fileId) }
          : s
      )
    );
  };

  const handleToggleSessionFile = (fileId: string) => {
    setSessions(prev =>
      prev.map(s =>
        s.id === activeSessionId
          ? {
              ...s,
              attachedFiles: s.attachedFiles.map(f =>
                f.id === fileId ? { ...f, enabled: !f.enabled } : f
              )
            }
          : s
      )
    );
  };

  // Code Studio File Edit Update
  const handleUpdateFileContent = (fileName: string, newContent: string) => {
    setSessions(prev =>
      prev.map(s => {
        if (s.id !== activeSessionId || !s.currentFiles) return s;
        return {
          ...s,
          currentFiles: s.currentFiles.map(f =>
            f.name === fileName ? { ...f, content: newContent } : f
          )
        };
      })
    );
  };

  // System Prompts handlers
  const handleAddSystemPrompt = (title: string, prompt: string) => {
    const newP: SystemPrompt = {
      id: `prompt-${Date.now()}`,
      title,
      prompt,
      active: true
    };
    setSystemPrompts(prev => [...prev, newP]);
  };

  const handleUpdateSystemPrompt = (id: string, title: string, prompt: string, active: boolean) => {
    setSystemPrompts(prev =>
      prev.map(p => (p.id === id ? { ...p, title, prompt, active } : p))
    );
  };

  const handleDeleteSystemPrompt = (id: string) => {
    setSystemPrompts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className={`h-screen w-screen flex flex-col overflow-hidden font-sans ${theme === 'dark' ? 'bg-[#0f121a] text-slate-100' : 'bg-[#f8fafc] text-slate-800'}`}>
      {/* 1. Windows App Top Title Bar */}
      <TitleBar
        lang={lang}
        theme={theme}
      />

      {/* 2. Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Vertical Icon Navigation Bar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          lang={lang}
          theme={theme}
          downloadingCount={downloadingCount}
        />

        {/* Dynamic Main Workspace Views */}
        {activeTab === 'chat' && (
          <div className="flex-1 flex overflow-hidden">
            {/* Chat Sessions Left Drawer */}
            <ChatSessionsDrawer
              sessions={sessions}
              activeSessionId={activeSessionId}
              onSelectSession={setActiveSessionId}
              onCreateSession={handleCreateSession}
              onRenameSession={handleRenameSession}
              onDeleteSession={handleDeleteSession}
              lang={lang}
              theme={theme}
            />

            {/* Main Interactive Chat Panel */}
            <ChatView
              session={currentSession}
              allModels={models}
              activeModel={activeModel}
              onSelectModel={handleSelectModel}
              onSendMessage={handleSendMessage}
              onStopGeneration={handleStopGeneration}
              isGenerating={isGenerating}
              onSwitchToPreview={() => setActiveTab('preview')}
              onSwitchToCodeStudio={() => setActiveTab('code_studio')}
              lang={lang}
              theme={theme}
            />
          </div>
        )}

        {/* 2. Live Code Preview Sandbox */}
        {activeTab === 'preview' && (
          <PreviewView
            files={currentSession.currentFiles || []}
            previewType={currentSession.activePreviewType || 'web'}
            lang={lang}
            theme={theme}
          />
        )}

        {/* 3. Code Studio & File Explorer */}
        {activeTab === 'code_studio' && (
          <CodeStudioView
            files={currentSession.currentFiles || []}
            onUpdateFileContent={handleUpdateFileContent}
            lang={lang}
            theme={theme}
          />
        )}

        {/* 4. Context Files & Workspace Attachments */}
        {activeTab === 'context_files' && (
          <FilesContextView
            attachedFiles={currentSession.attachedFiles}
            onAddFiles={handleAddSessionFiles}
            onRemoveFile={handleRemoveSessionFile}
            onToggleFile={handleToggleSessionFile}
            sessionTitle={currentSession.title}
            lang={lang}
            theme={theme}
          />
        )}

        {/* 5. Bottom 1: Model Store */}
        {activeTab === 'model_store' && (
          <ModelStoreView
            allModels={models}
            onStartDownload={handleStartDownload}
            hardware={hardware}
            lang={lang}
            theme={theme}
            onOpenSettings={() => setActiveTab('settings')}
          />
        )}

        {/* 6. Bottom 2: Downloaded Models & API Manager */}
        {activeTab === 'model_manager' && (
          <ModelManagerView
            models={models}
            onPauseDownload={handlePauseDownload}
            onResumeDownload={handleResumeDownload}
            onCancelDownload={handleCancelDownload}
            onDeleteModel={handleDeleteModel}
            onRenameModel={handleRenameModel}
            onAddCustomApiModel={handleAddCustomApiModel}
            lang={lang}
            theme={theme}
          />
        )}

        {/* 7. Bottom 3: Settings */}
        {activeTab === 'settings' && (
          <SettingsModal
            theme={theme}
            onToggleTheme={setTheme}
            lang={lang}
            onChangeLang={setLang}
            systemPrompts={systemPrompts}
            onAddSystemPrompt={handleAddSystemPrompt}
            onUpdateSystemPrompt={handleUpdateSystemPrompt}
            onDeleteSystemPrompt={handleDeleteSystemPrompt}
            hardware={hardware}
            onUpdateHardwareSliders={(vram, ram) => {
              setHardware(prev => ({
                ...prev,
                vramAllocatedGB: vram,
                ramAllocatedGB: Math.min(64, ram)
              }));
            }}
          />
        )}
      </div>
    </div>
  );
}
