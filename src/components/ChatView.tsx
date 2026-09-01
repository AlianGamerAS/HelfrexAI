import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Square,
  Paperclip,
  Download,
  Eye,
  FileCode,
  X,
  FileText,
  Sparkles,
  Maximize2
} from 'lucide-react';
import { AIModel, ChatMessage, ChatSession, Language, AttachmentItem } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { HelfrexLogo } from './HelfrexLogo';

interface ChatViewProps {
  session: ChatSession;
  allModels: AIModel[];
  activeModel: AIModel;
  onSelectModel: (modelId: string) => void;
  onSendMessage: (text: string, attachments: AttachmentItem[]) => void;
  onStopGeneration: () => void;
  isGenerating: boolean;
  onSwitchToPreview: () => void;
  onSwitchToCodeStudio: () => void;
  lang: Language;
  theme: 'dark' | 'light';
}

export const ChatView: React.FC<ChatViewProps> = ({
  session,
  allModels,
  activeModel,
  onSelectModel,
  onSendMessage,
  onStopGeneration,
  isGenerating,
  onSwitchToPreview,
  onSwitchToCodeStudio,
  lang,
  theme
}) => {
  const t = TRANSLATIONS[lang];
  const [inputText, setInputText] = useState('');
  const [messageAttachments, setMessageAttachments] = useState<AttachmentItem[]>([]);
  const [fullscreenMedia, setFullscreenMedia] = useState<{ type: 'image' | 'video'; url: string; title?: string } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const downloadedOrApiModels = allModels.filter(m => m.isDownloaded || m.isCustomApi);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session.messages, isGenerating]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() && messageAttachments.length === 0) return;
    if (isGenerating) return;

    onSendMessage(inputText.trim(), messageAttachments);
    setInputText('');
    setMessageAttachments([]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newAttachments: AttachmentItem[] = Array.from(files).map((file: File, idx) => ({
      id: `att-${Date.now()}-${idx}`,
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      type: file.type || 'file',
      enabled: true
    }));

    setMessageAttachments(prev => [...prev, ...newAttachments]);
  };

  const isLight = theme === 'light';

  return (
    <div className={`flex-1 flex flex-col h-full overflow-hidden relative ${isLight ? 'bg-slate-100/60' : 'bg-[#0f121a]'}`}>
      {/* Top Model Selection Bar */}
      <div
        className={`h-12 px-4 border-b flex items-center justify-between shrink-0 select-none ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#151a26] border-slate-800'
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-semibold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
              {t.chat.switchModel}
            </span>
            <select
              value={activeModel.id}
              onChange={(e) => onSelectModel(e.target.value)}
              className={`text-xs rounded-lg px-2.5 py-1 outline-none font-medium focus:ring-1 focus:ring-indigo-500 cursor-pointer ${
                isLight
                  ? 'bg-slate-50 border border-slate-300 text-slate-900'
                  : 'bg-slate-800 border border-slate-700 text-white'
              }`}
            >
              {downloadedOrApiModels.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.classes.join(', ')})
                </option>
              ))}
            </select>
          </div>

          <span className={isLight ? 'text-slate-300' : 'text-slate-600'}>|</span>

          {/* Model Class Pills */}
          <div className="flex items-center gap-1.5">
            {activeModel.classes.map((cls) => (
              <span
                key={cls}
                className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                  isLight
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    : 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20'
                }`}
              >
                {cls}
              </span>
            ))}
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                isLight
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              }`}
            >
              {activeModel.quantization}
            </span>
          </div>
        </div>

        {/* Current Session Title */}
        <div className={`text-xs font-medium truncate max-w-[220px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
          <span>{session.title}</span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        {session.messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 max-w-xl mx-auto space-y-4">
            {/* Frozen Logo in Welcome Screen */}
            <div className="flex flex-col items-center space-y-3">
              <HelfrexLogo size="lg" showTag={false} showText={true} theme={theme} />
              <div className={`text-xs font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                {activeModel.name}
              </div>
              <p className={`text-xs max-w-md leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                {activeModel.description[lang] || activeModel.description.tr}
              </p>
            </div>

            {/* Display "Sizin Sıranız" (Your Turn) */}
            <div className="pt-6 flex flex-col items-center space-y-2">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600/10 border border-indigo-500/30 text-indigo-600 dark:text-indigo-300 font-bold text-sm shadow-sm animate-pulse">
                <Sparkles className="w-4 h-4" />
                <span>{t.yourTurn}</span>
              </div>
              <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                {t.chat.chatPlaceholder}
              </p>
            </div>
          </div>
        ) : (
          session.messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className={`flex items-center gap-2 mb-1 text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                <span className={`font-semibold ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                  {msg.sender === 'user' ? t.chat.user : msg.modelName || activeModel.name}
                </span>
                <span>•</span>
                <span>{msg.timestamp}</span>
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-3xl rounded-2xl p-4 text-xs leading-relaxed shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none shadow-md shadow-indigo-600/20'
                    : isLight
                    ? 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-none shadow-sm'
                    : 'bg-[#181f2f] text-slate-200 border border-slate-800 rounded-bl-none'
                }`}
              >
                {/* Single-Message Attachments indicator */}
                {msg.attachments && msg.attachments.length > 0 && (
                  <div className="mb-3 p-2 rounded-lg bg-black/10 dark:bg-black/20 border border-black/10 dark:border-white/10 flex flex-wrap gap-2">
                    <span className="text-[10px] font-semibold text-indigo-700 dark:text-indigo-300 w-full flex items-center gap-1">
                      <Paperclip className="w-3 h-3" /> {t.chat.singleMessageAttachment}
                    </span>
                    {msg.attachments.map(att => (
                      <span key={att.id} className="text-[10px] bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1">
                        <FileText className="w-3 h-3 text-cyan-600 dark:text-cyan-400" /> {att.name} ({att.size})
                      </span>
                    ))}
                  </div>
                )}

                {/* Text Content */}
                <div className="whitespace-pre-wrap font-sans text-sm">{msg.text}</div>

                {/* Generated Image Preview inside Chat with Download and Fullscreen */}
                {msg.type === 'image' && msg.mediaUrl && (
                  <div className="mt-3 relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 group max-w-lg">
                    <img
                      src={msg.mediaUrl}
                      alt="AI Render"
                      referrerPolicy="no-referrer"
                      onClick={() => setFullscreenMedia({ type: 'image', url: msg.mediaUrl! })}
                      className="w-full max-h-[380px] object-cover rounded-xl cursor-pointer hover:scale-[1.01] transition duration-200"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
                      <button
                        onClick={() => setFullscreenMedia({ type: 'image', url: msg.mediaUrl! })}
                        className="px-3 py-1.5 bg-slate-800/90 hover:bg-slate-700 text-white rounded-lg font-semibold text-xs flex items-center gap-1.5 border border-slate-600 shadow"
                      >
                        <Maximize2 className="w-3.5 h-3.5" /> {t.chat.fullscreen}
                      </button>
                      <a
                        href={msg.mediaUrl}
                        download="helfrex-image.jpg"
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold text-xs flex items-center gap-1.5 shadow"
                      >
                        <Download className="w-3.5 h-3.5" /> {t.chat.downloadMedia}
                      </a>
                    </div>
                  </div>
                )}

                {/* Generated Video Preview inside Chat with Download and Fullscreen */}
                {msg.type === 'video' && msg.mediaUrl && (
                  <div className="mt-3 space-y-2 max-w-lg">
                    <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-black relative group">
                      <video
                        src={msg.mediaUrl}
                        controls
                        className="w-full max-h-[340px] rounded-xl"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        onClick={() => setFullscreenMedia({ type: 'video', url: msg.mediaUrl! })}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                          isLight
                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                        }`}
                      >
                        <Maximize2 className="w-3.5 h-3.5" /> {t.chat.fullscreen}
                      </button>

                      <a
                        href={msg.mediaUrl}
                        download="helfrex-video.mp4"
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                      >
                        <Download className="w-3.5 h-3.5" /> {t.chat.downloadMedia}
                      </a>
                    </div>
                  </div>
                )}

                {/* Generated Code Actions inside Chat */}
                {msg.type === 'code' && msg.codeFiles && (
                  <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700/50 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-mono text-[11px] font-semibold">
                      <FileCode className="w-3.5 h-3.5" />
                      <span>{msg.codeFiles.length} {t.chat.filesGenerated}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={onSwitchToPreview}
                        className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[11px] font-medium flex items-center gap-1 shadow-sm transition"
                      >
                        <Eye className="w-3 h-3" /> {t.chat.previewInTab}
                      </button>
                      <button
                        onClick={onSwitchToCodeStudio}
                        className={`px-2.5 py-1 rounded text-[11px] font-medium flex items-center gap-1 transition ${
                          isLight
                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                        }`}
                      >
                        <FileCode className="w-3 h-3" /> {t.chat.codeFiles}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form & Attachments Area */}
      <div
        className={`p-3 border-t shrink-0 select-none ${
          isLight ? 'bg-white border-slate-200' : 'bg-[#121622] border-slate-800'
        }`}
      >
        {/* Attachment Pills Preview */}
        {messageAttachments.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2 px-1">
            {messageAttachments.map((att) => (
              <span
                key={att.id}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[11px] ${
                  isLight
                    ? 'bg-slate-100 text-indigo-700 border-slate-300'
                    : 'bg-slate-800 text-indigo-300 border-slate-700'
                }`}
              >
                <Paperclip className="w-3 h-3 text-indigo-500" />
                <span className="max-w-[140px] truncate">{att.name}</span>
                <button
                  type="button"
                  onClick={() => setMessageAttachments(prev => prev.filter(a => a.id !== att.id))}
                  className="hover:text-rose-500 ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        <form onSubmit={handleSend} className="flex items-end gap-2">
          {/* File Upload Hidden Input */}
          <input
            type="file"
            multiple
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />

          {/* Attach Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`p-2.5 rounded-xl border transition ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300 hover:text-white'
            }`}
            title={t.chat.attachFile}
          >
            <Paperclip className="w-4 h-4" />
          </button>

          {/* Text Input Area */}
          <div className="flex-1 relative">
            <textarea
              rows={1}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={t.chat.chatPlaceholder}
              className={`w-full py-2.5 px-3.5 rounded-xl border text-xs outline-none focus:ring-2 focus:ring-indigo-500 resize-none max-h-32 ${
                isLight
                  ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                  : 'bg-slate-900/90 border-slate-700 text-white placeholder-slate-500'
              }`}
            />
          </div>

          {/* Send / Stop Button */}
          {isGenerating ? (
            <button
              type="button"
              onClick={onStopGeneration}
              className="p-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl shadow-md transition flex items-center justify-center shrink-0"
              title={t.chat.stop}
            >
              <Square className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!inputText.trim() && messageAttachments.length === 0}
              className={`p-2.5 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 transition ${
                inputText.trim() || messageAttachments.length > 0
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md'
                  : 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
              }`}
              title={t.chat.send}
            >
              <Send className="w-4 h-4" />
            </button>
          )}
        </form>
      </div>

      {/* Fullscreen Media Lightbox Modal */}
      {fullscreenMedia && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4">
          {/* Close & Action Bar */}
          <div className="absolute top-4 right-4 flex items-center gap-3 z-50">
            <a
              href={fullscreenMedia.url}
              download={fullscreenMedia.type === 'video' ? 'helfrex-video.mp4' : 'helfrex-image.jpg'}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg"
            >
              <Download className="w-4 h-4" /> {t.chat.downloadMedia}
            </a>
            <button
              onClick={() => setFullscreenMedia(null)}
              className="p-2 bg-slate-800/90 hover:bg-slate-700 text-white rounded-xl border border-slate-600 transition"
              title={t.close}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="max-w-5xl max-h-[85vh] flex items-center justify-center">
            {fullscreenMedia.type === 'image' ? (
              <img
                src={fullscreenMedia.url}
                alt="Fullscreen Preview"
                referrerPolicy="no-referrer"
                className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl border border-slate-700"
              />
            ) : (
              <video
                src={fullscreenMedia.url}
                controls
                autoPlay
                className="max-h-[85vh] max-w-full rounded-2xl shadow-2xl bg-black border border-slate-700"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
