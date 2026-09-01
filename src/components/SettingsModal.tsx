import React, { useState } from 'react';
import {
  Settings,
  Moon,
  Sun,
  Languages,
  Plus,
  Edit2,
  Trash2,
  HardDrive,
  Cpu,
  Info
} from 'lucide-react';
import { HardwareConfig, Language, SystemPrompt } from '../types';
import { TRANSLATIONS } from '../utils/translations';

interface SettingsModalProps {
  theme: 'dark' | 'light';
  onToggleTheme: (theme: 'dark' | 'light') => void;
  lang: Language;
  onChangeLang: (lang: Language) => void;
  systemPrompts: SystemPrompt[];
  onAddSystemPrompt: (title: string, prompt: string) => void;
  onUpdateSystemPrompt: (id: string, title: string, prompt: string, active: boolean) => void;
  onDeleteSystemPrompt: (id: string) => void;
  hardware: HardwareConfig;
  onUpdateHardwareSliders: (vramGB: number, ramGB: number) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  theme,
  onToggleTheme,
  lang,
  onChangeLang,
  systemPrompts,
  onAddSystemPrompt,
  onUpdateSystemPrompt,
  onDeleteSystemPrompt,
  hardware,
  onUpdateHardwareSliders
}) => {
  const t = TRANSLATIONS[lang];

  // System Prompt State
  const [newTitle, setNewTitle] = useState('');
  const [newPrompt, setNewPrompt] = useState('');
  const [isAddingPrompt, setIsAddingPrompt] = useState(false);
  const [editingPromptId, setEditingPromptId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editPrompt, setEditPrompt] = useState('');

  // Hardware allocation local sliders
  const [vramVal, setVramVal] = useState(hardware.vramAllocatedGB);
  const [ramVal, setRamVal] = useState(hardware.ramAllocatedGB);

  const handleCreatePrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newPrompt.trim()) return;
    onAddSystemPrompt(newTitle.trim(), newPrompt.trim());
    setNewTitle('');
    setNewPrompt('');
    setIsAddingPrompt(false);
  };

  const handleStartEdit = (p: SystemPrompt) => {
    setEditingPromptId(p.id);
    setEditTitle(p.title);
    setEditPrompt(p.prompt);
  };

  const handleSaveEdit = (id: string) => {
    if (editTitle.trim() && editPrompt.trim()) {
      onUpdateSystemPrompt(id, editTitle.trim(), editPrompt.trim(), true);
    }
    setEditingPromptId(null);
  };

  const handleSliderChange = (vram: number, ram: number) => {
    setVramVal(vram);
    setRamVal(ram);
    onUpdateHardwareSliders(vram, ram);
  };

  const isLight = theme === 'light';

  // Math-exact tick coordinates
  const vramTicks = [
    { val: 0, label: '0 GB' },
    { val: 4, label: '4 GB' },
    { val: 8, label: '8 GB' },
    { val: 16, label: '16 GB' },
    { val: 24, label: '24 GB' },
    { val: 32, label: '32 GB' },
    { val: 48, label: '48 GB' }
  ];

  const ramTicks = [
    { val: 0, label: '0 GB' },
    { val: 4, label: '4 GB' },
    { val: 8, label: '8 GB' },
    { val: 16, label: '16 GB' },
    { val: 24, label: '24 GB' },
    { val: 32, label: '32 GB' },
    { val: 48, label: '48 GB' },
    { val: 64, label: '64 GB' }
  ];

  return (
    <div className={`flex-1 flex flex-col h-full overflow-hidden ${isLight ? 'bg-slate-100/70' : 'bg-[#0f121a]'}`}>
      {/* Top Header */}
      <div
        className={`h-12 px-6 border-b flex items-center justify-between shrink-0 select-none ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#151a26] border-slate-800'
        }`}
      >
        <div className="flex items-center space-x-3">
          <Settings className="w-5 h-5 text-indigo-500" />
          <h2 className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
            {t.settings.title}
          </h2>
        </div>
      </div>

      {/* Main Settings Body */}
      <div className="flex-1 p-6 overflow-y-auto space-y-8 max-w-4xl">
        {/* 1. Theme & Language Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Theme Selector */}
          <div className={`p-4 rounded-2xl border space-y-3 ${
            isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#141a27] border-slate-800'
          }`}>
            <label className={`text-xs font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              <Sun className="w-4 h-4 text-amber-500" /> {t.settings.theme}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onToggleTheme('dark')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                  theme === 'dark'
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-sm'
                    : isLight
                    ? 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Moon className="w-4 h-4 text-indigo-400" />
                <span>{t.settings.themeDark}</span>
              </button>

              <button
                type="button"
                onClick={() => onToggleTheme('light')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                  theme === 'light'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : isLight
                    ? 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Sun className="w-4 h-4 text-amber-400" />
                <span>{t.settings.themeLight}</span>
              </button>
            </div>
          </div>

          {/* Language Selector: Türkçe, English, Русский */}
          <div className={`p-4 rounded-2xl border space-y-3 ${
            isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#141a27] border-slate-800'
          }`}>
            <label className={`text-xs font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              <Languages className="w-4 h-4 text-cyan-500" /> {t.settings.language}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { code: 'tr' as Language, label: 'Türkçe', flag: '🇹🇷' },
                { code: 'en' as Language, label: 'English', flag: '🇺🇸' },
                { code: 'ru' as Language, label: 'Русский', flag: '🇷🇺' }
              ].map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => onChangeLang(item.code)}
                  className={`py-2.5 px-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                    lang === item.code
                      ? isLight
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-indigo-600/30 border-indigo-500 text-white shadow-sm'
                      : isLight
                      ? 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>{item.flag}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 2. Hardware Resource Allocation Sliders (RAM & VRAM Limits for AI) */}
        <div className={`p-5 rounded-2xl border space-y-5 ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#141a27] border-slate-800'
        }`}>
          <div>
            <h3 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              <HardDrive className="w-4 h-4 text-indigo-500" /> {t.settings.resourceAlloc}
            </h3>
            <p className={`text-[11px] mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              {t.settings.resourceAllocDesc}
            </p>
          </div>

          <div className="space-y-6 pt-1">
            {/* VRAM Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className={`flex items-center gap-1.5 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                  <HardDrive className="w-3.5 h-3.5 text-emerald-500" /> {t.settings.vramSlider}
                </span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-lg border border-emerald-300 dark:border-emerald-800 text-xs">
                  {vramVal} GB VRAM
                </span>
              </div>

              {/* Slider Input */}
              <div className="relative px-1">
                <input
                  type="range"
                  min={0}
                  max={48}
                  step={1}
                  value={vramVal}
                  onChange={(e) => handleSliderChange(Number(e.target.value), ramVal)}
                  className="w-full h-2.5 bg-slate-300 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none"
                />

                {/* Mathematical Ticks */}
                <div className="relative w-full h-6 mt-1 text-[10px] font-mono text-slate-500 select-none">
                  {vramTicks.map((tick) => {
                    const percent = (tick.val / 48) * 100;
                    return (
                      <span
                        key={tick.val}
                        onClick={() => handleSliderChange(tick.val, ramVal)}
                        className={`absolute cursor-pointer hover:text-indigo-400 transition transform ${
                          tick.val === 0
                            ? 'left-0'
                            : tick.val === 48
                            ? 'right-0'
                            : '-translate-x-1/2'
                        } ${vramVal === tick.val ? 'text-emerald-500 font-bold' : ''}`}
                        style={tick.val !== 0 && tick.val !== 48 ? { left: `${percent}%` } : undefined}
                      >
                        {tick.label}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* RAM Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className={`flex items-center gap-1.5 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                  <Cpu className="w-3.5 h-3.5 text-cyan-500" /> {t.settings.ramSlider}
                </span>
                <span className="font-mono text-cyan-600 dark:text-cyan-400 font-bold bg-cyan-50 dark:bg-cyan-950/60 px-2.5 py-0.5 rounded-lg border border-cyan-300 dark:border-cyan-800 text-xs">
                  {ramVal} GB RAM
                </span>
              </div>

              {/* Slider Input */}
              <div className="relative px-1">
                <input
                  type="range"
                  min={0}
                  max={64}
                  step={1}
                  value={Math.min(64, ramVal)}
                  onChange={(e) => handleSliderChange(vramVal, Math.min(64, Number(e.target.value)))}
                  className="w-full h-2.5 bg-slate-300 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none"
                />

                {/* Mathematical Ticks */}
                <div className="relative w-full h-6 mt-1 text-[10px] font-mono text-slate-500 select-none">
                  {ramTicks.map((tick) => {
                    const percent = (tick.val / 64) * 100;
                    return (
                      <span
                        key={tick.val}
                        onClick={() => handleSliderChange(vramVal, tick.val)}
                        className={`absolute cursor-pointer hover:text-indigo-400 transition transform ${
                          tick.val === 0
                            ? 'left-0'
                            : tick.val === 64
                            ? 'right-0'
                            : '-translate-x-1/2'
                        } ${ramVal === tick.val ? 'text-cyan-500 font-bold' : ''}`}
                        style={tick.val !== 0 && tick.val !== 64 ? { left: `${percent}%` } : undefined}
                      >
                        {tick.label}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Token unbounded note */}
            <div className={`p-3 rounded-xl border flex items-start gap-2.5 ${
              isLight ? 'bg-amber-50/80 border-amber-200 text-amber-900' : 'bg-amber-950/20 border-amber-500/20 text-amber-300'
            }`}>
              <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                {t.settings.tokenNote}
              </p>
            </div>
          </div>
        </div>

        {/* 3. System Persistent Prompts (Memory) - No Checkboxes per user request */}
        <div className={`p-5 rounded-2xl border space-y-4 ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#141a27] border-slate-800'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {t.settings.systemPromptTitle}
              </h3>
              <p className={`text-[11px] mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                {t.settings.systemPromptDesc}
              </p>
            </div>
            {!isAddingPrompt && (
              <button
                onClick={() => setIsAddingPrompt(true)}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition active:scale-[0.98]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.settings.addPrompt}</span>
              </button>
            )}
          </div>

          {/* New Prompt Input Form */}
          {isAddingPrompt && (
            <form onSubmit={handleCreatePrompt} className={`p-4 rounded-xl border space-y-3 ${
              isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-900/90 border-slate-700'
            }`}>
              <div>
                <label className={`text-[11px] font-semibold block mb-1 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                  {t.settings.promptName}
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder={lang === 'tr' ? 'Örn: Senior Kodlama Asistanı' : lang === 'ru' ? 'Напр: Старший Архитектор Кода' : 'e.g., Senior Code Architect'}
                  className={`w-full px-3 py-1.5 rounded-lg text-xs outline-none focus:ring-1 focus:ring-indigo-500 ${
                    isLight ? 'bg-white border border-slate-300 text-slate-900' : 'bg-slate-800 border border-slate-700 text-white'
                  }`}
                  required
                />
              </div>

              <div>
                <label className={`text-[11px] font-semibold block mb-1 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                  {t.settings.promptContent}
                </label>
                <textarea
                  rows={3}
                  value={newPrompt}
                  onChange={(e) => setNewPrompt(e.target.value)}
                  placeholder={lang === 'tr' ? 'Yapay zekanın hiçbir zaman unutmaması gereken kuralı yazın...' : lang === 'ru' ? 'Инструкция или правило, которое ИИ должен помнить всегда...' : 'Write persistent memory rule or instruction that AI will always retain...'}
                  className={`w-full p-2.5 rounded-lg text-xs outline-none focus:ring-1 focus:ring-indigo-500 resize-none ${
                    isLight ? 'bg-white border border-slate-300 text-slate-900' : 'bg-slate-800 border border-slate-700 text-white'
                  }`}
                  required
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingPrompt(false)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    isLight ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                >
                  {t.save}
                </button>
              </div>
            </form>
          )}

          {/* Prompts List - Clean cards without checkboxes */}
          <div className="space-y-2.5">
            {systemPrompts.map((p) => {
              const isEditing = editingPromptId === p.id;

              return (
                <div
                  key={p.id}
                  className={`p-3.5 rounded-xl border transition flex flex-col gap-2 ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'
                  }`}
                >
                  {isEditing ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className={`w-full px-2.5 py-1 rounded border text-xs font-bold outline-none ${
                          isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-800 border-slate-700 text-white'
                        }`}
                      />
                      <textarea
                        rows={2}
                        value={editPrompt}
                        onChange={(e) => setEditPrompt(e.target.value)}
                        className={`w-full p-2 rounded border text-xs outline-none resize-none ${
                          isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-800 border-slate-700 text-white'
                        }`}
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditingPromptId(null)}
                          className="px-2.5 py-1 text-slate-400 hover:text-slate-200 text-xs"
                        >
                          {t.cancel}
                        </button>
                        <button
                          onClick={() => handleSaveEdit(p.id)}
                          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold"
                        >
                          {t.save}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                          <span className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                            {p.title}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleStartEdit(p)}
                            className={`p-1.5 rounded-lg transition ${
                              isLight ? 'text-slate-600 hover:text-indigo-600 hover:bg-slate-200' : 'text-slate-400 hover:text-indigo-400 hover:bg-slate-800'
                            }`}
                            title={t.edit}
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteSystemPrompt(p.id)}
                            className={`p-1.5 rounded-lg transition ${
                              isLight ? 'text-slate-600 hover:text-rose-600 hover:bg-slate-200' : 'text-slate-400 hover:text-rose-400 hover:bg-slate-800'
                            }`}
                            title={t.delete}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className={`text-[11px] leading-relaxed pl-4 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                        {p.prompt}
                      </p>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Windows C++ Native Desktop Compilation Info */}
        <div className={`p-5 rounded-2xl border ${
          isLight ? 'bg-indigo-50/70 border-indigo-200 text-slate-800' : 'bg-indigo-950/20 border-indigo-800/60 text-slate-200'
        }`}>
          <div className="flex items-center gap-2.5 mb-2">
            <div className="p-2 rounded-xl bg-indigo-600 text-white font-mono text-xs font-bold">
              C++
            </div>
            <div>
              <h3 className={`text-sm font-bold ${isLight ? 'text-indigo-950' : 'text-white'}`}>
                Visual Studio Community (Windows .EXE)
              </h3>
              <p className="text-xs text-indigo-500 dark:text-indigo-400 font-mono">
                windows-cpp/HelfrexAI.sln
              </p>
            </div>
          </div>
          <p className="text-xs leading-relaxed opacity-90 mb-3">
            Tüm C++20 Win32, DirectX/DXGI VRAM algılama ve WebView2 bağımsız masaüstü kodları <code>windows-cpp/</code> klasöründe hazırlandı. Visual Studio Community ile doğrudan açıp <strong>Release (x64)</strong> modunda <code>HelfrexAI.exe</code> olarak derleyebilirsiniz.
          </p>
          <div className="text-[11px] font-mono p-2.5 rounded-lg bg-black/40 text-emerald-400 border border-white/10 select-all">
            Visual Studio &rarr; Open Solution &rarr; windows-cpp/HelfrexAI.sln &rarr; Build Solution (Ctrl+Shift+B)
          </div>
        </div>
      </div>
    </div>
  );
};
