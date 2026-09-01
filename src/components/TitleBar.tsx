import React from 'react';
import { Minus, Square, X } from 'lucide-react';
import { Language } from '../types';
import { HelfrexLogo } from './HelfrexLogo';

interface TitleBarProps {
  lang: Language;
  theme: 'dark' | 'light';
}

export const TitleBar: React.FC<TitleBarProps> = ({
  theme
}) => {
  return (
    <header
      id="helfrex-titlebar"
      className={`h-9 flex items-center justify-between px-3 text-xs select-none border-b transition-colors ${
        theme === 'dark'
          ? 'bg-[#121620] border-slate-800 text-slate-300'
          : 'bg-[#f1f5f9] border-slate-200 text-slate-800'
      }`}
    >
      {/* App Branding with Navy Square Frost Logo & "HelfrexAI" Title */}
      <div className="flex items-center space-x-2">
        <HelfrexLogo size="sm" showTag={false} showText={false} theme={theme} />
        <span
          className={`font-mono font-bold tracking-tight text-[13px] ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}
        >
          Helfrex<span className="text-cyan-400">AI</span>
        </span>
      </div>

      {/* Center is clean */}
      <div className="flex-1" />

      {/* Windows Window Controls */}
      <div className="flex items-center -mr-1 text-slate-400">
        <button
          className="h-9 px-3 hover:bg-slate-700/40 hover:text-white dark:hover:text-white transition flex items-center justify-center"
          title="Minimize"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <button
          className="h-9 px-3 hover:bg-slate-700/40 hover:text-white dark:hover:text-white transition flex items-center justify-center"
          title="Maximize"
        >
          <Square className="w-3 h-3" />
        </button>
        <button
          className="h-9 px-3.5 hover:bg-red-600 hover:text-white transition flex items-center justify-center"
          title="Close"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
