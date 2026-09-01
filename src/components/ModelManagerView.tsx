import React, { useState } from 'react';
import {
  Bot,
  Play,
  Pause,
  Trash2,
  Edit2,
  Plus,
  Check,
  X,
  Layers,
  HardDrive,
  Cpu,
  Globe,
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import { AIModel, Language } from '../types';
import { TRANSLATIONS } from '../utils/translations';

interface ModelManagerViewProps {
  models: AIModel[];
  onPauseDownload: (modelId: string) => void;
  onResumeDownload: (modelId: string) => void;
  onCancelDownload: (modelId: string) => void;
  onDeleteModel: (modelId: string) => void;
  onRenameModel: (modelId: string, newName: string) => void;
  onAddCustomApiModel: (model: Partial<AIModel>) => void;
  lang: Language;
  theme: 'dark' | 'light';
}

export const ModelManagerView: React.FC<ModelManagerViewProps> = ({
  models,
  onPauseDownload,
  onResumeDownload,
  onCancelDownload,
  onDeleteModel,
  onRenameModel,
  onAddCustomApiModel,
  lang,
  theme
}) => {
  const t = TRANSLATIONS[lang];

  // Modals state
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState<AIModel | null>(null);
  const [editingModelId, setEditingModelId] = useState<string | null>(null);
  const [editNameText, setEditNameText] = useState('');

  // API Modal Form State
  const [apiName, setApiName] = useState('');
  const [apiUrl, setApiUrl] = useState('https://api.openai.com/v1');
  const [apiKey, setApiKey] = useState('');
  const [selectedApiClasses, setSelectedApiClasses] = useState<string[]>(['Chat AI', 'Code AI']);

  const downloadingModels = models.filter(m => m.isDownloading);
  const readyModels = models.filter(m => m.isDownloaded || m.isCustomApi);

  // Group ready models by their category string
  const getCategoryLabel = (classes: string[]) => {
    if (classes.length > 1) {
      if (classes.includes('Code AI') && classes.includes('Chat AI')) {
        return lang === 'tr' ? 'Code & Chat Modelleri' : lang === 'ru' ? 'Модели Кода и Чата' : 'Code & Chat Models';
      }
      return classes.map(c => t.classes[c as any] || c).join(' & ');
    }
    return t.classes[classes[0] as any] || classes[0] || (lang === 'tr' ? 'Diğer Modeller' : lang === 'ru' ? 'Другие модели' : 'Other Models');
  };

  const groupedReadyModels: Record<string, AIModel[]> = {};

  readyModels.forEach((model) => {
    const groupKey = getCategoryLabel(model.classes);
    if (!groupedReadyModels[groupKey]) {
      groupedReadyModels[groupKey] = [];
    }
    groupedReadyModels[groupKey].push(model);
  });

  const handleStartRename = (model: AIModel) => {
    setEditingModelId(model.id);
    setEditNameText(model.name);
  };

  const handleSaveRename = (modelId: string) => {
    if (editNameText.trim()) {
      onRenameModel(modelId, editNameText.trim());
    }
    setEditingModelId(null);
  };

  const handleToggleClass = (cls: string) => {
    setSelectedApiClasses(prev =>
      prev.includes(cls) ? prev.filter(c => c !== cls) : [...prev, cls]
    );
  };

  const handleSaveApiModel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiName.trim() || selectedApiClasses.length === 0) return;

    onAddCustomApiModel({
      name: apiName.trim(),
      originalName: apiName.trim(),
      // @ts-ignore
      classes: selectedApiClasses,
      size: 'Cloud API',
      vramReq: 0,
      ramReq: 1,
      quantization: 'API Endpoint',
      author: 'Custom Endpoint',
      downloads: 'Custom',
      repoUrl: apiUrl,
      description: {
        tr: `${apiName} özel API uç noktası (${apiUrl})`,
        en: `${apiName} custom API endpoint (${apiUrl})`,
        ru: `${apiName} пользовательский эндпоинт (${apiUrl})`
      },
      isDownloaded: true,
      downloadProgress: 100,
      isCustomApi: true,
      apiUrl,
      apiKey,
      tags: ['API', ...selectedApiClasses]
    });

    setApiName('');
    setApiKey('');
    setIsApiModalOpen(false);
  };

  const isLight = theme === 'light';

  return (
    <div className={`flex-1 flex flex-col h-full overflow-hidden ${isLight ? 'bg-slate-100/70' : 'bg-[#0f121a]'}`}>
      {/* Top Header Bar */}
      <div
        className={`h-12 px-6 border-b flex items-center justify-between shrink-0 select-none ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#151a26] border-slate-800'
        }`}
      >
        <div className="flex items-center space-x-3">
          <Bot className="w-5 h-5 text-indigo-500" />
          <div>
            <h2 className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {t.modelManager.title}
            </h2>
            <p className={`text-[10px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              {t.modelManager.subtitle}
            </p>
          </div>
        </div>

        {/* API Model Button */}
        <button
          onClick={() => setIsApiModalOpen(true)}
          className="px-3.5 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition active:scale-95"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>{t.modelManager.addApiButton}</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 overflow-y-auto space-y-8">
        {/* 1. Active Downloads Queue */}
        {downloadingModels.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-amber-500 text-xs font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              <span>{t.modelManager.activeDownloads} ({downloadingModels.length})</span>
            </div>

            <div className="space-y-2.5">
              {downloadingModels.map((model) => (
                <div
                  key={model.id}
                  className={`p-4 rounded-xl border shadow-md space-y-2.5 ${
                    isLight ? 'bg-white border-amber-400' : 'bg-[#141a28] border-amber-500/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{model.name}</h4>
                      <span className={`text-[10px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                        {model.size} • {model.downloadSpeed || '48.6 MB/s'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {model.isPaused ? (
                        <button
                          onClick={() => onResumeDownload(model.id)}
                          className="p-1.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-600 dark:text-emerald-300 rounded-lg transition"
                          title={t.resume}
                        >
                          <Play className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => onPauseDownload(model.id)}
                          className="p-1.5 bg-amber-600/20 hover:bg-amber-600 text-amber-600 dark:text-amber-300 rounded-lg transition"
                          title={t.pause}
                        >
                          <Pause className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        onClick={() => onCancelDownload(model.id)}
                        className="p-1.5 bg-rose-600/20 hover:bg-rose-600 text-rose-600 dark:text-rose-300 rounded-lg transition"
                        title={t.cancel}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-200 dark:bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-300 dark:border-slate-700/60">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        model.isPaused ? 'bg-amber-500' : 'bg-gradient-to-r from-indigo-500 to-cyan-400'
                      }`}
                      style={{ width: `${model.downloadProgress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>{model.downloadProgress}% tamamlandı</span>
                    <span>{model.downloadSpeed || '48.6 MB/s'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. Downloaded / Installed Models Categorized */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
            <h3 className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {t.modelManager.readyModels} ({readyModels.length})
            </h3>
          </div>

          {readyModels.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Bot className="w-12 h-12 text-slate-500 mx-auto" />
              <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                {t.modelManager.noReadyModels}
              </p>
            </div>
          ) : (
            Object.entries(groupedReadyModels).map(([category, catModels]) => (
              <div key={category} className="space-y-3">
                {/* Category Banner */}
                <div className="flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-indigo-500" />
                  <h4 className={`text-xs font-bold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                    {category}
                  </h4>
                  <span className="text-[10px] font-mono bg-indigo-500/10 text-indigo-500 px-2 py-0.5 rounded-full font-bold">
                    {catModels.length} {t.models}
                  </span>
                </div>

                {/* Model Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {catModels.map((model) => {
                    const isEditing = editingModelId === model.id;

                    return (
                      <div
                        key={model.id}
                        className={`p-4 rounded-xl border transition group shadow-sm flex flex-col justify-between ${
                          isLight
                            ? 'bg-white border-slate-200 hover:border-slate-300'
                            : 'bg-[#141a27] border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div>
                          {/* Top Card Header */}
                          <div className="flex items-start justify-between gap-2 mb-2">
                            {isEditing ? (
                              <div className="flex items-center gap-1.5 flex-1">
                                <input
                                  type="text"
                                  value={editNameText}
                                  onChange={(e) => setEditNameText(e.target.value)}
                                  className={`w-full px-2 py-1 text-xs rounded border outline-none font-bold ${
                                    isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-800 border-slate-700 text-white'
                                  }`}
                                  autoFocus
                                />
                                <button
                                  onClick={() => handleSaveRename(model.id)}
                                  className="p-1 bg-emerald-600 text-white rounded hover:bg-emerald-500"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setEditingModelId(null)}
                                  className="p-1 bg-slate-700 text-slate-300 rounded hover:bg-slate-600"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <div>
                                <h4 className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                                  {model.name}
                                </h4>
                                {model.originalName && model.originalName !== model.name && (
                                  <span className={`text-[10px] block ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
                                    {t.modelManager.originalName}: {model.originalName}
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Action Buttons */}
                            {!isEditing && (
                              <div className="flex items-center space-x-1 shrink-0">
                                <button
                                  onClick={() => handleStartRename(model)}
                                  className={`p-1.5 rounded-lg transition ${
                                    isLight
                                      ? 'text-slate-500 hover:text-indigo-600 hover:bg-slate-100'
                                      : 'text-slate-400 hover:text-indigo-400 hover:bg-slate-800'
                                  }`}
                                  title={t.rename}
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setDeleteCandidate(model)}
                                  className={`p-1.5 rounded-lg transition ${
                                    isLight
                                      ? 'text-slate-500 hover:text-rose-600 hover:bg-slate-100'
                                      : 'text-slate-400 hover:text-rose-400 hover:bg-slate-800'
                                  }`}
                                  title={t.delete}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Class / Tags Badge List */}
                          <div className="flex flex-wrap gap-1 mb-3">
                            {model.classes.map((cls) => (
                              <span
                                key={cls}
                                className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                                  isLight
                                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                    : 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20'
                                }`}
                              >
                                {t.classes[cls as any] || cls}
                              </span>
                            ))}
                            {model.isCustomApi ? (
                              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                {t.modelManager.customApi}
                              </span>
                            ) : (
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                                  isLight
                                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                }`}
                              >
                                {model.quantization}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Resource Specs Footer */}
                        <div
                          className={`pt-2.5 border-t flex items-center justify-between text-[11px] font-mono ${
                            isLight ? 'border-slate-200 text-slate-600' : 'border-slate-800 text-slate-400'
                          }`}
                        >
                          <span className="flex items-center gap-1 font-sans">
                            <HardDrive className="w-3 h-3 text-indigo-500" />
                            <span>{model.size}</span>
                          </span>

                          <span className="flex items-center gap-1">
                            <Cpu className="w-3 h-3 text-cyan-500" />
                            <span>{model.vramReq}G VRAM / {model.ramReq}G RAM</span>
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteCandidate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-md p-6 rounded-2xl border shadow-2xl space-y-4 animate-fadeIn ${
            isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-[#181f2e] border-slate-700 text-white'
          }`}>
            <div className="flex items-center space-x-3 text-rose-500">
              <AlertTriangle className="w-6 h-6" />
              <h3 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {t.modelManager.deleteConfirmTitle}
              </h3>
            </div>

            <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              <strong>{deleteCandidate.name}</strong> {t.modelManager.deleteConfirmDesc}
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteCandidate(null)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold ${
                  isLight ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {t.cancel}
              </button>
              <button
                onClick={() => {
                  onDeleteModel(deleteCandidate.id);
                  setDeleteCandidate(null);
                }}
                className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow"
              >
                {t.delete}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom API Model Modal */}
      {isApiModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-lg p-6 rounded-2xl border shadow-2xl space-y-4 animate-fadeIn ${
            isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-[#181f2e] border-slate-700 text-white'
          }`}>
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-700">
              <div className="flex items-center space-x-2 text-indigo-500">
                <Globe className="w-5 h-5" />
                <h3 className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {t.modelManager.apiModalTitle}
                </h3>
              </div>
              <button onClick={() => setIsApiModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveApiModel} className="space-y-3.5">
              <div>
                <label className={`text-[11px] font-semibold block mb-1 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                  {t.modelManager.apiModelName}
                </label>
                <input
                  type="text"
                  value={apiName}
                  onChange={(e) => setApiName(e.target.value)}
                  placeholder={lang === 'tr' ? 'Örn: DeepSeek R1 Full, Claude 3.5 Sonnet' : lang === 'ru' ? 'Напр: DeepSeek R1 Full, Claude 3.5' : 'e.g., DeepSeek R1 Full, Claude 3.5 Sonnet'}
                  className={`w-full px-3 py-2 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isLight ? 'bg-slate-50 border border-slate-300 text-slate-900' : 'bg-slate-900 border border-slate-700 text-white'
                  }`}
                  required
                />
              </div>

              <div>
                <label className={`text-[11px] font-semibold block mb-1 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                  {t.modelManager.apiUrl}
                </label>
                <input
                  type="text"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  placeholder="http://localhost:11434 veya https://api.openai.com/v1"
                  className={`w-full px-3 py-2 rounded-xl text-xs font-mono outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isLight ? 'bg-slate-50 border border-slate-300 text-slate-900' : 'bg-slate-900 border border-slate-700 text-white'
                  }`}
                  required
                />
              </div>

              <div>
                <label className={`text-[11px] font-semibold block mb-1 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                  {t.modelManager.apiKey}
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder={lang === 'tr' ? 'sk-... (Ollama/Yerel için boş bırakılabilir)' : lang === 'ru' ? 'sk-... (для локальных моделей можно оставить пустым)' : 'sk-... (Optional for Ollama / local)'}
                  className={`w-full px-3 py-2 rounded-xl text-xs font-mono outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isLight ? 'bg-slate-50 border border-slate-300 text-slate-900' : 'bg-slate-900 border border-slate-700 text-white'
                  }`}
                />
              </div>

              {/* Multi-Class Selection */}
              <div>
                <label className={`text-[11px] font-semibold block mb-1.5 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                  {t.modelManager.apiClasses}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['Chat AI', 'Code AI', 'Image AI', 'Video AI'].map((cls) => {
                    const isSelected = selectedApiClasses.includes(cls);
                    return (
                      <button
                        type="button"
                        key={cls}
                        onClick={() => handleToggleClass(cls)}
                        className={`p-2 rounded-xl border text-xs font-medium flex items-center justify-between transition ${
                          isSelected
                            ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400'
                            : isLight
                            ? 'bg-slate-50 border-slate-300 text-slate-700'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        <span>{t.classes[cls as any] || cls}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                      </button>
                    );
                  })}
                </div>
                <p className={`text-[10px] mt-1.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  {t.modelManager.addClassHint}
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsApiModalOpen(false)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold ${
                    isLight ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30"
                >
                  {t.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
