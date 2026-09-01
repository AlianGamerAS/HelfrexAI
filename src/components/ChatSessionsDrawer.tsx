import React, { useState } from 'react';
import { Plus, MessageSquare, Edit2, Trash2, Check, X } from 'lucide-react';
import { ChatSession, Language } from '../types';
import { TRANSLATIONS } from '../utils/translations';

interface ChatSessionsDrawerProps {
  sessions: ChatSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onCreateSession: () => void;
  onRenameSession: (id: string, newTitle: string) => void;
  onDeleteSession: (id: string) => void;
  lang: Language;
  theme: 'dark' | 'light';
}

export const ChatSessionsDrawer: React.FC<ChatSessionsDrawerProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onCreateSession,
  onRenameSession,
  onDeleteSession,
  lang,
  theme
}) => {
  const t = TRANSLATIONS[lang];
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const handleStartEdit = (session: ChatSession, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(session.id);
    setEditTitle(session.title);
  };

  const handleSaveEdit = (id: string, e?: React.MouseEvent | React.FormEvent) => {
    if (e) e.stopPropagation();
    if (editTitle.trim()) {
      onRenameSession(id, editTitle.trim());
    }
    setEditingId(null);
  };

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(null);
  };

  const isLight = theme === 'light';

  return (
    <div
      className={`w-64 border-r flex flex-col h-full select-none transition-colors ${
        isLight
          ? 'bg-slate-50 border-slate-200 text-slate-800'
          : 'bg-[#131824] border-slate-800/80 text-slate-300'
      }`}
    >
      {/* Header & New Chat Button */}
      <div className="p-3 border-b border-slate-200 dark:border-slate-800/50">
        <button
          onClick={onCreateSession}
          className="w-full py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>{t.chat.newChat}</span>
        </button>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {sessions.map((session) => {
          const isActive = session.id === activeSessionId;
          const isEditing = editingId === session.id;

          return (
            <div
              key={session.id}
              onClick={() => onSelectSession(session.id)}
              className={`group flex items-center justify-between px-2.5 py-2 rounded-lg text-xs cursor-pointer transition-all ${
                isActive
                  ? isLight
                    ? 'bg-indigo-100 text-indigo-900 border border-indigo-300 font-semibold'
                    : 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-medium'
                  : isLight
                  ? 'hover:bg-slate-200/80 text-slate-700 hover:text-slate-900'
                  : 'hover:bg-slate-800/50 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2 truncate flex-1 min-w-0 mr-1">
                <MessageSquare
                  className={`w-3.5 h-3.5 shrink-0 ${
                    isActive ? (isLight ? 'text-indigo-600' : 'text-indigo-400') : (isLight ? 'text-slate-500' : 'text-slate-500')
                  }`}
                />

                {isEditing ? (
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveEdit(session.id);
                      if (e.key === 'Escape') setEditingId(null);
                    }}
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                    className={`px-1.5 py-0.5 rounded border text-xs w-full outline-none ${
                      isLight
                        ? 'bg-white text-slate-900 border-indigo-500'
                        : 'bg-slate-900 text-white border-indigo-500'
                    }`}
                  />
                ) : (
                  <span className="truncate">{session.title}</span>
                )}
              </div>

              {/* Actions (Rename & Delete - always available even for 1 session) */}
              <div className="flex items-center space-x-1 shrink-0">
                {isEditing ? (
                  <>
                    <button
                      onClick={(e) => handleSaveEdit(session.id, e)}
                      className="p-1 hover:text-emerald-500 text-slate-400 transition"
                      title={t.save}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="p-1 hover:text-rose-500 text-slate-400 transition"
                      title={t.close}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </>
                ) : (
                  <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-1 transition-opacity">
                    <button
                      onClick={(e) => handleStartEdit(session, e)}
                      className={`p-1 rounded transition ${
                        isLight ? 'hover:bg-slate-300 text-slate-600 hover:text-indigo-600' : 'hover:bg-slate-700/50 text-slate-400 hover:text-indigo-400'
                      }`}
                      title={t.edit}
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSession(session.id);
                      }}
                      className={`p-1 rounded transition ${
                        isLight ? 'hover:bg-slate-300 text-slate-600 hover:text-rose-600' : 'hover:bg-slate-700/50 text-slate-400 hover:text-rose-400'
                      }`}
                      title={t.delete}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
