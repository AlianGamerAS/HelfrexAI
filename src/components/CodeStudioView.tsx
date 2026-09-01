import React, { useState } from 'react';
import {
  Code,
  FileCode,
  Download,
  Save,
  Check,
  FolderArchive,
  FileText,
  Copy
} from 'lucide-react';
import JSZip from 'jszip';
import { CodeFile, Language } from '../types';
import { TRANSLATIONS } from '../utils/translations';

interface CodeStudioViewProps {
  files?: CodeFile[];
  onUpdateFileContent?: (fileName: string, newContent: string) => void;
  lang: Language;
  theme: 'dark' | 'light';
}

export const CodeStudioView: React.FC<CodeStudioViewProps> = ({
  files = [],
  onUpdateFileContent,
  lang,
  theme
}) => {
  const t = TRANSLATIONS[lang];
  const [selectedFileName, setSelectedFileName] = useState<string>(files[0]?.name || '');
  const [editorContent, setEditorContent] = useState<string>(files[0]?.content || '');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const currentFile = files.find(f => f.name === selectedFileName) || files[0];

  const handleSelectFile = (file: CodeFile) => {
    setSelectedFileName(file.name);
    setEditorContent(file.content);
    setHasUnsavedChanges(false);
  };

  const handleContentChange = (val: string) => {
    setEditorContent(val);
    setHasUnsavedChanges(true);
  };

  const handleSaveChanges = () => {
    if (onUpdateFileContent && currentFile) {
      onUpdateFileContent(currentFile.name, editorContent);
      setHasUnsavedChanges(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }
  };

  const handleDownloadSingleFile = () => {
    if (!currentFile) return;
    const blob = new Blob([editorContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentFile.name.split('/').pop() || 'code.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadAllZip = async () => {
    if (files.length === 0) return;
    const zip = new JSZip();
    files.forEach(f => {
      const content = f.name === currentFile?.name ? editorContent : f.content;
      zip.file(f.name, content);
    });

    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Helfrex_AI_Project.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(editorContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isLight = theme === 'light';

  if (files.length === 0) {
    return (
      <div className={`flex-1 flex flex-col items-center justify-center p-8 text-center select-none ${isLight ? 'bg-slate-100/70' : 'bg-[#0f121a]'}`}>
        <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center mb-4 ${
          isLight ? 'bg-white border-slate-300 text-slate-500' : 'bg-slate-800 border-slate-700 text-slate-500'
        }`}>
          <Code className="w-8 h-8" />
        </div>
        <h2 className={`text-lg font-bold mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>{t.codeStudio.title}</h2>
        <p className={`text-xs max-w-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{t.codeStudio.noFiles}</p>
      </div>
    );
  }

  const lineCount = (editorContent.match(/\n/g) || []).length + 1;

  return (
    <div className={`flex-1 flex flex-col h-full overflow-hidden ${isLight ? 'bg-slate-100/70' : 'bg-[#0f121a]'}`}>
      {/* Top Header Controls Bar */}
      <div
        className={`h-11 px-4 border-b flex items-center justify-between shrink-0 select-none ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#151a26] border-slate-800'
        }`}
      >
        <div className="flex items-center space-x-3">
          <span className={`text-xs font-bold flex items-center gap-1.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
            <Code className="w-4 h-4 text-indigo-500" />
            {t.codeStudio.title}
          </span>
          <span className={`text-[11px] font-mono ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            {currentFile?.name} ({lineCount} {t.codeStudio.lines})
          </span>
        </div>

        {/* Action Buttons: Save, Copy, Download File, Download Zip */}
        <div className="flex items-center space-x-2">
          {hasUnsavedChanges && (
            <button
              onClick={handleSaveChanges}
              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-sm transition"
            >
              <Save className="w-3.5 h-3.5" /> {t.codeStudio.saveChanges}
            </button>
          )}

          {saveSuccess && (
            <span className="text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Kaydedildi
            </span>
          )}

          <button
            onClick={handleCopyCode}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1 transition ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? t.chat.copied : t.chat.copyCode}</span>
          </button>

          <button
            onClick={handleDownloadSingleFile}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1 transition ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
            title={t.codeStudio.downloadCurrentFile}
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.codeStudio.downloadCurrentFile}</span>
          </button>

          <button
            onClick={handleDownloadAllZip}
            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow transition"
            title={t.codeStudio.downloadAllZip}
          >
            <FolderArchive className="w-3.5 h-3.5" />
            <span>{t.codeStudio.downloadAllZip}</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Area (Sidebar with File Tabs + Textarea Editor) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Project Files Explorer Sidebar */}
        <div
          className={`w-60 border-r flex flex-col select-none overflow-y-auto ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#121622] border-slate-800'
          }`}
        >
          <div className="p-3 border-b border-slate-200 dark:border-slate-800">
            <span className={`text-[11px] font-bold uppercase tracking-wider ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
              Proje Dosyaları ({files.length})
            </span>
          </div>

          <div className="p-2 space-y-1">
            {files.map((file) => {
              const isSelected = file.name === currentFile?.name;
              return (
                <button
                  key={file.name}
                  onClick={() => handleSelectFile(file)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono flex items-center gap-2 transition ${
                    isSelected
                      ? isLight
                        ? 'bg-indigo-100 text-indigo-900 border border-indigo-300 font-semibold'
                        : 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-medium'
                      : isLight
                      ? 'text-slate-700 hover:bg-slate-200'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                  }`}
                >
                  <FileCode className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500'}`} />
                  <span className="truncate">{file.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Code Editor Area */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <textarea
            value={editorContent}
            onChange={(e) => handleContentChange(e.target.value)}
            spellCheck={false}
            className={`w-full h-full p-4 font-mono text-xs leading-relaxed outline-none resize-none selection:bg-indigo-500 selection:text-white ${
              isLight
                ? 'bg-white text-slate-900'
                : 'bg-[#0a0d14] text-slate-200'
            }`}
          />
        </div>
      </div>
    </div>
  );
};
