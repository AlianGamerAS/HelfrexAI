import React from 'react';
import {
  MessageSquare,
  Eye,
  Code,
  FolderTree,
  Bot,
  Plus,
  Settings
} from 'lucide-react';
import { ActiveTab, Language } from '../types';
import { TRANSLATIONS } from '../utils/translations';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  lang: Language;
  theme: 'dark' | 'light';
  downloadingCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  lang,
  theme,
  downloadingCount
}) => {
  const t = TRANSLATIONS[lang];
  const isLight = theme === 'light';

  const topItems = [
    {
      id: 'chat' as ActiveTab,
      label: t.nav.chat,
      icon: MessageSquare,
      shortcut: 'Ctrl+1'
    },
    {
      id: 'preview' as ActiveTab,
      label: t.nav.preview,
      icon: Eye,
      shortcut: 'Ctrl+2'
    },
    {
      id: 'code_studio' as ActiveTab,
      label: t.nav.codeStudio,
      icon: Code,
      shortcut: 'Ctrl+3'
    },
    {
      id: 'context_files' as ActiveTab,
      label: t.nav.contextFiles,
      icon: FolderTree,
      shortcut: 'Ctrl+4'
    }
  ];

  const bottomItems = [
    {
      id: 'model_store' as ActiveTab,
      label: t.nav.modelStore,
      icon: Bot,
      hasPlus: true
    },
    {
      id: 'model_manager' as ActiveTab,
      label: t.nav.modelManager,
      icon: Bot,
      badge: downloadingCount > 0 ? downloadingCount : undefined
    },
    {
      id: 'settings' as ActiveTab,
      label: t.nav.settings,
      icon: Settings
    }
  ];

  return (
    <aside
      id="helfrex-sidebar"
      className={`w-16 flex flex-col justify-between items-center py-3 border-r select-none transition-colors z-20 ${
        isLight
          ? 'bg-[#f8fafc] border-slate-200 text-slate-600'
          : 'bg-[#10141d] border-slate-800/80 text-slate-400'
      }`}
    >
      {/* Top 4 Navigation Buttons */}
      <div className="flex flex-col items-center space-y-3 w-full px-2">
        {topItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={`${item.label} (${item.shortcut})`}
              className={`relative w-11 h-11 rounded-xl flex items-center justify-center transition-all group ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : isLight
                  ? 'hover:bg-slate-200 text-slate-600 hover:text-slate-900'
                  : 'hover:bg-slate-800/70 hover:text-slate-200 text-slate-400'
              }`}
            >
              <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />

              {/* Active Pill Indicator */}
              {isActive && (
                <span className="absolute -left-2 top-2.5 bottom-2.5 w-1 bg-indigo-400 rounded-r-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom 3 Navigation Buttons */}
      <div className="flex flex-col items-center space-y-3 w-full px-2">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={item.label}
              className={`relative w-11 h-11 rounded-xl flex items-center justify-center transition-all group ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : isLight
                  ? 'hover:bg-slate-200 text-slate-600 hover:text-slate-900'
                  : 'hover:bg-slate-800/70 hover:text-slate-200 text-slate-400'
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                {item.hasPlus && (
                  <span className={`absolute -top-1.5 -right-2 bg-indigo-500 text-white rounded-full p-0.5 shadow-sm border ${
                    isLight ? 'border-white' : 'border-[#10141d]'
                  }`}>
                    <Plus className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                )}
              </div>

              {/* Download in progress badge */}
              {item.badge !== undefined && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-black font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {item.badge}
                </span>
              )}

              {isActive && (
                <span className="absolute -left-2 top-2.5 bottom-2.5 w-1 bg-indigo-400 rounded-r-full" />
              )}
            </button>
          );
        })}
      </div>
    </aside>
  );
};
