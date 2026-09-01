import React, { useRef } from 'react';
import {
  FolderPlus,
  FilePlus,
  Trash2,
  CheckCircle2,
  Circle,
  FileText,
  Folder,
  Layers,
  Sparkles
} from 'lucide-react';
import { AttachmentItem, Language } from '../types';
import { TRANSLATIONS } from '../utils/translations';

interface FilesContextViewProps {
  attachedFiles: AttachmentItem[];
  onAddFiles: (newFiles: AttachmentItem[]) => void;
  onRemoveFile: (fileId: string) => void;
  onToggleFile: (fileId: string) => void;
  sessionTitle: string;
  lang: Language;
  theme: 'dark' | 'light';
}

export const FilesContextView: React.FC<FilesContextViewProps> = ({
  attachedFiles,
  onAddFiles,
  onRemoveFile,
  onToggleFile,
  sessionTitle,
  lang,
  theme
}) => {
  const t = TRANSLATIONS[lang];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const isLight = theme === 'light';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newItems: AttachmentItem[] = Array.from(files).map((file: File, idx) => ({
      id: `ctx-file-${Date.now()}-${idx}`,
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      type: file.type || 'file',
      enabled: true
    }));

    onAddFiles(newItems);
  };

  const handleFolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newItems: AttachmentItem[] = Array.from(files).map((file: any, idx) => ({
      id: `ctx-folder-${Date.now()}-${idx}`,
      name: file.webkitRelativePath || file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      type: 'folder-file',
      enabled: true
    }));

    onAddFiles(newItems);
  };

  return (
    <div className={`flex-1 flex flex-col h-full overflow-hidden ${isLight ? 'bg-slate-100/70' : 'bg-[#0f121a]'}`}>
      {/* Top Header Bar */}
      <div
        className={`h-11 px-4 border-b flex items-center justify-between shrink-0 select-none ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#151a26] border-slate-800'
        }`}
      >
        <div className="flex items-center space-x-3">
          <span className={`text-xs font-bold flex items-center gap-1.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
            <FolderPlus className="w-4 h-4 text-indigo-500" />
            {t.contextFiles.title}
          </span>
          <span className={`text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Aktif Sohbet: <strong className={isLight ? 'text-slate-900' : 'text-slate-200'}>{sessionTitle}</strong>
          </span>
        </div>

        {/* Upload Buttons */}
        <div className="flex items-center space-x-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            className="hidden"
          />
          <input
            type="file"
            ref={folderInputRef}
            onChange={handleFolderChange}
            // @ts-ignore
            webkitdirectory="true"
            directory="true"
            multiple
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 border transition ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
          >
            <FilePlus className="w-3.5 h-3.5 text-indigo-500" /> {t.contextFiles.addFile}
          </button>

          <button
            onClick={() => folderInputRef.current?.click()}
            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
          >
            <Folder className="w-3.5 h-3.5" /> {t.contextFiles.addFolder}
          </button>
        </div>
      </div>

      {/* Main Files Area */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {/* Info Banner */}
        <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
          isLight ? 'bg-indigo-50 border-indigo-200 text-indigo-950' : 'bg-indigo-950/40 border-indigo-500/30'
        }`}>
          <Sparkles className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
          <div className="text-xs">
            <h4 className={`font-bold mb-0.5 ${isLight ? 'text-indigo-950' : 'text-white'}`}>Sohbet Özelinde Kalıcı Dosya & Klasör Bağlamı</h4>
            <p className={`leading-relaxed ${isLight ? 'text-indigo-800' : 'text-slate-300'}`}>
              {t.contextFiles.subtitle}
            </p>
          </div>
        </div>

        {/* Dropzone area */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition ${
            isLight
              ? 'bg-white border-slate-300 hover:border-indigo-500 text-slate-800'
              : 'border-slate-700 hover:border-indigo-500/70 bg-slate-800/20 hover:bg-slate-800/40'
          }`}
        >
          <div className={`w-12 h-12 rounded-xl mx-auto flex items-center justify-center mb-3 shadow ${
            isLight ? 'bg-slate-100 text-indigo-600' : 'bg-slate-800 text-indigo-400'
          }`}>
            <FolderPlus className="w-6 h-6" />
          </div>
          <p className={`text-xs font-semibold mb-1 ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>{t.contextFiles.dragDrop}</p>
          <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>Tüm kod, metin, markdown, konfigürasyon ve veri dosyaları desteklenir</p>
        </div>

        {/* List of Attached Files */}
        {attachedFiles.length === 0 ? (
          <div className={`py-8 text-center text-xs ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
            {t.contextFiles.noFilesYet}
          </div>
        ) : (
          <div className="space-y-2">
            <div className={`text-xs font-bold uppercase tracking-wider mb-2 flex items-center justify-between ${
              isLight ? 'text-slate-800' : 'text-slate-300'
            }`}>
              <span>Yüklenen Bağlam Dosyaları ({attachedFiles.length})</span>
              <span className={`text-[10px] font-normal ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                {attachedFiles.filter(f => f.enabled).length} Aktif
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {attachedFiles.map((file) => (
                <div
                  key={file.id}
                  className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                    file.enabled
                      ? isLight
                        ? 'bg-white border-slate-200 shadow-sm'
                        : 'bg-[#161c2b] border-slate-700/80 shadow-sm'
                      : isLight
                      ? 'bg-slate-100/60 border-slate-200 opacity-60'
                      : 'bg-slate-900/40 border-slate-800 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate flex-1 min-w-0 mr-2">
                    <button
                      onClick={() => onToggleFile(file.id)}
                      title={file.enabled ? 'Bağlamdan Devre Dışı Bırak' : 'Bağlama Dahil Et'}
                      className="shrink-0 text-slate-400 hover:text-indigo-500 transition"
                    >
                      {file.enabled ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-500/20" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-400" />
                      )}
                    </button>

                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isLight ? 'bg-slate-100' : 'bg-slate-800'
                    }`}>
                      {file.type === 'folder-file' ? (
                        <Folder className="w-4 h-4 text-amber-500" />
                      ) : (
                        <FileText className="w-4 h-4 text-cyan-500" />
                      )}
                    </div>

                    <div className="truncate">
                      <div className={`text-xs font-semibold truncate ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>{file.name}</div>
                      <div className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{file.size}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveFile(file.id)}
                    title={t.contextFiles.remove}
                    className={`p-1.5 rounded-lg transition shrink-0 ${
                      isLight ? 'text-slate-400 hover:text-rose-600 hover:bg-slate-100' : 'hover:text-rose-400 text-slate-500 hover:bg-slate-800'
                    }`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
